## Why

The remaining `NEXT_STEPS` roadmap items are strategic and large. We need small, deterministic v1 foundations that unlock later depth without destabilizing current gameplay loops.

## Key Points (Codex-style)

- What is changing
  - Add a minimal branching meta-board status surface.
  - Add a validated content-pack contract with deterministic base-pack fallback.
  - Persist latest replay snapshot and surface ghost-target summary.
  - Add challenge share/import code flow with checksum verification.
  - Add adaptive onboarding rail suggestion with opt-in application.
- Why we are doing it
  - Convert high-cost strategic themes into implementable infrastructure slices now.
- Impacted areas
  - Menu scene, game start/death flow, local persistence contracts, core progression helpers.
- Risks / unknowns
  - Overexposing early scaffolds in menu may create expectation of deeper systems that are not yet fully built.

## What Changes

- Create data-driven core helpers for content packs, replay persistence, challenge sharing, onboarding rails, and meta-board branch status.
- Integrate these helpers into existing menu/game/death orchestration without moving gameplay-rule ownership into scenes.
- Keep runtime behavior deterministic and bounded; no core simulation rewrites.

## Capabilities

### Modified Capabilities

- `game-core`: deterministic runtime now resolves a content-pack contract and persists replay snapshot metadata.
- `meta-progression`: branching board v2 receives a first-pass status contract derived from existing progression state.
- `scenes`: menu/death surfaces expose challenge sharing, ghost-target context, and adaptive onboarding suggestion flow.

## Impact

- Affected code:
  - `src/game/core/contentPacks.ts`
  - `src/game/core/metaBoard.ts`
  - `src/game/core/replayStore.ts`
  - `src/game/core/challengeShare.ts`
  - `src/game/core/onboardingAssist.ts`
  - `src/game/scenes/MenuScene.ts`
  - `src/game/scenes/GameScene.ts`
  - `src/game/scenes/DeathScene.ts`
  - `src/game/core/types.ts`
  - `src/game/core/state.ts`
  - `src/game/core/constants.ts`
  - `src/styles/menuOverlay.module.css`
- No new dependencies.
