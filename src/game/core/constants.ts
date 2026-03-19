export const BASE_COLS = 20
export const BASE_ROWS = 27
export const CELL = 20
export const WIDTH = BASE_COLS * CELL
export const HEIGHT = BASE_ROWS * CELL

export const COLORS = {
  bg: 0x020208,
  grid: 0x0a0a18,
  snake: 0x00ff88,
  snakeHead: 0x00ffcc,
  food: 0xff4466,
  foodGlow: 0xff2244,
  wall: 0x1a1a3e,
  wallBright: 0x3333aa,
  enemy: 0xff6600,
  enemyHead: 0xffaa00,
  powerup: 0xffdd00,
  shield: 0x00aaff,
  slow: 0xff88cc,
} as const

export const STORAGE_KEYS = {
  bestScore: 'znake_best',
  legacyBestScore: 'serpent_best',
  profile: 'znake_profile_v1',
  profileBackup: 'znake_profile_v1_backup',
} as const
