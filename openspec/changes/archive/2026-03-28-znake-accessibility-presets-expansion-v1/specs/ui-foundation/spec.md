## ADDED Requirements

### Requirement: Accessibility preset mapping remains deterministic

The system SHALL resolve accessibility preset identity deterministically from visual settings state.

#### Scenario: Mixed manual toggles report custom preset
- **WHEN** visual accessibility toggles do not match predefined preset tuples
- **THEN** preset status resolves to `custom`
- **AND** body class application remains consistent with active toggle values
