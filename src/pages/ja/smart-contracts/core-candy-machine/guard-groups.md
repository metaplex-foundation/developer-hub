---
title: ガードグループ
metaTitle: ガードグループ | Core Candy Machine
description: ガードグループにより、単一のCore Candy Machineで複数の独立したガードセットを定義でき、それぞれ独自のラベルとアクセス制御ルールを持ち、順次および並行ミントワークフローを可能にします。
keywords:
  - guard groups
  - Core Candy Machine
  - candy guard
  - minting workflow
  - default guards
  - parallel minting
  - group label
  - access control
  - NFT minting
  - Solana
  - Metaplex
  - guard configuration
  - multi-tier mint
about:
  - Guard Groups
  - Candy Machine configuration
  - Minting workflows
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: ガードグループのラベルの最大文字数は？
    a: ガードグループのラベルは6文字以下でなければなりません。オンチェーンアカウント構造がこの制限を適用するため、6文字を超えるラベルはトランザクションの失敗を引き起こします。
  - q: ガードグループが設定されている場合、デフォルトガードのみでミントできますか？
    a: いいえ。ガードグループが存在する場合、すべてのミントトランザクションでグループラベルを指定する必要があります。デフォルトガードのみでミントすることはできません。デフォルトガードはグループの継承されたフォールバック設定としてのみ機能します。
  - q: ガードグループは単一のアイテムプールを共有しますか、それとも各グループに独自の供給がありますか？
    a: すべてのガードグループは同じCore Candy Machineアイテムプールから引き出します。各グループにAllocationなどのガードを追加してそのグループが配布できるアイテム数を制限しない限り、グループごとの供給制限はありません。
  - q: 並行ガードグループで時間ウィンドウが重なる場合はどのように処理されますか？
    a: 2つ以上のグループの開始日と終了日が重なっている場合、購入者はミント命令でグループラベルを指定してどのグループからミントするかを選択します。Candy Guardプログラムは選択されたグループのガード（デフォルトガードとマージされた）のみを評価するため、両方のグループが競合なく同時に動作できます。
  - q: 既存のCandy Machineでガードグループを更新するとどうなりますか？
    a: updateCandyGuard命令はガードとグループの設定全体を一度に置き換えます。設定が変更されていないグループも含め、更新呼び出しにすべてのグループを含める必要があります。含めない場合、それらは削除されます。既存の設定を誤って上書きしないように、更新前に現在のCandy Guardアカウントデータを取得してください。
---

## Summary

ガードグループにより、単一の[Core Candy Machine](/ja/smart-contracts/core-candy-machine/overview)で複数の独立した[ガード](/ja/smart-contracts/core-candy-machine/guards)セットを定義でき、それぞれが一意のラベルで識別されるため、異なるミントフェーズやオーディエンスに異なるアクセス制御ルールが適用されます。

- 各グループは独自のガード設定と、購入者が[ミント](/ja/smart-contracts/core-candy-machine/mint)時に指定する最大6文字のラベルを持ちます。
- デフォルト（グローバル）ガードは、グループレベルで明示的にオーバーライドされない限り、すべてのグループに継承されます。
- グループは順次（時間ゲート付きティア）または並行（ホルダー割引と公開セールの並行）で実行できます。
- グループが存在する場合、デフォルトガードのみでミントすることはできません。グループラベルが常に必要です。

[以前のページ](/ja/smart-contracts/core-candy-machine/guards)の一つで、ガードを紹介し、Candy Machineのアクセス制御を定義するためにそれらを使用しました。ガードを使用することで、例えばミント毎に1 SOLの支払いを追加し、特定の日付後にミントが開始されることを確保できることを見ました。しかし、第2の日付の後に2 SOLを請求することもしたい場合はどうでしょうか？特定のトークンホルダーに無料または割引価格でミントを許可したい場合はどうでしょうか？ {% .lead %}

それぞれが独自の要件を持つ複数のガードセットを定義できればどうでしょうか？その理由のために、私たちは**ガードグループ**を作成しました！

## ガードグループの仕組み

ガードグループは標準の[ガード](/ja/smart-contracts/core-candy-machine/guards)システムを拡張し、単一のCore Candy Machineに複数の名前付きガード設定セットをアタッチできるようにします。各セットは短いラベルで識別され、ミント時に独立して評価されます。

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

今、誰かがCore Candy Machineから[ミント](/ja/smart-contracts/core-candy-machine/mint)しようとするとき、**彼らはどのグループからミントしているかを明示的に私たちに伝える必要があります**。ミント時にグループラベルを求めることが重要な理由は：

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

## デフォルトガードとガードグループの継承

デフォルト（グローバル）ガードは、すべてのガードグループが自動的に継承する共有ベースラインとして機能します。グループがガードを明示的に有効にしない場合、デフォルト設定にフォールバックします。グループが同じガードを有効にする場合、グループレベルの設定が優先されます。

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

{% callout type="warning" %}
デフォルトガードを使用する場合でも、ミント時にグループラベルを提供する必要があります。ガードグループが設定されている場合、**デフォルトガードのみを使用してミントすることは不可能です**。
{% /callout %}

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

## 並行ガードグループ

並行ガードグループにより、2つ以上のグループが同時に有効になり、購入者がどのグループからミントするかを選択できます。ミント命令でグループラベルを要求することで曖昧さが排除され、並行グループが可能になります。

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

## Notes

- ガードグループのラベルは最大**6文字**に制限されています。この制限を超えるとトランザクションが失敗します。
- ガードグループが設定されている場合、グループは明示的に有効にしたデフォルトガードを**オーバーライド**します。グループで無効なガードはデフォルト値にフォールバックします。
- グループが存在する場合、購入者はすべてのミントトランザクションで**グループラベルを指定する必要があります**。デフォルトガードのみでミントする方法はありません。
- `updateCandyGuard`によるガードグループの更新は、ガードとグループの設定**全体**を置き換えます。データの損失を避けるため、変更されていないグループも含め、常にすべてのグループを含めてください。
- すべてのグループは同じCore Candy Machineアイテムプールを共有します。グループごとの供給を制限する必要がある場合は、AllocationなどのグループごとのガードToを使用してください。
- [Route命令](/ja/smart-contracts/core-candy-machine/guard-route)を必要とするガード（Allow Listの検証など）の場合、Route呼び出しにもグループラベルを含める必要があり、正しいガード設定が評価されます。

## まとめ

ガードグループは、ニーズに合わせた順次および/または並行ミントワークフローを定義できるようにすることで、Core Candy Machineに全く新しい次元をもたらします。

[次のページ](/ja/smart-contracts/core-candy-machine/guard-route)では、ガードに関するさらにもう一つのエキサイティングな機能：ガード命令を見ていきます！

## FAQ

### ガードグループのラベルの最大文字数は？

ガードグループのラベルは6文字以下でなければなりません。オンチェーンアカウント構造がこの制限を適用するため、6文字を超えるラベルはトランザクションの失敗を引き起こします。

### ガードグループが設定されている場合、デフォルトガードのみでミントできますか？

いいえ。ガードグループが存在する場合、すべての[ミント](/ja/smart-contracts/core-candy-machine/mint)トランザクションでグループラベルを指定する必要があります。デフォルトガードのみでミントすることはできません。デフォルトガードはグループの継承されたフォールバック設定としてのみ機能します。

### ガードグループは単一のアイテムプールを共有しますか、それとも各グループに独自の供給がありますか？

すべてのガードグループは同じCore Candy Machineアイテムプールから引き出します。各グループにAllocationなどのガードを追加してそのグループが配布できるアイテム数を制限しない限り、グループごとの供給制限はありません。

### 並行ガードグループで時間ウィンドウが重なる場合はどのように処理されますか？

2つ以上のグループの開始日と終了日が重なっている場合、購入者はミント命令でグループラベルを指定してどのグループからミントするかを選択します。Candy Guardプログラムは選択されたグループの[ガード](/ja/smart-contracts/core-candy-machine/guards)（デフォルトガードとマージされた）のみを評価するため、両方のグループが競合なく同時に動作できます。

### 既存のCandy Machineでガードグループを更新するとどうなりますか？

`updateCandyGuard`命令はガードとグループの設定全体を一度に置き換えます。設定が変更されていないグループも含め、更新呼び出しにすべてのグループを含める必要があります。含めない場合、それらは削除されます。既存の設定を誤って上書きしないように、更新前に現在のCandy Guardアカウントデータを取得してください。

## Glossary

| Term | Definition |
|------|------------|
| Guard Group | Core Candy Machineにアタッチされた名前付きガード設定セットで、一意のラベルで識別されます。 |
| Label | ガードグループを一意に識別し、ミント命令で指定する必要がある文字列識別子（最大6文字）。 |
| Default Guards | 明示的にオーバーライドされない限り、すべてのガードグループが継承するCore Candy Machineのグローバルガード設定。 |
| Resolved Guards | グループのガードとデフォルトガードをマージして生成される、ミント時に適用されるガード設定の最終セット。 |
| Parallel Guard Groups | 時間ウィンドウが重なる2つ以上のガードグループで、購入者が同時にどのグループからミントするかを選択できます。 |
| Candy Guard | Core Candy Machineのすべてのガードとグループ設定を保存し、そのMint Authorityとして機能するオンチェーンアカウント。 |
| Bot Tax | 他のガードチェックに失敗したウォレットに小さなSOLペナルティを課金し、ボット活動を抑止するために使用されるガード。 |
| Route Instruction | Allow Listの検証など、ミントフロー外でガード固有のロジックを実行するCandy Guardプログラムの特別な命令。 |

