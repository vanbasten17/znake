## Context

Deterministic tests are central to this project. Shared scenario fixtures reduce repeated setup logic and make behavior regressions easier to isolate.

## Key Points (Codex-style)

- What is changing
  - Add reusable deterministic scenario fixtures for gameplay and balance tests.
- Why we are doing it
  - Increase iteration speed and confidence in behavior changes.
- Impacted areas
  - Tooling, test ergonomics, simulation validation workflows.
- Risks / unknowns
  - Fixture drift may hide production-like variance if overused.

## Goals / Non-Goals

Goals:
- Provide small composable fixture presets with fixed seeds.
- Keep fixture creation side-effect free and test-runner agnostic.
- Reduce boilerplate in simulation tests.

Non-Goals:
- Full snapshot-test harness rewrite.
- Runtime fixture use in shipping game code.

## Decisions

### Decision: Fixture modules by gameplay domain
- Group fixtures by economy, enemy pacing, and route choice scenarios.
- Rationale: improves discoverability and ownership.

### Decision: Seed registry for baseline scenarios
- Maintain a small named seed registry for core scenario families.
- Rationale: stable comparison and repeatability.

## Risks / Trade-offs

- Risk: Fixture assumptions may become stale after major balance shifts.
- Trade-off: Faster deterministic testing with maintenance of fixture catalog.
