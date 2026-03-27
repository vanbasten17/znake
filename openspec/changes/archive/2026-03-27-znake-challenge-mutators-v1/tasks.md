## 1. Mutator Schema and Draft Pipeline

- [x] 1.1 Add centralized balance-config schema for mutator taxonomy, weights, compatibility tags, and guardrails.
- [x] 1.2 Implement deterministic mutator draft resolver from run seed + progression context.
- [x] 1.3 Implement deterministic fallback behavior when a candidate set fails compatibility checks.

## 2. Gameplay Composition Contracts

- [x] 2.1 Add simulation-side mutator application contract for objective/reward resolution hooks.
- [x] 2.2 Add run-map intent composition contract so mutators can influence bounded route resolution without topology rewrites.
- [x] 2.3 Add body-economy and event-choice compatibility validators to prevent invalid or non-recoverable states.

## 3. Readability and Anti-Frustration Guardrails

- [x] 3.1 Add guardrail validator for pressure-budget caps, blocked combinations, and recovery-floor checks.
- [x] 3.2 Add player-facing mutator summary payload (short label + effect/risk copy) for overlay/HUD surfaces.
- [x] 3.3 Add deterministic tests for fairness windows, spawn pressure, and objective solvability under mutators.

## 4. Meta and Observability Integration

- [x] 4.1 Add lightweight mutator availability gating contract in meta profile without permanent stat inflation.
- [x] 4.2 Emit mutator lifecycle telemetry events (`drafted`, `activated`, `blocked`, `resolved_impact`) with run context.
- [x] 4.3 Add verification checks for seed reproducibility and telemetry payload completeness.

## 5. Validation

- [x] 5.1 Run `pnpm build` and fix any integration regressions.
- [x] 5.2 Run `pnpm check` and resolve lint/type issues.
- [x] 5.3 Perform focused gameplay validation scenarios for mutator readability and anti-frustration behavior.
