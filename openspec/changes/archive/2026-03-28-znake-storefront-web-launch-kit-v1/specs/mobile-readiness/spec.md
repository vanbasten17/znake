## ADDED Requirements

### Requirement: Mobile launch-surface readability and link safety
The system SHALL keep launch-facing legal/support/platform links readable and interaction-safe on portrait mobile layouts.

#### Scenario: Launch-support links remain tap-safe on mobile
- **WHEN** launch-adjacent menu or launch page links are shown on touch devices
- **THEN** tap targets meet mobile readability and spacing guardrails
- **AND** links avoid overlap with safe-area constrained controls

#### Scenario: Mobile launch copy preserves readability hierarchy
- **WHEN** launch-facing copy is rendered on narrow portrait viewports
- **THEN** positioning hook, controls summary, and support/legal labels preserve clear hierarchy
- **AND** content remains usable without horizontal scrolling
