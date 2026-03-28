type CombatLoopOps = {
  updateEnemyMovement: () => void
  ensureObjectiveEnemyAvailability: () => void
  ensureRoomObjectiveAvailability: () => void
  updateVoidRift: () => void
  updatePortalFlow: () => void
  updateCorePressure: () => void
  updateBossSupport: () => void
  updateVenomState: () => void
  updateBodyEconomyState: () => void
  updateContactGrace: () => void
  updateRegen: () => void
  updateSnakeMovement: () => void
  updateMagnetFood: () => void
  updateParticles: () => void
}

export const runCombatLoopStep = (ops: CombatLoopOps): void => {
  ops.updateEnemyMovement()
  ops.ensureObjectiveEnemyAvailability()
  ops.ensureRoomObjectiveAvailability()
  ops.updateVoidRift()
  ops.updatePortalFlow()
  ops.updateCorePressure()
  ops.updateBossSupport()
  ops.updateVenomState()
  ops.updateBodyEconomyState()
  ops.updateContactGrace()
  ops.updateRegen()
  ops.updateSnakeMovement()
  ops.updateMagnetFood()
  ops.updateParticles()
}
