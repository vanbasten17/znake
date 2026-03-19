## Context

Boss floors should feel readable and deliberate.

Current multi-hit boss logic is correct but lacks explicit collision readability when shields are involved.

## Goals / Non-Goals

**Goals:**

- Make boss-hit outcomes obvious in the exact collision frame.
- Keep deterministic grid behavior.
- Avoid adding new combat systems.

**Non-Goals:**

- Full boss redesign.
- Projectile mechanics.
- Global collision model rewrite.

## Decisions

1. Add a knockback response on player-boss collision.
- Minimal displacement/response tied to current direction context.
- Must never place player in invalid wall cell.

2. Keep boss HP model intact.
- Boss still requires multiple hits as configured.
- Knockback is readability + combat clarity, not damage multiplier.

3. Pair knockback with distinct feedback cue.
- Visual + optional audio cue to differentiate from standard collision.

## Risks / Trade-offs

- [Risk] Knockback may feel punitive if too strong.
  - Mitigation: constrain to 1-cell or equivalent lightweight response.

- [Risk] Could create edge-case collisions near squeeze bounds.
  - Mitigation: include safe-cell fallback and no-op fallback when displacement invalid.
