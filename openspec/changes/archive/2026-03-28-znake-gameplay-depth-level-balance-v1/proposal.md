## Why

Znake's long-session pacing still swings between abrupt spike deaths and low-pressure flat segments, especially across deeper floors. A bounded depth-balance contract is needed now so enemy composition, item usefulness, and per-level fairness can be tuned systematically without breaking deterministic gameplay.

## What Changes

- Define a bounded 10-15 level balancing contract with explicit early/mid/late pressure targets and acceptable variance per level band.
- Add depth-aware enemy composition cadence requirements so role mixes stay varied while preserving role readability/counterplay windows.
- Add depth-aware item usefulness tuning requirements so spawn chance and effect value track run context and stay relevant in mid/late depth.
- Add level-band guardrail requirements that dampen abrupt pressure jumps and detect flat segments in progression pacing.
- Add observability requirements for per-level fail points and depth-tuning outcome events to support follow-up balancing passes.

## Key Points (Codex-style)

- **What is changing**
  - We formalize deterministic level-band balance targets for floors 1-15, then tie enemy composition and item usefulness to those same depth bands.
- **Why we are doing it**
  - Long sessions need clearer progression pressure and fairer recovery opportunities so deaths feel readable rather than random spikes.
- **Impacted areas**
  - Gameplay progression contracts, centralized balance tables, enemy-role cadence policy, run-map depth context, and observability event fields.
- **Risks / unknowns**
  - Over-tuning one pressure axis (enemy cadence or item relief) can flatten role identity; telemetry signal quality may require one follow-up normalization pass.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `gameplay`: add bounded level-band pressure and fairness guardrail requirements for 10-15 level runs.
- `balance-config`: add centralized depth-band tuning tables for pressure, role cadence, and item usefulness by run context.
- `enemy-role-taxonomy`: add depth-aware role-composition cadence/readability constraints.
- `run-map`: add deterministic depth-band context contract for level-balance systems.
- `observability`: add per-level fail-point and depth-tuning outcome telemetry requirements.

## Impact

- Affected specs: `openspec/specs/gameplay/spec.md`, `openspec/specs/balance-config/spec.md`, `openspec/specs/enemy-role-taxonomy/spec.md`, `openspec/specs/run-map/spec.md`, `openspec/specs/observability/spec.md`.
- Affected code is expected in balance/config tables, enemy/item selection helpers, and telemetry payload composition.
- Non-goals remain unchanged: no biome rewrite, no large enemy roster expansion, no nondeterministic adaptive difficulty system.
