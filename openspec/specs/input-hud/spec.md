# input-hud

Input handling (touch, keyboard, DOM controls) and DOM HUD display.

## Purpose

Define how player input is captured across platforms and how HUD/UI feedback is presented.
## Requirements
### Requirement: Virtual input bridge

The system SHALL expose a virtualInput object (dir, start, pause) on window for DOM and touch to communicate with Phaser scenes.

#### Scenario: Virtual input is globally available

- **WHEN** app loads
- **THEN** window.virtualInput exists with dir: null, start: false, pause: false

#### Scenario: Direction is consumed per frame

- **WHEN** GameScene update reads window.virtualInput.dir
- **THEN** it sets dir to null after applying to prevent repeat

#### Scenario: Swipe direction is exposed for touch steering

- **WHEN** touch swipe input is used on gameplay area
- **THEN** virtualInput includes absolute direction intent (`left`/`right`/`up`/`down`)
- **AND** GameScene can consume and clear it per frame

### Requirement: Swipe input

The system SHALL map touch swipe gestures to directional input (up/down/left/right).

#### Scenario: Sufficient swipe sets direction

- **WHEN** user swipes with distance >= 15px
- **THEN** virtualInput.dir is set to dominant axis direction

#### Scenario: Short tap is ignored

- **WHEN** touch distance < 15px
- **THEN** virtualInput.dir remains null

#### Scenario: Swipe direction is disabled in touch quadrant mode

- **WHEN** touch mode uses quadrant tap controls
- **THEN** swipe gestures do not enqueue direction changes

### Requirement: D-pad buttons

The system SHALL map DOM d-pad buttons (btn-up, btn-down, btn-left, btn-right) to virtualInput.dir.

#### Scenario: Horizontal swipe emits absolute horizontal direction

- **WHEN** user performs a horizontal-dominant swipe on gameplay area
- **THEN** swipe right emits `dir=right`
- **AND** swipe left emits `dir=left`

#### Scenario: Vertical swipe emits absolute direction

- **WHEN** user performs a vertical-dominant swipe on gameplay area
- **THEN** swipe up emits `dir=up`
- **AND** swipe down emits `dir=down`

#### Scenario: Short swipe is ignored

- **WHEN** swipe is below minimum distance
- **THEN** no movement intent is emitted

### Requirement: Action buttons

The system SHALL expose localized labels and aria text for Start/Pause and movement controls.

#### Scenario: Audio feedback unlocks on first user gesture

- **WHEN** player performs the first valid interaction (touch, pointer, mouse, or key)
- **THEN** feedback audio context attempts to resume
- **AND** subsequent feedback tones are playable in mobile browsers

### Requirement: HUD display

The system SHALL keep HUD controls readable and reachable on mobile screen-edge devices with a portrait-first run shell.

#### Scenario: Bottom UI avoids home indicator overlap

- **WHEN** app runs on mobile devices with bottom safe-area inset
- **THEN** controls and hint bar apply additional bottom padding from safe-area env values

#### Scenario: Run shell uses 2/3 gameplay and 1/3 controls on touch devices

- **WHEN** control mode is touch and scene chrome is `run`
- **THEN** the run layout allocates roughly two-thirds of available vertical space to gameplay container
- **AND** allocates roughly one-third to control container
- **AND** keeps hint bar readable below controls

#### Scenario: Keyboard mode keeps gameplay priority

- **WHEN** control mode is keyboard
- **THEN** touch controls are hidden
- **AND** gameplay area expands instead of reserving control space

### Requirement: Active objective readability

The system SHALL show the active room objective in the run HUD with enough clarity for the player to understand the current goal at a glance and SHALL prioritize objective-complete/reward-ready messaging over secondary cue text during reward-decision windows.

#### Scenario: HUD shows active objective summary

- **WHEN** a run segment is active
- **THEN** the HUD shows the current objective label
- **AND** the label reflects the configured target for that objective

#### Scenario: HUD updates objective progress

- **WHEN** objective progress changes during the segment
- **THEN** the HUD updates the displayed progress or remaining amount
- **AND** the change is visible without opening a separate menu

#### Scenario: Reward-pending state prioritizes objective-complete readability

- **WHEN** objective completion transitions into reward-pending state
- **THEN** objective HUD messaging prioritizes objective-complete/reward-ready context
- **AND** secondary tactical cue concatenation does not obscure the reward-ready call-to-action

### Requirement: Reward choice presentation

The system SHALL present a minimal reward-choice prompt after objective completion with clear contrast and decision framing.

#### Scenario: Reward prompt appears on completion

- **WHEN** objective completion triggers a reward draft
- **THEN** the player is shown a reward-choice overlay or equivalent prompt
- **AND** the prompt displays multiple reward options

#### Scenario: Reward prompt explains tradeoffs

- **WHEN** reward options are presented
- **THEN** each option shows both its upside and downside in player-facing copy
- **AND** the player can choose one option with existing keyboard or touch interaction patterns

#### Scenario: Reward prompt supports fast upside/downside scanning

- **WHEN** the reward overlay is visible
- **THEN** option rows provide explicit upside/downside framing labels or equivalent readable structure
- **AND** visual contrast between option container and text remains legible across supported accessibility visual presets

### Requirement: Adaptive control-mode selection

The system SHALL derive a control mode at runtime and apply UI behavior accordingly.

#### Scenario: Touch controls mode is selected

- **WHEN** runtime context indicates touch-first input and non-large screen
- **THEN** the system enables touch mode and exposes touch HUD controls

#### Scenario: Keyboard controls mode is selected

- **WHEN** runtime context does not match touch-first small-screen conditions
- **THEN** the system enables keyboard mode and hides touch HUD controls

### Requirement: Mode-aware hint messaging

The system SHALL present hint text consistent with active control mode and selected locale.

#### Scenario: Hints follow locale

- **WHEN** locale is English or Catalan
- **THEN** move/start/restart/upgrade hints are rendered in that locale

### Requirement: Runtime shell ID compatibility for input and HUD

The system SHALL keep input and HUD bindings compatible with runtime-mounted shell markup.

#### Scenario: Input controls bind after runtime mount

- **WHEN** input setup runs
- **THEN** directional and action controls can be resolved by their existing button IDs
- **AND** touch/click behavior remains unchanged

#### Scenario: HUD updates remain resilient to import timing

- **WHEN** HUD helpers are imported before shell markup exists
- **THEN** the module does not throw at import time
- **AND** HUD methods resolve required nodes when invoked after shell mount

### Requirement: Transition-safe virtual input state

The system SHALL expose a reset operation for virtual input state and use it during scene handoff.

#### Scenario: Reset clears pending commands

- **WHEN** transition reset is invoked
- **THEN** `virtualInput.dir` becomes `null`
- **AND** `virtualInput.start` and `virtualInput.pause` become `false`

#### Scenario: Reset is used before scene start

- **WHEN** a scene transition is initiated through shared flow helper
- **THEN** virtual input reset is executed before destination scene starts
- **AND** stale touch/swipe/button commands are not replayed in the new scene

### Requirement: Accessibility visual preference controls

The system SHALL keep accessibility visual presets implemented and persistable while allowing dark-launch rollout.

#### Scenario: Accessibility visual preferences persist

- **WHEN** player enables or disables high contrast, large text, or reduced effects
- **THEN** preferences are stored locally
- **AND** preferences are restored on the next app launch

#### Scenario: Accessibility preferences support dark launch

- **WHEN** high-contrast/large-text/reduced-effects are dark-launched
- **THEN** menu UI does not expose those toggles
- **AND** runtime remains stable with those features forced off

### Requirement: Voice command to virtual input mapping

The system SHALL support optional voice commands that map to existing virtual input actions with explicit UX state and command feedback.

#### Scenario: Directional voice commands enqueue movement

- **WHEN** voice input is enabled and recognized command is `up`, `down`, `left`, or `right`
- **THEN** `window.virtualInput.dir` is set to the corresponding direction

#### Scenario: Utility voice commands map to action buttons

- **WHEN** voice input is enabled and recognized command is `pause` or `start`
- **THEN** corresponding `window.virtualInput.pause` or `window.virtualInput.start` flag is set

#### Scenario: Unsupported speech API degrades gracefully

- **WHEN** browser speech recognition is unavailable
- **THEN** voice mode is shown as unavailable
- **AND** no runtime errors are thrown

#### Scenario: Voice runtime status is explicit for UX

- **WHEN** voice input transitions between unavailable, denied, disabled, and active listening states
- **THEN** a stable status value is exposed for UI rendering
- **AND** keyboard/touch/swipe behavior remains unchanged

#### Scenario: Voice command acceptance/rejection emits short feedback

- **WHEN** transcript is processed
- **THEN** recognized commands produce short accepted feedback
- **AND** unrecognized non-empty transcripts produce short rejected feedback

### Requirement: Ability trigger input for elimination combat

The system SHALL expose an ability trigger through virtual input for combat actions.

#### Scenario: Keyboard trigger sets ability flag

- **WHEN** player presses the configured venom key during run
- **THEN** virtual input exposes one-shot ability intent for scene consumption

#### Scenario: Touch double-tap triggers ability

- **WHEN** player double-taps gameplay area in touch mode
- **THEN** virtual input exposes one-shot ability intent for scene consumption

### Requirement: HUD support for meaningful moment emphasis

The system SHALL support short-lived HUD emphasis for major success/readability moments without introducing a broader HUD redesign.

#### Scenario: Reward-ready state receives explicit short emphasis

- **WHEN** a room objective completes and reward selection becomes available
- **THEN** the active HUD or hint presentation briefly emphasizes that success state
- **AND** the emphasis clears or settles into the normal reward-prompt state automatically

#### Scenario: Pickup feedback does not replace core hint readability

- **WHEN** a pickup emphasis message is shown
- **THEN** it remains brief and compatible with existing move/reward hint behavior
- **AND** control guidance returns after the short feedback window ends

### Requirement: Upcoming route choice readability

The system SHALL present the next reachable room choices clearly enough that the player can make an informed route decision at a glance.

#### Scenario: Route choice shows room type and branch identity

- **WHEN** a route-decision prompt is shown
- **THEN** each reachable option displays its room type
- **AND** the player can distinguish one branch from another without opening a separate map screen

#### Scenario: Route choice stays lightweight on mobile

- **WHEN** route choices are presented on portrait touch layouts
- **THEN** the prompt fits within the existing run HUD or overlay composition without obscuring critical game-state context
- **AND** keyboard and touch interaction patterns remain consistent with existing selection flows

### Requirement: Current route context visibility

The system SHALL expose enough current path context in the run HUD to support planning without overwhelming the player.

#### Scenario: Current room context is visible during the run

- **WHEN** a room is active
- **THEN** the HUD can show the current room type or immediate route context
- **AND** that context remains secondary to the active room objective display

#### Scenario: Preview horizon does not become full-map clutter

- **WHEN** route preview data is rendered
- **THEN** the HUD presents only the bounded set of relevant upcoming choices
- **AND** does not require a full-screen permanent run-map view in v1

### Requirement: Body spend affordance readability
The system SHALL communicate body spend availability and blocked reasons for in-run sinks without moving gameplay rules into HUD code.

#### Scenario: HUD shows body pulse availability state
- **WHEN** gameplay runtime provides body pulse spend eligibility and cooldown state
- **THEN** HUD presents an availability indicator for body pulse
- **AND** indicator updates as eligibility changes

#### Scenario: HUD shows deterministic blocked reasons
- **WHEN** a body spend request is rejected due to spend floor, cooldown, or usage limit
- **THEN** HUD presents short blocked-reason feedback mapped from runtime outcome
- **AND** blocked messaging does not compute gameplay rules locally

### Requirement: Reward overclock interaction in reward prompt
The system SHALL provide reward-overclock interaction cues inside reward selection flow.

#### Scenario: Reward prompt exposes overclock affordance
- **WHEN** reward selection is active and reward overclock is still available for the window
- **THEN** reward prompt shows overclock affordance and segment cost
- **AND** interaction uses existing keyboard/touch patterns

#### Scenario: Reward prompt reflects spent overclock state
- **WHEN** reward overclock has been used for the active reward window
- **THEN** reward prompt clearly indicates overclock is no longer available
- **AND** player can continue normal reward selection without ambiguity

### Requirement: Body-terrain tactical cue readability

The system SHALL surface a concise body-terrain tactical cue in run HUD/status composition.

#### Scenario: HUD shows compact terrain cue during active gameplay

- **WHEN** run gameplay is active in combat-oriented segments
- **THEN** HUD/status includes concise body-terrain context (safe-pocket and/or trap-risk readability)
- **AND** cue remains readable without crowding objective-critical text

### Requirement: HUD semantic pulse mapping consistency
The system SHALL map HUD pulse/readability states to shared semantic token families consistently.

#### Scenario: Pulse states use semantic families
- **WHEN** HUD pulse kinds (`danger`, `pickup`, `reward`) are shown
- **THEN** each state resolves to its corresponding semantic token family
- **AND** objective/run status cues remain readable without layout changes

### Requirement: Input-confidence cues in hint channel

The system SHALL expose concise input-confidence cues in the existing hint channel during active movement.

#### Scenario: Hint shows buffered input and cooldown readiness
- **WHEN** movement hint is displayed during active gameplay
- **THEN** hint includes buffered-input count and active ability-cooldown cue when relevant
- **AND** cue fragments remain bounded and optional

### Requirement: Localized challenge-share prompt labels

The system SHALL provide localized menu prompt labels for challenge-share copy and import interactions with deterministic fallback labels.

#### Scenario: Copy prompt label uses localized key

- **WHEN** menu flow requests challenge-share copy prompt text
- **THEN** prompt title resolves from localization resources for the active language
- **AND** fallback label is provided when localization lookup is missing

#### Scenario: Paste prompt label uses localized key

- **WHEN** menu flow requests challenge-share import prompt text
- **THEN** prompt title resolves from localization resources for the active language
- **AND** fallback label is provided when localization lookup is missing

### Requirement: Voice status copy exposes consistent availability states

The system SHALL enforce this contract as part of the znake-voice-input-status-copy-contract-v1 scope.

#### Scenario: Contract is applied
- **WHEN** the relevant runtime or UI path executes
- **THEN** the defined contract behavior is applied consistently
- **AND** deterministic simulation behavior remains unchanged.

### Requirement: HUD pulse timers clear previous timeout before restart

The system SHALL enforce this contract as part of the znake-dom-hud-pulse-timeout-contract-v1 scope.

#### Scenario: Contract is applied
- **WHEN** the relevant runtime or UI path executes
- **THEN** the defined contract behavior is applied consistently
- **AND** deterministic simulation behavior remains unchanged.



## ADDED Requirements

### Requirement: Touch gesture interpretation is modular and ambiguity-aware

The system SHALL isolate touch gesture interpretation from DOM wiring and reduce ambiguous diagonal turns.

#### Scenario: Input wiring uses modular interpreter
- **WHEN** touch input is captured in run mode
- **THEN** directional intent is resolved through a dedicated interpreter helper
- **AND** the virtual input contract remains compatible with existing gameplay systems.

#### Scenario: Ambiguous diagonal swipe does not force a turn
- **WHEN** a swipe is below the configured axis-dominance ratio
- **THEN** no directional turn is committed
- **AND** player control remains stable and predictable.
