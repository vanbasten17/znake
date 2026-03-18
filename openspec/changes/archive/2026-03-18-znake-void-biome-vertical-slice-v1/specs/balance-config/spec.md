## MODIFIED Requirements

### Requirement: Central balance source

The system SHALL include biome-specific tuning values in the centralized balance module.

#### Scenario: Biome knobs are centralized

- **WHEN** gameplay evaluates vertical-slice systems (rift cadence, stalker chance, core bonuses, boss stats)
- **THEN** all values are read from the balance config module rather than scene literals
