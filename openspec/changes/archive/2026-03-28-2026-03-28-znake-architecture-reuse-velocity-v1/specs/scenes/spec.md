## MODIFIED Requirements

### Requirement: Game scene

The system SHALL render gameplay UI text in the active locale and orchestrate local run-map route presentation without taking ownership of progression rules.

#### Scenario: Game scene delegates non-simulation orchestration through shared helpers

- **WHEN** gameplay flow, overlays, and telemetry orchestration logic are updated
- **THEN** `GameScene` delegates reusable orchestration concerns to shared helper modules
- **AND** gameplay-rule ownership remains in deterministic simulation/core helpers

#### Scenario: Scene-local duplication is reduced for shared overlay and copy flows

- **WHEN** reward, route, event-choice, or related copy-heavy overlays are maintained
- **THEN** scene code uses shared overlay/copy presenter helpers instead of repeating near-identical builders
- **AND** UX behavior remains equivalent unless explicitly changed by a separate gameplay/UI proposal
