import { resolveContentPack } from './contentPacks'
import type { ContentPackDefinition } from './types'

export type ResolvedContentPack = {
  pack: ContentPackDefinition
  fallbackApplied: boolean
}

export type ContentRepository = {
  resolvePack: (requestedPackId: string | null | undefined) => ResolvedContentPack
}

const defaultContentRepository: ContentRepository = {
  resolvePack: (requestedPackId) => resolveContentPack(requestedPackId),
}

export const resolveContentPackFromRepository = (
  requestedPackId: string | null | undefined,
  repository: ContentRepository = defaultContentRepository,
): ResolvedContentPack => repository.resolvePack(requestedPackId)
