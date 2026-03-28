## Overview

This change defines an extraction-first architecture plan to improve reuse and development speed while preserving gameplay behavior and deterministic simulation boundaries.

## Key Points (Codex-style)

- What is changing
  - Introduce explicit orchestration seams in scenes and shared helpers for overlays/copy/telemetry.
  - Split i18n resources by domain and isolate DOM translation side effects in a narrow adapter.
  - Define complexity and boundary guardrails as tooling contracts.
- Why we are doing it
  - Make frequent feature changes safer, faster, and less coupled to monolithic scene files.
- Impacted areas
  - Scene layering, UI composition helpers, i18n/telemetry systems, CI/tooling checks.
- Risks / unknowns
  - Refactor order matters; staged rollout and parity checks are required to avoid drift.

## Architecture Plan

### 1) Scene orchestration segmentation contract

- Keep `GameScene` as orchestrator, but segment responsibilities into extracted helpers:
  - `runFlow`: run start/end and progression transitions
  - `combatLoop`: per-tick combat progression helpers and side-effect orchestration points
  - `overlayController`: reward/route/event/room overlays and shared lifecycle behavior
  - `telemetryAdapter`: event helper calls with typed payload construction
- Preserve simulation ownership in `simulation/*` and avoid embedding new gameplay-rule math in scenes.

### 2) Shared overlay/card factory primitives

- Introduce reusable DOM helper primitives for scene overlays and card rows used by menu/game/upgrade/relic/death surfaces.
- Keep scene-specific copy and action binding configurable via parameters; avoid hardcoding per-scene duplication.

### 3) Shared objective/copy presenter

- Centralize objective preview/room-label formatting currently repeated across scenes.
- Keep translation-key resolution and fallback behavior consistent across all surfaces.

### 4) i18n modular resource contract

- Partition i18n resources by domain (`menu`, `gameplay`, `reward`, `eventChoice`, `controls`).
- Keep a small DOM adapter responsible for static-node text/ARIA updates.
- Keep initialization contract stable so scene code remains unchanged during first extraction phase.

### 5) Typed telemetry contract

- Define a central typed event registry/wrapper for frequently emitted scene telemetry families.
- Scenes call typed helpers; helpers own payload shape and release metadata merge behavior.
- Preserve event naming and payload semantics to maintain dashboard continuity.

### 6) Tooling guardrails

- Add architecture guard checks to detect:
  - forbidden side effects in `simulation/*`
  - scene complexity budget breaches (file size/import count)
  - duplicated overlay or presenter patterns where extraction is expected
- Start as warning-level/reporting contract, then allow stricter enforcement once migration stabilizes.

## Rollout Strategy

1. Extract shared presenter + overlay helpers first (lowest gameplay risk).
2. Introduce telemetry wrappers and migrate high-frequency scene calls.
3. Split i18n resources and retain compatibility adapter.
4. Segment `GameScene` by helper modules incrementally.
5. Enable tooling checks and adopt as default review gates.

## Validation Strategy

- Proposal/apply phases SHALL preserve behavior parity.
- During apply iterations:
  - run `pnpm check`
  - run `pnpm build` for significant architecture changes
  - keep deterministic simulation tests green
- Verify no gameplay-rule ownership drift into rendering adapters.
