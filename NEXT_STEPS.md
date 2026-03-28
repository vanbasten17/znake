# Next Steps

## Active Ideas

No active ideas.

## OpenSpec Match Status

Generated: 2026-03-28

- 40-idea polish + refactor execution batch (15 web-backed, 15 graphics/layout, 10 technical refactors)
  - Status: Implemented
  - Change: `openspec/changes/archive/2026-03-28-znake-40-idea-polish-refactor-v1/`
  - Evidence:
    - `src/styles/tokens.css`
    - `src/styles/app.css`
    - `src/styles/menuOverlay.module.css`
    - `src/styles/routeOverlay.module.css`
    - `src/game/scenes/GameScene.ts`
    - `src/game/config/content.ts`
    - `tests/content-selection.test.ts`

- 10-idea modular UI + refactor sprint (3 web-backed, 3 UI reusable components, 4 technical refactors)
  - Status: Implemented
  - Change:
    - `openspec/changes/archive/2026-03-28-znake-web-a11y-foundations-v1/`
    - `openspec/changes/archive/2026-03-28-znake-ui-component-primitives-v1/`
    - `openspec/changes/archive/2026-03-28-znake-content-selector-modularization-v1/`
    - `openspec/changes/archive/2026-03-28-znake-route-formatter-modularization-v1/`
  - Evidence:
    - `src/game/systems/accessibility.ts`
    - `src/game/ui/components/ActionButton.ts`
    - `src/game/ui/components/PanelSection.ts`
    - `src/game/ui/components/StatusChip.ts`
    - `src/game/ui/formatters/routeRisk.ts`
    - `src/game/config/contentSelectors.ts`
    - `src/game/scenes/MenuScene.ts`
    - `src/game/scenes/gameScene/overlayController.ts`
    - `tests/content-selectors.test.ts`
    - `tests/route-risk-formatter.test.ts`

## Completed

- [x] 40-idea backlog execution (web-backed + graphics/layout + refactor)
  - Why: Improve readability, responsiveness, and fairness perception while reducing code duplication and preserving deterministic simulation behavior.
  - OpenSpec change: 2026-03-28-znake-40-idea-polish-refactor-v1
  - [x] Web-backed #1: Increase baseline hint legibility token floor.
  - [x] Web-backed #2: Increase stat label minimum size for readability.
  - [x] Web-backed #3: Increase stat value minimum size for readability.
  - [x] Web-backed #4: Add global focus ring token for keyboard clarity.
  - [x] Web-backed #5: Strengthen high-contrast focus ring.
  - [x] Web-backed #6: Add reduced-motion media behavior for transitions.
  - [x] Web-backed #7: Disable non-essential animation when reduced motion is requested.
  - [x] Web-backed #8: Raise objective status minimum font size.
  - [x] Web-backed #9: Raise route status minimum font size.
  - [x] Web-backed #10: Raise run status minimum font size.
  - [x] Web-backed #11: Raise voice feedback minimum font size.
  - [x] Web-backed #12: Enforce minimum touch target floor on action buttons.
  - [x] Web-backed #13: Improve keyboard focus visibility for action buttons.
  - [x] Web-backed #14: Add non-color-only route risk cue prefix (`[LOW|MED|HIGH]`).
  - [x] Web-backed #15: Expand large-text accessibility preset sizing.
  - [x] Graphics/layout #1: Add subtle ambient body background gradients.
  - [x] Graphics/layout #2: Tune title letter-spacing for cleaner heading balance.
  - [x] Graphics/layout #3: Ensure stat labels render uppercase consistently.
  - [x] Graphics/layout #4: Add crisp-edges rendering hint for canvas.
  - [x] Graphics/layout #5: Slightly enlarge action button base size.
  - [x] Graphics/layout #6: Add active-state micro-press transform.
  - [x] Graphics/layout #7: Add route overlay backdrop blur.
  - [x] Graphics/layout #8: Improve route panel border contrast.
  - [x] Graphics/layout #9: Add route panel dual-layer shadow polish.
  - [x] Graphics/layout #10: Raise route card minimum height for scanability.
  - [x] Graphics/layout #11: Add route card hover/focus lift transition.
  - [x] Graphics/layout #12: Improve route preview line letter-spacing.
  - [x] Graphics/layout #13: Add gradient CTA styling in route overlay.
  - [x] Graphics/layout #14: Increase menu card/button corner radius consistency.
  - [x] Graphics/layout #15: Make menu play/challenge action grids single-column on narrow screens.
  - [x] Refactor #1: Extract powerup pool-kind resolution helper.
  - [x] Refactor #2: Extract weighted powerup entry builder helper.
  - [x] Refactor #3: Reuse helper in `getPowerupPool`.
  - [x] Refactor #4: Reuse helper in `pickPowerupType`.
  - [x] Refactor #5: Add explicit `PowerupPoolKind` type alias.
  - [x] Refactor #6: Precompute elite spawn config sorting once.
  - [x] Refactor #7: Simplify elite config fallback selection path.
  - [x] Refactor #8: Extract special-enemy chance resolver helper.
  - [x] Refactor #9: Add deterministic tests for content-selection paths.
  - [x] Refactor #10: Add pool/pick consistency assertion coverage.
  - [x] Archived and base specs updated.

- [x] 10-idea modular UI + refactor sprint
  - Why: Improve accessibility, component reuse, and modular architecture so game surfaces are easier to extend and maintain.
  - OpenSpec change: 2026-03-28-znake-web-a11y-foundations-v1 + 2026-03-28-znake-ui-component-primitives-v1 + 2026-03-28-znake-content-selector-modularization-v1 + 2026-03-28-znake-route-formatter-modularization-v1
  - [x] Web-backed #1: Add system reduced-motion preference support in accessibility runtime.
  - [x] Web-backed #2: Add shared touch target minimum token usage.
  - [x] Web-backed #3: Add non-color route risk symbol cueing (`○/△/▲`).
  - [x] UI reusable #1: Add `ActionButton` component helper.
  - [x] UI reusable #2: Add `PanelSection` component helper.
  - [x] UI reusable #3: Add `StatusChip` component helper + barrel exports.
  - [x] Refactor #1: Extract content selector helpers into `contentSelectors.ts`.
  - [x] Refactor #2: Integrate selector module into `content.ts`.
  - [x] Refactor #3: Extract reusable route-risk formatter utility.
  - [x] Refactor #4: Add deterministic tests for selectors and route formatter.
  - [x] Archived and base specs updated.

## Suggested Next Step

No active ideas remain. Trigger this skill again to start another brainstorming cycle.
