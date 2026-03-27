## Why

Upgrade families exist and are deterministic, but family-level affordances and consequences can still blur together in moment-to-moment selection, especially when players must decide quickly. This v2 pass improves identity legibility and consequence readability without a full economy rebalance.

## Key Points (Codex-style)

- **What is changing**
  - Family-level identity and tradeoff language is sharpened and made more explicit.
  - Upgrade cards present clearer consequence framing so players can compare decisions faster.
  - Family readability cues are reinforced in scene presentation without changing progression architecture.
- **Why we are doing it**
  - Improve strategic clarity and perceived fairness of upgrade decisions.
  - Reduce overlap/confusion between Aggro, Control, and Survival picks.
- **Impacted areas**
  - Upgrade-family metadata/copy, UpgradeScene card composition, and localization strings.
- **Risks / unknowns**
  - Overly verbose card copy can hurt scan speed on small screens.
  - Identity sharpening must avoid making families feel railroaded or one-dimensional.

## What Changes

- Add explicit family-level tradeoff descriptors alongside family summaries.
- Update upgrade card presentation to separate identity, playstyle, and tradeoff consequence lines.
- Keep deterministic draft behavior while improving readability of consequences in player-facing copy.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `upgrade-identity`: clarify family affordances/tradeoffs and strengthen decision-support metadata usage.
- `scenes`: improve upgrade scene readability hierarchy for family identity and consequence clarity.

## Impact

- Affected code:
  - `src/game/core/types.ts`
  - `src/game/core/upgrades.ts`
  - `src/game/scenes/UpgradeScene.ts`
  - `src/game/systems/i18n.ts`
  - `src/styles/upgradeOverlay.module.css`
- No new dependencies.
- Determinism preserved: draft selection remains seed-driven; changes focus on metadata and presentation.
