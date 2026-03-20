## Design

### Core model

Use a two-layer visual contract for every gameplay entity:

1. **Semantic token layer** (what it means):
- category: `obstacle | enemy | collectible | powerup | hazard | objective`
- intent: `danger | reward | utility | neutral`
- priority: `low | medium | high | critical`
- state: `idle | active | dangerous | disabled | exhausted`

2. **Presentation layer** (how it looks):
- shape family
- color family + contrast variant
- emphasis level (glow, pulse, motion, sound cue)

### Shape-based categorization

- **Circle / rounded organic**: collectible/reward/utility.
- **Angular / sharp / segmented**: danger, threat, or blocking logic.
- **Rectilinear tile/chip**: environment/terrain/obstacle class.

Constraints:
- Never assign the same primary silhouette to opposing intents (`danger` vs `reward`) in same scene.
- Inner icon detail must not be required to disambiguate at gameplay scale.
- At least one strong differentiator must exist between any two simultaneously present critical entities: shape OR hue family OR motion profile.

### Priority & feedback rules

- `critical`: strongest contrast + strongest temporal cue (pulse/flash/audio), shortest reaction window.
- `high`: high contrast + visible cue, but less aggressive than critical.
- `medium`: clear static readability; optional subtle motion.
- `low`: static readability only, minimal motion.

Emphasis gating:
- Emphasis is tied to **state + player relevance**, not raw entity type.
- Passive entities in non-interaction windows should downgrade emphasis.
- Multiple simultaneous critical cues should be capped to avoid overload.

### Color semantics

Color families are semantic, not decorative:
- **Danger**: warm hostile family (orange/red/magenta variants).
- **Reward**: bright positive family (green/cyan with high luminance).
- **Utility**: support family (blue/violet informational tones).
- **Hazard/ambient pressure**: darker saturation with distinct accent, never confused with reward.

Constraints:
- No conflicting reuse (e.g., reward hue for lethal events in same context).
- Keep contrast sufficient against background and overlays.
- If hue reuse is unavoidable, shape and motion must clearly separate meanings.

### Entity classification contract

For each category, enforce:
- gameplay role,
- default shape family,
- default color family,
- emphasis bounds (min/max intensity).

Baseline mapping:
- **obstacles**: rectilinear + low/medium priority unless active hazard.
- **enemies**: angular/segmented + danger colors; state elevates emphasis.
- **collectibles**: rounded + reward colors; high visibility but low aggression.
- **power-ups**: rounded/insignia hybrid + utility/reward colors; medium/high relevance.

### State-driven visuals

State progression rules:
- `idle` → low temporal activity, base contrast.
- `active` → moderate activity (pulse, soft glow, mild audio).
- `dangerous` → strongest readable emphasis; reaction-first.

Transition constraints:
- State transitions must be noticeable but not disorienting.
- Transition duration should support recognition before consequence where gameplay allows.
- When state changes become frequent, intensity should adapt to prevent strobe fatigue.

### Readability & UX constraints

- Player should classify threat/reward in under 1 second on mobile portrait.
- Avoid stacked competing animations in same focal region.
- Maintain hierarchy: objective-critical > immediate threat > rewards > ambient.
- Prefer fewer, stronger signals over many weak ones.

### Extensibility (data-driven)

New entity onboarding must use a mapping table (or equivalent data model):
- `entityType -> { category, intent, priority, stateVisuals, shapeToken, colorToken, cueProfile }`

Extension rules:
- New entity cannot ship without mapped semantic tokens.
- Validation should detect collisions in shape+color+priority combinations for concurrent entities.
- Guide/dev reference board must render from the same semantic mapping source.

### Implementation slice in this apply

- Add centralized mapping at `src/game/visual/visualLanguage.ts` for all glossary marker tones.
- Derive marker semantic role from this mapping in `markerSemantics.ts` (single source of truth direction).
- Add `tools/visual-language-check.ts` and `pnpm validate:visual-language` for fast guardrail checks.

## Key Points (Codex-style)

### What is changing

- We formalize visual language rules from implicit style to explicit contracts.

### Why it matters

- Improves fairness/readability and reduces future visual drift.

### Impacted areas

- Gameplay rendering decisions, marker taxonomy, enemy/powerup onboarding, UX playtest criteria.

### Risks / unknowns

- Some current assets may need iterative retuning to fully comply.
- Priority caps and motion intensity thresholds need practical tuning by device class.
