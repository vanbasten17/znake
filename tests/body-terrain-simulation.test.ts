import assert from 'node:assert/strict'
import test from 'node:test'
import { BALANCE } from '../src/game/core/balance'
import type { Enemy } from '../src/game/core/types'
import {
  shouldBlockBodySpendForTerrain,
  summarizeBodyTerrain,
} from '../src/game/simulation/bodyTerrain'

const enemy = (x: number, y: number): Enemy => ({
  id: 1,
  body: [{ x, y }],
  dir: { x: 1, y: 0 },
  alive: true,
  kind: 'normal',
  role: 'blocker',
  health: 1,
  dashCooldown: 0,
  hatchTurnsRemaining: 0,
  mirrorDelaySteps: 0,
  roleCooldown: 0,
  telegraph: null,
  readability: {
    role: 'blocker',
    telegraphActive: false,
    counterplayTicksRemaining: 0,
  },
})

test('body terrain snapshot is deterministic for equivalent state', () => {
  const run = () =>
    summarizeBodyTerrain({
      head: { x: 5, y: 5 },
      snake: [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
        { x: 3, y: 6 },
      ],
      enemies: [enemy(7, 5)],
      isWall: (x, y) => x < 0 || y < 0 || x > 20 || y > 20,
      config: BALANCE.bodyTerrain,
    })
  assert.deepEqual(run(), run())
})

test('body terrain guardrail blocks spend when pressure is active and safe pockets are low', () => {
  const blocked = shouldBlockBodySpendForTerrain({
    snapshot: {
      laneControlSegments: 1,
      zoneControlSegments: 1,
      safePocketNeighbors: 1,
      trapRisk: true,
    },
    activePressureSources: 2,
    config: BALANCE.bodyTerrain,
  })
  assert.deepEqual(blocked, { allow: false, reason: 'low_safe_pocket_under_pressure' })
})

test('body terrain guardrail allows spend in recoverable state', () => {
  const allowed = shouldBlockBodySpendForTerrain({
    snapshot: {
      laneControlSegments: 3,
      zoneControlSegments: 2,
      safePocketNeighbors: 3,
      trapRisk: false,
    },
    activePressureSources: 2,
    config: BALANCE.bodyTerrain,
  })
  assert.deepEqual(allowed, { allow: true, reason: null })
})
