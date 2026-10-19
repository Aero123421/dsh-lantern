/** Tool calls waiting for the user's answer, keyed by tool call id. */

export type Outcome =
  | { readonly kind: 'answered'; readonly response: unknown }
  | { readonly kind: 'dismissed' }
  | { readonly kind: 'timeout' }
  | { readonly kind: 'closed' }

interface Waiter {
  readonly sessionId: string | undefined
  readonly finish: (outcome: Outcome) => void
}

export class PendingResponses {
  private readonly waiters = new Map<string, Waiter>()

  /**
   * Wait until the visual is answered, dismissed, times out, or the call is
   * cancelled. Never rejects.
   */
  wait(callId: string, sessionId: string | undefined, signal: AbortSignal, timeoutMs: number): Promise<Outcome> {
    this.settle(callId, { kind: 'closed' })
    return new Promise<Outcome>(resolve => {
      let done = false
      const finish = (outcome: Outcome) => {
        if (done) return
        done = true
        clearTimeout(timer)
        signal.removeEventListener('abort', onAbort)
        if (this.waiters.get(callId)?.finish === finish) this.waiters.delete(callId)
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

  /** Session that owns a waiting call, when known. */
  sessionOf(callId: string): string | undefined {
    return this.waiters.get(callId)?.sessionId
  }

  settle(callId: string, outcome: Outcome): 'settled' | 'not-waiting' {
    const waiter = this.waiters.get(callId)
    if (waiter === undefined) return 'not-waiting'
    waiter.finish(outcome)
    return 'settled'
  }

  /** Release every waiting call (plugin unload). */
  closeAll(): void {
    for (const waiter of [...this.waiters.values()]) waiter.finish({ kind: 'closed' })
  }
}
