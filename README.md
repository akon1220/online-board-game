# game-platform

いろんなゲームを載せられるサイト

# リンク集

### Product
http://playground.wiki

### Staging
http://staging.playground.wiki

### GitHub

https://github.com/UT-LGTM/game-platform

### Figma

https://www.figma.com/file/dnqBlawUj9GzOdFXNaV445/Playground.Wiki?node-id=73%3A14

### ゲーム選定シート

https://docs.google.com/spreadsheets/d/1N_ZGHpT8v4G0faxKOrJJgJwUp0n75ukHHHVmDRpxnFI/edit?usp=sharing

### コンセプト説明スライド

https://docs.google.com/spreadsheets/d/1sp9C5vR5eHfsUmkFNeN-P2mUNPHtaP8AVwkJMvip6PA/edit#gid=0

### SFP\_面接スライド

https://docs.google.com/presentation/d/1WsJKLj5QEffimR9w1wl6oyLu_H5q5UQXER7IEkxATVc/edit#slide=id.p

### SFP\_競合調査

https://docs.google.com/spreadsheets/d/1sp9C5vR5eHfsUmkFNeN-P2mUNPHtaP8AVwkJMvip6PA/edit#gid=0

# 技術

- フロントエンド: [React](https://github.com/facebook/react), [TypeScript](https://github.com/microsoft/TypeScript)
- バックエンド: [Node.js](https://nodejs.org/ja/), [express](https://expressjs.com/ja/)
- Web Socket: [Socket.IO](https://socket.io/)
- デザインパターン・設計: Atomic Design, Redux, Re-ducks
- CSS FW: [semantic ui](https://semantic-ui.com/), [semantic ui react](https://react.semantic-ui.com/)
- Asset Packer: [webpack](https://webpack.js.org/)
- Infra: AWS(EC2), [nginx](https://www.nginx.com/)

## Setup

パッケージをインストール

```
$ yarn install
```

開発環境の立ち上げ

```
$ yarn dev
```

コードの整形

```
$ yarn lint:fix
```

## Deploy

slack のチャンネルで

```
/github deploy UT-LGTM/playground-wiki
```

デプロイしたいブランチを選択

Environmentに`staging`または`production`を指定する
`production`へのデプロイは現状ダウンタイムを作ってしまうので、時間帯に考慮してください。

## オススメ VSCode パッケージ

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): ESLint の設定を読み取ってよしなにしてくれます。
- [Webpack](https://marketplace.visualstudio.com/items?itemName=wk-j.webpack-progress): Webpack の Progress を表示してくれます。

## Prefix Commit Message

|                  Content                   |        prefix         |          code           |
| :----------------------------------------: | :-------------------: | :---------------------: |
|                First commit                |        :tada:         |        `:tada:`         |
|          Introducing new features          |      :sparkles:       |      `:sparkles:`       |
|                Fixing a bug                |         :bug:         |         `:bug:`         |
|              Refactoring code              |       :recycle:       |       `:recycle:`       |
| Adding or updating the UI and style files  |         :art:         |         `:art:`         |
|      Improve development environment       |     :sunglasses:      |     `:sunglasses:`      |
|                Writing docs                |       :pencil:        |       `:pencil:`        |
|           Improving performance            |         :zap:         |         `:zap:`         |
|      Work for production environment       |       :running:       |       `:running:`       |
|        Changing configuration files        |       :wrench:        |       `:wrench:`        |
| Updating code due to code review changes.  |       :ok_hand:       |       `:ok_hand:`       |
|          Adding or updating tests          |  :white_check_mark:   |  `:white_check_mark:`   |
|           Fixing security issue            |        :lock:         |        `:lock:`         |
|     Adding or updating CI build system     | :construction_worker: | `:construction_worker:` |
| Writing bad code that needs to be improved |       :hankey:        |       `:hankey:`        |
|               Improving SEO                |         :mag:         |         `:mag:`         |
|          Experimenting new things          |       :alembic:       |       `:alembic:`       |
|              Critical hotfix               |      :ambulance:      |      `:ambulance:`      |
|           Removing code or files           |        :fire:         |        `:fire:`         |
|                 Save money                 |        :bank:         |        `:bank:`         |
|              Work In Progress              |    :construction:     |    `:construction:`     |
