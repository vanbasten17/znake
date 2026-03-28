# Minimal Device QA Matrix

Use this matrix for release candidate pass/fail evaluation.

## Required Coverage Rows

| Device Class | OS Version | Form Factor | Required |
| --- | --- | --- | --- |
| Low-tier Android | Android 11+ | Portrait phone | Yes |
| Modern Android | Android 13+ | Portrait phone | Yes |
| Current iOS | iOS 17+ | Portrait phone | Yes |

## Mandatory Test Flow (per required row)

1. Launch app and start a run from menu.
2. Play through at least one objective window.
3. Trigger background -> foreground transition once mid-run.
4. Verify pause/resume and input remain stable.
5. Complete or end run and return to menu.

## Blocker Classification

- **Blocker**: crash, hard lock, severe input failure, lifecycle state corruption, or unreadable critical UI.
- **Major**: significant but non-blocking defect; can proceed only with explicit waiver.
- **Minor**: cosmetic or low-impact issue; does not block RC by default.

## Pass/Fail Contract

- Candidate is `PASS` only when all required rows have no blocker defects.
- Any blocker in a required row sets candidate to `FAIL`.
- Failed rows require fix + retest evidence before candidate can be approved.

## Execution Log

| Device | Result | Defects | Tester | Date |
| --- | --- | --- | --- | --- |
|  | PASS/FAIL |  |  |  |
