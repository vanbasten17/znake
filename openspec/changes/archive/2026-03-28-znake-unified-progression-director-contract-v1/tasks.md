## 1. Unified Contract Surface

- [x] 1.1 Add deterministic core progression-director resolver types and API that compose depth band, biome phase, pacing guardrails, role policy window/caps, and terrain modifier knobs.
- [x] 1.2 Keep composition in core/config helpers and avoid scene-local re-composition logic.

## 2. Deterministic Verification

- [x] 2.1 Add deterministic tests proving equivalent floor/spawn inputs produce equivalent unified progression payloads.
- [x] 2.2 Add deterministic tests proving role-cap/window and pacing/terrain fields match existing centralized resolver/config values.

## 3. Validation

- [x] 3.1 Run `pnpm check` and resolve regressions.
- [x] 3.2 Run `pnpm build` for behavior/contract safety verification.
