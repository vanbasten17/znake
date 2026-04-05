export type OverlayLifecycleState = 'idle' | 'mounting' | 'active' | 'unmounting'
export type OverlayInputOwner = 'simulation' | 'overlay'

const ALLOWED_TRANSITIONS: Record<OverlayLifecycleState, OverlayLifecycleState[]> = {
  idle: ['mounting'],
  mounting: ['active', 'idle'],
  active: ['unmounting'],
  unmounting: ['idle', 'active'],
}

export const canTransitionOverlayLifecycle = (
  from: OverlayLifecycleState,
  to: OverlayLifecycleState,
): boolean => ALLOWED_TRANSITIONS[from].includes(to)

export const resolveOverlayInputOwner = (state: OverlayLifecycleState): OverlayInputOwner =>
  state === 'active' || state === 'mounting' ? 'overlay' : 'simulation'
