---
name: znake-brainstorming-openspec-apply
description: Unified OpenSpec-first Znake change orchestrator. Use when Codex should convert requested work directly into concrete OpenSpec changes, execute apply loops, archive completed changes, and finish with commit-message handoff.
---

# Znake Brainstorming OpenSpec Apply

Use this as the single skill for proposal-first change creation, OpenSpec sync, and execution.

## Entry Modes

- Proposal-inbox mode: accept user-provided requests and convert them into concrete OpenSpec changes.
- Self-discovery mode: if user requests improvements without details, analyze repo context and propose concrete OpenSpec changes.
- Proposal-first mode: when user asks for “N ideas and implement them”, treat this as “create and execute N OpenSpec changes” directly.

## Core Rules

- Follow OpenSpec-first behavior for any behavior, UX, progression, telemetry, or architecture change.
- Do not use `NEXT_STEPS.md` as the workflow source of truth.
- Use active OpenSpec change directories under `openspec/changes/` as the only temporary queue.
- Prioritize active changes from simple/low-impact/fast to harder/deeper work.
- Continue execution cycles in the same run until active OpenSpec changes are empty or a real blocker is reached.
- After active ideas are implemented and validated, proceed with archive, then commit flow (`apply -> archive -> commit`).
- Do not collapse large backlogs into one umbrella change unless the user explicitly asks for a single combined change.
- When user provides an explicit count (N), prioritize producing N concrete OpenSpec changes over maintaining a separate ideation backlog layer.

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

## Source Of Truth

- Temporary execution queue: `openspec/changes/<change-name>/`
- Finalized history: `openspec/changes/archive/<change-name>/`
- Base truth: `openspec/specs/`
- Do not require `NEXT_STEPS.md` creation or updates for this skill.

## Change Template

```md
- [ ] <OpenSpec change name>
  - Why: <player value + engineering value>
  - [ ] Task 1
  - [ ] Task 2
  - [ ] Task 3
```

## Workflow

1. Read planning and spec context.
- Read `openspec/specs/` as source of truth.
- Read active `openspec/changes/` (excluding `archive/`).
- Read `openspec/changes/archive/` only when historical intent is needed.

2. Build/refresh change set.
- If user provided requests, normalize and convert them into concrete change names/scopes.
- If user provided no concrete requests, analyze project context and propose a focused change set.
- If user requests explicit `N` items to implement, create `N` concrete OpenSpec changes directly.

3. Prioritize active changes.
- Order easiest/fastest first.
- Place high-risk or dependency-heavy ideas later unless they unlock most other work.

4. Sync each change against OpenSpec.
- Classify each change as:
  - `Implemented`
  - `In Active Change`
  - `Specced Only`
  - `Unmatched`
- Report concise evidence paths in the run response.

5. Execute autoloop continuously until no active changes remain.
- Input: `changes_to_implement` (default `all` active changes).
- Select the highest-priority active change, execute it, then refresh active change status and repeat.
- For each selected change, run this sequence:
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
  5. Mark completed tasks in that change's `tasks.md`.
  6. Re-prioritize remaining active changes before starting the next iteration.
- Keep independent changes independent during execution: avoid reopening old unrelated changes when a new idea can proceed in its own change.
- Archive each completed change as soon as it is stable, instead of waiting for a mega-batch, unless the user asks for one final archive sweep.
- In proposal-first mode, loop unit is “active OpenSpec change”, not “abstract idea”.

6. Archive phase (after active ideas are done).
- Archive all completed active changes.
- Confirm archive path(s) and affected base spec files.

7. Commit phase (after archive).
- Create a single commit that captures the implemented + archived work using a concise conventional commit message.
- If repository policy requires manual commits, provide the exact ready-to-copy commit command and single-line commit message instead of executing commit.

8. End-of-run behavior.
- If active changes remain because of blockers: report blocker details, what was completed, and the next recommended unblocked change.
- If no active changes remain: report completion, archive result, commit result, and what the user should test.

## Constraints

- Keep simulation deterministic and keep rendering/presentation separate from gameplay rules.
- Keep changes focused and minimal.
- Follow `apply -> archive -> commit` once no active ideas remain, unless blocked by explicit repo/user policy.
- Respect repo task-sizing guidance by keeping most changes within `3-6` tasks.

## Output Format

Always return:

1. `Mode` (brainstorm + plan, plan-only, or execute-loop)
2. `Change set update` (what active/archive OpenSpec changes were created/updated)
3. `Selected changes` (full ordered list processed this run)
4. `Execution status` (per-change propose/apply/check/build)
5. `Completed archived` (changes moved to `openspec/changes/archive/`)
6. `Next step`
7. `Archive status` (done/blocked + archive paths + affected base specs)
8. `Commit status` (commit hash or manual-commit handoff)
9. `Commit message` (single-line, ready to copy)

If no active changes remain, end with:

- `No active changes remain.`
