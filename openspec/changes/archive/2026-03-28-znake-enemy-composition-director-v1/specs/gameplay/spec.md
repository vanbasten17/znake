## ADDED Requirements

### Requirement: Deterministic enemy composition director resolution

The system SHALL resolve active enemy composition windows deterministically from depth band and spawn cadence context.

#### Scenario: Equivalent spawn cadence yields equivalent role window
- **WHEN** two runs share equivalent seed, floor band, and role spawn cadence state
- **THEN** active composition window identifier is identical
- **AND** resulting role policy overlay is identical

#### Scenario: Window-aware role drafting preserves guardrails
- **WHEN** normal enemy roles are drafted through active composition window policy
- **THEN** existing active-cap and spawn-gap guardrails remain enforced
- **AND** non-normal forced spawns are not rewritten by window policy
