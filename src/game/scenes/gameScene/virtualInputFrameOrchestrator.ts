import type { Vec2, VirtualInput } from '../../core/types'

type DirectionId = Exclude<VirtualInput['dir'], null>
type TurnId = Exclude<VirtualInput['turn'], null>

type VirtualInputFrameHandlers = {
  onPause: () => void
  onDirection: (next: Vec2) => void
  onTurn: (turn: TurnId) => void
  onAbility: () => void
}

const DIRECTION_BY_ID: Record<DirectionId, Vec2> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export const consumeVirtualInputFrame = (
  virtualInput: VirtualInput,
  handlers: VirtualInputFrameHandlers,
): void => {
  if (virtualInput.pause) {
    virtualInput.pause = false
    handlers.onPause()
  }

  const directionId = virtualInput.dir
  if (directionId) {
    const direction = DIRECTION_BY_ID[directionId]
    if (direction) {
      handlers.onDirection(direction)
    }
    virtualInput.dir = null
  }

  const turnId = virtualInput.turn
  if (turnId) {
    handlers.onTurn(turnId)
    virtualInput.turn = null
  }

  if (virtualInput.ability) {
    virtualInput.ability = false
    handlers.onAbility()
  }
}
