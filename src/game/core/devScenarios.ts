export type DevScenarioId =
  | 'boss_shield_collision'
  | 'darkness_preboss'
  | 'magnet_food_lock'
  | 'portal_final_seconds'

export type DevScenario = {
  id: DevScenarioId
  label: string
  floor: number
  score: number
  startShields?: number
  forceMagnet?: boolean
  forceDarkness?: boolean
  portalCountdownMs?: number
  placeFoodNearHead?: boolean
}

export const DEV_SCENARIOS: DevScenario[] = [
  {
    id: 'boss_shield_collision',
    label: 'Boss + Shield Collision',
    floor: 3,
    score: 120,
    startShields: 2,
  },
  {
    id: 'darkness_preboss',
    label: 'Darkness Pre-Boss',
    floor: 2,
    score: 80,
    forceDarkness: true,
  },
  {
    id: 'magnet_food_lock',
    label: 'Magnet + Food Near Head',
    floor: 2,
    score: 40,
    forceMagnet: true,
    placeFoodNearHead: true,
  },
  {
    id: 'portal_final_seconds',
    label: 'Portal Final Seconds',
    floor: 2,
    score: 70,
    portalCountdownMs: 2200,
  },
]

export const getDevScenario = (id: DevScenarioId): DevScenario | null =>
  DEV_SCENARIOS.find((scenario) => scenario.id === id) ?? null

export const isDevMode = (): boolean => {
  const params = new URLSearchParams(window.location.search)
  return params.get('dev') === '1'
}
