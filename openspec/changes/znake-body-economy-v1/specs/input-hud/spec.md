## ADDED Requirements

### Requirement: Body spend affordance readability
The system SHALL communicate body spend availability and blocked reasons for in-run sinks without moving gameplay rules into HUD code.

#### Scenario: HUD shows body pulse availability state
- **WHEN** gameplay runtime provides body pulse spend eligibility and cooldown state
- **THEN** HUD presents an availability indicator for body pulse
- **AND** indicator updates as eligibility changes

#### Scenario: HUD shows deterministic blocked reasons
- **WHEN** a body spend request is rejected due to spend floor, cooldown, or usage limit
- **THEN** HUD presents short blocked-reason feedback mapped from runtime outcome
- **AND** blocked messaging does not compute gameplay rules locally

### Requirement: Reward overclock interaction in reward prompt
The system SHALL provide reward-overclock interaction cues inside reward selection flow.

#### Scenario: Reward prompt exposes overclock affordance
- **WHEN** reward selection is active and reward overclock is still available for the window
- **THEN** reward prompt shows overclock affordance and segment cost
- **AND** interaction uses existing keyboard/touch patterns

#### Scenario: Reward prompt reflects spent overclock state
- **WHEN** reward overclock has been used for the active reward window
- **THEN** reward prompt clearly indicates overclock is no longer available
- **AND** player can continue normal reward selection without ambiguity

