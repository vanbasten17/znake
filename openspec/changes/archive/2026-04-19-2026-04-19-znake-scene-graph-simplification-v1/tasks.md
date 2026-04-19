## 1. Spec and design contracts

- [x] 1.1 Create proposal/design with Key Points (Codex-style).
- [x] 1.2 Add OpenSpec spec delta for `scenes`.

## 2. Implementation

- [x] 2.1 Extract virtual-input orchestration from `GameScene.update()` into a scene helper.
- [x] 2.2 Extract challenge-share copy/import flow from `MenuScene` into a scene helper.
- [x] 2.3 Keep side-effect parity (feedback, telemetry, transitions) through explicit wiring.

## 3. Validation and closeout

- [x] 3.1 Run `pnpm exec biome check --write --unsafe .`.
- [x] 3.2 Run `pnpm format`.
- [ ] 3.3 Run `pnpm check`.
- [x] 3.4 Summarize what changed and a focused manual test checklist.

Notes:
- `3.1` and `3.2` were executed on all changed refactor files successfully.
- `3.3` is currently blocked by repository-level Biome inputs unrelated to this change:
  - `graphify-out/graph.json` exceeds configured Biome max file size
  - `/.codex/hooks.json` formatting mismatch
