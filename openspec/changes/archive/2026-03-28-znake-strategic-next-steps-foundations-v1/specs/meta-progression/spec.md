## ADDED Requirements

### Requirement: Branching meta-board status surface is derived from progression state

The system SHALL expose branching meta-board status derived from deterministic progression profile data.

#### Scenario: Menu reads branch status without new simulation ownership
- **WHEN** menu progression surfaces are refreshed
- **THEN** branch status is derived from existing unlocked progression elements
- **AND** scene code remains presentation/orchestration only
