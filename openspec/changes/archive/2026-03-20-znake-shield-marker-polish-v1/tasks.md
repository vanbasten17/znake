## 1. Spec

- [x] 1.1 Add gameplay visual readability delta for shield marker polish.
- [x] 1.2 Add developer scenario bootstrap delta for reference-board smoke test.

## 2. Implementation

- [x] 2.1 Update shield icon vectors in marker pipeline (`canvas` + `phaser`) to remove cross and orient correctly.
- [x] 2.2 Keep rendering API and marker semantics unchanged.
- [x] 2.3 Add `reference_board` dev scenario (`?dev=1`) with static reference layout + hover labels.
- [x] 2.4 Ensure reference scenario includes snake (no movement), walls, hazards, pickups, and enemy references.

## 3. Validation

- [x] 3.1 Run `openspec validate znake-shield-marker-polish-v1`.
- [x] 3.2 Run `pnpm validate:markers`.
- [x] 3.3 Run `pnpm check`.
- [x] 3.4 Run `pnpm build`.
