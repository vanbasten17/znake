## Context

Challenge share code behavior is already deterministic and integrity-checked, but two UX reliability gaps remain in the menu pipeline: hardcoded English prompt labels and lack of explicit URL-safe import compatibility contract. We can close both gaps with minimal scene and codec changes.

## Key Points (Codex-style)

- What is changing
  - Add a small copy-resolution helper with fallback-safe localized labels and normalize URL-safe share-code body variants at parse time.
- Why we are doing it
  - Keep challenge sharing readable across locales and robust across copy channels.
- Impacted areas
  - `src/game/scenes/MenuScene.ts`, `src/game/systems/i18nResources.ts`, `src/game/core/challengeShare.ts`, deterministic tests.
- Risks / unknowns
  - Parser normalization scope drift; bounded by unchanged checksum and payload validation requirements.

## Goals / Non-Goals

**Goals:**
- Eliminate hardcoded challenge-share prompt strings from menu scene.
- Preserve deterministic parser guarantees while allowing URL-safe body normalization.
- Provide deterministic tests for localization fallback and URL-safe compatibility path.

**Non-Goals:**
- No scene-flow redesign.
- No telemetry event schema changes.
- No mutation of challenge preset seed or mutator policy.

## Decisions

1. Resolve menu prompt copy through translation keys with explicit fallback strings.
- Rationale: keeps UX localized but resilient if a key is absent.
- Alternative considered: direct `t()` calls only. Rejected because key echo regressions can leak to players if a locale key is missing.

2. Normalize URL-safe share-code body before checksum/decode.
- Rationale: compatibility for channels that rewrite base64 tokens while preserving strict integrity validation.
- Alternative considered: dual checksum acceptance over raw and normalized bodies. Rejected as unnecessary broadening.

3. Keep tests deterministic and scene-light.
- Rationale: prompt-copy fallback and parser normalization are pure contracts that do not need Phaser integration tests.
- Alternative considered: menu scene integration testing. Rejected for lower signal and higher maintenance.

## Risks / Trade-offs

- [Localization fallback drift] Missing keys could still affect player copy quality.
  - Mitigation: deterministic fallback helper and explicit translation keys in both supported locales.
- [Compatibility ambiguity] URL-safe normalization might appear to accept broader malformed input.
  - Mitigation: retain strict checksum and payload validity rejection behavior.
