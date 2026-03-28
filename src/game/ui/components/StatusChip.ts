import { createEl } from '../../systems/domFactory'

type StatusChipParams = {
  className: string
  text: string
  variant?: 'default' | 'muted' | 'positive' | 'warning'
}

const STATUS_CHIP_VARIANT_CLASS: Record<NonNullable<StatusChipParams['variant']>, string> = {
  default: '',
  muted: 'status-chip-muted',
  positive: 'status-chip-positive',
  warning: 'status-chip-warning',
}

export const createStatusChip = (params: StatusChipParams): HTMLSpanElement => {
  const variantClass = params.variant ? STATUS_CHIP_VARIANT_CLASS[params.variant] : ''
  const className = variantClass ? `${params.className} ${variantClass}` : params.className
  return createEl('span', className, params.text)
}
