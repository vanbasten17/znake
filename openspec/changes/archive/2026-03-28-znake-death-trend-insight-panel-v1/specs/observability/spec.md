## ADDED Requirements

### Requirement: Recap trend reason taxonomy compatibility

The system SHALL keep death-reason trend computation compatible with existing bounded death reason taxonomy values.

#### Scenario: Trend aggregator consumes existing reason values
- **WHEN** trend insight computes counts from recent run summaries
- **THEN** reason categories map directly to existing death reason taxonomy values
- **AND** unknown values degrade safely to fallback copy without failing recap render
