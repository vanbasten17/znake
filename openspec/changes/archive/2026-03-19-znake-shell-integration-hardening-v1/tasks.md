## 1. OpenSpec definition

- [x] 1.1 Create proposal/design/tasks and relevant spec deltas.

## 2. Transition hardening implementation

- [x] 2.1 Add shared scene transition helper with virtual input reset and optional shell chrome pre-set.
- [x] 2.2 Replace high-frequency scene handoff call sites to use the shared helper.
- [x] 2.3 Add explicit GameScene shutdown cleanup for listeners/status artifacts.
- [x] 2.4 Add a concise manual smoke checklist document for shell and transition stability.

## 3. Validation

- [x] 3.1 Run `openspec validate znake-shell-integration-hardening-v1`.
- [x] 3.2 Run `pnpm check`.
- [x] 3.3 Run `pnpm build`.
