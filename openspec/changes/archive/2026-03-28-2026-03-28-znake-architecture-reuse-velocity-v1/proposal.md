## Why

Znake ships quickly, but iteration speed is now constrained by orchestration hotspots and duplicated scene-side UI/copy plumbing. `GameScene` has become a high-risk edit zone, overlay builders are duplicated across scenes, objective-preview copy helpers are repeated, telemetry payload calls are scattered, and i18n resource + DOM side effects are coupled in one large module.

We need a low-risk architectural simplification proposal that preserves gameplay behavior while improving reuse, change safety, and implementation throughput.

## Key Points (Codex-style)

- What is changing
  - Define explicit refactor contracts for scene orchestration segmentation (`runFlow`, `combatLoop`, `overlayController`, `telemetryAdapter`).
  - Standardize shared DOM overlay/card factory primitives for repeated scene overlays.
  - Centralize objective-preview and room-copy formatting in one presenter helper.
  - Define i18n domain-splitting and a small DOM translation adapter boundary.
  - Define typed telemetry event wrappers so scenes stop owning ad-hoc payload shapes.
  - Add tooling-level architecture guardrails for boundary and complexity-budget drift.
- Why we are doing it
  - Reduce regression risk in hot files and speed up feature delivery without changing gameplay outcomes.
- Impacted areas
  - `GameScene`, menu/upgrade/relic/death overlays, i18n and telemetry systems, architecture-check tooling.
- Risks / unknowns
  - Poorly sequenced extraction could cause short-term churn; mitigation is phased extraction with behavior-parity checks.

## What Changes

- Add architecture-focused spec deltas for scene orchestration boundaries, shared overlay primitives, typed telemetry contracts, and tooling guardrails.
- Scope implementation as phased extraction contracts only (proposal-level), not a rewrite.
- Preserve deterministic simulation ownership and existing gameplay behavior.

## Scope

- Proposal/design/tasks for architectural simplification and reuse contracts.
- OpenSpec deltas in:
  - `scenes`
  - `ui-foundation`
  - `observability`
  - `tooling`

## Out of Scope

- No immediate gameplay tuning changes.
- No immediate migration of every scene/system in one pass.
- No framework swap or rendering stack rewrite.

## Impact

- Affected code (planned implementation surface):
  - `src/game/scenes/GameScene.ts`
  - `src/game/scenes/MenuScene.ts`
  - `src/game/scenes/UpgradeScene.ts`
  - `src/game/scenes/RelicDraftScene.ts`
  - `src/game/scenes/DeathScene.ts`
  - `src/game/systems/i18n.ts`
  - `src/game/systems/telemetry.ts`
  - new shared scene/ui presenter/helper modules under `src/game/scenes` or `src/game/systems`
  - optional architecture guard scripts/checks under `tools/`
- No new runtime dependency requirement.
