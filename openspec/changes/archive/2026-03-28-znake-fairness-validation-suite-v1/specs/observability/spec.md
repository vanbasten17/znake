## ADDED Requirements

### Requirement: Fairness validation evidence schema
The system SHALL emit a bounded evidence schema for fairness validation outcomes suitable for tuning diagnostics.

#### Scenario: Evidence includes depth-band metric summaries
- **WHEN** fairness validation report is generated
- **THEN** report includes generated timestamp, seed input summary, per-band metric aggregates, and pass/fail status
- **AND** field names remain stable for downstream automation consumption
