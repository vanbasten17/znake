## 1. Body-terrain foundations

- [x] 1.1 Add centralized body-terrain config and bounded guardrail reason taxonomy.
- [x] 1.2 Add pure simulation helpers to compute deterministic body-terrain snapshots (lane control, zone control, safe-pocket count, trap risk).

## 2. Fairness and recoverability guardrails

- [x] 2.1 Integrate body-terrain snapshot updates into gameplay flow without moving ownership out of simulation/helpers.
- [x] 2.2 Apply recoverability guardrails to body-spend actions in high-pressure low-agency states with deterministic outcomes.

## 3. Readability and observability

- [x] 3.1 Add concise body-terrain tactical cue(s) to existing HUD/status composition.
- [x] 3.2 Emit telemetry for terrain snapshots and guardrail interventions.

## 4. Validation

- [x] 4.1 Add deterministic tests for body-terrain snapshot and guardrail behavior.
- [x] 4.2 Run `openspec validate znake-body-terrain-mechanics-v1`.
- [x] 4.3 Run `pnpm check`.
- [x] 4.4 Run `pnpm build`.
- [ ] 4.5 Manual smoke:
- [ ] body terrain cues remain readable while moving under pressure
- [ ] body spend guardrails prevent low-agency collapse without removing tactical options
- [ ] telemetry events clearly differentiate snapshot and guardrail intervention cases
