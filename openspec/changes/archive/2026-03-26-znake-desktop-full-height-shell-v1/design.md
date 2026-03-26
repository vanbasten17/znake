## Design

The shell already has the right base structure:

- `body[data-ui-shell="run"]` and `body[data-ui-shell="menu"]` use a two-row grid (`hud` + flexible content row).
- `#game-area` and `#phaser-container` stretch to fill that flexible row.

The regression comes from the desktop media query overriding the second row with `min(78dvh, 960px)`. That preserves centering, but it forces the main shell to behave like a fixed-height panel instead of a full-height game surface.

Implementation strategy:

1. Keep the desktop media query and desktop-only centering behavior.
2. Remove the desktop `78dvh` cap so the second grid row returns to `minmax(0, 1fr)`.
3. Preserve width constraints and horizontal centering through the existing shell width rules.

This keeps the separation of concerns intact:

- Simulation: unchanged.
- Presentation: CSS-only shell/layout change.
- Adapters/HUD: unchanged DOM structure, just more available height on desktop.

## Key Points (Codex-style)

- What is changing: Desktop shell media-query sizing returns to a full-height flexible content row.
- Why we are doing it: Upgrade/reward/death flows need full vertical readability on desktop, not a cropped card stack.
- Impacted areas: Desktop shell CSS and the UI foundation spec.
- Risks / unknowns: Slight change in perceived empty space on tall displays; acceptable because usability and full visibility are the priority.
