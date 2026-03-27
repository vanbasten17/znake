# Next Steps

## Summary

These are the highest-impact, lowest-cost gameplay improvements to make Znake feel more meaningful and fair before expanding content.

The main design goal is to make each run answer three questions clearly:

1. What is the player trying to do right now?
2. Why is this decision interesting?
3. Why did the player win or lose?

Popular roguelites such as Hades, Dead Cells, Slay the Spire, and Into the Breach consistently solve those questions through clarity, tradeoffs, and readable threat patterns. Znake can apply the same principles while keeping its own identity around movement, space control, and body management.

## High Impact / Low Cost

1. Clear short-term room or run goals.
Each segment should tell the player what they are trying to achieve, such as surviving for 20 seconds, collecting 3 cores, defeating 1 elite, or activating 2 terminals.

2. Risk-reward choices after each objective.
Success should lead to an interesting decision, not just progression. Examples: more health, more damage but higher speed, or more body length but worse turning.

3. Clear enemy telegraphs.
Players should understand incoming danger before taking damage. This is one of the most efficient ways to improve fairness and readability.

4. Fairer spawn rules.
Do not spawn enemies or hazards in positions that deny a reasonable escape path. This helps deaths feel deserved instead of arbitrary.

5. Three clearly defined upgrade families.
Start with a small, readable set instead of many flat upgrades. Suggested families: Aggro, Control, and Survival.

6. Strong feedback for damage, pickups, and objective completion.
Use clearer flashes, sounds, micro-pauses, and short visual celebrations so progress and danger are instantly readable.

7. Small breathing windows.
Give the player a brief reaction window when entering a room or right after taking damage to reduce unfair deaths.

## Concrete Gameplay Concepts

### Example Room Goals

These goals should be short, readable, and varied enough to change how the player moves through the arena:

1. Survive for 20 seconds.
2. Collect 3 cores before they decay.
3. Defeat 1 elite enemy.
4. Activate 2 terminals in opposite corners.
5. Escort a drifting orb without letting enemies touch it.
6. Clear an infestation nest that keeps spawning threats.

The best room goals for Znake are the ones that create route planning and body-positioning decisions rather than pure damage races.

### Example Reward Choices

Each completed goal should offer one meaningful decision. Good examples:

1. Gain 1 max health or gain 10 percent move speed.
2. Add 2 body segments or gain a short dash with a cooldown.
3. Increase pickup value or improve turning control.
4. Accept a curse for a rare upgrade.
5. Take a safe common reward or enter an elite room for a stronger reward.

The important rule is that rewards should shape playstyle, not only inflate power.

## High Impact / Medium Cost

1. Run map with room types.
Combat, elite, shop, rest, and event rooms would give the run more structure and planning.

2. Body as a real resource.
The snake body should become a meaningful economy. Segments could be spent on abilities, purchases, or defensive effects.

3. Enemies with distinct roles.
Use clear archetypes such as chaser, sniper, blocker, and summoner to create readable tactical situations.

4. Visible upgrade synergies.
If the player starts leaning into one style, the game should support that identity with related upgrade options.

5. Memorable elites or minibosses.
A single enemy with a strong pattern and readable counterplay can add more value than several generic enemies.

6. Short event choices.
Examples: trade body length for a relic, accept a curse for better rewards, or choose between safe and dangerous routes.

## Enemy Role Ideas

Enemy roles should be readable at a glance, with different silhouettes, colors, and telegraphs.

1. Chaser.
Moves directly toward the player and pressures routing.

2. Sniper.
Stops, aims, then fires in a straight line. Encourages reading space and timing turns.

3. Blocker.
Occupies space, creates walls, or forces detours. Good for making the body feel like part of the puzzle.

4. Summoner.
Creates weak hazards or eggs that must be managed before the room spirals out of control.

5. Charger.
Telegraphs a fast lane attack, then commits hard. Good for fairness because its intent is obvious.

6. Leech.
Steals pickups, shrinks the snake, or weakens rewards if ignored.

These roles matter because they create tactical variety without needing many bespoke systems. They also support fairness when each enemy clearly communicates its job.

## Upgrade Family Ideas

Start with three distinct upgrade families so each run can form an identity early.

### Aggro

Focus: speed, pressure, explosive offense.

Example upgrades:

1. Headbutt deals bonus damage after a short straight-line sprint.
2. Pickups trigger a small shockwave on collection.
3. First hit after a tight turn deals bonus damage.
4. Dash through a weak enemy to keep momentum.

Tradeoff direction:
Higher risk, tighter control demands, more reward for aggressive routing.

### Control

Focus: space management, slowing enemies, safer pathing.

Example upgrades:

1. Tail segments briefly slow enemies that touch them.
2. Dropped slime creates safe zones or choke points.
3. Collected cores pulse and push enemies away.
4. Elite telegraphs last longer near the snake body.

Tradeoff direction:
Lower burst damage, stronger map control, better survival through planning.

### Survival

Focus: forgiveness, consistency, defensive recovery.

Example upgrades:

1. First hit in a room removes body segments instead of health.
2. Picking up food after taking damage grants temporary shield.
3. Small heal when clearing a room without touching walls.
4. Brief invulnerability window after losing segments.

Tradeoff direction:
Less explosive payoff, more stability, better recovery from mistakes.

## Znake-Specific System Hooks

These ideas fit the snake fantasy especially well and help the game stand apart from other roguelites.

1. Body as economy.
Segments can be spent on abilities, shops, event choices, or temporary shields.

2. Body as terrain.
The tail can create lanes, zones, traps, or safe pockets.

3. Route planning as mastery.
The player should succeed not only by reacting quickly, but by choosing good movement lines before danger closes in.

4. Predator-prey rhythm.
Rooms should create moments of hunting and moments of escape, not constant undifferentiated panic.

5. Build identity through movement.
The most interesting upgrades are the ones that change how the player navigates the map, not just damage numbers.

## Very High Impact / Higher Cost

1. Biomes with gameplay rules, not just visual changes.
Each area should change how the player moves, routes, or survives.

2. Bosses with strong telegraphs and counterplay.
Bosses can define the run, but only after the base movement and fairness are solid.

3. Meta progression based on unlocking possibilities.
Prefer unlocking new upgrades, room types, characters, or mutators over large permanent stat boosts.

4. Challenge modifiers and mutators.
These increase replayability once the core loop feels strong.

## Medium Impact / Low Cost

1. Better run UI.
Show the current objective, pending reward, and major threat clearly.

2. Consistent color language.
Use reliable colors for danger, healing, economy, control, and elite threats.

3. Reward clean play.
Examples: bonus rewards for completing goals without taking damage.

4. Better death summary.
Tell the player why the run ended and what kind of build they created.

## Recommended First Iteration

If we only tackle three things first, these should be the priorities:

1. Add clear room or run objectives.
2. Improve telegraphs and spawn fairness.
3. Create three upgrade families with real tradeoffs.

This gives Znake a stronger sense of purpose, fairness, and run identity without requiring a large rewrite.

## One-Week Prototype Scope

If we want a practical first milestone, a small prototype could include:

1. One room objective system with 3 objective variants.
2. One reward choice screen with 6 to 9 total upgrades across Aggro, Control, and Survival.
3. Two enemy telegraph improvements and stricter spawn safety rules.
4. Better feedback for damage, pickups, and room completion.

This would be enough to test whether the game feels more legible, more intentional, and more replayable without committing to a large content expansion.

## Suggested Next Step

Create a small OpenSpec proposal around this hypothesis:

Improve gameplay clarity and meaning by introducing clear room goals, fairer combat readability, and three upgrade families with tradeoffs.


## OpenSpec Match Status

Generated: 2026-03-27

### Implemented or Archived

- Clear short-term room/run goals and post-goal reward choices are covered in [openspec/specs/objective-reward-loop/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/objective-reward-loop/spec.md), with archived change evidence in [openspec/changes/archive/2026-03-26-znake-objectives-rewards-loop-v1/proposal.md](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-26-znake-objectives-rewards-loop-v1/proposal.md).
- Combat fairness package (telegraphs, spawn safety, breathing windows) maps to [openspec/specs/gameplay/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/gameplay/spec.md) and [openspec/specs/balance-config/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/balance-config/spec.md), archived in [openspec/changes/archive/2026-03-26-znake-combat-readability-fairness-v1/proposal.md](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-26-znake-combat-readability-fairness-v1/proposal.md).
- Upgrade families and identity contracts are covered by [openspec/specs/upgrade-identity/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/upgrade-identity/spec.md), archived in [openspec/changes/archive/2026-03-26-znake-upgrade-identity-v1/proposal.md](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-26-znake-upgrade-identity-v1/proposal.md).
- Feedback, juice, and readability cues map to [openspec/specs/gameplay/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/gameplay/spec.md), [openspec/specs/input-hud/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/input-hud/spec.md), and [openspec/specs/scenes/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/scenes/spec.md), archived in [openspec/changes/archive/2026-03-26-znake-feedback-and-juice-v1/proposal.md](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-26-znake-feedback-and-juice-v1/proposal.md).
- Mid-layer structure items (run map, body economy, enemy roles, events, route mastery, predator-prey pacing, multi-biome rules) are archived and reflected in [openspec/specs/run-map/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/run-map/spec.md), [openspec/specs/body-economy/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/body-economy/spec.md), [openspec/specs/enemy-role-taxonomy/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/enemy-role-taxonomy/spec.md), [openspec/specs/event-choices/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/event-choices/spec.md), [openspec/specs/route-mastery-readability/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/route-mastery-readability/spec.md), [openspec/specs/predator-prey-pacing/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/predator-prey-pacing/spec.md), and [openspec/specs/gameplay/spec.md](/Users/mrabat/Desktop/znake/openspec/specs/gameplay/spec.md).
- Higher-cost tracks (boss depth, mutators, meta unlock direction, color-language consistency, clean-play rewards, death recap) have archive coverage via [openspec/changes/archive/2026-03-27-znake-boss-encounter-depth-followup-v1/proposal.md](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-27-znake-boss-encounter-depth-followup-v1/proposal.md), [openspec/changes/archive/2026-03-27-znake-challenge-mutators-v1/proposal.md](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-27-znake-challenge-mutators-v1/proposal.md), [openspec/changes/archive/2026-03-27-znake-meta-unlock-first-apply-audit-v1/proposal.md](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-27-znake-meta-unlock-first-apply-audit-v1/proposal.md), [openspec/changes/archive/2026-03-27-znake-color-language-consistency-apply-audit-v1/proposal.md](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-27-znake-color-language-consistency-apply-audit-v1/proposal.md), [openspec/changes/archive/2026-03-27-znake-clean-play-bonus-rewards-v1/proposal.md](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-27-znake-clean-play-bonus-rewards-v1/proposal.md), and [openspec/changes/archive/2026-03-26-znake-death-summary-recap-v1/proposal.md](/Users/mrabat/Desktop/znake/openspec/changes/archive/2026-03-26-znake-death-summary-recap-v1/proposal.md).

### Specced in Base Specs

- No major `NEXT_STEPS.md` concept remains only-specced without archived change lineage.

### In Active Change

- None currently. `openspec/changes/` contains only `archive/` as of 2026-03-27.

### Unmatched

- No clearly unmatched major item from `NEXT_STEPS.md` at OpenSpec concept level.
- Partial match caveat: several items are archived/spec-covered, but could still need implementation depth or tuning passes.

### Collapse Note

- Multiple bullets collapse into shared OpenSpec concepts: objective/reward loop, combat fairness, upgrade identity, feedback/juice, run-map progression, body systems, enemy taxonomy, pacing/readability, events, mutators, and recap/reward clarity.
