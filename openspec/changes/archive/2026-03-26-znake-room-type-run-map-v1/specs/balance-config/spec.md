## ADDED Requirements

### Requirement: Central run-map tuning tables

The system SHALL keep room-type templates, branch rules, and route-preview tuning in centralized balance configuration.

#### Scenario: Room-type distributions are centrally tuned

- **WHEN** gameplay resolves which room types can appear at a given run depth or branch point
- **THEN** those distributions come from centralized balance data
- **AND** scene code does not hardcode room-type sequencing inline

#### Scenario: Preview horizon and branch cadence are centrally tuned

- **WHEN** gameplay resolves how many future choices to expose or how often branches appear
- **THEN** those values come from centralized balance data
- **AND** route readability can be tuned without editing multiple presentation call sites
