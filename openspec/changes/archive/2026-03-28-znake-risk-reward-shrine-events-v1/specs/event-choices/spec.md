## ADDED Requirements

### Requirement: Shrine choices expose explicit cost and delayed payoff

The system SHALL provide shrine-flavored event options with explicit immediate cost and deterministic delayed payoff.

#### Scenario: Shrine option includes explicit immediate downside
- **WHEN** shrine option payload is authored in event catalog
- **THEN** option exposes immediate downside values (for example score/length sacrifice)
- **AND** option still exposes explicit immediate upside in player-facing tradeoff copy.

#### Scenario: Shrine option schedules deterministic delayed payoff
- **WHEN** shrine option is selected and consequence queue has capacity
- **THEN** delayed consequence is drafted deterministically with bounded trigger floor
- **AND** delayed payoff applies through existing consequence resolution path.
