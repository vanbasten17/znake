## ADDED Requirements

### Requirement: Route package resolution applies bounded identity effects

The system SHALL apply bounded package-specific effects when pending route choice resolves.

#### Scenario: Route package apply includes deterministic score bonus
- **WHEN** safer or riskier route is applied at room transition
- **THEN** package score bonus is applied deterministically with existing score multiplier context
- **AND** existing route pressure deltas remain active
