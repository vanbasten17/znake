import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CURRENT_PROFILE_VERSION,
  createDefaultProfile,
  parseAndMigrateProfile,
} from '../src/game/core/profileVersioning'

test('profile migration upgrades v1 payload to current version', () => {
  const legacyPayload = JSON.stringify({
    profileVersion: 1,
    currency: 10,
    unlockedTalents: ['speed_1'],
    lifetimeStats: {
      runsPlayed: 2,
      totalScore: 50,
      totalKills: 4,
      bestFloor: 6,
    },
  })
  const migrated = parseAndMigrateProfile(legacyPayload)
  assert.ok(migrated)
  assert.equal(migrated?.profileVersion, CURRENT_PROFILE_VERSION)
  assert.equal(migrated?.goalProgress.floor_5, 6)
})

test('invalid profile payload falls back to null parse result', () => {
  const parsed = parseAndMigrateProfile('{"currency":"bad"}')
  assert.equal(parsed, null)
})

test('default profile has current version', () => {
  const profile = createDefaultProfile()
  assert.equal(profile.profileVersion, CURRENT_PROFILE_VERSION)
})
