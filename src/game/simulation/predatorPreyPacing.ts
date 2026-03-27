import type {
  PredatorPreyPacingGuardrailReason,
  PredatorPreyPacingPhase,
  PredatorPreyPacingTransitionReason,
} from '../core/types'

type PredatorPreyPacingConfig = {
  phaseTicks: {
    openingHunt: number
    hunt: number
    escape: number
    reset: number
  }
  guardrails: {
    maxConcurrentPressureSources: number
    minTicksBetweenPressureActions: number
    fallbackAction: 'defer'
  }
}

export type PredatorPreyPacingState = {
  phase: PredatorPreyPacingPhase
  phaseTicksRemaining: number
  lastTransitionReason: PredatorPreyPacingTransitionReason
}

export type PredatorPreyPacingAdvanceResult = {
  state: PredatorPreyPacingState
  transitioned: boolean
  previousPhase: PredatorPreyPacingPhase | null
  reason: PredatorPreyPacingTransitionReason | null
}

const getPhaseTicks = (
  phase: PredatorPreyPacingPhase,
  config: PredatorPreyPacingConfig,
): number => {
  if (phase === 'hunt') {
    return Math.max(1, Math.floor(config.phaseTicks.hunt))
  }
  if (phase === 'escape') {
    return Math.max(1, Math.floor(config.phaseTicks.escape))
  }
  return Math.max(1, Math.floor(config.phaseTicks.reset))
}

const transitionToPhase = (
  previousPhase: PredatorPreyPacingPhase,
  nextPhase: PredatorPreyPacingPhase,
  reason: PredatorPreyPacingTransitionReason,
  config: PredatorPreyPacingConfig,
): PredatorPreyPacingAdvanceResult => ({
  state: {
    phase: nextPhase,
    phaseTicksRemaining: getPhaseTicks(nextPhase, config),
    lastTransitionReason: reason,
  },
  transitioned: previousPhase !== nextPhase,
  previousPhase,
  reason,
})

export const createInitialPredatorPreyPacingState = (
  config: PredatorPreyPacingConfig,
): PredatorPreyPacingState => ({
  phase: 'hunt',
  phaseTicksRemaining: Math.max(1, Math.floor(config.phaseTicks.openingHunt)),
  lastTransitionReason: 'encounter_start',
})

export const advancePredatorPreyPacingState = (params: {
  state: PredatorPreyPacingState
  config: PredatorPreyPacingConfig
  guardrailIntervened: boolean
}): PredatorPreyPacingAdvanceResult => {
  if (params.guardrailIntervened && params.state.phase !== 'escape') {
    return transitionToPhase(params.state.phase, 'escape', 'overlap_guardrail', params.config)
  }

  const remaining = Math.max(0, params.state.phaseTicksRemaining - 1)
  if (remaining > 0) {
    return {
      state: {
        ...params.state,
        phaseTicksRemaining: remaining,
      },
      transitioned: false,
      previousPhase: null,
      reason: null,
    }
  }

  if (params.state.phase === 'hunt') {
    return transitionToPhase('hunt', 'escape', 'window_elapsed', params.config)
  }
  if (params.state.phase === 'escape') {
    return transitionToPhase('escape', 'reset', 'window_elapsed', params.config)
  }
  return transitionToPhase('reset', 'hunt', 'window_elapsed', params.config)
}

export const shouldAllowPredatorPreyPressureAction = (params: {
  state: PredatorPreyPacingState
  currentPressureSources: number
  ticksSinceLastPressureAction: number
  config: PredatorPreyPacingConfig
}): { allow: true; reason: null } | { allow: false; reason: PredatorPreyPacingGuardrailReason } => {
  if (params.state.phase !== 'hunt') {
    return { allow: false, reason: 'phase_escape_window' }
  }
  if (
    params.currentPressureSources >=
    Math.max(1, Math.floor(params.config.guardrails.maxConcurrentPressureSources))
  ) {
    return { allow: false, reason: 'overlap_budget_exceeded' }
  }
  if (
    params.ticksSinceLastPressureAction <
    Math.max(0, Math.floor(params.config.guardrails.minTicksBetweenPressureActions))
  ) {
    return { allow: false, reason: 'cadence_gap_enforced' }
  }
  return { allow: true, reason: null }
}
