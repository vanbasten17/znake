## Design Summary

Render death summary via DOM overlay mounted inside `#game-area`.

Overlay is mounted on scene create and removed on scene shutdown/action to prevent leakage.

## UI Structure

- Death title and primary score
- Run summary stats (floor, kills, best, reward, currency)
- Optional new-record badge
- Optional upgrades-earned list
- Action buttons: Next Run and Main Menu

## Interaction

- Pointer/touch: explicit buttons for both actions.
- Keyboard parity:
  - `Enter`/`Space`/`N` => next run
  - `M` => main menu
- Virtual start button continues to trigger next run as before.
