import type { ContentPackDefinition } from './types'

const CONTENT_PACK_SCHEMA_VERSION = 1

export type ContentPackValidationIssue = {
  field: keyof ContentPackDefinition
  reason: string
}

export type ContentPackValidationResult = {
  ok: boolean
  issues: ContentPackValidationIssue[]
}

export const BASE_CONTENT_PACK: ContentPackDefinition = {
  schemaVersion: CONTENT_PACK_SCHEMA_VERSION,
  id: 'base',
  label: 'Base Content Pack',
  enemySetIds: ['core-floor-set', 'elite-floor-set', 'boss-floor-set'],
  eventPoolIds: ['core-event-pool'],
  mutatorBundleIds: ['core-mutator-bundle'],
  rewardSetIds: ['core-reward-set'],
}

const validateStringArray = (
  field: keyof ContentPackDefinition,
  value: unknown,
  issues: ContentPackValidationIssue[],
): void => {
  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== 'string' || entry.length <= 0)
  ) {
    issues.push({ field, reason: 'must be a non-empty string array' })
  }
}

export const validateContentPackDefinition = (value: unknown): ContentPackValidationResult => {
  const issues: ContentPackValidationIssue[] = []
  if (!value || typeof value !== 'object') {
    return {
      ok: false,
      issues: [{ field: 'id', reason: 'must be an object payload' }],
    }
  }
  const candidate = value as Partial<ContentPackDefinition>
  if (candidate.schemaVersion !== CONTENT_PACK_SCHEMA_VERSION) {
    issues.push({
      field: 'schemaVersion',
      reason: `must equal ${CONTENT_PACK_SCHEMA_VERSION}`,
    })
  }
  if (typeof candidate.id !== 'string' || candidate.id.length <= 0) {
    issues.push({ field: 'id', reason: 'must be a non-empty string' })
  }
  if (typeof candidate.label !== 'string' || candidate.label.length <= 0) {
    issues.push({ field: 'label', reason: 'must be a non-empty string' })
  }
  validateStringArray('enemySetIds', candidate.enemySetIds, issues)
  validateStringArray('eventPoolIds', candidate.eventPoolIds, issues)
  validateStringArray('mutatorBundleIds', candidate.mutatorBundleIds, issues)
  validateStringArray('rewardSetIds', candidate.rewardSetIds, issues)
  return {
    ok: issues.length <= 0,
    issues,
  }
}

export const resolveContentPack = (
  requestedPackId: string | null | undefined,
): { pack: ContentPackDefinition; fallbackApplied: boolean } => {
  if (requestedPackId === BASE_CONTENT_PACK.id) {
    return { pack: BASE_CONTENT_PACK, fallbackApplied: false }
  }
  return { pack: BASE_CONTENT_PACK, fallbackApplied: requestedPackId != null }
}
