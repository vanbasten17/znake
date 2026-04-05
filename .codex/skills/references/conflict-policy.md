# Skill Conflict Policy

Deterministic selection policy for:
- `explore-safe`
- `bugfix-safe`
- `gameplay-change`
- `rendering-only`
- `test-and-verify`

## Selection algorithm (strict order)
1. Collect candidates whose `Triggers` match keywords or intent.
2. If request is explicit validation-only (`test`, `verify`, `validate`, `run checks`) and no code edits are requested, select `test-and-verify`.
3. Compare `Priority`: `high > medium > low`.
4. Compare trigger specificity:
   - more matched keywords wins
   - if tied, stronger intent match wins
5. Apply safe-order tiebreaker:
   - `explore-safe > bugfix-safe > rendering-only > gameplay-change`
6. If still tied, select `explore-safe`.

## Fallback
- If no skill clearly matches, use `explore-safe`.
- Do not edit code until routing/scope is clear.

## Multi-skill execution
- If implementation and validation are both requested:
  - run one implementation skill first (`bugfix-safe` | `gameplay-change` | `rendering-only`)
  - then run `test-and-verify`
- Do not run two implementation skills in parallel for the same file set.

## Safety invariants
- Always apply `AGENTS.md` routing guide before edits.
- Keep gameplay rules in `src/game/core/**` or `src/game/simulation/**`.
- Keep scenes (`src/game/scenes/**`) orchestration-only.
- Avoid balance edits in `src/game/core/balance.ts` unless explicitly requested.
- Prefer minimal diffs and avoid unrelated refactors.
