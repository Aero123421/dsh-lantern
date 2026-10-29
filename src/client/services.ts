/**
 * The DSH services the browser half uses, captured once at `apply`, plus the
 * actions a visual can trigger: answering, skipping, sending a message as the
 * user, and opening the sidebar.
 */
import { copy } from './i18n.ts'
import { getRecord, readLocal, visualKey, writeLocal } from './store.ts'

export const TAB_ID = 'dsh-lantern/visual'
export const TAB_KIND = 'lanternVisual'
// DSH only opens resources under its own scheme.
const ADDRESS_PREFIX = 'dsh-resource://lantern-visual/'

interface SidebarRight {
  openResource(address: string, options?: { kind?: string; params?: unknown }): unknown
}
interface Sessions {
  scope(sessionId: string): { get(name: string): unknown } | undefined
}

let sidebar: SidebarRight | undefined
let sessions: Sessions | undefined
let binding: object | undefined

/** Release only this activation's host references when Cordis unloads it. */
export function bind(services: { sidebarRight?: unknown; sessions?: unknown }): () => void {
  const owner = {}
  binding = owner
  sidebar = services.sidebarRight as SidebarRight | undefined
  sessions = services.sessions as Sessions | undefined
  return () => {
    if (binding !== owner) return
    binding = undefined
    sidebar = undefined
    sessions = undefined
  }
}

export function addressOf(sessionId: string, callId: string): string {
  return ADDRESS_PREFIX + encodeURIComponent(sessionId) + '/' + encodeURIComponent(callId)
}

export function parseAddress(address: string | undefined): { sessionId: string; callId: string } | undefined {
  if (!address || !address.startsWith(ADDRESS_PREFIX)) return undefined
  const [session, call] = address.slice(ADDRESS_PREFIX.length).split('/')
  if (!session || !call) return undefined
  try { return { sessionId: decodeURIComponent(session), callId: decodeURIComponent(call) } } catch { return undefined }
}

export function openInSidebar(sessionId: string | undefined, callId: string): void {
  if (!sidebar || !sessionId) return
  try { sidebar.openResource(addressOf(sessionId, callId), { kind: TAB_KIND }) } catch (error) { console.warn('[dsh-lantern] could not open the sidebar', error) }
}

/** POST to a Lantern route on the DSH host (document-relative, cookie auth). */
export async function call<T>(method: string, payload: unknown): Promise<T> {
  const response = await fetch(new URL(`api/${method}`, document.baseURI), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'same-origin',
  })
  let body: { ok?: boolean; value?: T; error?: { message?: string } } | undefined
  try { body = await response.json() } catch { body = undefined }
  if (!response.ok || !body?.ok) throw new Error(body?.error?.message ?? `HTTP ${response.status}`)
  return body.value as T
}

export async function sendAsUser(sessionId: string | undefined, text: string): Promise<void> {
  if (!sessionId) throw new Error('no session')
  const scope = sessions?.scope(sessionId)
  const conversation = scope?.get('conversation') as { send(text: string): Promise<void> } | undefined
  if (!conversation) throw new Error('conversation service unavailable')
  await conversation.send(text)
}

function answerText(title: string, value: unknown): string {
  const head = `${copy().answerPrefix} — ${title || copy().visual}`
  if (typeof value === 'string') return `${head}: ${value}`
  // A flat object reads best as one field per line, for the user and the agent alike.
  if (value && typeof value === 'object' && !Array.isArray(value)
    && Object.values(value).every(item => item === null || typeof item !== 'object')) {
    return [head, ...Object.entries(value).map(([key, item]) => `${key}: ${typeof item === 'string' ? item : JSON.stringify(item)}`)].join('\n')
  }
  return `${head}: ${JSON.stringify(value)}`
}

/**
 * Answer a visual: straight into a waiting tool call, or as a user message
 * for a non-waiting visual or an explicitly timed-out question.
 */
const answering = new Set<string>()

export async function answer(callId: string, sessionId: string | undefined, value: unknown): Promise<void> {
  const session = sessionId ?? getRecord(callId, sessionId)?.sessionId
  const key = visualKey(callId, session)
  // Reject repeated clicks immediately. The browser lock additionally
  // serializes this operation with other tabs using the same storage.
  if (answering.has(key)) throw new Error('already answered')
  answering.add(key)
  try {
    const submit = async () => {
      // Re-read after acquiring the lock: another tab may have answered
      // while this one was waiting for its turn.
      const record = getRecord(callId, session)
      if (readLocal(callId, session).answer !== undefined || record?.result?.status === 'answered') throw new Error('already answered')
      if (record?.error !== undefined || record?.result?.status === 'dismissed' || record?.result?.status === 'closed') throw new Error('This visual is already closed.')
      if (record?.args?.await) {
        const { status } = await call<{ status: string }>('lantern.respond', { sessionId: session, callId, response: value })
        if (status === 'settled') {
          writeLocal(callId, { answer: JSON.stringify(value) }, session)
          return
        }
        if (status === 'answered') throw new Error('already answered')
        if (status !== 'timeout') throw new Error('This visual is no longer waiting for an answer.')
      }
      await sendAsUser(session, answerText(record?.args?.title ?? '', value))
      writeLocal(callId, { answer: JSON.stringify(value) }, session)
    }
    let locks: LockManager | undefined
    try { locks = globalThis.navigator?.locks } catch { /* unavailable in some browser privacy modes */ }
    if (locks === undefined) await submit()
    else {
      let entered = false
      try { await locks.request('dsh-lantern:answer:' + key, () => { entered = true; return submit() }) }
      catch (error) {
        // Do not repeat a send that already began. Some browsers expose
        // Web Locks but deny access along with their storage APIs.
        if (entered || !(error instanceof Error) || error.name !== 'SecurityError') throw error
        await submit()
      }
    }
  } finally {
    answering.delete(key)
  }
}

/** Skip a waiting visual. Returns false when the agent was no longer waiting. */
export async function dismiss(callId: string, sessionId: string | undefined): Promise<boolean> {
  const { status } = await call<{ status: string }>('lantern.dismiss', { sessionId, callId })
  return status === 'settled'
}

export async function workspaceUrl(sessionId: string, callId: string): Promise<string> {
  const { url } = await call<{ url: string }>('lantern.file', { sessionId, callId })
  return new URL(url, document.baseURI).href
}

/** Restore a sidebar whose tool row is outside the browser's loaded history. */
export function fetchVisual(sessionId: string, callId: string): Promise<{ arguments: string; seq?: number; meta?: unknown; error?: string }> {
  return call('lantern.visual', { sessionId, callId })
}
