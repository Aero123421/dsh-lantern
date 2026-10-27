<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/banner-ja-dark.svg">
    <img src="docs/banner-ja-light.svg" alt="dsh-lantern — DeepSeek Harness のチャットに、触れるビジュアルを" width="100%">
  </picture>
</p>

<p align="center">
  <a href="README.md">English</a> · <b>日本語</b> · <a href="README.zh.md">简体中文</a>
</p>

<p align="center">
  <img alt="DSH 0.2.x" src="https://img.shields.io/badge/DSH-0.2.x-4d6bfe?style=flat-square">
  <img alt="Web profile" src="https://img.shields.io/badge/profile-web-555?style=flat-square">
  <img alt="スキルは任意" src="https://img.shields.io/badge/skills-optional-2ea44f?style=flat-square">
  <img alt="MIT" src="https://img.shields.io/badge/license-MIT-555?style=flat-square">
</p>

<p align="center">
  <img src="docs/molecule.gif" alt="チャットの中でカフェイン分子を回し、結合角を測る" width="88%">
</p>

**エージェントの答えを「読むもの」から「触れるもの」に。** ツールは `show_visual` ひとつだけ。HTML を [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web のチャットの中で動くカードにします。回せる 3D モデル、つついて試せるシミュレーション、範囲を選べるグラフ、ドラッグで並べ替えるリストを表示できます。エージェントがこの形で質問すれば、あなたのクリックがそのまま答えとして戻ります。

## ここが違う

- 🪟 **会話の中に残る。** カードは回答の下に表示され、ターンの経過が折りたたまれても残ります。記録された回答は会話から復元し、入力値も同じブラウザ内で保存・復元できます。
- 🔁 **答えが戻る。** `await_response: true` ならエージェントは待ち、ユーザーが選んだもの、並べた順番、入力した内容がツール結果として返ります。「続きを聞く」ボタンはユーザーのメッセージとして送られます。
- 🎨 **DSH になじむ。** DSH のライト/ダーク・色・フォントをそのまま受け取り、切り替えにも再読み込みなしで即追従します。
- 🧰 **部品キットはあくまで出発点。** トークンと部品は CSS のカスケードレイヤーで先に読み込み、ビジュアル側のフォント・色・レイアウトで上書きできます。Three.js・D3・KaTeX・Chart.js はページに埋め込んでください。CDN のスクリプトは拒否します。
- 🗂️ **手元の HTML も。** `path` で DSH ホストのローカルワークスペースにあるページを指定すると、相対パスの CSS・画像・モジュール・JSON ごとサイドバーに表示します。
- 🪶 **スキルを読まずに、役立つビジュアルを。** 短いシステムプロンプトをオン／オフでき、図や操作が役立つ場面での利用を促します。基本的な使い方はツール説明に含まれ、同梱の `lantern-visuals` スキルは任意の上級ガイドです。

## ギャラリー

どれも `show_visual` を 1 回呼んだだけのビジュアルです。画像をクリックするとソースが開きます。スクリーンショットは GitHub のテーマ（ライト/ダーク）に合わせて切り替わります。これらは Lantern でここまで表現できることを示すために書いたもので、実際の出来は使うモデルによって変わります。

{{GALLERY}}

<table>
<tr>
<td width="50%"><img src="docs/graph.gif" alt="力学グラフのノードをドラッグ"><br><sub>概念マップを引っぱって動かし、気になるノードをエージェントに質問。</sub></td>
<td width="50%"><img src="docs/pathfind.gif" alt="壁を描いて A* の探索を見る"><br><sub>壁を描いて、A* が道を見つけるまでを見る。</sub></td>
</tr>
<tr>
<td colspan="2"><img src="docs/ranking.gif" alt="ドラッグで並べ替えた順番がエージェントに戻る"><br><sub>ドラッグで並べて決定すると、エージェントがその順番で続きを進める。</sub></td>
</tr>
</table>

## すぐ使う

```sh
dsh plugin --profile web add github:Aero123421/dsh-lantern
# その後 `dsh web` を再起動
```

必要なのは Web プロファイルと DSH `>=0.2.1-rc.2 <0.3.0-0` です。バージョンタグを push すると、GitHub の Release を DRAFT で作り、`dsh-lantern-<version>.tgz` と `SHA256SUMS` を添付します。ワークフローは公開しません。同じタグの DRAFT が既にあるときは、本文はそのままに資産だけ添付します。公開は人が行います。チェックサムを確かめてからアーカイブを入れます。

```sh
sha256sum -c SHA256SUMS
dsh plugin --profile web add ./dsh-lantern-0.2.3.tgz
```

読み込まれたかは `dsh --profile web --dump-config | grep lantern` で確認できます。

あとは頼むだけです。たとえば:

- 「カフェインってどんな形？ 回して見られるようにして」
- 「勾配降下法を、触れる 3D の曲面で説明して」
- 「A\* とダイクストラを、壁を描けるグリッドで比べたい」
- 「今スプリントのチケット、ドラッグで優先順位をつけさせて」
- 「`report/index.html` をサイドバーで開いて」

## 会話内ビジュアルの自動利用

**Plugins → dsh-lantern → 会話内ビジュアルを自動で使う** から切り替えます。既定はオンです。変更は自動で保存され、DSH が次のモデル実行ステップのプロンプトを組み立てるときから反映されます。再起動やスキルの読み込みは必要ありません。

オンのときは、[英語 102 語の短いガイダンス](src/host/prompt.ts) をシステムプロンプト層に登録します。説明・比較・探索には目的を絞った小さなカードを使い、操作への反応は画面内で処理し、会話へはユーザーが決定してから送るよう促します。簡単な回答は文章のままで構いません。このガイダンスは SKILLS の本文に依存しません。トークン数はモデルのトークナイザーによって変わり、ツール説明もコンテキストを使います。同梱の上級ガイドは自動スキル一覧には載せず、メッセージを `/lantern-visuals` から始めたときだけ明示的に読み込めます。

この設定をオフにするとガイダンスが外れます。`show_visual` は使えるので、図や操作できる表示を直接依頼できます。Plugins でプラグイン全体を無効にすると、ツール・ルート・プロンプトセクション・UI がアンロードされます。任意のデザインガイドを読むことは、ツールを使う条件ではありません。

## しくみ

```mermaid
sequenceDiagram
    autonumber
    participant A as エージェント
    participant H as DSH ホスト・Lantern
    participant C as チャットのカード
    participant V as ビジュアル（サンドボックス iframe）
    A->>H: show_visual { title, html, await_response: true }
    H-->>C: ツール行が流れてくる（書きながらプレビュー）
    C->>V: 文書 + キット + 今の DSH テーマ
    Note over V: ユーザーがドラッグ・回転・選択…
    V->>C: lantern.submit(value)（ユーザーの操作から）
    C->>H: POST /api/lantern.respond（認証つき）
    H-->>A: ツール結果「ユーザーの回答は…」
    Note over C: ターンが終わると、カードは最終回答の下へ
```

## モデル向け: `show_visual` ツール

| 引数 | |
|---|---|
| `title` | カードとタブの見出し（必須） |
| `html` | 断片でも完全な文書でも可。キットとテーマは読み込み済み |
| `path` | `html` の代わりにワークスペースの `.html`。常にサイドバーで開く |
| `display` | `inline`（既定）か `panel`（右サイドバー） |
| `await_response` | ユーザーの回答を待って結果として返す |
| `replace` | 修正版として置き換える以前のビジュアルの `id`。古いカードは新しい版へのリンクに畳まれる |

`html` と `path` はどちらか一方を指定します。ビジュアルの中では `window.lantern`（`submit`・`send`・`setState` / `getState`・`expand`・`openLink`・`colors()`・`visible`・イベント）が使えます。よくある操作はスクリプトなしでも書けます: `data-lt-choices`・`data-lt-submit`・`data-lt-form`・`data-lt-send`・`data-lt-fullscreen`・タブ・ステップ。任意の上級ガイド（パターン・3D・操作）は [`skills/lantern-visuals`](skills/lantern-visuals/SKILL.md) にあります。

<details>
<summary><b>見た目は自由自在: キットはあくまで出発点</b></summary>

トークンはすべて上書きでき、自分で書いたスタイルが必ずキットに勝ちます。

```html
<style>
  :root {
    --lt-font: "Iowan Old Style", var(--lt-font-serif);
    --lt-accent: #e8590c;
    --lt-radius: 18px;
  }
  :root[data-theme="dark"] { --lt-accent: #ff922b; }
</style>
<div class="lt-card raised lt-stack">
  <h3>見た目は自分で、仕組みはキットで</h3>
  <button class="primary" data-lt-submit='"ok"'>これでいこう</button>
</div>
```

トークンはフォント・文字サイズ・面・文字色・枠線・強調色・成功/警告/危険・8 色の系列色・角丸・余白・影・動きまで揃っています。詳しくは [`references/kit.md`](skills/lantern-visuals/references/kit.md)。

</details>

## ワークスペースのページ

`path: "report/index.html"` で、作業ディレクトリの実ファイルをサイドバーのタブに開きます。フォルダ単位で期限つきのリンクから配信するので、そのフォルダ内の相対パス `<link>`・`<img>`・`<script type="module">`・`fetch()` は普通の静的サーバーと同じように動きます。ほかのサイトへの `fetch`・XHR・画像・CSS の `url()`・フォーム・prefetch・WebSocket・`sendBeacon` は拒否します。このページのスクリプトは、実行を押すまで止まります。スクリプトを動かすと、カード自身の遷移で、許可したフォルダの中身を外へ送れます。ページの見た目はそのままに、`window.lantern` と `--lt-*` のテーマ変数も使えます。`<meta name="lantern-kit">` を書けばキットの部品も使えます。モジュール内では `new URL('data.json', import.meta.url)` でデータの場所を解決してください。

ツール実行時のディレクトリと入口パスを記録します。カードを開き直すとき、保存したディレクトリがセッションの現在の作業ディレクトリの中にある場合だけ、その時点のファイルを読みます。外にあるフォルダは拒否します。編集は次に読み込んだときに反映され、移動・削除したファイルは開けません。リモート実行先のファイルシステムには対応しないため、その場合はデータを埋め込んだ `html` を渡してください。

0.2.1 以前に作った、相対パスだけを保存した `path` の結果にはソースがありません。no-source になり、開けません。

ワークスペースページが iframe 自体を別ページへ移動したり `location.reload()` を実行したりすると、Lantern との接続は新しい文書へ引き継がれません。サイドバーのタブを閉じてチャットから開き直すか、DSH 全体を再読み込みすると、接続と残っている保存済みの状態を復元できます。

<img src="docs/workspace-page.png" alt="相対パスの CSS・画像・モジュール JS・JSON を読み込んだレポートをサイドバーに表示（ダーク）" width="100%">

## 入力値と回答の保存

ビジュアルの再生成時に入力値を戻すには、`lantern.setState()` / `getState()` を使います。状態は同じブラウザの `localStorage` に、最大 300 件のビジュアルについて可能な範囲で保存します。機器間の同期はありません。ブラウザのデータ削除や保存容量の制限で失われる場合があり、ストレージを使えない場合は現在のページ内だけで保持します。

`await_response: true` では、ホストが待機を 1 回だけ確定し、回答済み・取り消し済み・終了済みの待機への再送信を拒否します。受け付けた回答は会話にも記録されます。回答待ちを指定しなかった場合やタイムアウト後の送信は、新しいユーザーメッセージになります。この経路では、複数のブラウザからの送信を全体で必ず 1 回にする保証はありません。

## 安全性

ビジュアルはモデルが書いたコードなので、Lantern は信頼せずに扱います。

- **隔離。** ビジュアルはサンドボックス化した iframe（`allow-scripts allow-forms allow-downloads`、`allow-same-origin` は付けない）で動きます。オリジンを持たないので、DSH の Cookie・DOM・API には届きません。回答はカードへの `postMessage` で渡り、送り主も確認します。
- **決めるのはユーザー。** 回答・メッセージ・リンク・サイドバー表示の要求は、そのビジュアルの中でユーザーが実際に操作した直後だけ受け付けます。回答は 1 ビジュアル 1 回で、続きのメッセージは間隔と回数に上限があります。
- **止められる通信。** HTML ビジュアルとワークスペースのページは、外部への `fetch`・XHR・`sendBeacon`・WebSocket・画像・CSS の `url()`・スタイルシート・`<script src>`・prefetch/preload・フォーム送信・`<base>` を拒否します。ページが自分で作る `data:` と `blob:` の画像は使えます。CDN のスクリプトも拒否します。許可すると prefetch も外へ出るためです。書いている途中のプレビューでは、スクリプト・イベント属性・`javascript:` URL・埋め込みフレームを取り除きます。
- **止められない通信。** スクリプトを動かすと、カード自身の遷移で、許可したフォルダの中身を外へ送れます。通常のスクリプトが `location` を書き換える操作は、実行時の先頭で取り込んだ `URL` と `String.prototype.startsWith` だけで判定します。`String.prototype.indexOf` を先に取り替えても、フォルダの外には進みません。モジュールスクリプトはこの包みの外なので、本当の `location` を使えます。Chromium は CSP の `navigate-to` に対応していません。`/lantern/files/<token>/` のページは、実行を押すまでスクリプトを止め、その画面にもこのことを書きます。インラインのカードは最初の表示でこれまでどおり自動で動きますが、許可したフォルダや `/lantern/files/` の中身は読めません。
- **開き直したカードは止まったまま。** インラインのスクリプトが勝手に動くのは、そのビジュアルを作ったページで最初に表示されたときだけです。その会話を開き直してもスクリプトは再実行されず、実行を押す前の状態に戻り、ほかのタブは動いたままです。最初の表示で無限ループに入ると、そのタブだけが固まることがあります。フレームがページと同じレンダラーを使うための既知の制限です。そのタブを閉じて会話を開き直してください。
- **ファイルは範囲内だけ。** ワークスペースのリンクはランダムで、そのページのフォルダだけを対象にし、8 時間で失効し、DSH の認証済み API からしか発行されません。シンボリックリンクは解決し、開いたファイルでもう一度確かめます。隠しファイル・隠しフォルダは拒否します。カードを開き直すとき、保存したフォルダを配信するのは、それがセッションの現在の作業ディレクトリの中にある間だけです。

## 設定

自動利用は Plugins のスイッチで切り替えられます。プロファイルの `cordis.patch.yml` で既定値を指定することもできます。

```yaml
- id: dsh-lantern
  config:
    automaticVisuals: true     # 短いシステムガイダンス。Plugins から即時変更可
    answerTimeoutMinutes: 15   # 回答を待つ時間（既定 15 分、最大 1440）
    maxHtmlChars: 400000       # html 引数の上限（既定 400000 文字）
```

上級設定: DSH の `complete: true` なプロンプトプリセットは、組み立てるシステムプロンプト全体を置き換えます。Lantern はその設定を尊重し、追加のガイダンスを継ぎ足しません。

## 開発

```sh
npm install
npm run check                                       # 型チェック・テスト・ビルド（lib/ を生成）
dsh plugin --profile web add /path/to/dsh-lantern   # 手元のフォルダをリンク
```

GitHub から入れるときにビルドが要らないよう、`lib/` はコミットしています。ホスト側は Node の ESM で、設定スキーマのために `@deepseek-ai/schemastery` を実行時に import します。ブラウザ側は DSH Web のモジュールローダーから読み込まれ、DSH の React ランタイムを共有します。

## これから

- UI 確認のための GIF・動画の取り込み
- MCP Apps サーバーの UI 表示
- タッチ画面での 3D カードの二本指操作

## ライセンス

MIT。Lantern は非公式のコミュニティ製プラグインで、DeepSeek とは関係ありません。
