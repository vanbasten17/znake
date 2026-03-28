# Next Steps

## Summary

Znake now has strong gameplay-spec coverage for core loop clarity, fairness, and upgrade identity. The next professional step is a full release-readiness phase: gameplay quality, graphics/asset quality, UX polish, performance stability, and launch operations for both app stores and global web.

Target outcome for this cycle:
- a stable, measurable, visually polished build that can pass store review
- a globally accessible web release with strong first impression, monitoring, and rollback safety
- a deeper and fairer game structure with improved level balancing, richer enemy/item variety, and stronger run progression

## High Impact / Low Cost

1. Production release checklist + quality gates.
Define one release checklist and enforce it on every release candidate: `pnpm check`, `pnpm build`, deterministic tests, smoke test scenes, visual sanity pass, and device sanity pass.

2. Graphics and UI quality bar checklist.
Set explicit acceptance criteria for readability and polish: contrast, spacing consistency, touch-target size, animation clarity, and no visual clipping on common aspect ratios.

3. Asset quality gate.
Add a lightweight gate for sprite/icon/HUD assets: naming consistency, resolution policy, compression policy, and visual-language consistency before merge.

4. Crash/error capture pipeline.
Add runtime error capture with release tagging so crashes are actionable by build/version.

5. Session-resume and lifecycle hardening.
Tighten background/foreground handling, pause/resume consistency, and stale-input protection on mobile.

6. Store/web compliance baseline.
Prepare privacy policy link, telemetry disclosure text, and age/content declarations for store listing and global web publication.

## High Impact / Medium Cost

1. Core gameplay depth pass (levels, enemies, items, balance).
Expand run depth with a clearer level curve, tune early/mid/late pressure, increase enemy composition variety, and improve in-run item usefulness/diversity without breaking determinism.

2. Mobile packaging track (iOS/Android shell).
Integrate a thin native wrapper (or equivalent) with build flavors for dev/staging/prod, icons/splash assets, signed release pipeline, and store-ready metadata.

3. Performance budget + visual budget.
Define hard budgets for frame stability/startup/memory and visual budgets for texture sizes, draw-call pressure, and FX intensity on low-end devices.

4. UX and game-feel polish pass.
Run one structured polish pass over onboarding, menu-to-run flow, feedback timings, transitions, and micro-animations for a premium feel.

5. Localization expansion for global launch.
Expand from current locales to a prioritized global set (for example EN + ES + PT-BR + FR + DE + JA), starting with menu/HUD/death/upgrade/reward/store-facing copy.

6. Audio quality pass.
Balance feedback SFX loudness/consistency, prevent clipping/fatigue, and ensure audio unlock/recovery reliability on mobile browsers.

7. Release operations playbook.
Define incident path: rollback trigger, hotfix process, and owner responsibilities for first 72 hours after launch.

## Very High Impact / Higher Cost

1. Remote config + feature flags.
Enable safe post-launch balancing (numbers and rollout toggles) without full binary redeploy for every tuning change.

2. Content expansion framework for long-term progression.
Define and implement scalable pipelines for additional level bands, enemy variants/archetypes, and item families so live updates can add depth without destabilizing balance.

3. Full art-direction consolidation.
Produce a compact visual style guide (palette, shape language, FX rules, typography hierarchy) and align all in-game/store assets to it.

4. Full platform QA automation.
Add automated cross-device visual/smoke flows for core scenes, input paths, and lifecycle transitions.

5. Live progression backend (optional scope gate).
If long-term retention is a goal, move profile/currency sync to a backend with migration/fallback policy.

## Medium Impact / Low Cost

1. Store-ready visual kit.
Create polished screenshots, short gameplay clips, icon variants, feature graphic, and concise store copy aligned with in-game identity.

2. Public web launch page.
Ship a clean landing page with gameplay hook, controls, privacy links, and platform links (web play + app stores).

3. Player-facing support surface.
Add in-menu links for FAQ/feedback/contact and a simple bug report template.

4. Build/version transparency.
Show app version and release channel in menu/footer for debugging and support.

5. Accessibility visual sanity sweep.
Quickly verify high-contrast/large-text/reduced-effects presets across key overlays and HUD surfaces.

## Recommended First Iteration

If we execute one tight release sprint first:

1. Ship release checklist + quality gates (including visual/asset checks).
2. Run a focused gameplay depth pass: rebalance level curve + tune enemies/items in one bounded slice.
3. Wire crash/error capture + KPI dashboard from existing telemetry.
4. Harden mobile lifecycle/pause-resume behavior.
5. Run one UX/game-feel + graphics readability polish pass.
6. Prepare compliance/stores baseline (privacy + disclosures + listing asset skeleton).

This gives a professional launch foundation across engineering, design, and asset quality without committing to backend-heavy work yet.

## One-Week Prototype Scope

1. Create a `Release Candidate Gate` checklist with engineering + visual + asset criteria.
2. Build one gameplay rebalance prototype across 10-15 levels (difficulty curve + enemy/item cadence).
3. Add runtime error capture with build/version tagging and verify in staging.
4. Implement one KPI dashboard view from existing observability events, including per-level fail points.
5. Run a focused mobile lifecycle + visual QA pass on a small device matrix.
6. Produce a first-pass store kit: icon set, 4-6 screenshots, short promo clip, privacy/disclosure copy.

## Suggested Next Step

Run `znake-next-steps-openspec-sync` to convert this plan into conflict-aware OpenSpec `propose + apply` prompts (parallel where safe, sequential where required).

## OpenSpec Match Status

Generated: 2026-03-27

### Implemented or Archived

- Objective clarity, reward readability, and telemetry alignment are archived in [2026-03-27-znake-objective-reward-loop-depth-v2](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-27-znake-objective-reward-loop-depth-v2) and reflected in [objective-reward-loop/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/objective-reward-loop/spec.md), [input-hud/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/input-hud/spec.md), and [observability/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/observability/spec.md).
- Combat fairness tuning (telegraph windows, spawn safety, breathing windows) is archived in [2026-03-27-znake-combat-fairness-tuning-v2](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-27-znake-combat-fairness-tuning-v2) and reflected in [gameplay/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/gameplay/spec.md), [balance-config/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/balance-config/spec.md), and [enemy-role-taxonomy/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/enemy-role-taxonomy/spec.md).
- Upgrade family identity/readability improvements are archived in [2026-03-27-znake-upgrade-identity-clarity-v2](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-27-znake-upgrade-identity-clarity-v2) and reflected in [upgrade-identity/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/upgrade-identity/spec.md) and [scenes/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/scenes/spec.md).

### Specced in Base Specs

- Mobile lifecycle and safe-area readiness are covered in [mobile-readiness/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/mobile-readiness/spec.md) (partial against broader store-launch expectations).
- Observability events are broadly covered in [observability/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/observability/spec.md), but production crash capture pipeline and KPI dashboard contract are not yet explicitly defined as release operations requirements.
- Gameplay depth primitives (objectives, enemies, progression hooks, balance-driven config) are strongly covered in [gameplay/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/gameplay/spec.md) and [balance-config/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/balance-config/spec.md), but a bounded “10-15 level rebalance and content-depth pass” is not yet represented as a focused active change.

### In Active Change

- None currently (`openspec list --json` reports no active changes).

### Unmatched

- Release Candidate Gate/checklist contract (engineering + visual + asset quality acceptance) is not explicitly specced.
- Production crash/error capture and release-tagged monitoring pipeline is not explicitly specced.
- Store/web compliance baseline (privacy/disclosure/store metadata contract) is not explicitly specced.
- Mobile packaging/distribution workflow (iOS/Android shell, signing/release channels) is not explicitly specced.
- Store-ready visual kit and public launch page requirements are not explicitly specced.

### Collapse Note

- Several roadmap bullets collapse into existing OpenSpec concepts: gameplay fairness, telemetry, mobile lifecycle, UI readability, and data-driven balancing. The major remaining gap is release/distribution professionalism and bounded content-depth execution packaging, not foundational gameplay concept absence.
