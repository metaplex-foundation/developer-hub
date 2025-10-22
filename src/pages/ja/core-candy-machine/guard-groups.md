---
title: ガードグループ
metaTitle: ガードグループ | Core Candy Machine
description: Core Candy Machineで複数のガードのグループを設定および使用する方法を説明します。
---

[以前のページ](/ja/core-candy-machine/guards)の一つで、ガードを紹介し、Candy Machineのアクセス制御を定義するためにそれらを使用しました。ガードを使用することで、例えばミント毎に1 SOLの支払いを追加し、特定の日付後にミントが開始されることを確保できることを見ました。しかし、第2の日付の後に2 SOLを請求することもしたい場合はどうでしょうか？特定のトークンホルダーに無料または割引価格でミントを許可したい場合はどうでしょうか？{% .lead %}

それぞれが独自の要件を持つ複数のガードセットを定義できればどうでしょうか？その理由のために、私たちは**ガードグループ**を作成しました！

## グループはどのように機能しますか？

[有効にしたいガードの設定を提供するだけで、どんなCore Candy Machineでもガードを設定できる](/ja/core-candy-machine/guards#ガード付きcandy-machineの作成)方法を覚えていますか？ガードグループも同じ方法で機能しますが、それらを識別するために固有の**ラベル**も提供する必要があります。

したがって、各ガードグループには以下の属性があります：

- **ラベル**: 固有のテキスト識別子。これは6文字を超えることはできません。
- **ガード**: そのグループ内のすべての有効化されたガードの設定。これはCore Candy Machineに直接ガードを設定するのと同じように機能します。

簡単な例を取ってみましょう。4時から5時まで1 SOLを請求し、その後5時からCore Candy Machineが消耗するまで2 SOLを請求したいとしましょう。Bot Taxガード経由でボットから保護されていることを確認しながらすべてを行います。ここでガードをどのように設定するかを示します：

- グループ1:
  - **ラベル**: "early"
  - **ガード**:
    - Sol Payment: 1 SOL
    - Start Date: 4 pm (簡単にするために実際の日付はここでは無視します)
    - End Date: 5 pm
    - Bot Tax: 0.001 SOL
- グループ2:
  - **ラベル**: "late"
  - **ガード**:
    - Sol Payment: 2 SOL
    - Start Date: 5 pm
    - Bot Tax: 0.001 SOL

このようにして、カスタマイズされた2段階ミントプロセスを作成しました！

今、誰かがCore Candy Machineからミントしようとするとき、**彼らはどのグループからミントしているかを明示的に私たちに伝える必要があります**。ミント時にグループラベルを求めることが重要な理由は：

- 購入者が予期しないミント動作を経験しないことを保証します。最初のグループの終了日の最後に1 SOLでミントしようとしましたが、トランザクションが実行される頃にはその日付を過ぎているとします。グループラベルを求めなかった場合、トランザクションは成功し、1 SOLのみを請求されることを期待していたにも関わらず、2 SOLが請求されます。
- 並行グループをサポートすることを可能にします。これについては後でこのページで詳しく説明します。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node #group-1 theme="mint" z=1 %}
グループ1: "early" {% .font-semibold %}
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="Bot Tax" /%}
{% node theme="mint" z=1 %}
グループ2: "late"
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="Bot Tax" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=70 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=78 y=100 label="NFT" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" %}
どのグループから \
ミントするかを選択
{% /edge %}

{% /diagram %}

今、SDKを使用してグループをどのように作成・更新できるかを見てみましょう。

{% dialect-switcher title="ガードグループ付きCandy Machineの作成" %}
{% dialect title="JavaScript" id="js" %}

ガードグループ付きCandy Machineを作成するには、`create`関数に`groups`配列を提供するだけです。この配列の各項目には、そのグループで有効化したいすべてのガードの設定を含む`label`と`guards`オブジェクトが含まれている必要があります。

Umiライブラリを使用して上記の例を実装する方法は以下のとおりです。

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

したがって、設定が変更されていない場合でも、すべてのグループの設定を提供するようにしてください。既存の設定を上書きしないように、事前に最新のCandy Guardアカウントデータを取得したい場合があります。

以下は「late」グループのSOL paymentガードを2 SOLの代わりに3 SOLに変更する例です。

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

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [updateCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## デフォルトガード

上記の例で、両方のグループに同じ**Bot Tax**ガードを提供する必要があったことに注目してください。これは、Candy Machineに設定されたグローバル**ガード**を活用することで簡素化できます。

ガードグループを使用する場合、Core Candy Machineのグローバルガード — [以前のページ](/ja/core-candy-machine/guards)で説明したとおり — は**デフォルトガードとして機能します**！これは、グループで明示的に有効化してそれらを上書きしない限り、グループがグローバルガードと同じガード設定を使用することをデフォルトとすることを意味します。

簡単な要約：

- ガードがデフォルトガードでは有効だがグループのガードでは有効でない場合、グループは**デフォルトガードで定義されたとおりに**ガードを使用します。
- ガードがデフォルトガード_と_グループのガードの両方で有効な場合、グループは**グループのガードで定義されたとおりに**ガードを使用します。
- ガードがデフォルトガードまたはグループのガードで有効でない場合、グループはこのガードを使用しません。

これを説明するために、前のセクションの例を取って、**Bot Tax**ガードをデフォルトガードに移しましょう。

- デフォルトガード:
  - Bot Tax: 0.001 SOL
- グループ1:
  - **ラベル**: "early"
  - **ガード**:
    - Sol Payment: 1 SOL
    - Start Date: 4 pm
    - End Date: 5 pm
- グループ2:
  - **ラベル**: "late"
  - **ガード**:
    - Sol Payment: 2 SOL
    - Start Date: 5 pm

ご覧のとおり、デフォルトガードはグループ内の繰り返しを避けるのに役立ちます。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards (デフォルトガード)" theme="mint" z=1 /%}
{% node label="Bot Tax" /%}
{% node #group-1 theme="mint" z=1 %}
グループ1: "early" {% .font-semibold %}
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node theme="mint" z=1 %}
グループ2: "late"
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" /%}

{% /diagram %}

デフォルトガードを使用する場合でも、ミント時にグループを提供する必要があることに注意してください。つまり、ガードグループを使用する場合、**デフォルトガードのみを使用してミントすることは不可能です**。

{% dialect-switcher title="デフォルトガードとガードグループでCandy Machineを作成" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリでデフォルトガードを使用するには、Candy Machineを作成または更新するときに`groups`配列と組み合わせて`guards`属性を使用するだけです。例えば、上記で説明したガード設定を使用してCandy Machineを作成する方法は以下のとおりです。

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

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 並行グループ

ミント時にグループラベルを要求することの非常に興味深い利点の一つは、**特定の時間に複数の有効なグループを持つ**能力です。これにより、プログラムの曖昧さが排除され、購入者がどのグループからミントを試行したいかを選択できます。

新しい例でこれを説明しましょう。「Innocent Bird」と呼ばれるアセットコレクションがあり、「Innocent Bird」アセットを保有している人に1 SOLの割引価格を提供し、他の人には2 SOLを請求したいとします。両方のグループが同時にミント開始できるようにしたい — たとえば4時 — そして両方のグループでボットから保護されたいとします。ガードをどのように設定するかは以下のとおりです：

- デフォルトガード:
  - Start Date: 4 pm
  - Bot Tax: 0.001 SOL
- グループ1:
  - **ラベル**: "nft"
  - **ガード**:
    - Sol Payment: 1 SOL
    - NFT Gate: "Innocent Bird" コレクション
- グループ2:
  - **ラベル**: "public"
  - **ガード**:
    - Sol Payment: 2 SOL

ご覧のとおり、これらのガード設定では、両方のグループが同時にミントすることが可能です。NFTホルダーが「public」グループからのミントを決定した場合、全額の2 SOLを支払うことさえ可能です。しかし、可能であれば「nft」グループを選択することが彼らの最大の利益になります。

{% dialect-switcher title="並行グループ付きCore Candy Machineの作成" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリ経由で上記で説明したガード設定を使用してCore Candy Machineを作成する方法は以下のとおりです。

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

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## まとめ

ガードグループは、ニーズに合わせた順次および/または並行ミントワークフローを定義できるようにすることで、Core Candy Machineに全く新しい次元をもたらします。

[次のページ](/ja/core-candy-machine/guard-route)では、ガードに関するさらにもう一つのエキサイティングな機能：ガード命令を見ていきます！