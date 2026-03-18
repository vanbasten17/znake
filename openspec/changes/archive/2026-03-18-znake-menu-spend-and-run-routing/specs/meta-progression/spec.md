## MODIFIED Requirements

### Requirement: Talent spending interaction

The system SHALL allow spending persistent currency from Main Menu via pointer/touch interaction, not keyboard only.

#### Scenario: Buy talent from menu row

- **WHEN** player taps/clicks an available talent entry in Main Menu
- **THEN** currency is deducted, talent is unlocked, and menu state refreshes immediately

#### Scenario: Disabled row does not purchase

- **WHEN** player taps/clicks a talent that is unaffordable, locked by prerequisite, or already unlocked
- **THEN** no currency is deducted and unlock state remains unchanged
