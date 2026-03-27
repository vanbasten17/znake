---
name: znake-next-steps-openspec-sync
description: Sync NEXT_STEPS.md against this repo's OpenSpec history and base specs, append a generated status section at the bottom, choose the next highest-priority unmatched work items, and return conflict-aware OpenSpec proposal/apply prompts for parallel Cursor threads.
---

# Znake Next Steps OpenSpec Sync

Use this skill when the user wants to:

- check `NEXT_STEPS.md` against OpenSpec to see what is already done or already specced
- append that match status to the bottom of `NEXT_STEPS.md`
- choose the next working items by priority
- get prompts that can be pasted into multiple Cursor threads
- get an explicit execution order to avoid conflicts

This skill is repo-specific. Assume:

- planning source: `NEXT_STEPS.md`
- OpenSpec base specs: `openspec/specs/`
- archived change history: `openspec/changes/archive/` (optional, not default)
- live changes, if any: `openspec/changes/` excluding `archive/`

## Workflow

1. Read `NEXT_STEPS.md`.
2. Read relevant OpenSpec sources:
   - `openspec/specs/`
   - any live change under `openspec/changes/` outside `archive/`
   - `openspec/changes/archive/` only when needed to disambiguate historical intent or implementation status
3. Match each major `NEXT_STEPS.md` item into one of these buckets:
   - `Implemented or Archived`
   - `Specced in Base Specs`
   - `In Active Change`
   - `Unmatched`
4. Append a generated section at the bottom of `NEXT_STEPS.md` named:
   - `## OpenSpec Match Status`
5. In that section, include:
   - generation date
   - matched items with linked evidence paths
   - unmatched items still likely needing work
   - a short note if multiple NEXT_STEPS bullets collapse into one existing OpenSpec concept
6. Choose a small sample of next working items by priority.
7. Return copy-paste prompts optimized for actual concurrency:
   - parallel thread prompts only when safe overlap exists
   - otherwise sequential combined prompts (`propose` then `apply` per item)
8. Explicitly state the safest execution order.
9. Prefer the shortest practical execution plan:
   - pair each selected item as `Create spec` then `Apply`
   - minimize separate planning-only queues unless a dependency requires waiting
   - present the order as one global numbered list, not just thread labels

## Matching Rules

- Prefer exact concept matches over keyword-only matches.
- Default to base specs plus active changes as primary evidence.
- Treat archived changes plus matching base specs as strongest evidence that an item is already done at the spec level.
- Treat a base spec without implementation proof as `Specced in Base Specs`, not fully done.
- If `NEXT_STEPS.md` item maps to multiple spec requirements, summarize them together.
- Do not mark something done only because a similar word appears in OpenSpec.
- When uncertain, say `Partial match` and explain why.

## How To Pick Next Working Items

Choose 2 to 4 items only.

Prioritize:

1. `Unmatched` items from `High Impact / Low Cost`
2. items that unlock later work
3. items with low expected file overlap
4. items that can be proposed or applied in parallel

De-prioritize:

- items already archived unless the user explicitly wants a follow-up iteration
- items already covered by base specs unless the user wants implementation, not planning
- broad polish work that depends on missing gameplay events

## Prompt Output Requirements

Always add a letter label before every prompt block for quick identification:
- `A. ...`
- `B. ...`
- `C. ...`

Output mode MUST follow real dependency structure:

1. If **all selected items can be parallelized safely**:
   - return two groups:
     - `Proposal prompts`
     - `Apply prompts`
   - one proposal + one apply prompt per selected item
   - each prompt must be paste-ready for a fresh Cursor thread

2. If **none of the selected items can be parallelized safely**:
   - return only one group: `Sequential prompt`
   - include exactly one combined prompt that contains the full ordered plan
   - that single prompt must include both `propose` + `apply` steps for each selected item in sequence
   - do not emit split proposal/apply groups in this case

3. If there is a **mixed** case (some can parallelize, some cannot):
   - return two sections:
     - `Sequential prompts` for dependency-coupled items (combined propose+apply per item or chain as needed)
     - `Parallel prompts` for items that can run independently (split proposal/apply per item)
   - each prompt must be paste-ready and clearly scoped

## Conflict Review

After generating prompts, always include:

- which prompts can run in parallel
- which prompts should wait
- the exact recommended order
- a one-line reason for each dependency or conflict
- a default `Shortest Practical Version` that uses `propose` then `apply` for each item in sequence
- an expanded numbered execution list that explicitly says `Create spec for ...` and `Apply ...`

When there is no meaningful safe parallelism, say so explicitly and avoid presenting artificial thread parallelism.
When mixed, explicitly state which prompts are serialized and which are parallel.

Use this order style:

1. Create spec for `<change-a>`
2. Apply `<change-a>`
3. Create spec for `<change-b>` in parallel with step 1 or 2
4. Apply `<change-b>`

Then, if helpful, add a shorter thread summary underneath.

## Execution Order Default

Unless the user asks for a different breakdown, prefer this output pattern:

1. `Shortest Practical Version`
   - a compact numbered list using `propose + apply` pairs
2. `Detailed Execution Order`
   - a second numbered list that expands each pair into:
     1. create spec
     2. apply spec
3. `Parallel Notes`
   - one line per item describing what can overlap safely

Default sequencing rules:

1. Put foundational changes first.
2. For each selected item, prefer `Create spec` immediately followed by `Apply` once its dependencies are satisfied.
3. Only delay `Apply` if the item depends on an earlier applied change.
4. Low-overlap UI or recap work may run in parallel with foundational proposal/apply work.
5. If an item depends on another item's structure, propose and apply the dependency first.

## Suggested Prompt Template

Use this structure for each prompt:

```md
Use the `openspec-propose` skill for this thread.

Create an OpenSpec change named `<change-name>`.

Goal
<one sentence>

Scope
- ...

Non-goals
- ...

Relevant existing context
- `NEXT_STEPS.md`
- matching specs (add archived changes only when needed)

Spec areas likely affected
- `openspec/specs/...`

Please create:
- `proposal.md`
- `design.md`
- `tasks.md`
- relevant spec deltas

In `proposal.md` and `design.md`, include a `Key Points (Codex-style)` section with:
- what is changing
- why we are doing it
- impacted areas
- risks / unknowns
```

For apply prompts:

```md
Use the `openspec-apply-change` skill for this thread.

Continue the OpenSpec change `<change-name>` and implement the currently planned tasks only.

Constraints
- keep changes minimal and focused
- preserve determinism
- keep GameScene thin
- avoid unrelated refactors
- use `openspec/specs/` as source of truth for implementation
- do not read `openspec/changes/archive/` unless historical intent is required

Before finishing:
- run `pnpm check`
- run `pnpm build` only for significant behavior or architecture changes
- summarize what changed
- summarize what should be tested
```

## Reasoning Profile Guidance

- For proposal/design creation prompts, recommend higher reasoning depth.
- For apply prompts, recommend low reasoning depth by default.
- Raise apply reasoning depth only for core simulation, determinism-sensitive logic, or architectural refactors.

## Editing Guardrail For NEXT_STEPS.md

Do not rewrite the planning document wholesale.

Only append or refresh the final generated section:

- `## OpenSpec Match Status`

If that section already exists, replace only that section and leave the rest of the file intact.

## Output Format

Always return:

1. `Match summary`
2. `NEXT_STEPS.md update`
3. `Selected next items`
4. prompt section(s) chosen by mode:
   - all parallel: `Proposal prompts` + `Apply prompts`
   - none parallel: `Sequential prompt`
   - mixed: `Sequential prompts` + `Parallel prompts`
5. `Why this prompt mode`
6. `Shortest Practical Version`
7. `Detailed Execution Order`
8. `Parallel Notes`

Keep it concise and operational.
