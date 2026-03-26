## Why

Znake's current upgrade draft is functional, but most picks read like isolated stat bumps instead of run-defining choices. We need a small, legible family structure so early upgrade moments push players toward different movement, routing, and survival patterns.

## Key Points (Codex-style)

### What is changing

- Add three upgrade families: Aggro, Control, and Survival.
- Replace the flat upgrade pool with a data-driven family taxonomy and a stronger first-pass upgrade set.
- Add lightweight tradeoff and synergy metadata so reward flow can surface identity cleanly.
- Update upgrade drafting so family information and behavioral purpose are visible to the player.

### Why we are doing it

- Make runs feel meaningfully different earlier.
- Tie upgrade choices to space management, pressure, and recovery decisions instead of passive scaling.
- Preserve room for later expansion without redesigning the reward system twice.

### Impacted areas

- Core upgrade definitions, run-config hooks, and draft-selection contracts.
- Upgrade scene card content and reward-flow presentation.
- Gameplay config composition where upgrade effects alter movement, pressure, zoning, or forgiveness.

### Risks / unknowns

- Family labels can feel cosmetic if effects do not visibly change routing or body management.
- Tradeoffs can create trap picks if downside text is unclear or upside is too narrow.
- Existing run-config fields may need modest expansion to support stronger identity without pushing gameplay logic into UI.

## What Changes

- Add an `upgrade-identity` capability that defines family taxonomy, tradeoff notes, synergy notes, and reward-selection hooks.
- Restructure upgrade data so each upgrade declares a family, gameplay role, short design intent, and behavioral tags in addition to its apply hook.
- Create an initial pool of 2 to 4 upgrades per family with first-pass tuning:
  - Aggro focuses on speed, pressure, burst payoff, and riskier routing.
  - Control focuses on zoning, safer map shaping, and tempo control.
  - Survival focuses on shields, forgiveness, recovery, and stability.
- Add simple selection rules so reward flow can surface distinct family options and recognize early cross-family synergies.
- Update upgrade presentation so the family identity and tradeoff purpose are visible in the draft overlay.

## Capabilities

### New Capabilities

- `upgrade-identity`: Family-based run upgrades, synergy/tradeoff metadata, and reward-selection hooks for identity-driven drafts.

### Modified Capabilities

- `game-core`: Upgrade definitions and run-config contracts expand to support family metadata and stronger behavior-changing effects.
- `gameplay`: In-run upgrade behavior expands so early picks influence routing, timing, and body-management decisions.
- `scenes`: Upgrade draft presentation expands to surface family identity and tradeoff context clearly.

## Impact

- Affected specs:
  - `upgrade-identity`
  - `game-core`
  - `gameplay`
  - `scenes`
- Affected runtime:
  - `src/game/core/types.ts`
  - `src/game/core/upgrades.ts`
  - `src/game/core/balance.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/scenes/UpgradeScene.ts`
  - `src/game/systems/i18n.ts`
