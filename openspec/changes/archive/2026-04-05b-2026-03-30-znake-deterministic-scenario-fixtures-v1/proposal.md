## Why

Balancing and regression checks are slowed by ad-hoc test setup and inconsistent scenario reproducibility.

## Key Points (Codex-style)

- What is changing
  - Add reusable deterministic scenario fixtures for gameplay and balance tests.
- Why we are doing it
  - Increase iteration speed and confidence in behavior changes.
- Impacted areas
  - Tooling, test ergonomics, simulation validation workflows.
- Risks / unknowns
  - Fixture drift may hide production-like variance if overused.

## What Changes

- Define fixture contracts for seeded run state presets.
- Add fixture composition helpers for common test setups.
- Add governance rules for fixture evolution and naming.

## Capabilities

### Modified Capabilities

- affected spec: tooling

## Impact

- Affected code (expected):
  - src/game/tooling/
  - tests/
  - package scripts
