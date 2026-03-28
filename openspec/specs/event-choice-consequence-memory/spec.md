# event-choice-consequence-memory Specification

## Purpose
TBD - created by archiving change znake-event-choice-consequence-memory-v1. Update Purpose after archive.
## Requirements
### Requirement: Delayed consequence-memory contract

The system SHALL expose a deterministic delayed consequence-memory contract for event-choice outcomes.

#### Scenario: Equivalent runs produce equivalent consequence trigger floors
- **WHEN** equivalent runs with same seed choose the same qualifying event options
- **THEN** delayed consequence ids and trigger floors match exactly
- **AND** no scene-local randomness changes consequence scheduling

