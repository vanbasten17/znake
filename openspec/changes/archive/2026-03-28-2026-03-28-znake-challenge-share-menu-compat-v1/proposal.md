## Why

Two active challenge-share UX issues remain: menu prompt copy is hardcoded in English, and import compatibility should tolerate URL-safe base64 body variants used by some chat/link channels. These are low-risk but high-trust improvements for player sharing flow.

## What Changes

- Localize challenge-share prompt labels in menu flow and provide deterministic fallback labels when translation keys are missing.
- Add URL-safe body normalization for challenge-share import (`-`/`_` variants) while preserving strict checksum and payload validation.
- Add deterministic tests for prompt-copy fallback behavior and URL-safe import equivalence path.
- Add OpenSpec deltas for `input-hud`, `scenes`, and `challenge-presets` to codify these contracts.

## Key Points (Codex-style)

- What is changing
  - Challenge-share prompt copy is moved to localization keys with bounded fallback behavior; parser normalizes URL-safe body variants.
- Why we are doing it
  - Improve cross-locale readability and reduce copy/paste import friction without weakening integrity checks.
- Impacted areas
  - `MenuScene`, i18n resources, challenge-share codec, deterministic tests, and related OpenSpec capability specs.
- Risks / unknowns
  - Over-broad normalization could hide malformed codes; mitigated by keeping checksum + payload validation mandatory.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `input-hud`: localized prompt-copy contract for challenge share interactions.
- `scenes`: menu scene prompt flow must consume localized challenge-share copy with deterministic fallback behavior.
- `challenge-presets`: challenge-share import accepts URL-safe body variants via canonical normalization with unchanged integrity checks.

## Impact

- Affected code: menu prompt copy flow and share-code parser.
- No new dependencies.
- No gameplay rule changes.
