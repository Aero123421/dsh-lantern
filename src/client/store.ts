/**
 * What the browser knows about each visual, keyed by tool call id: the
 * arguments, the recorded result, where it is currently mounted, and the
 * per-visual state kept in this browser (answer, widget state, collapsed).
 */
import { useSyncExternalStore } from 'react'
import type { VisualState } from '../frame/runtime.ts'

export interface VisualArgs {
  readonly title: string
  readonly html?: string
  readonly path?: string
  readonly display: 'inline' | 'panel'
  readonly await: boolean
  readonly replace?: string
}

export interface VisualResultMeta {
  readonly status: 'shown' | 'answered' | 'dismissed' | 'timeout' | 'closed'
  readonly response?: string
  readonly path?: string
  readonly source?: { readonly kind: 'local'; readonly root: string; readonly path: string }
}

export interface VisualRecord {
  readonly callId: string
  readonly sessionId?: string
  readonly seq?: number
  readonly args?: VisualArgs
  readonly result?: VisualResultMeta
  readonly error?: string
}

export function parseArgs(raw: string | undefined | null): VisualArgs | undefined {
  if (!raw) return undefined
  let value: unknown
  try { value = JSON.parse(raw) } catch { return undefined }
  if (typeof value !== 'object' || value === null) return undefined
  const v = value as Record<string, unknown>
  const html = typeof v.html === 'string' && v.html !== '' ? v.html : undefined
  const path = typeof v.path === 'string' && v.path !== '' ? v.path : undefined
  return {
    title: typeof v.title === 'string' && v.title.trim() !== '' ? v.title.trim() : '',
    ...html !== undefined ? { html } : {},
    ...path !== undefined ? { path } : {},
    display: path !== undefined || v.display === 'panel' ? 'panel' : 'inline',
    await: v.await_response === true,
    ...typeof v.replace === 'string' && v.replace.trim() !== '' ? { replace: v.replace.trim() } : {},
  }
}

export function parseMeta(meta: unknown): VisualResultMeta | undefined {
  if (typeof meta !== 'object' || meta === null) return undefined
  const m = meta as Record<string, unknown>
  const status = m.status
  if (status !== 'shown' && status !== 'answered' && status !== 'dismissed' && status !== 'timeout' && status !== 'closed') return undefined
  const source = m.source !== null && typeof m.source === 'object' ? m.source as Record<string, unknown> : undefined
  return {
    status,
    ...typeof m.response === 'string' ? { response: m.response } : {},
    ...typeof m.path === 'string' ? { path: m.path } : {},
    ...source?.kind === 'local' && typeof source.root === 'string' && typeof source.path === 'string'
      ? { source: { kind: 'local' as const, root: source.root, path: source.path } } : {},
  }
}

// ── registry ──────────────────────────────────────────────────────────────

const records = new Map<string, VisualRecord>()
const tailMounted = new Map<string, number>()
let version = 0
const listeners = new Set<() => void>()

/** Forked sessions can contain the same tool call ids. */
export function visualKey(callId: string, sessionId: string | undefined): string {
  return JSON.stringify([sessionId ?? '', callId])
}

function notify(): void {
  version++
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function upsert(callId: string, patch: Partial<Omit<VisualRecord, 'callId'>>): void {
  const key = visualKey(callId, patch.sessionId)
  const previous = records.get(key)
  let changed = previous === undefined
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue
    const before = (previous as Record<string, unknown> | undefined)?.[key]
    if (before === value) continue
    if (typeof value === 'object' && JSON.stringify(before) === JSON.stringify(value)) continue
    changed = true
  }
  if (!changed) return
  const next: Record<string, unknown> = { ...previous, callId }
  for (const [key, value] of Object.entries(patch)) if (value !== undefined) next[key] = value
  records.set(key, next as unknown as VisualRecord)
  queueNotify()
}

let pendingNotify = false
function queueNotify(): void {
  if (pendingNotify) return
  pendingNotify = true
  queueMicrotask(() => { pendingNotify = false; notify() })
}

export function getRecord(callId: string, sessionId?: string): VisualRecord | undefined {
  return records.get(visualKey(callId, sessionId))
}

let replacedIndex: { version: number; map: Map<string, string> } | undefined

/** Old id → newest direct replacement, rebuilt once per registry change. */
function replacements(): Map<string, string> {
  if (replacedIndex?.version === version) return replacedIndex.map
  const map = new Map<string, string>()
  for (const record of records.values()) {
    const old = record.args?.replace
    if (old === undefined || old === record.callId || record.error) continue
    const key = visualKey(old, record.sessionId)
    const previous = map.get(key)
    if (previous === undefined || (record.seq ?? 0) > (getRecord(previous, record.sessionId)?.seq ?? 0)) map.set(key, record.callId)
  }
  replacedIndex = { version, map }
  return map
}

/** The visual that replaced `callId`, following chains to the newest. */
export function replacementOf(callId: string, sessionId?: string): string | undefined {
  const map = replacements()
  let found: string | undefined
  let current = callId
  for (let hops = 0; hops < 20; hops++) {
    const next = map.get(visualKey(current, sessionId))
    if (next === undefined) break
    found = next
    current = next
  }
  return found
}

export function useRegistry<T>(select: () => T): T {
  const cache = useSyncExternalStore(subscribe, () => version)
  void cache
  return select()
}

export function markTail(callId: string, sessionId?: string): () => void {
  const key = visualKey(callId, sessionId)
  tailMounted.set(key, (tailMounted.get(key) ?? 0) + 1)
  queueNotify()
  return () => {
    const count = (tailMounted.get(key) ?? 1) - 1
    if (count <= 0) tailMounted.delete(key)
    else tailMounted.set(key, count)
    queueNotify()
  }
}

export function inTail(callId: string, sessionId?: string): boolean {
  return tailMounted.has(visualKey(callId, sessionId))
}

// ── per-browser state ─────────────────────────────────────────────────────

interface Local { answer?: string; state?: string; collapsed?: boolean; at?: number }

const KEY = 'dsh-lantern:v1:'
/** Visuals remembered in this browser; the oldest are forgotten first. */
const MAX_ENTRIES = 300
const memory = new Map<string, Local>()
const unsaved = new Set<string>()

/** Publish same-origin changes from other tabs and discard the superseded memory copy. */
export function watchLocalStorage(): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && !event.key.startsWith(KEY)) return
    if (event.key === null) { memory.clear(); unsaved.clear() }
    else {
      const key = event.key.slice(KEY.length)
      memory.delete(key)
      unsaved.delete(key)
    }
    queueNotify()
  }
  window.addEventListener('storage', onStorage)
  return () => window.removeEventListener('storage', onStorage)
}

export function readLocal(callId: string, sessionId?: string): Local {
  const key = visualKey(callId, sessionId)
  const cached = memory.get(key)
  if (unsaved.has(key) && cached !== undefined) return cached
  try {
    const raw = localStorage.getItem(KEY + key)
    const value: unknown = raw ? JSON.parse(raw) : undefined
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Local : {}
  } catch { return cached ?? {} }
}

export function writeLocal(callId: string, patch: Partial<Local>, sessionId?: string): void {
  const key = visualKey(callId, sessionId)
  const next = { ...readLocal(callId, sessionId), ...patch, at: Date.now() }
  // Keep answers and widget state even when storage is denied or full.
  memory.delete(key)
  memory.set(key, next)
  if (memory.size > MAX_ENTRIES) {
    const oldest = memory.keys().next().value!
    memory.delete(oldest)
    unsaved.delete(oldest)
  }
  let saved = false
  try {
    localStorage.setItem(KEY + key, JSON.stringify(next))
    saved = true
    prune()
  } catch { /* storage unavailable: state lives for this page only */ }
  if (saved) unsaved.delete(key)
  else unsaved.add(key)
  queueNotify()
}

function prune(): void {
  const entries: [string, number][] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(KEY)) continue
    let at = 0
    try { at = Number((JSON.parse(localStorage.getItem(key) ?? '{}') as Local).at) || 0 } catch { at = 0 }
    entries.push([key, at])
  }
  if (entries.length <= MAX_ENTRIES) return
  entries.sort((a, b) => a[1] - b[1])
  for (const [key] of entries.slice(0, entries.length - MAX_ENTRIES)) localStorage.removeItem(key)
}

export function parseJson(text: string | undefined): unknown {
  if (text === undefined) return undefined
  try { return JSON.parse(text) } catch { return text }
}

/** The state a visual shows, from its recorded result and this browser's answer. */
export function visualState(record: VisualRecord, phase: 'preparing' | 'start' | 'result' | 'replay'): { state: VisualState; response: unknown } {
  const local = readLocal(record.callId, record.sessionId)
  const result = record.result
  if (result?.status === 'answered') return { state: 'answered', response: parseJson(result.response) }
  if (local.answer !== undefined) return { state: 'answered', response: parseJson(local.answer) }
  if (result?.status === 'dismissed') return { state: 'dismissed', response: undefined }
  if (result?.status === 'timeout') return { state: 'timeout', response: undefined }
  if (result?.status === 'closed') return { state: 'closed', response: undefined }
  if (result === undefined && record.args?.await && phase !== 'preparing') return { state: 'waiting', response: undefined }
  return { state: 'idle', response: undefined }
}
