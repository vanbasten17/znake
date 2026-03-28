export type ParticleQualityTierId = 'balanced' | 'reduced'

export type ParticleBudgetProfile = {
  id: ParticleQualityTierId
  densityScale: number
  minBurst: number
  maxSpawnPerFrame: number
  maxActive: number
}

export type ResolveParticleSpawnInput = {
  requestedCount: number
  activeCount: number
  spawnedThisFrame: number
  profile: ParticleBudgetProfile
}

export type ResolveParticleSpawnResult = {
  emitCount: number
  nextSpawnedThisFrame: number
}

const PARTICLE_BUDGET_PROFILES: Record<ParticleQualityTierId, ParticleBudgetProfile> = {
  balanced: {
    id: 'balanced',
    densityScale: 1,
    minBurst: 1,
    maxSpawnPerFrame: 72,
    maxActive: 420,
  },
  reduced: {
    id: 'reduced',
    densityScale: 0.35,
    minBurst: 1,
    maxSpawnPerFrame: 24,
    maxActive: 140,
  },
}

export const resolveParticleBudgetProfile = (reducedEffects: boolean): ParticleBudgetProfile =>
  reducedEffects ? PARTICLE_BUDGET_PROFILES.reduced : PARTICLE_BUDGET_PROFILES.balanced

export const resolveParticleSpawnBudget = (
  input: ResolveParticleSpawnInput,
): ResolveParticleSpawnResult => {
  const requestedCount = Math.max(0, Math.floor(input.requestedCount))
  if (requestedCount <= 0) {
    return {
      emitCount: 0,
      nextSpawnedThisFrame: Math.max(0, Math.floor(input.spawnedThisFrame)),
    }
  }

  const activeCount = Math.max(0, Math.floor(input.activeCount))
  const spawnedThisFrame = Math.max(0, Math.floor(input.spawnedThisFrame))
  const desiredCount = Math.max(
    input.profile.minBurst,
    Math.ceil(requestedCount * input.profile.densityScale),
  )
  const remainingFrameBudget = Math.max(0, input.profile.maxSpawnPerFrame - spawnedThisFrame)
  const remainingActiveBudget = Math.max(0, input.profile.maxActive - activeCount)
  const emitCount = Math.min(desiredCount, remainingFrameBudget, remainingActiveBudget)

  return {
    emitCount,
    nextSpawnedThisFrame: spawnedThisFrame + emitCount,
  }
}
