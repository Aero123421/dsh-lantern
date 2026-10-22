/** Live preference and model guidance for conversation visuals. */
import z from '@deepseek-ai/schemastery'
import { TOOL_NAME } from './description.ts'

export type LiveBoolean = boolean | { get(): boolean }

export function isEnabled(value: LiveBoolean | undefined): boolean {
  return typeof value === 'object' && value !== null ? value.get() : value ?? true
}

export interface Config {
  /** Encourage useful visuals without requiring a skill. Changes apply on the next model step. */
  automaticVisuals?: LiveBoolean
  /** Make the optional advanced guide available, without removing rich rendering. */
  advancedVisuals?: LiveBoolean
  /** Minutes an awaited visual waits for an answer. */
  answerTimeoutMinutes?: number
  /** Largest inline HTML argument, in characters. */
  maxHtmlChars?: number
}

/** DSH exposes volatile fields through its revisioned plugin settings service. */
export const Config = z.object({
  automaticVisuals: z.boolean().default(true).volatile(),
  advancedVisuals: z.boolean().default(true).volatile(),
  answerTimeoutMinutes: z.number().min(0.001).max(1440).default(15),
  maxHtmlChars: z.number().min(1).max(4_000_000).default(400_000),
})

export const INTERACTIVE_PROMPT = 'Use show_visual proactively when touching or seeing helps explain, compare, explore, choose, or provide information. '
  + 'Use the preloaded DSH theme and controls, without an outer card, duplicate heading, or custom page background. '
  + 'Prefer choices with an optional labeled text field, concise comparisons, and small interactive diagrams. '
  + 'Keep titles above descriptions, readable contrast, mobile and keyboard access, and reduced motion. '
  + 'Respond to exploration locally; send only an explicit submission. Use await_response only when the answer is needed to continue. '
  + 'Keep conclusions, sources, units, and assumptions in prose; use plain text for simple answers. '
  + 'Use panel for more space, replace to revise, and lantern.setState/getState for intentional saved inputs. '
  + 'Custom HTML, SVG, Canvas, and WebGL remain available. No skill loading is required for ordinary visuals.'

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
      const enabled = isEnabled(value)
      return enabled && ctx.tools.get(TOOL_NAME, scope) !== undefined ? INTERACTIVE_PROMPT : ''
    },
  })
}
