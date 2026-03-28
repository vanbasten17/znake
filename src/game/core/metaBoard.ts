import type { PlayerProfile, TalentId } from './types'

export type MetaBoardBranchId = 'tempo' | 'stability' | 'control'

export type MetaBoardNode = {
  id: string
  branch: MetaBoardBranchId
  tier: number
  label: string
  tradeoff: string
}

export type MetaBoardBranchStatus = {
  branch: MetaBoardBranchId
  unlockedTiers: number
  nextNodeLabel: string
}

const TALENT_TO_BRANCH: Record<TalentId, MetaBoardBranchId> = {
  speed_1: 'tempo',
  speed_2: 'tempo',
  hunt_1: 'control',
  hunt_2: 'control',
  survival_1: 'stability',
  survival_2: 'stability',
}

const BRANCH_ORDER: MetaBoardBranchId[] = ['tempo', 'stability', 'control']

const META_BOARD_NODES: ReadonlyArray<MetaBoardNode> = [
  {
    id: 'tempo_branch_a',
    branch: 'tempo',
    tier: 1,
    label: 'Tempo Branch',
    tradeoff: 'Faster openings with tighter reaction windows.',
  },
  {
    id: 'stability_branch_a',
    branch: 'stability',
    tier: 1,
    label: 'Stability Branch',
    tradeoff: 'Safer recoveries with lower burst payoff.',
  },
  {
    id: 'control_branch_a',
    branch: 'control',
    tier: 1,
    label: 'Control Branch',
    tradeoff: 'Route pressure tools that need cleaner planning.',
  },
]

export const getMetaBoardNodes = (): ReadonlyArray<MetaBoardNode> => META_BOARD_NODES

export const getMetaBoardBranchStatus = (
  profile: PlayerProfile,
): ReadonlyArray<MetaBoardBranchStatus> => {
  const unlockedByBranch: Record<MetaBoardBranchId, number> = {
    tempo: 0,
    stability: 0,
    control: 0,
  }
  for (const talentId of profile.unlockedTalents) {
    unlockedByBranch[TALENT_TO_BRANCH[talentId]] += 1
  }
  return BRANCH_ORDER.map((branch) => {
    const unlockedTiers = Math.min(2, unlockedByBranch[branch])
    const node = META_BOARD_NODES.find((candidate) => candidate.branch === branch)
    return {
      branch,
      unlockedTiers,
      nextNodeLabel: node?.label ?? 'Branch',
    }
  })
}
