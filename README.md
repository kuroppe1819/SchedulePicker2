<img width="1304" alt="cover image of SchedulePicker" src="https://user-images.githubusercontent.com/17245737/76805075-3f187b80-6821-11ea-9359-de46ba6c416c.png">

- ガルーンの今日のスケジュール情報を取得して、kintoneスレッドなどに挿入するChrome拡張です。

## バージョンアップ情報
- Ver3.1.3
    - Feature
        - 日跨ぎの予定に対応
    - Fix
        - 予定のソート順を修正
- Ver3.1.2
    - Fix
        - Chromeのプロセスをkill、マイグループの更新に失敗したときにコンテキストメニューが消える問題を修正

- Ver3.1.1
    - Feature
        - ポップアップ画面に指定日カレンダーを追加
    - Fix
        - 右クリックで表示されるメニューから日付のチェック選択を消す(v2の挙動と合わせる)

- Ver3.1.0
    - Feature
        - Markdown投稿機能を追加
    - Fix
        - ポップアップ画面のデザイン変更
        - テンプレート投稿時に日付も投稿される
        - Garoon予定のタグの色を一部変更
        - オプション画面を削除

- Ver3.0.7
    - Fix
        - 終日予定の先頭に`終日`タグを付けるようにした
        - 期間予定を非表示にした
        - Myグループが存在しないときに更新するとメニュー項目が消えるバグを修正

- Ver3.0
    - Feature
        - GaroonのMyグループに所属する全員分の予定をマージして取得する
            - ユーザー名のリンクを選択すると対象日のGaroonスケジュールに遷移する
        - 前営業日 / 翌営業日の予定を取得する
        - セキュアアクセスでも予定を取得できる
    - FIX
        - カーソルの位置に取得した予定を表示できるように修正
        - 通常予定と期間予定で項目を分けるように修正

- Ver2.0
    - ??

- Ver1.1.2
    - 非公開予定の初期値を「含めない」に変更
- Ver1.1.1
    - innerHTMLの修正
- Ver1.1.0
    - 非公開予定のON/OFF機能追加
    - 指定日の予定取得機能の追加
    - 終了時間でのソート処理追加
- Ver1.0.1
    - 繰返し予定のソート処理追加
- Ver1.0.0
    - 製品リリース
## Disclaimer
This OSS is my own personal work and does not have any relationship with Cybozu Inc. or any other organization which I belong to.

## 初期バージョン開発日
2017.12.19-21
cybozu Hackathon
○○チーム
