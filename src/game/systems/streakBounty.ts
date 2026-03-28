export const STREAK_BOUNTY_THRESHOLDS = [3, 5, 8] as const
const STREAK_BOUNTY_BASE_BONUS = [25, 45, 80] as const

export type ResolveStreakBountyInput = {
  streak: number
  awardsClaimed: number
  scoreMultiplier: number
}

export type ResolveStreakBountyResult = {
  bonusScore: number
  awardsClaimed: number
}

export const resolveStreakBounty = (input: ResolveStreakBountyInput): ResolveStreakBountyResult => {
  const tier = input.awardsClaimed
  const threshold = STREAK_BOUNTY_THRESHOLDS[tier]
  const baseBonus = STREAK_BOUNTY_BASE_BONUS[tier]
  if (!threshold || !baseBonus || input.streak < threshold) {
    return {
      bonusScore: 0,
      awardsClaimed: input.awardsClaimed,
    }
  }
  return {
    bonusScore: Math.max(0, Math.floor(baseBonus * input.scoreMultiplier)),
    awardsClaimed: input.awardsClaimed + 1,
  }
}
