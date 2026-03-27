import assert from 'node:assert/strict'
import test from 'node:test'
import { BALANCE } from '../src/game/core/balance'
import type { Enemy } from '../src/game/core/types'
import {
  createEnemyReadabilityState,
  createInitialRoleSpawnCadenceState,
  pickRoleByPolicy,
  summarizeActiveRoles,
} from '../src/game/simulation/enemyRoles'
import { createSeededRng } from '../src/game/simulation/rng'

const enemy = (role: Enemy['role']): Enemy => ({
  body: [{ x: 2, y: 2 }],
  dir: { x: 1, y: 0 },
  alive: true,
  kind: role === 'summoner' ? 'egg' : role === 'sniper' ? 'mirror' : 'normal',
  role,
  health: 1,
  dashCooldown: 0,
  hatchTurnsRemaining: 0,
  mirrorDelaySteps: 0,
  roleCooldown: 0,
  telegraph: null,
  readability: createEnemyReadabilityState(role),
})

test('role spawn policy enforces active caps deterministically', () => {
  const state = createInitialRoleSpawnCadenceState()
  const enemies = [enemy('sniper')]
  const picked = pickRoleByPolicy({
    rng: createSeededRng(11),
    enemies,
    state,
    policy: BALANCE.enemyRoles.spawnPolicy,
  })
  assert.notEqual(picked.role, 'sniper')
})

test('role spawn policy is stable for same seed and state', () => {
  const make = () =>
    pickRoleByPolicy({
      rng: createSeededRng(19),
      enemies: [enemy('blocker')],
      state: {
        spawnIndex: 4,
        lastSpawnIndexByRole: {
          charger: 3,
        },
      },
      policy: BALANCE.enemyRoles.spawnPolicy,
    })
  assert.deepEqual(make(), make())
})

test('role composition summary is concise and ordered', () => {
  const summary = summarizeActiveRoles([enemy('leech'), enemy('blocker'), enemy('blocker')])
  assert.equal(summary, 'blocker:2 | leech:1')
})
