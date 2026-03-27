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
  currentRunMapNodeId: null,
  pendingRunMapNodeId: null,
  currentRunMutators: [],
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
