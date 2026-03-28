## Why

The backlog is empty while there are still fast, high-value improvements we can ship for readability, responsiveness, accessibility, and maintainability. A tightly scoped “40 micro-ideas” batch lets us improve player confidence and iteration speed without destabilizing deterministic simulation.

## Key Points (Codex-style)

- What is changing
  - Deliver 40 small improvements: 15 web-backed UX/accessibility ideas, 15 graphics/layout polish items, and 10 technical refactors.
- Why we are doing it
  - Improve game feel (responsiveness/readability/fairness/feedback/juice) and reduce maintenance friction.
- Impacted areas
  - UI tokens/CSS overlays, route-choice readability, content selection helpers, deterministic tests, and NEXT_STEPS/OpenSpec tracking.
- Risks / unknowns
  - Many small UI deltas can accidentally reduce visual consistency; refactors must not alter deterministic outcomes.

## What Changes

- Improve readability and control confidence surfaces (focus visibility, touch target floor, reduced-motion handling, stronger contrast defaults).
- Polish route/menu overlays with clearer hierarchy and non-color-only risk cues.
- Refactor content selection helpers for lower duplication and easier future balancing.
- Add focused tests for the refactored content-selection behavior.
- Refresh `NEXT_STEPS.md` with categorized 40-idea completion history.

## Capabilities

### Modified Capabilities

- `ui-foundation`: higher readability and interaction clarity defaults.
- `gameplay`: route risk cueing uses both text and color.
- `game-core`: content picker helpers become more reusable while preserving deterministic behavior.

## Impact

- Affected code:
  - `src/styles/tokens.css`
  - `src/styles/app.css`
  - `src/styles/menuOverlay.module.css`
  - `src/styles/routeOverlay.module.css`
  - `src/game/scenes/GameScene.ts`
  - `src/game/config/content.ts`
  - `tests/content-selection.test.ts`
  - `NEXT_STEPS.md`
- No new dependencies.
