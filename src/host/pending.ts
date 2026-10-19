/** Tool calls waiting for the user's answer, keyed by tool call id. */

export type Outcome =
  | { readonly kind: 'answered'; readonly response: unknown }
  | { readonly kind: 'dismissed' }
  | { readonly kind: 'timeout' }
  | { readonly kind: 'closed' }

export type ResponseStatus = 'waiting' | Outcome['kind'] | 'unknown'
export type SettlementStatus = 'settled' | Exclude<ResponseStatus, 'waiting'>

interface Waiter {
  readonly sessionId: string | undefined
  readonly finish: (outcome: Outcome) => void
}

export class PendingResponses {
  private readonly waiters = new Map<string, Waiter>()
  private readonly outcomes = new Map<string, Outcome['kind']>()
  private closed = false

  /**
   * Wait until the visual is answered, dismissed, times out, or the call is
   * cancelled. Never rejects.
   */
  wait(callId: string, sessionId: string | undefined, signal: AbortSignal, timeoutMs: number): Promise<Outcome> {
    if (this.closed) {
      this.outcomes.set(callId, 'closed')
      return Promise.resolve({ kind: 'closed' })
    }
    this.settle(callId, { kind: 'closed' })
    this.outcomes.delete(callId)
    return new Promise<Outcome>(resolve => {
      let done = false
      const finish = (outcome: Outcome) => {
        if (done) return
        done = true
        clearTimeout(timer)
        signal.removeEventListener('abort', onAbort)
        if (this.waiters.get(callId)?.finish === finish) this.waiters.delete(callId)
        this.outcomes.set(callId, outcome.kind)
        resolve(outcome)
      }
      const onAbort = () => finish({ kind: 'closed' })
      const timer = setTimeout(() => finish({ kind: 'timeout' }), timeoutMs)
      // Never keep the process alive just for a waiting visual.
      ;(timer as { unref?: () => void }).unref?.()
      if (signal.aborted) { finish({ kind: 'closed' }); return }
      signal.addEventListener('abort', onAbort, { once: true })
      this.waiters.set(callId, { sessionId, finish })
    })
  }

  isWaiting(callId: string): boolean {
    return this.waiters.has(callId)
  }

  /** Retain the terminal state so a second browser cannot submit the same answer again. */
  status(callId: string): ResponseStatus {
    return this.waiters.has(callId) ? 'waiting' : this.outcomes.get(callId) ?? 'unknown'
  }

  /** Session that owns a waiting call, when known. */
  sessionOf(callId: string): string | undefined {
    return this.waiters.get(callId)?.sessionId
  }

  settle(callId: string, outcome: Outcome): SettlementStatus {
    const waiter = this.waiters.get(callId)
    if (waiter === undefined) return this.outcomes.get(callId) ?? 'unknown'
    waiter.finish(outcome)
    return 'settled'
  }

  /** Release every waiting call (plugin unload). */
  closeAll(): void {
    this.closed = true
    for (const waiter of [...this.waiters.values()]) waiter.finish({ kind: 'closed' })
  }
}
