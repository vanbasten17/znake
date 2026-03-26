## 1. Recap contract and data assembly

- [x] 1.1 Audit existing run-end state, telemetry payloads, and selected-upgrade metadata used by death summary.
- [x] 1.2 Define a recap view-model contract for death reason, build-family leaning, and notable run choices with graceful fallbacks.
- [x] 1.3 Implement the run-end summary assembly path so recap data is derived from existing state instead of duplicate tracking.

## 2. Death scene presentation

- [x] 2.1 Update the death-scene DOM overlay to render the concise recap with clear hierarchy.
- [x] 2.2 Tune responsive copy/layout behavior so recap content remains readable on portrait mobile and desktop widths.
- [x] 2.3 Add or update localization-ready copy keys for the new recap labels and fallback states.

## 3. Verification

- [x] 3.1 Verify recap output for common death causes and mixed-vs-dominant upgrade-family runs.
- [x] 3.2 Verify telemetry/run-end context remains aligned with recap inputs without adding duplicate analytics-only events.
- [x] 3.3 Run `pnpm build` and `pnpm check`.
