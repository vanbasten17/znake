## ADDED Requirements

### Requirement: Route-preview cards expose deterministic risk forecast

The system SHALL expose a deterministic route risk forecast for each route-choice card using only route-preview metadata already resolved from the run-map state.

#### Scenario: Forecast score resolves from selected room and local preview
- **WHEN** route-choice cards are rendered for a route-decision point
- **THEN** each card resolves a deterministic risk forecast score from selected room-type and bounded preview composition
- **AND** the same seed and route-preview payload produce the same forecast score and level

#### Scenario: Forecast readability remains bounded and non-authoritative
- **WHEN** risk forecast text is displayed
- **THEN** it uses bounded levels (`LOW`, `MEDIUM`, `HIGH`) suitable for quick commit decisions
- **AND** forecast presentation does not alter simulation, route generation, or route outcome contracts
