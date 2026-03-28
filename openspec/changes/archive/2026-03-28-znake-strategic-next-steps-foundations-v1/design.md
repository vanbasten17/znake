## Overview

This change introduces infrastructure-first v1 slices for the remaining strategic backlog. The design keeps simulation deterministic and keeps scene code in orchestration mode.

## Key Points (Codex-style)

- What is changing
  - New contracts for content packs, replay snapshots, share-code validation, onboarding recommendation, and meta-board branch status.
- Why we are doing it
  - Make strategic roadmap themes implementable in incremental loops while preserving current release stability.
- Impacted areas
  - Local persistence, menu action surfaces, start/death orchestration, progression readability.
- Risks / unknowns
  - Initial ghost lane is summary-based (not full entity ghost simulation) and may need deeper follow-up iteration.

## Architecture

### 1) Content-pack framework

- Add `ContentPackDefinition` schema and base pack contract.
- Resolve content pack deterministically at run start with fallback to `base`.
- Emit telemetry for resolved/fallback pack IDs.

### 2) Replay snapshot + ghost target

- Persist bounded replay event snapshots on run death.
- Store latest snapshot in local storage and game state.
- Menu history renders ghost-target summary from snapshot, with run-history fallback.

### 3) Social challenge layer (share code)

- Encode `{seed, preset, mutator, floor, score}` into a compact code.
- Attach checksum to detect malformed/tampered codes.
- Menu supports export and import; import starts deterministic seeded run.

### 4) Adaptive onboarding rail

- Evaluate recent run-history window for repeated early-floor failures.
- Surface opt-in onboarding recommendation in menu.
- Applying rail updates accessibility/audio settings and marks recommendation handled.

### 5) Meta-progression board v2 seed

- Add branch-status helper derived from unlocked talent composition.
- Menu renders concise branch status line to seed branching progression identity.

## Determinism and Safety

- Share-code import uses explicit seed and bounded payload parsing.
- Replay persistence is read-only to gameplay flow and does not mutate simulation decisions.
- Content-pack fallback guarantees stable runtime when unknown pack IDs are requested.

## Validation Plan

- `pnpm check`
- `pnpm smoke`
- `pnpm build`
- `openspec validate znake-strategic-next-steps-foundations-v1 --type change --strict`
