/** Parent-side checks for the private port a visual opens. */
import { MESSAGE_TAG } from '../frame/runtime.ts'

/** Opaque sandbox origin. A real page origin is never this value. */
export const CHILD_ORIGIN = 'null'

const USER_ACTIONS = new Set(['submit', 'send', 'expand', 'open-link'])
const PASSIVE = new Set(['ready', 'resize', 'hint', 'gl', 'set-state', 'error', 'kept'])

export interface ConnectEvent {
  readonly source: unknown
  readonly origin: string
  readonly data: unknown
  readonly ports: ArrayLike<unknown>
}

/** The one window message that may hand over a port: this frame, this bridge, one port, opaque origin. */
export function acceptConnect(event: ConnectEvent, expected: { source: unknown; bridge: string }): boolean {
  if (expected.source == null || event.source !== expected.source) return false
  if (event.origin !== CHILD_ORIGIN) return false
  if (event.ports.length !== 1) return false
  if (typeof event.data !== 'object' || event.data === null) return false
  const data = event.data as Record<string, unknown>
  return data[MESSAGE_TAG] === 1 && data.type === 'connect' && data.bridge === expected.bridge
}

/** Port messages from an opaque child use "null"; some engines report "". Any other origin is a different page. */
export function childOrigin(origin: string): boolean {
  return origin === CHILD_ORIGIN || origin === ''
}

/** Known port messages only. User actions are the ones that can change DSH or open a link. */
export function readFrameMessage(data: unknown): { type: string; userAction: boolean } | undefined {
  if (typeof data !== 'object' || data === null) return undefined
  const record = data as Record<string, unknown>
  if (record[MESSAGE_TAG] !== 1 || typeof record.type !== 'string') return undefined
  if (USER_ACTIONS.has(record.type)) return { type: record.type, userAction: true }
  if (PASSIVE.has(record.type)) return { type: record.type, userAction: false }
  return undefined
}
