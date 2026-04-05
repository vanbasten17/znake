## Why

Balance tuning is slowed by inconsistent event payloads that lack normalized run-state snapshots.

## Key Points (Codex-style)

- What is changing
  - Introduce a normalized telemetry snapshot schema for balance-relevant moments.
- Why we are doing it
  - Speed up balance iteration and reduce interpretation ambiguity.
- Impacted areas
  - Observability contracts, telemetry gateway, analytics consumers.
- Risks / unknowns
  - Schema growth can raise payload volume if unbounded.

## What Changes

- Define canonical snapshot fields for combat, economy, and objective state.
- Add schema versioning requirements for backward compatibility.
- Define emission points at key decision/outcome boundaries.

## Capabilities

### Modified Capabilities

- affected spec: observability

## Impact

- Affected code (expected):
  - src/game/systems/telemetry.ts
  - src/game/systems/telemetryGateway.ts
  - src/game/systems/telemetryEvents.ts
  - tests/
