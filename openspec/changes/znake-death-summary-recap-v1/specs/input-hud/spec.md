## ADDED Requirements

### Requirement: Run-end recap readability

The system SHALL keep player-facing death recap content readable and concise across supported DOM overlay layouts.

#### Scenario: Portrait layout stacks recap cleanly

- **WHEN** the death recap is shown on a narrow portrait layout
- **THEN** death-cause, build-leaning, and notable-choice content stacks vertically with clear hierarchy
- **AND** text remains readable without overlapping action controls

#### Scenario: Wide layout preserves scan order

- **WHEN** the death recap is shown on a wider desktop layout
- **THEN** the recap preserves a clear scan order from death cause to build identity to notable choices
- **AND** supporting text stays concise enough to avoid pushing primary actions below the first viewport when space allows
