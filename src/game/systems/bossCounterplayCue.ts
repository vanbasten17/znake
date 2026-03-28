import type { EliteMinibossPatternPhase } from '../core/types'

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
}): string =>
  `BOSS ${params.identityCueLabel} ${params.remixCueLabel}: ${BOSS_PHASE_COPY[params.phase]}`

export const formatEliteCounterplayCue = (phase: EliteMinibossPatternPhase): string =>
  `ELITE ${ELITE_PHASE_COPY[phase]}`
