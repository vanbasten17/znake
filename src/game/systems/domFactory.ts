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

export const createButton = (className: string, text: string): HTMLButtonElement => {
  const button = createEl('button', className, text)
  button.type = 'button'
  return button
}
