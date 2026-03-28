## Context

Znake needs a launch-facing contract that spans app-store assets, web launch messaging, support touchpoints, and app/version transparency. Current specs cover gameplay, scenes, UI foundations, and mobile readiness, but do not yet define a coherent release marketing surface that is testable and support-friendly.

This design keeps gameplay deterministic paths untouched and keeps `GameScene` as an orchestrator. Launch-facing behavior is scoped to menu/UI composition, static launch-page content contract, and tooling-driven release metadata.

## Key Points (Codex-style)

- **What is changing**
  - Add a launch-surface capability and wire minimal UI/tooling contracts for store assets, launch page, support links, localization scope, and version/channel visibility.
- **Why we are doing it**
  - To ship a professional first impression and reduce support/debug friction during web and app-store rollout.
- **Impacted areas**
  - Menu DOM surfaces, shared UI shell text slots, launch-page content/config, and build-time release metadata generation.
- **Risks / unknowns**
  - Store requirements can vary by platform/region; legal/support URLs may change post-launch; localization quality may lag if copy ownership is unclear.

## Goals / Non-Goals

**Goals:**
- Define a release-marketing contract that is specific enough to implement and validate.
- Ensure version/channel metadata is visible in-app for support and debugging.
- Define minimal support surface and localization boundaries for launch-copy surfaces.
- Keep scene architecture clean by confining launch UX to menu/web/support surfaces.

**Non-Goals:**
- Full marketing automation pipelines.
- User-acquisition attribution stack integration.
- Core gameplay-shell redesign or simulation behavior changes.

## Decisions

1. Decision: Introduce a dedicated `release-marketing-surface` capability.
- Rationale: Store/web launch contracts are cross-cutting and not owned by a single existing capability.
- Alternative considered: Distribute all requirements across `ui-foundation` + `scenes` only.
- Why not chosen: Diffuses ownership and makes archive/validation harder for release workflows.

2. Decision: Keep runtime behavior additions menu-centric and static-content driven.
- Rationale: Launch transparency/support links are non-simulation concerns and should not add per-frame gameplay overhead.
- Alternative considered: Add runtime overlays in `GameScene`.
- Why not chosen: Violates thin-orchestrator boundary and introduces potential readability/performance regressions during runs.

3. Decision: Source version/channel text from deterministic build metadata.
- Rationale: Support needs exact release identity; build-time metadata avoids manual mismatch.
- Alternative considered: Hardcode channel strings per environment file only.
- Why not chosen: Increases drift risk and weakens release reproducibility.

4. Decision: Define launch localization as scoped copy domains rather than full in-game localization expansion.
- Rationale: Keeps release scope tractable while enabling immediate global launch surfaces.
- Alternative considered: Expand all game-copy locales in the same change.
- Why not chosen: Broadens risk and delays launch-kit delivery.

## Risks / Trade-offs

- [Store media requirements drift by platform updates] → Mitigation: encode minimum contract and document platform override fields.
- [Support/legal links become stale] → Mitigation: centralize links in one config and expose validation checks.
- [Version/channel UI can clutter menu readability] → Mitigation: enforce tertiary hierarchy placement and mobile-safe wrapping.
- [Localization coverage inconsistency across launch surfaces] → Mitigation: define required string set and fallback locale behavior.

## Migration Plan

1. Add OpenSpec deltas for release-marketing and touched capabilities.
2. Implement minimal code/config changes to satisfy planned tasks (menu transparency, launch page contract surface, support links, metadata tooling).
3. Run validation (`pnpm check`, and `pnpm build` if architecture/significant behavior impact).
4. QA with launch-surface checklist (menu version/channel visibility, launch page links/copy, support entry points, locale fallback).
5. Rollback path: disable/omit launch-surface additions by reverting this change without gameplay/system migrations.

## Open Questions

- Which final store targets are guaranteed at launch (web-only + which app stores)?
- Do we require region-specific legal copy variants at v1 or only localized generic privacy/support text?
- Should support contact expose mailto only at v1, or also issue-form URL from day one?
