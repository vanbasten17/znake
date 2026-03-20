# Znake — Sprite Generation Reference

> A structured reference for generating pixel-art sprites for Znake. Each entry captures the idea of the element so it can be fed into an AI model (or human artist) for sprite creation. Includes lore context for consistent theming.

**Current state:** Znake uses procedural canvas glyphs. The spec states the project will evolve to authored PNG sprite assets; this document prepares that migration.

**Grid:** 20×20 px per cell. Sprites should fit within ~16–18 px usable area to preserve readability.

**Target runtime:** Phaser. Sprites will be loaded as sprite sheets and used via `this.add.sprite()` and animations. See [Phaser: Load Sprite Sheet](https://phaser.io/examples/v3.85.0/loader/sprite-sheet/view/load-sprite-sheet).

**Asset location:** All sprite sheets go into the root `/assets` folder (e.g. `assets/sprites/`).

---

## Phaser: How Sprites Are Loaded and Used

Znake runs on Phaser. Sprites must be generated as **sprite sheets** (PNG) and placed in the project root **`/assets`** folder (e.g. `assets/sprites/`). Load with `this.load.spritesheet()`:

```javascript
this.load.spritesheet('key', 'assets/sprites/sheet.png', {
  frameWidth: 20,
  frameHeight: 20
});
```

**Format for generation:**

- **Frame size:** All frames in a sheet use the same `frameWidth` × `frameHeight` (e.g. 20×20 or 16×16).
- **Layout:** Frames are arranged left-to-right, top-to-bottom. Phaser indexes them 0, 1, 2, …
- **Single-frame entities:** One sprite = one frame. The sheet can contain a single 20×20 tile.
- **Multi-frame entities:** Animated sprites (food pulse, portal, rift) = multiple frames in the same sheet. Use `this.anims.generateFrameNumbers('key', { start: 0, end: n })` for animations.
- **Static access:** `this.add.sprite(x, y, 'key', frameIndex)` picks a specific frame; `frameIndex` 0 is the first frame.

**Recommendations when generating:**

| Use case | Dimensions | Layout |
|----------|------------|--------|
| Single static sprite (e.g. wall, powerup) | 20×20 | One frame |
| Animated sprite (food, portal, rift) | 20×20 each | Horizontal row: frame 0, 1, 2, … |
| Directional variants (e.g. snake head up/down/left/right) | 20×20 each | 4 frames in row |
| Sprite atlas | 20×20 per cell | Grid; pack multiple entity types in one sheet |

When generating for a model, specify: **frame size (20×20)**, **transparent background (PNG)**, **no scaling/bleed** so frames align cleanly. If producing multi-frame sheets, state the frame count and layout (e.g. "4 frames in a horizontal row, 80×20 px total").

---

## Lore & Setting

**Biome: Void Depths**

The game takes place in the **Void Depths** — a dark, cosmic expanse where a neon serpent hunts. The arena floats in void space: black background, subtle grid, faint ambient glow (purples, deep blues). Stars scatter the backdrop. The snake itself emits green light.

**Core concepts:**
- **Core pressure** — The void exerts thermal/energy pressure; without feeding, the snake degrades. Food and coolant reset this.
- **Void rift** — An ambient hazard that periodically spawns a lethal zone. Rift batteries suppress it temporarily.
- **Portals** — Gateways to the next floor; appear on a timer. Squeeze (closing walls) adds urgency.
- **Biome cores** — Rare red energy nodes that grant growth and coolant.

**Aesthetic:** Neon arcade meets roguelite. High contrast, readable at a glance. Avoid muddy mid-tones; prefer clear silhouettes and strong color cues.

---

## 1. Player & Snake

### Snake head (player)
| Field | Value |
|-------|-------|
| **Id** | `snake_head` |
| **Role** | Player avatar, primary focus |
| **Lore** | Serpent traversing the void; predatory, agile |
| **Current visual** | Rounded square, bright mint/cyan (#00ffcc), white stroke, two eyes (direction-facing), subtle outer glow |
| **Color** | Primary: `#00ffcc` (snakeHead). Accent: `#ffffff` stroke. Eyes: `#03130e` |
| **Shape** | Square-ish, ~18×18 px. Eyes offset in movement direction |
| **Distinct** | Must read as "head" vs body at a glance. Eyes = instant recognition |
| **Sprite prompt** | Pixel art snake head, top-down view, neon mint green, two forward-facing eyes, square-rounded shape, glow outline, 16×16 px, arcade roguelite style |

### Snake body
| Field | Value |
|-------|-------|
| **Id** | `snake_body` |
| **Role** | Tail segments, continuity |
| **Lore** | Serpent body, organic chain |
| **Current visual** | Slightly smaller square per segment, green (#00ff88), thin top highlight, slight padding taper toward tail |
| **Color** | Primary: `#00ff88` (snake). Highlight: `#ffffff` 8% |
| **Shape** | Square, ~14–16 px, subtle gradient/taper |
| **Distinct** | Subordinate to head; no eyes; uniform |
| **Sprite prompt** | Pixel art snake body segment, top-down, neon green, slight highlight, no eyes, 16×16 px |

---

## 2. Food & Consumables

### Red Core (food)
| Field | Value |
|-------|-------|
| **Id** | `red_core` |
| **Role** | Basic food. Grow +1, score, resets core pressure |
| **Lore** | Energy node / biomass. The snake feeds on void-sustaining cores |
| **Current visual** | Diamond/cross shape (four triangles), pink/red glow, inner diamond glyph |
| **Color** | Primary: `#ff4466` (food). Glow: `#ff2244`. Outline: `#ff88aa` |
| **Shape** | Diamond or cross. Pulse animation |
| **Distinct** | Must read as "collectible good" — NOT hazard |
| **Sprite prompt** | Pixel art red energy core, diamond shape, pink-red glow, collectible food item, 16×16 px, arcade style |

---

## 3. World Items (Biome collectibles)

### Red Core (biome item)
| Field | Value |
|-------|-------|
| **Id** | `core_item` |
| **Role** | Biome bonus: score + growth + coolant |
| **Lore** | Concentrated void energy; rarer than basic food |
| **Current visual** | Cyan/teal square, grid-like inner glyph |
| **Color** | Glow: `#7ef2ff`. Fill: `#2affff`. Glyph: `#f4f8ff` |
| **Shape** | Square with grid pattern |
| **Distinct** | Different from basic food — more "tech" than "organic" |
| **Sprite prompt** | Pixel art energy core, cyan-teal, grid pattern, tech/energy feel, 16×16 px |

### Rift Battery
| Field | Value |
|-------|-------|
| **Id** | `rift_battery` |
| **Role** | Suppresses void rift for ~9 seconds |
| **Lore** | Power cell that dampens rift energy |
| **Current visual** | Purple glow, triangular shape |
| **Color** | Glow: `#8866ff`. Fill: `#cf77ff` |
| **Shape** | Triangle, point up |
| **Distinct** | Purple vs red (food) vs cyan (core) |
| **Sprite prompt** | Pixel art battery/cell, purple, triangular, power-up icon, 16×16 px |

### Portal Beacon
| Field | Value |
|-------|-------|
| **Id** | `portal_beacon` |
| **Role** | Accelerates portal appearance |
| **Lore** | Beacon that draws the portal signal faster |
| **Current visual** | Yellow/gold circle, double ring, bright center |
| **Color** | Primary: `#fff07a` (beacon). Stroke: `#f8d845` |
| **Shape** | Circle with concentric rings |
| **Distinct** | Golden — clearly "utility" not "food" |
| **Sprite prompt** | Pixel art beacon, golden yellow, concentric rings, signal/locator feel, 16×16 px |

---

## 4. Powerups

### Shield charge
| Field | Value |
|-------|-------|
| **Id** | `power_shield` |
| **Role** | Absorbs one lethal hit |
| **Lore** | Protective barrier; essential for boss floors |
| **Current visual** | Shield silhouette (rectangle + triangle), cyan (#00aaff) |
| **Color** | Primary: `#00aaff` (shield). Accent: `#44c5ff` |
| **Shape** | Classic shield: top rectangle, bottom triangle |
| **Distinct** | Shield iconography — universal readability |
| **Sprite prompt** | Pixel art shield icon, cyan blue, defensive symbol, 16×16 px |

### Time Slow
| Field | Value |
|-------|-------|
| **Id** | `power_slow` |
| **Role** | Slows enemies |
| **Lore** | Time distortion field |
| **Current visual** | Pink circle, clock-hand lines (hour/minute) |
| **Color** | Primary: `#ff88cc` (slow). Inner: `#ffc5e8` |
| **Shape** | Circle with clock hands |
| **Distinct** | Time/clock = slow |
| **Sprite prompt** | Pixel art clock/slow icon, pink, hour and minute hands, 16×16 px |

### Ghost charge
| Field | Value |
|-------|-------|
| **Id** | `power_ghost` |
| **Role** | One wall pass (wrap to opposite edge) |
| **Lore** | Phase shift; snake becomes momentarily intangible to walls |
| **Current visual** | Pale blue circle, crescent + rectangle (ghost-like) |
| **Color** | Primary: `#aaaaff`. Fill: `#c7c3ff` |
| **Shape** | Ghost silhouette: rounded top, wavy bottom |
| **Distinct** | Ethereal, "pass-through" feel |
| **Sprite prompt** | Pixel art ghost icon, pale blue, ethereal, wall-pass symbol, 16×16 px |

### Score Burst
| Field | Value |
|-------|-------|
| **Id** | `power_score` |
| **Role** | Instant bonus score |
| **Lore** | Score multiplier burst |
| **Current visual** | Gold/yellow square, star/diamond glyph center |
| **Color** | Primary: `#ffdd00` (powerup). Accent: `#ffb400` |
| **Shape** | Square with star or diamond |
| **Distinct** | Gold = reward/score |
| **Sprite prompt** | Pixel art score/star icon, gold yellow, reward symbol, 16×16 px |

### Venom (elimination mode)
| Field | Value |
|-------|-------|
| **Id** | `power_venom` |
| **Role** | Ranged attack for elimination objectives |
| **Lore** | Toxic projectile; snake gains offensive capability |
| **Current visual** | *Gap: currently shares score (gold square) visuals — needs distinct sprite* |
| **Color** | Intended: `#59ff87` (venom) — toxic green |
| **Shape** | Suggest: droplet, fang, or venom sac |
| **Distinct** | Must differ from score (gold) — green, offensive |
| **Sprite prompt** | Pixel art venom/toxin icon, toxic green (#59ff87), droplet or fang shape, offensive powerup, 16×16 px |

---

## 5. Portals & Progression

### Portal (safer route)
| Field | Value |
|-------|-------|
| **Id** | `portal_safer` |
| **Role** | Advance to next floor; fewer enemies, fewer walls |
| **Lore** | Gateway to the next void layer |
| **Current visual** | Cyan circle, triangular glyph inside (chevron/door) |
| **Color** | Glow: `#2ab8ff`. Stroke: `#68ffe8`. Fill: `#68ffe8` |
| **Shape** | Circle with triangle/chevron |
| **Distinct** | Cyan portal vs purple rift (hazard) |

### Portal (riskier route)
| Field | Value |
|-------|-------|
| **Id** | `portal_riskier` |
| **Role** | Harder floor, bonus score |
| **Lore** | Dangerous gateway; rewards the bold |
| **Current visual** | Orange/gold variant of portal |
| **Color** | Glow: `#ffa24a`. Stroke: `#ffd07a` |
| **Shape** | Same as safer, different palette |
| **Distinct** | Warm tones = risk |

---

## 6. Hazards

### Void Rift
| Field | Value |
|-------|-------|
| **Id** | `hazard_rift` |
| **Role** | Lethal zone; instant death on contact |
| **Lore** | Tear in the void; unstable, deadly |
| **Current visual** | Purple circle, X/cross glyph, jagged inner lines |
| **Color** | Glow: `#7a2fff`. Stroke: `#d089ff`. Jagged: `#ffd2ff` |
| **Shape** | Circle with X or fracture pattern |
| **Distinct** | Must read as DANGER — not collectible. Purple vs cyan (portal) |

### Squeeze (closing boundaries)
| Field | Value |
|-------|-------|
| **Id** | `hazard_squeeze` |
| **Role** | Arena borders close over time |
| **Lore** | Void constricts the play space |
| **Current visual** | Purple fill and stroke at inset borders |
| **Color** | Primary: `#7a2fff` (squeeze) |
| **Shape** | Border/edge effect; may not need cell sprite |
| **Sprite prompt** | Pixel art squeeze border texture, purple, constricting void, tileable |

### Ice tiles
| Field | Value |
|-------|-------|
| **Id** | `hazard_ice` |
| **Role** | Adds forced extra movement (slide) |
| **Lore** | Frozen void; slippery surface |
| **Current visual** | Pale blue fill, diagonal lines (ice crystals) |
| **Color** | Glow: `#8fe8ff` (ice). Stroke: `#66c7ff` |
| **Shape** | Cell-filling tile, diagonal line motif |
| **Sprite prompt** | Pixel art ice tile, pale blue, crystalline, diagonal lines, 20×20 px |

### Sand tiles
| Field | Value |
|-------|-------|
| **Id** | `hazard_sand` |
| **Role** | Movement delay |
| **Lore** | Gritty void sediment |
| **Current visual** | Tan/gold fill, small grain dots |
| **Color** | Glow: `#f0cb72` (sand). Accent: `#bd8b2c` |
| **Shape** | Cell-filling tile, grain texture |
| **Sprite prompt** | Pixel art sand tile, tan gold, grainy, 20×20 px |

### Darkness
| Field | Value |
|-------|-------|
| **Id** | `hazard_darkness` |
| **Role** | Limits visibility around head |
| **Lore** | Void shadows; obscuring |
| **Current visual** | Overlay; no sprite — darkness mask |
| **Note** | May need vignette or fade texture, not entity sprite |

---

## 7. Enemies

### Hunter (normal)
| Field | Value |
|-------|-------|
| **Id** | `enemy_normal` |
| **Role** | Standard enemy snake |
| **Lore** | Rival serpent in the void |
| **Current visual** | Orange body (#ff6600), amber head (#ffaa00), eyes, square segments |
| **Color** | Head: `#ffaa00`. Body: `#ff6600` |
| **Shape** | Snake segments, two eyes on head |
| **Distinct** | Orange vs green (player) |

### Stalker (elite)
| Field | Value |
|-------|-------|
| **Id** | `enemy_stalker` |
| **Role** | Faster pursuit |
| **Lore** | Aggressive hunter variant |
| **Current visual** | Magenta/pink (#cc2288 body, #ff33cc head) |
| **Color** | Head: `#ff33cc`. Body: `#cc2288` |
| **Distinct** | Pink/magenta = elite, faster |

### Ambusher (elite)
| Field | Value |
|-------|-------|
| **Id** | `enemy_ambusher` |
| **Role** | Dash-capable; punishes alignment |
| **Lore** | Ambush predator |
| **Current visual** | Purple (#7a3fb8 body, #b86dff head) |
| **Color** | Head: `#b86dff`. Body: `#7a3fb8` |
| **Distinct** | Purple = dash threat |

### Egg
| Field | Value |
|-------|-------|
| **Id** | `enemy_egg` |
| **Role** | Dormant; hatches after countdown |
| **Lore** | Mimic — looks harmless, spawns threat |
| **Current visual** | Ochre/gold circle (#9f7a33), cracked lines |
| **Color** | Fill: `#ffe48b` / `#9f7a33` |
| **Shape** | Oval/egg, optional crack lines |
| **Distinct** | Egg shape = "will hatch" |

### Mirror
| Field | Value |
|-------|-------|
| **Id** | `enemy_mirror` |
| **Role** | Tracks delayed player path |
| **Lore** | Echo serpent; copies your moves |
| **Current visual** | Cyan-blue (#3b90c7 body, #8ae6ff head) |
| **Color** | Head: `#8ae6ff`. Body: `#3b90c7` |
| **Distinct** | Cold cyan = mirror/echo |

### Boss
| Field | Value |
|-------|-------|
| **Id** | `enemy_boss` |
| **Role** | Multi-hit apex enemy |
| **Lore** | Apex predator of the void |
| **Current visual** | Gold/amber (#bd6a13 body, #fff066 head), health bars above head, rage phase adds red glow |
| **Color** | Head: `#fff066`. Body: `#bd6a13` |
| **Shape** | Same as Hunter but larger presence; health bar UI |
| **Distinct** | Gold + size = boss |

---

## 8. Environment

### Wall
| Field | Value |
|-------|-------|
| **Id** | `wall` |
| **Role** | Solid obstacle |
| **Lore** | Void-hardened structure |
| **Current visual** | Dark blue fill (#1a1a3e), inner darker (#11183b), corner highlights (#4b63da), bright stroke (#3333aa) |
| **Color** | Fill: `#1a1a3e`. Bright: `#3333aa` |
| **Shape** | Full cell block |
| **Sprite prompt** | Pixel art wall block, dark blue, subtle corner highlights, 20×20 px |

### Grid / background
| Field | Value |
|-------|-------|
| **Id** | `bg` |
| **Role** | Arena background |
| **Lore** | Void expanse |
| **Current visual** | Near-black (#020208), subtle grid (#0a0a18), ambient purple orbs |
| **Color** | Bg: `#020208`. Grid: `#0a0a18` |
| **Note** | Background; stars in drawBackground |

---

## 9. UI / HUD Elements (optional sprites)

- **Shield indicator** — Small cyan circle (in-world, next to score)
- **Ghost indicator** — Small pale blue circle
- **Venom indicator** — Toxic green (when implemented)

---

## 10. Suspect Improvements (gaps)

| Element | Issue | Recommendation |
|---------|-------|----------------|
| **Venom powerup** | Shares gold/score visual; no distinct sprite | Add venom-specific sprite (toxic green, droplet/fang) |
| **Red Core vs Core Item** | Both "core" naming; food is red, biome core is cyan | Keep distinct shapes: food = diamond/organic, core = grid/tech |
| **Portal glyphs** | Procedural; could be custom sprite per route | Consider authored portal frame + interior |
| **Enemy differentiation** | Color-only; body shape identical | Optional: subtle shape variation per enemy kind |
| **Egg crack** | Static; could animate pre-hatch | Sprite sheet with crack progression |

---

## 11. Color Palette Summary

| Name | Hex | Use |
|------|-----|-----|
| snake | `#00ff88` | Body |
| snakeHead | `#00ffcc` | Head |
| food | `#ff4466` | Food |
| foodGlow | `#ff2244` | Food glow |
| wall | `#1a1a3e` | Wall fill |
| wallBright | `#3333aa` | Wall stroke |
| enemy | `#ff6600` | Enemy body |
| enemyHead | `#ffaa00` | Enemy head |
| shield | `#00aaff` | Shield powerup |
| slow | `#ff88cc` | Slow powerup |
| ghost | `#aaaaff` | Ghost powerup |
| venom | `#59ff87` | Venom powerup |
| portal | `#68ffe8` | Portal |
| portalGlow | `#2ab8ff` | Portal glow |
| squeeze | `#7a2fff` | Squeeze / rift |
| beacon | `#fff07a` | Beacon |
| ice | `#8fe8ff` | Ice tiles |
| sand | `#f0cb72` | Sand tiles |
| bg | `#020208` | Background |
| grid | `#0a0a18` | Grid lines |

---

## 12. Example Prompt Template

For feeding into an AI image model. Output will be used in Phaser as sprite sheets ([Load Sprite Sheet](https://phaser.io/examples/v3.85.0/loader/sprite-sheet/view/load-sprite-sheet)):

```
Pixel art sprite for Znake roguelite game. [ELEMENT_NAME]: [DESCRIPTION].
Target: Phaser sprite sheet. Frame size: 20×20 px (or 16×16). Transparent PNG.
For animations: generate N frames in a horizontal row (total N×20×20 px).
Style: top-down arcade, neon colors on dark void.
Lore: Void Depths biome — cosmic serpent hunting in dark expanse.
Colors: [PRIMARY_HEX], [ACCENT_HEX]. Must be readable at a glance.
```

---

*Generated from `openspec/specs/`, `src/game/`, and `BRAINSTORMING.md`.*
