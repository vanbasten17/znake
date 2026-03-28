import { createEl } from '../../systems/domFactory'

type PanelSectionParams = {
  className: string
  titleClassName?: string
  titleText?: string
  contentClassName?: string
}

export const createPanelSection = (
  params: PanelSectionParams,
): {
  section: HTMLElement
  content: HTMLDivElement
} => {
  const section = createEl('section', params.className)
  if (params.titleText) {
    section.append(createEl('h2', params.titleClassName, params.titleText))
  }
  const content = createEl('div', params.contentClassName)
  section.append(content)
  return { section, content }
}
