## 1. Deterministic pacing foundation

- [x] 1.1 Add centralized pacing config and bounded reason-code taxonomy for phase transitions and anti-overlap interventions.
- [x] 1.2 Add simulation types/helpers for deterministic predator-prey pacing phase state (`hunt`, `escape`, `reset`) and transitions.

## 2. Encounter integration and fairness guardrails

- [x] 2.1 Integrate pacing state updates into encounter progression without moving gameplay rules into `GameScene`.
- [x] 2.2 Enforce anti-overlap pressure guardrails for high-pressure actions with deterministic fallback/defer behavior.

## 3. Readability and observability

- [x] 3.1 Surface concise pacing/readability hooks in `GameScene` HUD/status using simulation-owned pacing state.
- [x] 3.2 Emit pacing lifecycle/intervention telemetry and include bounded pacing summary fields in run-end context.

## 4. Validation

- [x] 4.1 Add deterministic tests for pacing transitions and anti-overlap guardrails.
- [x] 4.2 Run `openspec validate znake-predator-prey-pacing-contracts-v1`.
- [x] 4.3 Run `pnpm check`.
- [x] 4.4 Run `pnpm build`.
- [ ] 4.5 Manual smoke:
- [ ] hunt/escape rhythm feels intentional and readable in combat + elite rooms
- [ ] overlap guardrails prevent unfair chain pressure without removing danger
- [ ] pacing status cues remain concise and non-intrusive on desktop/mobile HUD
