# FIRST BRAINSTORMING PLAN

## Goal

Ship the highest-impact gameplay improvements with the best difficulty-to-development ratio, while keeping current stability and polish.

## Selection Criteria

- High impact on tension/replayability
- Low to medium implementation risk
- Reuses current architecture (Phaser gameplay + DOM shell)
- Can be validated incrementally with OpenSpec loops

## Phase 1 (Best ROI, implement first)

### 1. Timed Portal + Squeeze Pressure
- Why now: biggest gameplay tension gain with relatively contained systems work.
- Scope:
  - Floor countdown timer
  - Portal spawn/open state
  - Late countdown warning state
  - Squeeze fallback if player delays too much
- Notes:
  - Integrates naturally with existing floor progression and HUD run status line.
  - Start simple (single portal), tune timings after playtests.

### 2. Accessibility Mode + Voice Commands (MVP)
- Why now: improves inclusivity immediately and unlocks alternative control input with relatively contained UX/input work.
- Scope:
  - Accessibility mode toggle in menu/settings shell
  - High-contrast + larger UI text preset
  - Optional reduced visual effects and gentler motion profile
  - Voice command input for core movement (`up`, `down`, `left`, `right`) with optional `pause`/`start`
- Notes:
  - Must remain fully optional, with keyboard/touch as first-class fallback.
  - Start with browser-native speech recognition where available, then harden device support iteratively.

### 3. Floor Modifiers: Darkness + Ice (MVP)
- Why now: high variety with moderate implementation complexity.
- Scope:
  - Darkness: limited visibility radius around head
  - Ice: deterministic extra slide behavior on marked tiles
- Notes:
  - Roll out one modifier at a time behind per-floor config flags.
  - Prioritize readability and fairness over visual complexity.

### 4. New Enemy Set A: Egg + Mirror Snake
- Why now: adds pattern-learning depth without requiring full combat redesign.
- Scope:
  - Egg trap with proximity hatch
  - Mirror snake with delayed movement echo
- Notes:
  - Use gradual spawn rules by floor to avoid early frustration.

## Phase 2 (High value, medium effort)

### 5. Dual Portal Destination Choice
- Why: adds strategic routing and run identity.
- Scope:
  - Two portal options at transition
  - Simple destination metadata (safer vs riskier branch)
- Notes:
  - Implement after single-portal system is stable.

### 6. Core Biome (Passive Feeding Pressure)
- Why: introduces a distinct run rhythm with low art dependency.
- Scope:
  - Tail decay timer when not eating
  - Coolant-style counter item
- Notes:
  - Good candidate to validate biome identity pipeline.

### 7. Room-Based Procedural Template
- Why: meaningful exploration feel upgrade.
- Scope:
  - Connected-rooms generator as first structural template
  - Enemy/food spawn rules per room/corridor zones
- Notes:
  - Keep current wall generation as fallback path.

## Phase 3 (Powerful but heavier systems)

### 8. Boss Floor v1 (Giant Snake)
- Why: strong milestone moments every few floors.
- Scope:
  - Boss-only floor objective
  - One boss archetype first
- Risk:
  - Requires careful balance and collision readability.

### 9. Tail as Health + Power-up Segments
- Why: excellent long-term identity mechanic.
- Scope:
  - Damage model by collision type
  - Segment-as-buffer logic
  - Stored power-up segment behavior
- Risk:
  - Deep systemic change touching balance, UI feedback, and progression.

### 10. Elimination Run Type + Venom
- Why: high variety and combat-oriented objective mode.
- Scope:
  - Kill-target floor variant
  - Projectile/venom mechanic
- Risk:
  - Requires robust enemy combat tuning and objective UX.

## Suggested OpenSpec Order

1. `znake-timed-portal-squeeze-v1`
2. `znake-accessibility-voice-mvp-v1`
3. `znake-floor-modifiers-darkness-v1`
4. `znake-floor-modifiers-ice-v1`
5. `znake-enemy-egg-mirror-v1`
6. `znake-dual-portal-choice-v1`
7. `znake-core-biome-pressure-v1`
8. `znake-room-template-generator-v1`

## Definition of Done per Step

- OpenSpec proposal/design/tasks + spec deltas completed
- Behavior behind clear floor config/balance knobs
- `pnpm check` + `pnpm build` green
- Manual smoke pass:
  - menu -> relic -> game -> upgrade/death transitions
  - no stale input
  - no layout regressions
- Archive completed and base specs synced

## Assumptions

- We prioritize gameplay depth over adding more menu systems right now.
- Accessibility and alternative input support are treated as product-critical, not optional polish.
- We keep monetization-related UX iteration separate from core gameplay mechanics in this plan.
- We maintain mobile-first constraints and current shell architecture as-is during these phases.
