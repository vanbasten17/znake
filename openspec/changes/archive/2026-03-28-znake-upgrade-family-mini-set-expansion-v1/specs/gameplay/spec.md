## ADDED Requirements

### Requirement: Expanded upgrade pool preserves deterministic draft behavior

The system SHALL keep upgrade draft determinism and duplicate-avoidance when family mini-set entries are expanded.

#### Scenario: Expanded catalog yields deterministic drafts
- **WHEN** identical run seed, floor, and owned upgrade context request a draft from the expanded pool
- **THEN** the selected upgrade ids remain deterministic
- **AND** no duplicate upgrade id appears within the same draft
