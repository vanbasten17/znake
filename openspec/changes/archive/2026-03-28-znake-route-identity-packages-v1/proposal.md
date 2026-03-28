## Why

Route choices already adjust pressure and map risk, but their identity is implicit. Defining explicit route identity packages (safe economy vs high-risk tempo) improves telegraphing and decision clarity.

## Key Points (Codex-style)

- What is changing
  - Add explicit package identity metadata to safer/riskier route configs.
  - Apply bounded route score bonuses as part of package identity.
  - Emit package id/tag telemetry when route effects are applied.
- Why we are doing it
  - Improve route readability and commitment confidence.
- Impacted areas
  - Portal route config, route application path, HUD modifier text, telemetry.
- Risks / unknowns
  - Added score bonus must remain bounded to avoid route snowball behavior.

## What Changes

- Extend `BALANCE.portal.routeChoice` entries with package id/label/tag metadata.
- Apply package score bonus when pending floor route resolves.
- Add route package telemetry context (`route_package_applied`).
- Show package labels in active route modifier HUD status.

## Capabilities

### New Capabilities

- `route-identity-packages`: Explicit route package identity contract for safer/riskier route choices.

### Modified Capabilities

- `gameplay`: Route application now includes package score bonus and package identity context.
- `balance-config`: Route config includes package metadata fields.
- `observability`: Route package application emits explicit package telemetry context.

## Impact

- Affected code:
  - `src/game/core/balance.ts`
  - `src/game/scenes/GameScene.ts`
- No dependency changes.
