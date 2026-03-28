# event-choices Specification

## Purpose
TBD - created by archiving change znake-event-choices-v1. Update Purpose after archive.
## Requirements
### Requirement: Event definitions are data-driven and deterministic

The system SHALL define event choices in centralized data with deterministic draft behavior.

#### Scenario: Event catalog is centralized

- **WHEN** runtime loads event-choice content
- **THEN** it reads definitions from centralized configuration
- **AND** scene code does not hardcode option payload values inline

#### Scenario: Drafting is seed-stable

- **WHEN** the same run seed and same progression context request an event draft
- **THEN** the selected event and option set are identical
- **AND** option ordering is deterministic

### Requirement: Event options expose explicit risk and reward

The system SHALL represent each event option with explicit positive and negative outcomes and player-facing summary metadata.

#### Scenario: Option payload includes both sides of tradeoff

- **WHEN** an event option is authored
- **THEN** it includes at least one explicit upside and one explicit downside field
- **AND** hidden penalties are not permitted in the resolved payload

#### Scenario: Option copy mirrors payload

- **WHEN** an event option is presented to the player
- **THEN** visible copy names the primary upside and primary downside
- **AND** copy semantics match the configured payload effects

### Requirement: Eligibility and fairness gates prevent invalid picks

The system SHALL filter event options by deterministic eligibility and fairness checks before presentation.

#### Scenario: Unpayable options are excluded

- **WHEN** an option cost exceeds current run resources or violates hard constraints
- **THEN** that option is excluded from the presented draft
- **AND** fallback options are selected deterministically from remaining eligible entries

#### Scenario: Recoverability guard is enforced

- **WHEN** fairness checks evaluate candidate options
- **THEN** options that would create non-recoverable non-boss states are rejected
- **AND** accepted options maintain minimum recoverability thresholds from balance config

### Requirement: Route-intent event outcomes remain scoped

The system SHALL support safe-vs-dangerous route decisions as bounded progression-intent hooks without rebuilding the run map.

#### Scenario: Route-intent option applies scoped effect

- **WHEN** a `safe_vs_dangerous_route` option is selected
- **THEN** progression stores a bounded route-intent flag for upcoming resolution hooks
- **AND** existing map topology remains unchanged

#### Scenario: Route-intent effect expires deterministically

- **WHEN** configured route-intent duration is exhausted
- **THEN** the temporary route-intent flag is cleared
- **AND** subsequent progression returns to default intent behavior

### Requirement: Event-choice options can schedule delayed consequences

The system SHALL allow configured event-choice options to schedule bounded delayed consequences across subsequent floors.

#### Scenario: Qualifying option schedules deterministic delayed consequence
- **WHEN** a selected event option has consequence-memory mapping
- **THEN** gameplay schedules a deterministic consequence payload with trigger floor
- **AND** scheduling obeys configured queue cap and delay window

