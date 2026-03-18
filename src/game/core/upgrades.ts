import type { Upgrade } from './types'

export const UPGRADE_POOL: Upgrade[] = [
  {
    id: 'speed_boost',
    name: 'OVERCLOCK',
    desc: '+15% speed',
    icon: 'S',
    color: 0xffdd00,
    apply: (s) => {
      s.moveInterval = Math.max(70, s.moveInterval * 0.85)
    },
  },
  {
    id: 'start_length',
    name: 'BIOMASS',
    desc: 'Start 3 cells longer',
    icon: 'B',
    color: 0x00ff88,
    apply: (s) => {
      s.bonusStartLength += 3
    },
  },
  {
    id: 'shield',
    name: 'VOID SHIELD',
    desc: 'Begin with +1 shield',
    icon: 'D',
    color: 0x00aaff,
    apply: (s) => {
      s.bonusShields += 1
    },
  },
  {
    id: 'magnet',
    name: 'ATTRACTOR',
    desc: 'Food drifts toward you',
    icon: 'M',
    color: 0xaa44ff,
    apply: (s) => {
      s.hasMagnet = true
    },
  },
  {
    id: 'ghost',
    name: 'PHASE SHIFT',
    desc: 'Pass through wall once',
    icon: 'G',
    color: 0xaaaaff,
    apply: (s) => {
      s.ghostCharges += 1
    },
  },
  {
    id: 'score_mult',
    name: 'ECHO HARVEST',
    desc: '2x score',
    icon: 'X2',
    color: 0xff8844,
    apply: (s) => {
      s.scoreMult *= 2
    },
  },
  {
    id: 'slow_field',
    name: 'TIME RIFT',
    desc: 'Enemies move slower',
    icon: 'T',
    color: 0xff88cc,
    apply: (s) => {
      s.enemySlow *= 1.5
    },
  },
  {
    id: 'regen',
    name: 'CELL REGEN',
    desc: 'Tail degrades over time',
    icon: 'R',
    color: 0x44ffaa,
    apply: (s) => {
      s.hasRegen = true
    },
  },
]
