import { createButton } from '../../systems/domFactory'

type ActionButtonParams = {
  className: string
  text: string
  onClick?: () => void
  ariaLabel?: string
  minTargetPx?: number
}

export const createActionButton = (params: ActionButtonParams): HTMLButtonElement => {
  const button = createButton(params.className, params.text)
  if (params.onClick) {
    button.addEventListener('click', params.onClick)
  }
  if (params.ariaLabel) {
    button.setAttribute('aria-label', params.ariaLabel)
  }
  const minTargetPx = params.minTargetPx ?? 24
  button.style.minWidth = `${minTargetPx}px`
  button.style.minHeight = `${minTargetPx}px`
  return button
}
