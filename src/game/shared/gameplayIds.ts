export const DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
} as const

export const DIRECTION_IDS = [
  DIRECTION.UP,
  DIRECTION.DOWN,
  DIRECTION.LEFT,
  DIRECTION.RIGHT,
] as const
export type DirectionId = (typeof DIRECTION_IDS)[number]

export const POWERUP_TYPE = {
  SHIELD: 'shield',
  SLOW: 'slow',
  GHOST: 'ghost',
  SCORE: 'score',
  VENOM: 'venom',
} as const

export const POWERUP_TYPE_IDS = [
  POWERUP_TYPE.SHIELD,
  POWERUP_TYPE.SLOW,
  POWERUP_TYPE.GHOST,
  POWERUP_TYPE.SCORE,
  POWERUP_TYPE.VENOM,
] as const
export type PowerupTypeId = (typeof POWERUP_TYPE_IDS)[number]

export const ENEMY_KIND = {
  NORMAL: 'normal',
  STALKER: 'stalker',
  AMBUSHER: 'ambusher',
  BOSS: 'boss',
  EGG: 'egg',
  MIRROR: 'mirror',
} as const

export const ENEMY_KIND_IDS = [
  ENEMY_KIND.NORMAL,
  ENEMY_KIND.STALKER,
  ENEMY_KIND.AMBUSHER,
  ENEMY_KIND.BOSS,
  ENEMY_KIND.EGG,
  ENEMY_KIND.MIRROR,
] as const
export type EnemyKindId = (typeof ENEMY_KIND_IDS)[number]

export const ELITE_ENEMY_KIND_IDS = [ENEMY_KIND.STALKER, ENEMY_KIND.AMBUSHER] as const
export type EliteEnemyKindId = (typeof ELITE_ENEMY_KIND_IDS)[number]

export const SPECIAL_ENEMY_KIND_IDS = [ENEMY_KIND.EGG, ENEMY_KIND.MIRROR] as const
export type SpecialEnemyKindId = (typeof SPECIAL_ENEMY_KIND_IDS)[number]
