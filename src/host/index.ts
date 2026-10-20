/**
 * dsh-lantern, host half: the `show_visual` tool, the routes the browser
 * uses to answer a waiting visual, workspace HTML serving for the sidebar,
 * and the `lantern-visuals` skill.
 *
 * DSH services are reached through the Cordis context with structural types;
 * the live configuration schema uses DSH's Schemastery package.
 */
import { readFile, realpath } from 'node:fs/promises'
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PARAMETERS, SKILL_NAME, TOOL_NAME, toolDescription } from './description.ts'
import { FILE_ROUTE, FileRefusal, FileServer, resolveEntry } from './files.ts'
import { readRecordedVisual, recordedSource, recordedStatus, type VisualSource } from './history.ts'
import { PendingResponses, type Outcome } from './pending.ts'
import { registerPrompt, type Config, type PromptHost } from './prompt.ts'

export { Config } from './prompt.ts'

export const name = 'dsh-lantern'
export const inject = ['tools', 'connection', 'systemPrompt']

type Status = 'shown' | 'answered' | 'dismissed' | 'timeout' | 'closed'

/** The tool's return value; also stored as the result's presentation meta. */
export interface VisualResult {
  id: string
  status: Status
  display: 'inline' | 'panel'
  title: string
  path?: string
  /** The host-local source as resolved when this call ran, also persisted in presentation metadata. */
  source?: VisualSource
  replace?: string
  /** The user's answer as JSON text. */
  response?: string
}

const MAX_RESPONSE_CHARS = 64 * 1024

interface ToolExec {
  readonly callId: string
  readonly signal: AbortSignal
  readonly agent?: {
    readonly id?: string
    readonly session?: { readonly id?: string; readonly header?: { readonly cwd?: string } }
  }
}

interface HostContext extends PromptHost {
  tools: PromptHost['tools'] & { register(definition: unknown): unknown }
  readonly fiber: unknown
  connection: {
    fetch: {
      register(route: {
        path: string
        methods: readonly string[]
        requestBody: 'buffered'
        fetch(request: Request): Promise<Response>
      }): unknown
    }
  }
  get(name: string): unknown
  inject(deps: readonly string[], callback: (scope: HostContext) => void): unknown
  effect(execute: () => unknown, label?: string): unknown
  on(event: string, listener: (...args: unknown[]) => unknown): unknown
  [key: string]: unknown
}

// lib/index.js in the package; src/host/index.ts when the tests run the source.
const SKILL_DIR = new URL(import.meta.url.endsWith('/src/host/index.ts') ? '../../skills/lantern-visuals/' : '../skills/lantern-visuals/', import.meta.url)

function positive(value: unknown, fallback: number, what: string, max: number): number {
  if (value === undefined) return fallback
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > max) throw new Error(`dsh-lantern: ${what} must be a number between 0 and ${max}`)
  return value
}

/** Waiting calls are keyed by session and call, since forks copy call ids. */
function waitKey(sessionId: string | undefined, callId: string): string {
  return JSON.stringify([sessionId ?? '', callId])
}

export function apply(rawCtx: unknown, config: Config = {}): void {
  const ctx = rawCtx as HostContext
  registerPrompt(ctx, config)
  const timeoutMinutes = positive(config?.answerTimeoutMinutes, 15, 'answerTimeoutMinutes', 24 * 60)
  const maxHtml = positive(config?.maxHtmlChars, 400_000, 'maxHtmlChars', 4_000_000)
  const pending = new PendingResponses()
  const files = new FileServer()
  /** A pending path resolution is shared with the browser while an awaited tool is still running. */
  const sources = new Map<string, Promise<VisualSource>>()
  /** Real path of each session's working directory, from the last tool call or from DSH. */
  const cwdBySession = new Map<string, string>()
  const MAX_TRACKED = 256

  function remember<K, V>(map: Map<K, V>, key: K, value: V): void {
    map.delete(key)
    map.set(key, value)
    while (map.size > MAX_TRACKED) {
      const oldest = map.keys().next().value
      if (oldest === undefined) break
      map.delete(oldest)
    }
  }

  ctx.effect(() => () => { pending.closeAll(); sources.clear(); cwdBySession.clear() }, 'dsh-lantern: release waiting visuals')

  async function sessionCwd(sessionId: string): Promise<string | undefined> {
    const known = cwdBySession.get(sessionId)
    if (known !== undefined) return known
    const sessions = ctx.get('sessions') as { get(id: string): { header?: { cwd?: string } } | undefined } | undefined
    const live = sessions?.get(sessionId)?.header?.cwd
    if (live) return live
    const persistence = ctx.get('sessionPersistence') as { stat(id: string): Promise<{ header?: { cwd?: string } } | undefined> } | undefined
    const stored = await persistence?.stat(sessionId).catch(() => undefined)
    return stored?.header?.cwd
  }

  async function execCwd(exec: ToolExec): Promise<string | undefined> {
    // A failure from workingDirectory.ensure is not swallowed: the header cwd
    // can name a different machine than the one that would read the file.
    const wd = ctx.get('workingDirectory') as { ensure(agent: unknown, signal: AbortSignal): Promise<string> } | undefined
    if (wd && exec.agent) return wd.ensure(exec.agent, exec.signal)
    return exec.agent?.session?.header?.cwd
  }

  function insideDirectory(root: string, cwd: string): boolean {
    const rel = relative(cwd, root)
    return rel === '' || (rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel))
  }

  async function localRoot(path: string): Promise<string> {
    const fs = ctx.get('fs') as { processPathFromHostPath(hostPath: string): string | undefined } | undefined
    const mapped = fs?.processPathFromHostPath(path)
    if (mapped === undefined || resolve(mapped) !== resolve(path)) {
      throw new FileRefusal('Workspace file visuals require a host-local filesystem. Use `html` for remote execution.', 403)
    }
    return realpath(path).catch(() => { throw new FileRefusal('The original visual directory is not available.', 404) })
  }

  async function resolveSource(exec: ToolExec, path: string): Promise<VisualSource> {
    const cwd = await execCwd(exec)
    if (cwd === undefined) throw new Error('show_visual: no working directory for `path`; pass `html` instead.')
    const root = await localRoot(cwd)
    const entry = await resolveEntry(root, path)
    return { kind: 'local', root, path: entry }
  }

  async function sourceOf(sessionId: string, callId: string): Promise<VisualSource> {
    const key = waitKey(sessionId, callId)
    const running = sources.get(key)
    if (running) return running
    const visual = await readRecordedVisual(ctx, sessionId, callId)
    const source = visual?.error === undefined ? recordedSource(visual?.meta, callId) : undefined
    if (!source) throw new RouteError('no-source', 'This visual has no saved local source. Create the visual again to open its file.')
    const resolved = Promise.resolve(source)
    remember(sources, key, resolved)
    return source
  }

  ctx.tools.register({
    name: TOOL_NAME,
    description: toolDescription(timeoutMinutes),
    parameters: PARAMETERS,
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          status: { type: 'string', enum: ['shown', 'answered', 'dismissed', 'timeout', 'closed'] },
          display: { type: 'string', enum: ['inline', 'panel'] },
          title: { type: 'string' },
          path: { type: 'string' },
          source: {
            type: 'object',
            additionalProperties: false,
            properties: { kind: { type: 'string', enum: ['local'] }, root: { type: 'string' }, path: { type: 'string' } },
            required: ['kind', 'root', 'path'],
          },
          replace: { type: 'string' },
          response: { type: 'string' },
        },
        required: ['id', 'status', 'display', 'title'],
      },
      render: (_args: unknown, value: VisualResult) => [{ type: 'text', text: resultText(value, timeoutMinutes) }],
      presentationMeta: (_args: unknown, value: VisualResult) => ({ lantern: 1, ...value }),
    },
    async execute(rawArgs: unknown, exec: ToolExec): Promise<VisualResult> {
      const args = readArgs(rawArgs, maxHtml)
      const sessionId = exec.agent?.session?.id ?? exec.agent?.id
      const base: VisualResult = {
        id: exec.callId,
        status: 'shown',
        display: args.path !== undefined ? 'panel' : args.display,
        title: args.title,
        ...args.replace !== undefined ? { replace: args.replace } : {},
      }
      if (args.path !== undefined) {
        if (sessionId === undefined) throw new Error('show_visual: workspace files require a session; pass `html` instead.')
        const key = waitKey(sessionId, exec.callId)
        const source = resolveSource(exec, args.path)
        remember(sources, key, source)
        try {
          base.source = await source
          base.path = base.source.path
          remember(cwdBySession, sessionId, base.source.root)
        } catch (error) {
          if (sources.get(key) === source) sources.delete(key)
          if (error instanceof FileRefusal) throw new Error(`show_visual: ${error.message}`)
          throw error
        }
      }
      if (!args.await) return base
      const outcome: Outcome = await pending.wait(waitKey(sessionId, exec.callId), sessionId, exec.signal, timeoutMinutes * 60_000)
      switch (outcome.kind) {
        case 'answered': return { ...base, status: 'answered', response: String(outcome.response) }
        case 'dismissed': return { ...base, status: 'dismissed' }
        case 'timeout': return { ...base, status: 'timeout' }
        case 'closed': return { ...base, status: 'closed' }
      }
    },
  })

  // Browser → host. Only authenticated owner peers reach these routes.
  route(ctx, 'lantern.respond', async (payload) => {
    const { sessionId, callId, key } = callIdentity(payload)
    const response = payload.response
    let json: string
    try { json = JSON.stringify(response === undefined ? null : response) } catch { throw new RouteError('bad-response', 'The answer is not JSON.') }
    if (json.length > MAX_RESPONSE_CHARS) throw new RouteError('too-large', 'The answer exceeds 65,536 JSON characters.')
    const status = pending.settle(key, { kind: 'answered', response: json })
    return { status: status === 'unknown' ? recordedStatus(await readRecordedVisual(ctx, sessionId, callId), callId) : status }
  })
  route(ctx, 'lantern.dismiss', async (payload) => {
    const { sessionId, callId, key } = callIdentity(payload)
    const status = pending.settle(key, { kind: 'dismissed' })
    return { status: status === 'unknown' ? recordedStatus(await readRecordedVisual(ctx, sessionId, callId), callId) : status }
  })
  route(ctx, 'lantern.waiting', async (payload) => {
    const { sessionId, callId, key } = callIdentity(payload)
    const current = pending.status(key)
    const status = current === 'unknown' ? recordedStatus(await readRecordedVisual(ctx, sessionId, callId), callId) : current
    return { waiting: status === 'waiting', status }
  })
  route(ctx, 'lantern.file', async (payload) => {
    const { sessionId, callId } = callIdentity(payload)
    let source: VisualSource
    let rel: string
    try {
      source = await sourceOf(sessionId, callId)
      const cwd = await sessionCwd(sessionId)
      if (cwd === undefined) throw new RouteError('no-session', 'The session working directory is unknown.')
      const cwdReal = await localRoot(cwd)
      const rootReal = await localRoot(source.root)
      if (rootReal !== source.root) throw new FileRefusal('The original visual directory changed location.', 403)
      if (!insideDirectory(rootReal, cwdReal)) throw new FileRefusal('The saved folder is outside the session working directory.', 403)
      rel = await resolveEntry(rootReal, source.path)
    } catch (error) {
      if (error instanceof FileRefusal) throw new RouteError('refused', error.message)
      throw error
    }
    // The link covers the page's own folder (and below), not the workspace.
    const entry = join(source.root, rel)
    const token = files.grant(dirname(entry))
    return { url: `${FILE_ROUTE.slice(1)}/${token}/${encodeURIComponent(basename(entry))}`, path: rel }
  })
  route(ctx, 'lantern.visual', async (payload) => {
    const { sessionId, callId } = callIdentity(payload)
    const visual = await readRecordedVisual(ctx, sessionId, callId)
    if (!visual) throw new RouteError('no-visual', 'The visual was not found in this session.')
    return visual
  })

  ctx.inject(['webServer'], (scope) => {
    const webServer = scope.webServer as { register(route: { kind: 'prefix'; path: string; handler: FileServer['handle'] }): unknown }
    scope.effect(() => webServer.register({ kind: 'prefix', path: FILE_ROUTE, handler: files.handle }) as never, 'dsh-lantern: workspace files')
  })

  ctx.inject(['skills'], (scope) => {
    const skills = scope.skills as { registerProvider(factory: () => unknown): unknown }
    skills.registerProvider(() => skillProvider())
  })
  ctx.inject(['settings'], (scope) => {
    const settings = scope.settings as { configure(options: { auto: false }, fiber: unknown): unknown }
    scope.effect(() => settings.configure({ auto: false }, ctx.fiber), 'dsh-lantern: custom settings page')
  })
}

function resultText(value: VisualResult, timeoutMinutes: number): string {
  const where = value.display === 'panel' ? 'in the right sidebar' : 'inline in the chat'
  const what = value.path !== undefined ? `Workspace file ${value.path}` : `Visual "${value.title}"`
  switch (value.status) {
    case 'shown':
      return `${what} is shown ${where} (id: ${value.id}). If the user answers inside it, the answer arrives as their next message.`
    case 'answered':
      return `The user answered visual ${value.id} ("${value.title}"):\n${value.response ?? 'null'}`
    case 'dismissed':
      return `The user skipped visual ${value.id} ("${value.title}") without answering. Continue without it.`
    case 'timeout':
      return `No answer to visual ${value.id} within ${timeoutMinutes} minutes. It stays on screen; a later answer arrives as a user message.`
    case 'closed':
      return `Visual ${value.id} was closed before the user answered.`
  }
}

interface Args {
  title: string
  html?: string
  path?: string
  display: 'inline' | 'panel'
  await: boolean
  replace?: string
}

function readArgs(raw: unknown, maxHtml: number): Args {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) throw new Error('show_visual: arguments must be an object')
  const value = raw as Record<string, unknown>
  const title = typeof value.title === 'string' ? value.title.trim() : ''
  if (title === '') throw new Error('show_visual: `title` is required')
  const html = value.html === undefined || value.html === null || value.html === '' ? undefined : value.html
  const path = value.path === undefined || value.path === null || value.path === '' ? undefined : value.path
  if (html !== undefined && typeof html !== 'string') throw new Error('show_visual: `html` must be a string')
  if (path !== undefined && typeof path !== 'string') throw new Error('show_visual: `path` must be a string')
  if ((html === undefined) === (path === undefined)) throw new Error('show_visual: pass exactly one of `html` or `path`')
  if (typeof html === 'string' && html.length > maxHtml) throw new Error(`show_visual: \`html\` is longer than ${maxHtml} characters; write it to a file and pass \`path\``)
  const display = value.display === 'panel' ? 'panel' : 'inline'
  if (value.display !== undefined && value.display !== 'panel' && value.display !== 'inline') throw new Error('show_visual: `display` must be "inline" or "panel"')
  if (value.await_response !== undefined && typeof value.await_response !== 'boolean') throw new Error('show_visual: `await_response` must be a boolean')
  const replace = typeof value.replace === 'string' && value.replace.trim() !== '' ? value.replace.trim().slice(0, 200) : undefined
  return {
    title: title.slice(0, 200),
    ...typeof html === 'string' ? { html } : {},
    ...typeof path === 'string' ? { path } : {},
    display,
    await: value.await_response === true,
    ...replace !== undefined ? { replace } : {},
  }
}

class RouteError extends Error {
  readonly code: string
  constructor(code: string, message: string) { super(message); this.code = code }
}

function callIdentity(payload: Record<string, unknown>): { sessionId: string; callId: string; key: string } {
  const sessionId = stringField(payload, 'sessionId', 200)
  const callId = stringField(payload, 'callId', 200)
  return { sessionId, callId, key: waitKey(sessionId, callId) }
}

function stringField(payload: Record<string, unknown>, key: string, max: number): string {
  const value = payload[key]
  if (typeof value !== 'string' || value === '' || value.length > max) throw new RouteError('bad-request', `\`${key}\` is required.`)
  return value
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } })
}

function route(ctx: HostContext, method: string, run: (payload: Record<string, unknown>) => Promise<unknown>): void {
  ctx.effect(() => ctx.connection.fetch.register({
    path: `/api/${method}`,
    methods: ['POST'],
    requestBody: 'buffered',
    async fetch(request) {
      let payload: unknown
      try { payload = await request.json() } catch { return json({ ok: false, error: { code: 'bad-request', message: 'Body must be JSON.' } }, 400) }
      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        return json({ ok: false, error: { code: 'bad-request', message: 'Body must be a JSON object.' } }, 400)
      }
      try {
        return json({ ok: true, value: await run(payload as Record<string, unknown>) })
      } catch (error) {
        if (error instanceof RouteError) return json({ ok: false, error: { code: error.code, message: error.message } }, 400)
        return json({ ok: false, error: { code: 'internal', message: error instanceof Error ? error.message : String(error) } }, 500)
      }
    },
  }) as never, `dsh-lantern: ${method}`)
}

// ── skill ────────────────────────────────────────────────────────────────

async function readSkill(): Promise<{ description: string; content: string }> {
  const text = await readFile(new URL('SKILL.md', SKILL_DIR), 'utf8')
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text)
  const front = match?.[1] ?? ''
  const description = /^description:\s*(.+)$/m.exec(front)?.[1]?.trim() ?? 'Design guide for the show_visual tool.'
  return { description: description.slice(0, 500), content: match ? text.slice(match[0].length) : text }
}

function skillProvider() {
  const summary = (description: string) => ({
    name: SKILL_NAME,
    description,
    // Keep the advanced guide available through an explicit /lantern-visuals
    // gesture, without DSH's automatic skill catalog requiring it first.
    invocation: { modelInvocable: false, userInvocable: true },
    provider: 'dsh-lantern',
    source: 'bundled',
    resourceBase: { kind: 'directory', path: fileURLToPath(SKILL_DIR) },
  })
  return {
    name: 'dsh-lantern',
    async list() {
      const { description } = await readSkill()
      // 600 is DSH's rank for bundled skills; a user's own skill of the same name wins.
      return [{ ...summary(description), rank: 600, locator: SKILL_NAME }]
    },
    async get() {
      const { description, content } = await readSkill()
      return { ...summary(description), content }
    },
  }
}
