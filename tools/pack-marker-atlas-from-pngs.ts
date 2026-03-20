/**
 * Rebuild `marker_atlas.png` from the existing `assets/sprites/generated/marker_<tone>.png` files.
 *
 * Use-case:
 * - You manually replaced one or more `marker_<tone>.png` files (except `marker_atlas.png`).
 * - You want the horizontal atlas to match those updated PNGs.
 *
 * Notes:
 * - The game itself does NOT use these PNGs for runtime rendering; it draws markers procedurally
 *   into Phaser canvas textures at startup (see `markerHiRes.ts`).
 * - This script updates `marker_atlas.png` and rewrites `manifest.json`'s exportScale/frame sizes
 *   to match the PNG dimensions it finds.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import type { GlossaryMarkerTone } from '../src/game/core/glossary'
import { GLOSSARY_MARKER_TONES } from '../src/game/core/glossary'
import {
  MARKER_EXPORT_INNER_SIZE,
  MARKER_EXPORT_LOGICAL_FRAME,
} from '../src/game/render/markerExportSpec'

type ManifestFrame = { index: number; tone: GlossaryMarkerTone; file: string }
type MarkerManifest = {
  logicalFrame: number
  logicalMarkerSize: number
  exportScale: number
  frameWidth: number
  frameHeight: number
  source: string
  frames: ManifestFrame[]
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'assets', 'sprites', 'generated')
const MANIFEST_PATH = join(OUT_DIR, 'manifest.json')

const readManifestOrNull = (): MarkerManifest | null => {
  try {
    const raw = readFileSync(MANIFEST_PATH, 'utf8')
    return JSON.parse(raw) as MarkerManifest
  } catch {
    return null
  }
}

const toPath = (file: string): string => join(OUT_DIR, file)

const main = async (): Promise<void> => {
  mkdirSync(OUT_DIR, { recursive: true })

  const manifest = readManifestOrNull()
  const frames: ManifestFrame[] =
    manifest?.frames && manifest.frames.length === GLOSSARY_MARKER_TONES.length
      ? manifest.frames
      : GLOSSARY_MARKER_TONES.map((tone, index) => ({
          index,
          tone,
          file: `marker_${tone}.png`,
        }))

  if (frames.length === 0) {
    throw new Error('No frames found to build atlas')
  }

  // Load the first tone to infer frame dimensions from the actual PNGs.
  const firstImg = await loadImage(toPath(frames[0].file))
  const frameWidth = Math.round(firstImg.width)
  const frameHeight = Math.round(firstImg.height)

  if (frameWidth <= 0 || frameHeight <= 0) {
    throw new Error(`Invalid first frame dimensions: ${frameWidth}×${frameHeight}`)
  }

  // exportScale must be integer-upscale of logical frame (nearest-neighbor pipeline).
  const exportScale = frameWidth / MARKER_EXPORT_LOGICAL_FRAME
  if (!Number.isInteger(exportScale) || exportScale <= 0) {
    throw new Error(
      `PNG frame width (${frameWidth}) does not map to an integer exportScale based on logicalFrame (${MARKER_EXPORT_LOGICAL_FRAME}).`,
    )
  }
  if (frameHeight !== frameWidth) {
    throw new Error(`Atlas builder expects square marker frames, got ${frameWidth}×${frameHeight}`)
  }

  const atlasW = frameWidth * frames.length
  const atlasH = frameHeight
  const atlas = createCanvas(atlasW, atlasH)
  const ctx = atlas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to get 2d context for atlas')
  }
  ctx.imageSmoothingEnabled = false

  for (let i = 0; i < frames.length; i += 1) {
    const frame = frames[i]
    const img = await loadImage(toPath(frame.file))
    const w = Math.round(img.width)
    const h = Math.round(img.height)
    if (w !== frameWidth || h !== frameHeight) {
      throw new Error(
        `Frame size mismatch for tone "${frame.tone}": expected ${frameWidth}×${frameHeight}, got ${w}×${h}`,
      )
    }
    ctx.drawImage(img, i * frameWidth, 0, frameWidth, frameHeight)
  }

  const nextManifest: MarkerManifest = {
    logicalFrame: MARKER_EXPORT_LOGICAL_FRAME,
    logicalMarkerSize: MARKER_EXPORT_INNER_SIZE,
    exportScale,
    frameWidth,
    frameHeight,
    source:
      'stitched from assets/sprites/generated/marker_<tone>.png by tools/pack-marker-atlas-from-pngs.ts',
    frames,
  }

  writeFileSync(join(OUT_DIR, 'marker_atlas.png'), atlas.toBuffer('image/png'))
  writeFileSync(join(OUT_DIR, 'manifest.json'), `${JSON.stringify(nextManifest, null, 2)}\n`)

  console.log(`Rebuilt marker_atlas.png (${atlasW}×${atlasH}) from ${frames.length} marker PNGs`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
