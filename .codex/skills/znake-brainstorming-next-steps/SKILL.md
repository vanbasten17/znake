---
name: znake-brainstorming-next-steps
description: Use for creative gameplay, feature, UX, or systems brainstorming in Znake. Explore ideas against the current repo context, shape them into prioritized design directions, and write or refresh NEXT_STEPS.md as the standing starting point for future OpenSpec work.
---

# Znake Brainstorming Next Steps

Use this skill for creative sessions in this repo when the goal is to:

- brainstorm gameplay, UX, progression, content, or system ideas
- turn rough ideas into structured design directions
- create or refresh `NEXT_STEPS.md`
- leave behind a strong starting point for later OpenSpec proposal and apply work

This replaces a generic design-doc workflow with a repo-specific loop built around:

- `NEXT_STEPS.md`
- `openspec/specs/`
- archived OpenSpec history (only when needed for disambiguation)
- conflict-aware follow-up into proposal and apply threads

## Core Outcome

Every brainstorming session should leave the repo in a better planning state.

The default artifact is:

- `NEXT_STEPS.md`

Do not write a separate design doc unless the user explicitly asks for one.

## Workflow

1. Explore current context first.
   - Read `NEXT_STEPS.md` if it exists.
   - Read relevant `openspec/specs/`.
   - Check archived OpenSpec changes only if directly related and needed to disambiguate.
   - Check relevant code only if needed to avoid unrealistic ideas.
2. Clarify the creative goal with the user.
   - Ask concise questions only when they materially improve direction.
   - Prefer a short concrete exchange over a long interview.
3. Generate ideas in a structured way.
   - Favor gameplay meaning, readability, fairness, feedback, and iteration speed.
   - Think as both game designer and game engineer.
4. Converge into prioritized recommendations.
   - Sort by impact versus cost when helpful.
   - Separate foundational work from follow-up depth.
5. Write or refresh `NEXT_STEPS.md`.
6. If the user wants execution planning, hand off naturally to:
   - `znake-next-steps-openspec-sync`

## Design Lens

Always consider:

- player purpose
- readability
- fairness
- feedback
- juice
- performance
- determinism
- clean boundaries between simulation, presentation, and adapters

When discussing gameplay, prefer ideas that:

- create meaningful decisions
- preserve a fair reaction window
- support route planning and body management
- can be implemented incrementally
- fit the current architecture direction

## Required Structure For NEXT_STEPS.md

When creating or rewriting `NEXT_STEPS.md`, include these sections unless the user asks otherwise:

1. `# Next Steps`
2. `## Summary`
3. `## High Impact / Low Cost`
4. `## High Impact / Medium Cost`
5. `## Very High Impact / Higher Cost`
6. `## Medium Impact / Low Cost`
7. `## Recommended First Iteration`
8. `## One-Week Prototype Scope`
9. `## Suggested Next Step`

When useful, also include:

- `## Concrete Gameplay Concepts`
- `## Enemy Role Ideas`
- `## Upgrade Family Ideas`
- `## Znake-Specific System Hooks`

## Content Rules

The document should be:

- written in English
- concise but actionable
- specific enough to seed OpenSpec work
- grounded in the current repo context

It should not be:

- a vague brainstorm dump
- a full implementation plan
- a generic genre essay

Always aim to leave:

- prioritized ideas
- concrete examples
- one recommended first slice
- a prototype-sized scope

## OpenSpec Awareness

Before introducing something as a new next step, check if it is already represented in:

- `openspec/specs/`
- `openspec/changes/archive/` (only when required for historical confirmation)

If an idea is already well covered, do one of these:

- avoid repeating it
- note it as existing context
- propose a new iteration angle instead of re-stating the same work

Do not silently duplicate archived work in `NEXT_STEPS.md`.

## Editing Guardrails

- If `NEXT_STEPS.md` exists, update it rather than creating a competing planning file.
- Preserve useful existing structure unless the user wants a reset.
- Avoid rewriting unrelated repo docs.
- Keep the output focused on future action, not meeting notes.

## Optional Handoff

If the user asks to turn brainstorm output into action, recommend the next skill:

- `znake-next-steps-openspec-sync`

That handoff should:

- compare `NEXT_STEPS.md` against OpenSpec
- mark what is already covered
- pick the next sample of work items
- generate conflict-aware proposal and apply prompts for parallel threads

## Output Format

When reporting back after a brainstorming session, include:

1. A short summary of what changed in `NEXT_STEPS.md`
2. The main recommended first iteration
3. Risks or assumptions
4. Suggested next step

Keep the response concise and operational.
