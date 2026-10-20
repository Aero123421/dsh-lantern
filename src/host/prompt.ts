/** Live preference and model guidance for conversation visuals. */
import z from '@deepseek-ai/schemastery'
import { TOOL_NAME } from './description.ts'

type LiveBoolean = boolean | { get(): boolean }

export interface Config {
  /** Encourage useful visuals without requiring a skill. Changes apply on the next model step. */
  automaticVisuals?: LiveBoolean
  /** Minutes an awaited visual waits for an answer. */
  answerTimeoutMinutes?: number
  /** Largest inline HTML argument, in characters. */
  maxHtmlChars?: number
}

/** DSH exposes volatile fields through its revisioned plugin settings service. */
export const Config = z.object({
  automaticVisuals: z.boolean().default(true).volatile(),
  answerTimeoutMinutes: z.number().min(0.001).max(1440).default(15),
  maxHtmlChars: z.number().min(1).max(4_000_000).default(400_000),
})

export const INTERACTIVE_PROMPT = 'Use show_visual proactively when a visual or interaction helps explain, compare, explore, or decide. '
  + 'Prefer one compact inline card with a clear purpose; use the panel when more space helps. '
  + 'Keep the key answer and sources in prose. Use real data, labeled units, and explicit assumptions. '
  + 'Use the preloaded theme and semantic controls that work on mobile and by keyboard; respect reduced motion. '
  + 'Make exploration respond locally; send only a deliberate user submission. '
  + 'Use await_response only when an answer is needed to continue. Preserve inputs with lantern.setState/getState and revise with replace. '
  + 'Use plain text for simple answers. No skill loading is required.'

export interface PromptHost {
  tools: { get(name: string, scope?: unknown): unknown }
  systemPrompt: {
    section(section: {
      name: string
      order: number
      interpolate: false
      text(context: { scope?: unknown }): string
    }): unknown
  }
}

const registered = new WeakSet<object>()

/** Register one scope-aware section. A second call on the same host is ignored. DSH disposes the section on uninstall. */
export function registerPrompt(ctx: PromptHost, config: Config): void {
  if (registered.has(ctx)) return
  registered.add(ctx)
  ctx.systemPrompt.section({
    name: 'ui:lantern-interactive',
    order: 10110,
    interpolate: false,
    text({ scope }) {
      const value = config.automaticVisuals
      const enabled = typeof value === 'object' && value !== null ? value.get() : value ?? true
      return enabled && ctx.tools.get(TOOL_NAME, scope) !== undefined ? INTERACTIVE_PROMPT : ''
    },
  })
}
