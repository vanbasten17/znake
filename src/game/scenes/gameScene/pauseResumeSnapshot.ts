import type { Vec2 } from '../../core/types'
import type { OverlayInputOwner } from './overlayLifecycleState'

export type PauseResumeSnapshotInput = {
  currentDir: Vec2
  queuedTurns: Vec2[]
  rewardPending: boolean
  routeOverlayOpen: boolean
  inputOwner: OverlayInputOwner
}

export type PauseResumeSnapshot = {
  schemaVersion: number
  currentDir: Vec2
  queuedTurns: Vec2[]
  rewardPending: boolean
  routeOverlayOpen: boolean
  inputOwner: OverlayInputOwner
}

const SCHEMA_VERSION = 1

export const capturePauseResumeSnapshot = (
  input: PauseResumeSnapshotInput,
): PauseResumeSnapshot => ({
  schemaVersion: SCHEMA_VERSION,
  currentDir: { ...input.currentDir },
  queuedTurns: input.queuedTurns.map((turn) => ({ ...turn })),
  rewardPending: input.rewardPending,
  routeOverlayOpen: input.routeOverlayOpen,
  inputOwner: input.inputOwner,
})

export const restorePauseResumeSnapshot = (snapshot: PauseResumeSnapshot): PauseResumeSnapshot => ({
  schemaVersion: snapshot.schemaVersion,
  currentDir: { ...snapshot.currentDir },
  queuedTurns: snapshot.queuedTurns.map((turn) => ({ ...turn })),
  rewardPending: snapshot.rewardPending,
  routeOverlayOpen: snapshot.routeOverlayOpen,
  inputOwner: snapshot.inputOwner,
})
