## Why

Route planning is currently present, but players lack clear deterministic feedback about whether their route decisions were strong or why route pressure failed later. Adding route-mastery readouts now improves learning velocity, fairness perception, and post-run clarity without introducing a full tutorial system.

## Key Points (Codex-style)

- **What is changing**
  - Define deterministic route-mastery metrics and capture points tied to route-choice moments.
  - Add lightweight HUD and death-recap route-mastery readouts.
  - Add observability support bound to run-map/objective context.
- **Why we are doing it**
  - To help players understand good route decisions and failure causes in a way that supports mastery.
- **Impacted areas**
  - Run-map decision tracking, game/death scene readability surfaces, and telemetry payloads.
- **Risks / unknowns**
  - Readouts can become noisy if metric set is too broad.
  - Over-simplified metrics could misattribute failure causes.
  - HUD space remains constrained in portrait mode.

## What Changes

- Define a deterministic route-mastery metric summary (decision counts, branch usage, pressure-leaning, biome pivots, preview-risk context).
- Capture route-mastery updates at deterministic route-decision points.
- Surface concise route-mastery status in active HUD and concise route-mastery summary in death recap.
- Emit stable route-mastery decision and run-end telemetry payloads aligned with objective/run-map context.

## Capabilities

### New Capabilities

- `route-mastery-readability`: Defines deterministic route-mastery metrics and readouts for route learning feedback.

### Modified Capabilities

- `run-map`: Route-resolution contracts expand with deterministic route-mastery capture points.
- `scenes`: Game/death scene readability contracts expand with lightweight route-mastery readouts.
- `input-hud`: HUD readability requirements expand with concise route-mastery status context.
- `observability`: Telemetry requirements expand with route-mastery decision and run-end summary context.

## Impact

- Affected specs:
  - `openspec/specs/run-map/spec.md`
  - `openspec/specs/scenes/spec.md`
  - `openspec/specs/input-hud/spec.md`
  - `openspec/specs/observability/spec.md`
  - `openspec/specs/route-mastery-readability/spec.md` (new)
- Affected systems (planned):
  - Route-decision tracking helpers
  - `GameScene` run HUD / route status composition
  - `DeathScene` recap composition
  - Telemetry (`route_mastery_decision`, run-end route mastery fields)
- No new third-party dependencies are required.
