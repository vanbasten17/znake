## Why

We need a repeatable fairness verification loop that turns tuning assumptions into deterministic evidence before regressions reach runtime playtests. A seed-based suite gives fast, comparable signals for reaction windows, recoverability, and cheap-hit risk across depth bands.

## What Changes

- Add a deterministic, seed-based fairness validation suite focused on reaction window, recoverability, and no-cheap-hit metrics per depth band.
- Define centralized suite thresholds/inputs and deterministic output contract.
- Integrate suite execution into development workflows and emit concise evidence artifacts for balancing loops.

## Key Points (Codex-style)

- What is changing
  - Introduce tooling that computes bounded fairness metrics from deterministic seeds and validates against depth-band thresholds.
- Why we are doing it
  - Catch fairness regressions early and make tuning decisions evidence-backed.
- Impacted areas
  - Tooling scripts, fairness validation core helper, workflow scripts, observability-style evidence output.
- Risks / unknowns
  - Threshold calibration may need one follow-up pass if initial bands are too strict/lenient.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `tooling`: add deterministic fairness validation suite contract and evidence artifact expectations.
- `gameplay`: codify fairness validation coverage for reaction/recoverability/cheap-hit thresholds across depth bands.
- `observability`: define concise fairness evidence output fields for tuning loops.
- `balance-config`: define centralized fairness-suite threshold and seed inputs.

## Impact

- Affected code: `tools/`, fairness validation helper modules, workflow scripts, deterministic tests.
- No runtime gameplay behavior changes.
- No new dependencies.
