/** Two bundled guides over one runtime; switches invalidate DSH's cached catalog. */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { isEnabled, type Config } from './prompt.ts'

const ROOT = new URL(import.meta.url.endsWith('/src/host/skills.ts') ? '../../skills/' : '../skills/', import.meta.url)
const GUIDES = [
  { name: 'lantern-chat-ux', setting: 'automaticVisuals', modelInvocable: true },
  { name: 'lantern-visuals', setting: 'advancedVisuals', modelInvocable: false },
] as const

export function skillProvider(config: Config = {}) {
  const flags = () => GUIDES.map(guide => isEnabled(config[guide.setting])).join(':')
  let previous = flags()
  async function read(name: string) {
    const guide = GUIDES.find(item => item.name === name)
    if (!guide || !isEnabled(config[guide.setting])) return undefined
    const directory = new URL(`${guide.name}/`, ROOT)
    const text = await readFile(new URL('SKILL.md', directory), 'utf8')
    // Settings can change while the file is being read.
    if (!isEnabled(config[guide.setting])) return undefined
    const front = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text)
    const description = /^description:\s*(.+)$/m.exec(front?.[1] ?? '')?.[1]?.trim() ?? 'Optional Lantern guide.'
    return {
      name: guide.name, description: description.slice(0, 500),
      invocation: { modelInvocable: guide.modelInvocable, userInvocable: true },
      provider: 'dsh-lantern', source: 'bundled',
      resourceBase: { kind: 'directory' as const, path: fileURLToPath(directory) },
      content: front ? text.slice(front[0].length) : text,
    }
  }
  return {
    name: 'dsh-lantern',
    /** Avoid invalidating other sessions' catalogs for unrelated setting edits. */
    refresh() {
      const next = flags()
      if (next === previous) return false
      previous = next
      return true
    },
    async list() {
      const guides = await Promise.all(GUIDES.map(guide => read(guide.name)))
      return guides.flatMap(guide => {
        if (!guide) return []
        const { content: _content, ...summary } = guide
        return [{ ...summary, rank: 600, locator: guide.name }]
      })
    },
    async get(candidate: { locator?: unknown; name?: string }) {
      return typeof candidate.locator === 'string' ? read(candidate.locator) : undefined
    },
  }
}
