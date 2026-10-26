# PR #10: unchecked checkboxの確定回答復元

独立レビューの候補をChromiumで再現した。初期checkedのcustom value checkboxを外して送信すると、native FormDataはそのnameを省略する。元のapplyStateは省略キーをskipするため、送信直後にロックされず、履歴再表示で初期checkedが復活した。同名グループを全解除した場合も同じだった。

比較元は `beb9047c78cca766716e86037391c188d137e0d2`。[修正前JSON](baseline-runtime-checks.json)と[修正前画像](baseline-checkbox-restored.png)に、未選択だったsingle/none-a/none-bがchecked:true、disabled:falseへ戻る結果を記録した。

## 最小修正

単一の宣言的フォームで確定回答を復元するとき、省略された有効なcheckboxも未選択へ戻し、ロックする。FormDataの省略/scalar/array/booleanという送信形式は変更しない。disabled属性やdisabled fieldset内の初期値は維持し、password/fileの復元拒否も維持する。製品変更はruntimeの6行と対応する配布libの再生成。Issue #12修正と元PRの既存変更を親コミットとして保持する。

## 検証結果

- `npm run check`: 型、93 tests、ビルド成功。[ログ](check.log)
- 実iframe runtime + fixture親: 38項目成功。[JSON](runtime-checks.json)
- 公式DSH 0.2.1-rc.2 + 決定的モデル: 29項目成功。[JSON](integration-checks.json)

fixtureでは単独custom checkbox、同名全解除、部分選択、複数選択array、1個だけ選択したscalar、default valueとcustom valueの混在、boolean false、hidden fallback、空回答object、disabled/disabled fieldsetを確認した。チェック状態とロック状態を送信直後と新規文書への再マウント後で比較して一致した。失敗時の入力保持・再試行、IME、狭幅、余白/100vh、SVG/WebGLの既存シナリオも成功した。

実DSHではfixtureフォームの単独custom checkboxと同名2個を全解除して送信し、hostに渡る回答から両nameが省略されたまま、確定後とページ再読み込み→Run後に未選択/disabledが維持されることを確認した。390pxでフォーム末尾のsubmitがiframe内に収まるまで待ち、横はみ出しも確認した。個人アカウント/APIキー・実LLM・実認証は使用していない。

## 画像レビュー

画像は実ピクセルを開いて確認し、各画像の状態、viewport、fixture/公式DSH、対象製品hash、結果を[image-review.json](image-review.json)に記録した。最終commit確定後にも同じスイートを再実行し、exact head SHAを付した全画像一覧と画像本体を作業環境の `/tmp/lantern-checkbox-final-evidence/` に保存する。ここに同梱した画像の製品ソースhashは、その最終headと一致する。

| 状態 | fixture画像 | 公式DSH画像 |
|---|---|---|
| 空・初期選択 | [空フォーム](runtime-form-empty.png) / [checkbox初期値](runtime-checkbox-defaults.png) | [初期選択](dsh-checkbox-defaults.png) |
| 解除して入力中 | [未選択draft](runtime-checkbox-unchecked-draft.png) | [日本語入力と全解除](dsh-form-input.png) |
| 送信中 | [フォーム](runtime-form-sending.png) / [checkbox](runtime-checkbox-sending.png) | 実DSHでの短い送信中状態は専用画像なし |
| 失敗・再試行 | [入力保持とエラー](runtime-form-error-retained-input.png) / [再送信](runtime-form-retrying.png) | 失敗注入はfixtureのみ |
| 確定後 | [未選択とロック](runtime-checkbox-committed.png) | [回答済み](dsh-form-answered.png) |
| 再表示 | [復元後](runtime-checkbox-restored.png) | [ページ再読み込み→Run](dsh-checkbox-history.png) |
| 空回答object | [すべて未選択](runtime-checkbox-empty-answer.png) | fixtureのみ |
| スマホ・テーマ | [390px light](runtime-checkbox-restored-mobile-light.png) / [dark](runtime-checkbox-restored-mobile-dark.png) | [390px履歴](dsh-checkbox-history-mobile.png) |

[DSH高さ調整中の画像](dsh-checkbox-loading-autoheight.png)には、一時的なフォーム末尾の見切れがある。これを完了状態の成功画像として扱わず、安定後の画像とformFitsの明示チェックを追加した。安定後は末尾の選択肢とsubmitが収まり、状態の誤り、重なり、操作不能は確認されなかった。スマホ画面上端の会話本文は現在のスクロール位置による部分表示であり、iframe内の内容切れとは区別した。

取消・ネットワーク再接続・永続セッション削除はこのcheckbox変更の専用シナリオでは未検証。履歴のscript停止→Runは実DSHで確認している。disabled制御を動的に変えた未送信状態や任意の独自JSフォーム全体を復元する仕組みではない。既知のIssue #11も別件として残る。ブラウザ例外は0件で、既存のCSP警告と意図した停止script拒否はJSONに保持した。

今回は既存PR #10への通常pushのみとし、マージ・リリース・本番公開・課金操作は行わない。
