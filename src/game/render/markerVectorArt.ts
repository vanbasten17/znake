/**
 * Premium marker art — same visual language as `core` (apple): soft outer glow, ellipsoid body,
 * specular + contact shadow, vector icon (no 5×5 bitmap grid).
 */
import type Phaser from 'phaser'
import { COLORS } from '../core/constants'
import type { GlossaryMarkerTone } from '../core/glossary'

const toHex = (value: number): string => `#${value.toString(16).padStart(6, '0')}`

const D2R = (deg: number) => (deg * Math.PI) / 180

/** Rounded-rect path (canvas) — same “chip” feel as the apple token. */
const roundRectPath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rr: number,
): void => {
  const rad = Math.min(rr, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rad, y)
  ctx.arcTo(x + w, y, x + w, y + h, rad)
  ctx.arcTo(x + w, y + h, x, y + h, rad)
  ctx.arcTo(x, y + h, x, y, rad)
  ctx.arcTo(x, y, x + w, y, rad)
}

/** Draw a diagonal hatching pattern inside a rectangle (simplified clipping). */
export const drawHatchPatternPhaser = (
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
  color: number,
  alpha: number,
  spacing = 5,
  thickness = 1,
): void => {
  g.lineStyle(thickness, color, alpha)
  for (let offset = -h; offset < w; offset += spacing) {
    const startX = Math.max(x, x + offset)
    const startY = y + (startX - (x + offset))
    const endX = Math.min(x + w, x + offset + h)
    const endY = y + (endX - (x + offset))
    if (startX < endX) {
      g.moveTo(startX, startY)
      g.lineTo(endX, endY)
    }
  }
  g.strokePath()
}

/** Draw a shaky "hand-drawn" path. */
export const drawJitteredPathPhaser = (
  g: Phaser.GameObjects.Graphics,
  points: { x: number; y: number }[],
  jitter = 0.65,
  segmentsCount = 4,
): void => {
  if (points.length < 2) return
  g.moveTo(points[0].x, points[0].y)
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    const dx = (p2.x - p1.x) / segmentsCount
    const dy = (p2.y - p1.y) / segmentsCount
    for (let j = 1; j <= segmentsCount; j += 1) {
      const jx = (Math.random() - 0.5) * jitter
      const jy = (Math.random() - 0.5) * jitter
      g.lineTo(p1.x + dx * j + jx, p1.y + dy * j + jy)
    }
  }
}

export type TokenPaint = {
  /** Outer halo (brighter than base) */
  glow: string
  /** Main token fill */
  base: string
  /** Optional rim stroke (hex) */
  rim?: string
}

/** Per-tone body colors (aligned with markerSemantics / gameplay). */
const PAINT: Record<GlossaryMarkerTone, TokenPaint> = {
  core: { glow: toHex(COLORS.foodGlow), base: toHex(COLORS.food) },
  biomeCore: { glow: toHex(COLORS.portalGlow), base: '#4ad4e8', rim: toHex(COLORS.portal) },
  portal: { glow: '#4adfff', base: toHex(COLORS.portal), rim: '#9ff8ee' },
  battery: { glow: '#aa88ff', base: '#7a55ee', rim: '#d4c4ff' },
  beacon: { glow: '#ffe8a0', base: toHex(COLORS.beacon), rim: '#fff2c8' },
  shield: { glow: '#44c8ff', base: toHex(COLORS.shield), rim: '#b8ecff' },
  slow: { glow: '#ffb8e0', base: toHex(COLORS.slow), rim: '#ffe0f2' },
  ghost: { glow: '#d8d8ff', base: '#a8a8f0', rim: '#e8e8ff' },
  score: { glow: '#ffe866', base: toHex(COLORS.powerup), rim: '#fff4a8' },
  venom: { glow: '#86ffc0', base: toHex(COLORS.venom), rim: '#c8ffe0' },
  darkness: { glow: '#1a2240', base: '#0a0d18', rim: '#3a4a78' },
  squeeze: { glow: '#2a2548', base: '#1a1530', rim: '#e8a035' },
  ice: { glow: '#9ad4f8', base: '#6ab8e8', rim: '#d8f0ff' },
  sand: { glow: '#e8c878', base: '#c49a3a', rim: '#f5e0a8' },
  rift: { glow: '#d060ff', base: '#a028e8', rim: '#f0a8ff' },
  enemyNormal: { glow: '#ff8844', base: toHex(COLORS.enemy), rim: '#ffcc88' },
  enemyStalker: { glow: '#ff66aa', base: '#ff3388', rim: '#ffc0dd' },
  enemyAmbusher: { glow: '#c090ff', base: '#a855f0', rim: '#e8d0ff' },
  enemyEgg: { glow: '#ffe8a0', base: '#f0d060', rim: '#fff8d8' },
  enemyMirror: { glow: '#78d0f8', base: '#48b8e8', rim: '#c8ecff' },
  enemyBoss: { glow: '#ffb040', base: '#ff9500', rim: '#ffe0a8' },
  talentSpeed: { glow: '#ffe866', base: '#ffd030', rim: '#fff4b0' },
  talentSurvival: { glow: '#78d8ff', base: '#40c8ff', rim: '#c8f0ff' },
  talentHunt: { glow: '#ffb070', base: '#ff8840', rim: '#ffd8b8' },
}

const isLightBase = (hex: string): boolean => {
  const h = hex.replace('#', '')
  const r = Number.parseInt(h.slice(0, 2), 16)
  const g = Number.parseInt(h.slice(2, 4), 16)
  const b = Number.parseInt(h.slice(4, 6), 16)
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return lum > 0.62
}

export const iconInkHex = (paint: TokenPaint): string =>
  isLightBase(paint.base) ? '#1a1530' : 'rgba(248,252,255,0.94)'

export const iconInkPhaser = (paint: TokenPaint): number =>
  isLightBase(paint.base) ? 0x1a1530 : 0xf8fcff

/** Apple-quality token shell: glow + ellipsoid + specular + contact shadow (+ optional rim). */
export const drawPremiumTokenCanvas = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  paint: TokenPaint,
): void => {
  // 1. Thick Inked Outline
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = r * 0.25
  ctx.globalAlpha = 0.9
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()

  // 2. Solid Body
  ctx.fillStyle = paint.base
  ctx.globalAlpha = 1
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()

  // 3. Neon Rim
  ctx.strokeStyle = paint.glow
  ctx.lineWidth = Math.max(1, r * 0.08)
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
}

export const drawPremiumTokenPhaser = (
  g: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  r: number,
  paint: TokenPaint,
  alpha: number,
): void => {
  const parse = (hex: string): number => Number.parseInt(hex.replace('#', ''), 16)
  const base = parse(paint.base)
  const glow = parse(paint.glow)

  // 1. Thick Inked Outline
  g.lineStyle(r * 0.25, 0x000000, alpha * 0.9)
  g.strokeCircle(cx, cy, r)

  // 2. Solid Body
  g.fillStyle(base, alpha)
  g.fillCircle(cx, cy, r)

  // 3. Neon Rim
  g.lineStyle(Math.max(1, r * 0.08), glow, alpha)
  g.strokeCircle(cx, cy, r)
}

/** Square-ish token with rounded corners — hazards / terrain (gel, arena, sorra). */
export const drawPremiumTileCanvas = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  paint: TokenPaint,
): void => {
  const w = r * 1.85
  const h = r * 1.85
  const x = cx - w / 2
  const y = cy - h / 2
  const rr = r * 0.42

  // 1. Thick Inked Outline
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = w * 0.2
  roundRectPath(ctx, x, y, w, h, rr)
  ctx.stroke()

  // 2. Solid Base
  ctx.fillStyle = paint.base
  roundRectPath(ctx, x, y, w, h, rr)
  ctx.fill()

  // 3. Neon Rim
  if (paint.rim) {
    ctx.strokeStyle = paint.rim
    ctx.lineWidth = Math.max(1, r * 0.1)
    roundRectPath(ctx, x, y, w, h, rr)
    ctx.stroke()
  }
}

export const drawPremiumTilePhaser = (
  g: Phaser.GameObjects.Graphics,
  cx: number,
  cy: number,
  r: number,
  paint: TokenPaint,
  alpha: number,
): void => {
  const parse = (hex: string): number => Number.parseInt(hex.replace('#', ''), 16)
  const w = r * 1.85
  const h = r * 1.85
  const x = cx - w / 2
  const y = cy - h / 2
  const rr = r * 0.42

  // 1. Thick Inked Outline
  g.lineStyle(w * 0.2, 0x000000, alpha * 0.9)
  g.strokeRoundedRect(x, y, w, h, rr)

  // 2. Solid Base
  g.fillStyle(parse(paint.base), alpha)
  g.fillRoundedRect(x, y, w, h, rr)

  // 3. Neon Rim
  if (paint.rim) {
    g.lineStyle(Math.max(1, r * 0.1), parse(paint.rim), alpha)
    g.strokeRoundedRect(x, y, w, h, rr)
  }
}

/**
 * Modular squared segment (snake/enemy).
 * Features: Rounded-rect base + nested core rect + glowing rim.
 */
export const drawPremiumSegmentPhaser = (
  g: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
  color: number,
  glow: number,
  alpha: number,
  isHead = false,
  jitter = 0.4,
): void => {
  const rr = isHead ? w * 0.35 : w * 0.28

  // 1. Thick "Inked" Outline (Cell-Shading)
  g.lineStyle(w * 0.15, 0x000000, alpha * 0.9)
  g.strokeRoundedRect(x, y, w, h, rr)

  // 2. Solid Color Body
  g.fillStyle(color, alpha)
  g.fillRoundedRect(x, y, w, h, rr)

  // 3. Pronounced Neon Rim (on top of ink)
  g.lineStyle(w * 0.08, glow, alpha)
  const pts = [
    { x: x + rr, y: y },
    { x: x + w - rr, y: y },
    { x: x + w, y: y + rr },
    { x: x + w, y: y + h - rr },
    { x: x + w - rr, y: y + h },
    { x: x + rr, y: y + h },
    { x: x, y: y + h - rr },
    { x: x, y: y + rr },
    { x: x + rr, y: y },
  ]
  g.beginPath()
  drawJitteredPathPhaser(g, pts, jitter, 2)
  g.strokePath()
}

export const drawPremiumSegmentCanvas = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  glow: string,
  alpha: number,
  isHead = false,
  jitter = 0.4,
): void => {
  const rr = isHead ? w * 0.35 : w * 0.28
  ctx.globalAlpha = alpha

  // 1. Thick "Inked" Outline
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = w * 0.15
  roundRectPath(ctx, x, y, w, h, rr)
  ctx.stroke()

  // 2. Solid Body
  ctx.fillStyle = color
  roundRectPath(ctx, x, y, w, h, rr)
  ctx.fill()

  // 3. Neon Rim
  ctx.strokeStyle = glow
  ctx.lineWidth = w * 0.08
  const pts = [
    { x: x + rr, y: y },
    { x: x + w - rr, y: y },
    { x: x + w, y: y + rr },
    { x: x + w, y: y + h - rr },
    { x: x + w - rr, y: y + h },
    { x: x + rr, y: y + h },
    { x: x, y: y + h - rr },
    { x: x, y: y + rr },
    { x: x + rr, y: y },
  ]
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const dx = (p2.x - p1.x) / 3
    const dy = (p2.y - p1.y) / 3
    for (let j = 1; j <= 3; j += 1) {
      ctx.lineTo(
        p1.x + dx * j + (Math.random() - 0.5) * jitter,
        p1.y + dy * j + (Math.random() - 0.5) * jitter,
      )
    }
  }
  ctx.stroke()

  ctx.globalAlpha = 1
}

const ir = (r: number) => r * 0.48

/** Vector icon on top of premium token (centered). */
export const drawVectorIconCanvas = (
  ctx: CanvasRenderingContext2D,
  tone: GlossaryMarkerTone,
  cx: number,
  cy: number,
  r: number,
  ink: string,
): void => {
  const s = ir(r)
  ctx.fillStyle = ink
  ctx.strokeStyle = ink
  ctx.lineWidth = Math.max(1, r * 0.09)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  switch (tone) {
    case 'core':
      break
    case 'biomeCore': {
      ctx.beginPath()
      ctx.moveTo(cx, cy - s)
      ctx.lineTo(cx + s * 0.92, cy)
      ctx.lineTo(cx, cy + s)
      ctx.lineTo(cx - s * 0.92, cy)
      ctx.closePath()
      ctx.globalAlpha = 0.92
      ctx.fill()
      ctx.globalAlpha = 1
      break
    }
    case 'portal': {
      ctx.beginPath()
      ctx.arc(cx, cy + s * 0.15, s * 0.85, Math.PI * 1.12, Math.PI * 1.88)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx - s * 0.62, cy - s * 0.35)
      ctx.lineTo(cx - s * 0.62, cy + s * 0.55)
      ctx.moveTo(cx + s * 0.62, cy - s * 0.35)
      ctx.lineTo(cx + s * 0.62, cy + s * 0.55)
      ctx.stroke()
      break
    }
    case 'battery': {
      ctx.fillRect(cx - s * 0.35, cy - s * 1.05, s * 0.7, s * 0.22)
      ctx.strokeRect(cx - s * 0.55, cy - s * 0.75, s * 1.1, s * 1.35)
      ctx.fillRect(cx - s * 0.2, cy + s * 0.62, s * 0.4, s * 0.12)
      break
    }
    case 'beacon': {
      ctx.beginPath()
      ctx.arc(cx, cy, s * 0.78, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy, s * 0.48, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy, s * 0.18, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'shield': {
      // Outer shield (top arc + downward tip)
      ctx.beginPath()
      ctx.moveTo(cx - s * 0.78, cy - s * 0.45)
      ctx.quadraticCurveTo(cx, cy - s * 0.98, cx + s * 0.78, cy - s * 0.45)
      ctx.lineTo(cx + s * 0.64, cy + s * 0.34)
      ctx.lineTo(cx, cy + s * 0.96)
      ctx.lineTo(cx - s * 0.64, cy + s * 0.34)
      ctx.closePath()
      ctx.globalAlpha = 0.95
      ctx.fill()
      ctx.globalAlpha = 1
      // Inner inset
      ctx.lineWidth = Math.max(1, s * 0.16)
      ctx.strokeStyle = isLightBase(PAINT.shield.base)
        ? 'rgba(26, 21, 48, 0.5)'
        : 'rgba(248, 252, 255, 0.58)'
      ctx.beginPath()
      ctx.moveTo(cx - s * 0.5, cy - s * 0.34)
      ctx.quadraticCurveTo(cx, cy - s * 0.65, cx + s * 0.5, cy - s * 0.34)
      ctx.lineTo(cx + s * 0.4, cy + s * 0.22)
      ctx.lineTo(cx, cy + s * 0.62)
      ctx.lineTo(cx - s * 0.4, cy + s * 0.22)
      ctx.closePath()
      ctx.stroke()
      break
    }
    case 'slow': {
      ctx.beginPath()
      ctx.moveTo(cx - s * 0.75, cy - s * 0.85)
      ctx.lineTo(cx + s * 0.75, cy - s * 0.85)
      ctx.lineTo(cx, cy)
      ctx.lineTo(cx + s * 0.75, cy + s * 0.85)
      ctx.lineTo(cx - s * 0.75, cy + s * 0.85)
      ctx.lineTo(cx, cy)
      ctx.closePath()
      ctx.globalAlpha = 0.9
      ctx.fill()
      ctx.globalAlpha = 1
      break
    }
    case 'ghost': {
      ctx.beginPath()
      ctx.arc(cx, cy - s * 0.15, s * 0.72, Math.PI, 0, true)
      ctx.lineTo(cx + s * 0.72, cy + s * 0.45)
      ctx.quadraticCurveTo(cx + s * 0.45, cy + s * 0.85, cx + s * 0.15, cy + s * 0.72)
      ctx.quadraticCurveTo(cx, cy + s * 0.95, cx - s * 0.15, cy + s * 0.72)
      ctx.quadraticCurveTo(cx - s * 0.45, cy + s * 0.85, cx - s * 0.72, cy + s * 0.45)
      ctx.closePath()
      ctx.globalAlpha = 0.95
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.fillStyle = isLightBase(PAINT.ghost.base) ? '#1a1530' : 'rgba(10,12,24,0.55)'
      ctx.beginPath()
      ctx.arc(cx - s * 0.28, cy - s * 0.18, s * 0.12, 0, Math.PI * 2)
      ctx.arc(cx + s * 0.28, cy - s * 0.18, s * 0.12, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'score': {
      const spikes = 4
      ctx.beginPath()
      for (let i = 0; i < spikes * 2; i += 1) {
        const a = (Math.PI / spikes) * i - Math.PI / 2
        const rad = i % 2 === 0 ? s * 0.88 : s * 0.38
        const px = cx + Math.cos(a) * rad
        const py = cy + Math.sin(a) * rad
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      break
    }
    case 'venom': {
      ctx.beginPath()
      ctx.moveTo(cx + s * 0.15, cy - s * 0.85)
      ctx.quadraticCurveTo(cx + s * 0.95, cy - s * 0.1, cx, cy + s * 0.95)
      ctx.quadraticCurveTo(cx - s * 0.95, cy - s * 0.1, cx - s * 0.15, cy - s * 0.85)
      ctx.quadraticCurveTo(cx - s * 0.05, cy - s * 0.45, cx + s * 0.15, cy - s * 0.85)
      ctx.fill()
      break
    }
    case 'darkness': {
      ctx.beginPath()
      ctx.arc(cx - s * 0.18, cy, s * 0.78, -Math.PI * 0.35, Math.PI * 0.35)
      ctx.lineTo(cx + s * 0.35, cy + s * 0.82)
      ctx.quadraticCurveTo(cx - s * 0.1, cy + s * 0.25, cx - s * 0.55, cy - s * 0.2)
      ctx.closePath()
      ctx.globalAlpha = 0.9
      ctx.fill()
      ctx.globalAlpha = 1
      break
    }
    case 'squeeze': {
      ctx.strokeStyle = ink
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath()
        ctx.moveTo(cx + i * s * 0.55, cy - s * 0.85)
        ctx.lineTo(cx + i * s * 0.55, cy + s * 0.85)
        ctx.stroke()
      }
      break
    }
    case 'ice': {
      for (let k = 0; k < 4; k += 1) {
        const a = (Math.PI / 2) * k - Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(a) * s * 0.95, cy + Math.sin(a) * s * 0.95)
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(cx - s * 0.65, cy)
      ctx.lineTo(cx + s * 0.65, cy)
      ctx.moveTo(cx, cy - s * 0.65)
      ctx.lineTo(cx, cy + s * 0.65)
      ctx.stroke()
      break
    }
    case 'sand': {
      const dots = [
        [0, -0.55],
        [-0.45, 0.2],
        [0.5, 0.35],
        [-0.25, -0.15],
        [0.3, -0.35],
      ] as const
      for (const [dx, dy] of dots) {
        ctx.beginPath()
        ctx.arc(cx + dx * s, cy + dy * s, r * 0.1, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'rift': {
      ctx.lineWidth = Math.max(1.5, r * 0.11)
      ctx.beginPath()
      ctx.moveTo(cx - s * 0.85, cy - s * 0.85)
      ctx.lineTo(cx + s * 0.85, cy + s * 0.85)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx + s * 0.85, cy - s * 0.85)
      ctx.lineTo(cx - s * 0.85, cy + s * 0.85)
      ctx.stroke()
      ctx.lineWidth = Math.max(1, r * 0.09)
      break
    }
    case 'enemyNormal': {
      ctx.beginPath()
      ctx.arc(cx, cy - s * 0.12, s * 0.72, Math.PI * 0.15, Math.PI * 0.85)
      ctx.lineTo(cx - s * 0.55, cy + s * 0.65)
      ctx.lineTo(cx + s * 0.55, cy + s * 0.65)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = isLightBase(PAINT.enemyNormal.base) ? '#1a1530' : 'rgba(255,248,240,0.9)'
      ctx.beginPath()
      ctx.arc(cx - s * 0.25, cy - s * 0.25, s * 0.12, 0, Math.PI * 2)
      ctx.arc(cx + s * 0.25, cy - s * 0.25, s * 0.12, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'enemyStalker': {
      ctx.beginPath()
      ctx.moveTo(cx - s * 0.2, cy - s * 0.95)
      ctx.lineTo(cx + s * 0.35, cy)
      ctx.lineTo(cx - s * 0.1, cy + s * 0.15)
      ctx.lineTo(cx + s * 0.55, cy + s * 0.95)
      ctx.stroke()
      break
    }
    case 'enemyAmbusher': {
      ctx.beginPath()
      ctx.moveTo(cx - s * 0.85, cy + s * 0.35)
      ctx.lineTo(cx + s * 0.15, cy - s * 0.15)
      ctx.lineTo(cx + s * 0.85, cy + s * 0.35)
      ctx.closePath()
      ctx.fill()
      break
    }
    case 'enemyEgg': {
      ctx.strokeStyle = ink
      ctx.beginPath()
      ctx.moveTo(cx - s * 0.45, cy - s * 0.15)
      ctx.quadraticCurveTo(cx, cy + s * 0.25, cx + s * 0.45, cy - s * 0.15)
      ctx.stroke()
      break
    }
    case 'enemyMirror': {
      ctx.globalAlpha = 0.85
      ctx.fillRect(cx - s * 0.12, cy - s * 0.85, s * 0.24, s * 1.7)
      ctx.globalAlpha = 1
      break
    }
    case 'enemyBoss': {
      ctx.beginPath()
      ctx.moveTo(cx - s * 0.85, cy + s * 0.35)
      ctx.lineTo(cx - s * 0.55, cy - s * 0.55)
      ctx.lineTo(cx - s * 0.15, cy - s * 0.25)
      ctx.lineTo(cx, cy - s * 0.85)
      ctx.lineTo(cx + s * 0.15, cy - s * 0.25)
      ctx.lineTo(cx + s * 0.55, cy - s * 0.55)
      ctx.lineTo(cx + s * 0.85, cy + s * 0.35)
      ctx.closePath()
      ctx.fill()
      break
    }
    case 'talentSpeed': {
      for (let i = 0; i < 3; i += 1) {
        const ox = (i - 1) * s * 0.42
        ctx.beginPath()
        ctx.moveTo(cx + ox - s * 0.25, cy)
        ctx.lineTo(cx + ox + s * 0.45, cy - s * 0.35)
        ctx.lineTo(cx + ox + s * 0.45, cy + s * 0.35)
        ctx.closePath()
        ctx.fill()
      }
      break
    }
    case 'talentSurvival': {
      const t = s * 0.55
      ctx.fillRect(cx - t * 0.22, cy - t, t * 0.44, t * 2)
      ctx.fillRect(cx - t, cy - t * 0.22, t * 2, t * 0.44)
      break
    }
    case 'talentHunt': {
      ctx.lineWidth = Math.max(1, r * 0.08)
      ctx.strokeStyle = ink
      ctx.beginPath()
      ctx.arc(cx, cy, s * 0.72, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx, cy - s * 0.95)
      ctx.lineTo(cx, cy + s * 0.95)
      ctx.moveTo(cx - s * 0.95, cy)
      ctx.lineTo(cx + s * 0.95, cy)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx, cy, s * 0.18, 0, Math.PI * 2)
      ctx.fill()
      break
    }
  }
}

/** Phaser mirror: premium body + simplified vector icon (stroke/fill primitives). */
export const drawVectorIconPhaser = (
  g: Phaser.GameObjects.Graphics,
  tone: GlossaryMarkerTone,
  cx: number,
  cy: number,
  r: number,
  ink: number,
  alpha: number,
): void => {
  if (tone === 'core') return
  const s = ir(r)
  const lw = Math.max(1, r * 0.09)

  g.lineStyle(lw, ink, alpha)
  g.fillStyle(ink, alpha * 0.94)

  switch (tone) {
    case 'biomeCore':
      g.beginPath()
      g.moveTo(cx, cy - s)
      g.lineTo(cx + s * 0.92, cy)
      g.lineTo(cx, cy + s)
      g.lineTo(cx - s * 0.92, cy)
      g.closePath()
      g.fillPath()
      break
    case 'portal': {
      g.lineStyle(lw, ink, alpha)
      g.beginPath()
      g.arc(cx, cy + s * 0.15, s * 0.85, D2R(200), D2R(340))
      g.strokePath()
      g.beginPath()
      g.moveTo(cx - s * 0.62, cy - s * 0.35)
      g.lineTo(cx - s * 0.62, cy + s * 0.55)
      g.moveTo(cx + s * 0.62, cy - s * 0.35)
      g.lineTo(cx + s * 0.62, cy + s * 0.55)
      g.strokePath()
      break
    }
    case 'battery':
      g.fillStyle(ink, alpha)
      g.fillRect(cx - s * 0.35, cy - s * 1.05, s * 0.7, s * 0.22)
      g.strokeRect(cx - s * 0.55, cy - s * 0.75, s * 1.1, s * 1.35)
      g.fillRect(cx - s * 0.2, cy + s * 0.62, s * 0.4, s * 0.12)
      break
    case 'beacon':
      g.strokeCircle(cx, cy, s * 0.78)
      g.strokeCircle(cx, cy, s * 0.48)
      g.fillCircle(cx, cy, s * 0.18)
      break
    case 'shield': {
      g.beginPath()
      g.moveTo(cx - s * 0.78, cy - s * 0.45)
      g.lineTo(cx - s * 0.38, cy - s * 0.82)
      g.lineTo(cx + s * 0.38, cy - s * 0.82)
      g.lineTo(cx + s * 0.78, cy - s * 0.45)
      g.lineTo(cx + s * 0.64, cy + s * 0.34)
      g.lineTo(cx, cy + s * 0.96)
      g.lineTo(cx - s * 0.64, cy + s * 0.34)
      g.closePath()
      g.fillPath()
      g.lineStyle(
        Math.max(1, lw * 0.85),
        isLightBase(PAINT.shield.base) ? 0x1a1530 : 0xf8fcff,
        alpha * 0.58,
      )
      g.strokePath()
      g.beginPath()
      g.moveTo(cx - s * 0.5, cy - s * 0.34)
      g.lineTo(cx - s * 0.26, cy - s * 0.57)
      g.lineTo(cx + s * 0.26, cy - s * 0.57)
      g.lineTo(cx + s * 0.5, cy - s * 0.34)
      g.lineTo(cx + s * 0.4, cy + s * 0.22)
      g.lineTo(cx, cy + s * 0.62)
      g.lineTo(cx - s * 0.4, cy + s * 0.22)
      g.closePath()
      g.strokePath()
      break
    }
    case 'slow': {
      g.beginPath()
      g.moveTo(cx - s * 0.75, cy - s * 0.85)
      g.lineTo(cx + s * 0.75, cy - s * 0.85)
      g.lineTo(cx, cy)
      g.lineTo(cx + s * 0.75, cy + s * 0.85)
      g.lineTo(cx - s * 0.75, cy + s * 0.85)
      g.lineTo(cx, cy)
      g.closePath()
      g.fillPath()
      break
    }
    case 'ghost': {
      g.beginPath()
      g.arc(cx, cy - s * 0.15, s * 0.72, Math.PI, 0, true)
      g.lineTo(cx + s * 0.72, cy + s * 0.45)
      g.lineTo(cx - s * 0.72, cy + s * 0.45)
      g.closePath()
      g.fillPath()
      g.fillStyle(0x1a1530, alpha * 0.55)
      g.fillCircle(cx - s * 0.28, cy - s * 0.18, s * 0.12)
      g.fillCircle(cx + s * 0.28, cy - s * 0.18, s * 0.12)
      break
    }
    case 'score': {
      g.beginPath()
      for (let i = 0; i < 8; i += 1) {
        const a = (Math.PI / 4) * i - Math.PI / 2
        const rad = i % 2 === 0 ? s * 0.88 : s * 0.38
        const px = cx + Math.cos(a) * rad
        const py = cy + Math.sin(a) * rad
        if (i === 0) g.moveTo(px, py)
        else g.lineTo(px, py)
      }
      g.closePath()
      g.fillPath()
      break
    }
    case 'venom': {
      g.beginPath()
      g.moveTo(cx + s * 0.15, cy - s * 0.85)
      g.lineTo(cx, cy + s * 0.95)
      g.lineTo(cx - s * 0.15, cy - s * 0.85)
      g.closePath()
      g.fillPath()
      break
    }
    case 'darkness': {
      g.beginPath()
      g.arc(cx - s * 0.18, cy, s * 0.78, D2R(-35), D2R(35))
      g.lineTo(cx + s * 0.35, cy + s * 0.82)
      g.closePath()
      g.fillPath()
      break
    }
    case 'squeeze':
      for (let i = -1; i <= 1; i += 1) {
        g.beginPath()
        g.moveTo(cx + i * s * 0.55, cy - s * 0.85)
        g.lineTo(cx + i * s * 0.55, cy + s * 0.85)
        g.strokePath()
      }
      break
    case 'ice':
      for (let k = 0; k < 4; k += 1) {
        const a = (Math.PI / 2) * k - Math.PI / 2
        g.beginPath()
        g.moveTo(cx, cy)
        g.lineTo(cx + Math.cos(a) * s * 0.95, cy + Math.sin(a) * s * 0.95)
        g.strokePath()
      }
      g.beginPath()
      g.moveTo(cx - s * 0.65, cy)
      g.lineTo(cx + s * 0.65, cy)
      g.moveTo(cx, cy - s * 0.65)
      g.lineTo(cx, cy + s * 0.65)
      g.strokePath()
      break
    case 'sand':
      for (const [dx, dy] of [
        [0, -0.55],
        [-0.45, 0.2],
        [0.5, 0.35],
        [-0.25, -0.15],
        [0.3, -0.35],
      ] as const) {
        g.fillCircle(cx + dx * s, cy + dy * s, r * 0.1)
      }
      break
    case 'rift': {
      g.lineStyle(Math.max(1.5, r * 0.11), ink, alpha)
      g.beginPath()
      g.moveTo(cx - s * 0.85, cy - s * 0.85)
      g.lineTo(cx + s * 0.85, cy + s * 0.85)
      g.strokePath()
      g.beginPath()
      g.moveTo(cx + s * 0.85, cy - s * 0.85)
      g.lineTo(cx - s * 0.85, cy + s * 0.85)
      g.strokePath()
      break
    }
    case 'enemyNormal': {
      g.fillStyle(ink, alpha)
      g.beginPath()
      g.arc(cx, cy - s * 0.12, s * 0.72, D2R(30), D2R(150))
      g.lineTo(cx - s * 0.55, cy + s * 0.65)
      g.lineTo(cx + s * 0.55, cy + s * 0.65)
      g.closePath()
      g.fillPath()
      g.fillStyle(0xfff8f0, alpha * 0.9)
      g.fillCircle(cx - s * 0.25, cy - s * 0.25, s * 0.12)
      g.fillCircle(cx + s * 0.25, cy - s * 0.25, s * 0.12)
      break
    }
    case 'enemyStalker': {
      g.beginPath()
      g.moveTo(cx - s * 0.2, cy - s * 0.95)
      g.lineTo(cx + s * 0.35, cy)
      g.lineTo(cx - s * 0.1, cy + s * 0.15)
      g.lineTo(cx + s * 0.55, cy + s * 0.95)
      g.strokePath()
      break
    }
    case 'enemyAmbusher': {
      g.beginPath()
      g.moveTo(cx - s * 0.85, cy + s * 0.35)
      g.lineTo(cx + s * 0.15, cy - s * 0.15)
      g.lineTo(cx + s * 0.85, cy + s * 0.35)
      g.closePath()
      g.fillPath()
      break
    }
    case 'enemyEgg': {
      g.beginPath()
      g.moveTo(cx - s * 0.45, cy - s * 0.15)
      g.lineTo(cx + s * 0.45, cy - s * 0.15)
      g.strokePath()
      break
    }
    case 'enemyMirror':
      g.fillRect(cx - s * 0.12, cy - s * 0.85, s * 0.24, s * 1.7)
      break
    case 'enemyBoss': {
      g.beginPath()
      g.moveTo(cx - s * 0.85, cy + s * 0.35)
      g.lineTo(cx, cy - s * 0.85)
      g.lineTo(cx + s * 0.85, cy + s * 0.35)
      g.closePath()
      g.fillPath()
      break
    }
    case 'talentSpeed':
      for (let i = 0; i < 3; i += 1) {
        const ox = (i - 1) * s * 0.42
        g.beginPath()
        g.moveTo(cx + ox - s * 0.25, cy)
        g.lineTo(cx + ox + s * 0.45, cy - s * 0.35)
        g.lineTo(cx + ox + s * 0.45, cy + s * 0.35)
        g.closePath()
        g.fillPath()
      }
      break
    case 'talentSurvival': {
      const t = s * 0.55
      g.fillRect(cx - t * 0.22, cy - t, t * 0.44, t * 2)
      g.fillRect(cx - t, cy - t * 0.22, t * 2, t * 0.44)
      break
    }
    case 'talentHunt': {
      g.lineStyle(lw, ink, alpha)
      g.strokeCircle(cx, cy, s * 0.72)
      g.beginPath()
      g.moveTo(cx, cy - s * 0.95)
      g.lineTo(cx, cy + s * 0.95)
      g.moveTo(cx - s * 0.95, cy)
      g.lineTo(cx + s * 0.95, cy)
      g.strokePath()
      g.fillStyle(ink, alpha)
      g.fillCircle(cx, cy, s * 0.18)
      break
    }
  }
}

export const PAINT_BY_TONE = PAINT
