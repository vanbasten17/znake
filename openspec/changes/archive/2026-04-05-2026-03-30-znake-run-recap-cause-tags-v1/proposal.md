## Why

Post-run recap lacks concise, actionable cause breakdown, limiting learning and retention.

## Key Points (Codex-style)

- What is changing
  - Add structured cause tags to run recap and history entries.
- Why we are doing it
  - Improve player learning loops and strategic adaptation.
- Impacted areas
  - Run history surface, death recap summaries, telemetry labeling.
- Risks / unknowns
  - Overly granular tags may overwhelm players.

## What Changes

- Define a compact cause-tag taxonomy for recap summaries.
- Add deterministic selection rules for top contributing causes.
- Specify UI exposure limits to keep recap readable.

## Capabilities

### Modified Capabilities

- affected spec: run-history-surface

## Impact

- Affected code (expected):
  - src/game/core/deathRecap.ts
  - src/game/core/runHistory.ts
  - src/game/systems/
  - tests/
