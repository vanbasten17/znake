# Dev Balancing Cookbook

## Goal

Provide a fast, repeatable loop for balancing Znake using deterministic seeds and existing telemetry.

## Tight Loop (Daily)

1. Pick a focus signal (example: early-floor deaths, route over-dominance, boss fairness).
2. Run fixed-seed smoke and one focused manual pass.
3. Review relevant telemetry counters/events.
4. Apply a single bounded tuning change in central balance config.
5. Re-run `pnpm check`, `pnpm smoke`, and fixed-seed manual verification.
6. Record outcome and either keep, reduce, or revert.

## Signal -> Tuning Map

### 1. Early runs feel flat or repetitive

- Signals:
  - Low role diversity in early floors.
  - Similar enemy-role patterns across repeated seeds.
- Tune:
  - `BALANCE.depthBalance.roleCompositionDirectorById.early`
  - `windowSizeSpawns`, per-window `weightMultipliers`, optional `maxActiveByRole`.
- Guardrails:
  - Keep readable role windows; avoid burst-role clustering without counterplay.

### 2. Route choice lacks meaningful contrast

- Signals:
  - Same route chosen regardless of context.
  - Route package telemetry shows one package dominating.
- Tune:
  - `BALANCE.portal.routeChoice.{safer,riskier}`
  - `enemyDelta`, `wallDelta`, `enemyIntervalMultiplier`, `scoreBonus`.
- Guardrails:
  - Preserve explicit tradeoff identity (safer != riskier in pressure profile).

### 3. Event choices feel forgettable

- Signals:
  - Delayed consequence scheduling rarely triggers or has no impact.
  - Event-choice picks do not alter medium-term planning.
- Tune:
  - `BALANCE.eventChoices.consequenceMemory`
  - `maxPending`, per-definition delay windows and bounded effects.
- Guardrails:
  - Keep delayed penalties/rewards bounded; avoid unavoidable loss states.

### 4. Upgrade drafts converge too quickly

- Signals:
  - Repeated family/upgrade patterns over many runs.
  - One family dominates pick rate with minimal downside.
- Tune:
  - `UPGRADE_POOL` metadata/effects and family-level pivot variety.
- Guardrails:
  - Every pick keeps explicit gameplay, tradeoff, and synergy framing.

### 5. Boss floors feel either trivial or unfair

- Signals:
  - Boss rage transitions are consistently too early/late.
  - Support pickup cadence creates long dead windows.
- Tune:
  - `BALANCE.biome.boss.phaseRemixById`
  - `rageHealthThreshold`, `supportShieldRespawnMs`, rotation order.
- Guardrails:
  - Keep reaction windows readable and deterministic across equal seeds.

## Validation Checklist

- `pnpm check`
- `pnpm smoke`
- Fixed-seed manual pass for the tuned system
- Confirm no new dominant strategy appears across 3-5 seeds
- Confirm readability/fairness still pass the game-feel checklist:
  - responsiveness
  - readability
  - fairness
  - feedback
  - juice

## Patch Sizing Rules

- Prefer one variable cluster per patch.
- Avoid mixing unrelated systems in one tuning commit.
- If uncertain, reduce change magnitude by 30-50% and retest.

## Rollback Rules

- Roll back immediately if a change:
  - increases unavoidable deaths,
  - removes meaningful route/build diversity,
  - or creates deterministic degenerate loops.

## Notes Template

- Date:
- Focus area:
- Changed knobs:
- Before signals:
- After signals:
- Decision (keep/reduce/revert):
- Next hypothesis:
