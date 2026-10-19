/**
 * Workspace HTML files for the sidebar. A page is served from
 * `/lantern/files/<token>/<path>` so its relative images, styles, JSON and
 * module scripts load like on any web server. The token is an unguessable,
 * expiring capability for one folder (the page's own), issued only through an
 * authenticated DSH route; the page itself runs sandboxed (CSP `sandbox`
 * without `allow-same-origin`), so it never sees DSH's cookies or API.
 */
import { randomBytes } from 'node:crypto'
import { open, realpath, stat } from 'node:fs/promises'
import { extname, isAbsolute, relative, resolve, sep } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { cageScripts, filePrelude, injectPrelude } from '../frame/document.ts'

function headerOne(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value
  return (raw ?? '').split(',')[0]!.trim()
}

/** Absolute origin the browser used for this request (`http://host:port`). */
export function requestOrigin(req: IncomingMessage): string | undefined {
  const host = headerOne(req.headers.host)
  if (host === '' || /[\s/"'<>;]/.test(host)) return undefined
  const forwarded = headerOne(req.headers['x-forwarded-proto'])
  const proto = forwarded === 'https' ? 'https' : 'http'
  const origin = `${proto}://${host}`
  return /^https?:\/\/[^/\s;"']+$/.test(origin) ? origin : undefined
}

/**
 * CSP for one granted folder. Sources are the absolute URL prefix
 * `/lantern/files/<token>/`, not `'self'`: a sandboxed page has an opaque
 * origin, and `'self'` would not match those requests (or would match the
 * whole host). Relative CSS, images, modules and `fetch()` under the token
 * still match. fetch, XHR, images, CSS `url()`, forms, prefetch, WebSocket,
 * sendBeacon and navigation to anywhere else do not.
 */
export function fileContentSecurityPolicy(origin: string, token: string): string {
  const prefix = /^https?:\/\/[^/\s;"']+$/.test(origin) && /^[\w-]+$/.test(token)
    ? `${origin}${FILE_ROUTE}/${token}/`
    : undefined
  const self = prefix ?? "'none'"
  const extra = prefix ?? "'none'"
  return [
    `default-src ${self}`,
    `script-src ${extra} 'unsafe-inline'`,
    `style-src ${extra} 'unsafe-inline'`,
    `img-src ${extra} data: blob:`,
    `font-src ${extra} data:`,
    `connect-src ${extra}`,
    `media-src ${extra} data: blob:`,
    `worker-src 'none'`,
    `frame-src 'none'`,
    `object-src 'none'`,
    `form-action 'none'`,
    `base-uri 'none'`,
    `navigate-to 'none'`,
    'sandbox allow-scripts allow-forms allow-downloads',
  ].join('; ')
}

export const FILE_ROUTE = '/lantern/files'

/** Links work for this long after they are issued; the sidebar asks again when it reopens. */
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000
const MAX_FILE_BYTES = 64 * 1024 * 1024
const MAX_HTML_BYTES = 8 * 1024 * 1024

const MIME: Readonly<Record<string, string>> = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8',
  '.xml': 'application/xml', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.bmp': 'image/bmp',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.wasm': 'application/wasm', '.pdf': 'application/pdf',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.stl': 'model/stl', '.obj': 'text/plain; charset=utf-8',
}

/** Thrown for paths the tool or a route must refuse; `status` maps to HTTP. */
export class FileRefusal extends Error {
  readonly status: 400 | 403 | 404 | 413
  constructor(message: string, status: 400 | 403 | 404 | 413) { super(message); this.status = status }
}

function hiddenSegment(rel: string): boolean {
  return rel.split(/[\\/]/).some(part => part.startsWith('.') && part !== '.' && part !== '..')
}

/** Resolve `target` inside `root`, following symlinks, or throw. */
export async function confine(root: string, target: string): Promise<{ readonly abs: string; readonly rel: string; readonly size: number; readonly dev: number; readonly ino: number }> {
  const realRoot = await realpath(root).catch(() => { throw new FileRefusal('The working directory is not available.', 404) })
  const wanted = isAbsolute(target) ? target : resolve(realRoot, target)
  const relWanted = relative(realRoot, resolve(wanted))
  if (relWanted.startsWith('..') || isAbsolute(relWanted)) throw new FileRefusal(`${target} is outside the working directory.`, 403)
  if (hiddenSegment(relWanted)) throw new FileRefusal(`${target} is inside a hidden file or folder.`, 403)
  const abs = await realpath(wanted).catch(() => { throw new FileRefusal(`${target} was not found.`, 404) })
  const rel = relative(realRoot, abs)
  if (rel.startsWith('..') || isAbsolute(rel)) throw new FileRefusal(`${target} points outside the working directory.`, 403)
  if (hiddenSegment(rel)) throw new FileRefusal(`${target} is inside a hidden file or folder.`, 403)
  const info = await stat(abs)
  if (!info.isFile()) throw new FileRefusal(`${target} is not a file.`, 404)
  return { abs, rel: rel.split(sep).join('/'), size: info.size, dev: info.dev, ino: info.ino }
}

/** Validate the HTML file a `show_visual` call names. */
export async function resolveEntry(root: string, path: string): Promise<string> {
  const ext = extname(path).toLowerCase()
  if (ext !== '.html' && ext !== '.htm') throw new FileRefusal(`${path} is not an .html file.`, 400)
  const file = await confine(root, path)
  if (file.size > MAX_HTML_BYTES) throw new FileRefusal(`${path} is larger than 8 MB.`, 413)
  return file.rel
}

interface Grant { readonly root: string; readonly expires: number }

export class FileServer {
  private readonly grants = new Map<string, Grant>()

  /**
   * A token for one folder: the page's own folder, not the whole workspace,
   * so a page can read its neighbours and subfolders but nothing above them.
   * Tokens expire a fixed time after they are issued.
   */
  grant(root: string): string {
    this.sweep()
    const token = randomBytes(24).toString('base64url')
    this.grants.set(token, { root, expires: Date.now() + TOKEN_TTL_MS })
    return token
  }

  private sweep(): void {
    const now = Date.now()
    for (const [token, grant] of this.grants) if (grant.expires < now) this.grants.delete(token)
  }

  /** The `/lantern/files` prefix route. */
  readonly handle = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    try {
      if (req.method !== 'GET' && req.method !== 'HEAD') return finish(res, 405, 'Method not allowed')
      const url = new URL(req.url ?? '/', 'http://lantern.invalid')
      const rest = url.pathname.startsWith(FILE_ROUTE + '/') ? url.pathname.slice(FILE_ROUTE.length + 1) : ''
      const slash = rest.indexOf('/')
      const token = slash < 0 ? rest : rest.slice(0, slash)
      this.sweep()
      const grant = this.grants.get(token)
      if (grant === undefined) return finish(res, 404, 'This link has expired. Open the visual again from the chat.')
      let rel: string
      try { rel = decodeURIComponent(slash < 0 ? '' : rest.slice(slash + 1)) } catch { return finish(res, 400, 'Bad path') }
      if (rel === '' || rel.endsWith('/')) rel += 'index.html'
      if (rel.includes('\0') || rel.split('/').includes('..')) return finish(res, 403, 'Forbidden')
      const file = await confine(grant.root, rel)
      if (file.size > MAX_FILE_BYTES) return finish(res, 413, 'File too large')
      // Open, then make sure the open file is the one that was checked, so a
      // path swapped for a symlink in between cannot lead outside the folder.
      const handle = await open(file.abs, 'r')
      try {
        const opened = await handle.stat()
        if (opened.dev !== file.dev || opened.ino !== file.ino || !opened.isFile()) return finish(res, 403, 'Forbidden')
        const ext = extname(file.abs).toLowerCase()
        const type = MIME[ext] ?? 'application/octet-stream'
        setHeaders(res, type, requestOrigin(req), token)
        if (ext === '.html' || ext === '.htm') {
          if (opened.size > MAX_HTML_BYTES) return finish(res, 413, 'File too large')
          const source = await handle.readFile('utf8')
          const id = (url.searchParams.get('lt') ?? '').replace(/[^\w.:-]/g, '').slice(0, 128)
          const scheme = url.searchParams.get('theme') === 'dark' ? 'dark' : 'light'
          const lang = (url.searchParams.get('lang') ?? '').replace(/[^\w-]/g, '').slice(0, 16)
          const withKit = /<meta\s+[^>]*name\s*=\s*["']?lantern-kit/i.test(source)
          const body = Buffer.from(injectPrelude(cageScripts(source), filePrelude({
            id, state: 'idle', response: null, scheme, mode: 'panel', widgetState: null, streaming: false, lang,
          }, withKit)), 'utf8')
          res.setHeader('Content-Length', body.length)
          res.statusCode = 200
          res.end(req.method === 'HEAD' ? undefined : body)
          return
        }
        res.setHeader('Content-Length', opened.size)
        res.statusCode = 200
        if (req.method === 'HEAD') { res.end(); return }
        const body = await handle.readFile()
        res.end(body)
      } finally {
        await handle.close()
      }
    } catch (error) {
      if (error instanceof FileRefusal) return finish(res, error.status, error.message)
      if (!res.headersSent) finish(res, 500, 'Could not read the file')
      else res.destroy()
    }
  }
}

function setHeaders(res: ServerResponse, type: string, origin: string | undefined, token: string): void {
  res.setHeader('Content-Type', type)
  res.setHeader('Cache-Control', 'private, no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'no-referrer')
  // The page and everything it loads runs in an opaque origin, even when the
  // URL is opened directly in a tab. No popups: links leave through DSH.
  // The source list is this token's absolute prefix, so a page cannot use
  // the response as a way to request other sites.
  res.setHeader('Content-Security-Policy', fileContentSecurityPolicy(origin ?? '', token))
  // Opaque-origin pages need CORS for module scripts, fonts and fetch().
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
}

function finish(res: ServerResponse, status: number, message: string): void {
  if (res.headersSent) { res.destroy(); return }
  res.statusCode = status
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.end(message)
}
