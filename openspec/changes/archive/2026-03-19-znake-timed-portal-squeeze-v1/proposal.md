## Why

Current floor progression is mostly based on growth thresholds and boss defeat, but lacks explicit time pressure in standard floors.

A timed portal with squeeze fallback is the highest ROI mechanic from brainstorming: it adds tension, forces routing decisions, and creates a stronger floor rhythm.

## What Changes

- Add timed portal objective for non-boss floors in GameScene.
- Open a portal when countdown reaches zero.
- Add grace window after portal opens; if player delays, activate squeeze walls that progressively reduce playable area.
- Advance floor when player enters the opened portal.
- Expose balance knobs for countdown, grace, and squeeze pacing.
- Rotate non-boss floor objectives by round pattern instead of always using portal:
  - Objective A: countdown + portal entry
  - Objective B: countdown + target score
  - Objective C: countdown + kill-N enemies
- Randomize the starting point of that cycle per run, while keeping the cycle stable inside each run.
- Keep objective thresholds data-driven and tuned per floor band for fair early progression.

## Capabilities

### New Capabilities

- `timed-portal-flow`: Floor objective flow based on countdown -> portal open -> squeeze pressure -> portal entry.

### Modified Capabilities

- `gameplay`: Non-boss floor completion objective transitions from length-goal trigger to portal-entry trigger.
- `scenes`: GameScene progression timing and floor handoff behavior are extended with timed portal states.
- `gameplay`: Non-boss progression objective can switch between portal/score/kills on a per-floor rotation.

## Impact

- Affected code:
  - `src/game/core/balance.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/systems/i18n.ts`
- Potentially affected:
  - `src/game/state/*` objective helpers (if present)
- No new dependencies.
- Boss floor flow remains kill-boss to advance.
