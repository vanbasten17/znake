## Why

Combat readability and fairness are improved versus earlier versions, but some damage moments can still feel unavoidable when telegraph windows are short and spawn pressure compresses escape options. This v2 tuning pass reduces unfair damage spikes while preserving challenge pacing through data-driven threshold adjustments.

## Key Points (Codex-style)

- **What is changing**
  - Telegraph readability windows are widened for key high-pressure actions.
  - Enemy spawn fairness thresholds and local escape validation are tightened.
  - Brief breathing windows for room-entry and post-hit recovery are tuned upward.
- **Why we are doing it**
  - Improve fairness perception and player agency without lowering encounter intensity.
  - Keep losses understandable and avoid cheap-hit sequences.
- **Impacted areas**
  - Central combat fairness balance tables and role telegraph knobs.
  - Runtime behavior in enemy telegraphing and spawn filtering.
- **Risks / unknowns**
  - Over-tuning could flatten pressure and reduce challenge if windows become too generous.
  - Spawn constraints can increase fallback frequency if too strict.

## What Changes

- Tune combat fairness timing constants (telegraph + grace windows) in centralized config.
- Tune spawn safety and minimum local escape thresholds in centralized config.
- Adjust role-level telegraph readability minima in enemy role knobs to align with fairness goals.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `gameplay`: tighten fairness/readability contracts for telegraphs, spawn safety, and breathing windows.
- `balance-config`: update central combat fairness tuning requirement coverage for this v2 pass.
- `enemy-role-taxonomy`: strengthen role telegraph/counterplay and fairness guardrail expectations.

## Impact

- Affected code:
  - `src/game/core/balance.ts`
- No new dependencies.
- Determinism preserved: only centralized threshold values are tuned.
