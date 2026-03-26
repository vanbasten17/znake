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
}

export let playerProfile: PlayerProfile = loadProfile()

export const setPlayerProfile = (profile: PlayerProfile): void => {
  playerProfile = profile
}
