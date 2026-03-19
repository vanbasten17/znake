import type { CanonicalNode, LayoutNode, MapperInput } from './types'

const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const asString = (value: unknown): string | undefined => {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

const pickFirstNumber = (obj: Record<string, unknown>, keys: string[]): number | null => {
  for (const key of keys) {
    const candidate = asNumber(obj[key])
    if (candidate !== null) {
      return candidate
    }
  }
  return null
}

const detectNodeType = (node: Record<string, unknown>): 'frame' | 'text' | 'shape' => {
  if (typeof node.text === 'string' || typeof node.label === 'string') {
    return 'text'
  }
  const shapeHint = asString(node.kind) ?? asString(node.type) ?? ''
  if (
    shapeHint.toLowerCase().includes('rect') ||
    shapeHint.toLowerCase().includes('shape') ||
    shapeHint.toLowerCase().includes('ellipse')
  ) {
    return 'shape'
  }
  return 'frame'
}

const normalizeNode = (
  node: unknown,
  indexPath: string,
  parentBounds: CanonicalNode,
): CanonicalNode => {
  const record = (node && typeof node === 'object' ? node : {}) as Record<string, unknown>
  const x = pickFirstNumber(record, ['x', 'left']) ?? 0
  const y = pickFirstNumber(record, ['y', 'top']) ?? 0
  const width = pickFirstNumber(record, ['width', 'w']) ?? parentBounds.width
  const height = pickFirstNumber(record, ['height', 'h']) ?? parentBounds.height
  const type = detectNodeType(record)
  const text = asString(record.text) ?? asString(record.label) ?? asString(record.name)
  const fillColor = asString(record.fillColor) ?? asString(record.fill) ?? asString(record.color)
  const strokeColor = asString(record.strokeColor) ?? asString(record.stroke)
  const borderRadius = pickFirstNumber(record, ['borderRadius', 'radius']) ?? undefined
  const rawChildren = Array.isArray(record.children) ? record.children : []

  const self: CanonicalNode = {
    id: asString(record.id) ?? `node_${indexPath}`,
    type,
    x,
    y,
    width,
    height,
    text,
    fillColor,
    strokeColor,
    borderRadius,
    children: [],
  }

  self.children = rawChildren.map((child, childIndex) =>
    normalizeNode(child, `${indexPath}_${childIndex}`, self),
  )
  return self
}

const flatten = (node: CanonicalNode): CanonicalNode[] => {
  return [node, ...node.children.flatMap(flatten)]
}

const inferConstraint = (
  pos: number,
  size: number,
  total: number,
): 'left' | 'center' | 'right' | 'stretch' => {
  const startDist = pos
  const endDist = total - (pos + size)
  if (startDist <= 8 && endDist <= 8) return 'stretch'
  if (Math.abs(startDist - endDist) <= 6) return 'center'
  if (startDist <= endDist) return 'left'
  return 'right'
}

export const normalizeInput = (
  input: MapperInput,
): { width: number; height: number; nodes: LayoutNode[] } => {
  const width = asNumber(input.width) ?? 768
  const height = asNumber(input.height) ?? 1376
  const root: CanonicalNode = {
    id: asString(input.name) ?? 'root',
    type: 'frame',
    x: 0,
    y: 0,
    width,
    height,
    text: asString(input.title),
    children: [],
  }
  const children = Array.isArray(input.children) ? input.children : []
  root.children = children.map((child, index) => normalizeNode(child, String(index), root))

  const nodes = flatten(root)
    .filter((node) => node.id !== root.id)
    .map<LayoutNode>((node) => ({
      id: node.id,
      type: node.type,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      rx: width === 0 ? 0 : node.x / width,
      ry: height === 0 ? 0 : node.y / height,
      rw: width === 0 ? 0 : node.width / width,
      rh: height === 0 ? 0 : node.height / height,
      text: node.text,
      fillColor: node.fillColor,
      strokeColor: node.strokeColor,
      borderRadius: node.borderRadius,
      constraints: {
        horizontal: inferConstraint(node.x, node.width, width),
        vertical: inferConstraint(node.y, node.height, height),
      },
    }))

  return { width, height, nodes }
}
