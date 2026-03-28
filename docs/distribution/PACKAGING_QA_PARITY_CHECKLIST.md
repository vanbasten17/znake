# Packaging QA and Lifecycle Parity Checklist

## Candidate Metadata

- `release_channel`:
- `release_version`:
- `build_id`:
- Tester:
- Date:

## Mandatory QA Cases

- [ ] App launches cleanly from packaged shell on target test devices
- [ ] Run can start from menu and complete one objective window
- [ ] Background -> foreground transition preserves pause/resume safety
- [ ] Input remains responsive after foreground return (no stale input)
- [ ] Menu -> Game -> Upgrade/Death scene flow remains behaviorally equivalent to web runtime

## Defect Classification

- `Blocker`: crash, hard lock, unrecoverable input/lifecycle break, or scene-flow break.
- `Major`: severe issue with workaround; requires explicit waiver.
- `Minor`: cosmetic or low-impact issue; does not block by default.

## Pass / Fail Policy

- Candidate is `PASS` only when all mandatory QA cases pass with no blockers.
- Any blocker sets candidate to `FAIL`.
- Failed candidate requires fix and revalidation before promotion.

## Results

- Status: `PASS` / `FAIL`
- Blockers:
- Notes:
