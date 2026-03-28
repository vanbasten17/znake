import assert from 'node:assert/strict'
import test from 'node:test'
import { pickPowerupType } from '../src/game/config/content'
import {
  BALANCE,
  getDepthBandForFloor,
  getFloorSetup,
  getItemSpawnConfigForFloor,
  getRoleSpawnPolicyForFloor,
} from '../src/game/core/balance'
import { createSeededRng } from '../src/game/simulation/rng'

test('depth band mapping is stable across floor boundaries', () => {
  assert.equal(getDepthBandForFloor(1), 'early')
  assert.equal(getDepthBandForFloor(5), 'early')
  assert.equal(getDepthBandForFloor(6), 'mid')
  assert.equal(getDepthBandForFloor(10), 'mid')
  assert.equal(getDepthBandForFloor(11), 'late')
  assert.equal(getDepthBandForFloor(15), 'late')
  assert.equal(getDepthBandForFloor(24), 'late')
})

test('role spawn policy shifts toward higher pressure in late band', () => {
  const early = getRoleSpawnPolicyForFloor(2)
  const late = getRoleSpawnPolicyForFloor(12)
  assert.ok(late.weights.sniper > early.weights.sniper)
  assert.ok(late.weights.summoner > early.weights.summoner)
  assert.ok(late.weights.blocker < early.weights.blocker)
})

test('floor setup guardrails keep enemy interval step changes bounded', () => {
  for (let floor = 2; floor <= 12; floor += 1) {
    if (floor % BALANCE.biome.boss.floorInterval === 0) {
      continue
    }
    const prev = getFloorSetup(floor - 1, 1)
    const current = getFloorSetup(floor, 1)
    const intervalDrop = prev.enemyIntervalMs - current.enemyIntervalMs
    const band = BALANCE.depthBalance.bands.find(
      (entry) => floor >= entry.minFloor && floor <= entry.maxFloor,
    )
    assert.ok(band)
    if (!band) continue
    assert.ok(intervalDrop >= band.guardrails.enemyIntervalDropMinMs - 0.001)
    assert.ok(intervalDrop <= band.guardrails.enemyIntervalDropMaxMs + 0.001)
  }
})

test('item usefulness profile boosts late rift utility compared with early', () => {
  const early = getItemSpawnConfigForFloor({
    floor: 2,
    objectiveType: 'score',
    hasOpenPortals: true,
  })
  const late = getItemSpawnConfigForFloor({
    floor: 12,
    objectiveType: 'score',
    hasOpenPortals: true,
  })
  assert.ok(late.riftBatteryOnFoodChance > early.riftBatteryOnFoodChance)
})

test('powerup picks are seed-stable and depth-aware', () => {
  const draws = (floor: number): string => {
    const rng = createSeededRng(424242)
    return Array.from({ length: 40 }, () =>
      pickPowerupType({
        floor,
        isBossFloor: false,
        objectiveType: 'kills',
        rng,
      }),
    ).join(',')
  }
  const earlyTrace = draws(2)
  const lateTrace = draws(12)
  assert.notEqual(earlyTrace, lateTrace)
  assert.equal(earlyTrace, draws(2))
  assert.equal(lateTrace, draws(12))
})
