# Issue #11: departed-session HTML lifetime

Baseline: main `ae39da602b072c180ffe58d4a27639206af3e220` (merged PR #10). The product and harness files tested here are identified by [source.sha256](source.sha256); the final checkout SHA and complete image manifest are supplied with the external evidence artifact. No host API, persisted answer/widget format, or conversation placement changes.

## Lifetime contract

The registry is a replayable browser cache. A mounted VisualCard (tool/tail/panel), mounted tail seat, open SidebarTab (including loading/hidden copies), or queued/in-flight answer retains its session. Only the last owner leaving starts a 1.5-second grace, matching the existing script remount grace. Remount cancels expiry. Expiry drops that session's records and invalidates the replacement index; retaining the entire owned session preserves offscreen replacement links. Late unowned upserts also expire. Plugin disposal clears HTML/cache timers. Answer and widget storage remain separate.

Cold tails rehydrate from the existing turn data and cold sidebars from existing fetchVisual. A pending host wait can outlive an unmounted browser cache; its historical card stays paused when revisited. Submissions keep ownership through Web Lock queuing and settlement, including rejection. Closing one of several views never evicts the other's session.

This does not cap an actively displayed session or an intentionally open sidebar, nor change host session retention. Small script-gate and auto-open ID metadata remain to prevent historical automatic execution; they do not contain HTML. There is no new persistence or generic GC framework. Widget memory's existing MAX_ENTRIES is unrelated to the visual registry.

## Reproduction and checks

Node 24.19.0, system Chromium 154.0.8037.57, Playwright 1.55.1. Official DSH 0.2.1-rc.2 uses a disposable home and deterministic synthetic model, without personal accounts, keys, external model calls, or billing.

| Check | Result |
| --- | --- |
| npm run check | Typecheck, 98 tests, build pass |
| Registry mock-host UI | 14 pass, no uncaught browser errors |
| Existing replacement UI | 29 pass |
| Existing iframe runtime | 45 pass |
| Official DSH fixture | 33 pass |

The mock uses real Tail/SidebarTab/VisualCard/Frame/store and synthetic history/API replies. It checks simultaneous owners, cold sidebar loading/retrieval, close/unmount, 22-card chain replay, same-ID fork separation, paused pending replay, widget restoration after explicit Run, answer settlement after unmount, committed form reconstruction, and 390px layout. Unit tests additionally cover a quick remount, plugin teardown, queued locks, and failed submission cleanup. Existing runtime tests cover failed submission/retry and form restoration. The official DSH flow checks real sessions/tool results/sidebar/form/history/theme/settings integration; the 300-session stress and synthetic in-flight delay are mock-host checks, not official DSH stress tests. React removal is not persistent DSH session deletion.

## Retention evidence

One active visual remains mounted while 300 distinct synthetic sessions receive approximately 100,000-character HTML each, then release their tail seats. The same harness was run against exact baseline main and this patch. Baseline deliberately fails the new release assertion.

| Measurement after grace + explicit Chromium GC | Baseline | Patch |
| --- | ---: | ---: |
| Inactive registry records | 300 | 0 |
| Inactive args.html characters | 30,172,090 | 0 |
| Heap objects matching the 300 bulk VisualRecords | 300 | 0 |
| Whole-page used JS heap, bytes | 33,083,944 | 3,326,688 |

Before cleanup, both snapshots contain 300 bulk-record shapes. After cleanup, the patch snapshot still contains two objects for the deliberately mounted session and no bulk ones. These are one isolated browser experiment after explicit GC, not plugin-only retained bytes or a production memory/FPS guarantee; character counts are not bytes.

The official DSH heap snapshot was collected after switching across three synthetic sessions: two old call IDs are absent from VisualRecord-shaped heap objects; three matching objects belong to the current call. [Metadata](dsh-registry-heap.json) and [shape summary](dsh-registry.heapsnapshot.summary.json) record the scope. The shape matcher is finite evidence about this fixture, not a complete retaining-path analysis of arbitrary host objects. Raw DSH snapshots remain local because heaps can contain even temporary local authentication tokens. The artifact includes the safe mock snapshots and summaries.

See [baseline results](before-registry-checks.json), [patched results](after-registry-checks.json), and [official DSH checks](integration-checks.json). Expected diagnostics concern the inherited unsupported navigate-to CSP directive and deliberately paused sandbox scripts.

## Image review

The external manifest lists every image's state, viewport, scope, SHA/source hashes, pixel hash, and review result. Representative images below were opened and inspected, including loading, empty, long-list, mobile and simultaneous-view states. Blur under the historical Run overlay and disabled committed fields are intentional. The mock fixture supplies its own simple form layout; product CSS is unchanged.

| State | Scope / viewport | Image |
| --- | --- | --- |
| Tail + sidebar own the same session | Mock / 1100×950 | [Simultaneous](registry-same-session-tail-and-sidebar.png) |
| Last view closed | Mock / 1100×950 | [Empty](registry-all-views-unmounted.png) |
| Sidebar fetching cold history | Mock / 1100×950 | [Loading](registry-sidebar-loading-history.png) |
| Sidebar restored from history | Mock / 1100×950 | [Restored](registry-sidebar-rehydrated-history.png) |
| Replayed long chain + same-ID fork | Mock / 1100×950, full page | [Chains](registry-replayed-chain-and-fork-paused.png) |
| Answer restored after cache eviction | Mock / 390×844 | [Mobile](registry-answered-mobile.png) |
| Conversation + sidebar | Official DSH fixture / 1440×1050 | [Expanded](dsh-expanded.png) |
| Japanese committed form history | Official DSH fixture / 390×844 | [Mobile history](dsh-disabled-history-mobile.png) |

No real-user sessions, production heap, real-model behavior, native IME candidate windows, or physical GPU performance were tested.
