AGENTS.md

Project Overview

Znake is a roguelite Snake game built with TypeScript and Phaser.
The goal of the project is to evolve a fast-moving prototype into a production-ready, maintainable, and extensible codebase.

Core principles:
	•	Deterministic gameplay logic
	•	High iteration speed for game design
	•	Clear separation between simulation and rendering
	•	Data-driven systems over hardcoded logic

⸻

Architecture (Target State)

The codebase should be organized around three layers:

1. Simulation (Pure Logic)
	•	No Phaser or DOM dependencies
	•	Deterministic (seedable)
	•	Handles:
	•	Game rules
	•	Movement
	•	Collisions
	•	Spawning
	•	Objectives
	•	Enemy AI
	•	Fully testable in isolation

2. Presentation (Phaser)
	•	Rendering only
	•	Reads simulation state
	•	No game rules
	•	Responsible for:
	•	Drawing
	•	Visual effects
	•	Camera

3. Adapters
	•	Input (keyboard, touch, voice)
	•	HUD / DOM
	•	Audio / feedback
	•	Persistence
	•	Telemetry

⚠️ Important:
GameScene should act as an orchestrator, NOT as the place where game logic lives.

⸻

Development Commands

Use these commands as the source of truth:

pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm check:fix
pnpm format

When modifying code, ALWAYS ensure:
	•	pnpm build passes
	•	pnpm check passes

If tests are added:
	•	All tests must pass before considering the task complete

⸻

Definition of Done (DoD)

A task is complete only if:
	1.	Code builds without errors
	2.	Linting/formatting passes
	3.	No regressions in gameplay behavior
	4.	Changes are minimal and focused
	5.	No unrelated refactors are included
	6.	New logic is testable or covered by tests (when applicable)
	7.	Public APIs/types are consistent and clear

⸻

Prompting Guidelines (for agents)

When executing tasks, always follow:
	•	Role: Act as a senior game engineer / system designer
	•	Task: Clearly defined, narrow objective
	•	Context: Relevant files, constraints, and architecture
	•	Format: Structured output (see Output Format section)

Avoid vague or open-ended prompts.

⸻

Role Specialization

Adopt the appropriate role depending on the task:
	•	Architecture → Senior Software Architect
	•	Gameplay systems → Game Systems Designer
	•	Debugging → Senior Programmer
	•	Testing → QA Lead

Adjust decisions and output accordingly.

⸻

Task Strategy
	•	Break large tasks into small, independent steps
	•	Each step must be:
	•	testable
	•	reviewable
	•	reversible
	•	Prefer multi-step plans over large one-shot changes

⸻

Coding Guidelines

General
	•	Prefer small, composable functions
	•	Avoid large monolithic classes
	•	Keep functions pure when possible
	•	Avoid hidden side effects

State
	•	Do not mutate shared state implicitly
	•	Prefer explicit state transitions

Naming
	•	Use clear, descriptive names
	•	Avoid abbreviations unless obvious

Complexity
	•	Avoid deeply nested conditionals
	•	Extract logic into helpers/modules

⸻

Game Logic Rules

When modifying gameplay systems:
	•	Do NOT change behavior unless explicitly requested
	•	Preserve balance unless task is about balance
	•	Avoid introducing randomness that cannot be seeded

Critical invariants:
	•	No entity spawns on invalid cells
	•	Player always has a fair reaction window
	•	Objectives must remain achievable
	•	Collisions must be consistent and deterministic

⸻

Testing Strategy (Expected)

Focus on testing pure logic first:
	•	Grid occupancy
	•	Spawn logic
	•	Collision rules
	•	Enemy behavior
	•	Objective completion

Tests should:
	•	Be deterministic
	•	Use fixed seeds where randomness exists
	•	Cover edge cases (tight spaces, max entities, etc.)

⸻

Testing Mindset

When adding or modifying logic:
	•	Consider edge cases explicitly
	•	Validate invariants
	•	Prefer deterministic tests
	•	Include both expected and unexpected scenarios

⸻

Telemetry & Debugging
	•	Do not remove telemetry unless requested
	•	Prefer structured events over console logs
	•	Add events only if they provide real value

When debugging:
	•	Prefer reproducible scenarios (seeds/dev scenarios)
	•	Avoid adding temporary hacks

⸻

Performance Guidelines
	•	Avoid unnecessary allocations in hot paths
	•	Keep per-frame work predictable
	•	Prefer batching over per-cell operations when rendering

Do NOT optimize prematurely.
Only optimize when:
	•	There is a measurable issue
	•	The change is localized and safe

⸻

What NOT to Do
	•	Do NOT rewrite large parts of the codebase without explicit instruction
	•	Do NOT introduce new dependencies unless necessary
	•	Do NOT mix rendering and simulation logic
	•	Do NOT change multiple systems in one task
	•	Do NOT add “clever” abstractions without clear benefit

⸻

Preferred Task Style

Good tasks:
	•	“Extract spawn logic into a pure module”
	•	“Add tests for collision edge cases”
	•	“Make powerups data-driven”

Bad tasks:
	•	“Refactor everything”
	•	“Improve code quality” (too vague)

⸻

Output Format (mandatory)

All responses must include:
	1.	Summary (what changed and why)
	2.	Files modified
	3.	Risks / assumptions
	4.	Verification steps performed
	5.	Suggested next steps

Use concise, structured output.

⸻

OpenSpec Workflow (Spec-First)

All non-trivial changes MUST follow a spec-first approach using OpenSpec.

Required Flow
	1.	Create a change under:
	•	openspec/changes//
	2.	Produce BEFORE coding:
	•	proposal.md
	•	design.md
	•	tasks.md
	•	spec deltas (under specs/)
	3.	Get alignment (implicit or explicit) before implementation
	4.	Implement tasks in small, reviewable phases
	5.	Verify:
	•	pnpm build
	•	pnpm check
	•	tests (if present)
	6.	Summarize results and remaining work

⸻

Proposal Requirements

Must include:
	•	Problem statement
	•	Scope (what is included)
	•	Non-goals (what is NOT included)
	•	Risks and migration notes

⸻

Design Requirements

Must define:
	•	Target architecture (simulation / presentation / adapters)
	•	Boundaries between systems
	•	Data flow and ownership
	•	How determinism is preserved (seeded RNG)

⸻

Task Planning Principles

Tasks should be ordered based on:

1. Safety (low risk first)
2. Dependency (foundational systems first)
3. Impact (high-value changes early)

Examples of foundational work may include:
- extracting pure logic
- introducing determinism (e.g., seeded RNG)
- adding test coverage

However, exact task order MUST be defined per change in tasks.md.

⸻

Implementation Rules
	•	Do NOT implement large rewrites in one pass
	•	Prefer incremental extraction over replacement
	•	Preserve gameplay behavior unless explicitly required
	•	Keep GameScene thin (orchestrator only)
	•	Avoid introducing new dependencies

⸻

When Work Is Too Large

If the full change is too large:
	•	Still create full OpenSpec plan
	•	Implement only the highest-value subset
	•	Clearly list remaining phases

⸻

Deliverables

At completion, always provide:
	•	Change ID
	•	Summary of proposal/design/tasks
	•	Implementation summary
	•	Verification results
	•	Follow-up work

⸻

Long-Term Goals
	•	Fully deterministic simulation
	•	Replay system (seed + inputs)
	•	Strong test coverage of core systems
	•	Data-driven content (enemies, items, floors)
	•	Clean separation of concerns

⸻

This document defines how agents should operate within this repository.
Follow it strictly unless instructed otherwise.