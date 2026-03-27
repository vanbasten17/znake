## 1. Spec finalization

- [x] 1.1 Review and confirm clean-play rule semantics (including no-hit attribution) across objective-reward-loop, gameplay, and balance-config deltas.
- [x] 1.2 Confirm observability and scenes deltas align with recap wording and telemetry payload expectations.
- [x] 1.3 Resolve open design question for first-pass invalidation behavior (for example shield-only damage handling) before implementation.

## 2. Deterministic clean-play state and rules

- [x] 2.1 Add clean-play objective-window state fields and typed result payloads in core runtime types.
- [x] 2.2 Extend deterministic objective progression helpers to track qualifying-hit events and resolve clean-play eligibility at objective completion.
- [x] 2.3 Enforce one-shot clean-play payout gating per completed objective window.

## 3. Centralized balance configuration

- [x] 3.1 Add centralized clean-play eligibility rule config and objective-kind constraint tables.
- [x] 3.2 Add centralized clean-play payout config (type, amount, and per-objective cap).
- [x] 3.3 Wire reward/objective resolution paths to consume clean-play config without scene-local constants.

## 4. Reward flow and scene recap integration

- [x] 4.1 Integrate clean-play payout resolution into existing objective completion reward transaction.
- [x] 4.2 Surface clean-play completion outcome in existing reward feedback surface without replacing base reward draft flow.
- [x] 4.3 Extend run-end recap data plumbing and death-scene presentation to show clean clear count and total clean-play payout.

## 5. Telemetry and fairness safeguards

- [x] 5.1 Emit objective-completion clean-play telemetry with objective kind and qualification context.
- [x] 5.2 Emit clean-play payout telemetry with payout type/amount and objective-window identifier.
- [x] 5.3 Add deterministic tests for eligibility resolution, one-shot payout gating, and objective-kind anti-farming constraints.

## 6. Validation

- [x] 6.1 Run `openspec validate znake-clean-play-bonus-rewards-v1`.
- [x] 6.2 Run `pnpm check`.
- [x] 6.3 Run `pnpm build`.
