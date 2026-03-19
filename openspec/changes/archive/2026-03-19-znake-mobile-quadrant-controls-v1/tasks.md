## 1. OpenSpec definition

- [x] 1.1 Create proposal/design/tasks and input-hud spec delta.

## 2. Implementation

- [x] 2.1 Remove dedicated touch control chrome (D-pad + Start/Pause) from shell.
- [x] 2.2 Implement gameplay-area quadrant tap directional mapping in input system.
- [x] 2.3 Remove swipe directional mapping from default touch setup.
- [x] 2.4 Update mobile hint copy for new movement interaction.
- [x] 2.5 Update shell layout to remove reserved 1/3 controls area and give gameplay full content height.
- [x] 2.6 Remove bottom hint bar from shell and keep HUD helpers compatible without it.

## 3. Validation

- [x] 3.1 Run `openspec validate znake-mobile-quadrant-controls-v1`.
- [x] 3.2 Run `pnpm check`.
- [x] 3.3 Run `pnpm build`.
