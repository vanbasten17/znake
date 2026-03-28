import { createEl } from '../../systems/domFactory'

type StatusChipParams = {
  className: string
  text: string
}

export const createStatusChip = (params: StatusChipParams): HTMLSpanElement =>
  createEl('span', params.className, params.text)
