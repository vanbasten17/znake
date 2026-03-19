export type MapperInput = {
  width?: number | string
  height?: number | string
  name?: string
  title?: string
  children?: unknown[]
  [key: string]: unknown
}

export type CanonicalNodeType = 'frame' | 'text' | 'shape'

export type CanonicalNode = {
  id: string
  type: CanonicalNodeType
  x: number
  y: number
  width: number
  height: number
  text?: string
  fillColor?: string
  strokeColor?: string
  borderRadius?: number
  children: CanonicalNode[]
}

export type LayoutNode = {
  id: string
  type: CanonicalNodeType
  x: number
  y: number
  width: number
  height: number
  rx: number
  ry: number
  rw: number
  rh: number
  text?: string
  fillColor?: string
  strokeColor?: string
  borderRadius?: number
  constraints: {
    horizontal: 'left' | 'center' | 'right' | 'stretch'
    vertical: 'top' | 'center' | 'bottom' | 'stretch'
  }
}

export type OverlapWarning = {
  a: string
  b: string
  area: number
}

export type FitWarning = {
  type: 'overflow-bottom' | 'overflow-right'
  id: string
  value: number
}

export type MapperDiagnostics = {
  overlaps: OverlapWarning[]
  fitWarnings: FitWarning[]
}

export type MapperOutput = {
  input: {
    width: number
    height: number
    title: string
  }
  layout: LayoutNode[]
  diagnostics: MapperDiagnostics
  phaserSnippets: string[]
}
