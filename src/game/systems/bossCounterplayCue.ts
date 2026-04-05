import type { EliteMinibossPatternPhase } from '../core/types'

export type BossAttackClass = 'dash' | 'slam' | 'sweep'

const ATTACK_CLASS_LEAD_TIME_MS: Record<BossAttackClass, number> = {
  dash: 420,
  slam: 560,
  sweep: 500,
}

const BOSS_PHASE_COPY: Record<EliteMinibossPatternPhase, string> = {
  telegraph: 'WINDOW: BAIT LINE',
  commit: 'PUNISH LOOP: SIDESTEP THEN COLLAPSE',
  recovery: 'PUNISH LOOP: CHASE RESET',
}

const ELITE_PHASE_COPY: Record<EliteMinibossPatternPhase, string> = {
  telegraph: 'WINDOW: TELEGRAPH',
  commit: 'PUNISH LOOP: COMMIT',
  recovery: 'PUNISH LOOP: RECOVERY',
}

export const formatBossCounterplayCue = (params: {
  phase: EliteMinibossPatternPhase
  identityCueLabel: string
  remixCueLabel: string
  attackClass?: BossAttackClass
}): string =>
  `BOSS ${params.identityCueLabel} ${params.remixCueLabel}: ${BOSS_PHASE_COPY[params.phase]}`

export const resolveBossTelegraphContract = (params: {
  attackClass: BossAttackClass
  highContrastEnabled: boolean
}): {
  leadTimeMs: number
  minContrastRatio: number
} => ({
  leadTimeMs: ATTACK_CLASS_LEAD_TIME_MS[params.attackClass],
  minContrastRatio: params.highContrastEnabled ? 4.5 : 3.8,
})

export const formatEliteCounterplayCue = (phase: EliteMinibossPatternPhase): string =>
  `ELITE ${ELITE_PHASE_COPY[phase]}`
