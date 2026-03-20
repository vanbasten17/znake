import { GLOSSARY_MARKER_TONES, type GlossaryMarkerTone } from '../core/glossary'

export type VisualCategory =
  | 'obstacle'
  | 'enemy'
  | 'collectible'
  | 'powerup'
  | 'hazard'
  | 'objective'
  | 'talent'

export type VisualIntent = 'danger' | 'reward' | 'utility' | 'neutral'
export type VisualPriority = 'low' | 'medium' | 'high' | 'critical'
export type VisualShapeFamily = 'rounded' | 'angular' | 'rectilinear' | 'insignia'
export type VisualColorFamily =
  | 'danger_warm'
  | 'reward_bright'
  | 'utility_cool'
  | 'hazard_dark'
  | 'terrain_neutral'
  | 'objective_signal'

export type VisualStateEmphasis = {
  idle: number
  active: number
  dangerous: number
}

export type VisualToken = {
  category: VisualCategory
  intent: VisualIntent
  priority: VisualPriority
  shape: VisualShapeFamily
  colorFamily: VisualColorFamily
  allowGlow?: boolean
  state: VisualStateEmphasis
}

const softState: VisualStateEmphasis = { idle: 0.2, active: 0.45, dangerous: 0.75 }
const mediumState: VisualStateEmphasis = { idle: 0.3, active: 0.6, dangerous: 0.9 }
const hardState: VisualStateEmphasis = { idle: 0.45, active: 0.8, dangerous: 1 }

export const MARKER_VISUAL_TOKEN: Record<GlossaryMarkerTone, VisualToken> = {
  core: {
    category: 'collectible',
    intent: 'reward',
    priority: 'high',
    shape: 'rounded',
    colorFamily: 'reward_bright',
    allowGlow: false,
    state: mediumState,
  },
  biomeCore: {
    category: 'collectible',
    intent: 'reward',
    priority: 'high',
    shape: 'rounded',
    colorFamily: 'reward_bright',
    allowGlow: false,
    state: mediumState,
  },
  portal: {
    category: 'objective',
    intent: 'utility',
    priority: 'critical',
    shape: 'rounded',
    colorFamily: 'objective_signal',
    state: hardState,
  },
  battery: {
    category: 'collectible',
    intent: 'utility',
    priority: 'medium',
    shape: 'insignia',
    colorFamily: 'utility_cool',
    state: softState,
  },
  beacon: {
    category: 'objective',
    intent: 'utility',
    priority: 'high',
    shape: 'insignia',
    colorFamily: 'objective_signal',
    state: mediumState,
  },
  shield: {
    category: 'powerup',
    intent: 'utility',
    priority: 'high',
    shape: 'insignia',
    colorFamily: 'utility_cool',
    state: mediumState,
  },
  slow: {
    category: 'powerup',
    intent: 'utility',
    priority: 'medium',
    shape: 'insignia',
    colorFamily: 'utility_cool',
    state: mediumState,
  },
  ghost: {
    category: 'powerup',
    intent: 'utility',
    priority: 'medium',
    shape: 'insignia',
    colorFamily: 'utility_cool',
    state: mediumState,
  },
  score: {
    category: 'powerup',
    intent: 'reward',
    priority: 'high',
    shape: 'insignia',
    colorFamily: 'reward_bright',
    allowGlow: false,
    state: mediumState,
  },
  venom: {
    category: 'powerup',
    intent: 'utility',
    priority: 'high',
    shape: 'insignia',
    colorFamily: 'utility_cool',
    state: mediumState,
  },
  darkness: {
    category: 'hazard',
    intent: 'danger',
    priority: 'high',
    shape: 'angular',
    colorFamily: 'hazard_dark',
    state: hardState,
  },
  squeeze: {
    category: 'hazard',
    intent: 'danger',
    priority: 'critical',
    shape: 'angular',
    colorFamily: 'hazard_dark',
    state: hardState,
  },
  ice: {
    category: 'obstacle',
    intent: 'neutral',
    priority: 'medium',
    shape: 'rectilinear',
    colorFamily: 'terrain_neutral',
    state: softState,
  },
  sand: {
    category: 'obstacle',
    intent: 'neutral',
    priority: 'medium',
    shape: 'rectilinear',
    colorFamily: 'terrain_neutral',
    state: softState,
  },
  rift: {
    category: 'hazard',
    intent: 'danger',
    priority: 'critical',
    shape: 'angular',
    colorFamily: 'hazard_dark',
    state: hardState,
  },
  enemyNormal: {
    category: 'enemy',
    intent: 'danger',
    priority: 'high',
    shape: 'angular',
    colorFamily: 'danger_warm',
    state: mediumState,
  },
  enemyStalker: {
    category: 'enemy',
    intent: 'danger',
    priority: 'high',
    shape: 'angular',
    colorFamily: 'danger_warm',
    state: hardState,
  },
  enemyAmbusher: {
    category: 'enemy',
    intent: 'danger',
    priority: 'high',
    shape: 'angular',
    colorFamily: 'danger_warm',
    state: hardState,
  },
  enemyEgg: {
    category: 'enemy',
    intent: 'danger',
    priority: 'medium',
    shape: 'rounded',
    colorFamily: 'danger_warm',
    state: softState,
  },
  enemyMirror: {
    category: 'enemy',
    intent: 'danger',
    priority: 'high',
    shape: 'angular',
    colorFamily: 'danger_warm',
    state: mediumState,
  },
  enemyBoss: {
    category: 'enemy',
    intent: 'danger',
    priority: 'critical',
    shape: 'angular',
    colorFamily: 'danger_warm',
    state: hardState,
  },
  talentSpeed: {
    category: 'talent',
    intent: 'reward',
    priority: 'medium',
    shape: 'insignia',
    colorFamily: 'reward_bright',
    state: softState,
  },
  talentSurvival: {
    category: 'talent',
    intent: 'reward',
    priority: 'medium',
    shape: 'insignia',
    colorFamily: 'reward_bright',
    state: softState,
  },
  talentHunt: {
    category: 'talent',
    intent: 'reward',
    priority: 'medium',
    shape: 'insignia',
    colorFamily: 'reward_bright',
    state: softState,
  },
}

const priorityWeight: Record<VisualPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
}

const isOpposingIntent = (a: VisualIntent, b: VisualIntent): boolean =>
  (a === 'danger' && (b === 'reward' || b === 'utility')) ||
  (b === 'danger' && (a === 'reward' || a === 'utility'))

export const getVisualToken = (tone: GlossaryMarkerTone): VisualToken => MARKER_VISUAL_TOKEN[tone]
export const allowsMarkerGlow = (tone: GlossaryMarkerTone): boolean =>
  MARKER_VISUAL_TOKEN[tone]?.allowGlow ?? true

export const validateVisualLanguage = (): string[] => {
  const issues: string[] = []

  for (const tone of GLOSSARY_MARKER_TONES) {
    if (!MARKER_VISUAL_TOKEN[tone]) {
      issues.push(`Missing visual token mapping for tone "${tone}"`)
    }
  }

  const tones = GLOSSARY_MARKER_TONES
  for (let i = 0; i < tones.length; i += 1) {
    for (let j = i + 1; j < tones.length; j += 1) {
      const aTone = tones[i]
      const bTone = tones[j]
      const a = MARKER_VISUAL_TOKEN[aTone]
      const b = MARKER_VISUAL_TOKEN[bTone]
      if (!a || !b) continue
      if (
        isOpposingIntent(a.intent, b.intent) &&
        priorityWeight[a.priority] >= 3 &&
        priorityWeight[b.priority] >= 3 &&
        a.shape === b.shape &&
        a.colorFamily === b.colorFamily
      ) {
        issues.push(
          `Ambiguity risk between "${aTone}" and "${bTone}" (opposing intent shares shape+color at high priority)`,
        )
      }
    }
  }

  return issues
}
