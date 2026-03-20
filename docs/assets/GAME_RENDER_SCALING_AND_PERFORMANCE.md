# Escala visual, resolució de marcadors i rendiment (Znake)

Aquest document recull els **canvis importants** al voltant de:

- **Resolució en pantalla** (mida de cel·la, canvas del joc).
- **Resolució dels marcadors** (poma, portals, objectes del glossari, etc.).
- **Millores de rendiment** al bucle de render i al HUD.

La **jugabilitat** segueix en **coordenades de graella** (`BASE_COLS` × `BASE_ROWS`); només canvia com es **pinta** a píxels.

---

## 1. Mida de cel·la i canvas (`CELL`)

| Concepte | Fitxer | Notes |
|----------|--------|--------|
| Píxels de pantalla per cel·la de graella | `src/game/core/constants.ts` → `CELL` | Un sol “palanca”: puja `CELL` per més detall a pantalla (canvas més gran). |
| Mida del canvas Phaser | Derivat: `WIDTH = BASE_COLS * CELL`, `HEIGHT = BASE_ROWS * CELL` | Més `CELL` → més píxels per frame (**més càrrega de fill-rate**). |
| Offsets decoratius (vores, HUD, rift, ulls…) | `cellPx(n) = (n * CELL) / 20` al mateix `constants.ts` | Els valors originals estaven pensats per `CELL = 20`; `cellPx` manté les **proporcions** quan canvies `CELL`. |

**Regla:** si vols **més FPS**, abaixa `CELL` abans que tota la resta; si vols **més nitidesa** a pantalla, puja `CELL` sabent el cost en píxels.

---

## 2. Marcadors in-game i export PNG (`MARKER_EXPORT_*`)

| Concepte | Fitxer | Notes |
|----------|--------|--------|
| Espai lògic de dibuix (una “cel·la” d’art) | `markerExportSpec.ts` → `MARKER_EXPORT_LOGICAL_FRAME` (20) | No té per què coincidir amb `CELL`; és l’espai vectorial abans del scale. |
| Escala entera cap a bitmap | `MARKER_EXPORT_SCALE_DEFAULT` | Ex.: 2 → frame **40×40** px. Més escala = **més detall** abans del `setDisplaySize(CELL)`; també més **VRAM** (× tots els tons). |
| Textures in-game | `markerHiRes.ts` | Mateixa resolució que `pnpm generate:sprites`; `FilterMode.NEAREST`. |
| Poma (`core`) | `markerRenderer.ts` | Traç fi de contorn sobre el cos vermell per llegir millor la silueta quan es redueix amb NEAREST. |

Després de canviar `MARKER_EXPORT_SCALE_DEFAULT` o el dibuix:

```bash
pnpm generate:sprites
pnpm validate:markers
```

### Eina `generate-sprites.ts` (límit d’escala)

A `tools/generate-sprites.ts` hi ha un sostre **`EXPORT_SCALE_MAX`** (p. ex. 48) per no generar PNGs massa grans per error.

**Important:** abans hi havia un **`Math.min(..., 16)`** que **capava l’escala a 16** encara que al spec poséssis més (p. ex. 20). Això feia que el manifest i el joc **no coincidissin** amb els PNGs generats. Ara el sostre és explícit i ha de ser **≥** `MARKER_EXPORT_SCALE_DEFAULT`.

---

## 3. Millores de rendiment (implementades)

### 3.1 HUD DOM — no escriure si el text no canvia

| Fitxer | Detall |
|--------|--------|
| `src/game/systems/domHud.ts` | `setRunStatusText` només actualitza el DOM si el string és **diferent** de l’anterior (`lastRunStatusText`). Evita `textContent` i possibles reflows **cada frame**. |
| | En passar a mode menú (`setUiShell`), es buida el text i es reseteja la memòria cau. |

### 3.2 Foscor — menys `fillRect` per frame

| Fitxer | Detall |
|--------|--------|
| `src/game/scenes/GameScene.ts` → `drawDarknessOverlay` | En lloc d’**una cel·la = un `fillRect`**, es fusionen **segments horitzontals** consecutius amb la mateixa alpha per fila. Molts menys trucades de dibuix que un bucle 20×27. |

### 3.3 Arena i gel — capa estàtica

| Fitxer | Detall |
|--------|--------|
| `GameScene` → `terrainGraphics` | Gel i arena es dibuixen a una **`Graphics`** separada i es **regeneren un cop** al crear la planta (`redrawTerrainGraphics()` després de parets/fons), **no** a cada `drawFrame()`. |
| | Si en el futur els sets `iceTiles` / `sandTiles` canvien **durant** la partida, caldrà tornar a cridar `redrawTerrainGraphics()` en aquell moment. |

### 3.4 Configuració Phaser

| Fitxer | Detall |
|--------|--------|
| `src/game/phaser.ts` | `render.roundPixels: true` — menys treball amb subpíxels en sprites/gràfics. |
| | `render.powerPreference: 'high-performance'` — preferència GPU (on el navegador la respecta). |

---

## 4. Compromisos ràpids (resum)

| Vols… | Acció típica |
|--------|----------------|
| Més FPS | Reduir `CELL`; després, si cal, reduir `MARKER_EXPORT_SCALE_DEFAULT` i regenerar sprites. |
| Marcadors més fins | Augmentar `MARKER_EXPORT_SCALE_DEFAULT` (+ regenerar); valorar `CELL` si vols que ocupin més píxels a pantalla. |
| Menys càrrega amb foscor | Ja optimitzat amb `drawDarknessOverlay`; amb molta arena/gel sense foscor, la capa `terrainGraphics` evita el cost per frame. |

---

## 5. Documents relacionats

- [MARKER_PIXEL_PIPELINE.md](./MARKER_PIXEL_PIPELINE.md) — pipeline detallat dels marcadors, checklist i regles antialiàsing.
- [SPRITE_GENERATION_REFERENCE.md](./SPRITE_GENERATION_REFERENCE.md) — generació d’assets i comandes.
- [`assets/sprites/generated/README.md`](../../assets/sprites/generated/README.md) — sortida de `pnpm generate:sprites`.
