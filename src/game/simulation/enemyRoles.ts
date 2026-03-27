import type { Enemy, EnemyKind, EnemyReadabilityState, EnemyRole } from '../core/types'
import type { GameRng } from './rng'

export type RoleSpawnPolicy = {
  weights: Record<EnemyRole, number>
  maxActiveByRole: Record<EnemyRole, number>
  minSpawnGapByRole: Record<EnemyRole, number>
  fallbackRole: EnemyRole
}

export type RoleSpawnCadenceState = {
  spawnIndex: number
  lastSpawnIndexByRole: Partial<Record<EnemyRole, number>>
}

export const createInitialRoleSpawnCadenceState = (): RoleSpawnCadenceState => ({
  spawnIndex: 0,
  lastSpawnIndexByRole: {},
})

export const createEnemyReadabilityState = (role: EnemyRole): EnemyReadabilityState => ({
  role,
  telegraphActive: false,
  counterplayTicksRemaining: 0,
})

export const getEnemyRoleFromKind = (
  kind: EnemyKind,
  byKind: Record<EnemyKind, EnemyRole>,
): EnemyRole => byKind[kind]

const countByRole = (enemies: ReadonlyArray<Enemy>): Record<EnemyRole, number> => {
  const counts: Record<EnemyRole, number> = {
    sniper: 0,
    blocker: 0,
    summoner: 0,
    charger: 0,
    leech: 0,
  }
  for (const enemy of enemies) {
    if (!enemy.alive) {
      continue
    }
    counts[enemy.role] += 1
  }
  return counts
}

export const pickRoleByPolicy = (params: {
  rng: GameRng
  enemies: ReadonlyArray<Enemy>
  state: RoleSpawnCadenceState
  policy: RoleSpawnPolicy
}): { role: EnemyRole; state: RoleSpawnCadenceState } => {
  const counts = countByRole(params.enemies)
  const spawnIndex = params.state.spawnIndex + 1
  const allowed: Array<{ value: EnemyRole; weight: number }> = []
  const roles: EnemyRole[] = ['sniper', 'blocker', 'summoner', 'charger', 'leech']
  for (const role of roles) {
    if (counts[role] >= params.policy.maxActiveByRole[role]) {
      continue
    }
    const last = params.state.lastSpawnIndexByRole[role]
    const gap = params.policy.minSpawnGapByRole[role]
    if (last !== undefined && spawnIndex - last <= gap) {
      continue
    }
    const weight = params.policy.weights[role]
    if (weight > 0) {
      allowed.push({ value: role, weight })
    }
  }

  const role = params.rng.weightedPick(allowed) ?? params.policy.fallbackRole
  return {
    role,
    state: {
      spawnIndex,
      lastSpawnIndexByRole: {
        ...params.state.lastSpawnIndexByRole,
        [role]: spawnIndex,
      },
    },
  }
}

export const summarizeActiveRoles = (enemies: ReadonlyArray<Enemy>): string => {
  const counts = countByRole(enemies)
  const ordered: EnemyRole[] = ['sniper', 'blocker', 'summoner', 'charger', 'leech']
  const parts = ordered.filter((role) => counts[role] > 0).map((role) => `${role}:${counts[role]}`)
  return parts.join(' | ')
}
