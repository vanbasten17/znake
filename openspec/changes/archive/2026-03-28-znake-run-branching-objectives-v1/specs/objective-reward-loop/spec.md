## ADDED Requirements

### Requirement: Players choose between objective branches with clear rewards

The system SHALL provide branch previews that include objective and reward context so route decisions stay readable.

#### Scenario: Route preview surfaces objective and reward tags
- **WHEN** route choices are shown for the next room decision
- **THEN** each branch preview includes objective context and reward profile tags
- **AND** previews remain compact enough for HUD readability.

#### Scenario: Branch preview formatting remains deterministic
- **WHEN** the same floor, branch choice, and run objective offset are evaluated
- **THEN** the route preview text is generated deterministically
- **AND** no random presentation variance changes the branch copy.
