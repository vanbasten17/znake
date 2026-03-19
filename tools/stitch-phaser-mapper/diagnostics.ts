import type { FitWarning, LayoutNode, OverlapWarning } from './types'

const overlapArea = (a: LayoutNode, b: LayoutNode): number => {
  const x1 = Math.max(a.x, b.x)
  const y1 = Math.max(a.y, b.y)
  const x2 = Math.min(a.x + a.width, b.x + b.width)
  const y2 = Math.min(a.y + a.height, b.y + b.height)
  const w = Math.max(0, x2 - x1)
  const h = Math.max(0, y2 - y1)
  return w * h
}

export const detectOverlaps = (nodes: LayoutNode[]): OverlapWarning[] => {
  const warnings: OverlapWarning[] = []
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i]
      const b = nodes[j]
      if (!a || !b) continue
      const area = overlapArea(a, b)
      if (area <= 0) continue
      const threshold = Math.max(8, Math.min(a.width * a.height, b.width * b.height) * 0.04)
      if (area >= threshold) {
        warnings.push({ a: a.id, b: b.id, area: Math.round(area) })
      }
    }
  }
  return warnings
}

export const detectFitWarnings = (
  nodes: LayoutNode[],
  width: number,
  height: number,
): FitWarning[] => {
  const warnings: FitWarning[] = []
  for (const node of nodes) {
    const rightOverflow = node.x + node.width - width
    if (rightOverflow > 0) {
      warnings.push({
        type: 'overflow-right',
        id: node.id,
        value: Math.ceil(rightOverflow),
      })
    }
    const bottomOverflow = node.y + node.height - height
    if (bottomOverflow > 0) {
      warnings.push({
        type: 'overflow-bottom',
        id: node.id,
        value: Math.ceil(bottomOverflow),
      })
    }
  }
  return warnings
}
