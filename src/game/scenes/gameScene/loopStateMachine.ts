export type GameLoopPhase =
  | 'paused'
  | 'reference_board'
  | 'hit_stop'
  | 'overlay_blocked'
  | 'simulate_and_render'

export type ResolveGameLoopPhaseInput = {
  paused: boolean
  referenceBoardMode: boolean
  hitStopMsRemaining: number
  overlayBlocked: boolean
}

export const resolveGameLoopPhase = (input: ResolveGameLoopPhaseInput): GameLoopPhase => {
  if (input.paused) {
    return 'paused'
  }
  if (input.referenceBoardMode) {
    return 'reference_board'
  }
  if (input.hitStopMsRemaining > 0) {
    return 'hit_stop'
  }
  if (input.overlayBlocked) {
    return 'overlay_blocked'
  }
  return 'simulate_and_render'
}
