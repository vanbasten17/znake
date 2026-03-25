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
  roundRectPath,
} from './markerVectorArt'

export { MARKER_SEMANTIC_ROLE, type MarkerSemanticRole } from './markerSemantics'

const toHex = (value: number): string => `#${value.toString(16).padStart(6, '0')}`

/**
 * Premium Squared Neon apple — reference quality (`core`). 
 * Follows "Circuit-Core" aesthetic: rounded square "chip" base + geometric stem + neon glow.
 */
const drawAppleMarkerCanvas = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
): void => {
  // Solid Unified Red look: Single consistent fill (no nested rim contrast)
  const r = Math.round(size * 0.44 * 2) / 2 
  const rr = Math.round(r * 0.48 * 2) / 2   
  const w = Math.round(r * 1.85 * 2) / 2
  const h = Math.round(r * 1.85 * 2) / 2
  
  const cx_adj = cx
  const cy_adj = cy + Math.round(r * 0.15 * 2) / 2 
  const x = Math.round((cx_adj - w / 2) * 2) / 2
  const y = Math.round((cy_adj - h / 2) * 2) / 2

  // 1. Thick Inked Outline (Body Boundary)
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = Math.round(w * 0.14 * 2) / 2
  roundRectPath(ctx, x, y, w, h, rr)
  ctx.stroke()

  // 2. Solid Body (Unified Core Color)
  ctx.fillStyle = toHex(COLORS.food)
  roundRectPath(ctx, x, y, w, h, rr)
  ctx.fill()

  // 3. Neon Highlight (Optional, very thin to avoid "box" effect)
  ctx.strokeStyle = toHex(COLORS.foodGlow)
  ctx.lineWidth = Math.round(w * 0.04 * 2) / 2
  roundRectPath(ctx, x, y, w, h, rr)
  ctx.stroke()

  // 4. Geometric Stem & Leaf
  ctx.fillStyle = '#f8fcff'
  ctx.fillRect(
    Math.round((cx - r * 0.1) * 2) / 2,
    Math.round((cy_adj - r * 1.35) * 2) / 2,
    Math.round(r * 0.2 * 2) / 2,
    Math.round(r * 0.45 * 2) / 2,
  )
  ctx.fillStyle = toHex(COLORS.venom)
  ctx.fillRect(
    Math.round((cx + r * 0.15) * 2) / 2,
    Math.round((cy_adj - r * 1.25) * 2) / 2,
    Math.round(r * 0.45 * 2) / 2,
    Math.round(r * 0.3 * 2) / 2,
  )
}

const drawAppleMarkerPhaser = (
  g: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  size: number,
  alpha: number,
): void => {
  // Solid Unified Red look
  const r = Math.round(size * 0.44 * 2) / 2 
  const rr = Math.round(r * 0.48 * 2) / 2   
  const w = Math.round(r * 1.85 * 2) / 2
  const h = Math.round(r * 1.85 * 2) / 2
  
  const cx_adj = cx
  const cy_adj = cy + Math.round(r * 0.15 * 2) / 2
  const x = Math.round((cx_adj - w / 2) * 2) / 2
  const y = Math.round((cy_adj - h / 2) * 2) / 2

  // 1. Thick Inked Outline (Body Boundary)
  g.lineStyle(Math.round(w * 0.14 * 2) / 2, 0x000000, alpha * 0.9)
  g.strokeRoundedRect(x, y, w, h, rr)

  // 2. Solid Body (Unified Core Color)
  g.fillStyle(COLORS.food, alpha)
  g.fillRoundedRect(x, y, w, h, rr)

  // 3. Neon Highlight (Subtle)
  g.lineStyle(Math.round(w * 0.04 * 2) / 2, COLORS.foodGlow, alpha)
  g.strokeRoundedRect(x, y, w, h, rr)

  // 4. Geometric Stem & Leaf
  g.fillStyle(0xf8fcff, alpha * 0.9)
  g.fillRect(
    Math.round((cx - r * 0.1) * 2) / 2,
    Math.round((cy_adj - r * 1.35) * 2) / 2,
    Math.round(r * 0.2 * 2) / 2,
    Math.round(r * 0.45 * 2) / 2,
  )
  g.fillStyle(COLORS.venom, alpha * 0.9)
  g.fillRect(
    Math.round((cx + r * 0.15) * 2) / 2,
    Math.round((cy_adj - r * 1.25) * 2) / 2,
    Math.round(r * 0.45 * 2) / 2,
    Math.round(r * 0.3 * 2) / 2,
  )
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
