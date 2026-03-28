## ADDED Requirements

### Requirement: Menu run-history timeline readability

The system SHALL surface a compact run-history timeline in menu without changing scene flow behavior.

#### Scenario: Menu shows recent run summary rows
- **WHEN** menu overlay is rendered and history entries exist
- **THEN** menu presents bounded recent rows with seed, floor, death reason, and build context
- **AND** row ordering is newest-first

#### Scenario: Menu shows empty-state fallback
- **WHEN** no run-history entries are available
- **THEN** menu presents a concise empty-state message
- **AND** existing start/progression controls remain unaffected
