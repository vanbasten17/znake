import { runCombatLoopStep } from './combatLoop'

export type SimulationStepOps = Parameters<typeof runCombatLoopStep>[0]

export const runSimulationStep = (ops: SimulationStepOps): void => {
  runCombatLoopStep(ops)
}
