import type Phaser from 'phaser'
import { COLORS } from '../core/constants'
import type { GlossaryMarkerTone } from '../core/glossary'
import {
  PAINT_BY_TONE,
  drawPremiumTileCanvas,
  drawPremiumTilePhaser,
  drawPremiumTokenCanvas,
  drawPremiumTokenPhaser,
  drawVectorIconCanvas,
  drawVectorIconPhaser,
  iconInkHex,
  iconInkPhaser,
} from './markerVectorArt'

export { MARKER_SEMANTIC_ROLE, type MarkerSemanticRole } from './markerSemantics'

const toHex = (value: number): string => `#${value.toString(16).padStart(6, '0')}`

/**
 * Red apple — reference quality (`core`). Glow + ellipsoid + stem + leaf + highlight.
 */
const drawAppleMarkerCanvas = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
): void => {
  const r = Math.max(3, size * 0.31)
  // 1. Inked Outline
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = r * 0.2
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  // 2. Solid Body
  ctx.fillStyle = toHex(COLORS.food)
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()

  // 3. Simple Stem/Leaf
  ctx.fillStyle = '#3d2817'
  ctx.fillRect(cx - r * 0.1, cy - r * 1.25, r * 0.2, r * 0.4)
  ctx.fillStyle = '#2d9a3e'
  ctx.beginPath()
  ctx.ellipse(cx + r * 0.4, cy - r * 1.1, r * 0.35, r * 0.18, 0.45, 0, Math.PI * 2)
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
  // 1. Inked Outline
  g.lineStyle(r * 0.22, 0x000000, alpha * 0.9)
  g.strokeCircle(cx, cy, r)

  // 2. Solid Body
  g.fillStyle(COLORS.food, alpha)
  g.fillCircle(cx, cy, r)

  // 3. Stem/Leaf
  g.fillStyle(0x3d2817, alpha)
  g.fillRect(cx - r * 0.1, cy - r * 1.25, r * 0.2, r * 0.4)
  g.fillStyle(0x2d9a3e, alpha)
  g.fillEllipse(cx + r * 0.4, cy - r * 1.1, r * 0.35 * 2, r * 0.18 * 2)
}

const isTileTone = (tone: GlossaryMarkerTone): boolean =>
  tone === 'ice' || tone === 'sand' || tone === 'squeeze'

/**
 * Procedural-only raster (no PNG). Runtime uses `markerBitmapDraw.drawMarkerSpriteCanvas` to prefer disk PNGs.
 * @see `markerVectorArt.ts`
 */
export const drawMarkerSpriteProcedural = (
  ctx: CanvasRenderingContext2D,
  tone: GlossaryMarkerTone,
  cx: number,
  cy: number,
  size: number,
): void => {
  const r = Math.max(3, size * 0.31)
  if (tone === 'core') {
    drawAppleMarkerCanvas(ctx, cx, cy, size)
    return
  }
  const paint = PAINT_BY_TONE[tone]
  if (isTileTone(tone)) {
    drawPremiumTileCanvas(ctx, cx, cy, r, paint)
  } else {
    drawPremiumTokenCanvas(ctx, cx, cy, r, paint)
  }
  drawVectorIconCanvas(ctx, tone, cx, cy, r, iconInkHex(paint))
}

export const drawMarkerSpritePhaser = (
  g: Phaser.GameObjects.Graphics,
  tone: GlossaryMarkerTone,
  cx: number,
  cy: number,
  size: number,
  alpha = 1,
): void => {
  const r = Math.max(3, size * 0.31)
  if (tone === 'core') {
    drawAppleMarkerPhaser(g, cx, cy, size, alpha)
    return
  }
  const paint = PAINT_BY_TONE[tone]
  if (isTileTone(tone)) {
    drawPremiumTilePhaser(g, cx, cy, r, paint, alpha)
  } else {
    drawPremiumTokenPhaser(g, cx, cy, r, paint, alpha)
  }
  drawVectorIconPhaser(g, tone, cx, cy, r, iconInkPhaser(paint), alpha)
}
