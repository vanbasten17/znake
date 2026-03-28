## ADDED Requirements

### Requirement: Localized challenge-share prompt labels

The system SHALL provide localized menu prompt labels for challenge-share copy and import interactions with deterministic fallback labels.

#### Scenario: Copy prompt label uses localized key

- **WHEN** menu flow requests challenge-share copy prompt text
- **THEN** prompt title resolves from localization resources for the active language
- **AND** fallback label is provided when localization lookup is missing

#### Scenario: Paste prompt label uses localized key

- **WHEN** menu flow requests challenge-share import prompt text
- **THEN** prompt title resolves from localization resources for the active language
- **AND** fallback label is provided when localization lookup is missing
