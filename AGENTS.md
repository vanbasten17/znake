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

Output Expectations

When completing a task:

Provide:
	1.	Summary of changes
	2.	Files modified
	3.	Any risks or assumptions
	4.	Suggested next steps (optional)

Keep changes:
	•	Small
	•	Reviewable
	•	Reversible

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