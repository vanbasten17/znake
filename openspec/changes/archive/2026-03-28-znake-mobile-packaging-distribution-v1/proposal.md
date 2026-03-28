## Why

Znake needs a minimal but professional app-distribution foundation so iOS/Android packaging and release channel handling are consistent, auditable, and maintainable. Defining contracts now enables store-facing delivery without forcing deep native or backend rewrites.

## What Changes

- Define an app-store distribution capability contract for iOS/Android shell packaging with maintainable workflows.
- Define release-channel/version metadata contract for `dev`, `stage`, and `prod`.
- Define signing and distribution checklist contract for candidate and release builds.
- Define app-shell lifecycle expectations and behavioral parity guardrails with web gameplay flow.
- Define minimal packaging-specific QA and rollback readiness contract.

## Key Points (Codex-style)

- **What is changing**
  - Mobile packaging/distribution moves from implicit setup to explicit contracts covering channels, metadata, signing/distribution checklists, shell lifecycle parity, and rollback readiness.
- **Why we are doing it**
  - Store distribution requires predictable release mechanics and verifiable readiness signals, not ad-hoc per-build decisions.
- **Impacted areas**
  - Mobile-readiness requirements, release/tooling workflow, scene lifecycle parity boundaries, and a new app-distribution capability for packaging/release policy.
- **Risks / unknowns**
  - Native-shell provider choices may constrain implementation details; signing secrets and store credential handling must stay outside committed source.

## Capabilities

### New Capabilities

- `app-distribution`: iOS/Android packaging, release channel metadata, signing/distribution checklist, and rollback readiness contracts.

### Modified Capabilities

- `mobile-readiness`: extend readiness to include packaging-specific QA expectations tied to release candidates.
- `tooling`: define distribution workflow/checklist requirements for channel-aware candidate and release builds.
- `scenes`: define lifecycle and behavior parity expectations between web runtime and packaged app shell execution.

## Impact

- Affected specs: `openspec/specs/mobile-readiness/spec.md`, `openspec/specs/tooling/spec.md`, `openspec/specs/scenes/spec.md`, and new `openspec/specs/app-distribution/spec.md`.
- Expected implementation remains minimal and focused on packaging scaffolding contracts, metadata exposure, and docs/workflow artifacts.
- Non-goals remain out of scope: deep native feature parity, deep backend integration, and broad monorepo tooling rewrites.
