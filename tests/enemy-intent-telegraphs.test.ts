import assert from 'node:assert/strict'
import test from 'node:test'
import type { Enemy } from '../src/game/core/types'
import { ENEMY_KIND } from '../src/game/shared/gameplayIds'
import { tickEnemy } from '../src/game/simulation/enemy'
import { createSeededRng } from '../src/game/simulation/rng'

const baseEnemy = (overrides: Partial<Enemy>): Enemy => ({
  id: 1,
  body: [{ x: 4, y: 4 }],
  dir: { x: 1, y: 0 },
  alive: true,
  kind: ENEMY_KIND.NORMAL,
  role: 'charger',
  health: 1,
  dashCooldown: 0,
  hatchTurnsRemaining: 0,
  mirrorDelaySteps: 0,
  roleCooldown: 0,
  telegraph: null,
  readability: {
    role: 'charger',
    telegraphActive: false,
    counterplayTicksRemaining: 0,
  },
  ...overrides,
})

test('ambusher intent exposes telegraph before dash execution', () => {
  const enemy = baseEnemy({
    kind: ENEMY_KIND.AMBUSHER,
    role: 'charger',
    body: [{ x: 4, y: 2 }],
    dir: { x: 0, y: 1 },
  })
  const result = tickEnemy(enemy, {
    playerHead: { x: 4, y: 8 },
    playerHeadHistory: [{ x: 4, y: 7 }],
    isWall: () => false,
    foodCell: null,
    rng: createSeededRng(42),
    ambusher: {
      dashMinLaneDistance: 3,
      dashChanceWhenAligned: 1,
      dashSteps: 2,
      dashCooldownTurns: 3,
      telegraphTicks: 2,
    },
    stalkerSpeedMultiplier: 1,
    egg: {
      hatchLength: 3,
    },
    roles: {
      sniper: {
        telegraphTicks: 2,
        cooldownTurns: 2,
        minLaneDistance: 3,
        chanceWhenAligned: 1,
      },
    },
  })

  assert.equal(result.enemy.telegraph?.kind, 'ambusher_dash')
  assert.equal(result.enemy.readability.telegraphActive, true)
  assert.equal((result.enemy.telegraph?.ticksRemaining ?? 0) >= 1, true)
})

test('egg enemy keeps telegraph state while hatch countdown is active', () => {
  const enemy = baseEnemy({
    kind: ENEMY_KIND.EGG,
    role: 'summoner',
    hatchTurnsRemaining: 2,
  })
  const result = tickEnemy(enemy, {
    playerHead: { x: 8, y: 8 },
    playerHeadHistory: [],
    isWall: () => false,
    foodCell: null,
    rng: createSeededRng(1),
    ambusher: {
      dashMinLaneDistance: 2,
      dashChanceWhenAligned: 1,
      dashSteps: 2,
      dashCooldownTurns: 2,
      telegraphTicks: 2,
    },
    stalkerSpeedMultiplier: 1,
    egg: {
      hatchLength: 3,
    },
    roles: {
      sniper: {
        telegraphTicks: 2,
        cooldownTurns: 2,
        minLaneDistance: 2,
        chanceWhenAligned: 1,
      },
    },
  })

  assert.equal(result.enemy.kind, ENEMY_KIND.EGG)
  assert.equal(result.hatched, false)
  assert.equal(result.enemy.readability.telegraphActive, true)
  assert.equal(result.enemy.readability.counterplayTicksRemaining, 1)
})
