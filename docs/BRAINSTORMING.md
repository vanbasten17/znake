# ZNAKE — Gameplay Brainstorming

> Speculative design document. Ideas to expand the Snake Roguelite with biome mechanics, procedural maps, timed portals, and more. Where an idea draws directly from an existing game, that game is mentioned as a reference — not necessarily to copy it, but as a known implementation to study.

---

## 1. Movement Mechanics

### Dash
The snake can lunge **2 cells** in its current direction with a ~5-second cooldown. The dash passes through the own tail but not walls. Useful for escaping tight spots or grabbing distant food. As an upgrade it could reduce the cooldown or extend the range.
> *Reference: Many roguelites use dashes as a core mobility tool —* Hades *'s i-frame dash, or the burst movement in* Dead Cells *— but applied to a grid-based snake it becomes a precision timing puzzle rather than a pure reflex tool.*

### Rewind
Pressing a special button undoes the **last 3 moves** of the snake. Long cooldown (10–15 sec). Can't save from a collision already confirmed, but lets you recover from a wrong turn. Would be a highly valuable upgrade and potentially abusable — the cooldown is what keeps it honest.
> *Reference:* Braid *built an entire game around time rewind as a core mechanic.* Prince of Persia: The Sands of Time *uses it as a "forgiveness" system rather than a puzzle tool — that second framing fits better here.*

### Teleport Portals (In-Map)
Two portals appear on the map as an entry/exit pair. Entering one teleports the snake's head to the other side instantly. The tail follows through the entry point, creating interesting traversal moments. They can shift position every X seconds so they never feel static.
> *Reference: Portal (Valve) is the obvious touchstone, but the tail-follows-head dynamic is unique to Snake. The closest analog is the warp tile pairs in* The Legend of Zelda: A Link to the Past*.*

### Directional Gravity
The map has a "tilt" that makes the snake accelerate in one direction (e.g. downward) and slow down in the opposite one. Completely changes speed management. Combined with ice, creates very chaotic physics maps. Better as a biome modifier than a player upgrade.

### Toroidal Mode
Map edges are connected: leaving through the left side reappears on the right, leaving through the top reappears at the bottom. Like the Ghost upgrade but permanent for the floor. Removes the safety of corners and forces thinking about space as continuous.
> *Reference: Classic* Pac-Man *uses toroidal wrapping on its horizontal edges. In Snake, it fundamentally changes threat modeling — nothing is ever a dead end.*

---

## 2. New Enemies

### Mirror Snake
Copies your exact movements but with a **3-step delay**. If you go straight, it goes straight behind you. The best way to kill it is to spiral inward: it will follow the pattern and collide with its own tail. Very satisfying to kill but frustrating if you haven't seen it before.
> *Reference: The "delayed echo" enemy archetype appears in* Celeste *'s mirror temple rooms and* Undertale*'s Amalgamate bosses. The delay specifically makes the player's own choices the source of danger.*

### Bomber Snake
When it dies (by head-on collision), it **explodes** and destroys the 4 tail segments adjacent to the impact point. Getting it to die against a wall or another enemy rather than absorbing it yourself would be the optimal play. Players need to learn not to kill it head-on.
> *Reference:* Nuclear Throne *'s explosive enemies and* Spelunky*'s shopkeeper teach the same lesson — sometimes killing an enemy is more dangerous than avoiding it.*

### Static Snake (Trap)
Never moves. But if you touch any segment other than its head, it **grows indefinitely** (and fast) until it fills the corridor. Touching its head kills it normally. Creates obstacles that look inert but are lethal if you don't watch where you place your tail.

### Linear Hunter
Always moves in a straight line toward you, passing through walls without collision. Extremely slow but unstoppable unless you reposition. The only way to deal with it is to angle yourself so it collides with a side wall or another enemy.
> *Reference: The "predictable straight-line pursuer" design appears in* Into the Breach *'s Vek enemies — the player is expected to exploit the predictability, not outrun it.*

### Egg
An inert object that looks like a pickup. If the player's snake comes within **2 cells**, it hatches and spawns a small (3-segment) but very fast enemy snake. Multiple eggs can exist on the map. Players who haven't seen it before will approach it thinking it's food.
> *Reference: The "mimic" design pattern — something that pretends to be a reward — is used in* Dark Souls *'s Mimic chests and* The Binding of Isaac*'s Lemon Mishap trinket. The proximity trigger specifically echoes* Spelunky*'s sleeping enemies.*

---

## 3. Items & Power-ups

### Poison (Double Cut)
Immediately shrinks the tail by **3 segments** and applies a slow for 5 sec. In a dangerous moment it can save your life (less tail = less self-collision risk), but if you're already short it can kill you. A high-risk item that always creates an interesting decision.
> *Reference:* The Binding of Isaac *'s pill system is built entirely around this "bad-looking item with situational upside" philosophy — the player must learn which curse is worth taking.*

### Reverse Magnet
For 8 seconds, food is **repelled** toward the corners of the map. Forces the player into edge zones, which are typically the most dangerous. Could be a straight negative, or an opportunity for players who've learned to work the edges.

### Time Bomb
Appears on the map as a blinking object. Explodes after **8 seconds**, destroying everything in a 3-cell radius: walls, enemies, food, and tail segments. The player can ignore it, move away, or try to position an enemy in its blast radius.
> *Reference:* Spelunky *'s bomb items work on the same principle — the explosion is dangerous to the player but can be weaponized. The skill expression is entirely in positioning and timing.*

### Fake Food
Visually identical to normal food, but with a slightly different micro-animation if you pay close attention. Collecting it **doesn't grow** the snake — instead it removes a segment. At advanced floors there could be 2 on the map at once.
> *Reference: The visual "read challenge" on a dangerous pickup is a staple of* Hotline Miami *'s level design and* Enter the Gungeon*'s Blank items. In Snake the read is especially hard because the player is already tracking many moving elements.*

### Clock
Pauses the portal countdown timer for **5 seconds**. Extremely valuable on high-pressure floors. Could be the rarest item in the game and worth a significant detour.

---

## 4. Floor Modifiers

### Darkness
Only a **4-cell radius** around the snake's head is visible. The rest of the map is black. Enemies can be visible when they enter the radius, or always visible (the latter is less frustrating). Food emits a faint glow visible slightly beyond the vision radius.
> *Reference:* Darkest Dungeon *uses limited visibility as a core tension tool.* The Binding of Isaac *'s "Curse of Darkness" floor modifier works identically — the player must build a mental map from partial information.*

### Ice
Certain tiles (visually marked) make the snake **slide 1 extra cell** in the current direction after a turn, before the next input is accepted. Forces trajectory planning. Enemies also slide, which can be exploited.
> *Reference: Ice-floor sliding mechanics appear in virtually every* Zelda *and* Pokémon *dungeon. Applied to Snake they create a uniquely calculable risk — you always know exactly where you'll end up, the challenge is committing to it.*

### Advancing Walls
Every **20 snake moves**, a row of walls from all 4 corners advances 1 cell toward the center. The playable space shrinks progressively. Creates natural urgency without relying on the portal timer. In the final 30 seconds the map can be dramatically small.
> *Reference: The closing zone in* PUBG *and* Fortnite *operates on the same principle at macro scale.* Spelunky*'s ghost mechanic (wait too long and an unkillable pursuer appears) is the roguelite version of the same pressure.*

### Maze
The map is generated as a maze with 1-cell-wide corridors. No open space: everything is tunnels. Very different from the usual Snake feel. Enemies in maze mode path-follow corridors rather than seeking the player directly.
> *Reference:* Pac-Man *is fundamentally Snake-in-a-maze. This modifier pays direct homage to that while keeping the roguelite growth mechanics intact.*

### Glitch
Random map tiles **flicker between solid and passable** every few seconds. A wall can disappear and allow passage, or appear and block a corridor at the worst moment. Visually distorted. Best suited to the Glitch biome.
> *Reference: The "corrupted rules" aesthetic is used mechanically in* Pony Island *and* Doki Doki Literature Club*. The flickering tile specifically appears in* Fez*'s anti-cube rooms.*

---

## 5. Biomes

Each biome defines: color palette, tileset, special physics rules, enemy pool, and exclusive items. Progression could offer a choice between 2 biomes at each floor transition.

### Void (Starting Biome)
The default biome. Neutral. Acts as an implicit tutorial. Standard walls, standard enemies, all items can appear. Visuals: black background, subtle grid, neon green snake.

### Crystal
Enemy snakes that hit a wall **reflect** their direction (90° bounce). The player can exploit this to funnel enemies into each other, or get trapped by ricocheting threats. Exclusive item: *Prism*, which causes the player to bounce off a wall once instead of dying.
> *Reference: Ricochet-based enemy movement appears in* Breakout *and early arcade shooters. The "reflect instead of die" mechanic echoes* Crypt of the NecroDancer*'s shield items.*

### Swamp
The ground is slow by default. **Marked paths** (dry mud tiles) have normal speed. Off-path movement runs at half speed. Poison items spawn much more frequently. Exclusive enemy: the Linear Hunter (unaffected by mud).
> *Reference: Terrain-based movement penalties are a staple of strategy RPGs (* Fire Emblem*,* Advance Wars*). Applying them to a real-time arcade game creates a spatial puzzle layer on top of the reaction-speed layer.*

### Core
**Rising temperature**: every 15 seconds without eating, the snake loses 1 tail segment. Creates constant feeding pressure. Shorter tail = easier to maneuver, but closer to death. Visuals: reddish background, heat-shimmer distortion. Exclusive item: *Coolant*, pauses the temperature timer for 20 sec.
> *Reference:* Don't Starve *'s hunger and sanity meters use the same "passive degradation" pressure loop.* FTL *'s oxygen-depleting rooms create identical urgency at a smaller scale.*

### Glitch
Flickering tiles, visual corruption effects, distorted audio. Rules seem "broken": sometimes food gives 2 segments, sometimes 0. Collisions with flickering walls have a 50% chance to pass through instead of killing. Unpredictable but thrilling.
> *Reference: The corrupted-cartridge aesthetic is used in* Undertale *(Genocide route finale),* Pony Island*, and* Doki Doki Literature Club*. The random-rule-breaking mechanic specifically echoes the way* The Stanley Parable *subverts player expectations.*

### Winter
Ice across almost the entire map, with islands of solid ground. Inertia means you can't turn sharply — **1 cell of sliding** after every turn. Both the player snake and enemies slide equally. Knowing how to exploit ice physics against enemies is the core skill.
> *Reference: Ice biomes with sliding physics appear in virtually every* Zelda *title and* Pokémon *game. In Snake specifically, the closest analog is the ice-puzzle sections in* Snake Pass *(the 3D snake platformer by Sumo Digital).*

### Abyss
**Total darkness** except the player snake itself, which emits light. The portal doesn't open on a timer — it opens when you **kill every enemy on the map**. You don't know how many there are until you check the HUD. Maximum tension. Exclusive item: *Lantern*, expands the vision radius for 15 sec.
> *Reference:* Darkest Dungeon*'s Darkest Dungeon region uses both total darkness and "clear all threats" as win conditions.* Hollow Knight*'s Grimm Troupe content uses torch-based limited visibility similarly.*

---

## 6. Procedural Map Generation

Instead of empty grids with random walls, each floor generates the map using a **structural template** assigned randomly (or per biome):

### Connected Rooms
3–4 small rectangular rooms connected by 1–2-cell-wide corridors. Food spawns inside rooms (open space, easy to collect), enemies patrol corridors (danger zones). The player must decide when it's safe to cross.
> *Reference: Room-based dungeon generation is the backbone of* The Binding of Isaac *and* Enter the Gungeon*. The key design insight — safe areas connected by dangerous chokepoints — applies directly to a snake game where the chokepoint is the most lethal place to have a long tail.*

### Islands
Isolated land platforms surrounded by "void" (wall), connected by 1-cell bridges. Very restrictive movement. Food is easy to spot but hard to reach without calculating the bridge approach. Makes a long snake very difficult to manage.
> *Reference:* Celeste *'s room designs often isolate platforms this way. In Snake, committing to a bridge with a long tail — knowing you can't reverse — is the core tension.*

### Spiral
The entire map is a single corridor spiraling from the edges toward the center, where the portal appears. The snake must navigate the spiral, and as it grows, turns become harder to make without self-collision.
> *Reference: The spiral as a space-filling curve has an elegant relationship with Snake — a perfectly played game of Snake on a toroidal map traces a space-filling spiral. This template makes that implicit structure explicit.*

### Symmetric
The map is generated for one half and mirrored horizontally or vertically. Feels intentionally designed. Enemies spawn in symmetric positions, creating predictable patterns that become chaotic when they desynchronize.
> *Reference: Symmetric level design appears in* Pac-Man*'s original layout and many* Mega Man *stages — bilateral symmetry gives the player useful visual heuristics that the game can then exploit.*

### Organic (Cellular Automata)
A **cellular automata** algorithm (similar to cave generation) creates irregular, natural-looking shapes. The result doesn't look like a grid: there are coves, organic corridors, irregular chambers. Best suited for the Swamp or Abyss biomes.
> *Reference: Cellular automata cave generation is used in* Dwarf Fortress*,* Caves of Qud*, and countless procedural generators. The algorithm is well-documented — the key paper is Shaker et al.'s* "Procedural Content Generation in Games" *(2016), freely available online. For Snake it breaks the expected visual language of the game in a refreshing way.*

---

## 7. Timed Portal System

Potentially the highest-impact mechanic to add. It fundamentally changes the player's relationship with time and map space.

### Core Behavior
A visible countdown (30–60 sec depending on the floor) ticks down. When it reaches 0, a **portal opens** at a random map position. The player must reach it to advance. If they don't reach it within 10 more seconds, walls begin closing in from the corners (*squeeze*), reducing the space every 2 seconds until the player either enters or dies.
> *Reference:* Spelunky*'s ghost mechanic — wait too long on a floor and an unkillable pursuer spawns — is the most direct precedent. The closing zone in* PUBG *and* Fortnite *operates on the same "shrinking safe space" principle at a larger scale.*

### Signaling
The last 10 seconds before the portal opens, the HUD flashes and the ground shows a subtle energy animation at the spawn point (without revealing the exact location). Gives time to prepare without removing the surprise of the exact position.

### Dual Portal — Destination Choice
Instead of one portal, **2 differently colored portals** appear simultaneously:
- **Green portal** — Reward Biome: fewer enemies, better items, calm map. Ideal for recovery.
- **Red portal** — Risk Biome: difficult, aggressive enemies, but top-tier upgrades available.

Each portal displays an **icon of the destination biome** and a difficulty indicator.
> *Reference:* Slay the Spire *'s map screen is the benchmark for meaningful path choice — every node shows its type (elite, shop, rest, unknown) and the player builds a route based on their current state.* Hades *'s chamber previews offer a lighter version of the same agency.*

### Hidden Portal
If the player collects a specific rare item (*Void Key*), a **third secret portal** appears in gold, leading to a special floor: no enemies, full of items, but with a single boss at the center guarding the most powerful upgrade in the pool.
> *Reference:* Spelunky*'s "City of Gold" secret path requires finding and using specific items across multiple floors — the "pay a hidden cost earlier for a secret reward later" structure is one of the most compelling patterns in roguelite design.*

### Time as Resource
- Remaining time when entering the portal converts to **bonus score**.
- Killing enemies **adds time** to the countdown (+3 sec per enemy).
- Certain negative items (poison, fake food) **reduce time**.
- The *Clock* item completely pauses the countdown for 5 sec.
> *Reference:* Pac-Man Championship Edition *rewards speed with score multipliers using the same "time remaining = score" logic. In roguelites,* Hades *'s "Heat" system similarly converts self-imposed difficulty into score.*

### Transition Screen
On entering the portal, a brief screen (1–2 sec) shows the destination biome, an entry animation, and the stats from the completed floor (food eaten, enemies killed, time remaining → points earned). Gives rhythm to the session and makes each transition feel like a breath.
> *Reference: Floor summary screens appear in* Slay the Spire*,* Dead Cells*, and* Hades *— they serve as feedback and as a psychological rest point that makes runs feel structured rather than endless.*

---

## 8. Boss Floors

Every 3 floors there is a **Boss Floor** instead of a normal floor. No food, no portal: the objective is to eliminate one unique, oversized enemy.

### Giant Snake Boss
An enemy snake of **20–30 segments** occupying a large portion of the map. Very slow, but contact is instant death. Its length is the threat: you can easily get trapped in a corridor it's filling. Must be killed by head collision, but its head moves erratically.
> *Reference:* The Binding of Isaac*'s bosses are essentially this concept — a large entity that fills space and forces the player to use the entire arena.* Zelda*'s boss design philosophy of "kill only by targeting the weak point" applies directly.*

### Splitter Boss
A medium-length snake that, when it hits a wall or your tail, **splits into 2 smaller snakes**. Each split produces smaller snakes down to single-segment pieces. Killing each segment scores points. The map gradually fills with small, fast snakes.
> *Reference:* Geometry Wars*'s Geom enemies and* Centipede *use the same "killing it creates more enemies" design. The lesson is that winning fast is safer than killing slowly.*

### Mirror Boss
An exact copy of your snake in both length and speed, controlled by AI. Makes the same moves as you but in the opposite direction. Since it matches your size, if you've grown large it's very hard to navigate around.
> *Reference: The "you fight yourself" boss archetype is used in* Undertale*,* Hollow Knight *'s Pure Vessel, and* Fez*'s final boss. Applied to Snake, it directly punishes the player's own success — growing large becomes a liability.*

---

## 9. Meta-Progression Between Runs

### Starting Relics
At the start of each run, choose **1 of 3 random relics** from a pool. Relics don't accumulate during the run (unlike floor upgrades) — they define the run's identity from the very beginning:
- *Plasma Core*: start with 8 segments but movement speed is always 30% higher.
- *Void Shadow*: invisible to enemies for the first 5 seconds of each floor.
- *Symbiont*: every killed enemy permanently extends the snake by 1 extra segment.
> *Reference:* Hades *'s Boon system and* Slay the Spire*'s relic draft are the benchmark implementations. The key design principle: the relic should change *how* you play, not just *how well* you play.*

### Persistent Talent Tree
Points earned between runs (from score, floors completed, kills) spent on a permanent upgrade tree:
- Speed Branch: reduces the base move interval.
- Survival Branch: start every run with 1 shield.
- Hunt Branch: enemies give more points and more time.
> *Reference:* Dead Cells *'s cell-powered upgrade tree and* Rogue Legacy*'s gold-funded castle upgrades use this structure. The key design tension: each node must feel meaningful without making early runs feel pointlessly underpowered.*

### Bestiary
Each enemy has a **bestiary entry** that fills progressively. First kill: unlocks name and description. 10 kills: unlocks optimal counter-strategy. 50 kills: unlocks a **counter-item** specific to that enemy that appears in the item pool whenever it's present on the floor.
> *Reference:* Hades*'s Codex and* Monster Hunter*'s Hunter's Notes use progressive disclosure as a reward loop. The "unlock a counter-item" mechanic is closer to* Slay the Spire*'s relic-enemy synergies — knowledge earned through repetition becomes a tangible mechanical advantage.*

---

## 10. Run Quirks (Full-Run Modifiers)

On certain runs (randomly or by choice), the entire run has a global modifier that changes the identity of the game:

- **Speed Run**: the snake always moves at double speed. Food gives double points. High adrenaline, immediate mistakes.
- **Giant Run**: the snake visually occupies **2×2 cells** instead of 1×1. The whole map feels smaller and narrow corridors become lethal.
- **Pacifist Run**: no enemies. But food disappears if not collected within **8 seconds** of spawning. Pure collection pressure.
- **Chaos Run**: every 30 seconds a **random event fires**: earthquake (all walls shift), invasion (3 new enemies spawn at once), void (all lights off for 5 sec), resurgence (all dead enemies return at half length).
- **Echo Run**: instead of one snake, you control **two simultaneously** that move in mirror. If either one collides, both die.

> *Reference:* Hades*'s Pact of Punishment and* Dead Cells*'s Boss Stem Cells use the same "voluntary difficulty modifier" structure. The Echo Run dual-snake concept specifically echoes the rivalry dynamic in* Towerfall *and the co-op constraints in* A Way Out*. The Chaos Run's random events are directly inspired by* The Binding of Isaac*'s "Curse of the Unknown" and the event system in* Darkest Dungeon*.*

---

## 11. Suggested Floor Progression

A possible floor structure combining all of the above:

```
Floor 1–2   →  Void Biome          (rooms or symmetric template)
Floor 3     →  Biome Choice        (first fork — 2 options shown)
Floor 4–5   →  Chosen Biome        (maze or islands template)
Floor 6     →  Boss Floor #1       (Giant Snake)
Floor 7     →  Biome Choice        (second fork — new biomes unlocked)
Floor 8–9   →  Chosen Biome        (organic or spiral template)
Floor 10    →  Boss Floor #2       (Splitter or Mirror Boss)
Floor 11+   →  Fully random        (entire pool unlocked)
```

Each biome would have 2–3 map templates assigned to ensure visual variety across repeat visits to the same biome.

---

## Implementation Priority

Ordered by impact on game feel vs. implementation cost:

1. **Timed portal + squeeze** — minimal code, completely changes tension
2. **Accessibility mode + voice controls** — large UX value and broader reach with moderate implementation cost
3. **Dual portal with biome choice** — extends the portal and gives player agency
4. **Darkness and Ice as floor modifiers** — simple to implement, high gameplay impact
5. **Egg and Mirror Snake** — enemies that teach new patterns without being unfair
6. **Room-based map generation** — immediately improves the sense of exploration
7. **Core Biome** — feeding pressure via passive timer, trivial to add
8. **Boss Floor with Giant Snake** — climactic moment every 3 floors
9. **Starting Relics** — lightweight meta-progression, very high replayability gain

---

## 12. Tail as Health System

Instead of an abstract health counter, the snake's tail length **is** the health bar. The player starts with head + 3 segments — losing all segments means death.

Different collision types deal different amounts of damage, creating a threat hierarchy the player learns progressively:

- **Self-collision or wall hit**: instant death (unchanged from classic Snake)
- **Head-on with enemy head**: −2 segments
- **Touching an enemy body**: −1 segment
- **Bomber Snake explosion**: −3 segments based on proximity

The minimum survivable state is head + 1 segment — at that point any hit is lethal. This creates a permanent tension between growing (collecting food, gaining power) and shrinking (taking damage, losing both health and presence on the map).

The system also gives new meaning to existing upgrades. *Regeneration* becomes a healing mechanic. *Armor* (a potential upgrade) could reduce all collision damage by 1. Power-up segments on the tail (see Section 14) become doubly valuable — they are both an active ability and a health buffer.

> *Reference: Sonic the Hedgehog uses rings as a health buffer in exactly this way — collected rings absorb one hit, then scatter. The key difference here is that losing a segment is permanent unless healed, and the tail is always visible, making the health state immediately readable without a separate UI element. The "your power is also your health" unification also appears in Ikaruga's polarity system and Downwell's combo/health link.*

---

## 13. Elimination Run Type

Some floor transitions don't lead to a normal survival floor — instead they trigger an **Elimination Run**: a special floor type where the objective shifts from collecting food to killing a target number of enemies within a time limit.

The floor counter shows **"X / N enemies"** prominently. No food spawns. A new active ability becomes available: the snake can **spit venom** in its current direction.

### Venom Mechanic
- Fires a projectile in the current movement direction, traveling in a straight line until it hits a wall or an enemy
- On hit: removes X segments from the enemy (base: 2, upgradeable)
- Cooldown: 3–4 seconds, or charge-based (see Section 14)
- Upgrade path: venom leaves a **temporary poison trail** on the ground — enemies that cross it lose segments over time

### Failure Condition
If the timer expires before reaching the kill target, the run doesn't end — but a penalty is applied: reduced time on the next floor, or losing 1 tail segment. This keeps the stakes high without being punishing enough to feel unfair on a first encounter.

### Interaction with Tail-as-Health
In an elimination run, killing enemies is both necessary (to meet the objective) and dangerous (they can deal segment damage). Venom provides safe-range killing but has a cooldown. The tension is choosing when to engage in melee and when to spend a venom charge.

> *Reference: The Binding of Isaac's challenge rooms change the floor objective from "survive" to "kill everything under special conditions" — the same structural shift applies here. The venom projectile as an active ability echoes Crypt of the NecroDancer, where the snake has movement-based attacks in addition to its base locomotion.*

---

## 14. Power-up Segments on the Tail

When the snake collects a power-up, instead of applying the effect immediately, a **visually distinct segment** is appended to the tail. The segment has a different color and a small icon indicating the power-up type. The effect is stored, not yet active.

### How Segments Are Consumed
Two consumption modes depending on power-up type:

- **Defensive power-ups** (shield, ghost): consumed **automatically on the next hit** — the segment absorbs the damage and disappears, reverting to the background color
- **Offensive power-ups** (venom, dash): consumed **manually** on button press — the player chooses when to activate

This means the tail is simultaneously a health bar, a power-up inventory, and a visual state display — all readable at a glance without any separate UI.

### Ordering and Positioning
The power-up segment is inserted at the position in the tail where it was collected. If the snake has 6 segments when collecting a shield, the shield occupies segment 6. If the snake takes enough damage to reach segment 6, the shield triggers — but if the snake had grown to 10 segments first, the shield is deeper in the tail and safer. This creates a strategic layer around **when** to collect a power-up relative to current tail length.

With multiple power-ups, consumption order follows **LIFO** (last-in-first-out) for automatic triggers — the rearmost segment goes first. For manual activation, the player could cycle between available power-up segments and choose which to fire, at the cost of needing an extra input.

### Venom Charges from Tail
In Elimination Runs specifically, venom segments on the tail act as **charges** for the spit ability. Each venom segment = 1 projectile. When fired, the rearmost venom segment disappears. This connects Section 13 and Section 14 into a single coherent system: collecting venom power-ups during a floor loads up your attack capacity for the next elimination run.

> *Reference: Sonic the Hedgehog's ring system is the closest visual analog — collected items form a visible buffer that absorbs hits. The ordered inventory-as-body-segments concept is more directly inspired by Noita's wand system, where the order of spells in the wand determines firing behavior. The "stored but not yet active" power-up model also appears in Mega Man's weapon select and Celeste's dash crystal — the player carries potential energy that is spent deliberately.*

---

## 15. Accessibility Mode + Voice Commands

Add an optional **Accessibility Mode** with clear visual readability upgrades and alternative input pathways, including voice-driven movement.

### Accessibility Mode (UI + Gameplay Assist)
- High-contrast palette preset (stronger separation of snake, enemies, hazards, portal)
- Scalable text and HUD sizing presets (`normal`, `large`, `x-large`)
- Reduced visual noise option (lower background effects, fewer flashes)
- Optional slowdown assist (e.g. 10–20% slower global tick) for training/onboarding

### Voice Control MVP
- Listen for directional commands: **up, down, left, right**
- Optional commands: **pause, start**
- Debounce + cooldown so repeated recognition doesn't flood the input queue
- Fallback priority: keyboard/touch always overrides if used in same window

### Safety and UX Constraints
- Voice mode is opt-in from menu settings, never forced by default
- Local processing preference where possible; if browser speech APIs are used, show clear permission and privacy notice
- Real-time indicator of recognition state (`listening`, `heard`, `error`, `muted`)
- Graceful failure: if recognition drops, game remains fully playable via existing controls

### Why this matters now
This expands audience reach (motor accessibility, one-handed use, fatigue reduction), improves first-session onboarding, and creates a clear differentiation point for a mobile-first game concept.

> *Reference: Voice command accessibility patterns are used in iOS Voice Control and Xbox Adaptive Controller ecosystems. In games, command-driven input appears in titles like* Tom Clancy's EndWar *(voice strategy commands) and in accessibility overlays that map speech to discrete input actions.*
