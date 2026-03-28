## 1. Channel metadata and packaging workflow scaffolding

- [x] 1.1 Add channel-aware release metadata validation (`dev`/`stage`/`prod`) and expose helpers needed by packaging/distribution workflows.
- [x] 1.2 Add minimal npm workflow scripts for channel-targeted build preparation (`dev`, `stage`, `prod`) and distribution metadata echo/export.

## 2. Distribution readiness artifacts

- [x] 2.1 Add signing/distribution checklist artifacts for candidate and release phases with required reviewer/date metadata.
- [x] 2.2 Add packaging QA + app-shell lifecycle parity checklist artifact and explicit pass/fail policy.
- [x] 2.3 Add rollback readiness artifact with previous stable build reference and release-owner metadata fields.
