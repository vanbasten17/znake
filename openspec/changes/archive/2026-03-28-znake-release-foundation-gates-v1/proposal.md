## Why

Znake needs a release-ready quality baseline that is explicit, enforceable, and measurable before distribution on app stores and global web. Defining release gates, monitoring contracts, KPI visibility, and compliance expectations now reduces launch risk while preserving fast iteration.

## What Changes

- Define a `Release Candidate Gate` contract that must pass engineering checks, visual quality checks, and asset quality checks before candidate approval.
- Define a production runtime error capture contract with release tagging so issues can be attributed to exact build and channel metadata.
- Define a minimum KPI dashboard contract sourced from existing gameplay telemetry to track run health and core failure points.
- Define a compliance baseline contract covering privacy/disclosure copy requirements and release-review metadata expectations.
- Define a minimal device QA matrix contract and pass/fail criteria for release candidates.

## Key Points (Codex-style)

- **What is changing**
  - Release-readiness moves from ad-hoc checks to formal contracts spanning gates, monitoring, KPI visibility, compliance, and device QA.
- **Why we are doing it**
  - A professional launch baseline is required to protect player trust, reduce avoidable regressions, and make release decisions auditable.
- **Impacted areas**
  - Observability contracts, release tooling/checklists, mobile-readiness QA/lifecycle expectations, scene-level diagnostics surfaces, and UI disclosure/readability policy.
- **Risks / unknowns**
  - Existing telemetry may not yet satisfy all KPI dimensions; visual and asset checks may require manual reviewer discipline before partial automation is added.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `observability`: add production runtime error capture/release tagging and minimum KPI dashboard contract requirements.
- `tooling`: add enforceable release-candidate gate workflow and checklist contract.
- `mobile-readiness`: add minimal device QA matrix and release candidate pass/fail contract.
- `scenes`: add release diagnostics/readiness visibility expectations where scene/UI context is required.
- `ui-foundation`: add compliance/disclosure baseline requirements for release-facing UI surfaces.

## Impact

- Affected specs: `openspec/specs/observability/spec.md`, `openspec/specs/tooling/spec.md`, `openspec/specs/mobile-readiness/spec.md`, `openspec/specs/scenes/spec.md`, `openspec/specs/ui-foundation/spec.md`.
- Affected implementation areas are expected to be lightweight and focused on contracts/checklists, telemetry wiring, and release metadata surfaces.
- No backend migration, no full visual regression automation suite, and no full store creative production are included in this change.
