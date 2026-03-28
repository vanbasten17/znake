## ADDED Requirements

### Requirement: Menu release transparency and support links
The system SHALL surface release metadata and launch-support links in menu-adjacent scene composition without changing existing scene flow behavior.

#### Scenario: Menu displays version and release channel
- **WHEN** menu scene is active
- **THEN** menu overlay includes concise app version and release channel text sourced from release metadata
- **AND** start, progression, and navigation behavior remain equivalent

#### Scenario: Menu exposes launch support entry points
- **WHEN** menu scene is active and launch support links are configured
- **THEN** menu overlay presents privacy/support entry points suitable for support and compliance workflows
- **AND** link rendering does not interfere with core interaction targets
