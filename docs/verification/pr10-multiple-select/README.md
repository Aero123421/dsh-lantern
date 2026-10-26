# PR #10: 全解除したmultiple selectの履歴復元

前のcheckbox修正 `19c82d4cff1d2b41661dcc09d44ce179646712c8` を一時展開し、同じブラウザfixtureを当てて再現した。選択を全解除するとnative FormDataからnameが省略され、送信直後のselectは未ロック、履歴復元後は3件のmarkup初期選択が復活した。[修正前JSON](baseline-runtime-checks.json) / [修正前画像](baseline-select-restored.png)。

## 修正と互換性

省略された有効な`select-multiple`も未選択として復元・ロックする。省略時の値列は明示的な空配列にし、文字列`"undefined"`というoptionへ誤一致させない。native FormDataの省略・scalar・arrayは変更しない。disabled属性とdisabled fieldset配下の初期選択は維持し、checkbox修正・password/file除外・Issue #12修正も保持する。製品差分はruntimeの5行の置換と対応libの再生成である。

## 検証

- `npm run check`: 型、93 tests、ビルド成功。[ログ](check.log)
- 実sandbox runtimeとfixture親: 45項目成功。[結果](runtime-checks.json)
- 公式DSH 0.2.1-rc.2と決定的モデル: 31項目成功。[結果](integration-checks.json)

新規fixtureは全解除、1件だけ選択したscalar、2件選択したarray、disabled/disabled fieldset、空回答object、文字列`"undefined"`と空文字のoption、390px light/darkを確認する。送信直後と新規iframeでの復元後を比較して一致し、既存checkbox・失敗/再試行・IME・高さ調整・SVG/WebGL検証も成功した。fixture親はselectフォームのresizeを受け取り、フォーム末尾が収まることを待って撮影する。

実DSHでは初期選択された`materials`を全解除し、送信→host確定→ページ再読み込み→Runを実行した。回答からnameが省略されたまま、選択0件/disabledを維持することを確認した。390pxでは画面をスクロールしてselectとsubmitまで表示し、ページ上端のスクロールによる部分表示とiframe内の切れを区別した。

個人のアカウント/APIキー、既存会話、実LLMは使わず、一時DSH homeとfixtureモデルだけで実行した。[DSHログ](server.log)のローカル接続tokenは除去済み。本番公開・課金・マージは行わない。

## 画像確認

各画像を開き、選択の復活、ロック状態、横はみ出し、見切れ、重なりを確認した。状態・viewport・fixture/DSH・製品hash・結果は[image-review.json](image-review.json)に記録した。最終commit確定後にもスイートと撮影を再実行し、exact SHA付き画像一覧を `/tmp/lantern-select-final-evidence/image-review.json` に保存する。

| 状態 | 画像 |
|---|---|
| 初期選択 | [fixture](runtime-select-defaults.png) |
| 全解除とscalar/array選択 | [送信前](runtime-select-cleared-draft.png) |
| 送信中 | [disabled submitと送信状態](runtime-select-sending.png) |
| 確定後 | [未選択とロック](runtime-select-committed.png) |
| 履歴復元 | [fixture](runtime-select-restored.png) / [公式DSH](dsh-select-history.png) |
| 空回答object | [初期値を復活させず全解除](runtime-select-empty-answer.png) |
| 390px | [light](runtime-select-mobile-light.png) / [dark](runtime-select-mobile-dark.png) / [公式DSH](dsh-select-history-mobile.png) |

専用の取消・ネットワーク再接続、永続セッション削除、動的disabledの未送信状態の復元、OSネイティブIME、物理GPUは今回の対象外。Issue #11のregistry保持も別件として残る。既存のCSP警告と履歴script停止による拒否は結果JSONに残し、未捕捉ブラウザ例外は0件だった。
