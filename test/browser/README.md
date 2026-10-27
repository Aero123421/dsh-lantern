# Browser verification

These are foreground integration scripts, not a new mandatory CI pipeline. The one-time acquisition/writeback workflows used during development are removed from the final PR. The repository's pre-existing workflows are unchanged.

## Verified result

[Report, actual DSH screenshots, and raw check lists](../../docs/verification/tail-placement/README.md).

Official DSH 0.2.1-rc.2, Node 22.23.3, Playwright 1.55.1 / Chromium: 90 unit tests, 24 sandbox runtime checks, and 24 official-DSH integration checks passed. The runtime checks include WebGL2 rendering and pixel readback. The DSH flow uses a deterministic adapter, not a live-model quality benchmark.

## Run locally

Use a **new disposable runtime directory**. Do not point `LANTERN_DSH_RUNTIME` at your normal DSH installation: the integration runner creates/replaces its `dsh-lantern` link and installs a test adapter in that directory. Each test run creates its own temporary DSH home, uses no personal API keys, and stops its own server on completion. Port 3088 must be free.

From the repository root, with supported Node 22 installed:

```sh
npm ci
npm run check

export LANTERN_DSH_RUNTIME="$(mktemp -d)"
export LANTERN_E2E_OUTPUT="$(mktemp -d)"
npm install --prefix "$LANTERN_DSH_RUNTIME" --no-audit --no-fund \
  @deepseek-ai/dsh@0.2.1-rc.2 playwright@1.55.1
"$LANTERN_DSH_RUNTIME/node_modules/.bin/playwright" install chromium
# Linux machines missing system libraries may need Playwright's documented
# install-deps step, using the machine owner's normal package-management process.

node --experimental-strip-types --no-warnings --import ./test/register.mjs \
  test/browser/runtime.mjs
node test/browser/run.mjs
# Issue #14: module navigation before the first iframe load. Port 3096.
node test/browser/module-nav.mjs
printf 'Evidence: %s\n' "$LANTERN_E2E_OUTPUT"
```

Both scripts accept `LANTERN_CHROMIUM` for an already-installed Chromium binary; otherwise they use the Chromium installed by Playwright. Do not disable browser/network policies to run these tests; use an authorized environment where loopback navigation is allowed.

For replacement-chain regression checks, also install `react-dom@18.3.1` in the disposable runtime, then run `node test/browser/replacements.mjs` with the same environment variables. This bundles the actual `Tail`, `VisualCard` and `Frame` into a loopback-only mock host. It checks normal, 21- and 80-replacement chains, cycles, failed replacements and retry, fork isolation, removal/remount, mobile layout and workspace iframe names. Removal means React unmount here; it does not exercise DSH's persistent session deletion. Its JSON report records the actual `scrollIntoView` destination. [The October 26 review](../../docs/verification/pr10-review-2026-10-26/README.md) includes before/after results and separates mock checks from official DSH integration.

The standalone runtime suite uses the actual `buildDocument` and iframe code on a blank browser page. Its parent acknowledgement is a test harness. The DSH suite starts the official application, loads the actual plugin, and exercises the real tool-result/session/form/settings paths through the rendered UI. Its model adapter is the only deterministic replacement.

## Evidence and limits

`runtime-checks.json`, `integration-checks.json`, screenshots, and redacted diagnostics are written to the output directory. The latter suite verifies final-answer-tail ordering, absence of standalone conversation nodes or duplicate tool frames, theme propagation, compact controls, 390px layout, restored script gating, saved slider state, panel expansion, awaited Japanese text input, submitted-answer history, both guide switches, catalog removal, and continued `show_visual` availability with both guides off.

The iframe suite verifies 320px layout, native required validation, textarea newlines, synthetic IME composition, duplicate-send suppression, error/retry without losing text, committed values, password exclusion, own-property field serialization, no implicit draft persistence, height measurement, custom CSS/SVG, parent-DOM isolation, and WebGL2 where available.

Known Chromium diagnostics for the inherited `navigate-to` CSP directive and deliberately paused historical scripts remain in the raw report and are distinguished from unexpected errors. OS-native IME candidate windows, physical GPU performance, real-model proactive invocation rates, all third-party 3D libraries, and arbitrary paragraph anchors inside one Markdown message are not covered.

Registry availability is separate from product correctness. A fresh dependency install returned a transitive AWS package 404 during development; the successful final run reused the earlier installed, isolated dependency snapshot. Preserve the generated runtime `package-lock.json` when reproducing a particular dependency tree. Never replace a failed installation or browser run with a claimed passing result.

The [checkbox restoration follow-up](../../docs/verification/pr10-checkbox-restoration/README.md) adds native FormData omission/scalar/array/boolean and disabled-fieldset cases. The current runtime suite has 38 checks; the official DSH fixture flow has 29 and verifies unchecked custom checkboxes after page reload. Screenshot states cover empty/draft/sending/error/retry/committed/restored/empty-object and mobile light/dark. DSH resize transitions are captured separately from stable form bounds.

The [multiple-select follow-up](../../docs/verification/pr10-multiple-select/README.md) extends the same restoration checks to empty multiple selects, scalar/array selections, disabled controls and empty-object answers. The runtime suite now has 45 checks; official DSH has 31, including clear-all → submit → reload → Run. New images cover defaults, clear-all draft, sending, commitment, restored history, empty answer and mobile light/dark.

Run `node --experimental-strip-types --no-warnings --import ./test/register.mjs test/browser/disabled-restoration.mjs` with the same environment variables for the [disabled-control follow-up](../../docs/verification/pr10-disabled-restoration/README.md): 14 bounded native-control cases / 100 checks cover same-name controls, fieldset/legend behavior, scalar/array positions, non-data inputs and repeated state messages. The standard runtime suite remains 45 checks; official DSH now has 33, including the same-name disabled checked checkbox after reload.
