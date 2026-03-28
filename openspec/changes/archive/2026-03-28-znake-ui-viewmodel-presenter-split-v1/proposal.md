## Why

Supports SRP and cleaner testable menu/HUD logic.

## Key Points (Codex-style)

- What is changing
  - Separate UI view-model assembly from DOM render functions.
- Why we are doing it
  - Supports SRP and cleaner testable menu/HUD logic.
- Impacted areas
  - Menu/HUD composition, localization mapping, style contracts.
- Risks / unknowns
  - Temporary duplication while migrating old render helpers.

## What Changes

- Separate UI view-model assembly from DOM render functions.
- Define OpenSpec requirements and implementation tasks for UI ViewModel Presenter Split.
- Keep simulation deterministic and preserve separation between simulation and rendering.

## Capabilities

### Modified Capabilities

- 
affected spec: `ui-foundation`

## Impact

- Affected code (expected):
  - 
  - 
  - 
- No dependency changes required for proposal stage.
