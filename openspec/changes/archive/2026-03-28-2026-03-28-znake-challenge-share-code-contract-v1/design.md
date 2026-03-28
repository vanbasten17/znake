## Context

Menu flow already exports/imports challenge share codes and emits telemetry events, but the contract is undocumented and untested. Because this path influences player agency and social replayability, we should preserve deterministic parsing and explicit corruption rejection while allowing low-risk tolerance improvements for real-world copy/paste variants.

## Key Points (Codex-style)

- What is changing
  - Introduce an explicit share-code contract and deterministic test coverage; parser accepts case-insensitive prefix while keeping checksum/payload strict.
- Why we are doing it
  - Keep challenge sharing reliable, fair, and debuggable across player environments.
- Impacted areas
  - Core share codec (`challengeShare.ts`), deterministic tests, challenge-presets and observability specs.
- Risks / unknowns
  - Over-tolerant parsing could hide bad inputs; checksum mismatch and payload validation remain hard fails.

## Goals / Non-Goals

**Goals:**
- Keep share-code decode deterministic and integrity-checked.
- Add concise deterministic tests covering success and failure paths.
- Capture telemetry expectations so export/import instrumentation remains stable.

**Non-Goals:**
- No redesign of challenge preset seed generation.
- No new UI controls in menu.
- No changes to forced mutator eligibility rules.

## Decisions

1. Keep checksum requirement unchanged and mandatory.
- Rationale: preserves anti-corruption guardrail and avoids silently accepting tampered payloads.
- Alternative considered: best-effort decode without checksum. Rejected for fairness and trust risk.

2. Accept case-insensitive share-code prefix on import.
- Rationale: copy/paste channels may normalize casing; this tolerance improves UX without expanding payload surface.
- Alternative considered: strict uppercase-only prefix. Rejected due to avoidable import failures.

3. Add deterministic node tests directly against codec functions.
- Rationale: fast feedback, high signal, and simulation-safe (no Phaser/menu orchestration coupling).
- Alternative considered: scene-level integration tests. Rejected as heavier and less deterministic for codec semantics.

## Risks / Trade-offs

- [Tolerance drift] Parser may gradually become too permissive.
  - Mitigation: keep checksum + payload validation mandatory and document requirement boundaries.
- [Telemetry drift] Event names or failure reason usage could diverge in future refactors.
  - Mitigation: codify observability requirement for challenge share lifecycle events.
