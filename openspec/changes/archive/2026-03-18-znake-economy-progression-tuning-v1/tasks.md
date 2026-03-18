## 1. Economy tuning

- [x] 1.1 Add/refine reward pacing knobs in centralized balance config.
- [x] 1.2 Rebalance talent costs for smoother early unlock cadence.
- [x] 1.3 Ensure run reward calculation uses updated knobs only.
- [x] 1.4 Adjust non-boss floor progression to snake-length targets (8 base, +1 per floor until boss).
- [x] 1.5 Add explicit in-run hint text for remaining requirement to next floor.

## 2. Mid-term goals

- [x] 2.1 Extend profile model with goal progress + claim state (with safe defaults).
- [x] 2.2 Add goal progress updates at run-end/combat milestones.
- [x] 2.3 Add one-time goal reward claim flow and persistence.
- [x] 2.4 Show compact goal progress in main menu.

## 3. Observability

- [x] 3.1 Emit reward breakdown telemetry at run end.
- [x] 3.2 Emit goal progressed/claimed telemetry with identifiers and value deltas.

## 4. Validation

- [x] 4.1 Validate OpenSpec change.
- [x] 4.2 Run `biome`, `tsc --noEmit`, and `build`.
