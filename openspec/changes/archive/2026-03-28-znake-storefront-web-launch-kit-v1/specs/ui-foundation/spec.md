## ADDED Requirements

### Requirement: Launch transparency footer token slot
The system SHALL provide a stable UI slot and tokenized text hierarchy for release transparency metadata in menu-facing shell surfaces.

#### Scenario: Version and channel metadata remain readable
- **WHEN** menu shell renders launch-adjacent metadata
- **THEN** version identifier and release channel are displayed using tertiary hierarchy tokens with readable contrast
- **AND** metadata placement does not overlap primary action controls on supported mobile and desktop layouts

#### Scenario: Metadata slot remains layout-safe under localization
- **WHEN** localized channel labels increase text length
- **THEN** metadata wraps or truncates according to shared shell rules without clipping interactive controls
- **AND** shell vertical continuity remains preserved during menu transitions
