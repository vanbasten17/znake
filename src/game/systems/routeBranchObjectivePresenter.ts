import { getRoomObjectiveForRoomType } from '../core/objectives'
import type { RunMapPreviewChoice } from '../core/types'

const formatObjectiveTag = (objectiveKind: string | null): string =>
  objectiveKind ? `OBJ:${objectiveKind.toUpperCase()}` : 'OBJ:COMBAT'

const formatRewardTag = (roomType: RunMapPreviewChoice['roomType']): string =>
  roomType === 'elite' ? 'REWARD:ELITE' : roomType === 'shop' ? 'REWARD:UTILITY' : 'REWARD:RUN'

export const formatRouteBranchPreview = (params: {
  choice: RunMapPreviewChoice
  floor: number
  runObjectiveOffset: number
  getBiomeLabel: (biomeId: RunMapPreviewChoice['biomeId']) => string
  getRoomTypeLabel: (roomType: RunMapPreviewChoice['roomType']) => string
  t: (key: string, options: Record<string, string>) => string
}): string => {
  const biome = params.getBiomeLabel(params.choice.biomeId)
  const objective = getRoomObjectiveForRoomType(
    params.floor,
    params.choice.roomType,
    params.runObjectiveOffset,
  )
  const objectiveTag = formatObjectiveTag(objective?.kind ?? null)
  const rewardTag = formatRewardTag(params.choice.roomType)
  const firstFuture = params.choice.previewRoomTypes[1]
  if (!firstFuture) {
    const room = params.t('game.routeChoiceCompact', {
      index: params.choice.branchLabel,
      room: params.getRoomTypeLabel(params.choice.roomType),
    })
    return `${room} · ${biome} · ${objectiveTag} · ${rewardTag}`
  }
  const room = params.t('game.routePreviewCompact', {
    room: params.t('game.routeChoiceCompact', {
      index: params.choice.branchLabel,
      room: params.getRoomTypeLabel(params.choice.roomType),
    }),
    next: params.getRoomTypeLabel(firstFuture),
  })
  return `${room} · ${biome} · ${objectiveTag} · ${rewardTag}`
}
