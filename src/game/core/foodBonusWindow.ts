export const FOOD_BONUS_TRIGGER_INTERVAL = 5
export const FOOD_BONUS_WINDOW_FOODS = 1
export const FOOD_BONUS_EXTRA_MULTIPLIER = 0.5

export type FoodBonusWindowState = {
  foodsEaten: number
  pendingBonusFoods: number
}

export type ResolveFoodBonusScoreInput = {
  state: FoodBonusWindowState
  baseScore: number
  bonusScore: number
}

export type ResolveFoodBonusScoreResult = {
  scoreDelta: number
  bonusApplied: boolean
  bonusWindowStarted: boolean
  nextState: FoodBonusWindowState
}

const clampToNonNegativeInt = (value: number): number => Math.max(0, Math.floor(value))

export const createInitialFoodBonusWindowState = (): FoodBonusWindowState => ({
  foodsEaten: 0,
  pendingBonusFoods: 0,
})

export const resolveFoodBonusScore = (
  input: ResolveFoodBonusScoreInput,
): ResolveFoodBonusScoreResult => {
  const baseScore = clampToNonNegativeInt(input.baseScore)
  const bonusScore = clampToNonNegativeInt(input.bonusScore)
  const foodsEaten = clampToNonNegativeInt(input.state.foodsEaten) + 1
  let pendingBonusFoods = clampToNonNegativeInt(input.state.pendingBonusFoods)
  let scoreDelta = baseScore
  let bonusApplied = false

  if (pendingBonusFoods > 0) {
    scoreDelta += bonusScore
    pendingBonusFoods -= 1
    bonusApplied = true
  }

  const bonusWindowStarted = foodsEaten % FOOD_BONUS_TRIGGER_INTERVAL === 0
  if (bonusWindowStarted) {
    pendingBonusFoods = FOOD_BONUS_WINDOW_FOODS
  }

  return {
    scoreDelta,
    bonusApplied,
    bonusWindowStarted,
    nextState: {
      foodsEaten,
      pendingBonusFoods,
    },
  }
}

export const resolveFoodPickupScore = (
  state: FoodBonusWindowState,
  baseFoodScore: number,
  scoreMultiplier: number,
): ResolveFoodBonusScoreResult =>
  resolveFoodBonusScore({
    state,
    baseScore: Math.floor(clampToNonNegativeInt(baseFoodScore) * scoreMultiplier),
    bonusScore: Math.floor(
      clampToNonNegativeInt(baseFoodScore) * scoreMultiplier * FOOD_BONUS_EXTRA_MULTIPLIER,
    ),
  })
