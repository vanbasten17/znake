## ADDED Requirements

### Requirement: Body pulse gameplay sink
The system SHALL support a player-triggered `body_pulse` sink that spends body segments for short-range space relief under deterministic gating.

#### Scenario: Valid pulse spend applies cost and effect
- **WHEN** body pulse input is triggered, cooldown is ready, and spend floor rules pass
- **THEN** the configured segment spend is applied
- **AND** pulse effect gameplay state is activated for configured duration

#### Scenario: Pulse spend is blocked at low length
- **WHEN** body pulse input is triggered but spend would cross minimum spendable length
- **THEN** no segment spend occurs
- **AND** gameplay returns a deterministic blocked outcome

### Requirement: Reward overclock gameplay sink
The system SHALL support a `reward_overclock` sink during reward selection that trades body segments for one deterministic reward reroll per completed objective.

#### Scenario: Overclock rerolls reward options once
- **WHEN** reward selection is active and reward overclock is triggered with valid spend state
- **THEN** the configured segment spend is applied
- **AND** reward draft options are rerolled once for that objective completion

#### Scenario: Overclock cannot be repeated in same reward window
- **WHEN** reward overclock has already been consumed for the active reward window
- **THEN** additional overclock requests in that window are rejected
- **AND** existing drafted options remain unchanged

### Requirement: Tail-health coexistence with body spending
The system SHALL preserve tail-as-health semantics while allowing voluntary spend, using explicit deterministic attribution for segment-loss sources.

#### Scenario: Segment loss attribution remains readable
- **WHEN** segments are removed by combat damage or by voluntary spending
- **THEN** gameplay emits source-attributed outcomes for each loss event
- **AND** scene feedback can distinguish damage loss from spend loss without changing simulation rules

