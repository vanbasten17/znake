import { BALANCE } from './balance'
import type { RewardEffectSet, RewardOption, RunConfig } from './types'

export const getRewardPool = (): ReadonlyArray<RewardOption> => BALANCE.rewards.pool

export const applyRewardEffectsToConfig = (cfg: RunConfig, effects: RewardEffectSet): RunConfig => {
  if (effects.moveIntervalMultiplier !== undefined) {
    cfg.moveInterval = Math.max(70, cfg.moveInterval * effects.moveIntervalMultiplier)
  }
  if (effects.enemySlowMultiplier !== undefined) {
    cfg.enemySlow = Math.max(0.45, cfg.enemySlow * effects.enemySlowMultiplier)
  }
  if (effects.bonusShields !== undefined) {
    cfg.bonusShields += effects.bonusShields
  }
  if (effects.bonusLength !== undefined) {
    cfg.bonusStartLength += effects.bonusLength
  }
  if (effects.maxTurnQueue !== undefined) {
    cfg.maxTurnQueue = Math.max(1, Math.floor(effects.maxTurnQueue))
  }
  return cfg
}

export const formatRewardTranslationKey = (
  rewardId: RewardOption['id'],
  suffix: 'name' | 'upside' | 'downside',
): string => `reward.${rewardId}_${suffix}`
