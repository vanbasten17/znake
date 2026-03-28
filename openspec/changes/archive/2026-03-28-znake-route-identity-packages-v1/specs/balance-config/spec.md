## ADDED Requirements

### Requirement: Route identity package metadata contract

The system SHALL define explicit identity metadata for safer/riskier route packages.

#### Scenario: Route package config includes identity fields
- **WHEN** safer/riskier route config is read
- **THEN** each package includes stable id, label, and tactical tag fields
- **AND** package fields remain deterministic and data-driven
