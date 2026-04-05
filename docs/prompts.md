# Znake Prompt Library

Reusable slash-command style prompts for Codex and developers.
All prompts assume `AGENTS.md` is the source of truth.

## /explore-safe

Purpose: Explore and diagnose without risky edits.

Instructions:
```text
Read AGENTS.md and README.md first. Explore only.

Goal:
- Understand the problem and locate the smallest safe change area.

Where to look:
- Architecture and routing: AGENTS.md
- Project map and validation matrix: README.md
- Gameplay/domain: src/game/core/** and src/game/simulation/**
- Orchestration: src/game/scenes/** and src/game/scenes/gameScene/**
- UI/input/telemetry bridges: src/game/systems/**
- Validation/tooling: tools/**
- Regressions/contracts: tests/**/*.test.ts

Do:
1) Summarize likely root cause and affected layer(s).
2) Propose a minimal diff plan (files + intent only).
3) Flag risks (determinism, fairness, scene bloat, balance).
4) If behavior changes are needed, point to OpenSpec context in openspec/specs/** and active openspec/changes/<change>/*.

Do NOT:
- Modify files yet (unless explicitly asked).
- Suggest broad refactors.
- Move gameplay logic into scenes.
- Touch balance values in src/game/core/balance.ts unless explicitly requested.

Validation:
- No commands required for pure exploration.
- If user asks to proceed with edits, follow AGENTS.md validation policy.
```

Constraints:
- Keep exploration scoped and path-specific.
- Prefer lowest valid layer and minimal context reads.
- Avoid archive history (`openspec/changes/archive/**`) unless explicitly needed.

## /bugfix-safe

Purpose: Fix a bug with minimal risk and no unintended gameplay/balance changes.

Instructions:
```text
Read AGENTS.md and README.md first, then implement a safe bugfix.

Routing:
- Primary: src/game/core/** or src/game/simulation/**
- Bridge only if required: src/game/systems/**
- Scene glue only if unavoidable: src/game/scenes/** / src/game/scenes/gameScene/**
- Tests: tests/**/*.test.ts

Do:
1) Identify exact failing behavior and smallest affected layer.
2) Implement minimal patch in lowest valid layer.
3) Add or update deterministic regression test.
4) Keep scene changes orchestration-only.

Do NOT:
- Change gameplay balance in src/game/core/balance.ts (unless explicitly requested).
- Introduce unrelated refactors or dependencies.
- Add gameplay rule logic directly inside scene files.

Validation:
1) pnpm exec biome check --write --unsafe .
2) pnpm format
3) pnpm check
4) pnpm test (if gameplay/domain behavior changed)
5) pnpm build (only for risky/systemic impact)
```

Constraints:
- Prefer minimal diffs and existing patterns.
- Keep deterministic behavior intact.
- If fix changes behavior/flow, use active OpenSpec artifacts as source of truth.

## /gameplay-change

Purpose: Implement intentional gameplay behavior changes safely and traceably.

Instructions:
```text
Read AGENTS.md and README.md first. Follow OpenSpec-first flow for behavior changes.

Routing:
- Rules/progression/economy: src/game/core/**
- Deterministic mechanics: src/game/simulation/**
- Adapters/wiring: src/game/systems/**
- Scene orchestration only: src/game/scenes/** and src/game/scenes/gameScene/**
- Tests: tests/**/*.test.ts
- Specs: openspec/specs/** and active openspec/changes/<change>/*

Do:
1) Confirm scope from active OpenSpec artifacts before coding.
2) Implement logic in core/simulation first.
3) Wire through systems, then scenes only if needed.
4) Add deterministic tests (fixed seeds where randomness exists).
5) Report what changed and what to test manually.

Do NOT:
- Skip OpenSpec context for behavior changes.
- Put gameplay rules in scenes/UI layers.
- Edit unrelated systems or rebalance constants unless explicitly requested.

Validation:
1) pnpm exec biome check --write --unsafe .
2) pnpm format
3) pnpm check
4) pnpm test
5) pnpm build (for risky/systemic or architecture-heavy changes)
```

Constraints:
- Keep changes incremental (small tasks, small diffs).
- Preserve determinism and fairness.
- Minimize cross-layer edits.

## /rendering-only

Purpose: Apply visual/UI changes without altering gameplay rules.

Instructions:
```text
Read AGENTS.md and README.md first, then make a presentation-only change.

Routing:
- UI/HUD/input presentation: src/game/systems/**
- Styles: src/styles/**
- Rendering helpers/assets: src/game/render/** and src/game/visual/**
- Scene wiring only: src/game/scenes/** / src/game/scenes/gameScene/**
- Tests/contracts: tests/**/*.test.ts

Do:
1) State non-goal: no gameplay logic or balance changes.
2) Implement in systems/render/styles.
3) Keep scene edits minimal and orchestration-only.
4) Add/update tests for presenter/contract logic where relevant.
5) Include a short manual verification note (readability, feedback, responsiveness).

Do NOT:
- Modify core/simulation gameplay rules.
- Introduce logic coupling between rendering and gameplay decisions.
- Change balance values.

Validation:
1) pnpm exec biome check --write --unsafe .
2) pnpm format
3) pnpm check
4) pnpm test (if presenter/system logic changed)
5) pnpm build (if scene-level rendering rewiring is broad)
6) pnpm validate:visual-language or pnpm validate:markers (when applicable)
```

Constraints:
- Keep visuals in visual layers and rules in gameplay layers.
- Prefer existing UI patterns over new abstractions.
- Avoid unrelated refactors.

## /test-and-verify

Purpose: Run the right verification depth for the change risk and report outcomes clearly.

Instructions:
```text
Read AGENTS.md and README.md first. Verify changes by risk level.

Do:
1) Classify change type:
   - docs-only
   - UI/rendering
   - gameplay/logic
   - risky/systemic
2) Run required commands:
   - JS/TS edits pre-gate:
     a) pnpm exec biome check --write --unsafe .
     b) pnpm format
   - UI/rendering: pnpm check
   - gameplay/logic: pnpm check && pnpm test
   - risky/systemic: pnpm check && pnpm test && pnpm build
3) Confirm fairness/architecture checks are green via pnpm check.
4) Summarize pass/fail + residual risks + manual checks needed.

Do NOT:
- Skip required validation for the detected risk tier.
- Report success if any required gate failed.
- Ignore deterministic/fixed-seed expectations for gameplay tests.
```

Constraints:
- Use minimal required validation, but never below policy.
- Keep verification tied to touched paths and change risk.
- Call out unresolved risks explicitly.
