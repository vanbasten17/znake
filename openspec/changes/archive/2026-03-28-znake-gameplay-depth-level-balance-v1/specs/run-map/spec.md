## ADDED Requirements

### Requirement: Run-map depth-band balancing context
The system SHALL expose deterministic depth-band balancing context in run-map progression metadata for floors 1-15.

#### Scenario: Node progression resolves stable depth-band context
- **WHEN** a run-map node is generated or selected
- **THEN** node-derived progression context includes a deterministic depth-band label for bounded balancing systems
- **AND** depth-band resolution is reproducible from the same seed/template inputs

#### Scenario: Route preview can expose depth-band decision context
- **WHEN** reachable next nodes are surfaced in route preview
- **THEN** preview data can include bounded depth-band context alongside room and biome metadata
- **AND** context remains consistent with the balancing payload that will apply after selection
