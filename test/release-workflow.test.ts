import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, chmodSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const script = new URL('../scripts/draft-release.sh', import.meta.url)
const workflow = readFileSync(new URL('../.github/workflows/release.yml', import.meta.url), 'utf8')
const source = readFileSync(script, 'utf8')

function run(mode: 'missing' | 'draft' | 'published' | 'saturated', assets: readonly string[] = [], changelog?: string) {
  const dir = mkdtempSync(join(tmpdir(), 'lantern-release-'))
  const log = join(dir, 'gh.log')
  const notes = join(dir, 'notes.txt')
  const bin = join(dir, 'bin')
  mkdirSync(bin)
  const gh = join(bin, 'gh')
  const listed = assets.map(name => `printf '%s\\n' ${JSON.stringify(name)}`).join('\n      ')
  const listedState = mode === 'draft' ? 'true' : mode === 'published' ? 'false' : ''
  const listedCount = mode === 'saturated' ? '1000' : mode === 'missing' ? '0' : '1'
  writeFileSync(log, '')
  writeFileSync(gh, `#!/bin/sh
printf '%s\\n' "$*" >> ${JSON.stringify(log)}
prev=
for arg in "$@"; do
  if [ "$prev" = --notes-file ]; then
    cat "$arg" > ${JSON.stringify(notes)}
  fi
  prev=$arg
done
if [ "$1" = release ] && [ "$2" = list ]; then
  printf '%s\\n' ${JSON.stringify(listedCount)}
  printf '%s\\n' ${JSON.stringify(listedState)}
  exit 0
fi
if [ "$1" = release ] && [ "$2" = view ]; then
  case "$*" in
    *'--json assets'*)
      ${listed}
      exit 0
      ;;
  esac
  echo "unexpected view: $*" >&2
  exit 1
fi
exit 0
`)
  chmodSync(gh, 0o755)
  const result = spawnSync('sh', [script.pathname, 'v0.2.2', join(dir, 'dsh-lantern-0.2.2.tgz'), join(dir, 'SHA256SUMS')], {
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, ...changelog ? { DRAFT_RELEASE_CHANGELOG: changelog } : {} },
    encoding: 'utf8',
  })
  const calls = readFileSync(log, 'utf8').trim().split('\n').filter(Boolean)
  const body = calls.some(call => call.includes('--notes-file')) ? readFileSync(notes, 'utf8') : ''
  rmSync(dir, { recursive: true, force: true })
  return { status: result.status, stderr: result.stderr, calls, body }
}

test('the release workflow only invokes the draft helper', () => {
  assert.match(workflow, /sh scripts\/draft-release\.sh/)
  assert.equal(workflow.includes('gh release'), false)
  assert.match(source, /gh release list --limit 1000 --json tagName,isDraft/)
  assert.match(source, /gh release create "\$tag" "\$@" --verify-tag --draft --title "\$tag" --notes-file "\$notesfile"/)
  assert.equal(source.replaceAll('--notes-file', '').includes('--notes'), false)
  assert.match(source, /gh release upload "\$tag" "\$@"/)
  assert.equal(source.includes('release not found'), false)
})

test('the workflow and draft script never publish or replace release notes', () => {
  for (const text of [workflow, source]) {
    assert.equal(text.includes('--clobber'), false)
    assert.equal(text.includes('--draft=false'), false)
    assert.equal(text.includes('--latest'), false)
    assert.equal(text.includes('release edit'), false)
    assert.equal(/edit[^\n]*--notes/.test(text), false)
    assert.equal(/edit[^\n]*--draft=false/.test(text), false)
  }
})

test('a missing release is created as a draft with notes and assets', () => {
  const { status, calls } = run('missing')
  assert.equal(status, 0)
  assert.equal(calls.length, 2)
  assert.match(calls[0]!, /^release list /)
  assert.match(calls[0]!, /--limit 1000 /)
  assert.match(calls[0]!, /--json tagName,isDraft/)
  assert.match(calls[1]!, /^release create v0\.2\.2 /)
  assert.match(calls[1]!, / --verify-tag --draft --title v0\.2\.2 --notes-file /)
  assert.equal(calls[1]!.replaceAll('--notes-file', '').includes('--notes'), false)
  assert.match(calls[1]!, /dsh-lantern-0\.2\.2\.tgz/)
  assert.match(calls[1]!, /SHA256SUMS/)
})

test('an existing draft keeps its notes and only receives assets', () => {
  const { status, calls } = run('draft')
  assert.equal(status, 0)
  assert.equal(calls.length, 3)
  assert.match(calls[0]!, /release list /)
  assert.match(calls[1]!, /--json assets/)
  assert.match(calls[2]!, /^release upload v0\.2\.2 /)
  assert.equal(calls[2]!.includes('--clobber'), false)
  assert.equal(calls.some(call => call.includes('create') || call.includes('--notes') || call.includes('--draft')), false)
})

test('an existing draft asset is kept and the run fails without uploading', () => {
  const { status, stderr, calls } = run('draft', ['dsh-lantern-0.2.2.tgz', 'SHA256SUMS'])
  assert.equal(status, 1)
  assert.match(stderr, /既存の資産は置き換えない/)
  assert.equal(calls.some(call => call.startsWith('release upload')), false)
  assert.equal(calls.some(call => call.includes('--clobber')), false)
})

test('a draft that already has one asset is not uploaded at all', () => {
  const { status, stderr, calls } = run('draft', ['dsh-lantern-0.2.2.tgz'])
  assert.equal(status, 1)
  assert.match(stderr, /既存の資産は置き換えない/)
  assert.match(stderr, /gh release delete-asset v0\.2\.2 dsh-lantern-0\.2\.2\.tgz/)
  assert.equal(calls.some(call => call.startsWith('release upload')), false)
  assert.equal(calls.some(call => call.includes('delete-asset')), false)
})

test('a full release list that does not include the tag does not create a release', () => {
  const { status, stderr, calls } = run('saturated')
  assert.equal(status, 1)
  assert.match(stderr, /returned 1000 releases/)
  assert.deepEqual(calls.map(call => call.split(' ')[1]), ['list'])
})

test('a new draft is the changelog section and includes the pnpm 12 note once', () => {
  const { status, body, calls } = run('missing')
  assert.equal(status, 0)
  assert.equal(calls.filter(call => call.startsWith('release create')).length, 1)
  assert.equal(body.split('pnpm 12 でプラグインを追加・更新すると').length - 1, 1)
  assert.equal(body.includes('### 残るリスク'), false)
})

test('a missing or empty changelog section does not create a release', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lantern-notes-'))
  const changelog = join(dir, 'CHANGELOG.md')
  try {
    for (const text of ['# Changelog\n\n## 0.2.1\n\nOlder.\n', '# Changelog\n\n## 0.2.2\n\n\n## 0.2.1\n\nOlder.\n']) {
      writeFileSync(changelog, text)
      const { status, stderr, calls } = run('missing', [], changelog)
      assert.equal(status, 1)
      assert.match(stderr, /no changelog notes for 0\.2\.2/)
      assert.equal(calls.some(call => call.startsWith('release create')), false)
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a published release is left untouched', () => {
  const { status, stderr, calls } = run('published')
  assert.equal(status, 1)
  assert.match(stderr, /already published/)
  assert.deepEqual(calls.map(call => call.split(' ')[1]), ['list'])
})
