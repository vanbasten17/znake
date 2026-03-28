import assert from 'node:assert/strict'
import test from 'node:test'
import {
  COMPANION_DRONE_COOLDOWN_MS,
  resolveCompanionDroneSupport,
  tickCompanionDroneCooldown,
} from '../src/game/systems/companionDrone'

test('companion drone trigger is cooldown bounded and deterministic', () => {
  const ready = resolveCompanionDroneSupport({ cooldownMs: 0, scoreMultiplier: 1 })
  assert.equal(ready.triggered, true)
  assert.equal(ready.nextCooldownMs, COMPANION_DRONE_COOLDOWN_MS)
  assert.equal(ready.bonusScore > 0, true)

  const blocked = resolveCompanionDroneSupport({
    cooldownMs: ready.nextCooldownMs,
    scoreMultiplier: 1,
  })
  assert.equal(blocked.triggered, false)
  assert.equal(blocked.bonusScore, 0)
})

test('companion drone cooldown tick clamps at zero deterministically', () => {
  assert.equal(tickCompanionDroneCooldown(1000, 250), 750)
  assert.equal(tickCompanionDroneCooldown(1000, 1500), 0)
})
