# release-marketing-surface Specification

## Purpose
TBD - created by archiving change znake-storefront-web-launch-kit-v1. Update Purpose after archive.
## Requirements
### Requirement: Store-ready visual asset contract
The system SHALL define a release-ready store media contract aligned with in-game visual identity for iconography, screenshots, feature graphics, and short video promo assets.

#### Scenario: Store icon contract is defined
- **WHEN** release assets are prepared for store submission
- **THEN** icon requirements include canonical source dimensions, safe-zone guidance, and exported variants
- **AND** icon styling aligns with Znake gameplay visual language and readability goals

#### Scenario: Screenshot contract communicates core loop
- **WHEN** screenshot sets are prepared
- **THEN** contract requires a minimum ordered set that demonstrates core gameplay loop, upgrades/rewards, and failure/retry context
- **AND** each screenshot defines expected HUD readability and copy-overlay constraints for portrait and desktop/web contexts

#### Scenario: Feature graphic and short video contract are bounded
- **WHEN** feature graphic and short promo video assets are produced
- **THEN** contract defines required aspect-ratio families, duration bounds, and mandatory capture content themes
- **AND** assets avoid misleading edits that diverge from actual in-game presentation

### Requirement: Web launch page contract
The system SHALL define a launch-page content contract for positioning, controls explanation, legal/support links, and platform distribution links.

#### Scenario: Launch page presents clear positioning and controls
- **WHEN** a user opens the public launch page
- **THEN** the page shows a concise game hook/value proposition and clear controls explanation for keyboard and touch paths
- **AND** content remains readable across supported mobile and desktop layouts

#### Scenario: Launch page exposes legal and platform links
- **WHEN** launch page footer or support section is rendered
- **THEN** privacy and support links are always visible without hidden navigation states
- **AND** platform links are provided for web play and any active app-store channels

### Requirement: Minimal support surface contract
The system SHALL define a minimal player support surface including FAQ, feedback path, and contact path across launch-facing surfaces.

#### Scenario: Launch surfaces include support paths
- **WHEN** users seek help from launch page or in-app launch-adjacent menu surfaces
- **THEN** FAQ entry, feedback submission path, and direct contact path are available
- **AND** support surface copy uses consistent terminology with in-app UI labels

### Requirement: Launch-copy localization scope
The system SHALL define the localization boundary and fallback behavior for store-facing and web launch-page copy.

#### Scenario: Required launch-copy domains are localized
- **WHEN** supported locales are prepared for launch
- **THEN** store metadata copy, launch-page hero/support copy, and legal/support labels are included in the localization contract
- **AND** unsupported locales fall back to default locale without broken placeholders

#### Scenario: Localization scope excludes non-launch gameplay copy expansion
- **WHEN** this release-marketing contract is implemented
- **THEN** localization obligations remain limited to store-facing and launch-page domains
- **AND** core gameplay copy expansion is tracked independently of this capability

