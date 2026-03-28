# Signing and Distribution Checklist

Use this checklist for both candidate and release packaging decisions.

## Shared Metadata

- `release_channel` (`dev`/`stage`/`prod`):
- `release_version`:
- `build_id`:
- Reviewer:
- Date:

## Candidate Phase (Internal / Pre-release)

- [ ] Candidate package generated for iOS shell
- [ ] Candidate package generated for Android shell
- [ ] Signing configuration verified for target distribution path
- [ ] Build metadata tuple present in candidate evidence
- [ ] Known blocker defects status recorded

Candidate decision:
- Status: `PASS` / `FAIL`
- Notes:

## Release Phase (Store Submission)

- [ ] Store-target package generated for iOS
- [ ] Store-target package generated for Android
- [ ] Signing keys/profile configuration verified by owner
- [ ] Submission owner and reviewer recorded
- [ ] Rollback reference build metadata attached

Release decision:
- Status: `APPROVED` / `BLOCKED`
- Notes:
