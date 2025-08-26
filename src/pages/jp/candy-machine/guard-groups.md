---
title: ガードグループ
metaTitle: ガードグループ | キャンディマシン
description: 複数のガードグループの設定方法を説明します。
---

[前のページ](/jp/candy-machine/guards)では、ガードを紹介し、それらを使用してキャンディマシンのアクセス制御を定義しました。ガードを使用することで、例えばミントごとに1 SOLの支払いを追加し、特定の日付後にミントが開始されることを確保できることがわかりました。しかし、2回目の日付後に2 SOLを請求したい場合はどうでしょうか？特定のトークン保有者を無料または割引価格でミントできるようにしたい場合はどうでしょうか？ {% .lead %}

それぞれが独自の要件を持つ複数のガードセットを定義できたらどうでしょうか？そのために、**ガードグループ**を作成しました！

## グループはどのように機能しますか？

[任意のキャンディマシンでガードを設定する方法](/jp/candy-machine/guards#creating-a-candy-machine-with-guards)を覚えていますか？有効にしたいガードの設定を提供するだけです。ガードグループも同じように機能しますが、それらを識別するための一意の**ラベル**も付ける必要があります。

したがって、各ガードグループには以下の属性があります：

- **ラベル**: 一意のテキスト識別子。これは6文字より長くすることはできません。
- **ガード**: そのグループ内のすべてのアクティブなガードの設定。これは、キャンディマシンで直接ガードを設定するのと同じように機能します。

簡単な例を取ってみましょう。午後4時から5時まで1 SOLを請求し、その後午後5時からキャンディマシンが使い切られるまで2 SOLを請求したいとします。すべてボット税ガード経由でボットから保護されます。ガードの設定方法は以下のとおりです：

- グループ1:
  - **ラベル**: "early"
  - **ガード**:
    - SOL支払い: 1 SOL
    - 開始日: 午後4時（簡単にするために実際の日付は無視）
    - 終了日: 午後5時
    - ボット税: 0.001 SOL
- グループ2:
  - **ラベル**: "late"
  - **ガード**:
    - SOL支払い: 2 SOL
    - 開始日: 午後5時
    - ボット税: 0.001 SOL

これで、カスタマイズされた2段階ミントプロセスを作成しました！

キャンディマシンからミントしようとする人は、**どのグループからミントするかを明示的に伝える必要があります**。ミント時にグループラベルを求めることが重要な理由：

- 購入者が予期しないミント動作を経験しないことを保証します。最初のグループの終了日の最後に1 SOLでミントしようとしたが、トランザクションが実行される時には既にその日付を過ぎていたとします。グループラベルを求めなければ、トランザクションは成功し、1 SOLしか請求されることを期待していたにもかかわらず2 SOLが請求されてしまいます。
- 並列グループをサポートすることが可能になります。これについてはこのページで後で詳しく話します。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="キャンディマシン" theme="blue" /%}
{% node label="所有者: キャンディマシンコアプログラム" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="キャンディガード" theme="blue" /%}
{% node label="所有者: キャンディガードプログラム" theme="dimmed" /%}
{% node #group-1 theme="mint" z=1 %}
グループ1: "early" {% .font-semibold %}
{% /node %}
{% node label="SOL支払い" /%}
{% node label="開始日" /%}
{% node label="終了日" /%}
{% node label="ボット税" /%}
{% node theme="mint" z=1 %}
グループ2: "late"
{% /node %}
{% node label="SOL支払い" /%}
{% node label="開始日" /%}
{% node label="ボット税" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="ミント" theme="pink" /%}
{% node label="キャンディガードプログラム" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="アクセス制御" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="ミント" theme="pink" /%}
{% node label="キャンディマシンコアプログラム" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="ミントロジック" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" %}
どのグループから \
ミントするかを選択
{% /edge %}

{% /diagram %}

SDKを使用してグループを作成・更新する方法を見てみましょう。

{% dialect-switcher title="ガードグループ付きキャンディマシンの作成" %}
{% dialect title="JavaScript" id="js" %}

ガードグループ付きキャンディマシンを作成するには、`create`関数に`groups`配列を提供するだけです。この配列の各アイテムには`label`と、そのグループでアクティブにしたいすべてのガードの設定を含む`guards`オブジェクトが含まれている必要があります。

Umiライブラリを使用して上記の例を実装する方法は次のとおりです。

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

グループを更新するには、`updateCandyGuard`関数に同じ`groups`属性を提供するだけです。
`guards`オブジェクト全体と`groups`配列が更新されることに注意してください。つまり、**既存のすべてのデータを上書きします**！

したがって、設定が変更されていない場合でも、すべてのグループの設定を提供してください。既存の設定を上書きしないように、事前に最新のキャンディガードアカウントデータを取得したい場合があります。

「late」グループのSOL支払いガードを2 SOLではなく3 SOLに変更する例です。

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: candyGuard.guards,
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(3), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [updateCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## デフォルトガード

上記の例では、同じ**ボット税**ガードを両方のグループに提供する必要があったことに注目してください。これは、キャンディマシンで設定されたグローバル**ガード**を活用することで簡単にできます。

ガードグループを使用する際、キャンディマシンのグローバルガード — [前のページ](/jp/candy-machine/guards)で説明したもの — は**デフォルトガードとして機能します**！つまり、グループで明示的に有効にしてオーバーライドしない限り、グループはグローバルガードと同じガード設定をデフォルトで使用します。

簡単なまとめです：

- デフォルトガードでガードが有効になっているがグループのガードでは有効になっていない場合、グループは**デフォルトガードで定義された**ガードを使用します。
- デフォルトガードでガードが有効になっており、**かつ**グループのガードでも有効になっている場合、グループは**グループのガードで定義された**ガードを使用します。
- デフォルトガードまたはグループのガードでガードが有効になっていない場合、グループはこのガードを使用しません。

それを説明するために、前のセクションの例を取り、**ボット税**ガードをデフォルトガードに移動しましょう。

- デフォルトガード:
  - ボット税: 0.001 SOL
- グループ1:
  - **ラベル**: "early"
  - **ガード**:
    - SOL支払い: 1 SOL
    - 開始日: 午後4時
    - 終了日: 午後5時
- グループ2:
  - **ラベル**: "late"
  - **ガード**:
    - SOL支払い: 2 SOL
    - 開始日: 午後5時

ご覧のように、デフォルトガードはグループ内での繰り返しを避けるのに役立ちます。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="キャンディマシン" theme="blue" /%}
{% node label="所有者: キャンディマシンコアプログラム" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="キャンディガード" theme="blue" /%}
{% node label="所有者: キャンディガードプログラム" theme="dimmed" /%}
{% node label="ガード（デフォルトガード）" theme="mint" z=1 /%}
{% node label="ボット税" /%}
{% node #group-1 theme="mint" z=1 %}
グループ1: "early" {% .font-semibold %}
{% /node %}
{% node label="SOL支払い" /%}
{% node label="開始日" /%}
{% node label="終了日" /%}
{% node theme="mint" z=1 %}
グループ2: "late"
{% /node %}
{% node label="SOL支払い" /%}
{% node label="開始日" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="ミント" theme="pink" /%}
{% node label="キャンディガードプログラム" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="アクセス制御" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="ミント" theme="pink" /%}
{% node label="キャンディマシンコアプログラム" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="ミントロジック" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" /%}

{% /diagram %}

デフォルトガードを使用する場合でも、ミント時にグループを提供する必要があることに注意してください。つまり、ガードグループを使用する場合、**デフォルトガードのみを使用してミントすることはできません**。

{% dialect-switcher title="デフォルトガードとガードグループ付きキャンディマシンの作成" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリでデフォルトガードを使用するには、キャンディマシンを作成または更新する際に`groups`配列と組み合わせて`guards`属性を使用するだけです。例えば、上記で説明したガード設定を使用してキャンディマシンを作成する方法です。

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
  },
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 並列グループ

ミント時にグループラベルを要求することの本当に興味深い利点の1つは、**特定の時点で複数の有効なグループを持つ**能力です。これにより、プログラムの曖昧性が除去され、購入者がどのグループからミントしたいかを選択できます。

新しい例でそれを説明しましょう。「Innocent Bird」と呼ばれるNFTコレクションがあり、「Innocent Bird」NFTを保有している人には1 SOLの割引価格を提供し、他の人には2 SOLを請求したいとします。これらのグループの両方が同時にミントを開始できるようにしたい — 午後4時と言って — そして両方のグループでボットから保護されたいです。ガードの設定方法は次のとおりです：

- デフォルトガード:
  - 開始日: 午後4時
  - ボット税: 0.001 SOL
- グループ1:
  - **ラベル**: "nft"
  - **ガード**:
    - SOL支払い: 1 SOL
    - NFTゲート: "Innocent Bird"コレクション
- グループ2:
  - **ラベル**: "public"
  - **ガード**:
    - SOL支払い: 2 SOL

ご覧のように、これらのガード設定では、両方のグループが同時にミントすることが可能です。NFT保有者が「public」グループからミントすることを決定した場合、満額の2 SOLを支払うことさえ可能です。しかし、できるなら「nft」グループを選択することが彼らの最善の利益です。

{% dialect-switcher title="並列グループ付きキャンディマシンの作成" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリ経由で上記で説明したガード設定を使用してキャンディマシンを作成する方法です。

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
    startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
  },
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ amount: sol(1), destination: treasury }),
        nftGate: some({
          requiredCollection: innocentBirdCollectionNft.publicKey,
        }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ amount: sol(2), destination: treasury }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## まとめ

ガードグループは、ニーズに合わせてシーケンシャルおよび/または並列のミントワークフローを定義することで、キャンディマシンに全く新しい次元をもたらします。

[次のページ](/jp/candy-machine/guard-route)では、ガードに関するもう一つのエキサイティングな機能：ガード命令について見てみましょう！