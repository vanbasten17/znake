## 1. GameScene reference board

- [x] 1.1 Add `referenceMarkerImages` pool; create in `setupReferenceBoardScenario`, destroy in `resetLocalState` / before rebuild
- [x] 1.2 In `drawFrame`, hide pool at start; show + position with `markerTextureKey` + `setDisplaySize` when `referenceBoardMode`
- [x] 1.3 Remove `drawMarkerSpritePhaser` import if unused

## 2. Docs

- [x] 2.1 Note dev reference uses hi-res `Image` in `docs/assets/MARKER_PIXEL_PIPELINE.md` (optional)

## 3. Verify

- [x] 3.1 `pnpm check`, `pnpm exec tsc --noEmit`
