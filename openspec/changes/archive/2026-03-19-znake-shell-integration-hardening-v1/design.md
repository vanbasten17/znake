## Context

Znake now uses a hybrid model: gameplay in Phaser canvas and non-gameplay overlays in DOM/CSS.

Most scene transitions already guard duplicate actions (`waiting`, `picked`, `isDying`), but transition setup is still scattered:

- `window.virtualInput` reset is inconsistent between scenes.
- shell chrome mode may update only after destination scene `create`, allowing visible one-frame shifts on some devices.
- transition checks are manual and repeated across scenes.

## Goals / Non-Goals

**Goals:**

- Standardize pre-transition cleanup (virtual input reset).
- Standardize transition entry to destination scenes with optional shell chrome pre-set.
- Keep behavior identical for gameplay outcomes.
- Add explicit smoke test checklist for mobile/desktop transition flows.

**Non-Goals:**

- Redesigning menu/relic/death visuals.
- Changing progression, scoring, enemy behavior, or collision logic.
- Adding automated E2E browser test tooling in this pass.

## Decisions

1. Introduce a lightweight scene-flow helper.
- Add `transitionToScene(scene, key, options)` with:
  - `resetVirtualInput()` before every handoff
  - optional `setSceneChrome(...)` pre-set
  - `scene.scene.start(...)`

Alternatives considered:
- Keep ad-hoc calls: lower short-term effort, but repeats risk patterns in every scene.

2. Export explicit virtual input reset API.
- Add `resetVirtualInput()` from input system so all scenes use one source of truth.

Alternatives considered:
- Direct writes to `window.virtualInput` in each scene: simple but inconsistent and easy to miss.

3. Harden GameScene cleanup on shutdown.
- Register `SHUTDOWN` cleanup to clear keyboard listeners and run-status remnants.

Alternatives considered:
- Rely only on Phaser internals: works often, but explicit cleanup reduces edge regressions.

## Risks / Trade-offs

- [Risk] Transition helper introduces behavior drift if overused.
  - Mitigation: keep helper minimal (reset + optional chrome + start).
- [Risk] Pre-setting shell chrome before `scene.start` could expose mode briefly if transition is canceled.
  - Mitigation: only use helper on committed transitions guarded by scene state flags.
- [Risk] Manual checklist may become stale.
  - Mitigation: keep checklist short and focused on core transition paths.
