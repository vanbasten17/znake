## 1. System Scale Configuration

- [x] 1.1 Update `CELL` from 40 to 80 in `src/game/core/constants.ts` (Double resolution)
- [x] 1.2 Update `MARKER_EXPORT_SCALE_DEFAULT` from 2 to 4 in `src/game/render/markerExportSpec.ts` (Double export resolution)
- [x] 1.3 Update `GLOSSARY_MARKER_DISPLAY_PX` from 40 to 80 (Keep glossary sharp)

## 2. High-DPI Asset Update

- [x] 2.1 Regenerate all authored SVGs at 80x80 px using `pnpm sprites:svg2png -- --size 80`
- [x] 2.2 Rebuild the high-resolution marker atlas via `node --import tsx tools/pack-marker-atlas-from-pngs.ts`
- [x] 2.3 Run `pnpm validate:markers` to ensure manifest, size, and exportScale=4 consistency

## 3. Shader & Browser Validation

- [x] 3.1 Verify `ArcadeEffectsPipeline` correctly adapts to the new resolution in `GameScene`
- [x] 3.2 Perform a visual "Retina" check: scanlines should be thinner and more subtle
- [x] 3.3 Ensure the HUD (DOM overlay) remains correctly scaled and positioned relative to the new canvas size
