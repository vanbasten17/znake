## 1. OpenSpec definition

- [x] 1.1 Create proposal/design/tasks + gameplay spec delta.

## 2. Implementation

- [x] 2.1 Implement boss-collision knockback response.
- [x] 2.2 Ensure shield + boss damage + knockback order is deterministic.
- [x] 2.3 Add distinct collision feedback cue for boss impact.

## 3. Validation

- [x] 3.1 Run `openspec validate znake-boss-knockback-feedback-v1`.
- [x] 3.2 Run `pnpm check`.
- [x] 3.3 Run `pnpm build`.
- [ ] 3.4 Manual smoke:
- [ ] shielded boss collision is readable
- [ ] unshielded boss collision remains lethal as designed
- [ ] no wall/squeeze invalid displacement edge cases
