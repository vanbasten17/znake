# route-identity-packages Specification

## Purpose
TBD - created by archiving change znake-route-identity-packages-v1. Update Purpose after archive.
## Requirements
### Requirement: Route identity packages contract

The system SHALL expose stable safer/riskier route identity package definitions for gameplay and telemetry consumers.

#### Scenario: Consumers resolve package identity without scene-local constants
- **WHEN** gameplay/telemetry needs route package identity
- **THEN** identity is read from shared balance config contract
- **AND** scene code does not hardcode package naming semantics

