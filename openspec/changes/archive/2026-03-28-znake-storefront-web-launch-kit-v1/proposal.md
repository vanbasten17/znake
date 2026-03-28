## Why

Znake is approaching release readiness, but launch-facing surfaces are not yet specified as a coherent product contract. We need a professional, consistent package for app stores and global web launch so players, reviewers, and support can trust what they see and what build they are on.

## Key Points (Codex-style)

- **What is changing**
  - Define a launch-facing contract for store assets, web launch page content, in-app version/channel transparency, support/contact surfaces, and localization scope.
- **Why we are doing it**
  - To reduce launch risk, improve first impression quality, and make support/debug workflows reliable across store and web distribution.
- **Impacted areas**
  - OpenSpec capability set across `ui-foundation`, `scenes`, `mobile-readiness`, `tooling`, and a new `release-marketing-surface` capability.
- **Risks / unknowns**
  - Asset quality can drift without explicit acceptance criteria; legal/privacy wording may evolve by region; store-specific media limits can change over time.

## What Changes

- Add a new release-marketing capability defining:
  - Store visual asset contract (icon, screenshots, feature graphic, short video requirements).
  - Web launch page contract (positioning, controls explanation, privacy/support links, platform links).
  - Minimal support surface contract (FAQ, feedback, contact).
  - Localization scope for store-facing and launch-page copy.
- Extend scene/UI requirements to expose app version and release channel in stable, readable menu surfaces for support/debug.
- Extend mobile-readiness to include launch-surface readiness constraints for store/web discoverability and support links.
- Extend tooling requirements with deterministic release metadata generation/checks used by launch-facing UI and pages.

## Capabilities

### New Capabilities
- `release-marketing-surface`: Launch-facing contract for app store listing media/copy, web launch page content, support/contact entry points, and localization boundaries.

### Modified Capabilities
- `ui-foundation`: Add UI readability/placement requirement for version + release-channel transparency in menu shell.
- `scenes`: Add menu-surface requirement to present version/channel info and launch-support links without changing scene flow behavior.
- `mobile-readiness`: Add mobile launch-surface constraints for safe, readable support/privacy/platform links.
- `tooling`: Add release metadata generation/validation requirement used by launch-facing surfaces.

## Impact

- Affected systems: menu DOM overlay composition, launch-page content surface, release metadata plumbing, and support link configuration.
- Affected files likely include scene/menu UI composition, shared UI shell helpers, launch page/static content, and lightweight build tooling/config outputs.
- No gameplay rule changes, no deterministic simulation behavior changes, and no core game-loop ownership shifts into scenes.
