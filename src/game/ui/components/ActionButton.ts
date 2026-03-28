import { createButton } from '../../systems/domFactory'

type ActionButtonParams = {
  className: string
  text: string
  onClick?: () => void
  ariaLabel?: string
  minTargetCss?: string
}

export const createActionButton = (params: ActionButtonParams): HTMLButtonElement => {
  const button = createButton(params.className, params.text, {
    'data-ui-component': 'action-button',
  })
  if (params.onClick) {
    button.addEventListener('click', params.onClick)
  }
  if (params.ariaLabel) {
    button.setAttribute('aria-label', params.ariaLabel)
  }
  const minTarget = params.minTargetCss ?? 'var(--touch-target-min, 24px)'
  button.style.minWidth = minTarget
  button.style.minHeight = minTarget
  return button
}
