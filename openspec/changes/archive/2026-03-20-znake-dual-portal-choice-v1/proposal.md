## Why

Portal floors currently resolve into a single deterministic exit. Adding a dual-portal fork creates strategic routing decisions and increases replay variety without changing the core run loop.

## What Changes

- Spawn two portals on portal-objective floors:
  - `safer` route
  - `riskier` route
- Entering a portal stores a route modifier applied to the next floor setup.
- Add minimal, readable UI cues (status/hints + distinct portal visuals) to explain route intent.
- Keep non-portal objectives and boss-floor flow unchanged.

## Impact

- Affected specs:
  - `gameplay`
- Affected runtime:
  - `GameScene` portal logic and floor setup routing
  - i18n copy for route labels/hints
