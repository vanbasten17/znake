import type { Enemy, EnemyKind, SnakeSegment, Vec2 } from '../core/types'
import { ENEMY_KIND } from '../shared/gameplayIds'
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
    telegraphTicks: number
  }
  stalkerSpeedMultiplier: number
  egg: {
    hatchLength: number
  }
  roles: {
    sniper: {
      telegraphTicks: number
      cooldownTurns: number
      minLaneDistance: number
      chanceWhenAligned: number
    }
  }
}

export type EnemyTickResult = {
  enemy: Enemy
  ateFood: boolean
  hatched: boolean
  rolePressureOutcome: 'leech_food_stolen' | null
}

const toIdleTickResult = (enemy: Enemy): EnemyTickResult => ({
  enemy: cloneEnemy(enemy),
  ateFood: false,
  hatched: false,
  rolePressureOutcome: null,
})

const cloneEnemy = (enemy: Enemy): Enemy => ({
  ...enemy,
  dir: { ...enemy.dir },
  body: enemy.body.map((segment) => ({ ...segment })),
  telegraph: enemy.telegraph
    ? {
        ...enemy.telegraph,
        dir: { ...enemy.telegraph.dir },
      }
    : null,
  readability: { ...enemy.readability },
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
    nextEnemy.readability.telegraphActive = true
    nextEnemy.readability.counterplayTicksRemaining = nextEnemy.hatchTurnsRemaining
    return { enemy: nextEnemy, ateFood: false, hatched: false, rolePressureOutcome: null }
  }
  const head = nextEnemy.body[0]
  if (!head) {
    return { enemy: nextEnemy, ateFood: false, hatched: false, rolePressureOutcome: null }
  }
  nextEnemy.kind = ENEMY_KIND.NORMAL
  nextEnemy.mirrorDelaySteps = 0
  nextEnemy.body = Array.from({ length: hatchLength }, (_, i) => ({
    x: Math.max(0, head.x - i),
    y: head.y,
  }))
  nextEnemy.readability.telegraphActive = false
  nextEnemy.readability.counterplayTicksRemaining = 1
  return { enemy: nextEnemy, ateFood: false, hatched: true, rolePressureOutcome: null }
}

const tickMirrorEnemy = (enemy: Enemy, context: TickEnemyContext): EnemyTickResult => {
  const head = enemy.body[0]
  if (!head) {
    return toIdleTickResult(enemy)
  }
  const delay = Math.max(1, enemy.mirrorDelaySteps)
  const targetIndex = context.playerHeadHistory.length - 1 - delay
  const target = targetIndex >= 0 ? context.playerHeadHistory[targetIndex] : context.playerHead
  if (!target) {
    return toIdleTickResult(enemy)
  }
  const aligned = head.x === target.x || head.y === target.y
  const laneDistance = aligned
    ? head.x === target.x
      ? Math.abs(head.y - target.y)
      : Math.abs(head.x - target.x)
    : 0
  if (
    aligned &&
    laneDistance >= context.roles.sniper.minLaneDistance &&
    enemy.roleCooldown <= 0 &&
    context.rng.nextFloat() < context.roles.sniper.chanceWhenAligned
  ) {
    const next = cloneEnemy(enemy)
    const dir: Vec2 =
      head.x === target.x
        ? { x: 0, y: Math.sign(target.y - head.y) }
        : { x: Math.sign(target.x - head.x), y: 0 }
    if (dir.x !== 0 || dir.y !== 0) {
      next.telegraph = {
        kind: 'sniper_lock',
        dir,
        ticksRemaining: Math.max(1, context.roles.sniper.telegraphTicks),
      }
      next.readability.telegraphActive = true
      next.readability.counterplayTicksRemaining = next.telegraph.ticksRemaining
      next.roleCooldown = context.roles.sniper.cooldownTurns
      return { enemy: next, ateFood: false, hatched: false, rolePressureOutcome: null }
    }
  }
  if (enemy.telegraph?.kind === 'sniper_lock') {
    const next = cloneEnemy(enemy)
    if (next.telegraph && next.telegraph.ticksRemaining > 1) {
      next.telegraph.ticksRemaining -= 1
      next.readability.telegraphActive = true
      next.readability.counterplayTicksRemaining = next.telegraph.ticksRemaining
      return { enemy: next, ateFood: false, hatched: false, rolePressureOutcome: null }
    }
    const dir = next.telegraph?.dir ?? { x: 0, y: 0 }
    next.telegraph = null
    const advanced = advanceEnemyStep(next, dir, context.isWall, context.foodCell)
    const landed = advanced.enemy
    landed.readability.telegraphActive = false
    landed.readability.counterplayTicksRemaining = 1
    landed.roleCooldown = Math.max(0, landed.roleCooldown - 1)
    return {
      enemy: landed,
      ateFood: advanced.ateFood,
      hatched: false,
      rolePressureOutcome: advanced.ateFood ? 'leech_food_stolen' : null,
    }
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
      const nextEnemy = advanced.enemy
      nextEnemy.roleCooldown = Math.max(0, nextEnemy.roleCooldown - 1)
      return {
        enemy: nextEnemy,
        ateFood: advanced.ateFood,
        hatched: false,
        rolePressureOutcome:
          advanced.ateFood && nextEnemy.role === 'leech' ? 'leech_food_stolen' : null,
      }
    }
  }
  const idle = cloneEnemy(enemy)
  idle.roleCooldown = Math.max(0, idle.roleCooldown - 1)
  return { enemy: idle, ateFood: false, hatched: false, rolePressureOutcome: null }
}

const tryAmbusherDash = (enemy: Enemy, context: TickEnemyContext): EnemyTickResult | null => {
  const head = enemy.body[0]
  if (!head) {
    return null
  }
  if (enemy.telegraph?.kind === 'ambusher_dash') {
    const pending = cloneEnemy(enemy)
    const telegraph = pending.telegraph
    if (!telegraph) {
      return { enemy: pending, ateFood: false, hatched: false, rolePressureOutcome: null }
    }
    if (telegraph.ticksRemaining > 1) {
      telegraph.ticksRemaining -= 1
      pending.readability.telegraphActive = true
      pending.readability.counterplayTicksRemaining = telegraph.ticksRemaining
      return { enemy: pending, ateFood: false, hatched: false, rolePressureOutcome: null }
    }
    const dir = { ...telegraph.dir }
    pending.telegraph = null
    let current = pending
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
      current.readability.telegraphActive = false
      current.readability.counterplayTicksRemaining = 1
      return { enemy: current, ateFood, hatched: false, rolePressureOutcome: null }
    }
    return { enemy: current, ateFood: false, hatched: false, rolePressureOutcome: null }
  }
  const playerHead = context.playerHead
  if (!playerHead) {
    return null
  }
  if (enemy.dashCooldown > 0) {
    const cooldownEnemy = cloneEnemy(enemy)
    cooldownEnemy.dashCooldown -= 1
    return { enemy: cooldownEnemy, ateFood: false, hatched: false, rolePressureOutcome: null }
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
  const telegraphEnemy = cloneEnemy(enemy)
  telegraphEnemy.telegraph = {
    kind: 'ambusher_dash',
    dir,
    ticksRemaining: Math.max(1, context.ambusher.telegraphTicks),
  }
  telegraphEnemy.readability.telegraphActive = true
  telegraphEnemy.readability.counterplayTicksRemaining = telegraphEnemy.telegraph.ticksRemaining
  return { enemy: telegraphEnemy, ateFood: false, hatched: false, rolePressureOutcome: null }
}

type SpecialTickEnemyKind =
  | typeof ENEMY_KIND.EGG
  | typeof ENEMY_KIND.MIRROR
  | typeof ENEMY_KIND.AMBUSHER

type SpecialTickStrategy = (enemy: Enemy, context: TickEnemyContext) => EnemyTickResult | null

const SPECIAL_TICK_STRATEGIES: Record<SpecialTickEnemyKind, SpecialTickStrategy> = {
  [ENEMY_KIND.EGG]: (enemy, context) => tickEggEnemy(enemy, context.egg.hatchLength),
  [ENEMY_KIND.MIRROR]: (enemy, context) => tickMirrorEnemy(enemy, context),
  [ENEMY_KIND.AMBUSHER]: (enemy, context) => tryAmbusherDash(enemy, context),
}

const isSpecialTickEnemyKind = (kind: EnemyKind): kind is SpecialTickEnemyKind =>
  kind === ENEMY_KIND.EGG || kind === ENEMY_KIND.MIRROR || kind === ENEMY_KIND.AMBUSHER

export const tickEnemy = (enemy: Enemy, context: TickEnemyContext): EnemyTickResult => {
  if (!enemy.alive) {
    return toIdleTickResult(enemy)
  }

  if (isSpecialTickEnemyKind(enemy.kind)) {
    const specialResult = SPECIAL_TICK_STRATEGIES[enemy.kind](enemy, context)
    if (specialResult) {
      return specialResult
    }
  }
  const playerHead = context.playerHead
  const head = enemy.body[0]
  if (!playerHead || !head) {
    return toIdleTickResult(enemy)
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
      enemy.kind === ENEMY_KIND.STALKER || enemy.kind === ENEMY_KIND.AMBUSHER
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
      const nextEnemy = advanced.enemy
      nextEnemy.telegraph = null
      nextEnemy.readability.telegraphActive = false
      nextEnemy.readability.counterplayTicksRemaining = advanced.ateFood ? 1 : 0
      nextEnemy.roleCooldown = Math.max(0, nextEnemy.roleCooldown - 1)
      return {
        enemy: nextEnemy,
        ateFood: advanced.ateFood,
        hatched: false,
        rolePressureOutcome:
          advanced.ateFood && nextEnemy.role === 'leech' ? 'leech_food_stolen' : null,
      }
    }
  }
  const stalled = cloneEnemy(enemy)
  stalled.roleCooldown = Math.max(0, stalled.roleCooldown - 1)
  return { enemy: stalled, ateFood: false, hatched: false, rolePressureOutcome: null }
}

export const applyStalkerExtraStep = (
  enemyKind: EnemyKind,
  rng: GameRng,
  speedMultiplier: number,
): boolean => enemyKind === ENEMY_KIND.STALKER && rng.nextFloat() < 1 - speedMultiplier

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
  if (params.kind === ENEMY_KIND.BOSS) {
    return params.part === 'head' ? params.bossHeadDamageSegments : params.bossBodyDamageSegments
  }
  return params.part === 'head' ? params.headDamageSegments : params.bodyDamageSegments
}
