## Why

Znake recap already explains the current run, but players still lack a concise trend view across recent failures. A bounded "why you died" trend panel can convert recent outcomes into actionable insight without adding simulation complexity.

## Key Points (Codex-style)

- What is changing
  - Add a death-recap trend block summarizing the most frequent recent failure reason.
  - Use bounded local run-history snapshots as input.
- Why we are doing it
  - Improve player learning and fairness perception across repeated attempts.
- Impacted areas
  - Death recap composition and run-history read path.
- Risks / unknowns
  - Trend text may overfit small samples; fallback messaging is required for low history count.

## What Changes

- Extend death recap rendering with one trend insight block.
- Compute bounded reason frequency from recent run-history entries.
- Show deterministic fallback text when trend signal is too weak.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `scenes`: Death scene recap includes a bounded trend insight block.
- `observability`: Recap trend relies on existing run-end reason taxonomy consistency.

## Impact

- Affected code:
  - `src/game/scenes/DeathScene.ts`
  - existing `src/game/core/runHistory.ts` read path
- No dependency changes.
