---
name: znake-ralph-prompt
description: Generate a parameterized proposal-first Ralph strict prompt for Znake OpenSpec execution loops. Use when preparing a reusable prompt template to spawn multiple OpenSpec changes, run apply loops with strict gates, archive completed changes, and report per-loop telemetry.
---

# Znake Ralph Prompt

## Overview

Use this skill to output a ready-to-edit prompt template for Znake work in `proposal-first + Ralph strict` mode.

## Workflow

1. Collect or assume parameter values.
2. Fill the template.
3. Paste the rendered prompt as your next user message.

## Parameters

- `{{GOAL}}`: Main request or product objective.
- `{{CHANGE_COUNT_MODE}}`: `explicit-N` or `maximize-practical`.
- `{{CHANGE_COUNT}}`: Number when using `explicit-N`.
- `{{QUEUE_SCOPE}}`: Usually `openspec/changes only`.
- `{{CHECK_CMD}}`: Usually `pnpm check`.
- `{{BUILD_CMD}}`: Usually `pnpm build`.
- `{{BUILD_POLICY}}`: Usually `when behavior/architecture changes`.
- `{{FAILURE_HARDENING}}`: Failure-memory + fix + retry rule.
- `{{ARCHIVE_POLICY}}`: Usually `archive each completed change immediately`.
- `{{HUMAN_GATE_POLICY}}`: `auto` or `ask before non-trivial behavior changes`.
- `{{OUTPUT_LOCALE}}`: Language for status output.

## Prompt Template

```md
{{GOAL}}

Mode: proposal-first + Ralph strict.

Execution contract:
- Create {{CHANGE_COUNT_MODE}} OpenSpec changes {{CHANGE_COUNT}} as concrete changes (not idea bullets).
- Use {{QUEUE_SCOPE}} as the only active queue.
- Run apply loops continuously until all active changes are completed or a real blocker is reached.
- Single task per loop; do not start the next task before current gates pass.
- Gates per loop: {{CHECK_CMD}}; {{BUILD_CMD}} {{BUILD_POLICY}}.
- On any failed gate: apply {{FAILURE_HARDENING}}, then retry the failed gate.
- Auto-heal before archive: rerun gates, fix deterministic/style/typing regressions, rerun gates.
- Archive policy: {{ARCHIVE_POLICY}}.
- Human gate policy: {{HUMAN_GATE_POLICY}}.

OpenSpec requirements:
- For each change, create/update `proposal.md`, `design.md`, `tasks.md`, and matching spec deltas.
- `proposal.md` and `design.md` MUST include `Key Points (Codex-style)` with:
  - what is changing
  - why we are doing it
  - impacted areas
  - risks / unknowns

Output requirements (every cycle and final):
1. Mode
2. Change set update
3. Selected changes
4. Execution status
5. Completed archived
6. Next step
7. Archive status
8. Commit status (manual handoff if commit is user-managed)
9. Commit message (single-line, ready to copy)
10. Loop telemetry (loop id, change/task, gates, result, retries)

Use {{OUTPUT_LOCALE}} for user-facing output.
```

## Quick Fill Example

```md
{{GOAL}} = Refactoritza el snake roguelite per modularitat + gameplay clarity.
{{CHANGE_COUNT_MODE}} = explicit-N
{{CHANGE_COUNT}} = 6
{{QUEUE_SCOPE}} = openspec/changes only
{{CHECK_CMD}} = pnpm check
{{BUILD_CMD}} = pnpm build
{{BUILD_POLICY}} = when behavior/architecture changes
{{FAILURE_HARDENING}} = failure-domain hardening (append FAIL_MEMORY.md entry, prevention rule, fix, retry gate)
{{ARCHIVE_POLICY}} = archive each completed change immediately
{{HUMAN_GATE_POLICY}} = auto unless non-trivial behavior change
{{OUTPUT_LOCALE}} = Català
```
