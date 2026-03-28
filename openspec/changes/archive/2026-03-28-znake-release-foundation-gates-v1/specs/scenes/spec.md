## ADDED Requirements

### Requirement: Release diagnostics visibility in scene-adjacent surfaces
The system SHALL make release diagnostics metadata visible in non-gameplay-impacting scene-adjacent surfaces for support and QA workflows.

#### Scenario: Build/channel metadata is visible from menu-adjacent UI
- **WHEN** a release candidate build is started
- **THEN** a non-intrusive diagnostics surface exposes `release_version`, `release_channel`, and `build_id`
- **AND** visibility does not alter scene order, transition behavior, or gameplay rule ownership

#### Scenario: Diagnostics surfaces remain orchestrator-safe
- **WHEN** scene-adjacent release diagnostics are shown or refreshed
- **THEN** `GameScene` remains an orchestrator and does not take ownership of release logic or simulation rules
- **AND** diagnostics rendering does not introduce deterministic state divergence

