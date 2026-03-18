## Why

We already capture some retention events, but the current telemetry set is incomplete for gameplay diagnosis and monetization decisions. We need consistent instrumentation for key gameplay milestones and failure signals.

## What Changes

- Add missing core gameplay events:
  - `death_reason`
  - `floor_reached`
  - `upgrade_picked`
  - `time_alive`
  - `input_mode`
- Enrich run-end context with death reason, time alive, and input mode.
- Keep event emission lightweight and local to scene transitions.

## Capabilities

### New Capabilities

- `observability`: standardized runtime event coverage for run lifecycle and progression checkpoints.

### Modified Capabilities

- `gameplay`: death emits reason and survival duration.
- `meta-progression`: floor/upgrade decisions and run restarts emit telemetry context.

## Impact

- Affected files:
  - `src/game/scenes/GameScene.ts`
  - `src/game/scenes/UpgradeScene.ts`
  - `src/game/scenes/MenuScene.ts`
  - `src/game/scenes/DeathScene.ts`
  - `src/game/systems/controlScheme.ts`
