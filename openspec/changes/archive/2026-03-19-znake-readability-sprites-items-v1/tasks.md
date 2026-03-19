## 1. OpenSpec definition

- [x] 1.1 Create proposal/design/tasks + spec deltas.

## 2. Implementation

- [x] 2.1 Refine snake head/body readability hierarchy in `GameScene` draw pass.
- [x] 2.2 Refine wall/obstacle rendering silhouette and contrast.
- [x] 2.3 Differentiate food/powerup/biome item/hazard visual signatures.
- [x] 2.4 Tune portal/hazard readability under squeeze/pressure situations.

## 3. Validation

- [x] 3.1 Run `openspec validate znake-readability-sprites-items-v1`.
- [x] 3.2 Run `pnpm check`.
- [x] 3.3 Run `pnpm build`.
- [ ] 3.4 Manual smoke:
- [ ] quick-recognition pass on mobile viewport
- [ ] no collision behavior regression
- [ ] no scene-flow regression (menu -> relic -> game -> upgrade/death)
