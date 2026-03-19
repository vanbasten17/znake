## Overview

Implement glossary as a menu-level DOM modal so it inherits the polished CSS stack and avoids Phaser scene complexity for static reference content.

## UX

- New `Guide` button in Menu top area.
- Opens full-overlay panel above menu content.
- Category tabs switch content without leaving scene.
- Each row renders:
  - visual sprite-like token (shape/color aligned with gameplay symbols)
  - localized name
  - localized short description
- Close via:
  - top-right close button
  - `Esc`
  - `G`/`B` keyboard toggle

## Data Model

- Introduce a small static glossary catalog in core:
  - category key
  - item key
  - visual token metadata (variant, glyph, color class)
- Text values live in i18n resources to keep EN/CA parity.

## Non-Goals

- No gameplay/balance changes.
- No scene flow changes.
- No dependency on external assets (sprites can be upgraded later).

## Validation

- `openspec validate znake-menu-glossary-bestiary-v1`
- `pnpm check`
- `pnpm build`
