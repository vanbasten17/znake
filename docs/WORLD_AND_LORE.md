# Znake — world, tone & concepts (reader’s guide)

This note **does not** replace a formal story bible. It synthesizes what the **current game** implies through UI copy, system names, and `balance` data—so designers and contributors share the same mental model.

---

## Genre & pitch

- **Core:** classic **Snake** on a grid (precision routing, tail management).
- **Frame:** **roguelite** runs—floors escalate, modifiers stack, you die and come back with **meta progression** (currency, talents, relic draft).
- **Feel:** **neon / void / arcade**—short, punchy HUD strings; hazards named like systems (“squeeze”, “rift”, “core pressure”) rather than fantasy proper nouns everywhere.

---

## Setting (implied)

The run takes place in the **VOID DEPTHS** (`BALANCE.biome` / i18n): an abstract hostile space where:

- The arena is **not stable**—**portals** are exits, but the **border closes** (“squeeze”) if you wait too long.
- **Ambient danger** persists: a **rift** ticks in the background; **darkness**, **ice**, and **sand** appear as **floor modifiers** rather than separate “levels” in a map screen.
- Death is framed as **the void claiming you** (death screen copy)—the run ends; you are not told *who* you are, only that survival is measured in **score**, **floor**, and **kills**.

So the fiction is **systems-first cosmic horror–lite**: you are a thing moving through hostile geometry, managing pressure clocks.

---

## Core fantasy verbs (what the player *does*)

| Player fantasy | Systems that express it |
|----------------|-------------------------|
| **Eat / grow / score** | Food, score bursts, magnet, hunt multipliers |
| **Survive clocks** | Portal countdown, squeeze inset, rift tick, core pressure interval |
| **Mitigate ambient threats** | Coolant charges, rift battery (suppress rift), portal beacon (accelerate portal) |
| **Fight back** | Venom shots, shields, slow field, ghost pass |
| **Choose risk** | Safer vs riskier portal routes (enemy/wall deltas + score bonus) |
| **Climb** | Floors, boss rhythm, rotating objectives (portal / score / kills) |

---

## Key concepts (lore-as-interface)

- **The Void** — omnipresent framing; failure = claimed by the void.
- **Portal** — timed way out; ties runs to **routing** and **urgency**.
- **Squeeze** — the world **shrinks**; literal pressure on decision space.
- **Rift** — ambient “wrongness” / hazard layer; can be **jammed** or **suppressed** (rift battery).
- **Core pressure** — internal **timeout** that **eats length** if unchecked; **coolant** absorbs ticks—language suggests a reactor / organism under strain.
- **Enemies** — not “monsters in a dungeon” so much as **hostile snakes** and elites (stalker, ambusher, egg, mirror, boss)—a **predator ecology** inside the same rules as you.

---

## Meta progression (why you rerun)

- **Currency** from runs feeds a **talent shop** (speed, survival, hunt themes).
- **Relic draft** before runs (Plasma Core, Void Shadow, Symbiont) reads like **loadout contracts**—short descriptions, big mechanical hooks.
- **Goals** (e.g. reach floor 5, elite kills) ground long-term direction without a story campaign.

---

## Art & readability (ties to “void” tone)

Procedural **glossary markers** use **semantic roles** (benefit / hazard / terrain / enemy) with **high-contrast neon** tokens—readable at a glance, consistent with arcade UI rather than painterly realism.

See: `src/game/render/markerSemantics.ts`, `docs/assets/MARKER_PIXEL_PIPELINE.md`.

---

## Relationship to design brainstorming

`docs/BRAINSTORMING.md` is **speculative**—many ideas are references and *not* implemented. Treat this file as **“what the shipped systems currently say”**; treat brainstorming as **“what could be true later.”**

---

## How to evolve this document

When you add a **new biome name**, **relic**, or **floor objective**, update:

1. `src/game/systems/i18n.ts` (player-facing strings)
2. This file with **one paragraph** on what the *fantasy* is (even if mechanics are the priority)

That keeps lore **cheap to maintain** and **honest** to what players actually read.
