## 1. OpenSpec definition

- [x] 1.1 Create proposal/design/tasks + input-hud/gameplay spec deltas.

## 2. Implementation

- [x] 2.1 Extend virtual input payload with relative turn command.
- [x] 2.2 Update touch input capture to publish horizontal turn intents and vertical absolute intents.
- [x] 2.3 Resolve relative turn to direction in GameScene using current heading.
- [x] 2.4 Preserve existing keyboard + anti-reverse behavior.

## 3. Validation

- [x] 3.1 Run `openspec validate znake-tap-to-direction-v1`.
- [x] 3.2 Run `pnpm check`.
- [x] 3.3 Run `pnpm build`.
