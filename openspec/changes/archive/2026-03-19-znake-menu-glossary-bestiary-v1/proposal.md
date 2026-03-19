## Why

As content grows (items, powerups, hazards, enemy variants), players need a quick in-game reference without leaving the app or guessing icon meaning.

## What Changes

- Add a polished menu-accessible glossary/bestiary overlay with categories:
  - Items
  - Powerups
  - Hazards
  - Enemies
  - Talents
- Add visual sprite-like markers per entry to improve recognition.
- Localize glossary labels and descriptions in English and Catalan.
- Keep gameplay flow unchanged: start run, talents, goals, language switch all remain behaviorally equivalent.

## Impact

- Affected specs:
  - `scenes` (Menu scene)
- Affected runtime:
  - Menu DOM overlay and menu CSS module
  - i18n resources for new glossary copy
