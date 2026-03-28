## 1. Spec and design contracts

- [x] 1.1 Create proposal/design with Key Points (Codex-style).
- [x] 1.2 Add OpenSpec spec delta for gameplay.

## 2. Implementation

- [x] 2.1 Implement core logic for Companion Drone System.
- [x] 2.2 Add/adjust UI or scene integration where needed.
- [x] 2.3 Add deterministic tests covering expected scenarios.

## 3. Validation and closeout

- [x] 3.1 Run pnpm check.
- [x] 3.2 Run pnpm build when behavior/architecture changes are introduced.
- [x] 3.3 Validate and summarize focused playtest checklist.

Playtest checklist:
- Verify drone support hint appears only when cooldown reaches ready state.
- Verify consecutive kills during cooldown do not retrigger support.
- Verify score bonus stays bounded and deterministic for same combat sequence.
