/**
 * Registers canvas textures for glossary/game markers at the same resolution as
 * `pnpm generate:sprites` (see `markerExportSpec.ts`).
 */
import Phaser from 'phaser'
import { GLOSSARY_MARKER_TONES, type GlossaryMarkerTone } from '../core/glossary'
import {
  MARKER_EXPORT_FRAME_PX_DEFAULT,
  MARKER_EXPORT_INNER_SIZE,
  MARKER_EXPORT_LOGICAL_FRAME,
  MARKER_EXPORT_SCALE_DEFAULT,
} from './markerExportSpec'
import { drawMarkerSpriteCanvas } from './markerRenderer'

/** Aliases for `markerExportSpec` (used by MenuScene / tooling). */
export const MARKER_TEX_LOGICAL = MARKER_EXPORT_LOGICAL_FRAME
export const MARKER_TEX_SCALE = MARKER_EXPORT_SCALE_DEFAULT
export const MARKER_TEX_PX = MARKER_EXPORT_FRAME_PX_DEFAULT
export const MARKER_TEX_INNER_SIZE = MARKER_EXPORT_INNER_SIZE

export const markerTextureKey = (tone: GlossaryMarkerTone): string => `marker_hi_${tone}`

export const registerMarkerHiResTextures = (scene: Phaser.Scene): void => {
  for (const tone of GLOSSARY_MARKER_TONES) {
    const key = markerTextureKey(tone)
    if (scene.textures.exists(key)) {
      continue
    }
    const canvas = document.createElement('canvas')
    canvas.width = MARKER_TEX_PX
    canvas.height = MARKER_TEX_PX
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      continue
    }
    ctx.imageSmoothingEnabled = false
    ctx.setTransform(MARKER_EXPORT_SCALE_DEFAULT, 0, 0, MARKER_EXPORT_SCALE_DEFAULT, 0, 0)
    drawMarkerSpriteCanvas(
      ctx,
      tone,
      MARKER_EXPORT_LOGICAL_FRAME / 2,
      MARKER_EXPORT_LOGICAL_FRAME / 2,
      MARKER_EXPORT_INNER_SIZE,
    )
    const canvasTexture = scene.textures.addCanvas(key, canvas)
    /** Canvas textures can still sample with LINEAR in some paths; force nearest-neighbor. */
    canvasTexture?.setFilter(Phaser.Textures.FilterMode.NEAREST)
  }
}
