## Context

Gameplay already has deterministic fairness knobs (combat grace windows, telegraph timings, spawn fairness thresholds, depth-band setup), but there is no dedicated suite that validates those knobs holistically across seeded scenarios and depth bands. We need a non-invasive tooling layer that consumes existing deterministic systems and produces concise pass/fail evidence.

## Key Points (Codex-style)

- What is changing
  - Add a deterministic fairness-validation evaluator + CLI evidence reporter.
- Why we are doing it
  - Improve balancing iteration speed and prevent fairness drift from creeping into runtime.
- Impacted areas
  - `src/game/tooling`, `tools/`, package scripts, deterministic tests, central config thresholds.
- Risks / unknowns
  - First-pass metrics may underrepresent edge-case board topologies; thresholds should stay conservative.

## Goals / Non-Goals

**Goals:**
- Validate reaction windows, recoverability, and cheap-hit risk deterministically across depth bands.
- Keep suite deterministic from centralized seeds/thresholds.
- Emit concise machine-readable evidence artifact for tuning/autoloop.
- Avoid runtime behavior drift.

**Non-Goals:**
- No adaptive runtime difficulty.
- No changes to scene gameplay flow.
- No non-deterministic Monte Carlo shortcuts.

## Decisions

1. Build a pure fairness-evaluation helper under `src/game/tooling` and keep CLI as thin I/O wrapper.
- Rationale: maximizes testability and reusability.
- Alternative considered: all logic in script. Rejected due lower testability.

2. Source thresholds and seed inputs from centralized balance config.
- Rationale: preserves data-driven tuning and avoids duplicated thresholds.
- Alternative considered: hardcoded script thresholds. Rejected as drift-prone.

3. Integrate suite into `pnpm check` for early signal while keeping output concise.
- Rationale: catches regressions on normal workflow path.
- Alternative considered: standalone command only. Rejected due weaker integration.

## Risks / Trade-offs

- [False confidence risk] Probe model is bounded and may miss rare runtime states.
  - Mitigation: keep metrics conservative and extend with additional probes incrementally.
- [Workflow cost] Extra check step can add minor local runtime.
  - Mitigation: keep sample sizes bounded and deterministic.
