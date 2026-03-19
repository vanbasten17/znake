## Context

The menu currently uses a functional visual style. The new reference image defines a stronger identity that is more market-ready for monetizable product positioning.

## Visual Decisions

- Typography:
  - Pixel-style feel for hero and section headers.
  - Monospace readability for rows and goal text.
- Color system:
  - Background: deep navy with grid overlay.
  - Primary accent: neon green for title, unlocked state, CTA.
  - Secondary neutral: off-white for labels and non-highlight text.
- Components:
  - Talent rows use a dual border (outer bright + inner soft glow).
  - CTA uses thicker border/glow than talent rows.
  - Goal lines remain compact and centered to preserve vertical rhythm.

## Technical Decisions

- Implement style tokens local to `MenuScene` to avoid scattered literals.
- Keep interaction handlers intact; only rendering/style layers are touched.
- Maintain current i18n keys and dynamic values.

## Risks / Mitigations

- Risk: perfect pixel-match may vary by font availability.
  - Mitigation: prefer closest available font stack and tune spacing/weights in-scene.
