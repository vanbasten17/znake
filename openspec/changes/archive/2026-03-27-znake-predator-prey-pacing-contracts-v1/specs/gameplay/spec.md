## ADDED Requirements

### Requirement: Predator-prey encounter pacing contracts

The system SHALL apply deterministic predator-prey pacing phases so encounters alternate intentional hunt pressure and escape windows.

#### Scenario: Encounter starts with bounded opening phase

- **WHEN** a combat or elite encounter starts
- **THEN** pacing initializes from centralized opening-phase policy
- **AND** initial pressure setup preserves a readable reaction window

#### Scenario: Hunt and escape windows alternate through deterministic transitions

- **WHEN** encounter pressure and state inputs satisfy configured transition thresholds
- **THEN** pacing transitions deterministically between `hunt`, `escape`, and `reset`
- **AND** transitions preserve readable tension rhythm instead of continuous undifferentiated pressure

### Requirement: Multi-source pressure overlap fairness

The system SHALL enforce anti-overlap pressure sequencing guardrails across role and elite/miniboss pressure sources.

#### Scenario: Combined pressure keeps at least one actionable option

- **WHEN** multiple pressure sources attempt to overlap in a short window
- **THEN** overlap validation enforces configured budget and cadence gap thresholds
- **AND** the player retains at least one actionable evade or disengage option when alternatives exist

#### Scenario: Guardrail intervention preserves deterministic flow

- **WHEN** an action is deferred or downgraded by overlap guardrails
- **THEN** encounter progression remains deterministic and seed-stable
- **AND** intervention reason is available to observability hooks
