import type { Enemy, EnemyKind, SnakeSegment, Vec2 } from '../core/types'
import type { GameRng } from './rng'

export type EnemyCollisionPart = 'head' | 'body'

export type EnemyCollisionMatch = {
  enemyIndex: number
  part: EnemyCollisionPart
}

type TickEnemyContext = {
  playerHead: SnakeSegment | null
  playerHeadHistory: ReadonlyArray<SnakeSegment>
  isWall: (x: number, y: number) => boolean
  foodCell: Vec2 | null
  rng: GameRng
  ambusher: {
    dashMinLaneDistance: number
    dashChanceWhenAligned: number
    dashSteps: number
    dashCooldownTurns: number
  }
  stalkerSpeedMultiplier: number
  egg: {
    hatchLength: number
  }
}

export type EnemyTickResult = {
  enemy: Enemy
  ateFood: boolean
  hatched: boolean
}

const cloneEnemy = (enemy: Enemy): Enemy => ({
  ...enemy,
  dir: { ...enemy.dir },
  body: enemy.body.map((segment) => ({ ...segment })),
})

const advanceEnemyStep = (
  enemy: Enemy,
  dir: Vec2,
  isWall: (x: number, y: number) => boolean,
  foodCell: Vec2 | null,
): { enemy: Enemy; moved: boolean; ateFood: boolean } => {
  const nextEnemy = cloneEnemy(enemy)
  const head = nextEnemy.body[0]
  if (!head) {
    return { enemy: nextEnemy, moved: false, ateFood: false }
  }
  const nx = head.x + dir.x
  const ny = head.y + dir.y
  if (isWall(nx, ny)) {
    return { enemy: nextEnemy, moved: false, ateFood: false }
  }
  const hitsSelf = nextEnemy.body
    .slice(1, -1)
    .some((segment) => segment.x === nx && segment.y === ny)
  if (hitsSelf) {
    return { enemy: nextEnemy, moved: false, ateFood: false }
  }
  nextEnemy.dir = dir
  nextEnemy.body.unshift({ x: nx, y: ny })
  const ateFood = Boolean(foodCell && nx === foodCell.x && ny === foodCell.y)
  if (!ateFood) {
    nextEnemy.body.pop()
  }
  return { enemy: nextEnemy, moved: true, ateFood }
}

const tickEggEnemy = (enemy: Enemy, hatchLength: number): EnemyTickResult => {
  const nextEnemy = cloneEnemy(enemy)
  nextEnemy.hatchTurnsRemaining = Math.max(0, nextEnemy.hatchTurnsRemaining - 1)
  if (nextEnemy.hatchTurnsRemaining > 0) {
    return { enemy: nextEnemy, ateFood: false, hatched: false }
  }
  const head = nextEnemy.body[0]
  if (!head) {
    return { enemy: nextEnemy, ateFood: false, hatched: false }
  }
  nextEnemy.kind = 'normal'
  nextEnemy.mirrorDelaySteps = 0
  nextEnemy.body = Array.from({ length: hatchLength }, (_, i) => ({
    x: Math.max(0, head.x - i),
    y: head.y,
  }))
  return { enemy: nextEnemy, ateFood: false, hatched: true }
}

const tickMirrorEnemy = (enemy: Enemy, context: TickEnemyContext): EnemyTickResult => {
  const head = enemy.body[0]
  if (!head) {
    return { enemy: cloneEnemy(enemy), ateFood: false, hatched: false }
  }
  const delay = Math.max(1, enemy.mirrorDelaySteps)
  const targetIndex = context.playerHeadHistory.length - 1 - delay
  const target = targetIndex >= 0 ? context.playerHeadHistory[targetIndex] : context.playerHead
  if (!target) {
    return { enemy: cloneEnemy(enemy), ateFood: false, hatched: false }
  }
  const dx = Math.sign(target.x - head.x)
  const dy = Math.sign(target.y - head.y)
  const preferred: Vec2[] =
    Math.abs(target.x - head.x) >= Math.abs(target.y - head.y)
      ? [
          { x: dx, y: 0 },
          { x: 0, y: dy },
          { x: -dx, y: 0 },
          { x: 0, y: -dy },
        ]
      : [
          { x: 0, y: dy },
          { x: dx, y: 0 },
          { x: 0, y: -dy },
          { x: -dx, y: 0 },
        ]
  for (const dir of preferred) {
    if (dir.x === 0 && dir.y === 0) {
      continue
    }
    const advanced = advanceEnemyStep(enemy, dir, context.isWall, context.foodCell)
    if (advanced.moved) {
      return { enemy: advanced.enemy, ateFood: advanced.ateFood, hatched: false }
    }
  }
  return { enemy: cloneEnemy(enemy), ateFood: false, hatched: false }
}

const tryAmbusherDash = (
  enemy: Enemy,
  playerHead: SnakeSegment,
  context: TickEnemyContext,
): EnemyTickResult | null => {
  const head = enemy.body[0]
  if (!head) {
    return null
  }
  if (enemy.dashCooldown > 0) {
    const cooldownEnemy = cloneEnemy(enemy)
    cooldownEnemy.dashCooldown -= 1
    return { enemy: cooldownEnemy, ateFood: false, hatched: false }
  }
  const alignedX = head.x === playerHead.x
  const alignedY = head.y === playerHead.y
  if (!alignedX && !alignedY) {
    return null
  }
  const laneDistance = alignedX ? Math.abs(head.y - playerHead.y) : Math.abs(head.x - playerHead.x)
  if (laneDistance < context.ambusher.dashMinLaneDistance) {
    return null
  }
  if (context.rng.nextFloat() >= context.ambusher.dashChanceWhenAligned) {
    return null
  }
  const dir: Vec2 = alignedX
    ? { x: 0, y: Math.sign(playerHead.y - head.y) }
    : { x: Math.sign(playerHead.x - head.x), y: 0 }
  if (dir.x === -enemy.dir.x && dir.y === -enemy.dir.y) {
    return null
  }
  let current = cloneEnemy(enemy)
  let moved = false
  let ateFood = false
  for (let step = 0; step < context.ambusher.dashSteps; step += 1) {
    const advanced = advanceEnemyStep(current, dir, context.isWall, context.foodCell)
    if (!advanced.moved) {
      break
    }
    current = advanced.enemy
    ateFood = ateFood || advanced.ateFood
    moved = true
  }
  if (moved) {
    current.dashCooldown = context.ambusher.dashCooldownTurns
    return { enemy: current, ateFood, hatched: false }
  }
  return null
}

export const tickEnemy = (enemy: Enemy, context: TickEnemyContext): EnemyTickResult => {
  if (!enemy.alive) {
    return { enemy: cloneEnemy(enemy), ateFood: false, hatched: false }
  }
  if (enemy.kind === 'egg') {
    return tickEggEnemy(enemy, context.egg.hatchLength)
  }
  if (enemy.kind === 'mirror') {
    return tickMirrorEnemy(enemy, context)
  }
  const playerHead = context.playerHead
  const head = enemy.body[0]
  if (!playerHead || !head) {
    return { enemy: cloneEnemy(enemy), ateFood: false, hatched: false }
  }

  if (enemy.kind === 'ambusher') {
    const dash = tryAmbusherDash(enemy, playerHead, context)
    if (dash) {
      return dash
    }
  }

  const dirs: Vec2[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ]
  const dx = playerHead.x - head.x
  const dy = playerHead.y - head.y
  const preferred = [...dirs].sort((a, b) => {
    const sa = a.x * Math.sign(dx) + a.y * Math.sign(dy)
    const sb = b.x * Math.sign(dx) + b.y * Math.sign(dy)
    const randomness =
      enemy.kind === 'stalker' || enemy.kind === 'ambusher'
        ? 0
        : (context.rng.nextFloat() - 0.5) * 0.5
    return sb - sa + randomness
  })

  for (const dir of preferred) {
    if (dir.x === -enemy.dir.x && dir.y === -enemy.dir.y) {
      continue
    }
    const advanced = advanceEnemyStep(enemy, dir, context.isWall, context.foodCell)
    if (advanced.moved) {
      return { enemy: advanced.enemy, ateFood: advanced.ateFood, hatched: false }
    }
  }
  return { enemy: cloneEnemy(enemy), ateFood: false, hatched: false }
}

export const applyStalkerExtraStep = (
  enemyKind: EnemyKind,
  rng: GameRng,
  speedMultiplier: number,
): boolean => enemyKind === 'stalker' && rng.nextFloat() < 1 - speedMultiplier

export const detectEnemyCollision = (
  snakeHead: SnakeSegment | null,
  enemies: ReadonlyArray<Enemy>,
): EnemyCollisionMatch | null => {
  if (!snakeHead) {
    return null
  }
  for (const [enemyIndex, enemy] of enemies.entries()) {
    if (!enemy.alive) {
      continue
    }
    const head = enemy.body[0]
    if (head && head.x === snakeHead.x && head.y === snakeHead.y) {
      return { enemyIndex, part: 'head' }
    }
    if (
      enemy.body.slice(1).some((segment) => segment.x === snakeHead.x && segment.y === snakeHead.y)
    ) {
      return { enemyIndex, part: 'body' }
    }
  }
  return null
}

export const resolveEnemyCollisionDamage = (params: {
  kind: EnemyKind
  part: EnemyCollisionPart
  headDamageSegments: number
  bodyDamageSegments: number
  bossHeadDamageSegments: number
  bossBodyDamageSegments: number
}): number => {
  if (params.kind === 'boss') {
    return params.part === 'head' ? params.bossHeadDamageSegments : params.bossBodyDamageSegments
  }
  return params.part === 'head' ? params.headDamageSegments : params.bodyDamageSegments
}
