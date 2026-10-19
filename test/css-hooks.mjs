import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
export async function load(url, context, next) {
  if (url.endsWith('.css')) {
    const text = await readFile(fileURLToPath(url), 'utf8')
    return { format: 'module', source: `export default ${JSON.stringify(text)}`, shortCircuit: true }
  }
  return next(url, context)
}
