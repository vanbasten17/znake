## ADDED Requirements

### Requirement: Companion drone actions are cooldown bounded and deterministic

The system SHALL resolve companion-drone support triggers through deterministic cooldown-gated logic.

#### Scenario: Companion drone trigger only fires when cooldown is ready
- **WHEN** enemy defeat resolves while drone cooldown is ready
- **THEN** support trigger fires once and cooldown is reset to configured duration
- **AND** immediate follow-up defeats during cooldown do not retrigger support.

#### Scenario: Companion drone cooldown tick is deterministic
- **WHEN** cooldown update receives identical cooldown and delta inputs
- **THEN** resulting cooldown output is identical and clamped to zero
- **AND** no randomness affects trigger cadence.
