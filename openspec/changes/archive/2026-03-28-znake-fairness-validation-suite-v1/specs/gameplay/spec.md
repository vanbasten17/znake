## ADDED Requirements

### Requirement: Fairness validation coverage across depth bands
The system SHALL validate reaction-window, recoverability, and no-cheap-hit fairness thresholds across early, mid, and late depth bands using deterministic probes.

#### Scenario: Depth-band fairness probes validate bounded thresholds
- **WHEN** fairness validation runs for representative floors in each depth band
- **THEN** reaction, recoverability, and cheap-hit metrics are compared against depth-band thresholds
- **AND** failures identify specific metric and depth-band context
