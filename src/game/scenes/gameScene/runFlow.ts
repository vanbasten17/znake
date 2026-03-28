type OverlayFlowState = {
  rewardPending: boolean
  hasRouteOverlay: boolean
  hasEventChoiceOverlay: boolean
  hasRoomResolveOverlay: boolean
}

export const shouldBlockSimulationForOverlay = (state: OverlayFlowState): boolean =>
  state.rewardPending ||
  state.hasRouteOverlay ||
  state.hasEventChoiceOverlay ||
  state.hasRoomResolveOverlay
