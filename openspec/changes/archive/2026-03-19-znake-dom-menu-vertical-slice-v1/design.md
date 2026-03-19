## Design Summary

Render Main Menu via DOM overlay mounted inside `#game-area` and scoped with CSS Module.

Overlay lifecycle is tied to `MenuScene` lifecycle to avoid persistence into gameplay scenes.

## UI Structure

- Header line (title + language toggle)
- Stats block (best score + currency)
- Talent shop list (buttons)
- Goals list (claimable rows)
- Start CTA button

## Interaction

- Pointer/touch interactions on talent rows, goal rows, language toggle, start CTA.
- Keyboard support remains:
  - `Enter`/`Space` start run
  - `L` toggle language
  - `1-6` unlock talent by index

## Constraints

- Preserve existing telemetry and profile persistence behavior.
- Preserve current hint/control shell behavior.
