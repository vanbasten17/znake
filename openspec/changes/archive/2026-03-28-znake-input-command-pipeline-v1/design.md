## Context

Input Command Pipeline is proposed as a focused change in the refactor track. The goal is to keep gameplay clarity and architecture quality aligned while enabling fast iteration.

## Key Points (Codex-style)

- What is changing
  - Refactor input handling into command objects validated before simulation apply.
- Why we are doing it
  - Improves input reliability and simplifies adding new control schemes.
- Impacted areas
  - Input stack, simulation command application, replay traces.
- Risks / unknowns
  - Command validation rules may reject legacy edge inputs.

## Goals / Non-Goals

**Goals:**
- Capture implementation-ready requirements and bounded tasks.
- Preserve deterministic simulation boundaries.
- Keep the change independently archivable.

**Non-Goals:**
- Cross-cutting rewrite of unrelated systems.
- New dependencies unless implementation later proves mandatory.

## Decisions

### Decision: OpenSpec-first staged rollout
- Start with proposal/design/spec deltas and execute apply in later loops.
- Rationale: keeps scope explicit and reviewable before behavior changes.

### Decision: Single capability anchor
- Anchor this change to  to simplify archive lineage.
- Rationale: reduces archive ambiguity and keeps requirement mapping clear.

## Risks / Trade-offs

- [Risk] Command validation rules may reject legacy edge inputs.
- [Trade-off] More granular changes increase coordination overhead but improve rollback safety.

## Migration Plan

1. Finalize spec deltas and tasks for Input Command Pipeline.
2. Execute implementation tasks in strict apply loops.
3. Validate with 
> znake@0.1.0 check /Users/mrabat/Desktop/znake
> biome check . && node tools/architecture-guardrails.mjs && pnpm -s validate:fairness

Checked 151 files in 137ms. No fixes applied.
[architecture-guardrails] OK
[fairness] band=early floor=5 reactionMs=1200.0 recoverability=0.588 cheapHit=0.308 pass=true
[fairness] band=mid floor=10 reactionMs=1050.0 recoverability=0.588 cheapHit=0.317 pass=true
[fairness] band=late floor=15 reactionMs=1050.0 recoverability=0.679 cheapHit=0.217 pass=true
[fairness] report=/tmp/znake-fairness-validation-last.json and 
> znake@0.1.0 build /Users/mrabat/Desktop/znake
> tsc --noEmit && vite build

vite v7.3.1 building client environment for production...
transforming...
✓ 129 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                            1.03 kB │ gzip:   0.49 kB
dist/assets/marker_atlas-3EIOcfGt.png     37.64 kB
dist/assets/index-C0nZPCzo.css            10.48 kB │ gzip:   2.97 kB
dist/assets/phaser-CKkBRixn.css           32.80 kB │ gzip:   5.99 kB
dist/assets/lifecycle-4GoQr7oA.js          1.28 kB │ gzip:   0.63 kB
dist/assets/objectives-zLvzx8uF.js         2.32 kB │ gzip:   0.69 kB
dist/assets/index-DyqIvu8O.js            137.47 kB │ gzip:  45.34 kB
dist/assets/phaser-xirqOAB4.js           283.42 kB │ gzip: 105.08 kB
dist/assets/phaser-DFK5Ua9d.js         1,208.06 kB │ gzip: 330.08 kB
✓ built in 2.51s when behavior/architecture changes.
4. Archive when all tasks are complete and gates are green.

Rollback strategy:
- Revert change directory and any implementation patches if validation fails.
