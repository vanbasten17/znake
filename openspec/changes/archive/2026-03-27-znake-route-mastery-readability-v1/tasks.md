## 1. Route-mastery metrics foundations

- [x] 1.1 Add route-mastery summary types/state and deterministic helper functions.
- [x] 1.2 Add deterministic route-decision capture wiring in run-map route commit flow.

## 2. Readability surfaces

- [x] 2.1 Add lightweight route-mastery HUD readout in existing run status/route context.
- [x] 2.2 Add lightweight route-mastery block in death recap.

## 3. Observability integration

- [x] 3.1 Emit route-mastery decision telemetry tied to route choice context.
- [x] 3.2 Include route-mastery run-end summary fields in `run_end` payload.

## 4. Validation

- [x] 4.1 Add deterministic tests for route-mastery summary capture behavior.
- [x] 4.2 Run `openspec validate znake-route-mastery-readability-v1`.
- [x] 4.3 Run `pnpm check`.
- [x] 4.4 Run `pnpm build`.
- [ ] 4.5 Manual smoke:
- [ ] route HUD readout remains concise and understandable during active routing
- [ ] death recap route-mastery summary helps explain failure context
- [ ] telemetry aligns route decisions with run-end mastery summary
