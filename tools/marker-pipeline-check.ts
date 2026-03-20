/**
 * Validates that generated `manifest.json` matches `markerExportSpec` and prints the pixel-art checklist.
 *
 * Run: `pnpm validate:markers`
 * After changing markers: `pnpm generate:sprites && pnpm validate:markers`
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  MARKER_EXPORT_FRAME_PX_DEFAULT,
  MARKER_EXPORT_INNER_SIZE,
  MARKER_EXPORT_LOGICAL_FRAME,
  MARKER_EXPORT_SCALE_DEFAULT,
} from '../src/game/render/markerExportSpec'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const MANIFEST = join(ROOT, 'assets', 'sprites', 'generated', 'manifest.json')

type Manifest = {
  logicalFrame: number
  logicalMarkerSize: number
  exportScale: number
  frameWidth: number
  frameHeight: number
}

const main = (): void => {
  const errors: string[] = []
  const warnings: string[] = []

  console.log('Znake marker pipeline — spec (source of truth)\n')
  console.log('  markerExportSpec.ts')
  console.log(`    logicalFrame:     ${MARKER_EXPORT_LOGICAL_FRAME}`)
  console.log(`    innerSize:        ${MARKER_EXPORT_INNER_SIZE}`)
  console.log(`    scale (default):  ${MARKER_EXPORT_SCALE_DEFAULT}`)
  console.log(
    `    frame px:         ${MARKER_EXPORT_FRAME_PX_DEFAULT}×${MARKER_EXPORT_FRAME_PX_DEFAULT}\n`,
  )

  if (!existsSync(MANIFEST)) {
    console.warn(`⚠ No manifest at ${MANIFEST}`)
    console.warn('  Run: pnpm generate:sprites\n')
  } else {
    const raw = readFileSync(MANIFEST, 'utf8')
    let parsed: Manifest
    try {
      parsed = JSON.parse(raw) as Manifest
    } catch {
      errors.push('manifest.json is not valid JSON')
      parsed = {
        logicalFrame: MARKER_EXPORT_LOGICAL_FRAME,
        logicalMarkerSize: MARKER_EXPORT_INNER_SIZE,
        exportScale: MARKER_EXPORT_SCALE_DEFAULT,
        frameWidth: MARKER_EXPORT_FRAME_PX_DEFAULT,
        frameHeight: MARKER_EXPORT_FRAME_PX_DEFAULT,
      }
    }

    if (parsed.logicalFrame !== MARKER_EXPORT_LOGICAL_FRAME) {
      errors.push(
        `manifest logicalFrame: got ${parsed.logicalFrame}, expected ${MARKER_EXPORT_LOGICAL_FRAME}`,
      )
    }
    if (parsed.logicalMarkerSize !== MARKER_EXPORT_INNER_SIZE) {
      errors.push(
        `manifest logicalMarkerSize: got ${parsed.logicalMarkerSize}, expected ${MARKER_EXPORT_INNER_SIZE}`,
      )
    }
    const expectedW = parsed.logicalFrame * parsed.exportScale
    const expectedH = parsed.logicalFrame * parsed.exportScale
    if (parsed.frameWidth !== expectedW || parsed.frameHeight !== expectedH) {
      errors.push(
        `manifest frame size: got ${parsed.frameWidth}×${parsed.frameHeight}, expected ${expectedW}×${expectedH} (= logicalFrame × exportScale)`,
      )
    }
    if (parsed.exportScale !== MARKER_EXPORT_SCALE_DEFAULT) {
      warnings.push(
        `manifest exportScale is ${parsed.exportScale} (default is ${MARKER_EXPORT_SCALE_DEFAULT}); PNGs differ from in-game hi-res textures until you match markerHiRes / regenerate with default scale`,
      )
    }

    if (errors.length === 0) {
      console.log(`✓ manifest.json is consistent with spec (${MANIFEST})\n`)
    }
    for (const w of warnings) {
      console.warn(`⚠ ${w}\n`)
    }
  }

  console.log('Checklist (crisp pixels in browser + Phaser):\n')
  console.log(
    '  [ ] src/game/render/markerExportSpec.ts — only place for logical/inner/scale defaults',
  )
  console.log('  [ ] markerHiRes.ts — NEAREST filter after addCanvas; uses spec constants')
  console.log('  [ ] GameScene — marker Images: Math.round position + display size')
  console.log(
    '  [ ] MenuScene glossary — same draw as export (scale transform), GLOSSARY_MARKER_DISPLAY_PX',
  )
  console.log('  [ ] menuOverlay — .glossaryMarkerCanvas { image-rendering: pixelated }')
  console.log('  [ ] phaser.ts — render.pixelArt: true, antialias: false')
  console.log('  [ ] pnpm generate:sprites after changing drawMarkerSpriteCanvas / spec')
  console.log('')

  if (errors.length > 0) {
    console.error('Validation failed:\n')
    for (const e of errors) {
      console.error(`  - ${e}`)
    }
    process.exitCode = 1
  } else {
    console.log('OK — see docs/MARKER_PIXEL_PIPELINE.md and .cursor/skills/znake-marker-pipeline/')
  }
}

main()
