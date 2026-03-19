## Context

The current run shell is mobile-first and reserves a dedicated controls area. Replacing D-pad buttons with a quadrant pad allows larger tap targets and fewer visual elements.

## Goals / Non-Goals

**Goals:**

- Improve touch movement ergonomics with a single large tap surface.
- Keep keyboard gameplay behavior unchanged.
- Keep scene flow and virtual input bridge unchanged.

**Non-Goals:**

- Gesture customization UI.
- Voice controls or accessibility profiles in this change.
- Rebalancing gameplay around input changes.

## Decisions

1. Use gameplay-area tap zones split by both diagonals into four triangles.
- This matches the “top/left/right/down triangular quadrant” model without extra control chrome.

2. Keep the same `window.virtualInput.dir` contract.
- GameScene remains untouched for directional consumption.

3. Disable swipe directional mapping by default.
- Prevents accidental directional changes from scroll-like touch movement.

4. Remove Start/Pause touch buttons.
- Reduces vertical UI footprint and visual clutter in mobile gameplay shell.

5. Remove the bottom hint bar from shell markup.
- Keep hint system API no-op safe for compatibility, but reclaim vertical space for gameplay.

## Risks / Trade-offs

- [Risk] Near-center taps may feel ambiguous.
  - Mitigation: deterministic dominant-axis resolution (`abs(dx)` vs `abs(dy)`).
- [Risk] Users accustomed to swipe may need relearning.
  - Mitigation: update hint copy and keep interaction simple/consistent.
- [Risk] Touch taps could conflict with overlay buttons in non-game run scenes.
  - Mitigation: ignore quadrant direction taps when touch target is inside a button.
