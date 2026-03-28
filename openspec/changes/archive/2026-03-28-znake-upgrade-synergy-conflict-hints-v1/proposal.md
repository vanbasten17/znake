## Why

Upgrade choices already include rich identity text, but comparison speed can still stall in high-pressure moments. Adding compact synergy/conflict hints in the draft card improves readability and decision confidence without changing upgrade math.

## Key Points (Codex-style)

- What is changing
  - Add compact synergy and conflict hint chips to upgrade draft cards.
- Why we are doing it
  - Improve decision readability and reduce hesitation in upgrade picks.
- Impacted areas
  - Upgrade scene card composition and styles.
- Risks / unknowns
  - Additional text can create visual density if not tightly bounded.

## What Changes

- Reuse existing upgrade metadata (`synergy`, `tradeoff`) as explicit hint chips.
- Render one positive (`SYNERGY`) and one caution (`CONFLICT`) chip per card.
- Keep pick flow and underlying upgrade behavior unchanged.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `scenes`: Upgrade scene card presentation includes explicit synergy/conflict hints.
- `upgrade-identity`: Decision context cues now include dedicated comparison chips.

## Impact

- Affected code:
  - `src/game/scenes/UpgradeScene.ts`
  - `src/styles/upgradeOverlay.module.css`
- No dependency changes.
