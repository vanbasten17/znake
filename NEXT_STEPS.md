# Znake Next Steps

This document defines the next product steps after the current stabilization and spec-driven delivery cycle.

## 1. Internationalization (i18n) foundation (Start now)

- Adopt `i18next` as the localization engine.
- Add `i18next-browser-languagedetector` for automatic language selection.
- Move all UI text/hints/scene labels to translation keys.
- Start with `en` and `ca` locales, then add `es`.
- Add a simple in-game language selector in the main menu.

Why now:
- UI text is already broad enough that delaying i18n will increase refactor cost.

## 2. Economy and progression tuning pass

- Tune reward pacing (currency gain per run) using telemetry.
- Rebalance talent costs and early unlock cadence.
- Add one or two mid-term goals that increase session-to-session motivation.

## 3. Content depth for retention

- Expand the current vertical slice with one extra elite pattern and one extra item interaction.
- Improve run variety through data-driven spawn/event tables.
- Keep additions scoped to maintain quality over quantity.

## 4. Product UX polish for mobile sessions

- Continue improving touch ergonomics (controls, readability, spacing).
- Refine pause/resume cues and in-run clarity messages.
- Validate haptics/audio behavior on multiple real devices.

## 5. State architecture with XState (Do now, not later)

- Introduce XState for top-level game flow and meta-flow:
  - Boot / Menu / Relic Draft / Run / Upgrade / Death / Next Run / Back to Menu.
- Then progressively migrate nested runtime states:
  - pause/resume, lifecycle pause, boss floor flow, reward routing.
- Keep the migration incremental (one flow at a time) to avoid destabilization.

Why now:
- Current and upcoming complexity (from brainstorming) will benefit immediately from explicit state modeling.
- Implementing XState later will make migration harder and riskier.
