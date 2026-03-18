## Why

The znake game has been built iteratively without formal specifications. To support future changes, onboarding, and AI-assisted development, we need a documented source of truth that captures the current behavior.

## What Changes

- Introduce OpenSpec specifications that describe the as-built game
- Create capability specs for: game core (state, constants, types), gameplay (rules, mechanics), input/HUD (controls, display), and scenes (flow, lifecycle)
- No code changes — this is documentation only

## Capabilities

### New Capabilities

- `game-core`: Constants, types, persistent state, upgrade definitions, and storage keys
- `gameplay`: Snake movement, food, powerups, enemies, walls, collision, floor progression, death
- `input-hud`: Touch/swipe, D-pad, keyboard bindings, DOM HUD stats, hint bar
- `scenes`: Menu, Game, Upgrade, Death scene flow and transitions

### Modified Capabilities

- (none — no existing specs)

## Impact

- New `openspec/specs/` directory with spec files
- No impact on application code; purely additive documentation
