import { getRoomObjective } from '../core/objectives'
import type { RoomObjective } from '../core/objectives'
import { t } from './i18n'

const formatRoomObjectivePreview = (objective: RoomObjective): string => {
  if (objective.kind === 'collect_cores') {
    return t('game.roomObjectiveCollectCoresPreview', { target: objective.target })
  }
  if (objective.kind === 'defeat_elite') {
    return t('game.roomObjectiveDefeatElitePreview', { target: objective.target })
  }
  if (objective.kind === 'activate_terminals') {
    return t('game.roomObjectiveActivateTerminalsPreview', { target: objective.target })
  }
  return t('game.roomObjectiveSurvivePreview', {
    seconds: Math.ceil(objective.target / 1000),
  })
}

export const getObjectivePreviewText = (floor: number, runObjectiveOffset: number): string =>
  formatRoomObjectivePreview(getRoomObjective(floor, runObjectiveOffset))
