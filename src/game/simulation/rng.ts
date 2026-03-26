export type GameRng = {
  nextFloat: () => number
  nextInt: (minInclusive: number, maxInclusive: number) => number
  pick: <T>(values: readonly T[]) => T | null
  weightedPick: <T>(values: ReadonlyArray<{ value: T; weight: number }>) => T | null
  getSeed: () => number
}

const normalizeSeed = (seed: number): number => {
  const normalized = Math.floor(Math.abs(seed)) >>> 0
  return normalized === 0 ? 0x6d2b79f5 : normalized
}

/** Mulberry32: fast deterministic PRNG suitable for gameplay simulation. */
const createMulberry32 = (seed: number): (() => number) => {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let value = Math.imul(t ^ (t >>> 15), t | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export const createSeededRng = (seed: number): GameRng => {
  const resolvedSeed = normalizeSeed(seed)
  const random = createMulberry32(resolvedSeed)

  const nextFloat = (): number => random()

  const nextInt = (minInclusive: number, maxInclusive: number): number => {
    const min = Math.ceil(Math.min(minInclusive, maxInclusive))
    const max = Math.floor(Math.max(minInclusive, maxInclusive))
    if (min === max) {
      return min
    }
    const span = max - min + 1
    return min + Math.floor(nextFloat() * span)
  }

  const pick = <T>(values: readonly T[]): T | null => {
    if (values.length === 0) {
      return null
    }
    return values[nextInt(0, values.length - 1)] ?? null
  }

  const weightedPick = <T>(values: ReadonlyArray<{ value: T; weight: number }>): T | null => {
    const normalized = values
      .map((entry) => ({ ...entry, weight: Number.isFinite(entry.weight) ? entry.weight : 0 }))
      .filter((entry) => entry.weight > 0)
    if (normalized.length === 0) {
      return null
    }
    const total = normalized.reduce((sum, entry) => sum + entry.weight, 0)
    let roll = nextFloat() * total
    for (const entry of normalized) {
      roll -= entry.weight
      if (roll <= 0) {
        return entry.value
      }
    }
    return normalized[normalized.length - 1]?.value ?? null
  }

  return {
    nextFloat,
    nextInt,
    pick,
    weightedPick,
    getSeed: () => resolvedSeed,
  }
}

export const deriveRunSeed = (parts: ReadonlyArray<number>): number => {
  let hash = 2166136261 >>> 0
  for (const part of parts) {
    hash ^= normalizeSeed(part)
    hash = Math.imul(hash, 16777619) >>> 0
  }
  return hash >>> 0
}
