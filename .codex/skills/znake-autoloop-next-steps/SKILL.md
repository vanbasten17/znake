---
name: znake-autoloop-next-steps
description: Run a full autonomous NEXT_STEPS OpenSpec loop for Znake with minimal user involvement: sync NEXT_STEPS to OpenSpec, pick next unmatched implementable item, propose/apply, run check+smoke gates, verify/archive, and repeat until no implementable items remain.
---

# Znake Autonomous Next Steps Loop

Execute this workflow when the user asks for an autonomous loop over `NEXT_STEPS.md`.

## Skill Choreography
- Use `znake-next-steps-openspec-sync` for the sync and prioritization logic each cycle.
- Apply `znake-architecture-guardrails` checks before implementation and before closing each cycle.
- When the loop reaches completion (no major implementable unmatched items), hand off to `znake-brainstorming-next-steps` to regenerate backlog quality.

## Inputs

- Optional: max cycles (default `5`)
- Optional: allow auto archive (default `true`)
- Optional: allow auto commit (default `false`)

## Stop Condition (MANDATORY)

Stop only when either:

1. `NEXT_STEPS.md` has no major `Unmatched` items that are implementable now, OR
2. next unmatched items are blocked by missing external decisions/dependencies, OR
3. `max cycles` reached.

## Loop (one cycle)

1. Sync planning state:
- Use `znake-next-steps-openspec-sync` behavior to refresh `## OpenSpec Match Status` in `NEXT_STEPS.md`.
- Build prioritized candidate set from `Unmatched` items.

2. Select the next item:
- Pick the highest-priority unmatched item with lowest dependency risk.
- Prefer one bounded MVP slice (3-6 tasks).

3. Create/Open change:
- If no active change matches the item, create one OpenSpec change name in kebab-case.
- Write `proposal.md`, `design.md`, `tasks.md`, and spec deltas as needed.
- In `proposal.md` and `design.md`, include `Key Points (Codex-style)`.

4. Apply implementation:
- Implement pending tasks from `tasks.md`.
- Keep changes minimal, deterministic, and architecture-safe.
- Mark completed tasks immediately.
- Enforce `znake-architecture-guardrails` boundary checks before and after apply edits.

5. Run gates in this strict order:
- `pnpm check`
- `pnpm smoke`
- `openspec validate <change> --type change --strict`
- `pnpm build` for significant behavior/architecture changes.

6. If gates pass:
- Ask archive only if not explicitly auto mode.
- In auto mode, archive directly.
- After archive, provide:
  - archive path
  - updated base specs
  - single-line commit message

7. If gates fail:
- Stop current change progression.
- Output failure stage + concise rectification actions.
- Do not archive.

8. Repeat:
- Return to step 1 until Stop Condition is met.

## Efficiency Rules (AI usage)

- Reuse deterministic templates and existing prompts from `.autoloop/prompt-pack.md` whenever possible.
- Prefer single-change sequential execution over multi-thread fanout unless conflicts are clearly absent.
- Do not regenerate large plans each cycle; update only delta sections (`OpenSpec Match Status`, pending tasks, failure report).
- Keep reasoning depth low during apply unless touching core simulation architecture.

## Required Output Per Cycle

- `Cycle summary`: selected item, change name, completed tasks
- `Gate results`: check/smoke/validate/build pass/fail
- `Decision`: archived / blocked / continue
- `Next action`: exact next command or prompt

## Completion Output

When stop condition is reached, output:

1. `Autoloop completed`
2. total cycles
3. completed/archived changes list
4. remaining blocked items (if any)
5. recommended next start command
6. reminder to run `znake-brainstorming-next-steps` if backlog is exhausted
