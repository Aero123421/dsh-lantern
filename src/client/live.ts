/**
 * Whether a visual may run scripts.
 *
 * Auto-run only on the card's first live display in the page that created it.
 * A restored card — a past conversation, a reload, or a visual that is still
 * waiting for an answer — stays paused until the user presses Run. Leaving
 * the card ends that display; opening it again does not start the scripts.
 */

export type LivePhase = 'preparing' | 'start' | 'result' | 'replay'

/** True when this paint is the call being created now, not a snapshot from before the page. */
export function isLiveBirth(phase: LivePhase, bornAt: number | undefined, pageBorn: number): boolean {
  // `preparing` exists only while arguments are streaming. Restored calls,
  // including ones still waiting, are already `start` or `result`.
  if (phase === 'preparing') return true
  if (phase === 'replay' || bornAt === undefined) return false
  return bornAt >= pageBorn
}

interface Entry {
  run: boolean
  mounts: number
  armed: boolean
  timer?: number
}

export interface LiveScripts {
  observe(key: string, liveBirth: boolean): boolean
  /** Drop an automatic run that the user has not confirmed. */
  hold(key: string): boolean
  enabled(key: string): boolean
  arm(key: string): void
  retain(key: string): void
  release(key: string): void
  /** Tell subscribers the map changed. Not called from observe, which runs during render. */
  poke(): void
  subscribe(listener: () => void): () => void
}

const IDLE_MS = 1500

export function createLiveScripts(
  schedule: (fn: () => void, ms: number) => number = setTimeout as unknown as (fn: () => void, ms: number) => number,
  cancel: (id: number) => void = clearTimeout as unknown as (id: number) => void,
): LiveScripts {
  const entries = new Map<string, Entry>()
  const listeners = new Set<() => void>()
  const notify = () => { for (const listener of listeners) listener() }
  return {
    observe(key, liveBirth) {
      if (entries.has(key)) return false
      entries.set(key, { run: liveBirth, mounts: 0, armed: false })
      return true
    },
    hold(key) {
      const entry = entries.get(key)
      if (!entry || entry.armed || !entry.run) return false
      entry.run = false
      return true
    },
    poke() { notify() },
    enabled(key) {
      const entry = entries.get(key)
      return entry !== undefined && (entry.run || entry.armed)
    },
    arm(key) {
      const entry = entries.get(key) ?? { run: false, mounts: 0, armed: false }
      entry.run = true
      entry.armed = true
      entries.set(key, entry)
      notify()
    },
    retain(key) {
      const entry = entries.get(key)
      if (!entry) return
      if (entry.timer !== undefined) { cancel(entry.timer); entry.timer = undefined }
      entry.mounts++
    },
    release(key) {
      const entry = entries.get(key)
      if (!entry) return
      entry.mounts = Math.max(0, entry.mounts - 1)
      if (entry.mounts > 0 || entry.timer !== undefined) return
      entry.timer = schedule(() => {
        entry.timer = undefined
        if (entry.mounts === 0) {
          entry.run = false
          entry.armed = false
          notify()
        }
      }, IDLE_MS)
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

const PAGE_BORN = Date.now()
const gate = createLiveScripts()

export function observeVisual(key: string, phase: LivePhase, bornAt: number | undefined, allowAuto = true): boolean {
  return gate.observe(key, allowAuto && isLiveBirth(phase, bornAt, PAGE_BORN))
}

/** A workspace page must not keep an automatic run. Returns whether that changed. */
export function holdScripts(key: string): boolean {
  return gate.hold(key)
}

export function scriptsEnabled(key: string): boolean {
  return gate.enabled(key)
}

export function armScripts(key: string): void {
  gate.arm(key)
}

export function retainScripts(key: string): void {
  gate.retain(key)
}

export function releaseScripts(key: string): void {
  gate.release(key)
}

export function subscribeScripts(listener: () => void): () => void {
  return gate.subscribe(listener)
}

export function notifyScripts(): void {
  gate.poke()
}
