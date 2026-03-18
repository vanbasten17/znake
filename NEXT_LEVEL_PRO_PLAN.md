# Znake — Next-Level Professional Plan

This document captures the 5 highest-impact priorities to take Znake from a strong prototype to a professional, monetizable game product.

## 1. Retention First (Before Adding More Features)

Define a tight run loop with:
- Clear short-term objective
- Meaningful choices during the run
- Persistent rewards between runs

Priority implementation:
- Minimal meta-progression (one currency + short upgrade tree + starter relic draft)

Why this matters:
- Retention and replayability drive long-term value more than raw feature count.

## 2. Data-Driven Gameplay and Balance

Move gameplay tuning values out of scene logic into external balance config files.

Examples:
- Enemy stats and behavior tuning
- Drop rates and reward tables
- Floor difficulty curves
- Economy values

Why this matters:
- Faster iteration and safer balancing without constant code edits.

## 3. Build One Premium Vertical Slice

Ship one high-quality biome end-to-end instead of many partial systems.

Include:
- Distinct visual identity
- One biome-specific mechanic
- One exclusive enemy
- One exclusive item
- One mini-boss encounter

Why this matters:
- A polished slice validates quality and market positioning better than broad unfinished scope.

## 4. Add Gameplay Observability (Analytics)

Instrument key in-game events:
- `run_start`
- `run_end`
- `death_reason`
- `floor_reached`
- `upgrade_picked`
- `time_alive`
- `input_mode`

Why this matters:
- Product decisions, balancing, and monetization strategy require real player behavior data.

## 5. Mobile Product Readiness

Harden the game for production mobile usage:
- Stable 60 FPS target
- Haptics and responsive audio feedback
- Robust pause/resume lifecycle handling
- Reliable save persistence
- Packaging path (PWA first, then native wrapper)

Why this matters:
- Monetization success depends on session quality, performance, and platform reliability.

## Execution Approach

We will implement this plan sequentially, one point at a time, validating each stage before moving to the next.
