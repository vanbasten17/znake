## ADDED Requirements

### Requirement: Clean-play objective evaluation

The system SHALL evaluate clean-play objective results deterministically from objective-window gameplay events and apply first-pass anti-farming constraints.

#### Scenario: No-hit clean-play result resolves deterministically

- **WHEN** an objective window ends in completion
- **THEN** runtime resolves whether qualifying damage events occurred during that objective window
- **AND** no-hit clean-play status is derived deterministically from the same event attribution on every replay

#### Scenario: Bonus cannot be farmed repeatedly from one completion

- **WHEN** a completed objective has already granted a clean-play payout
- **THEN** repeated completion-side effects or duplicate event processing do not grant additional clean-play payouts
- **AND** progression continues with at most one clean-play payout per completed objective window

#### Scenario: Objective-kind constraints preserve fairness

- **WHEN** clean-play bonus is evaluated for different objective kinds
- **THEN** objective-kind-specific eligibility and payout caps from balance config are enforced
- **AND** the system avoids dominant low-risk farming loops from a single objective archetype
