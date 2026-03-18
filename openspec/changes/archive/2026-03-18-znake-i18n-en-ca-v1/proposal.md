## Why

Znake needs multilingual support to validate product readiness for broader audiences and regional testing. English + Catalan are enough for initial validation before adding more locales.

## What Changes

- Introduce i18n runtime using `i18next` and browser language detection.
- Add initial locales: `en` and `ca`.
- Translate core UI text, hints, and scene-level labels.
- Translate progression labels (talents, relic cards, and biome header text).
- Keep language choice persisted via detector/localStorage.
- Add a manual in-menu language switch (EN/CA) for explicit player control.

## Capabilities

### Modified Capabilities

- `input-hud`: hint and control labels become locale-aware.
- `scenes`: menu/relic/upgrade/death scene text becomes locale-aware.
- `mobile-readiness`: lifecycle and load-status hints become locale-aware.

## Impact

- Affected areas:
  - new i18n system module
  - scene text rendering paths
  - DOM static labels and aria labels
  - startup boot/hint messages
