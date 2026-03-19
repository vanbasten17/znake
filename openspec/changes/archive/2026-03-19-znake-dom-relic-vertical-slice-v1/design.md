## Design Summary

Implement a scene-scoped DOM overlay mounted inside `#game-area` during `RelicDraft`.

The overlay is removed on scene shutdown, preventing leakage into gameplay scenes.

## UI Approach

- Use CSS Module (`relicDraftOverlay.module.css`) for local styles.
- Consume global design tokens (`tokens.css`) for color/spacing/type consistency.
- Keep controls/hints outside this overlay unchanged.

## Interaction Model

- Pointer: each card is a button selecting the relic.
- Keyboard: `1/2/3` and numpad equivalents.
- On selection: same telemetry event and `scene.start('Game')`.

## Constraints

- No gameplay system changes.
- No regression in control flow or hint behavior.
