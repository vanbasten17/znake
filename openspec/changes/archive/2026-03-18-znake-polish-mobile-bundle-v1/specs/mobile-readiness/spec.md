## MODIFIED Requirements

### Requirement: Lifecycle-safe gameplay pause

The system SHALL preserve mobile UX quality with safe-area-aware UI placement and lightweight startup behavior.

#### Scenario: Safe-area spacing is respected

- **WHEN** app runs on devices with notches or home indicators
- **THEN** HUD, controls, and hint sections include safe-area inset padding

#### Scenario: Engine boot is deferred

- **WHEN** app entry script executes
- **THEN** Phaser bootstrap loads through dynamic import and handles load failure gracefully
