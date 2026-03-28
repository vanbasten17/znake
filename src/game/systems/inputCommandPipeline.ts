import type { Vec2 } from '../core/types'

export type DirectionCommandDecision = {
  accepted: boolean
  nextQueue: Vec2[]
}

export type DirectionCommandInput = {
  next: Vec2
  currentDir: Vec2
  moveQueue: Vec2[]
  maxTurnQueue: number
}

const isCardinalUnitVector = (value: Vec2): boolean =>
  (Math.abs(value.x) === 1 && value.y === 0) || (Math.abs(value.y) === 1 && value.x === 0)

export const resolveDirectionCommand = (input: DirectionCommandInput): DirectionCommandDecision => {
  if (!isCardinalUnitVector(input.next)) {
    return {
      accepted: false,
      nextQueue: input.moveQueue,
    }
  }

  const last =
    input.moveQueue.length > 0 ? input.moveQueue[input.moveQueue.length - 1] : input.currentDir
  if (!last || (input.next.x === -last.x && input.next.y === -last.y)) {
    return {
      accepted: false,
      nextQueue: input.moveQueue,
    }
  }
  if (input.moveQueue.length >= input.maxTurnQueue) {
    return {
      accepted: false,
      nextQueue: input.moveQueue,
    }
  }
  return {
    accepted: true,
    nextQueue: [...input.moveQueue, input.next],
  }
}
