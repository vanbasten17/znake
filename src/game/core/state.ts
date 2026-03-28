import { loadProfile } from './meta'
import type { GameState } from './types'
import type { PlayerProfile } from './types'

export const gameState: GameState = {
  run: 1,
  totalScore: 0,
  kills: 0,
  eliteKills: 0,
  floor: 1,
  currentRunSeed: null,
  runObjectiveOffset: 0,
  persistentUpgrades: [],
  persistentRewards: [],
  selectedRelicId: null,
  pendingFloorRoute: null,
  pendingEventChoiceConsequences: [],
  currentRunMapNodeId: null,
  pendingRunMapNodeId: null,
  currentRunMutators: [],
  currentChallengePresetId: 'standard',
  currentChallengePresetForcedMutatorId: null,
  activeContentPackId: 'base',
  lastReplaySnapshot: null,
  biomeRuleSummary: {
    activationEvents: 0,
    transitionEvents: 0,
    blockedEvents: 0,
    fallbackEvents: 0,
    activatedBiomeIds: [],
    activatedRuleIds: [],
  },
  eliteMinibossReadability: {
    phaseWindowEvents: 0,
    damageEvents: 0,
    failureReasonCounts: {
      late_react: 0,
      trapped_path: 0,
      telegraph_missed: 0,
      stacked_pressure: 0,
    },
  },
  bossEncounterSummary: {
    encountered: false,
    identityId: 'none',
    highestPhase: 'alpha',
    phaseWindowEvents: 0,
    damageEvents: 0,
    failureReasonCounts: {
      late_react: 0,
      trapped_path: 0,
      telegraph_missed: 0,
      stacked_pressure: 0,
    },
  },
  predatorPreyPacingSummary: {
    transitionEvents: 0,
    transitionsByPhase: {
      hunt: 0,
      escape: 0,
      reset: 0,
    },
    guardrailInterventions: 0,
    guardrailReasonCounts: {
      overlap_budget_exceeded: 0,
      cadence_gap_enforced: 0,
      phase_escape_window: 0,
    },
  },
  routeMasterySummary: {
    routeDecisions: 0,
    branchDecisions: 0,
    eliteChoices: 0,
    nonCombatChoices: 0,
    biomePivotChoices: 0,
    previewEliteSeen: 0,
  },
  runCleanPlaySummary: {
    completedObjectives: 0,
    cleanClears: 0,
    totalBonusScore: 0,
    awardedByKind: {
      survive: 0,
      collect_cores: 0,
      defeat_elite: 0,
      activate_terminals: 0,
    },
  },
}

export let playerProfile: PlayerProfile = loadProfile()

export const setPlayerProfile = (profile: PlayerProfile): void => {
  playerProfile = profile
}
