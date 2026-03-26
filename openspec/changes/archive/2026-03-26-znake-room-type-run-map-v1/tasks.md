## 1. Spec

- [x] 1.1 Add a `run-map` spec for deterministic node graphs, room types, and route preview behavior.
- [x] 1.2 Add `gameplay` delta requirements for room-type-driven progression and objective/reward integration.
- [x] 1.3 Add `scenes` delta requirements for run-map orchestration and room-entry presentation.
- [x] 1.4 Add `input-hud` delta requirements for upcoming route choice readability.
- [x] 1.5 Add `balance-config` delta requirements for room-type templates and branching rules.

## 2. Run-map data model

- [x] 2.1 Add run-map node, edge, room-type, and route-preview state types under shared core modules.
- [x] 2.2 Add centralized map templates, room-type distributions, and preview-horizon tuning under balance/config modules.
- [x] 2.3 Add pure helpers to generate deterministic run-map branches from seed and current run depth.

## 3. Progression integration

- [x] 3.1 Update room progression logic so the next segment is selected from reachable run-map nodes instead of implicit linear advancement.
- [x] 3.2 Route `combat` and `elite` nodes into the existing objective/reward loop without duplicating reward logic.
- [x] 3.3 Add stable resolution hooks for `shop`, `rest`, and `event` nodes so they can complete and return to map progression cleanly.

## 4. Scene and HUD presentation

- [x] 4.1 Update `src/game/scenes/GameScene.ts` to orchestrate route-choice presentation and room entry using run-map state.
- [x] 4.2 Add DOM/HUD support for showing upcoming room choices, selected path context, and room-type labels/icons.
- [x] 4.3 Add player-facing copy for first-pass room-type route planning without implying unimplemented deep content.

## 5. Validation

- [x] 5.1 Run `openspec validate znake-room-type-run-map-v1`.
