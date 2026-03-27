import { BALANCE } from '../core/balance'
import type {
  BiomeRuleBlockedCandidate,
  BiomeRuleDefinition,
  BiomeRuleFallbackAction,
  BiomeRuleGuardrailReason,
  BiomeRuleResolution,
  BiomeRuleRuntime,
  ChallengeMutatorDomain,
  RoomObjectiveKind,
} from '../core/types'

type BiomeRulePreviewState = {
  pressureCost: number
  bodySpendMinLength: number
}

type ResolveBiomeRuleActivationParams = {
  biomeId: BiomeRuleDefinition['biomeId']
  roomObjectiveKind: RoomObjectiveKind | null
  mutatorDomains: ReadonlyArray<ChallengeMutatorDomain>
  bodySpendMinLength: number
}

type ApplyBiomeRulesToRuntimeParams = {
  enemyInterval: number
  saferRouteEnemyDelta: number
  riskierRouteEnemyDelta: number
  bodySpendMinLength: number
  activeRules: ReadonlyArray<BiomeRuleRuntime>
}

type ApplyBiomeRulesToRuntimeResult = {
  enemyInterval: number
  saferRouteEnemyDelta: number
  riskierRouteEnemyDelta: number
  bodySpendMinLength: number
}

const findRuleById = (id: BiomeRuleDefinition['id']): BiomeRuleDefinition | null =>
  BALANCE.biomeRules.catalog.find((rule) => rule.id === id) ?? null

const toRuntime = (rule: BiomeRuleDefinition): BiomeRuleRuntime => ({
  id: rule.id,
  biomeId: rule.biomeId,
  domain: rule.domain,
  label: rule.label,
  summary: rule.summary,
  tacticalTag: rule.tacticalTag,
  effects: { ...rule.effects },
})

const hasMutatorDomainConflict = (
  blockedMutatorDomains: ReadonlyArray<ChallengeMutatorDomain> | undefined,
  activeMutatorDomains: ReadonlyArray<ChallengeMutatorDomain>,
): boolean => {
  if (!blockedMutatorDomains || blockedMutatorDomains.length <= 0) {
    return false
  }
  return blockedMutatorDomains.some((domain) => activeMutatorDomains.includes(domain))
}

const validateRule = (
  rule: BiomeRuleDefinition,
  preview: BiomeRulePreviewState,
  params: ResolveBiomeRuleActivationParams,
): BiomeRuleGuardrailReason | null => {
  if (params.roomObjectiveKind && rule.blockedObjectiveKinds?.includes(params.roomObjectiveKind)) {
    return 'objective_conflict'
  }
  if (hasMutatorDomainConflict(rule.blockedMutatorDomains, params.mutatorDomains)) {
    return 'mutator_conflict'
  }
  const nextBodySpendMinLength =
    preview.bodySpendMinLength + Math.floor(rule.effects.bodySpendMinLengthDelta ?? 0)
  if (
    typeof rule.maxBodySpendMinLength === 'number' &&
    nextBodySpendMinLength > rule.maxBodySpendMinLength
  ) {
    return 'body_economy_conflict'
  }
  const nextPressureCost = preview.pressureCost + Math.max(0, Math.floor(rule.pressureCost))
  if (nextPressureCost > BALANCE.biomeRules.guardrails.pressureBudgetMax) {
    return 'pressure_budget'
  }
  return null
}

const applyRuleToPreview = (
  preview: BiomeRulePreviewState,
  rule: BiomeRuleDefinition,
): BiomeRulePreviewState => ({
  pressureCost: preview.pressureCost + Math.max(0, Math.floor(rule.pressureCost)),
  bodySpendMinLength:
    preview.bodySpendMinLength + Math.floor(rule.effects.bodySpendMinLengthDelta ?? 0),
})

const resolveFallbackRule = (
  candidate: BiomeRuleDefinition,
  action: BiomeRuleFallbackAction,
): BiomeRuleDefinition | null => {
  if (action === 'downgrade' && candidate.downgradeToRuleId) {
    return findRuleById(candidate.downgradeToRuleId)
  }
  if (action === 'replace' && candidate.replaceWithRuleId) {
    return findRuleById(candidate.replaceWithRuleId)
  }
  return null
}

export const resolveBiomeRuleActivation = (
  params: ResolveBiomeRuleActivationParams,
): BiomeRuleResolution => {
  const candidates = BALANCE.biomeRules.catalog.filter((rule) => rule.biomeId === params.biomeId)
  const maxActive = Math.max(0, Math.floor(BALANCE.biomeRules.maxActive))
  const blocked: BiomeRuleBlockedCandidate[] = []
  const fallbackApplied: BiomeRuleResolution['fallbackApplied'] = []
  const active: BiomeRuleRuntime[] = []
  let preview: BiomeRulePreviewState = {
    pressureCost: 0,
    bodySpendMinLength: params.bodySpendMinLength,
  }

  for (const candidate of candidates) {
    if (active.length >= maxActive) {
      break
    }
    const blockedReason = validateRule(candidate, preview, params)
    if (!blockedReason) {
      active.push(toRuntime(candidate))
      preview = applyRuleToPreview(preview, candidate)
      continue
    }

    blocked.push({ id: candidate.id, reason: blockedReason })

    let applied = false
    for (const action of BALANCE.biomeRules.guardrails.fallbackPriority) {
      if (action === 'defer') {
        fallbackApplied.push({
          candidateId: candidate.id,
          action,
          reason: blockedReason,
          appliedRuleId: null,
        })
        applied = true
        break
      }
      const fallbackRule = resolveFallbackRule(candidate, action)
      if (!fallbackRule) {
        continue
      }
      const fallbackBlocked = validateRule(fallbackRule, preview, params)
      if (fallbackBlocked) {
        continue
      }
      active.push(toRuntime(fallbackRule))
      preview = applyRuleToPreview(preview, fallbackRule)
      fallbackApplied.push({
        candidateId: candidate.id,
        action,
        reason: blockedReason,
        appliedRuleId: fallbackRule.id,
      })
      applied = true
      break
    }

    if (!applied) {
      fallbackApplied.push({
        candidateId: candidate.id,
        action: 'defer',
        reason: blockedReason,
        appliedRuleId: null,
      })
    }
  }

  return {
    biomeId: params.biomeId,
    active,
    blocked,
    fallbackApplied,
  }
}

export const applyBiomeRulesToRuntime = (
  params: ApplyBiomeRulesToRuntimeParams,
): ApplyBiomeRulesToRuntimeResult => {
  let enemyInterval = params.enemyInterval
  let saferRouteEnemyDelta = params.saferRouteEnemyDelta
  let riskierRouteEnemyDelta = params.riskierRouteEnemyDelta
  let bodySpendMinLength = params.bodySpendMinLength

  for (const rule of params.activeRules) {
    enemyInterval *= rule.effects.enemyIntervalMultiplier ?? 1
    saferRouteEnemyDelta += Math.floor(rule.effects.saferRouteEnemyDelta ?? 0)
    riskierRouteEnemyDelta += Math.floor(rule.effects.riskierRouteEnemyDelta ?? 0)
    bodySpendMinLength += Math.floor(rule.effects.bodySpendMinLengthDelta ?? 0)
  }

  return {
    enemyInterval: Math.max(BALANCE.challengeMutators.guardrails.minEnemyIntervalMs, enemyInterval),
    saferRouteEnemyDelta,
    riskierRouteEnemyDelta,
    bodySpendMinLength: Math.max(1, bodySpendMinLength),
  }
}

export const getBiomeRuleHudLabels = (activeRules: ReadonlyArray<BiomeRuleRuntime>): string[] => {
  const maxShown = Math.max(0, Math.floor(BALANCE.biomeRules.readability.maxShownInHud))
  return activeRules.slice(0, maxShown).map((rule) => rule.label)
}
