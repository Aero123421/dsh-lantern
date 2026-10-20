import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, chmodSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const script = new URL('../scripts/draft-release.sh', import.meta.url)
const workflow = readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8')

function run(mode: 'missing' | 'draft' | 'published') {
  const dir = mkdtempSync(join(tmpdir(), 'lantern-release-'))
  const log = join(dir, 'gh.log')
  const bin = join(dir, 'bin')
  mkdirSync(bin)
  const gh = join(bin, 'gh')
  writeFileSync(log, '')
  writeFileSync(gh, `#!/bin/sh
printf '%s\\n' "$*" >> ${JSON.stringify(log)}
if [ "$1" = release ] && [ "$2" = view ]; then
  case ${JSON.stringify(mode)} in
    missing) echo 'release not found' >&2; exit 1 ;;
    draft) echo true; exit 0 ;;
    published) echo false; exit 0 ;;
  esac
fi
exit 0
`)
  chmodSync(gh, 0o755)
  const result = spawnSync('sh', [script.pathname, 'v0.2.2', join(dir, 'dsh-lantern-0.2.2.tgz'), join(dir, 'SHA256SUMS')], {
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
    encoding: 'utf8',
  })
  const calls = readFileSync(log, 'utf8').trim().split('\n').filter(Boolean)
  rmSync(dir, { recursive: true, force: true })
  return { status: result.status, stderr: result.stderr, calls }
}

test('the release workflow only invokes the draft helper', () => {
  assert.match(workflow, /sh scripts\/draft-release\.sh/)
  assert.equal(workflow.includes('gh release'), false)
  const source = readFileSync(script, 'utf8')
  assert.match(source, /gh release create "\$tag" "\$@" --verify-tag --draft --title "\$tag" --notes "\$notes"/)
  assert.match(source, /gh release upload "\$tag" "\$@" --clobber/)
  assert.equal(source.includes('release edit'), false)
  assert.equal(source.includes('--draft=false'), false)
})

test('a missing release is created as a draft with notes and assets', () => {
  const { status, calls } = run('missing')
  assert.equal(status, 0)
  assert.equal(calls.length, 2)
  assert.match(calls[0]!, /^release view v0\.2\.2 /)
  assert.match(calls[1]!, /^release create v0\.2\.2 /)
  assert.match(calls[1]!, / --verify-tag --draft --title v0\.2\.2 --notes /)
  assert.match(calls[1]!, /dsh-lantern-0\.2\.2\.tgz/)
  assert.match(calls[1]!, /SHA256SUMS/)
})

test('an existing draft keeps its notes and only receives assets', () => {
  const { status, calls } = run('draft')
  assert.equal(status, 0)
  assert.equal(calls.length, 2)
  assert.match(calls[1]!, /^release upload v0\.2\.2 /)
  assert.match(calls[1]!, / --clobber$/)
  assert.equal(calls.some(call => call.includes('create') || call.includes('--notes') || call.includes('--draft')), false)
})

test('a published release is left untouched', () => {
  const { status, stderr, calls } = run('published')
  assert.equal(status, 1)
  assert.match(stderr, /already published/)
  assert.deepEqual(calls.map(call => call.split(' ')[1]), ['view'])
})
