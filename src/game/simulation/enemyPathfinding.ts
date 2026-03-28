import type { EnemyKind, SnakeSegment, Vec2 } from '../core/types'
import { ENEMY_KIND } from '../shared/gameplayIds'
import type { GameRng } from './rng'

export type EnemyPathfindingInput = {
  enemyKind: EnemyKind
  enemyHead: SnakeSegment
  playerHead: SnakeSegment
  rng: GameRng
}

export type EnemyPathfindingService = {
  resolvePreferredDirections: (input: EnemyPathfindingInput) => Vec2[]
}

const CARDINAL_DIRECTIONS: Vec2[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
]

const defaultEnemyPathfindingService: EnemyPathfindingService = {
  resolvePreferredDirections: (input) => {
    const dx = input.playerHead.x - input.enemyHead.x
    const dy = input.playerHead.y - input.enemyHead.y
    const preferred = [...CARDINAL_DIRECTIONS].sort((a, b) => {
      const sa = a.x * Math.sign(dx) + a.y * Math.sign(dy)
      const sb = b.x * Math.sign(dx) + b.y * Math.sign(dy)
      const randomness =
        input.enemyKind === ENEMY_KIND.STALKER || input.enemyKind === ENEMY_KIND.AMBUSHER
          ? 0
          : (input.rng.nextFloat() - 0.5) * 0.5
      return sb - sa + randomness
    })
    return preferred
  },
}

export const resolvePreferredEnemyDirections = (
  input: EnemyPathfindingInput,
  service: EnemyPathfindingService = defaultEnemyPathfindingService,
): Vec2[] => service.resolvePreferredDirections(input)
