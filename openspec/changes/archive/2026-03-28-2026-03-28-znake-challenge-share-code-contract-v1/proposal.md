## Why

Challenge share codes are a player-facing social surface in menu flow, but their parsing behavior (normalization, corruption handling, and compatibility tolerance) is currently implicit in code. We need an explicit contract plus deterministic coverage so copy/paste and cross-platform sharing stay reliable.

## What Changes

- Define challenge share-code contract in OpenSpec with explicit checksum integrity and tolerant import normalization behavior.
- Define observability expectations for challenge-share export/import success and failure reason telemetry.
- Add deterministic tests for round-trip encoding, corruption rejection, normalization defaults, and tolerant prefix parsing.
- Harden parser to accept case-insensitive prefix input without weakening checksum validation.

## Key Points (Codex-style)

- What is changing
  - Challenge share code behavior moves from implicit implementation detail to explicit requirement + deterministic tests.
- Why we are doing it
  - Improve player trust and reduce friction when sharing challenge runs across contexts/devices.
- Impacted areas
  - `src/game/core/challengeShare.ts`, `tests/*`, `openspec/specs/challenge-presets/spec.md`, `openspec/specs/observability/spec.md`.
- Risks / unknowns
  - Parser tolerance broadening could accidentally accept malformed codes if integrity checks are loosened; mitigation is strict checksum + payload validation tests.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `challenge-presets`: adds normative challenge share-code import/export contract.
- `observability`: adds normative challenge-share telemetry event expectations.

## Impact

- Affected code: challenge share parser and deterministic tests.
- No new dependencies.
- No runtime API changes outside tolerant input handling.
