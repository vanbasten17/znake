## ADDED Requirements

### Requirement: Upgrade draft synergy/conflict hint chips

The system SHALL render explicit synergy/conflict hint chips on upgrade draft cards to improve comparison readability.

#### Scenario: Upgrade cards include positive and caution hint chips
- **WHEN** upgrade draft cards are rendered
- **THEN** each card includes a positive synergy hint chip and a caution conflict hint chip
- **AND** hint text derives from existing upgrade metadata fields

#### Scenario: Hint chips do not alter pick behavior
- **WHEN** hint chips are shown
- **THEN** card pick interactions and transition flow remain unchanged
- **AND** simulation-owned upgrade effects remain unchanged
