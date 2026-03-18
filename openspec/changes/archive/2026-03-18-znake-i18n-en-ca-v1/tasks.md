## 1. i18n foundation

- [x] 1.1 Add `i18next` + browser language detector dependencies.
- [x] 1.2 Create i18n initialization module with `en` and `ca` resources.
- [x] 1.3 Wire static DOM labels and aria labels to i18n.

## 2. Runtime localization

- [x] 2.1 Localize main startup/lifecycle hints.
- [x] 2.2 Localize scene titles and summary labels (menu, relic, upgrade, death).
- [x] 2.3 Localize HUD hint helper text and floor progress label.
- [x] 2.4 Add manual language switch in main menu (tap/click + keyboard shortcut).
- [x] 2.5 Localize relic card names and descriptions in draft scene.
- [x] 2.6 Localize talent labels in menu rows (including prerequisite label).
- [x] 2.7 Localize biome name in in-game floor progress header.
- [x] 2.8 Localize run-upgrade names/descriptions in Upgrade and Death scenes.
- [x] 2.9 Replace initial HTML copy with language-neutral placeholders before i18n init.

## 3. Validation

- [x] 3.1 Validate OpenSpec change.
- [x] 3.2 Run `biome`, `tsc --noEmit`, and `build`.
