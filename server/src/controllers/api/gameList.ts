export type GameListItem = {
  id:
    | 'noop'
    | 'simple_chat'
    | 'shiritori'
    | 'sea_turtle_soup'
    | 'vulture'
    | 'monopoly'
    | 'catan'
    | 'ghost'
    | 'word_wolf'
  name: string
  image: string
  description: string
  acceptableMemberCount: number[]
  minDuration: number
  maxDuration: number
  status: 'no release' | 'before release' | 'release'
  rule: string
}

export const gameList: GameListItem[] = [
  {
    id: 'noop',
    name: '何もしない、何もできない。',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Halma-Spielfeld.jpg/200px-Halma-Spielfeld.jpg',
    description: '[テスト用]何もしなくたっていい',
    acceptableMemberCount: [2, 3],
    minDuration: 1,
    maxDuration: 10,
    status: 'no release',
    rule: `## 概要
何もしません。

## 終了・勝利条件
何もしなかった人の勝ちです。

## ルール詳細
プレイヤーは全員何もしません。
    `,
  },
  {
    id: 'simple_chat',
    name: 'ただのチャット',
    image:
      'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    description: '［テスト用］チャットを試せる。',
    acceptableMemberCount: [2, 3, 4],
    minDuration: 1,
    maxDuration: 100,
    status: 'no release',
    rule: `## 概要
チャットします。

## 終了・勝利条件
チャットした人の勝ちです。

## ルール詳細
好きなことをチャットします。
    `,
  },
  {
    id: 'shiritori',
    name: 'しりとり',
    image:
      'https://images.unsplash.com/photo-1451226428352-cf66bf8a0317?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1953&q=80',
    description: '［テスト用］しりとりゲーム',
    acceptableMemberCount: [2, 3, 4],
    minDuration: 30,
    maxDuration: 60,
    status: 'no release',
    rule: `## 概要
しりとりしていきます。

## 終了・勝利条件
語末が「ん」の言葉を言ってしまった人が負けです。

## ルール詳細
前のターンの人の言葉の語末を次のターンの人は語頭として使います。
    `,
  },
  {
    id: 'sea_turtle_soup',
    name: 'ウミガメのスープ',
    image:
      'https://images.unsplash.com/photo-1544621678-f17b5b909559?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1949&q=80',
    description:
      'FBIの入局試験でも採用されている奇想天外な発想を要求されるクイズゲーム',
    acceptableMemberCount: [2, 3, 4, 5, 6],
    minDuration: 5,
    maxDuration: 20,
    status: 'release',
    rule: `## 概要
ストーリーの断片から全体のストーリーを考え出すクイズ型ゲームです。


## 終了・勝利条件
回答者が思いついたストーリーの全体を出題者に伝えて、合っていれば当てた人の勝ちです。
当てた時点でそのゲームは終了です。

## ルール詳細
<img style="width: 1000px;max-width: 100%" src="https://gyazo.com/5841dc1f12d053f71453f8ff792bda70/raw">

ゲームを始めると上記のような画面が表示されます。

### スタート時
参加者の中でランダムに1人が「出題者」、それ以外が「回答者」となります。

### 役割の説明
回答者は、出題者に対して問題に関する質問をすることができます。

出題者は、「はい」「いいえ」「関係ない」の三種類しか回答することができません。

例えば、回答者の質問は「問題文に登場していない、ストーリーに重要な人物はいますか？」などです。

回答者は、質問の答えから回答の手がかりを探っていきます。

問題の全容が分かった時点で、回答者は出題者に対して「問題の答え/問題のストーリーは〇〇ですか？」と答えを出題者に確認してください。


## 画面の説明

### チャット
チャットで回答者と出題者でやりとりできます。

チャットを使わずとも、ZOOMやLINEなどのツールでゲームを進めることもできます。
使いやすい方を使うことをオススメします。

### 操作パネル
問題を知っている場合や答えを回答者が当てた時は、「問題と役割を変える」ボタンで、問題と参加者の役割をランダムで変更することができます。
「ゲームをやめる」で部屋に戻ります。

より詳しいルールの説明は[コチラ](https://c13m7u.hatenablog.com/entry/2019/12/14/190000)
    `,
  },
  {
    id: 'vulture',
    name: 'ハゲタカのえじき',
    image:
      'https://images.unsplash.com/photo-1560847299-7f8ca0ec802a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2700&q=80',
    description: 'カードをオークション形式で取得していくゲーム',
    acceptableMemberCount: [2, 3, 4, 5, 6, 7, 8],
    minDuration: 2,
    maxDuration: 5,
    status: 'release',
    rule: `## 概要
他の人より高い点数のカードを出して、ポイントカードを手に入れていくゲームです。

<iframe width="560" height="315" src="https://www.youtube.com/embed/4BVvF7HSncI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

より詳しいルールの説明は[コチラ](https://nicobodo.com/archives/15727588.html)
    `,
  },
  {
    id: 'monopoly',
    name: 'モノポリー',
    image:
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
    description: '盤上の不動産を取引して自分の資産を増やすゲーム',
    acceptableMemberCount: [2, 3, 4, 5, 6],
    minDuration: 60,
    maxDuration: 120,
    status: 'release',
    rule: `## 概要
サイコロを回してボードを回る中で自分の資産を購入、拡張していく投資ゲームです。

## 終了条件・勝利条件
ターン終了時に1人でも所持金が0円以下のプレイヤーがいたら、その時点でゲームが終了します。

ゲーム終了時に総資産が高い順に順位がつけられます。

総資産は以下の合計で計算されます。
- 1. 現在の所持金
- 2. 抵当に入っていない資産の購入価格の合計
- 3. 抵当に入っている資産の抵当価格の合計
- 4. 現在建っている店・ホテルの建設費の合計金額

## ゲームの進め方
以下の動画などを参考にしてください。

<iframe width="560" height="315" src="https://www.youtube.com/embed/i2xrdi6iNEA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

より詳しいルールの説明は[コチラ](https://www.esquire.com/jp/lifestyle/a190344/lifestyle-news-monopoly17-1201/)
    `,
  },
  {
    id: 'catan',
    name: 'カタン',
    image:
      'https://images.unsplash.com/photo-1437252611977-07f74518abd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1934&q=80',
    description: '無人島を舞台に、資源から島全体を開拓していくゲーム',
    acceptableMemberCount: [3, 4, 5, 6],
    minDuration: 30,
    maxDuration: 60,
    status: 'before release',
    rule: `
    `,
  },
  {
    id: 'ghost',
    name: 'おばけキャッチ',
    image:
      'https://images.unsplash.com/photo-1588863746368-508ae44a7917?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1332&q=80',
    description: '頭の回転が試される瞬発ゲーム',
    acceptableMemberCount: [2, 3, 4, 5, 6],
    minDuration: 20,
    maxDuration: 60,
    status: 'before release',
    rule: `
    `,
  },
  {
    id: 'word_wolf',
    name: 'ワードウルフ',
    image: 'https://images-fe.ssl-images-amazon.com/images/I/41GdIQgHqiL.png',
    description: 'あたえられたお題をもとに少数派を当てる心理ゲーム',
    acceptableMemberCount: [3, 4, 5, 6, 7, 8],
    minDuration: 5,
    maxDuration: 15,
    status: 'release',
    rule: `## 概要
ワードウルフとは、みんなで“あるお題”について話し合う中、  
「みんなとは異なるお題」を与えられた少数派の人（ワードウルフ）を探し出すゲームです。  
ただし、** ゲーム開始時は、自分が少数派かどうかは分かりません。 **  

## 勝利条件
お題について話し合った後、多数決で処刑する人を決めます。『** ワードウルフを処刑できれば市民チームの勝ち **』で、  
『** 市民が処刑されればワードウルフの勝ち **』となります。
    `,
  },
]
