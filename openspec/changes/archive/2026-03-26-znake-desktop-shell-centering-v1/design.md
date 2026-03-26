## Design

Use a desktop-targeted media query (`min-width` + fine pointer) to center shell content while preserving current mobile behavior.

Implementation strategy:

1. Keep existing run/menu shell grid structure.
2. On desktop, center the shell block vertically/horizontally using `align-content` and explicit row sizing.
3. Ensure `hud`, `game-area`, and `controls` keep consistent width and are centered with `margin-inline: auto`.

No JS/runtime changes are needed.

## Key Points (Codex-style)

- What is changing: CSS centering rules for desktop shell.
- Why we are doing it: Improve desktop UX polish with predictable framing.
- Impacted areas: Shell layout styles.
- Risks / unknowns: Small per-scene vertical offset changes; limited by desktop-only scope.
