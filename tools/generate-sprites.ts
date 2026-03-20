/**
 * Exports PNGs of the current procedural marker art (same pipeline as `markerHiRes` / glossary).
 * Uses `drawMarkerSpriteCanvas` from `src/game/render/markerRenderer.ts`.
 *
 * Logical frame / inner size / default scale: `src/game/render/markerExportSpec.ts`.
 *
 * Run: `pnpm generate:sprites`
 * Optional: `SPRITE_EXPORT_SCALE=4 pnpm generate:sprites` (default from `MARKER_EXPORT_SCALE_DEFAULT` in spec).
 * Validate: `pnpm validate:markers`
 * Output: `assets/sprites/generated/`
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCanvas } from '@napi-rs/canvas'
import { GLOSSARY_MARKER_TONES, type GlossaryMarkerTone } from '../src/game/core/glossary'
import {
  MARKER_EXPORT_INNER_SIZE,
  MARKER_EXPORT_LOGICAL_FRAME,
  MARKER_EXPORT_SCALE_DEFAULT,
} from '../src/game/render/markerExportSpec'
import { drawMarkerSpriteCanvas } from '../src/game/render/markerRenderer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'assets', 'sprites', 'generated')

const LOGICAL_FRAME = MARKER_EXPORT_LOGICAL_FRAME
const MARKER_SIZE = MARKER_EXPORT_INNER_SIZE

/** Max scale (safety cap for PNG/atlas size). Must be ≥ `MARKER_EXPORT_SCALE_DEFAULT` in spec. */
const EXPORT_SCALE_MAX = 48

/** Integer upscale for crisp pixels (nearest-neighbor). */
const EXPORT_SCALE = Math.max(
  1,
  Math.min(
    EXPORT_SCALE_MAX,
    Number.parseInt(process.env.SPRITE_EXPORT_SCALE ?? String(MARKER_EXPORT_SCALE_DEFAULT), 10) ||
      MARKER_EXPORT_SCALE_DEFAULT,
  ),
)

const ALL_TONES = GLOSSARY_MARKER_TONES

const renderTone = (tone: GlossaryMarkerTone): Buffer => {
  const w = LOGICAL_FRAME * EXPORT_SCALE
  const h = LOGICAL_FRAME * EXPORT_SCALE
  const canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get 2d context')
  }
  ctx.imageSmoothingEnabled = false
  ctx.setTransform(EXPORT_SCALE, 0, 0, EXPORT_SCALE, 0, 0)
  const cx = LOGICAL_FRAME / 2
  const cy = LOGICAL_FRAME / 2
  drawMarkerSpriteCanvas(ctx, tone, cx, cy, MARKER_SIZE)
  return canvas.toBuffer('image/png')
}

const main = (): void => {
  mkdirSync(OUT_DIR, { recursive: true })

  const manifest = {
    logicalFrame: LOGICAL_FRAME,
    logicalMarkerSize: MARKER_SIZE,
    exportScale: EXPORT_SCALE,
    frameWidth: LOGICAL_FRAME * EXPORT_SCALE,
    frameHeight: LOGICAL_FRAME * EXPORT_SCALE,
    source: 'src/game/render/markerRenderer.ts (drawMarkerSpriteCanvas)',
    frames: [] as { index: number; tone: GlossaryMarkerTone; file: string }[],
  }

  for (let i = 0; i < ALL_TONES.length; i += 1) {
    const tone = ALL_TONES[i]
    const fileName = `marker_${tone}.png`
    const buf = renderTone(tone)
    writeFileSync(join(OUT_DIR, fileName), buf)
    manifest.frames.push({ index: i, tone, file: fileName })
  }

  const cellW = LOGICAL_FRAME * EXPORT_SCALE
  const cellH = LOGICAL_FRAME * EXPORT_SCALE
  const atlasW = cellW * ALL_TONES.length
  const atlasH = cellH
  const atlas = createCanvas(atlasW, atlasH)
  const actx = atlas.getContext('2d')
  if (!actx) {
    throw new Error('Failed to get atlas 2d context')
  }
  actx.imageSmoothingEnabled = false

  for (let i = 0; i < ALL_TONES.length; i += 1) {
    const tone = ALL_TONES[i]
    const cell = createCanvas(cellW, cellH)
    const cctx = cell.getContext('2d')
    if (!cctx) continue
    cctx.imageSmoothingEnabled = false
    cctx.setTransform(EXPORT_SCALE, 0, 0, EXPORT_SCALE, 0, 0)
    drawMarkerSpriteCanvas(cctx, tone, LOGICAL_FRAME / 2, LOGICAL_FRAME / 2, MARKER_SIZE)
    actx.drawImage(cell, i * cellW, 0)
  }

  writeFileSync(join(OUT_DIR, 'marker_atlas.png'), atlas.toBuffer('image/png'))
  writeFileSync(join(OUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

  console.log(
    `Wrote ${ALL_TONES.length} PNGs (${cellW}×${cellH}) + marker_atlas.png + manifest.json -> ${OUT_DIR}`,
  )
}

main()
