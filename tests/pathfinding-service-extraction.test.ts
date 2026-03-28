import assert from 'node:assert/strict'
import test from 'node:test'
import { ENEMY_KIND } from '../src/game/shared/gameplayIds'
import { resolvePreferredEnemyDirections } from '../src/game/simulation/enemyPathfinding'

test('pathfinding service returns cardinal directions prioritized toward target', () => {
  const dirs = resolvePreferredEnemyDirections({
    enemyKind: ENEMY_KIND.STALKER,
    enemyHead: { x: 5, y: 5 },
    playerHead: { x: 8, y: 5 },
    rng: { nextFloat: () => 0.5, nextInt: () => 0 } as never,
  })
  assert.equal(dirs.length, 4)
  assert.deepEqual(dirs[0], { x: 1, y: 0 })
})

test('pathfinding service can be overridden through strategy interface', () => {
  const dirs = resolvePreferredEnemyDirections(
    {
      enemyKind: ENEMY_KIND.NORMAL,
      enemyHead: { x: 1, y: 1 },
      playerHead: { x: 3, y: 4 },
      rng: { nextFloat: () => 0.4, nextInt: () => 0 } as never,
    },
    {
      resolvePreferredDirections: () => [{ x: 0, y: -1 }],
    },
  )
  assert.deepEqual(dirs, [{ x: 0, y: -1 }])
})
