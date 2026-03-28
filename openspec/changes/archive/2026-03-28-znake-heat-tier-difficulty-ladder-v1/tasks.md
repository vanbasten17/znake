## 1. Spec and design contracts

- [x] 1.1 Create proposal/design with Key Points (Codex-style).
- [x] 1.2 Add OpenSpec spec delta for challenge-presets.

## 2. Implementation

- [x] 2.1 Implement core logic for Heat Tier Difficulty Ladder.
- [x] 2.2 Add/adjust UI or scene integration where needed.
- [x] 2.3 Add deterministic tests covering expected scenarios.

## 3. Validation and closeout

- [x] 3.1 Run pnpm check.
- [x] 3.2 Run pnpm build when behavior/architecture changes are introduced.
- [x] 3.3 Validate and summarize focused playtest checklist.

Playtest checklist:
- Verify heat tier 0 keeps baseline preset behavior.
- Verify higher tiers generate deterministic mutator stacks from same base mutator.
- Verify tier bounds clamp invalid values safely.
