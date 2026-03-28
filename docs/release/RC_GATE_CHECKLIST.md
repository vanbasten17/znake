# Release Candidate Gate Checklist

Use this checklist for every release candidate before stage/prod approval.

## Release Metadata

- `release_version`:
- `release_channel` (`stage` or `prod`):
- `build_id`:
- Candidate date:
- Reviewer:

## 1) Engineering Gate

- [ ] `pnpm check` passes
- [ ] `pnpm build` passes for release-targeted candidate
- [ ] No new deterministic-simulation regressions observed in smoke verification
- [ ] Runtime error capture is active and includes release metadata tuple

Engineering gate result:
- Status: `PASS` / `FAIL`
- Notes:

## 2) Visual Quality Gate (Manual)

- [ ] Core menu/run/death overlays are readable on portrait mobile and desktop
- [ ] No severe clipping/overlap in key overlays (menu, upgrade, death, route/event choices)
- [ ] Objective-critical and hazard-critical cues remain readable during pressure moments

Visual gate result:
- Status: `PASS` / `FAIL`
- Reviewer:
- Notes:

## 3) Asset Quality Gate (Manual)

- [ ] No obvious broken/missing marker or icon assets in gameplay and guide surfaces
- [ ] Visual language remains consistent for major semantic families (danger/reward/utility)
- [ ] New assets follow existing naming and replacement expectations

Asset gate result:
- Status: `PASS` / `FAIL`
- Reviewer:
- Notes:

## 4) Compliance Baseline Gate

- [ ] Privacy policy link is present in release-accessible menu surface
- [ ] Telemetry disclosure link/text is present in release-accessible menu surface
- [ ] Review metadata recorded (reviewer + date + artifact links)

Compliance gate result:
- Status: `PASS` / `FAIL`
- Reviewer:
- Notes:

## Final RC Decision

- Overall status: `APPROVED` / `BLOCKED`
- Blocking issues:
- Follow-up owner:
