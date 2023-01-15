# game-platform

いろんなゲームを載せられるサイト


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



デプロイしたいブランチを選択

Environmentに`staging`または`production`を指定する
`production`へのデプロイは現状ダウンタイムを作ってしまうので、時間帯に考慮してください。

## オススメ VSCode パッケージ

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): ESLint の設定を読み取ってよしなにしてくれます。
- [Webpack](https://marketplace.visualstudio.com/items?itemName=wk-j.webpack-progress): Webpack の Progress を表示してくれます。

