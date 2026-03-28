## 1. Spec and planning

- [x] 1.1 Finalize proposal/design for architecture reuse and velocity constraints.
- [x] 1.2 Add OpenSpec deltas for scenes, ui-foundation, observability, and tooling.

## 2. Shared UI/copy extraction (apply phase)

- [x] 2.1 Extract shared DOM overlay/card helper primitives for repeated scene overlay patterns.
- [x] 2.2 Extract shared objective/room copy presenter used by Menu/Upgrade/Relic/Game surfaces.

## 3. Cross-cutting adapter extraction (apply phase)

- [x] 3.1 Introduce typed telemetry wrappers and migrate high-frequency scene call sites.
- [x] 3.2 Split i18n resources by domain and keep a narrow DOM translation adapter.

## 4. Scene segmentation and guardrails (apply phase)

- [x] 4.1 Segment `GameScene` responsibilities into helper modules (`runFlow`, `combatLoop`, `overlayController`, `telemetryAdapter`) without gameplay behavior drift.
- [x] 4.2 Add tooling/CI architecture guard checks for simulation side effects and scene complexity budgets.

## 5. Validation and closeout (apply phase)

- [x] 5.1 Run `pnpm check` after each major extraction tranche.
- [x] 5.2 Run `pnpm build` for significant architecture tranches.
- [x] 5.3 Validate OpenSpec change and prepare archive decision once stable.
