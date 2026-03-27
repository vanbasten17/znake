## Why

Znake already has foundational readability and fairness specs, but it lacks a dedicated elite/miniboss capability contract that makes encounters memorable, learnable, and consistently fair. Defining first-pass deterministic pattern kits, counterplay windows, and telemetry now closes the highest-value gap identified in `NEXT_STEPS.md` without forcing a full boss overhaul.

## Key Points (Codex-style)

- **What is changing**
  - We define first-pass elite/miniboss capability rules for pattern kits, telegraph readability, reaction fairness, progression cadence, and telemetry.
- **Why we are doing it**
  - We want losses to feel earned and teachable, while making elite encounters stand out as memorable run moments with clear player agency.
- **Impacted areas**
  - Gameplay contracts, centralized balance knobs, scene readability surfaces, and observability event payloads.
- **Risks / unknowns**
  - Over-constraining cadence could flatten difficulty variety; under-constraining can reintroduce cheap-hit patterns and unreadable pressure stacking.

## What Changes

- Add first-pass elite/miniboss pattern-kit requirements with explicit telegraph phases, commitment windows, and punish/recovery windows.
- Add fairness guardrails for elite/miniboss encounters: minimum reaction windows, spawn safety constraints, and anti-cheap-hit sequencing rules.
- Define progression integration contracts for when elite/miniboss encounters appear, how objective/reward gating applies, and how cadence scales by run depth.
- Define telemetry contracts for encounter readability, failure-attribution reason codes, and counterplay-window outcomes.
- Keep scene ownership boundaries clear: simulation and balance config own rules; scene presents readable cues and summaries.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `gameplay`: Add elite/miniboss pattern-kit, counterplay, fairness, and progression-cadence requirement coverage.
- `balance-config`: Add centralized tuning requirements for elite/miniboss windows, anti-cheap-hit constraints, and cadence/reward gate knobs.
- `observability`: Add telemetry requirements for elite/miniboss readability signals and player-failure reason attribution.
- `scenes`: Add scene-level readability presentation contracts for elite/miniboss telegraphs, state cues, and post-encounter summary context.

## Impact

- Affected systems:
  - Gameplay simulation contracts for elite/miniboss state machines and fairness sequencing.
  - Balance data tables for telegraph timing, recovery windows, spawn safety, cadence, and rewards.
  - GameScene/UI overlays for readable warning and counterplay cues.
  - Telemetry schema/dashboard pipelines for readability and failure-reason analytics.
- No new dependency is required.
- No full boss rework, biome redesign, or broad visual overhaul is included in this scope.
