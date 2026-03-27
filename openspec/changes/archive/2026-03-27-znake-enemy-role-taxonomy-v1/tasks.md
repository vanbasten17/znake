## 1. OpenSpec definition

- [x] 1.1 Create proposal, design, tasks, and spec deltas for `znake-enemy-role-taxonomy-v1`.

## 2. Role taxonomy foundations

- [x] 2.1 Add centralized role taxonomy config for `sniper`, `blocker`, `summoner`, `charger`, and `leech` with telegraph/counterplay/fairness knobs.
- [x] 2.2 Extend simulation types/contracts to represent role identity, telegraph state, counterplay windows, and cadence metadata deterministically.
- [x] 2.3 Map current enemy variants to role contracts without changing non-targeted behaviors.

## 3. Deterministic role behavior and fairness

- [x] 3.1 Implement role behavior hooks for first-pass role actions (sniper lane threat, blocker space denial, summoner escalation, charger burst commit, leech economy pressure).
- [x] 3.2 Implement role-composition fairness guardrails (anti-stack overlap limits, cadence spacing, deterministic fallbacks).
- [x] 3.3 Route room spawn/cadence selection through data-driven role policy while preserving deterministic seeded outcomes.

## 4. Scene orchestration and readability

- [x] 4.1 Expose role-state readability payloads from simulation to scene orchestration interfaces.
- [x] 4.2 Add lightweight role telegraph/counterplay presentation cues in `GameScene` without scene-owned role logic.
- [x] 4.3 Add concise room-start role-context surfacing for tactical readability.

## 5. Observability and validation

- [x] 5.1 Add telemetry events for encounter role composition and role-pressure outcomes.
- [x] 5.2 Add deterministic tests for role cadence, fairness guardrails, and stable seed replay behavior.
- [x] 5.3 Run `openspec validate znake-enemy-role-taxonomy-v1`.
- [x] 5.4 Run `pnpm check`.
- [x] 5.5 Run `pnpm build`.
- [ ] 5.6 Manual smoke:
- [ ] sniper and charger telegraphs are readable before impact
- [ ] blocker and summoner pressure stays dangerous without no-agency traps
- [ ] leech economy pressure is understandable and contestable
- [ ] multi-role rooms preserve fairness windows and tactical clarity
