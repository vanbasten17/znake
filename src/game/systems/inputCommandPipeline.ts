import type { Vec2 } from '../core/types'

export type DirectionCommandDecision = {
  accepted: boolean
  nextQueue: Vec2[]
  rejectedByQueueCap: boolean
}

export type DirectionCommandInput = {
  next: Vec2
  currentDir: Vec2
  moveQueue: Vec2[]
  maxTurnQueue: number
}

export type BufferedDirectionCommand = {
  direction: Vec2
  expiresAtStep: number
}

export type BufferedDirectionInput = {
  next: Vec2
  currentDir: Vec2
  moveQueue: Vec2[]
  maxTurnQueue: number
  currentStep: number
  graceSteps: number
  buffered: BufferedDirectionCommand | null
}

export type BufferedDirectionDecision = {
  accepted: boolean
  nextQueue: Vec2[]
  nextBuffered: BufferedDirectionCommand | null
}

const isCardinalUnitVector = (value: Vec2): boolean =>
  (Math.abs(value.x) === 1 && value.y === 0) || (Math.abs(value.y) === 1 && value.x === 0)

const isReverseAgainstLast = (next: Vec2, last: Vec2): boolean =>
  next.x === -last.x && next.y === -last.y

export const resolveDirectionCommand = (input: DirectionCommandInput): DirectionCommandDecision => {
  if (!isCardinalUnitVector(input.next)) {
    return {
      accepted: false,
      nextQueue: input.moveQueue,
      rejectedByQueueCap: false,
    }
  }

  const last =
    input.moveQueue.length > 0 ? input.moveQueue[input.moveQueue.length - 1] : input.currentDir
  if (!last || isReverseAgainstLast(input.next, last)) {
    return {
      accepted: false,
      nextQueue: input.moveQueue,
      rejectedByQueueCap: false,
    }
  }
  if (input.moveQueue.length >= input.maxTurnQueue) {
    return {
      accepted: false,
      nextQueue: input.moveQueue,
      rejectedByQueueCap: true,
    }
  }
  return {
    accepted: true,
    nextQueue: [...input.moveQueue, input.next],
    rejectedByQueueCap: false,
  }
}

export const resolveBufferedDirectionCommand = (
  input: BufferedDirectionInput,
): BufferedDirectionDecision => {
  const resolved = resolveDirectionCommand({
    next: input.next,
    currentDir: input.currentDir,
    moveQueue: input.moveQueue,
    maxTurnQueue: input.maxTurnQueue,
  })
  if (resolved.accepted) {
    return {
      accepted: true,
      nextQueue: resolved.nextQueue,
      nextBuffered: null,
    }
  }
  if (!resolved.rejectedByQueueCap || input.graceSteps <= 0) {
    return {
      accepted: false,
      nextQueue: input.moveQueue,
      nextBuffered: input.buffered,
    }
  }
  return {
    accepted: false,
    nextQueue: input.moveQueue,
    nextBuffered: {
      direction: input.next,
      expiresAtStep: input.currentStep + input.graceSteps,
    },
  }
}

export const consumeBufferedDirectionCommand = (input: {
  currentDir: Vec2
  moveQueue: Vec2[]
  maxTurnQueue: number
  currentStep: number
  buffered: BufferedDirectionCommand | null
}): {
  nextQueue: Vec2[]
  nextBuffered: BufferedDirectionCommand | null
} => {
  if (!input.buffered) {
    return {
      nextQueue: input.moveQueue,
      nextBuffered: null,
    }
  }
  if (input.currentStep > input.buffered.expiresAtStep) {
    return {
      nextQueue: input.moveQueue,
      nextBuffered: null,
    }
  }
  const resolved = resolveDirectionCommand({
    next: input.buffered.direction,
    currentDir: input.currentDir,
    moveQueue: input.moveQueue,
    maxTurnQueue: input.maxTurnQueue,
  })
  if (!resolved.accepted) {
    return {
      nextQueue: input.moveQueue,
      nextBuffered: input.buffered,
    }
  }
  return {
    nextQueue: resolved.nextQueue,
    nextBuffered: null,
  }
}
