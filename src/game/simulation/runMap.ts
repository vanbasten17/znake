import { BALANCE } from '../core/balance'
import { getFloorObjective } from '../core/objectives'
import type {
  BiomeId,
  RunMapNode,
  RunMapPreview,
  RunMapPreviewChoice,
  RunMapRoomType,
} from '../core/types'
import { createSeededRng, deriveRunSeed } from './rng'

const ROOT_NODE_ID = 'depth:0:path:root'

const toPositiveInt = (value: number, fallback: number): number => {
  const normalized = Math.floor(value)
  return normalized > 0 ? normalized : fallback
}

const pathHash = (path: string): number => {
  let hash = 0
  for (let index = 0; index < path.length; index += 1) {
    hash = Math.imul(hash ^ path.charCodeAt(index), 16777619) >>> 0
  }
  return hash >>> 0
}

const parseNodeId = (nodeId: string): { depth: number; path: string } => {
  const match = /^depth:(\d+):path:(.+)$/.exec(nodeId)
  if (!match) {
    return { depth: 0, path: 'root' }
  }
  return {
    depth: Number.parseInt(match[1] ?? '0', 10) || 0,
    path: match[2] ?? 'root',
  }
}

const makeNodeId = (depth: number, path: string): string => `depth:${depth}:path:${path}`

const getBranchCount = (floor: number, runObjectiveOffset: number): number => {
  const objective = getFloorObjective(floor, runObjectiveOffset)
  return objective.kind === 'portal'
    ? BALANCE.runMap.branchChoicesOnPortalObjective
    : BALANCE.runMap.branchChoicesOtherwise
}

const getRoomTypeWeightsForDepth = (depth: number): Record<RunMapRoomType, number> => {
  let selected = BALANCE.runMap.roomTypeWeightsByDepth[0]?.weights
  for (const entry of BALANCE.runMap.roomTypeWeightsByDepth) {
    if (depth >= entry.minDepth) {
      selected = entry.weights
    }
  }
  return (
    selected ?? {
      combat: 1,
      elite: 0,
      shop: 0,
      rest: 0,
      event: 0,
    }
  )
}

const getBiomeWeightsForDepth = (depth: number): Record<BiomeId, number> => {
  let selected = BALANCE.runMap.biomeWeightsByDepth[0]?.weights
  for (const entry of BALANCE.runMap.biomeWeightsByDepth) {
    if (depth >= entry.minDepth) {
      selected = entry.weights
    }
  }
  return (
    selected ?? {
      'void-depths': 1,
      'crystal-caverns': 0,
      'ember-fields': 0,
    }
  )
}

const pickRoomTypeForNode = (runSeed: number, depth: number, path: string): RunMapRoomType => {
  if (depth <= 0) {
    return 'combat'
  }
  const rng = createSeededRng(deriveRunSeed([runSeed, depth, pathHash(path)]))
  const weights = getRoomTypeWeightsForDepth(depth)
  return (
    rng.weightedPick(
      (Object.entries(weights) as Array<[RunMapRoomType, number]>).map(([value, weight]) => ({
        value,
        weight,
      })),
    ) ?? 'combat'
  )
}

const pickBiomeForNode = (runSeed: number, depth: number, path: string): BiomeId => {
  const rng = createSeededRng(deriveRunSeed([runSeed, depth, pathHash(path), 0x6f2d]))
  const weights = getBiomeWeightsForDepth(depth)
  return (
    rng.weightedPick(
      (Object.entries(weights) as Array<[BiomeId, number]>).map(([value, weight]) => ({
        value,
        weight,
      })),
    ) ?? 'void-depths'
  )
}

export const createDefaultRunMapNodeIdForFloor = (floor: number): string => {
  const normalizedFloor = Math.max(1, Math.floor(floor))
  if (normalizedFloor <= 1) {
    return ROOT_NODE_ID
  }
  return makeNodeId(normalizedFloor - 1, `root${'a'.repeat(normalizedFloor - 1)}`)
}

export const createInitialRunMapNodeId = (): string => ROOT_NODE_ID

export const isCombatRunMapRoomType = (roomType: RunMapRoomType): boolean =>
  roomType === 'combat' || roomType === 'elite'

export const buildRunMapNode = (params: {
  runSeed: number
  nodeId: string
  runObjectiveOffset: number
}): RunMapNode => {
  const parsed = parseNodeId(params.nodeId)
  const floor = parsed.depth + 1
  const branchCount = toPositiveInt(getBranchCount(floor, params.runObjectiveOffset), 1)
  const nextDepth = parsed.depth + 1
  const nextNodeIds = Array.from({ length: branchCount }, (_, index) =>
    makeNodeId(nextDepth, `${parsed.path}${String.fromCharCode(97 + index)}`),
  )
  const roomType = pickRoomTypeForNode(params.runSeed, parsed.depth, parsed.path)
  const biomeId = pickBiomeForNode(params.runSeed, parsed.depth, parsed.path)
  return {
    id: params.nodeId,
    depth: parsed.depth,
    roomType,
    biomeId,
    nextNodeIds,
    branchPoint: nextNodeIds.length > 1,
    resolutionKind: isCombatRunMapRoomType(roomType) ? 'objective_reward' : 'noncombat_hook',
  }
}

const collectPreviewRoomTypes = (params: {
  runSeed: number
  nodeId: string
  runObjectiveOffset: number
  remainingDepth: number
}): RunMapRoomType[] => {
  if (params.remainingDepth <= 0) {
    return []
  }
  const node = buildRunMapNode(params)
  const preview: RunMapRoomType[] = [node.roomType]
  const nextNodeId = node.nextNodeIds[0]
  if (!nextNodeId) {
    return preview
  }
  return [
    ...preview,
    ...collectPreviewRoomTypes({
      ...params,
      nodeId: nextNodeId,
      remainingDepth: params.remainingDepth - 1,
    }),
  ]
}

export const getRunMapPreview = (params: {
  runSeed: number
  currentNodeId: string
  runObjectiveOffset: number
  previewHorizon?: number
}): RunMapPreview => {
  const previewHorizon = toPositiveInt(params.previewHorizon ?? BALANCE.runMap.previewHorizon, 1)
  const currentNode = buildRunMapNode({
    runSeed: params.runSeed,
    nodeId: params.currentNodeId,
    runObjectiveOffset: params.runObjectiveOffset,
  })
  const choices: RunMapPreviewChoice[] = currentNode.nextNodeIds.map((nodeId, index) => {
    const choiceNode = buildRunMapNode({
      runSeed: params.runSeed,
      nodeId,
      runObjectiveOffset: params.runObjectiveOffset,
    })
    return {
      nodeId,
      branchLabel: String(index + 1),
      roomType: choiceNode.roomType,
      biomeId: choiceNode.biomeId,
      previewRoomTypes: collectPreviewRoomTypes({
        runSeed: params.runSeed,
        nodeId,
        runObjectiveOffset: params.runObjectiveOffset,
        remainingDepth: previewHorizon,
      }),
    }
  })
  return {
    currentNode,
    choices,
    previewHorizon,
  }
}
