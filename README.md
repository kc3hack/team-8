# team-8 LINE Bot 鯖

## 環境構築

以下、クローンが完了して、このプロジェクトのルートディレクトリをカレントディレクトリに設定している前提で説明しています。

### 依存パッケージのインストール

```bash
npm i
```

### Heroku CLI のインストール

#### Windows の場合

[インストーラ](https://devcenter.heroku.com/articles/heroku-cli) を使ってインストールしてください。

#### macOS の場合

事前に Homebrew を導入しておき、以下のコマンドを実行してください。

```bash
brew tap heroku/brew && brew install heroku
```

### Heroku へのログイン

以下のコマンドを実行して、自動で開くウェブページ上で Heroku アカウントにログインしてください。

```bash
heroku login
```

### Heroku アプリとリポジトリを紐付ける

```bash
heroku git:remote -a kc3
```

``git remote -v`` を実行すると、 remote に ``origin`` の他に ``heroku`` が追加されていることが確認できます。
今後、Heroku にこのアプリをデプロイする際は ``git push heroku master`` コマンドを使用してください。
