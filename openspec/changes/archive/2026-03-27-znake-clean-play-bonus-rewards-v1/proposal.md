## Why

Current objective completion feedback does not clearly differentiate clean mastery (for example, clearing without taking hits) from baseline success, so high-skill play feels under-rewarded. Adding deterministic clean-play bonus rewards now improves fairness perception, clarity, and motivation with low implementation cost by reusing existing objective/reward and recap surfaces.

## What Changes

- Add first-pass deterministic clean-play conditions that can mark an objective clear as bonus-eligible (starting with no-hit objective clears).
- Add centralized balance-config payout rules for clean-play bonuses, including reward type and amount tuning knobs.
- Integrate clean-play payout into existing objective completion and reward application flow without replacing current reward drafting.
- Surface clean-play outcome and bonus payout in existing run-end recap outputs for mastery feedback.
- Add telemetry for clean-play eligibility/result and payout outcomes to support tuning and abuse detection.
- Define anti-farming guardrails so clean-play bonuses remain fair and do not become dominant loops.

## Key Points (Codex-style)

- **What is changing**
  - Objective clears can qualify for deterministic clean-play bonuses (first pass: no-hit clears), with payouts configured centrally and surfaced in recap/telemetry.
- **Why we are doing it**
  - To make mastery legible and rewarding, improving motivation and run clarity without a broad economy rewrite.
- **Impacted areas**
  - Objective progression/evaluation, reward application, balance config, run-end recap presentation, observability events.
- **Risks / unknowns**
  - Overtuned payout values could create farm incentives; objective-type edge cases may misclassify eligibility if rule boundaries are unclear.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `objective-reward-loop`: Extend objective completion flow to evaluate clean-play eligibility and grant deterministic bonus rewards.
- `balance-config`: Add centralized clean-play rule and payout tuning tables.
- `gameplay`: Define clean-play condition semantics and anti-farming constraints within deterministic progression rules.
- `observability`: Emit clean-play eligibility and payout telemetry at objective/run progression points.
- `scenes`: Surface clean-play bonus outcomes through existing reward/run-end recap presentation orchestration.

## Impact

- **Code**: Objective state/progression helpers, reward resolution helpers, centralized balance config, recap data shaping, scene-level recap/reward copy mapping, telemetry emitters.
- **Gameplay systems**: Mastery feedback loop, objective completion pacing/value perception, reward fairness safeguards.
- **UX**: Clearer distinction between baseline completion and high-quality execution in post-objective and run-end feedback.
- **Risk profile**: Low-to-medium implementation risk; medium tuning risk if payout defaults are too generous.
