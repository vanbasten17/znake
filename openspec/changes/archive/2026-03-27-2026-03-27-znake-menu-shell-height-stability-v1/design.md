## Design

The shell uses a two-row grid (`hud` + `game-area`) for both `menu` and `run`.
In menu mode, the current CSS keeps the HUD row in flow and compensates with:

- `#game-area` height growth (`calc(100% + overlap)`)
- negative top margin to pull the content up

That strategy is fragile across viewport sizes and scene swaps, because menu and non-menu scenes do not share the same vertical origin.

Additionally, when `#hud` is `display: none`, CSS Grid auto-placement can move `#game-area` into the first (`auto`) row unless its grid row is explicitly pinned.

### Proposed approach

1. In menu mode, remove the overlap offset strategy from `#game-area`.
2. In menu mode, remove HUD row footprint (`display: none`) and explicitly define shell rows as `0` + `minmax(0, 1fr)` so resize behavior cannot reflow into unstable auto tracks.
3. For draft/reward overlays, reduce top-heavy viewport padding and make the card list the flexible scroll region.
4. In desktop media queries, keep horizontal centering but force vertical stretch (`align-content: stretch`) to avoid dead-space packing.
5. Keep existing width constraints, overlay DOM structure, and rendering pipeline untouched.

This keeps responsibilities clean:

- Simulation: unchanged.
- Scene orchestration: unchanged.
- Presentation: CSS shell behavior only.

## Key Points (Codex-style)

- What is changing: Menu shell and draft/reward overlays now use direct full-height sizing without fragile vertical compensation.
- Why we are doing it: Ensures viewport-height continuity and removes transition jump artifacts.
- Impacted areas: `src/styles/shell.css` and draft/reward overlay CSS modules, plus `ui-foundation` shell behavior contract.
- Risks / unknowns: Small visual repositioning of top titles on tall displays; mitigated by keeping card readability and interaction targets intact.
