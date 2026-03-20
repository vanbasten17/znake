/**
 * Browser/runtime wrapper: prefers hand-authored `marker_<tone>.png` when loaded, else procedural art.
 * Tooling (`pnpm generate:sprites`) imports `drawMarkerSpriteProcedural` from `markerRenderer.ts` only
 * so Node never pulls in Vite asset URLs.
 */
import type { GlossaryMarkerTone } from '../core/glossary'
import { getMarkerBitmap } from './markerBitmaps'
import { MARKER_EXPORT_LOGICAL_FRAME } from './markerExportSpec'
import { drawMarkerSpriteProcedural } from './markerRenderer'

export const drawMarkerSpriteCanvas = (
  ctx: CanvasRenderingContext2D,
  tone: GlossaryMarkerTone,
  cx: number,
  cy: number,
  size: number,
): void => {
  const img = getMarkerBitmap(tone)
  if (img) {
    const fw = MARKER_EXPORT_LOGICAL_FRAME
    const fh = MARKER_EXPORT_LOGICAL_FRAME
    ctx.drawImage(img, cx - fw / 2, cy - fh / 2, fw, fh)
    return
  }
  drawMarkerSpriteProcedural(ctx, tone, cx, cy, size)
}
