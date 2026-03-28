## ADDED Requirements

### Requirement: Deterministic fairness validation suite
The system SHALL provide a deterministic, seed-based fairness validation suite that evaluates reaction-window, recoverability, and cheap-hit risk metrics across depth bands.

#### Scenario: Suite runs deterministically from centralized inputs
- **WHEN** developer runs fairness validation tooling with default suite inputs
- **THEN** evaluation uses centralized seed and threshold tables
- **AND** equivalent code/config state yields equivalent results

#### Scenario: Suite emits concise evidence artifact
- **WHEN** fairness validation completes
- **THEN** output includes per-depth-band pass/fail summaries and bounded metric values
- **AND** artifact is concise and machine-readable for tuning loops
