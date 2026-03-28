# enemy-composition-director Specification

## Purpose
TBD - created by archiving change znake-enemy-composition-director-v1. Update Purpose after archive.
## Requirements
### Requirement: Enemy composition director contract

The system SHALL expose a deterministic enemy composition director contract that overlays depth-band base role policies.

#### Scenario: Director resolves policy overlay and window id together
- **WHEN** role policy is requested for a floor and spawn index
- **THEN** resolver returns active window id and effective role policy
- **AND** effective policy is derived solely from base policy plus configured window overlay

### Requirement: Enemy composition contract aligns with unified progression director
The system SHALL provide active role window id and effective role policy caps through the unified progression-director payload for the same floor/spawn context.

#### Scenario: Unified payload carries composition window and role caps
- **WHEN** progression payload is resolved for enemy composition
- **THEN** payload includes the active role composition window id and effective per-role caps
- **AND** values match deterministic overlay results from enemy composition resolver

