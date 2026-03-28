## Why

Route risk cue formatting is embedded in scene logic. Extracting a formatter improves reuse and local reasoning.

## Key Points (Codex-style)

- What is changing
  - Add route risk cue formatter utility + tests and integrate into scene.
- Why we are doing it
  - Cleaner separation of presentation formatting from orchestration.
- Impacted areas
  - route formatting utility and `GameScene`.
- Risks / unknowns
  - Minor text shape differences.
