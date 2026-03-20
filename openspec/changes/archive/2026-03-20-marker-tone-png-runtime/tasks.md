## 1. Render pipeline split (browser vs Node)

- [x] 1.1 Rename procedural entry to `drawMarkerSpriteProcedural` in `markerRenderer.ts` (no PNG imports)
- [x] 1.2 Add `markerBitmaps.ts` (`import.meta.glob`, `ensureMarkerBitmapsLoaded`, `getMarkerBitmap`)
- [x] 1.3 Add `markerBitmapDraw.ts` exporting `drawMarkerSpriteCanvas` (bitmap → else procedural)

## 2. Scene integration

- [x] 2.1 `markerHiRes.ts`: await `ensureMarkerBitmapsLoaded`, `drawMarkerSpriteCanvas` from `markerBitmapDraw`
- [x] 2.2 `MenuScene`: await `ensureMarkerBitmapsLoaded` in `create`, glossary uses `drawMarkerSpriteCanvas`
- [x] 2.3 `GameScene`: async `create`, `await registerMarkerHiResTextures`, `gameCreateComplete` gate in `update`

## 3. Export tooling

- [x] 3.1 `generate-sprites.ts`: import `drawMarkerSpriteProcedural` only; per-tone `existsSync(marker_${tone}.png)` preserve path
- [x] 3.2 Remove superseded `markerCoreBitmap.ts`

## 4. Documentation

- [x] 4.1 Update `docs/assets/MANUAL_MARKER_PNG_REPLACEMENT.md` and `MARKER_PIXEL_PIPELINE.md`
- [x] 4.2 Adjust `markerExportSpec.ts` comment if needed

## 5. Verification

- [x] 5.1 `pnpm check`, `pnpm build`, `pnpm validate:markers`, `pnpm generate:sprites` succeed
