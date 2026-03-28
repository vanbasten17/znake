## Why

Resume flow currently restores gameplay but gives little immediate context about current run state. Adding concise continuity cues after auto-resume improves clarity and reduces reorientation cost, especially on mobile app switching.

## Key Points (Codex-style)

- What is changing
  - Add an auto-resume hint that includes floor, objective preview, and pending context cues.
  - Include pending route intent and delayed event-consequence count in resume context text.
- Why we are doing it
  - Reduce confusion and improve continuity when returning from background/blur pauses.
- Impacted areas
  - Lifecycle resume hook, i18n hint strings, gameplay continuity messaging.
- Risks / unknowns
  - Hint density could become noisy if too many context bits are shown.

## What Changes

- Extend lifecycle resume path to set continuity hint after auto-resume.
- Resolve objective preview from deterministic floor objective state.
- Add bounded context summary for pending route and delayed consequence memory.

## Capabilities

### Modified Capabilities

- `gameplay`: Resume continuity exposes concise objective/context cues after lifecycle-driven pause.
- `scenes`: Run HUD hint text includes deterministic resume context signal.

## Impact

- Affected code:
  - `src/game/systems/lifecycle.ts`
  - `src/game/systems/i18n.ts`
- No dependency changes.
