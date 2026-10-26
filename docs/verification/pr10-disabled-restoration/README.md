# PR #10: disabled欄と非データinputの復元境界

同名の有効欄が回答に含まれると、元からdisabledだった欄も処理される問題を再現した。比較元は `e27d45a78569a9600b5dc79c4c0f7d2c27e0b019` の一時展開である。

- disabled checked checkboxの`features=fixed`と有効なchecked checkboxの`features=optional`は`{features:"optional"}`を送信するが、元の復元処理はfixedをuncheckedへ変更した。
- disabled textと有効な同名textは、disabled欄が値の位置を消費し、有効な入力を空にした。scalar/arrayの両方で再現した。
- 同名のtype=button/reset/submit/imageも復元対象に入り、通常の入力の値位置を消費した。

[修正前の14ケースの全記録](baseline-disabled-restoration-checks.json)、[checkbox画像](baseline-checkbox-attribute-restored.png)、[scalar text画像](baseline-text-scalar-attribute-restored.png)、[action input画像](baseline-action-inputs-restored.png)。

## 最小修正

値の位置を消費する前に非データinputと元からdisabledのcontrolを除外する。`:disabled`を使い、disabled fieldsetと最初のlegend内の有効欄をブラウザ標準どおりに区別する。

回答後にLantern自身がロックしたcontrolはWeakSetで識別し、後続のstate適用から除外しない。これにより、同じstateの再適用と異なるstateの適用、後続回答でcheckbox/multiple selectのキーが省略されたときの全解除も保つ。公開API・FormDataの送信形式・hostの一度限りの回答確定は変更しない。WeakSetはDOMを強参照せず、observerやtimerなどの終了処理を追加しない。

## 有界な回帰表

| 対象 | ケース数 | 確認した整合性 |
|---|---:|---|
| checkbox: disabled属性 / fieldset / 最初のlegend例外 | 3 | 固定checkedを維持し、有効な同名欄だけ復元・ロック |
| radio: disabled属性 / fieldset | 2 | ネイティブ同名グループ排他と送信直前状態を保持 |
| single select: disabled属性 / fieldset | 2 | 固定選択と有効欄の回答を分離 |
| multiple select: disabled属性 / fieldset | 2 | 固定選択を維持し、後続の省略回答で有効欄を全解除 |
| 同名text配列: disabled属性 / fieldset | 2 | disabled欄が位置を消費せず、有効2欄へ順番どおり復元 |
| 同名text scalar: disabled属性 / fieldset | 2 | 有効1欄が空にならず、固定値は変更しない |
| button/reset/submit/image + 同名text | 1 | 4種類のaction値を復元・位置消費から除外 |

各ケースで送信値、送信直後、履歴復元、同一state再適用、異なるstate、元disabledの保持を比較する。radioは有効な別radioを選ぶ時点でdisabled側のcheckedがネイティブ排他により外れる。この送信直前状態を基準とし、同名radioを2個同時にcheckedにする保証は作らない。fieldset内で`disabled`属性自体が付け足される変化も記録する。

## 実行結果

- `npm run check`: 型、93 tests、ビルド成功。[ログ](check.log)
- 新規の実sandbox制御境界: **14ケース / 100確認成功**。[全記録](disabled-restoration-checks.json)
- 既存の実iframe runtime: **45確認成功**。[記録](runtime-checks.json)。checkbox全解除、multiple select全解除、hidden fallback、FormData scalar/array/boolean、password/file除外、失敗/再試行などを保持。
- 公式DSH 0.2.1-rc.2 + fixtureモデル: **33確認成功**。[記録](integration-checks.json)。同名disabled checkedのfixedと有効なoptionalを追加し、送信→確定→再読み込み→Run後にも両方の表示とロックを確認。

後続stateの変更テストはfixture親から実runtimeへ送るもので、実DSHの確定済み回答を後から書き換える機能を追加したという意味ではない。外部form-associated controlや任意の動的混合schemaには拡張しない。

## 画面証拠

同梱した14画像を開き、固定値、有効欄、ロック、はみ出し、見切れ、重なりを確認した。[画像一覧](image-review.json)には状態・viewport・fixture/DSH・製品hash・結果を記録した。最終head確定後も撮影と確認を再実行し、exact SHA付きの全画像一覧を `/tmp/lantern-disabled-final-evidence/image-review.json` に保存する。

- [checkbox復元](checkbox-attribute-restored.png)、[text scalar復元](text-scalar-attribute-restored.png)、[後続stateで有効欄だけ更新](text-scalar-repeated-state.png)
- [action inputと通常入力](action-inputs-restored.png)、[最初のlegend例外](checkbox-first-legend-restored.png)、[radio](radio-fieldset-restored.png)、[multiple select](select-multiple-fieldset-restored.png)
- [390px light](disabled-mobile-light.png)、[dark](disabled-mobile-dark.png)、[公式DSH履歴](dsh-disabled-history.png)、[公式DSHスマホ](dsh-disabled-history-mobile.png)

実認証、個人アカウント/APIキー、既存会話、実LLM、本番公開、課金は使わない。既存のCSP警告と履歴のscript停止は記録し、未捕捉例外は0件だった。専用の取消/再接続、永続セッション削除、OSネイティブIME、物理GPU、Issue #11のheap保持は対象外。既存PRへnon-force pushし、マージは行わない。
