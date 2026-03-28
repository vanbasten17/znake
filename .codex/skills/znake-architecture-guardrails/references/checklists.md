# Checklists

## Pre-Apply Architecture Checklist
- List touched files by layer (`simulation`, `core`, `systems`, `scenes`, `ui`).
- Confirm no side effects were introduced in `simulation/*`.
- Confirm scene changes are orchestration-only where practical.
- Check for duplication in overlays/cards/status formatting.
- Confirm new tuning values were added in balance/config, not scenes.
- Identify whether any extraction trigger is hit.

## Review Checklist (Speed + Reuse)
- Can this logic be reused by at least one other scene/system soon?
- Is there a new implicit contract that should become a typed helper?
- Does this change make the busiest file larger when extraction was possible?
- Does this increase coupling between rendering and simulation?
- Are tests concentrated on pure logic where possible?

## Risk Labels
- `low`: localized, no new coupling, no trigger hit.
- `medium`: one trigger hit or duplicate pattern introduced.
- `high`: multiple triggers hit, or simulation boundary regression risk.

## Suggested Response Template
- Boundary Check: pass/fail summary.
- Reuse/Extraction Opportunities: top 1-3 items.
- Risk to Iteration Speed: low/medium/high with reason.
- Minimal Safe Plan: smallest extraction-first sequence.
