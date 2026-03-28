import { createDomainEventBus } from './domainEventBus'
import { trackRetentionEvent } from './telemetry'

export type TelemetryValue = number | string | boolean | null | undefined

export type TelemetryPayload = {
  [key: string]: TelemetryValue
}

export type NormalizedTelemetryPayload = Record<string, number | string | boolean | null>

export type TelemetryGateway = {
  emit: (eventName: string, payload: NormalizedTelemetryPayload) => void
}

export type TelemetryDomainEvent = {
  eventName: string
  payload: NormalizedTelemetryPayload
}

export const normalizeTelemetryPayload = (
  payload: TelemetryPayload,
): NormalizedTelemetryPayload => {
  const normalized: NormalizedTelemetryPayload = {}
  for (const [key, value] of Object.entries(payload)) {
    normalized[key] = value ?? null
  }
  return normalized
}

const defaultGateway: TelemetryGateway = {
  emit: (eventName, payload) => {
    trackRetentionEvent(eventName, payload)
  },
}

let activeGateway: TelemetryGateway = defaultGateway
const telemetryDomainBus = createDomainEventBus<TelemetryDomainEvent>()

export const setTelemetryGateway = (gateway: TelemetryGateway): void => {
  activeGateway = gateway
}

export const resetTelemetryGateway = (): void => {
  activeGateway = defaultGateway
}

export const emitTelemetryEvent = (
  eventName: string,
  payload: NormalizedTelemetryPayload,
): void => {
  telemetryDomainBus.publish({ eventName, payload })
  activeGateway.emit(eventName, payload)
}

export const subscribeTelemetryDomainEvents = (
  listener: (event: TelemetryDomainEvent, sequence: number) => void,
): (() => void) => telemetryDomainBus.subscribe(listener)
