## 1. Spec

- [x] 1.1 Add `event-choices` spec requirements for deterministic drafting, explicit tradeoffs, fairness gating, and scoped route-intent outcomes.
- [x] 1.2 Add `gameplay` delta requirements for event-choice decision points and progression gating.
- [x] 1.3 Add `objective-reward-loop` delta requirements for event-choice integration with reward identity and tradeoff clarity.
- [x] 1.4 Add `scenes` delta requirements for readable event-choice overlay behavior and orchestrator-safe resolution feedback.

## 2. Data model and deterministic drafting

- [x] 2.1 Add event-choice definition types in shared core modules (event id, trigger context, option payload, identity metadata, fairness metadata).
- [x] 2.2 Add balance/config entries for first-pass event archetypes (`risky_trade`, `curse_offer`, `safe_vs_dangerous_route`) and gating rules.
- [x] 2.3 Implement pure deterministic draft helpers that filter eligible options and produce a stable option set for a given seed + context.

## 3. Progression integration

- [x] 3.1 Add event-choice pending/resolved states in run progression state machine helpers.
- [x] 3.2 Wire deterministic event outcome resolution into run state updates while preserving non-boss recoverability constraints.
- [x] 3.3 Add bounded route-intent hooks for `safe_vs_dangerous_route` outcomes without mutating run-map topology.

## 4. Scene and UI integration

- [x] 4.1 Update `GameScene` orchestration to trigger event-choice overlays from progression state without embedding resolution rules.
- [x] 4.2 Add DOM/HUD event-choice presentation with explicit risk/reward copy, concise option layout, and confirmation for irreversible picks.
- [x] 4.3 Add short post-resolution feedback summary that mirrors applied deterministic payloads.

## 5. Verification

- [x] 5.1 Add deterministic tests for event drafting and resolution (same seed/context => same options/outcomes).
- [x] 5.2 Add fairness tests for invalid-cost filtering and recoverability guard behavior.
- [x] 5.3 Run `openspec validate znake-event-choices-v1`.
- [x] 5.4 Run `pnpm build` and `pnpm check`.
