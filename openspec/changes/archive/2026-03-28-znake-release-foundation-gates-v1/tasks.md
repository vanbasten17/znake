## 1. Release metadata and runtime diagnostics

- [x] 1.1 Add a shared release metadata helper (`release_version`, `release_channel`, `build_id`) and ensure telemetry events can include the tuple consistently.
- [x] 1.2 Add best-effort global runtime error capture (`error` and `unhandledrejection`) that emits release-tagged telemetry events without changing gameplay flow.

## 2. Scene-adjacent release visibility and disclosure

- [x] 2.1 Add a non-intrusive menu diagnostics surface that exposes release tuple metadata for QA/support use without changing scene behavior.
- [x] 2.2 Add release disclosure links/text hooks in menu-accessible UI so privacy/telemetry disclosure baseline is visible in release-targeted builds.

## 3. Release gate, KPI, and QA baseline artifacts

- [x] 3.1 Add a release candidate gate checklist artifact that includes engineering, visual, and asset-quality sections with reviewer metadata and pass/fail status.
- [x] 3.2 Add a minimal device QA matrix artifact with mandatory coverage rows, blocker classification, and release pass/fail policy.
- [x] 3.3 Add a KPI baseline artifact defining minimum release metrics and evidence requirements sourced from existing telemetry.
