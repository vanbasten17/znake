import { normalizeRunStatus } from './hudHierarchy'

export type ScoreHudViewModel = {
  scoreText: string
  floorText: string
  killsText: string
  runText: string
}

export type StatusHudViewModel = {
  runStatusText: string
  runStatusActive: boolean
  objectiveStatusText: string
  routeStatusText: string
}

export const buildScoreHudViewModel = (params: {
  score: number
  floor: number
  kills: number
  run: number
}): ScoreHudViewModel => ({
  scoreText: String(params.score),
  floorText: String(params.floor),
  killsText: String(params.kills),
  runText: String(params.run),
})

export const buildStatusHudViewModel = (params: {
  runStatusText: string
  objectiveStatusText: string
  routeStatusText: string
}): StatusHudViewModel => {
  const runStatus = normalizeRunStatus(params.runStatusText)
  return {
    runStatusText: runStatus.text,
    runStatusActive: runStatus.isActive,
    objectiveStatusText: params.objectiveStatusText,
    routeStatusText: params.routeStatusText,
  }
}
