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
  ctx.closePath()
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
  ctx.fillStyle = paint.glow
  ctx.beginPath()
  ctx.arc(cx, cy, r + 1.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = paint.base
  ctx.beginPath()
  ctx.ellipse(cx, cy + r * 0.04, r * 0.9, r * 0.96, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.beginPath()
  ctx.ellipse(cx - r * 0.32, cy - r * 0.26, r * 0.38, r * 0.15, -0.45, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(0, 0, 0, 0.14)'
  ctx.beginPath()
  ctx.ellipse(cx + r * 0.22, cy + r * 0.34, r * 0.42, r * 0.16, 0.12, 0, Math.PI * 2)
  ctx.fill()

  if (paint.rim) {
    ctx.strokeStyle = paint.rim
    ctx.lineWidth = Math.max(1, r * 0.07)
    ctx.beginPath()
    ctx.ellipse(cx, cy + r * 0.04, r * 0.9, r * 0.96, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
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
  const glow = parse(paint.glow)
  const base = parse(paint.base)
  const rim = paint.rim ? parse(paint.rim) : undefined

  g.fillStyle(glow, alpha)
  g.fillCircle(cx, cy, r + 1.2)
  g.fillStyle(base, alpha)
  g.fillEllipse(cx, cy + r * 0.04, r * 0.9 * 2, r * 0.96 * 2)
  g.fillStyle(0xffffff, alpha * 0.3)
  g.fillEllipse(cx - r * 0.32, cy - r * 0.26, r * 0.38 * 2, r * 0.15 * 2)
  g.fillStyle(0x000000, alpha * 0.14)
  g.fillEllipse(cx + r * 0.22, cy + r * 0.34, r * 0.42 * 2, r * 0.16 * 2)
  if (rim !== undefined) {
    g.lineStyle(Math.max(1, r * 0.07), rim, alpha)
    g.strokeEllipse(cx, cy + r * 0.04, r * 0.9 * 2, r * 0.96 * 2)
  }
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
  ctx.fillStyle = paint.glow
  roundRectPath(ctx, x - 2, y - 2, w + 4, h + 4, rr + 2)
  ctx.fill()
  ctx.fillStyle = paint.base
  roundRectPath(ctx, x, y, w, h, rr)
  ctx.fill()
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)'
  roundRectPath(ctx, x + w * 0.1, y + h * 0.1, w * 0.55, h * 0.38, r * 0.15)
  ctx.fill()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.14)'
  roundRectPath(ctx, x + w * 0.1, y + h * 0.52, w * 0.85, h * 0.38, r * 0.15)
  ctx.fill()
  if (paint.rim) {
    ctx.strokeStyle = paint.rim
    ctx.lineWidth = Math.max(1, r * 0.07)
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
  g.fillStyle(parse(paint.glow), alpha)
  g.fillRoundedRect(x - 2, y - 2, w + 4, h + 4, rr + 2)
  g.fillStyle(parse(paint.base), alpha)
  g.fillRoundedRect(x, y, w, h, rr)
  g.fillStyle(0xffffff, alpha * 0.28)
  g.fillRoundedRect(x + w * 0.1, y + h * 0.1, w * 0.55, h * 0.38, r * 0.15)
  g.fillStyle(0x000000, alpha * 0.14)
  g.fillRoundedRect(x + w * 0.1, y + h * 0.52, w * 0.85, h * 0.38, r * 0.15)
  if (paint.rim) {
    g.lineStyle(Math.max(1, r * 0.07), parse(paint.rim), alpha)
    g.strokeRoundedRect(x, y, w, h, rr)
  }
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
      ctx.beginPath()
      ctx.moveTo(cx, cy - s * 0.95)
      ctx.quadraticCurveTo(cx + s * 0.95, cy - s * 0.35, cx + s * 0.82, cy + s * 0.55)
      ctx.lineTo(cx, cy + s * 0.95)
      ctx.lineTo(cx - s * 0.82, cy + s * 0.55)
      ctx.quadraticCurveTo(cx - s * 0.95, cy - s * 0.35, cx, cy - s * 0.95)
      ctx.closePath()
      ctx.globalAlpha = 0.95
      ctx.fill()
      ctx.globalAlpha = 1
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
      g.moveTo(cx, cy - s * 0.95)
      g.lineTo(cx + s * 0.82, cy + s * 0.55)
      g.lineTo(cx, cy + s * 0.95)
      g.lineTo(cx - s * 0.82, cy + s * 0.55)
      g.closePath()
      g.fillPath()
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
