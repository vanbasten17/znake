import assert from 'node:assert/strict'
import test from 'node:test'
import { pickPowerupType } from '../src/game/config/content'
import {
  BALANCE,
  getBossPhaseRemixForFloor,
  getDepthBandForFloor,
  getFloorSetup,
  getItemSpawnConfigForFloor,
  getRoleSpawnPolicyForFloor,
  getRoleSpawnPolicyWindowForFloor,
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

test('role composition director windows rotate deterministically by spawn index', () => {
  const earlyOne = getRoleSpawnPolicyWindowForFloor({ floor: 2, spawnIndex: 1 })
  const earlyFour = getRoleSpawnPolicyWindowForFloor({ floor: 2, spawnIndex: 4 })
  const earlySeven = getRoleSpawnPolicyWindowForFloor({ floor: 2, spawnIndex: 7 })
  assert.equal(earlyOne.id, 'early_stable')
  assert.equal(earlyFour.id, 'early_poke')
  assert.equal(earlySeven.id, 'early_stable')
})

test('boss phase remix rotation is deterministic by boss-floor ordinal', () => {
  assert.equal(getBossPhaseRemixForFloor(10).id, 'standard')
  assert.equal(getBossPhaseRemixForFloor(20).id, 'assault')
  assert.equal(getBossPhaseRemixForFloor(30).id, 'siege')
  assert.equal(getBossPhaseRemixForFloor(40).id, 'standard')
})

test('late composition window can tighten blocker cap for pressure spikes', () => {
  const lateSpike = getRoleSpawnPolicyWindowForFloor({ floor: 12, spawnIndex: 1 })
  const lateRecover = getRoleSpawnPolicyWindowForFloor({ floor: 12, spawnIndex: 3 })
  assert.equal(lateSpike.id, 'late_spike')
  assert.equal(lateRecover.id, 'late_recover')
  assert.equal(lateSpike.policy.maxActiveByRole.blocker, 2)
  assert.equal(lateRecover.policy.maxActiveByRole.blocker, 3)
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
