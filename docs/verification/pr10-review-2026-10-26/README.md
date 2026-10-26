# PR #10 レビュー・Issue #12 修正検証（2026-10-26）

Issue #12 の20段制限を訪問済みIDによる循環検出へ変更した。元PRでは Chromium 上でも r0 のリンク先が置換済みの r20 になり、修正後は r21 / r80 の最新カードへ直接移動する。循環時は置換リンクを出さず、内容を閲覧できる状態に保つ。

比較した最新 default branch は `main` / `8ac40233ca762014f6451f5c1b04e2b44d146360`、元PR head は `5c0572e07c078286a92965913513d498602a07b3`。open PR は #10 のみ。既存27コミットを親に追加し、既存変更を保持する。新規PR・マージ・リリースは行わない。今回の製品ファイルと配布用 lib の SHA-256 は [environment.json](environment.json) に記録した。

## レビューで追加修正した点

- **P2: HTMLの余白で内容が切れる回帰。** PRが導入した高さ計測は body の上端を差し引くため、150pxの折りたたまれた上余白がある内容の下端170pxに対し、iframeが24pxになる。文書座標で下端を測定し、rootの高さで末尾の余白も含める。修正後は上余白の例が171px、bodyの余白の例が150px、末尾余白の例が170px。既存のflex・スライダー・100vh検証も成功。
- **P3: workspace iframeの名前。** PathFrameからFrameへ視覚表示のtitleを渡し、汎用名「Visual」になる欠落を修正。mock file APIを通すブラウザ検証で「Workspace report」を確認。

mainから元PRまでの46ファイル全体を対象に、変更されたhost/provider・設定・prompt・イベント定義・フォーム/runtime・テーマ/contrast・表示位置・配布lib・ガイド・検証コードと記録をレビューした。公式DSH 0.2.1-rc.2のskills登録、locator/get、volatile-update、fiber破棄時のprovider解除/AbortSignalと整合する。設定の初期値、両ガイドの無効化、遅延read後の再確認を確認した。show_visual引数やLanternの公開APIを変更しない。data-lt-submitの明示値送信は従来動作で、フォーム全体の送信と混同しない。

終了処理は、hostのpending.closeAll・sources/cwdの解放、abort/timeout待機解除、履歴observerのdispose、Frameのportとイベント解除、theme observer解除、tail所有数解除を確認した。既存unit testsはunload中のpath解決も検証する。今回の実DSH runner完了後は3088番ポートがECONNREFUSED、一時DSH homeは0件だった。実DSH画面からのプラグイン全体の無効化/再有効化操作は今回のシナリオには含めない。

## 今回実行した検証

| 対象 | 結果・証拠 |
|---|---|
| 型・既存/回帰テスト・ビルド | `npm run check` 成功、93 tests / 0 failures。[ログ](check.log) |
| mock DSH host + 実Tail/VisualCard/Frame | 29項目成功。[JSON](replacement-checks.json) |
| 実sandbox iframe runtime + テスト親 | 27項目成功。[JSON](runtime-checks.json) |
| 公式DSH 0.2.1-rc.2 + 決定的モデルadapter | 24項目成功、初期tail/slider smokeも成功。[JSON](integration-checks.json) / [初期確認](checks.json) |
| 修正前の連鎖 | 元PRのソースを一時展開して同じUIテストを実行。21回で意図どおり失敗、実scroll先r20、data-replaced=true。[JSON](baseline-replacement-checks.json) |
| 修正前の余白 | 元PRと同じruntimeに新しい回帰シナリオを適用。bottom=170 / viewport=24で失敗。[JSON](baseline-runtime-checks.json) |

Node 24.19.0、React/ReactDOM 18.3.1、Playwright 1.55.1、ローカルChromium 154.0.8037.57を使用。ブラウザとDSHは一時ディレクトリからloopbackだけで起動した。テストは個人のアカウント/APIキー/既存会話を使用せず、DSHはこの起動専用のローカル接続トークンとfixtureモデルを使う。トークンは[server.log](server.log)から除去済み。実認証・本番公開・課金を伴う処理はない。runtimeの依存lockfileのハッシュはenvironment.json、実体は作業環境の `/tmp/lantern-review-evidence/runtime-package-lock.json` に保持した。

mock UIでは通常1回、21回、80回、390px、置換カードのiframe重複なし、会話表示削除時のunmountとtail所有数解除、再表示でのscript停止、同一IDのfork分離、失敗した置換を無視して直前の成功カードへ移動、次の成功置換、循環、workspace iframe名とunmountを検証した。unitでは1000回までの連鎖、2/3ノードの循環、自分への置換、別セッションも確認する。

公式DSHでは回答末尾の配置、重複なし、テーマ、390px、履歴再読込とRun、保存slider、sidebar、awaitした日本語フォームの入力/改行/送信/モデル再開、確定回答復元、両ガイドON/OFFと描画継続を確認した。今回の長い置換連鎖・失敗注入・会話表示削除はmock側の検証であり、公式DSH側の永続セッション削除や長いモデル会話を検証したという意味ではない。

各スイートのpageerrorは0件。Chromiumの既存navigate-to未対応警告と、履歴停止中の意図したscript拒否はJSONに記録し、その他のconsole errorは0件だった。IMEはsynthetic composition、WebGL2はSwiftShaderの描画/画素読み戻しであり、OSネイティブIMEや実GPU、実LLMの生成品質は対象外。

## 画面確認

以下の画像を今回の実行後に開いて目視確認した。

- [21回の置換後にr21の内容を表示](twenty-one-replacements.png)
- [390pxで80回の置換後にr80を表示](mobile-long-chain.png)
- [上余白の下にあるラベルが切れずに表示](runtime-collapsed-margin.png)
- [公式DSHの回答末尾・ダークテーマ](dsh-dark.png)
- [公式DSHの日本語フォーム確定後](dsh-form-answered.png)

## 残る制約

[Issue #11](https://github.com/Aero123421/dsh-lantern/issues/11) の非表示VisualRecord/HTML保持は既存問題として残る。今回のunmount確認はDOM・tail所有数・script gateの確認で、registryのメモリ解放やheap改善を主張しない。長い連鎖の解決コストは連鎖長に比例し、全カードでの計算量や大量セッションのheap計測は対象外。実DSHの対象バージョンは0.2.1-rc.2であり、対応範囲内の全バージョンを網羅する互換性保証ではない。

再実行手順は [test/browser/README.md](../../../test/browser/README.md) を参照。今回の追加は既存PR #10へ通常のfast-forward pushで反映し、マージ判断は行わない。
