## Why

Body length already acts as a shared resource, but body positioning is not yet formalized as a readable tactical terrain contract. Making body-terrain deterministic and explicit now strengthens fairness and decision clarity without requiring a roster or map-system rewrite.

## Key Points (Codex-style)

- **What is changing**
  - Add deterministic body-terrain mechanics for lanes, local zones, trap risk, and safe-pocket availability.
  - Add recoverability guardrails for body-spend actions so high-pressure moments preserve agency.
  - Add concise body-terrain readability cues and telemetry hooks.
- **Why we are doing it**
  - To turn body positioning into intentional tactical play instead of incidental movement side effects.
- **Impacted areas**
  - Gameplay/body-economy simulation helpers, central balance knobs, run HUD readability, and observability payloads.
- **Risks / unknowns**
  - Overly strict guardrails could reduce skill expression on aggressive lines.
  - Overly verbose cues could crowd existing objective/status readability.
  - Terrain metrics may need tuning per room pressure level.

## What Changes

- Define deterministic body-terrain snapshot mechanics (lane control, zone control, safe-pocket count, trap-risk flag) from current run state.
- Add recoverability guardrails for body-spend actions in high-pressure contexts using centralized thresholds.
- Surface concise body-terrain readability cues in HUD/status flows without moving gameplay ownership into scene code.
- Emit stable telemetry for body-terrain snapshots and guardrail interventions to support fairness tuning.

## Capabilities

### New Capabilities

- `body-terrain-mechanics`: Defines deterministic body-positioning terrain contracts and recoverability guardrails.

### Modified Capabilities

- `gameplay`: Contracts expand to include deterministic body-terrain snapshot behavior and fairness guardrails tied to positioning.
- `body-economy`: Spend-resolution expectations expand with body-terrain recoverability validation.
- `input-hud`: HUD readability expectations expand with concise body-terrain tactical cues.
- `observability`: Telemetry expands with body-terrain snapshot and guardrail-intervention context.

## Impact

- Affected specs:
  - `openspec/specs/gameplay/spec.md`
  - `openspec/specs/body-economy/spec.md`
  - `openspec/specs/input-hud/spec.md`
  - `openspec/specs/observability/spec.md`
  - `openspec/specs/body-terrain-mechanics/spec.md` (new)
- Affected systems (planned):
  - Body-terrain simulation helpers
  - Body-economy spend validation flow
  - `GameScene` objective/status readability orchestration
  - Telemetry emission for terrain snapshots and guardrail outcomes
- No new third-party dependencies are required.
