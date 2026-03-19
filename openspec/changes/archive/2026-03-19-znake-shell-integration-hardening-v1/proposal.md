## Why

After migrating menus and shell pieces to DOM/CSS, we still have edge-risk around scene transitions: occasional layout jumps and potential input carry-over between scenes.

We need a focused hardening pass so the shell feels stable across Menu, Relic, Run, Upgrade, and Death on both mobile and desktop.

## What Changes

- Add scene-transition safeguards to reset virtual input state before scene handoff.
- Ensure shell chrome mode is set deterministically during transitions to reduce visual jumps.
- Add shared transition helper usage in high-frequency scene switches.
- Add a concise manual smoke checklist for transition stability verification.

## Capabilities

### New Capabilities

- `scene-flow-hardening`: Runtime transition guards for shell mode and virtual input reset across scene handoffs.

### Modified Capabilities

- `scenes`: Transition behavior is hardened for DOM overlay lifecycle and shell continuity.
- `input-hud`: Virtual input bridge is explicitly reset at scene transitions to avoid stale commands.

## Impact

- Affected code:
  - `src/game/scenes/*.ts` (transition call sites)
  - `src/game/systems/input.ts` (virtual input reset helper)
  - new `src/game/systems/sceneFlow.ts` helper
  - manual validation checklist document
- No gameplay balance/mechanics changes.
