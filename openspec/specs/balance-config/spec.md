# balance-config Specification

## Purpose
TBD - created by archiving change znake-data-driven-balance-v1. Update Purpose after archive.
## Requirements
### Requirement: Central balance source

The system SHALL define a centralized balance configuration module for gameplay and economy tuning.

#### Scenario: Runtime reads floor and spawn values from balance module

- **WHEN** gameplay scene initializes and runs progression logic
- **THEN** floor scaling and spawn probabilities are read from central balance config, not inline literals

#### Scenario: Runtime reads economy values from balance module

- **WHEN** run reward or talent costs are evaluated
- **THEN** economy coefficients and costs are read from central balance config

