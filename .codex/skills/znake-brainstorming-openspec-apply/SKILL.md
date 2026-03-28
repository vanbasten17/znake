---
name: znake-brainstorming-openspec-apply
description: Unified OpenSpec-first Znake backlog orchestrator. Use when Codex should maintain NEXT_STEPS.md end-to-end by accepting incoming brainstorming ideas when provided, or internally analyzing the project to propose refactors/improvements when no ideas are provided; then prioritize easy-to-hard checkbox ideas, sync against OpenSpec, auto-loop implementation for a chosen number of ideas, and move fully completed ideas into a Completed section.
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
- If no active ideas remain after processing, instruct the user to trigger this skill again.

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

5. Execute autoloop for a chosen number of ideas.
- Input: `ideas_to_implement` (default `1`).
- Select up to `ideas_to_implement` highest-priority active ideas.
- For each selected idea, run this sequence:
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

6. End-of-run behavior.
- If active ideas remain: report the next recommended idea.
- If no active ideas remain: ask the user to trigger this skill again to start a new brainstorming cycle.

## Constraints

- Keep simulation deterministic and keep rendering/presentation separate from gameplay rules.
- Keep changes focused and minimal.
- Do not archive automatically unless the user explicitly asks.

## Output Format

Always return:

1. `Mode` (brainstorm + plan, plan-only, or execute-loop)
2. `Backlog update` (what changed in `NEXT_STEPS.md`)
3. `Selected ideas` (up to requested count)
4. `Execution status` (per-idea propose/apply/check/build)
5. `Completed moved` (idea blocks moved to `## Completed`)
6. `Next step`

If no active ideas remain, end with:

- `No active ideas remain. Trigger this skill again to start a new brainstorming cycle.`
