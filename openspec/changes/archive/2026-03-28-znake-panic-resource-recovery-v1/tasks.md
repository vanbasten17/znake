## 1. Spec and design contracts

- [x] 1.1 Create proposal/design with Key Points (Codex-style).
- [x] 1.2 Add OpenSpec spec delta for body-economy.

## 2. Implementation

- [x] 2.1 Implement core logic for Panic Resource Recovery.
- [x] 2.2 Add or adjust UI/scene integration where needed.
- [x] 2.3 Add deterministic tests covering expected scenarios.

## 3. Validation and closeout

- [x] 3.1 Run pnpm check.
- [x] 3.2 Run pnpm build when behavior/architecture changes are introduced.
- [x] 3.3 Validate and summarize focused playtest checklist.

Playtest checklist:
- Verify panic window arms only at low-health threshold.
- Verify emergency pulse fallback is one-shot per active panic window.
- Verify panic rearm respects cooldown bounds.
