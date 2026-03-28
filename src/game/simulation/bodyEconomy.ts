import type {
  BodyEconomyRuntimeState,
  BodySpendOutcome,
  EnemyKind,
  RunConfig,
  SnakeSegment,
} from '../core/types'

type BodyEconomyConfig = Pick<
  RunConfig,
  | 'bodySpendMinLength'
  | 'bodyPulseCost'
  | 'bodyPulseCooldownMs'
  | 'bodyPulseDurationMs'
  | 'bodyPulseRadius'
  | 'rewardOverclockCost'
  | 'rewardOverclockUsesPerObjective'
>

type BodyPulseTarget = {
  alive: boolean
  kind: EnemyKind
  body: SnakeSegment[]
}

type ResolveBodyPulseSpendParams = {
  snakeLength: number
  state: BodyEconomyRuntimeState
  config: BodyEconomyConfig
}

type ResolveRewardOverclockSpendParams = {
  snakeLength: number
  state: BodyEconomyRuntimeState
  config: BodyEconomyConfig
  inRewardWindow: boolean
}

const buildBlockedOutcome = (
  source: BodySpendOutcome['source'],
  blockedReason: BodySpendOutcome['blockedReason'],
): BodySpendOutcome => ({
  status: blockedReason === 'on_cooldown' ? 'on_cooldown' : 'blocked',
  source,
  spentSegments: 0,
  blockedReason,
})

const canSpendBodySegments = (params: {
  snakeLength: number
  spendCost: number
  minSpendableLength: number
}): boolean =>
  params.snakeLength - Math.max(1, Math.floor(params.spendCost)) >= params.minSpendableLength

const PANIC_RECOVERY_ACTIVE_MS = 1500
const PANIC_RECOVERY_COOLDOWN_MS = 12000

export const createInitialBodyEconomyRuntimeState = (): BodyEconomyRuntimeState => ({
  bodyPulseCooldownMs: 0,
  bodyPulseActiveMs: 0,
  rewardOverclockUsesInWindow: 0,
  panicRecoveryActiveMs: 0,
  panicRecoveryCooldownMs: 0,
})

export const tickBodyEconomyRuntimeState = (
  state: BodyEconomyRuntimeState,
  deltaMs: number,
): BodyEconomyRuntimeState => {
  const decayMs = Math.max(0, deltaMs)
  return {
    ...state,
    bodyPulseCooldownMs: Math.max(0, state.bodyPulseCooldownMs - decayMs),
    bodyPulseActiveMs: Math.max(0, state.bodyPulseActiveMs - decayMs),
    panicRecoveryActiveMs: Math.max(0, state.panicRecoveryActiveMs - decayMs),
    panicRecoveryCooldownMs: Math.max(0, state.panicRecoveryCooldownMs - decayMs),
  }
}

export const resetRewardOverclockWindow = (
  state: BodyEconomyRuntimeState,
): BodyEconomyRuntimeState => ({
  ...state,
  rewardOverclockUsesInWindow: 0,
})

export const resolveBodyPulseSpend = (
  params: ResolveBodyPulseSpendParams,
): {
  outcome: BodySpendOutcome
  state: BodyEconomyRuntimeState
} => {
  if (params.state.bodyPulseCooldownMs > 0) {
    return {
      outcome: buildBlockedOutcome('body_pulse', 'on_cooldown'),
      state: params.state,
    }
  }
  if (
    !canSpendBodySegments({
      snakeLength: params.snakeLength,
      spendCost: params.config.bodyPulseCost,
      minSpendableLength: params.config.bodySpendMinLength,
    })
  ) {
    if (params.state.panicRecoveryActiveMs > 0) {
      return {
        outcome: {
          status: 'applied',
          source: 'body_pulse',
          spentSegments: 0,
          blockedReason: null,
        },
        state: {
          ...params.state,
          panicRecoveryActiveMs: 0,
          bodyPulseCooldownMs: Math.max(0, params.config.bodyPulseCooldownMs),
          bodyPulseActiveMs: Math.max(0, params.config.bodyPulseDurationMs),
        },
      }
    }
    const panicTriggerLength = Math.max(1, params.config.bodySpendMinLength + 1)
    if (params.snakeLength <= panicTriggerLength && params.state.panicRecoveryCooldownMs <= 0) {
      return {
        outcome: buildBlockedOutcome('body_pulse', 'below_floor'),
        state: {
          ...params.state,
          panicRecoveryActiveMs: PANIC_RECOVERY_ACTIVE_MS,
          panicRecoveryCooldownMs: PANIC_RECOVERY_COOLDOWN_MS,
        },
      }
    }
    return {
      outcome: buildBlockedOutcome('body_pulse', 'below_floor'),
      state: params.state,
    }
  }

  return {
    outcome: {
      status: 'applied',
      source: 'body_pulse',
      spentSegments: Math.max(1, Math.floor(params.config.bodyPulseCost)),
      blockedReason: null,
    },
    state: {
      ...params.state,
      bodyPulseCooldownMs: Math.max(0, params.config.bodyPulseCooldownMs),
      bodyPulseActiveMs: Math.max(0, params.config.bodyPulseDurationMs),
    },
  }
}

export const resolveRewardOverclockSpend = (
  params: ResolveRewardOverclockSpendParams,
): {
  outcome: BodySpendOutcome
  state: BodyEconomyRuntimeState
} => {
  if (!params.inRewardWindow) {
    return {
      outcome: buildBlockedOutcome('reward_overclock', 'not_reward_phase'),
      state: params.state,
    }
  }
  if (params.state.rewardOverclockUsesInWindow >= params.config.rewardOverclockUsesPerObjective) {
    return {
      outcome: buildBlockedOutcome('reward_overclock', 'usage_limit_reached'),
      state: params.state,
    }
  }
  if (
    !canSpendBodySegments({
      snakeLength: params.snakeLength,
      spendCost: params.config.rewardOverclockCost,
      minSpendableLength: params.config.bodySpendMinLength,
    })
  ) {
    return {
      outcome: buildBlockedOutcome('reward_overclock', 'below_floor'),
      state: params.state,
    }
  }

  return {
    outcome: {
      status: 'applied',
      source: 'reward_overclock',
      spentSegments: Math.max(1, Math.floor(params.config.rewardOverclockCost)),
      blockedReason: null,
    },
    state: {
      ...params.state,
      rewardOverclockUsesInWindow: params.state.rewardOverclockUsesInWindow + 1,
    },
  }
}

export const collectBodyPulseHitEnemyIndexes = (params: {
  head: SnakeSegment | null
  enemies: ReadonlyArray<BodyPulseTarget>
  radius: number
}): number[] => {
  const head = params.head
  if (!head) {
    return []
  }
  const radius = Math.max(0, Math.floor(params.radius))
  const hits: number[] = []
  for (let i = 0; i < params.enemies.length; i += 1) {
    const enemy = params.enemies[i]
    if (!enemy || !enemy.alive || enemy.kind === 'boss') {
      continue
    }
    const isHit = enemy.body.some(
      (segment) => Math.abs(segment.x - head.x) + Math.abs(segment.y - head.y) <= radius,
    )
    if (isHit) {
      hits.push(i)
    }
  }
  return hits
}
