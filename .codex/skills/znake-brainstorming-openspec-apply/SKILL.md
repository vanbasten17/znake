---
name: znake-brainstorming-openspec-apply
description: Unified OpenSpec-first Znake backlog orchestrator. Use when Codex should maintain NEXT_STEPS.md end-to-end by accepting incoming brainstorming ideas when provided, or internally analyzing the project to propose refactors/improvements when no ideas are provided; then prioritize easy-to-hard checkbox ideas, sync against OpenSpec, continuously implement active ideas until none remain (unless blocked), archive completed changes, and finish with a commit step plus message.
---

# Znake Brainstorming OpenSpec Apply

Use this as the single skill for brainstorming, prioritization, OpenSpec sync, and execution.

## Entry Modes

- Idea-inbox mode: accept user-provided brainstorming ideas during invocation and integrate them into `## Active Ideas`.
- Self-discovery mode: if user ideas are not provided, analyze repo context and propose practical gameplay/system/UX/performance/refactor improvements.

## Core Rules

- Follow OpenSpec-first behavior for any behavior, UX, progression, telemetry, or architecture change.
- If `NEXT_STEPS.md` is missing, has `NO_NEXT_STEPS`, or all ideas are implemented, run brainstorming first.
- Keep every idea tracked with a checkbox (`- [ ]`) and task/subtask checkboxes.
- Prioritize active ideas from simple/low-impact/fast to harder/deeper work.
- When an idea and all its tasks are done, move the full idea block to `## Completed` at the bottom.
- Preserve completed history; never delete completed items.
- Continue execution cycles in the same run until `## Active Ideas` is empty or a real blocker is reached.
- After active ideas are implemented and validated, proceed with archive, then commit flow (`apply -> archive -> commit`).
- Do not collapse large backlogs into one umbrella change unless the user explicitly asks for a single combined change.

## Change Granularity (MANDATORY)

- Default mapping is **one idea -> one OpenSpec change**.
- Small sibling ideas may be grouped only when they touch the same capability and files, and grouping does not exceed:
  - **max 3 ideas per change**
  - **max 6 implementation tasks per change**
- For large brainstorms (`>= 12 ideas`), you MUST create multiple changes and partition by category/surface (for example gameplay, ui/visual, refactor/tooling).
- For very large brainstorms (`>= 24 ideas`), create a **change-set plan** first:
  - list all planned change names
  - map each idea to a change name
  - keep each change independently archivable
- Never mix unrelated categories (gameplay + visual + refactor) in the same change unless one clearly depends on the other.
- If uncertain whether to split, split.

## Multi-Change Planning Output (when backlog >= 12 ideas)

Before first implementation, add a short plan section to the response:

- `Change set plan`
  - `<change-name-1>`: ideas `[1,2,3]`
  - `<change-name-2>`: ideas `[4,5]`
  - ...
- `Estimated change count`: `<N>`
- `Grouping rationale`: one sentence

## Required NEXT_STEPS.md Structure

Keep this structure unless the user explicitly requests another format:

1. `# Next Steps`
2. `## Active Ideas`
3. `## OpenSpec Match Status`
4. `## Completed`
5. `## Suggested Next Step`

Formatting rules:

- Active ideas must use `- [ ]`.
- Subtasks must also use checkboxes.
- Completed tasks use `- [x]`.
- Move only fully completed idea blocks into `## Completed`.

## Idea Template

```md
- [ ] <Idea title>
  - Why: <player value + engineering value>
  - OpenSpec change: <change-name or TBD>
  - [ ] Task 1
  - [ ] Task 2
  - [ ] Task 3
```

## Workflow

1. Read planning and spec context.
- Read `NEXT_STEPS.md` when present.
- Read `openspec/specs/` as source of truth.
- Read active `openspec/changes/` (excluding `archive/`).
- Read `openspec/changes/archive/` only when historical intent is needed.

2. Build/refresh idea pool.
- If user provided brainstorming ideas, normalize and merge them into active idea blocks.
- If user provided no ideas, internally analyze the project and generate a focused improvement/refactor idea set.
- Trigger additional brainstorming when `NEXT_STEPS.md` is missing, includes `NO_NEXT_STEPS`, or has no active idea left.

3. Prioritize active ideas.
- Order easiest/fastest first.
- Place high-risk or dependency-heavy ideas later unless they unlock most other work.

4. Sync each idea against OpenSpec.
- Classify each idea as:
  - `Implemented`
  - `In Active Change`
  - `Specced Only`
  - `Unmatched`
- Refresh `## OpenSpec Match Status` with concise evidence paths.

5. Execute autoloop continuously until no active ideas remain.
- Input: `ideas_to_implement` (default `all` active ideas).
- Select the highest-priority active idea, execute it, then refresh `NEXT_STEPS.md` and repeat.
- For each selected idea (or approved 2-3 idea cluster), run this sequence:
  1. Create/update OpenSpec change (`proposal.md`, `design.md`, `tasks.md`, relevant spec deltas).
  2. Ensure `proposal.md` and `design.md` include `Key Points (Codex-style)` with:
     - what is changing
     - why we are doing it
     - impacted areas
     - risks / unknowns
  3. Apply pending tasks.
  4. Run validation:
     - `pnpm check`
     - `pnpm build` only for significant behavior/architecture work
  5. Mark completed tasks in `NEXT_STEPS.md`.
  6. Move fully completed idea blocks to `## Completed`.
  7. Re-prioritize remaining `## Active Ideas` before starting the next iteration.
- Keep independent changes independent during execution: avoid reopening old unrelated changes when a new idea can proceed in its own change.
- Archive each completed change as soon as it is stable, instead of waiting for a mega-batch, unless the user asks for one final archive sweep.

6. Archive phase (after active ideas are done).
- Archive all completed active changes.
- Confirm archive path(s) and affected base spec files.

7. Commit phase (after archive).
- Create a single commit that captures the implemented + archived work using a concise conventional commit message.
- If repository policy requires manual commits, provide the exact ready-to-copy commit command and single-line commit message instead of executing commit.

8. End-of-run behavior.
- If active ideas remain because of blockers: report blocker details, what was completed, and the next recommended unblocked idea.
- If no active ideas remain: report completion, archive result, commit result, and what the user should test.

## Constraints

- Keep simulation deterministic and keep rendering/presentation separate from gameplay rules.
- Keep changes focused and minimal.
- Follow `apply -> archive -> commit` once no active ideas remain, unless blocked by explicit repo/user policy.
- Respect repo task-sizing guidance by keeping most changes within `3-6` tasks.

## Output Format

Always return:

1. `Mode` (brainstorm + plan, plan-only, or execute-loop)
2. `Backlog update` (what changed in `NEXT_STEPS.md`)
3. `Selected ideas` (full ordered list processed this run)
4. `Execution status` (per-idea propose/apply/check/build)
5. `Completed moved` (idea blocks moved to `## Completed`)
6. `Next step`
7. `Archive status` (done/blocked + archive paths + affected base specs)
8. `Commit status` (commit hash or manual-commit handoff)
9. `Commit message` (single-line, ready to copy)

If no active ideas remain, end with:

- `No active ideas remain.`
