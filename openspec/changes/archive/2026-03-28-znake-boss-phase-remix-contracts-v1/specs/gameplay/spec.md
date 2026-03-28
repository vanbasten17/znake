## ADDED Requirements

### Requirement: Boss phase-remix application remains deterministic

The system SHALL apply boss phase-remix profile effects deterministically by floor progression context.

#### Scenario: Equivalent boss floors resolve equivalent remix behavior
- **WHEN** equivalent runs reach the same boss floor context
- **THEN** gameplay resolves the same boss remix id and applies the same bounded rage/support parameters
- **AND** scene logic does not inject runtime randomness into remix selection
