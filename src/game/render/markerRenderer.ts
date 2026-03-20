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
  ctx.fillStyle = toHex(COLORS.foodGlow)
  ctx.beginPath()
  ctx.arc(cx, cy, r + 1.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = toHex(COLORS.food)
  ctx.beginPath()
  ctx.ellipse(cx, cy + r * 0.06, r * 0.88, r * 1.06, 0, 0, Math.PI * 2)
  ctx.fill()
  /* Thin rim: reads cleaner at high export scale + NEAREST (less “chunky” silhouette). */
  ctx.strokeStyle = 'rgba(72, 22, 32, 0.5)'
  ctx.lineWidth = Math.max(0.6, r * 0.05)
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.ellipse(cx, cy + r * 0.06, r * 0.88, r * 1.06, 0, 0, Math.PI * 2)
  ctx.stroke()
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
  g.lineStyle(Math.max(0.6, r * 0.05), 0x481620, alpha * 0.5)
  g.strokeEllipse(cx, cy + r * 0.06, r * 0.88 * 2, r * 1.06 * 2)
  g.fillStyle(0x3d2817, alpha)
  g.fillRect(cx - Math.max(0.5, r * 0.14), cy - r * 1.32, Math.max(1, r * 0.28), r * 0.42)
  g.fillStyle(0x2d9a3e, alpha)
  g.fillEllipse(cx + r * 0.52, cy - r * 1.18, r * 0.4 * 2, r * 0.2 * 2)
  g.fillStyle(0xffffff, alpha * 0.42)
  g.fillEllipse(cx - r * 0.38, cy - r * 0.22, r * 0.24 * 2, r * 0.11 * 2)
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
