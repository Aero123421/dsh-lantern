# Changelog

## Unreleased

## 0.2.4

- Restore inline HTML cards after self-navigation, including module navigation before the first iframe load, with scripts disabled and a navigation notice. Detection of the first load uses a 100 ms acknowledgement grace period; unusually delayed browser message delivery can produce a false positive. Workspace path pages have different navigation risks; see below.
- Localize built-in refusal messages and empty tool errors; show a closed badge for closed visuals. Correct documentation for no-source cards created in 0.2.1 or earlier.
- Avoid incorrectly pinning ordinary content to a 540px iframe while it shrinks; preserve viewport-sized applications and ordinary growth and shrinkage.
- Release captured DSH client services when the plugin unloads; an older activation's cleanup cannot disconnect a newly enabled activation.
- Probe an inline document's viewport sizing once; keep ordinary content resize tracking without a second delayed height nudge during form input.
- Keep the established placement: live previews/forms in the tool row, completed visuals below the final answer. Remove interleaving instructions from both bundled guides and the system prompt; do not split explanations around visuals.
- Frameless inline defaults, readable iframe names, wider choices, mobile inputs, and contrast-derived semantic text/button colors. Custom HTML, Canvas, SVG, WebGL, panel pages and sandbox boundaries remain available.
- Two independently toggleable bundled guides: lightweight `lantern-chat-ux` with automatic guidance, and explicit `lantern-visuals`. Live catalog invalidation rejects stale disabled guide loads without removing the runtime.
- Declarative forms guard IME composition and duplicate submission, retain values on errors, show accessible progress, and restore committed ordinary fields for single-form visuals. Draft persistence remains opt-in.
- Add contrast/guide regressions and an isolated, deterministic-model browser integration runner for official DSH 0.2.1-rc.2.

### Known issues and verification limits

- Existing path cards from 0.2.1 or earlier may have no saved source; request the visual again. Workspace path pages can still navigate and leak allowed-folder content after Run; the inline-card fix does not remove this risk.
- pnpm 12 plugin add/update can fail on recently published dependencies and empty the profile's `node_modules`, disabling all plugins in that profile. Use pnpm 10; recover with `dsh plugin --profile web install` under pnpm 10. Back up the profile before changes.
- Integration uses deterministic fixtures, not a real model or paid inference; it does not cover every OS, Electron, or the live update service.

## 0.2.3

0.2.2 was not published. It stayed a draft GitHub Release and was withdrawn. 0.2.3 includes every change from that unpublished 0.2.2. The notes in this section are the complete set of changes since 0.2.1.

Conversation visuals from PR #1, ported onto 0.2.1. Automatic visuals are on by default (`automaticVisuals`). The system prompt section `ui:lantern-interactive` (order 10110) adds a short English guidance string when that setting is on and `show_visual` is registered. The bundled skill stays user-invocable only (`modelInvocable: false`); load it with `/lantern-visuals`.

HTML card policy is unchanged from 0.2.1. `img-src` does not allow `https:`, so an external image in a card does not load. Script and style requests to a CDN are refused.

Folder pages do not add a second CSP `<meta>`. The HTTP header names the token prefix `/lantern/files/<token>/`. A `'self'` meta would not match relative CSS, image and module requests from an opaque origin, and both policies would have to pass.

`lantern.file` serves a recorded folder only while that folder is still inside the session's current working directory. A saved root outside that directory, including one written into an imported session, is refused.

A file grant stores the folder's real path. Each request realpaths that folder and refuses it unless the path still matches, then realpaths the file and allows it only when `path.relative` from the saved path stays inside, so a folder swapped for an outside symlink or a symlink file that points outside is refused.

`workingDirectory.ensure` failures are no longer replaced with the session header cwd. `execCwd` throws, and `path` rendering fails closed.

The iframe's History API stays in the folder. `pushState` and `replaceState` ignore a URL outside that folder. `back`, `forward`, and `go` do nothing, so stepping backward does not load another document or run its scripts. Those methods belong to the iframe and do not move the parent page.

A card that is still waiting for Run drops `http`, `https`, and protocol-relative `src`, `href`, `poster`, and CSS `url()` values from the markup before the iframe is built. The content security policy still refuses those requests.

The parent accepts a MessagePort only from that card's frame, origin `"null"`, a single port, and the matching bridge. Later messages must use a known type. A card cannot drive a host action or address another card on this port. `submit`, `send`, `expand`, and `open-link` still require a user action.

The system prompt section is registered once per host. Its text is the fixed guidance string, or empty when automatic visuals are off or `show_visual` is not registered. DSH removes the section when the plugin is uninstalled.

Pushing a `v*` tag creates a draft GitHub Release (`gh release create --draft`) and attaches the tarball and `SHA256SUMS`. The workflow does not publish that Release. If a draft for the same tag already exists, the workflow uploads the assets and leaves the release notes unchanged. A person publishes the Release.

### Known issue

Folder (path) cards created before 0.2.3 (that is, with 0.2.1 or earlier) stored only a relative path and have no saved source. After updating they show no-source and cannot be opened. To get a working card, ask the agent to show the file again; this works when the file is inside the session's current working folder and on the host's local filesystem. Interaction state from the old card does not carry over to the new card. Nothing is deleted.

pnpm 12 でプラグインを追加・更新すると、プロファイルの lockfile に公開から24時間たっていない依存が含まれている場合、ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION で失敗することがあります。このとき pnpm がプロファイルの node_modules を空にし、DSH も元に戻さないため、同じプロファイルのすべてのプラグインが読み込まれなくなります。プラグインの追加・更新は pnpm 10 で行ってください。壊れたときは pnpm 10 で `dsh plugin --profile web install` を実行すると戻ります。pnpm 11 では ERR_PNPM_UNEXPECTED_STORE で止まりますが、node_modules は壊れません。

### Residual risks (unchanged from 0.2.1)

Running scripts lets a card send the contents of the allowed folder out by navigating itself. This applies only to workspace (`/lantern/files/<token>/`) pages after the user presses Run. Classic scripts that rewrite `location` are stopped; module scripts are outside that wrapper and can navigate with the real `location`. Chromium does not support CSP `navigate-to`.

`/lantern/files/<token>/` pages keep scripts stopped until Run is pressed. Inline cards still run automatically on first display, and cannot read an allowed folder or `/lantern/files/` contents.

A tight loop on first display can freeze that tab only; close the tab and reopen the conversation.

## 0.2.2

Conversation visuals from PR #1, ported onto 0.2.1 and kept at 0.2.2. Automatic visuals are on by default (`automaticVisuals`). The system prompt section `ui:lantern-interactive` (order 10110) adds a short English guidance string when that setting is on and `show_visual` is registered. The bundled skill stays user-invocable only (`modelInvocable: false`); load it with `/lantern-visuals`.

HTML card policy is unchanged from 0.2.1. `img-src` does not allow `https:`, so an external image in a card does not load. Script and style requests to a CDN are refused.

Folder pages do not add a second CSP `<meta>`. The HTTP header names the token prefix `/lantern/files/<token>/`. A `'self'` meta would not match relative CSS, image and module requests from an opaque origin, and both policies would have to pass.

`lantern.file` serves a recorded folder only while that folder is still inside the session's current working directory. A saved root outside that directory, including one written into an imported session, is refused.

A file grant stores the folder's real path. Each request realpaths that folder and refuses it unless the path still matches, then realpaths the file and allows it only when `path.relative` from the saved path stays inside, so a folder swapped for an outside symlink or a symlink file that points outside is refused.

`workingDirectory.ensure` failures are no longer replaced with the session header cwd. `execCwd` throws, and `path` rendering fails closed.

The iframe's History API stays in the folder. `pushState` and `replaceState` ignore a URL outside that folder. `back`, `forward`, and `go` do nothing, so stepping backward does not load another document or run its scripts. Those methods belong to the iframe and do not move the parent page.

A card that is still waiting for Run drops `http`, `https`, and protocol-relative `src`, `href`, `poster`, and CSS `url()` values from the markup before the iframe is built. The content security policy still refuses those requests.

The parent accepts a MessagePort only from that card's frame, origin `"null"`, a single port, and the matching bridge. Later messages must use a known type. A card cannot drive a host action or address another card on this port. `submit`, `send`, `expand`, and `open-link` still require a user action.

The system prompt section is registered once per host. Its text is the fixed guidance string, or empty when automatic visuals are off or `show_visual` is not registered. DSH removes the section when the plugin is uninstalled.

Pushing a `v*` tag creates a draft GitHub Release (`gh release create --draft`) and attaches the tarball and `SHA256SUMS`. The workflow does not publish that Release. If a draft for the same tag already exists, the workflow uploads the assets and leaves the release notes unchanged. A person publishes the Release.

### Known issue

Path results from 0.2.1 or earlier (before the unpublished 0.2.2) that stored only a relative path have no saved source. They are no-source and cannot be opened.

pnpm 12 でプラグインを追加・更新すると、プロファイルの lockfile に公開から24時間たっていない依存が含まれている場合、ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION で失敗することがあります。このとき pnpm がプロファイルの node_modules を空にし、DSH も元に戻さないため、同じプロファイルのすべてのプラグインが読み込まれなくなります。プラグインの追加・更新は pnpm 10 で行ってください。壊れたときは pnpm 10 で `dsh plugin --profile web install` を実行すると戻ります。pnpm 11 では ERR_PNPM_UNEXPECTED_STORE で止まりますが、node_modules は壊れません。

The 0.2.1 residual risks below are unchanged.

## 0.2.1

### 残るリスク

スクリプトを動かすと、カード自身の遷移で、許可したフォルダの中身を外へ送れます。

Running scripts lets the card send the contents of the allowed folder out by navigating itself.

これはワークスペースのページで、実行を押したあとに限った抜け道です。通常のスクリプトが `location` を書き換える操作は、実行時の先頭で取り込んだ `URL` と `String.prototype.startsWith` で止めます。`String.prototype.indexOf` を先に取り替えても、フォルダの外には進みません。モジュールスクリプトはこの包みの外なので、本当の `location` を使ってフォルダ内のファイルを載せて遷移できます。Chromium は CSP の `navigate-to` に対応していません。

`/lantern/files/<token>/` のページは、実行を押すまでスクリプトを止めます。インラインのカードは、最初の表示ではこれまでどおり自動で動きます。インラインから許可したフォルダや `/lantern/files/` の中身は読めません。

最初の表示で密なループに入ると、そのタブだけが固まることがあります。そのタブを閉じて、会話を開き直してください。
