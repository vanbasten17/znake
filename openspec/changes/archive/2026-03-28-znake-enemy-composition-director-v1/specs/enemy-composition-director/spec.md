## ADDED Requirements

### Requirement: Enemy composition director contract

The system SHALL expose a deterministic enemy composition director contract that overlays depth-band base role policies.

#### Scenario: Director resolves policy overlay and window id together
- **WHEN** role policy is requested for a floor and spawn index
- **THEN** resolver returns active window id and effective role policy
- **AND** effective policy is derived solely from base policy plus configured window overlay
