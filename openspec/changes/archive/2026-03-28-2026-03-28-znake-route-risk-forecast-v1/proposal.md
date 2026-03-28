## Why

Route cards currently show room type and one-step future preview, but they do not explicitly forecast tactical risk. Players can still misread safer versus riskier lines under pressure, especially when elite density shifts in the next two rooms.

## Key Points (Codex-style)

- What is changing
  - Add a deterministic route risk forecast readout (`LOW`, `MEDIUM`, `HIGH`) to each route-choice card.
- Why we are doing it
  - Improve decision clarity and fairness without changing simulation outcomes.
- Impacted areas
  - Route overlay presentation in `GameScene`, route-risk helper logic, and localized route-copy keys.
- Risks / unknowns
  - Over-simplified labels could hide nuance if tuning is too coarse.

## What Changes

- Introduce a pure helper that scores route choice risk from room-type and preview composition.
- Show localized risk forecast text on each route card.
- Keep classification deterministic and bounded to existing route-preview payloads.

## Capabilities

### Modified Capabilities

- `run-map`: Route-preview cards include explicit risk forecast readability metadata.
- `scenes`: Route overlay copy gains one additional tactical line.
- `ui-foundation`: Existing route card hierarchy includes risk line without adding new overlays.

## Impact

- Affected code:
  - `src/game/scenes/GameScene.ts`
  - `src/game/simulation/routeRiskForecast.ts`
  - `src/game/systems/i18nResources.ts`
  - `tests/route-risk-forecast.test.ts`
- No dependency changes.
