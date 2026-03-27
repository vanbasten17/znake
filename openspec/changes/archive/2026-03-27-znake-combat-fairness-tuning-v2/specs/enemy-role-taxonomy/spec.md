## MODIFIED Requirements

### Requirement: Role telegraph and counterplay readability

Each role contract SHALL define a readable telegraph and at least one practical counterplay window that can be surfaced by presentation without scene-owned rules, and tuned telegraph minima SHALL preserve reaction opportunities under typical room pressure.

#### Scenario: Role exposes readable pre-impact signal

- **WHEN** an enemy role enters a high-risk action phase
- **THEN** role state exposes a deterministic telegraph payload before impact resolution
- **AND** telegraph data is available to scene presentation for readable warning cues

#### Scenario: Role exposes counterplay window

- **WHEN** an enemy role commits to its primary pressure action
- **THEN** contract metadata includes a deterministic counterplay window or recovery state
- **AND** the counterplay window is long enough to preserve player agency under fairness thresholds

#### Scenario: Tuned role telegraph minima remain challenge-preserving

- **WHEN** role telegraph minima are increased for fairness
- **THEN** role actions remain threatening and cadence-relevant
- **AND** tuning does not collapse role identity into passive behavior

### Requirement: Role-level fairness guardrails

The system SHALL enforce role-level fairness guardrails so role pressure remains dangerous but not unavoidable.

#### Scenario: Role pressure avoids unavoidable burst stacking

- **WHEN** role composition and cadence are evaluated for active room pressure
- **THEN** configured anti-stack guardrails prevent unfair overlap of high-burst role actions when valid alternatives exist
- **AND** fallback behavior remains deterministic if constraints cannot be fully satisfied

#### Scenario: Role contracts preserve reaction windows

- **WHEN** role telegraph and action timings are resolved
- **THEN** configured minimum reaction windows are respected for first-pass roles
- **AND** no role bypasses fairness timing contracts through scene-only overrides
