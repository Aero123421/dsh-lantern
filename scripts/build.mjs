// Builds lib/: a Node ESM host entry and a browser module for DSH Web.
// Nothing from DSH is bundled or imported at runtime; React comes from DSH
// Web's module loader, the same way first-party client plugins get it.
import { build } from 'esbuild'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
const define = { __LANTERN_VERSION__: JSON.stringify(manifest.version) }

await rm(resolve(root, 'lib'), { recursive: true, force: true })
await mkdir(resolve(root, 'lib'), { recursive: true })

await build({
  entryPoints: [resolve(root, 'src/host/index.ts')],
  outfile: resolve(root, 'lib/index.js'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  external: ['@deepseek-ai/*'],
  loader: { '.css': 'text' },
  define,
  legalComments: 'none',
})

const client = await build({
  entryPoints: [resolve(root, 'src/client/index.tsx')],
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: 'es2022',
  jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', 'react-dom'],
  loader: { '.css': 'text' },
  define,
  minify: true,
  write: false,
  legalComments: 'none',
})
// DSH Web loads third-party client code through its module loader; the
// factory receives the host's `require` for the shared React instance.
await writeFile(resolve(root, 'lib/client.js'),
  `window.__ModuleLoader__.load({id:${JSON.stringify(manifest.name)},factory(require){const module={exports:{}};const exports=module.exports;\n${client.outputFiles[0].text}\nreturn module.exports;}});\n`)
console.log('built lib/index.js and lib/client.js')
