import assert from 'node:assert/strict'
import test from 'node:test'
import { BALANCE } from '../src/game/core/balance'
import {
  advancePredatorPreyPacingState,
  createInitialPredatorPreyPacingState,
  shouldAllowPredatorPreyPressureAction,
} from '../src/game/simulation/predatorPreyPacing'

test('predator-prey pacing transitions are deterministic for equivalent inputs', () => {
  const run = () => {
    let state = createInitialPredatorPreyPacingState(BALANCE.predatorPreyPacing)
    const timeline: string[] = []
    for (let tick = 0; tick < 12; tick += 1) {
      const next = advancePredatorPreyPacingState({
        state,
        config: BALANCE.predatorPreyPacing,
        guardrailIntervened: tick === 3,
      })
      state = next.state
      timeline.push(`${state.phase}:${state.phaseTicksRemaining}:${state.lastTransitionReason}`)
    }
    return timeline
  }

  assert.deepEqual(run(), run())
})

test('guardrail intervention transitions pacing to escape window', () => {
  const initial = createInitialPredatorPreyPacingState(BALANCE.predatorPreyPacing)
  const next = advancePredatorPreyPacingState({
    state: initial,
    config: BALANCE.predatorPreyPacing,
    guardrailIntervened: true,
  })
  assert.equal(next.transitioned, true)
  assert.equal(next.state.phase, 'escape')
  assert.equal(next.reason, 'overlap_guardrail')
})

test('pressure action guardrail blocks outside hunt window and on cadence overlap', () => {
  const initial = createInitialPredatorPreyPacingState(BALANCE.predatorPreyPacing)
  const blockedByCadence = shouldAllowPredatorPreyPressureAction({
    state: initial,
    currentPressureSources: 0,
    ticksSinceLastPressureAction: 0,
    config: BALANCE.predatorPreyPacing,
  })
  assert.deepEqual(blockedByCadence, { allow: false, reason: 'cadence_gap_enforced' })

  const escapeState = {
    ...initial,
    phase: 'escape' as const,
  }
  const blockedByPhase = shouldAllowPredatorPreyPressureAction({
    state: escapeState,
    currentPressureSources: 0,
    ticksSinceLastPressureAction: 99,
    config: BALANCE.predatorPreyPacing,
  })
  assert.deepEqual(blockedByPhase, { allow: false, reason: 'phase_escape_window' })
})
