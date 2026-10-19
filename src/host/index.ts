/**
 * dsh-lantern, host half: the `show_visual` tool, the routes the browser
 * uses to answer a waiting visual, workspace HTML serving for the sidebar,
 * and the `lantern-visuals` skill.
 *
 * Nothing from DSH is imported at runtime; the services are reached through
 * the Cordis context with structural types.
 */
import { readFile, realpath } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PARAMETERS, SKILL_NAME, TOOL_NAME, toolDescription } from './description.ts'
import { FILE_ROUTE, FileRefusal, FileServer, resolveEntry } from './files.ts'
import { PendingResponses, type Outcome } from './pending.ts'

export const name = 'dsh-lantern'
export const inject = ['tools', 'connection']

export interface Config {
  /** Minutes a visual with `await_response` waits for the user (default 15). */
  answerTimeoutMinutes?: number
  /** Largest `html` argument accepted, in characters (default 400000). */
  maxHtmlChars?: number
}

type Status = 'shown' | 'answered' | 'dismissed' | 'timeout' | 'closed'

/** The tool's return value; also stored as the result's presentation meta. */
export interface VisualResult {
  id: string
  status: Status
  display: 'inline' | 'panel'
  title: string
  path?: string
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

interface HostContext {
  tools: { register(definition: unknown): unknown }
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
  return `${sessionId ?? ''}\u0000${callId}`
}

export function apply(rawCtx: unknown, config: Config = {}): void {
  const ctx = rawCtx as HostContext
  const timeoutMinutes = positive(config?.answerTimeoutMinutes, 15, 'answerTimeoutMinutes', 24 * 60)
  const maxHtml = positive(config?.maxHtmlChars, 400_000, 'maxHtmlChars', 4_000_000)
  const pending = new PendingResponses()
  const files = new FileServer()
  /** Working directory per session, remembered from tool calls. */
  const cwdBySession = new Map<string, string>()

  ctx.effect(() => () => pending.closeAll(), 'dsh-lantern: release waiting visuals')

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
    const wd = ctx.get('workingDirectory') as { ensure(agent: unknown, signal: AbortSignal): Promise<string> } | undefined
    if (wd && exec.agent) {
      try { return await wd.ensure(exec.agent, exec.signal) } catch { /* fall through */ }
    }
    return exec.agent?.session?.header?.cwd
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
        const cwd = await execCwd(exec)
        if (cwd === undefined) throw new Error('show_visual: no working directory for `path`; pass `html` instead.')
        if (sessionId !== undefined) cwdBySession.set(sessionId, cwd)
        try {
          base.path = await resolveEntry(cwd, args.path)
        } catch (error) {
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
    const key = waitKey(optionalString(payload, 'sessionId'), stringField(payload, 'callId', 200))
    const response = payload.response
    let json: string
    try { json = JSON.stringify(response === undefined ? null : response) } catch { throw new RouteError('bad-response', 'The answer is not JSON.') }
    if (json.length > MAX_RESPONSE_CHARS) throw new RouteError('too-large', 'The answer is larger than 64 KB.')
    return { status: pending.settle(key, { kind: 'answered', response: json }) }
  })
  route(ctx, 'lantern.dismiss', async (payload) => {
    const key = waitKey(optionalString(payload, 'sessionId'), stringField(payload, 'callId', 200))
    return { status: pending.settle(key, { kind: 'dismissed' }) }
  })
  route(ctx, 'lantern.waiting', async (payload) => {
    const key = waitKey(optionalString(payload, 'sessionId'), stringField(payload, 'callId', 200))
    return { waiting: pending.isWaiting(key) }
  })
  route(ctx, 'lantern.file', async (payload) => {
    const sessionId = stringField(payload, 'sessionId', 200)
    const path = stringField(payload, 'path', 4096)
    const cwd = await sessionCwd(sessionId)
    if (cwd === undefined) throw new RouteError('no-session', 'The session working directory is unknown.')
    let rel: string
    try { rel = await resolveEntry(cwd, path) } catch (error) {
      if (error instanceof FileRefusal) throw new RouteError('refused', error.message)
      throw error
    }
    // The link covers the page's own folder (and below), not the workspace.
    const entry = join(await realpath(cwd), rel)
    const token = files.grant(dirname(entry))
    return { url: `${FILE_ROUTE.slice(1)}/${token}/${encodeURIComponent(basename(entry))}`, path: rel }
  })

  ctx.inject(['webServer'], (scope) => {
    const webServer = scope.webServer as { register(route: { kind: 'prefix'; path: string; handler: FileServer['handle'] }): unknown }
    scope.effect(() => webServer.register({ kind: 'prefix', path: FILE_ROUTE, handler: files.handle }) as never, 'dsh-lantern: workspace files')
  })

  ctx.inject(['skills'], (scope) => {
    const skills = scope.skills as { registerProvider(factory: () => unknown): unknown }
    skills.registerProvider(() => skillProvider())
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

function optionalString(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payload[key]
  return typeof value === 'string' && value !== '' && value.length <= 200 ? value : undefined
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
    invocation: { modelInvocable: true, userInvocable: true },
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
