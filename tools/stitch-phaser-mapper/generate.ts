import type { LayoutNode } from './types'

const colorLiteral = (color?: string): string => {
  if (!color) return '0xffffff'
  if (color.startsWith('#')) {
    return `0x${color.slice(1)}`
  }
  if (color.startsWith('0x')) {
    return color
  }
  return '0xffffff'
}

export const generatePhaserSnippets = (nodes: LayoutNode[]): string[] => {
  const snippets: string[] = []
  for (const node of nodes) {
    if (node.type === 'text' && node.text) {
      snippets.push(
        `this.add.text(${Math.round(node.x)}, ${Math.round(node.y)}, ${JSON.stringify(node.text)}, { font: '14px Share Tech Mono', color: '#ffffff' }).setOrigin(0, 0);`,
      )
      continue
    }
    if (node.type === 'shape' || node.type === 'frame') {
      snippets.push(
        [
          '{',
          '  const g = this.add.graphics();',
          `  g.fillStyle(${colorLiteral(node.fillColor)}, 1);`,
          `  g.fillRoundedRect(${Math.round(node.x)}, ${Math.round(node.y)}, ${Math.round(node.width)}, ${Math.round(node.height)}, ${Math.round(node.borderRadius ?? 0)});`,
          node.strokeColor
            ? `  g.lineStyle(1, ${colorLiteral(node.strokeColor)}, 1); g.strokeRoundedRect(${Math.round(node.x)}, ${Math.round(node.y)}, ${Math.round(node.width)}, ${Math.round(node.height)}, ${Math.round(node.borderRadius ?? 0)});`
            : '',
          '}',
        ]
          .filter(Boolean)
          .join('\n'),
      )
    }
  }
  return snippets
}
