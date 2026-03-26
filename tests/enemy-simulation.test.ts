import assert from 'node:assert/strict'
import test from 'node:test'
import type { Enemy } from '../src/game/core/types'
import {
  applyStalkerExtraStep,
  detectEnemyCollision,
  resolveEnemyCollisionDamage,
  tickEnemy,
} from '../src/game/simulation/enemy'
import { createSeededRng } from '../src/game/simulation/rng'

const baseEnemy = (partial?: Partial<Enemy>): Enemy => ({
  body: [{ x: 5, y: 5 }],
  dir: { x: 1, y: 0 },
  alive: true,
  kind: 'normal',
  health: 1,
  dashCooldown: 0,
  hatchTurnsRemaining: 0,
  mirrorDelaySteps: 0,
  telegraph: null,
  ...partial,
})

test('tickEnemy moves toward player in deterministic way', () => {
  const enemy = baseEnemy({
    body: [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ],
  })
  const result = tickEnemy(enemy, {
    playerHead: { x: 8, y: 5 },
    playerHeadHistory: [],
    isWall: () => false,
    foodCell: null,
    rng: createSeededRng(111),
    ambusher: {
      dashMinLaneDistance: 3,
      dashChanceWhenAligned: 0.5,
      dashSteps: 2,
      dashCooldownTurns: 2,
      telegraphTicks: 2,
    },
    stalkerSpeedMultiplier: 0.8,
    egg: {
      hatchLength: 3,
    },
  })
  assert.equal(result.enemy.body[0]?.x, 6)
  assert.equal(result.enemy.body[0]?.y, 5)
})

test('egg enemy hatches into normal enemy with configured length', () => {
  const eggEnemy = baseEnemy({
    kind: 'egg',
    body: [{ x: 7, y: 4 }],
    hatchTurnsRemaining: 1,
  })
  const result = tickEnemy(eggEnemy, {
    playerHead: { x: 10, y: 10 },
    playerHeadHistory: [],
    isWall: () => false,
    foodCell: null,
    rng: createSeededRng(42),
    ambusher: {
      dashMinLaneDistance: 3,
      dashChanceWhenAligned: 0.5,
      dashSteps: 2,
      dashCooldownTurns: 2,
      telegraphTicks: 2,
    },
    stalkerSpeedMultiplier: 0.8,
    egg: {
      hatchLength: 4,
    },
  })
  assert.equal(result.hatched, true)
  assert.equal(result.enemy.kind, 'normal')
  assert.equal(result.enemy.body.length, 4)
})

test('detectEnemyCollision distinguishes head and body', () => {
  const enemies: Enemy[] = [
    baseEnemy({
      body: [
        { x: 3, y: 3 },
        { x: 2, y: 3 },
      ],
    }),
    baseEnemy({
      body: [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
      ],
    }),
  ]
  const headHit = detectEnemyCollision({ x: 3, y: 3 }, enemies)
  assert.deepEqual(headHit, { enemyIndex: 0, part: 'head' })

  const bodyHit = detectEnemyCollision({ x: 10, y: 11 }, enemies)
  assert.deepEqual(bodyHit, { enemyIndex: 1, part: 'body' })
})

test('ambusher telegraphs before executing dash', () => {
  const enemy = baseEnemy({
    kind: 'ambusher',
    body: [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ],
    dir: { x: 1, y: 0 },
  })
  const telegraph = tickEnemy(enemy, {
    playerHead: { x: 5, y: 10 },
    playerHeadHistory: [],
    isWall: () => false,
    foodCell: null,
    rng: createSeededRng(2),
    ambusher: {
      dashMinLaneDistance: 2,
      dashChanceWhenAligned: 1,
      dashSteps: 2,
      dashCooldownTurns: 3,
      telegraphTicks: 2,
    },
    stalkerSpeedMultiplier: 0.8,
    egg: {
      hatchLength: 3,
    },
  })
  assert.equal(telegraph.enemy.body[0]?.x, 5)
  assert.equal(telegraph.enemy.body[0]?.y, 5)
  assert.equal(telegraph.enemy.telegraph?.kind, 'ambusher_dash')
  assert.equal(telegraph.enemy.telegraph?.ticksRemaining, 2)

  const charging = tickEnemy(telegraph.enemy, {
    playerHead: { x: 5, y: 10 },
    playerHeadHistory: [],
    isWall: () => false,
    foodCell: null,
    rng: createSeededRng(2),
    ambusher: {
      dashMinLaneDistance: 2,
      dashChanceWhenAligned: 1,
      dashSteps: 2,
      dashCooldownTurns: 3,
      telegraphTicks: 2,
    },
    stalkerSpeedMultiplier: 0.8,
    egg: {
      hatchLength: 3,
    },
  })
  assert.equal(charging.enemy.telegraph?.ticksRemaining, 1)

  const dashed = tickEnemy(charging.enemy, {
    playerHead: { x: 5, y: 10 },
    playerHeadHistory: [],
    isWall: () => false,
    foodCell: null,
    rng: createSeededRng(2),
    ambusher: {
      dashMinLaneDistance: 2,
      dashChanceWhenAligned: 1,
      dashSteps: 2,
      dashCooldownTurns: 3,
      telegraphTicks: 2,
    },
    stalkerSpeedMultiplier: 0.8,
    egg: {
      hatchLength: 3,
    },
  })
  assert.equal(dashed.enemy.body[0]?.x, 5)
  assert.equal(dashed.enemy.body[0]?.y, 7)
  assert.equal(dashed.enemy.telegraph, null)
  assert.equal(dashed.enemy.dashCooldown, 3)
})

test('collision damage resolver uses boss/body overrides', () => {
  assert.equal(
    resolveEnemyCollisionDamage({
      kind: 'boss',
      part: 'head',
      headDamageSegments: 1,
      bodyDamageSegments: 1,
      bossHeadDamageSegments: 3,
      bossBodyDamageSegments: 2,
    }),
    3,
  )
  assert.equal(
    resolveEnemyCollisionDamage({
      kind: 'normal',
      part: 'body',
      headDamageSegments: 2,
      bodyDamageSegments: 1,
      bossHeadDamageSegments: 4,
      bossBodyDamageSegments: 3,
    }),
    1,
  )
})

test('stalker extra step chance is deterministic per seed', () => {
  const a = createSeededRng(9)
  const b = createSeededRng(9)
  const outA = Array.from({ length: 6 }, () => applyStalkerExtraStep('stalker', a, 0.7))
  const outB = Array.from({ length: 6 }, () => applyStalkerExtraStep('stalker', b, 0.7))
  assert.deepEqual(outA, outB)
})
