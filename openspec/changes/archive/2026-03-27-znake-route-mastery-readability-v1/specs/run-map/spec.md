## ADDED Requirements

### Requirement: Route-decision mastery capture points

The system SHALL capture deterministic route-mastery metrics when route decisions are committed.

#### Scenario: Route commit updates mastery summary

- **WHEN** player commits a route choice from available branch options
- **THEN** route-mastery summary updates deterministic counters from chosen option and local preview context
- **AND** capture logic does not modify run-map generation outcomes
