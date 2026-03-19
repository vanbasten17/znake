import { loadProfile } from './meta'
import { rollRunObjectiveOffset } from './objectives'
import type { GameState } from './types'
import type { PlayerProfile } from './types'

export const gameState: GameState = {
  run: 1,
  totalScore: 0,
  kills: 0,
  eliteKills: 0,
  floor: 1,
  runObjectiveOffset: rollRunObjectiveOffset(),
  persistentUpgrades: [],
  selectedRelicId: null,
}

export let playerProfile: PlayerProfile = loadProfile()

export const setPlayerProfile = (profile: PlayerProfile): void => {
  playerProfile = profile
}
