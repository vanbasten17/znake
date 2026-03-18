## Context

Currency and talents exist, but discoverability is low because spending is mostly key-driven. The death loop is fast but rigid: players cannot intentionally divert to menu to spend before the next run.

## Goals / Non-Goals

**Goals:**
- Make talent purchases explicit in Main Menu with clickable UI rows/cards.
- Add clear branching in death flow: immediate next run or return to menu.
- Preserve keyboard-first speed for advanced players.

**Non-Goals:**
- Redesign full menu visual identity.
- Add confirmation modals for each purchase in this iteration.

## Decisions

- Render talent entries as interactive rows in Main Menu with lock/unlock state and cost.
- Maintain number-key unlock shortcuts (`1..6`) as optional shortcut.
- Add two death buttons:
  - Next Run -> increments run and goes to relic draft.
  - Main Menu -> returns to menu for spending.
- Map Start/Enter/Space to Next Run to preserve momentum.
- Map `M` key to Main Menu for keyboard users.

## Risks / Trade-offs

- [Risk] Extra buttons can clutter compact mobile layouts. -> Mitigation: compact row sizing and clear labels.
- [Risk] Players may accidentally buy talents. -> Mitigation: disable interaction for unaffordable or already unlocked nodes.
- [Risk] Route confusion after death. -> Mitigation: explicit labels and hint text.
