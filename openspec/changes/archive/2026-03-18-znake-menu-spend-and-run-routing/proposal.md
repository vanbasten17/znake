## Why

The retention MVP added currency and talents, but spending is currently keyboard-centric and not obvious for all players. We also need explicit post-death routing so players can either chain runs quickly or return to menu to manage progression.

## What Changes

- Add explicit, clickable Main Menu UI for spending currency on talents.
- Keep keyboard shortcuts as optional fast path, but not as the only spending path.
- Add two clear death-flow actions: **Next Run** and **Main Menu**.
- Preserve current quick loop by defaulting Start/Enter to Next Run.

## Capabilities

### New Capabilities

- `menu-meta-spending`: Visible and interactive menu spending flow for persistent currency.

### Modified Capabilities

- `scenes`: Death scene now branches to next run or main menu; menu scene gains interactive spend controls.
- `meta-progression`: Talent spending flow includes pointer/touch interaction and clearer affordances.

## Impact

- Affected files:
  - `src/game/scenes/MenuScene.ts`
  - `src/game/scenes/DeathScene.ts`
  - supporting hint text / state hooks as needed
- No backend/API changes.
