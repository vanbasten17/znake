## 1. Depth-band balance contract

- [x] 1.1 Add centralized depth-band balance config for floors 1-15 (early/mid/late pressure targets, guardrail thresholds, and item usefulness knobs).
- [x] 1.2 Add deterministic helper utilities to resolve floor depth band and derive bounded pressure settings from config.

## 2. Enemy and item tuning integration

- [x] 2.1 Update enemy role cadence/composition selection to use depth-band policy while preserving role readability and seeded determinism.
- [x] 2.2 Update item spawn/usefulness resolution to use depth-band policy and run context (objective/room state) without scene-local hardcoded branching.

## 3. Guardrails and observability

- [x] 3.1 Apply level-band guardrails in floor setup/spawn pacing to reduce abrupt pressure spikes and flat segments.
- [x] 3.2 Extend telemetry to emit per-level fail-point and depth-tuning outcome context for balancing analysis.

## 4. Validation

- [x] 4.1 Add/update deterministic tests for depth-band resolution and tuned enemy/item selection behavior.
- [x] 4.2 Run `pnpm check` and `pnpm build`; update this tasks file to mark completed items.
