## MODIFIED Requirements

### Requirement: Upgrade definitions
The system SHALL define an upgrade pool with id, family, name, desc, icon, color, gameplay-purpose metadata, and apply function for each upgrade.

#### Scenario: Family-based upgrade catalog is available

- **WHEN** upgrade pool is loaded
- **THEN** it contains an initial family-based pool for Aggro, Control, and Survival
- **AND** each family has 2 to 4 upgrades with distinct behavioral purpose

#### Scenario: Upgrade apply mutates run config

- **WHEN** upgrade.apply(config) is called
- **THEN** the config is mutated through centralized run-config fields
- **AND** family-specific effects remain independent from rendering code
