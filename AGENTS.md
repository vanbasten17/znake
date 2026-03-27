# AGENTS.md

## Project
Znake is a roguelite Snake game built with TypeScript and Phaser.

Priorities:
- deterministic gameplay logic
- fast iteration
- clear separation between simulation and rendering
- data-driven systems over hardcoded logic

## Architecture
- Keep simulation logic pure and testable when possible
- Keep Phaser code focused on presentation
- Treat GameScene as an orchestrator, not the home of gameplay rules
- Do not mix rendering and simulation unless the task explicitly requires it

## Commands
Use:
- pnpm build
- pnpm check

Run them before finishing significant code changes.
For tiny edits or exploratory work, use judgment.

## Change rules
- Keep changes minimal and focused
- Do not change gameplay behavior unless requested
- Do not introduce large rewrites without explicit instruction
- Avoid new dependencies unless necessary

## Testing
Prefer deterministic tests for pure logic.
Use fixed seeds when randomness is involved.

## Large changes
For large or risky changes, propose a short plan/spec before implementation.