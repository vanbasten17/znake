## ADDED Requirements

### Requirement: Reward reroll costs follow deterministic guardrails

The system SHALL apply deterministic reroll economy guardrails across a run.

#### Scenario: Consecutive rerolls avoid degenerate economy collapse
- WHEN the player performs consecutive rerolls
- THEN reroll cost follows configured scaling with guardrail boundaries
- AND identical run state yields identical reroll-cost outcomes
