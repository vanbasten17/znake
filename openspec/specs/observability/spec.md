# observability Specification

## Purpose
TBD - created by archiving change znake-observability-events-v1. Update Purpose after archive.
## Requirements
### Requirement: Run lifecycle telemetry

The system SHALL emit a stable minimum set of gameplay observability events for every completed run and keep run-end context aligned with the death recap inputs.

#### Scenario: Run start emits mode context

- **WHEN** a run starts from menu or death-restart flow
- **THEN** telemetry includes `run_start` and `input_mode`

#### Scenario: Run end emits death and recap context

- **WHEN** player dies and run summary is generated
- **THEN** telemetry includes `death_reason`, `time_alive`, and `run_end` with aligned context
- **AND** run-end context can describe the selected-upgrade family leaning and notable run choices from existing run state when available
- **AND** recap support does not require a duplicate analytics-only event family

### Requirement: Progression telemetry

The system SHALL emit telemetry for newly added elite, item, and floor-template interactions.

#### Scenario: Elite lifecycle is tracked

- **WHEN** ambusher (or other elite kind) is spawned and defeated
- **THEN** telemetry emits `elite_spawned` and `elite_defeated` with elite kind and floor context

#### Scenario: Rift battery interaction is tracked

- **WHEN** rift battery is collected and suppression starts/ends
- **THEN** telemetry emits `item_collected` and `rift_suppressed` with duration/effect context

#### Scenario: Floor template selection is tracked

- **WHEN** a floor starts and template is resolved
- **THEN** telemetry emits `floor_template_selected`
- **AND** payload includes floor, selected template, and fallback usage

### Requirement: Clean-play bonus telemetry

The system SHALL emit stable telemetry describing clean-play eligibility, result, and payout for completed objectives.

#### Scenario: Objective completion emits clean-play result context

- **WHEN** an objective completion is resolved
- **THEN** telemetry includes a clean-play result field indicating whether eligibility was met
- **AND** payload includes objective kind and deterministic qualification context needed for tuning

#### Scenario: Bonus payout emits bounded payout context

- **WHEN** a clean-play bonus payout is applied
- **THEN** telemetry includes payout type, amount, and objective-window identifier
- **AND** the payload supports detecting duplicate or exploit-like payout patterns without requiring scene-specific logs

### Requirement: Mutator lifecycle telemetry

The system SHALL emit stable telemetry for mutator drafting, activation, rejection, and in-run impact.

#### Scenario: Draft and activation are tracked
- **WHEN** mutators are drafted and finalized for a run
- **THEN** telemetry emits mutator draft and activation events with run seed context and mutator identifiers
- **AND** payload shape remains stable for dashboard aggregation

#### Scenario: Rejections include guardrail reason
- **WHEN** a candidate mutator is rejected by compatibility or fairness validation
- **THEN** telemetry includes a deterministic rejection reason code
- **AND** emitted data can distinguish conflict rejection from pressure-budget rejection

### Requirement: Run-end mutator impact context

The system SHALL include mutator impact summary in run-end telemetry context for balancing analysis.

#### Scenario: Run end reports active mutator context
- **WHEN** a run ends
- **THEN** run-end telemetry includes active mutator identifiers and bounded impact summary fields
- **AND** summary fields align with configured mutator domains for comparison across runs

### Requirement: Elite and miniboss readability telemetry
The system SHALL emit stable encounter-level telemetry for elite/miniboss readability and counterplay windows.

#### Scenario: Telegraph and counterplay windows are tracked
- **WHEN** an elite/miniboss pattern action enters telegraph and then resolves
- **THEN** telemetry includes encounter identifier, pattern phase timings, and counterplay-window context
- **AND** payload shape remains stable for cross-run comparison dashboards

### Requirement: Elite and miniboss failure-reason attribution telemetry
The system SHALL emit deterministic reason-code context for elite/miniboss damage and defeat outcomes.

#### Scenario: Encounter damage includes bounded failure reason
- **WHEN** an elite/miniboss action damages the player
- **THEN** telemetry includes a bounded failure-reason code from a centralized reason taxonomy
- **AND** emitted context can distinguish timing misses from spatial trap or stacked-pressure outcomes

#### Scenario: Encounter defeat summary supports fairness tuning
- **WHEN** the run ends after at least one elite/miniboss encounter
- **THEN** run-end telemetry includes bounded elite/miniboss readability summary fields
- **AND** summary fields align with encounter-level reason-code taxonomy used during the run

### Requirement: Biome-rule activation lifecycle telemetry
The system SHALL emit stable telemetry for biome gameplay-rule activation and deactivation context.

#### Scenario: Activation emits biome rule context
- **WHEN** biome gameplay rules are activated at a deterministic progression boundary
- **THEN** telemetry includes run identifier, biome identifier, active biome-rule identifiers, and boundary context
- **AND** payload shape remains stable for cross-run balancing analysis

#### Scenario: Deactivation or transition emits lifecycle context
- **WHEN** active biome-rule set changes because of biome transition or deterministic fallback intervention
- **THEN** telemetry includes previous and next rule-set identifiers with transition reason
- **AND** emitted fields support attribution of pressure-rhythm shifts during run progression

### Requirement: Biome guardrail intervention telemetry
The system SHALL emit deterministic telemetry for biome compatibility rejections and fallback interventions.

#### Scenario: Compatibility rejection includes bounded reason code
- **WHEN** a biome rule candidate is rejected by compatibility validation
- **THEN** telemetry includes centralized guardrail reason code and blocked candidate identifier
- **AND** payload distinguishes objective conflict, mutator conflict, and body-economy recoverability conflict categories

#### Scenario: Fallback intervention includes applied action context
- **WHEN** deterministic fallback action is applied after compatibility validation
- **THEN** telemetry includes action type (downgrade, replace, defer) and resulting active rule identifiers
- **AND** payload enables analysis of guardrail frequency by biome and run depth

### Requirement: Run-end biome impact summary telemetry
The system SHALL include bounded biome-impact summary fields in run-end telemetry for balancing and fairness diagnostics.

#### Scenario: Run end reports biome impact context
- **WHEN** a run ends after one or more biome-rule activations
- **THEN** run-end telemetry includes active-biome coverage summary and bounded impact metrics tied to rule domains
- **AND** summary fields align with activation and guardrail telemetry taxonomies used during the run

### Requirement: Route-mastery decision telemetry

The system SHALL emit stable telemetry for committed route decisions with mastery context.

#### Scenario: Route decision event includes mastery capture context

- **WHEN** a route choice is committed
- **THEN** telemetry includes chosen room type, local preview context, and updated route-mastery counters
- **AND** payload shape remains stable for cross-run comparison

### Requirement: Run-end route-mastery summary telemetry

The system SHALL include bounded route-mastery summary fields in `run_end` payload.

#### Scenario: Run end reports route-mastery summary

- **WHEN** run summary telemetry is emitted
- **THEN** payload includes route-mastery totals and trend context fields
- **AND** fields align with route decision telemetry taxonomy

### Requirement: Predator-prey pacing lifecycle telemetry

The system SHALL emit stable telemetry for pacing phase transitions and guardrail interventions.

#### Scenario: Phase transitions emit bounded context

- **WHEN** pacing transitions between `hunt`, `escape`, and `reset`
- **THEN** telemetry includes prior phase, next phase, and bounded transition reason code
- **AND** payload shape remains stable for cross-run pacing analysis

#### Scenario: Guardrail interventions emit bounded intervention context

- **WHEN** anti-overlap guardrails defer or downgrade pressure actions
- **THEN** telemetry includes intervention action, reason code, and overlap context
- **AND** events distinguish strict-filter application from fallback resolution

### Requirement: Run-end pacing impact summary telemetry

The system SHALL include bounded pacing-impact summary fields in run-end context.

#### Scenario: Run end reports pacing summary fields

- **WHEN** a run ends after one or more pacing-phase transitions
- **THEN** run-end telemetry includes transition counts by phase and guardrail intervention totals
- **AND** summary fields align with pacing lifecycle taxonomy used during the run

### Requirement: Boss encounter readability telemetry
The system SHALL emit stable telemetry for boss identity and phase-readability windows during boss encounters.

#### Scenario: Boss phase/readability windows are tracked
- **WHEN** boss encounter readability state transitions across phase windows
- **THEN** telemetry includes encounter identity, phase transition context, and bounded counterplay-window fields
- **AND** payload shape remains stable for cross-run fairness analysis

### Requirement: Boss encounter failure attribution telemetry
The system SHALL emit deterministic boss damage/reason attribution and include bounded boss summary fields at run end.

#### Scenario: Boss damage events include bounded failure reason context
- **WHEN** a boss pressure event damages the player
- **THEN** telemetry includes bounded failure-reason code and active boss identity/phase context
- **AND** emitted reason codes align with centralized taxonomy

#### Scenario: Run-end includes bounded boss encounter summary fields
- **WHEN** a run ends after at least one boss encounter context was active
- **THEN** run-end telemetry includes bounded boss encounter summary metrics
- **AND** summary fields align with encounter-level reason mappings emitted during the run

### Requirement: Objective-reward loop milestone telemetry

The system SHALL emit stable, bounded telemetry for objective completion and reward selection milestones so objective-loop readability and decision outcomes can be analyzed consistently.

#### Scenario: Objective completion emits objective loop milestone event

- **WHEN** an objective completes and reward drafting begins
- **THEN** telemetry emits `objective_completed` with objective kind and objective-window identifier context
- **AND** payload includes bounded floor/score context for tuning comparisons

#### Scenario: Reward pick emits reward selection milestone event

- **WHEN** the player selects a reward option in the same objective window
- **THEN** telemetry emits `reward_picked` with selected reward identifier and pick index context
- **AND** payload includes bounded objective-window and clean-play resolution context

### Requirement: Production runtime error capture with release tagging
The system SHALL capture runtime errors in production-targeted builds with release metadata required for triage and rollback decisions.

#### Scenario: Unhandled runtime errors are captured with release context
- **WHEN** an unhandled runtime error occurs during active gameplay or shell runtime
- **THEN** observability records an error event with error name/category and bounded stack/context payload
- **AND** event payload includes `release_version`, `release_channel`, and `build_id`

#### Scenario: Error capture does not mutate gameplay simulation outcomes
- **WHEN** runtime error capture is active
- **THEN** capture behavior is non-blocking and best-effort
- **AND** deterministic simulation resolution order remains unchanged

### Requirement: Minimum release KPI dashboard contract
The system SHALL define a minimum KPI contract that can be computed from existing gameplay telemetry for release-readiness review.

#### Scenario: KPI contract exposes bounded release health metrics
- **WHEN** a release candidate dashboard snapshot is generated
- **THEN** it includes at minimum run starts, run completions, crash/error count, and top run-end failure reasons
- **AND** metrics are attributable by the release metadata tuple

#### Scenario: KPI contract includes level progression failure insight
- **WHEN** release telemetry is summarized for tuning review
- **THEN** dashboard data includes bounded per-level or per-floor fail concentration fields where available from existing telemetry
- **AND** missing-source fields are explicitly marked as unavailable rather than inferred silently

### Requirement: Per-level fail-point depth telemetry
The system SHALL emit bounded deterministic fail-point telemetry fields for each run level to support depth-balance tuning.

#### Scenario: Fail events include level and depth-band context
- **WHEN** a run-ending or major fail-point event is emitted
- **THEN** payload includes floor/level index, depth-band identifier, and bounded fail-reason context
- **AND** fields are stable for cross-run aggregation and comparison

#### Scenario: Fail telemetry supports spike and flat-segment diagnostics
- **WHEN** fail-point telemetry is aggregated for tuning review
- **THEN** data can identify depth bands with concentrated spike deaths and low-pressure plateaus
- **AND** missing dimensions are explicitly marked unavailable rather than inferred

### Requirement: Depth-balance tuning outcome telemetry
The system SHALL emit bounded telemetry describing resolved depth-tuning outcomes for enemy composition and item usefulness.

#### Scenario: Composition and item outcome fields are emitted
- **WHEN** room/floor setup resolves depth-aware enemy and item tuning
- **THEN** telemetry includes compact outcome fields for selected role-composition profile and item usefulness profile
- **AND** payload values align with centralized depth-balance taxonomy

#### Scenario: Outcome telemetry remains deterministic and non-invasive
- **WHEN** depth-balance outcome telemetry is emitted
- **THEN** emission is best-effort and non-blocking
- **AND** telemetry collection does not alter deterministic gameplay resolution

### Requirement: Challenge preset lifecycle telemetry context

The system SHALL include active challenge preset context in run lifecycle telemetry payloads.

#### Scenario: Run start includes preset context
- **WHEN** a run starts from menu or death restart
- **THEN** telemetry payload includes challenge preset identifier and preset mutator identifier when present
- **AND** payload shape remains stable for dashboard aggregation

#### Scenario: Run end includes preset context for analysis
- **WHEN** run-end telemetry is emitted
- **THEN** payload includes active challenge preset identifier and preset mutator identifier context
- **AND** fields align with run-start preset context naming

### Requirement: Recap trend reason taxonomy compatibility

The system SHALL keep death-reason trend computation compatible with existing bounded death reason taxonomy values.

#### Scenario: Trend aggregator consumes existing reason values
- **WHEN** trend insight computes counts from recent run summaries
- **THEN** reason categories map directly to existing death reason taxonomy values
- **AND** unknown values degrade safely to fallback copy without failing recap render

