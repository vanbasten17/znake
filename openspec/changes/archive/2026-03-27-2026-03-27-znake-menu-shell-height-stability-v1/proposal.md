## Why

The menu shell still relies on a top-overlap offset (`height + negative margin`) to visually cover the hidden HUD row.
That offset can leave the menu and next scene with slightly different vertical anchoring, causing a visible jump during scene transitions.

## What Changes

- Remove menu-shell overlap math and use a direct full-height content region.
- Hide the HUD row in menu mode so `#game-area` naturally owns the full content track.
- Normalize draft/reward overlay vertical composition so top spacing scales sanely and cards can scroll instead of clipping.
- Remove desktop vertical grid centering that caused shell packing and bottom dead space.
- Stabilize menu content distribution to avoid extreme vertical gaps on very tall/zoomed viewports.
- Apply explicit full-height overlay sizing (`height/min-height: 100%`) so scene overlays consistently consume the full shell viewport.
- Keep the fix CSS-only to preserve deterministic gameplay/simulation behavior.

## Out of Scope

- No gameplay, progression, or economy changes.
- No copy updates or menu content redesign.
- No canvas resolution or camera logic changes.

## Key Points (Codex-style)

- What is changing: Shell and draft/reward overlays drop fragile vertical offsets and use stable full-height composition with scrollable card stacks.
- Why we are doing it: Scene-to-scene transition should keep vertical continuity and avoid perceived viewport shifts.
- Impacted areas: `src/styles/shell.css`, `src/styles/upgradeOverlay.module.css`, `src/styles/relicDraftOverlay.module.css`, `src/styles/rewardOverlay.module.css`, `openspec/specs/ui-foundation/spec.md`.
- Risks / unknowns: Header area spacing becomes tighter on tall screens; mitigated by preserving readability typography and keeping internal card spacing unchanged.
