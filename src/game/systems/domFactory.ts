export const createEl = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] => {
  const el = document.createElement(tag)
  if (className) {
    el.className = className
  }
  if (text !== undefined) {
    el.textContent = text
  }
  return el
}

export const applyElementAttrs = (
  element: HTMLElement,
  attrs: Record<string, string | number | boolean | null | undefined>,
): void => {
  for (const [key, rawValue] of Object.entries(attrs)) {
    if (rawValue === null || rawValue === undefined || rawValue === false) {
      continue
    }
    if (rawValue === true) {
      element.setAttribute(key, '')
      continue
    }
    element.setAttribute(key, String(rawValue))
  }
}

export const createButton = (
  className: string,
  text: string,
  attrs?: Record<string, string | number | boolean | null | undefined>,
): HTMLButtonElement => {
  const button = createEl('button', className, text)
  button.type = 'button'
  if (attrs) {
    applyElementAttrs(button, attrs)
  }
  return button
}
