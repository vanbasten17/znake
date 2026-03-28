## Why

Balancing decisions can drift or over-correct when there is no shared quick-reference workflow linking gameplay signals to concrete tuning knobs. A concise cookbook improves iteration speed and safety.

## Key Points (Codex-style)

- What is changing
  - Add a dedicated dev balancing cookbook document.
  - Link cookbook from README for discoverability.
- Why we are doing it
  - Standardize balancing loops and reduce risky ad-hoc tuning.
- Impacted areas
  - Developer documentation and onboarding path.
- Risks / unknowns
  - Cookbook can become stale if not periodically updated.

## What Changes

- Add `docs/DEV_BALANCING_COOKBOOK.md` with signal-to-knob mapping and validation checklist.
- Add README link under docs references.

## Capabilities

### Modified Capabilities

- `tooling`: Developers gain a shared balancing workflow artifact tied to deterministic validation.

## Impact

- Affected code:
  - `docs/DEV_BALANCING_COOKBOOK.md`
  - `README.md`
- No dependency changes.
