# Changelog

## 0.2.1

### 残るリスク

スクリプトを動かすと、カード自身の遷移で、許可したフォルダの中身を外へ送れます。

Running scripts lets the card send the contents of the allowed folder out by navigating itself.

これはワークスペースのページで、実行を押したあとに限った抜け道です。通常のスクリプトが `location` を書き換える操作は、実行時の先頭で取り込んだ `URL` と `String.prototype.startsWith` で止めます。`String.prototype.indexOf` を先に取り替えても、フォルダの外には進みません。モジュールスクリプトはこの包みの外なので、本当の `location` を使ってフォルダ内のファイルを載せて遷移できます。Chromium は CSP の `navigate-to` に対応していません。

`/lantern/files/<token>/` のページは、実行を押すまでスクリプトを止めます。インラインのカードは、最初の表示ではこれまでどおり自動で動きます。インラインから許可したフォルダや `/lantern/files/` の中身は読めません。

最初の表示で密なループに入ると、そのタブだけが固まることがあります。そのタブを閉じて、会話を開き直してください。
