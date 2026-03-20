import type Phaser from 'phaser'
import { COLORS } from '../core/constants'
import type { GlossaryMarkerTone } from '../core/glossary'

const toHex = (value: number): string => `#${value.toString(16).padStart(6, '0')}`

/**
 * 5×5 pixel glyphs (each row is 5 chars; '1' = lit). Tuned for instant read at glossary size.
 * Shapes map to lore / SPRITE_GENERATION_REFERENCE.md where possible.
 */
const GLYPH_BY_TONE: Partial<Record<GlossaryMarkerTone, string[]>> = {
  // Biome pickup (cyan token) — compact diamond (`core` = apple, no glyph)
  biomeCore: ['00100', '01110', '11111', '01110', '00100'],
  // Gateway — arch / doorway
  portal: ['01110', '01010', '01010', '01010', '00100'],
  // Power cell — body + terminals
  battery: ['00100', '01110', '01010', '01010', '00110'],
  // Locator — concentric ping frame
  beacon: ['11111', '10001', '10101', '10001', '11111'],
  // Defense — heater shield (wide top, point bottom)
  shield: ['01110', '01010', '01010', '01010', '00100'],
  // Time — hourglass
  slow: ['11111', '01110', '00100', '01110', '11111'],
  // Phase — ghost blob + wavy bottom
  ghost: ['01110', '10001', '10101', '10001', '10110'],
  // Reward — star burst (distinct from food diamond)
  score: ['00100', '11111', '01010', '11111', '00100'],
  // Offense — asymmetric toxic droplet
  venom: ['00010', '00100', '01110', '11111', '01110'],
  // Obscuring — crescent / moon wedge
  darkness: ['01111', '11110', '11110', '11110', '11111'],
  // Closing arena — parallel rails
  squeeze: ['10101', '10101', '10101', '10101', '10101'],
  // Slip — snowflake (6 spokes)
  ice: ['00100', '11111', '00100', '11111', '00100'],
  // Drag — staggered grit (not an X fracture)
  sand: ['10010', '01001', '00100', '01001', '10010'],
  // Lethal tear — sharp fracture X
  rift: ['10001', '01010', '00100', '01010', '10001'],
  // Hunter — face with eyes
  enemyNormal: ['01110', '10001', '10101', '10001', '01110'],
  // Elite speed — lightning zig
  enemyStalker: ['11100', '01010', '01110', '01010', '11100'],
  // Dash threat — forward chevron
  enemyAmbusher: ['00010', '00110', '11111', '00110', '00010'],
  // Dormant — egg fill
  enemyEgg: ['00100', '01110', '11111', '11111', '01110'],
  // Echo — vertical mirror seam
  enemyMirror: ['10001', '10001', '10001', '10001', '10001'],
  // Apex — crown
  enemyBoss: ['10101', '11111', '01110', '01010', '00100'],
  // Talent: speed — motion streaks
  talentSpeed: ['11111', '10001', '10001', '10001', '11111'],
  // Talent: survival — bold plus (healing / sustain)
  talentSurvival: ['00100', '00100', '11111', '00100', '00100'],
  // Talent: hunt — hollow target ring (not thin rift X)
  talentHunt: ['01110', '10001', '10001', '10001', '01110'],
}

/**
 * Scales 5×5 glyph cells with marker size so icons stay readable (not 5×5 px total on large draws).
 */
const glyphPixelSizeForMarker = (size: number): number => {
  const radius = Math.max(3, size * 0.31)
  const diameter = (radius + 1) * 2
  const raw = Math.floor((diameter * 0.88) / 5)
  return Math.max(1, Math.min(16, raw))
}

/** Red apple silhouette for food (`core` tone); biome pickups use `biomeCore` + diamond glyph. */
const drawAppleMarkerCanvas = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
): void => {
  const r = Math.max(3, size * 0.31)
  ctx.fillStyle = toHex(COLORS.foodGlow)
  ctx.beginPath()
  ctx.arc(cx, cy, r + 1.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = toHex(COLORS.food)
  ctx.beginPath()
  ctx.ellipse(cx, cy + r * 0.06, r * 0.88, r * 1.06, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#3d2817'
  ctx.fillRect(cx - Math.max(0.5, r * 0.14), cy - r * 1.32, Math.max(1, r * 0.28), r * 0.42)
  ctx.fillStyle = '#2d9a3e'
  ctx.beginPath()
  ctx.ellipse(cx + r * 0.52, cy - r * 1.18, r * 0.4, r * 0.2, 0.55, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.42)'
  ctx.beginPath()
  ctx.ellipse(cx - r * 0.38, cy - r * 0.22, r * 0.24, r * 0.11, -0.35, 0, Math.PI * 2)
  ctx.fill()
}

const drawAppleMarkerPhaser = (
  g: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  size: number,
  alpha: number,
): void => {
  const r = Math.max(3, size * 0.31)
  g.fillStyle(COLORS.foodGlow, alpha)
  g.fillCircle(cx, cy, r + 1.2)
  g.fillStyle(COLORS.food, alpha)
  g.fillEllipse(cx, cy + r * 0.06, r * 0.88 * 2, r * 1.06 * 2)
  g.fillStyle(0x3d2817, alpha)
  g.fillRect(cx - Math.max(0.5, r * 0.14), cy - r * 1.32, Math.max(1, r * 0.28), r * 0.42)
  g.fillStyle(0x2d9a3e, alpha)
  g.fillEllipse(cx + r * 0.52, cy - r * 1.18, r * 0.4 * 2, r * 0.2 * 2)
  g.fillStyle(0xffffff, alpha * 0.42)
  g.fillEllipse(cx - r * 0.38, cy - r * 0.22, r * 0.24 * 2, r * 0.11 * 2)
}

const drawGlyphCanvas = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rows: string[] | undefined,
  color: string,
  pixelSize = 1,
): void => {
  if (!rows || rows.length === 0) {
    return
  }
  const glyphHeight = rows.length * pixelSize
  const glyphWidth = (rows[0]?.length ?? 0) * pixelSize
  const ox = Math.round(cx - glyphWidth / 2)
  const oy = Math.round(cy - glyphHeight / 2)
  ctx.fillStyle = color
  for (let y = 0; y < rows.length; y += 1) {
    const row = rows[y]
    if (!row) continue
    for (let x = 0; x < row.length; x += 1) {
      if (row[x] === '1') {
        ctx.fillRect(ox + x * pixelSize, oy + y * pixelSize, pixelSize, pixelSize)
      }
    }
  }
}

const drawGlyphPhaser = (
  g: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  rows: string[] | undefined,
  color: number,
  alpha = 1,
  pixelSize = 2,
): void => {
  if (!rows || rows.length === 0) {
    return
  }
  const glyphHeight = rows.length * pixelSize
  const glyphWidth = (rows[0]?.length ?? 0) * pixelSize
  const ox = Math.round(cx - glyphWidth / 2)
  const oy = Math.round(cy - glyphHeight / 2)
  g.fillStyle(color, alpha)
  for (let y = 0; y < rows.length; y += 1) {
    const row = rows[y]
    if (!row) continue
    for (let x = 0; x < row.length; x += 1) {
      if (row[x] === '1') {
        g.fillRect(ox + x * pixelSize, oy + y * pixelSize, pixelSize, pixelSize)
      }
    }
  }
}

export const drawMarkerSpriteCanvas = (
  ctx: CanvasRenderingContext2D,
  tone: GlossaryMarkerTone,
  cx: number,
  cy: number,
  size: number,
): void => {
  const radius = Math.max(3, size * 0.31)
  switch (tone) {
    case 'core':
      drawAppleMarkerCanvas(ctx, cx, cy, size)
      break
    case 'biomeCore':
      ctx.fillStyle = toHex(COLORS.portalGlow)
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = toHex(COLORS.portal)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 0.52, 0, Math.PI * 2)
      ctx.stroke()
      break
    case 'portal':
      ctx.fillStyle = toHex(COLORS.portalGlow)
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = toHex(COLORS.portal)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2)
      ctx.stroke()
      break
    case 'battery':
      ctx.fillStyle = '#8866ff'
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'beacon':
      ctx.fillStyle = toHex(COLORS.beacon)
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'shield':
      ctx.fillStyle = toHex(COLORS.shield)
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'slow':
      ctx.fillStyle = toHex(COLORS.slow)
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'ghost':
      ctx.fillStyle = '#aaaaff'
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'score':
      ctx.fillStyle = toHex(COLORS.powerup)
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'venom':
      ctx.fillStyle = toHex(COLORS.venom)
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'darkness':
      ctx.fillStyle = '#131b35'
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'squeeze':
      ctx.fillStyle = '#212848'
      ctx.fillRect(cx - radius, cy - radius * 0.7, radius * 2, radius * 1.4)
      ctx.fillStyle = '#ffd88b'
      ctx.fillRect(cx - radius, cy - radius * 0.7, Math.max(1, radius * 0.34), radius * 1.4)
      ctx.fillRect(
        cx + radius - Math.max(1, radius * 0.34),
        cy - radius * 0.7,
        Math.max(1, radius * 0.34),
        radius * 1.4,
      )
      break
    case 'ice':
      ctx.fillStyle = toHex(COLORS.iceGlow)
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'sand':
      ctx.fillStyle = toHex(COLORS.sandGlow)
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'rift':
      ctx.fillStyle = '#7a42ff'
      ctx.beginPath()
      ctx.arc(cx, cy, radius + 1, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'enemyNormal':
      ctx.fillStyle = toHex(COLORS.enemy)
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'enemyStalker':
      ctx.fillStyle = '#ff6699'
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'enemyAmbusher':
      ctx.fillStyle = '#b86dff'
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'enemyEgg':
      ctx.fillStyle = '#ffe48b'
      ctx.beginPath()
      ctx.ellipse(cx, cy, radius * 0.86, radius * 1.06, 0, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'enemyMirror':
      ctx.fillStyle = '#8ae6ff'
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'enemyBoss':
      ctx.fillStyle = '#ffb400'
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'talentSpeed':
      ctx.fillStyle = '#ffdb49'
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'talentSurvival':
      ctx.fillStyle = '#5ecbff'
      ctx.fillRect(cx - radius * 0.7, cy - radius, radius * 1.4, radius * 1.8)
      break
    case 'talentHunt':
      ctx.fillStyle = '#ff9f5e'
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
  }
  const glyphRows = GLYPH_BY_TONE[tone]
  if (glyphRows) {
    drawGlyphCanvas(ctx, cx, cy, glyphRows, '#f6fbff', glyphPixelSizeForMarker(size))
  }
}

export const drawMarkerSpritePhaser = (
  g: Phaser.GameObjects.Graphics,
  tone: GlossaryMarkerTone,
  cx: number,
  cy: number,
  size: number,
  alpha = 1,
): void => {
  const radius = Math.max(3, size * 0.31)
  switch (tone) {
    case 'core':
      drawAppleMarkerPhaser(g, cx, cy, size, alpha)
      break
    case 'biomeCore':
      g.fillStyle(COLORS.portalGlow, alpha)
      g.fillCircle(cx, cy, radius + 1)
      g.lineStyle(1, COLORS.portal, alpha * 0.95)
      g.strokeCircle(cx, cy, radius * 0.52)
      break
    case 'portal':
      g.fillStyle(COLORS.portal, alpha)
      g.fillCircle(cx, cy, radius + 1)
      break
    case 'battery':
      g.fillStyle(0x8866ff, alpha)
      g.fillCircle(cx, cy, radius + 1)
      break
    case 'beacon':
      g.fillStyle(COLORS.beacon, alpha)
      g.fillCircle(cx, cy, radius + 1)
      break
    case 'shield':
      g.fillStyle(COLORS.shield, alpha)
      g.fillCircle(cx, cy, radius + 1)
      break
    case 'slow':
      g.fillStyle(COLORS.slow, alpha)
      g.fillCircle(cx, cy, radius + 1)
      break
    case 'ghost':
      g.fillStyle(0xaaaaff, alpha)
      g.fillCircle(cx, cy, radius + 1)
      break
    case 'score':
      g.fillStyle(COLORS.powerup, alpha)
      g.fillCircle(cx, cy, radius + 1)
      break
    case 'venom':
      g.fillStyle(COLORS.venom, alpha)
      g.fillCircle(cx, cy, radius + 1)
      break
    case 'darkness':
      g.fillStyle(0x131b35, alpha)
      g.fillCircle(cx, cy, radius + 1)
      break
    case 'squeeze':
      g.fillStyle(0x212848, alpha)
      g.fillRect(cx - radius, cy - radius * 0.7, radius * 2, radius * 1.4)
      g.fillStyle(0xffd88b, alpha)
      g.fillRect(cx - radius, cy - radius * 0.7, Math.max(1, radius * 0.34), radius * 1.4)
      g.fillRect(
        cx + radius - Math.max(1, radius * 0.34),
        cy - radius * 0.7,
        Math.max(1, radius * 0.34),
        radius * 1.4,
      )
      break
    case 'ice':
      g.fillStyle(COLORS.iceGlow, alpha)
      g.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'sand':
      g.fillStyle(COLORS.sandGlow, alpha)
      g.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'rift':
      g.fillStyle(0x7a42ff, alpha)
      g.fillCircle(cx, cy, radius + 1)
      break
    case 'enemyNormal':
      g.fillStyle(COLORS.enemy, alpha)
      g.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'enemyStalker':
      g.fillStyle(0xff6699, alpha)
      g.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'enemyAmbusher':
      g.fillStyle(0xb86dff, alpha)
      g.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'enemyEgg':
      g.fillStyle(0xffe48b, alpha)
      g.fillEllipse(cx, cy, radius * 1.72, radius * 2.1)
      break
    case 'enemyMirror':
      g.fillStyle(0x8ae6ff, alpha)
      g.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'enemyBoss':
      g.fillStyle(0xffb400, alpha)
      g.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
    case 'talentSpeed':
      g.fillStyle(0xffdb49, alpha)
      g.fillCircle(cx, cy, radius)
      break
    case 'talentSurvival':
      g.fillStyle(0x5ecbff, alpha)
      g.fillRect(cx - radius * 0.7, cy - radius, radius * 1.4, radius * 1.8)
      break
    case 'talentHunt':
      g.fillStyle(0xff9f5e, alpha)
      g.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      break
  }
  const glyphRowsPhaser = GLYPH_BY_TONE[tone]
  if (glyphRowsPhaser) {
    drawGlyphPhaser(g, cx, cy, glyphRowsPhaser, 0xf6fbff, alpha, glyphPixelSizeForMarker(size))
  }
}
