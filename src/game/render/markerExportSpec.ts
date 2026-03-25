/**
 * Single source of truth for procedural marker rasterization.
 *
 * Used by:
 * - `tools/generate-sprites.ts` (PNG export + manifest)
 * - `markerHiRes.ts` (Phaser canvas textures in-game)
 * - `MenuScene` glossary (DOM canvas preview)
 *
 * After changing any value here: run `pnpm generate:sprites`, then `pnpm validate:markers`.
 * In-game: `registerMarkerHiResTextures` must stay aligned (same logical frame, inner size, scale).
 */

/** Logical coordinate space (same as one game cell unit for layout). */
export const MARKER_EXPORT_LOGICAL_FRAME = 20

/** Icon radius / half-extent in logical units (`drawMarkerSpriteProcedural` / `markerBitmapDraw` size parameter). */
export const MARKER_EXPORT_INNER_SIZE = 18

/**
 * Integer upscale from logical space to bitmap pixels (nearest-neighbor).
 * Default 2 → 40×40 px (`20 × 2`). Tradeoff vs `CELL`: this matches the glossary display size (40px)
 * and makes the marker textures effectively 1:1 when `CELL=40`.
 */
export const MARKER_EXPORT_SCALE_DEFAULT = 4

/** Pixel dimensions of one exported frame at the default scale. */
export const MARKER_EXPORT_FRAME_PX_DEFAULT =
  MARKER_EXPORT_LOGICAL_FRAME * MARKER_EXPORT_SCALE_DEFAULT

/**
 * Glossary row: on-screen canvas CSS size (backing store = `MARKER_EXPORT_FRAME_PX_DEFAULT`).
 * Must fit `.glossaryMarker` (42×42); use integer px to avoid browser blur when downscaling.
 */
export const GLOSSARY_MARKER_DISPLAY_PX = 80
