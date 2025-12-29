---
title: キャンディガード
metaTitle: キャンディガード | キャンディマシン
description: ガードの動作と有効化方法を説明します。
---

キャンディマシンの動作とロード方法を理解したので、パズルの最後のピースについて話す時が来ました：ガード。 {% .lead %}

## ガードとは何ですか？

ガードは、キャンディマシンのミントへのアクセスを制限し、さらに新しい機能を追加できるモジュラーなコードです！

選択できる大きなガードのセットがあり、それぞれ自由に有効化および設定できます。

このドキュメントの後で利用可能なすべてのガードについて触れますが、これを説明するためにここでいくつかの例を見てみましょう。

- **開始日**ガードが有効になると、事前設定された日付前のミントが禁止されます。指定された日付後のミントを禁止する**終了日**ガードもあります。
- **SOL支払い**ガードが有効になると、ミントウォレットは設定された宛先ウォレットに設定された金額を支払う必要があります。トークンや特定のコレクションのNFTで支払う類似のガードが存在します。
- **トークンゲート**と**NFTゲート**ガードは、それぞれ特定のトークン保有者とNFT保有者にミントを制限します。
- **許可リスト**ガードは、ウォレットが事前定義されたウォレットのリストの一部である場合にのみミントを許可します。ミント用のゲストリストのようなものです。

ご覧のように、各ガードは一つの責任のみを処理し、それらを組み合わせ可能にします。言い換えると、完璧なキャンディマシンを作成するために必要なガードを選んで選択できます。

## キャンディガードアカウント

[キャンディマシンアカウント](/ja/smart-contracts/candy-machine/manage#candy-machine-account)の内容を覚えている場合、そこにガードの兆候はありません。これは、ガードが**キャンディガードプログラム**によって作成される**キャンディガードアカウント**と呼ばれる別のアカウントに存在するためです。

各キャンディマシンアカウントは通常、保護レイヤーを追加する独自のキャンディガードアカウントと関連付けられるべきです。

これは、キャンディガードアカウントを作成し、それをキャンディマシンアカウントの**ミント権限**にすることで機能します。そうすることで、**キャンディマシンコアプログラム**として知られるメインのキャンディマシンプログラムから直接ミントすることはもはや不可能になります。代わりに、すべてのガードが正常に解決された場合、ミントプロセスを完了するためにキャンディマシンコアプログラムに委譲するキャンディガードプログラム経由でミントする必要があります。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="キャンディマシン" theme="blue" /%}
{% node label="所有者: キャンディマシンコアプログラム" theme="dimmed" /%}
{% node label="機能" /%}
{% node label="権限" /%}
{% node #mint-authority-1 %}

ミント権限 = キャンディガード {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="キャンディガード" theme="blue" /%}
{% node label="所有者: キャンディガードプログラム" theme="dimmed" /%}
{% node label="ガード" theme="mint" z=1 /%}
{% node label="SOL支払い" /%}
{% node label="トークン支払い" /%}
{% node label="開始日" /%}
{% node label="終了日" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="ミント" theme="pink" /%}
{% node label="キャンディガードプログラム" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="アクセス制御" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
アクティブなガードに \
準拠している限り、 \
誰でもミントできます。
{% /node %}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="ミント" theme="pink" /%}
{% node label="キャンディマシンコアプログラム" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="ミントロジック" theme="transparent" /%}
{% node parent="mint-2" x=200 y=-18 theme="transparent" %}
Aliceのみ \
ミントできます。
{% /node %}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="キャンディマシン" theme="blue" /%}
{% node label="所有者: キャンディマシンコアプログラム" theme="dimmed" /%}
{% node label="機能" /%}
{% node label="権限" /%}
{% node #mint-authority-2 %}

ミント権限 = Alice {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="mint-authority-1" fromPosition="left" toPosition="left" arrow=false dashed=true /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-2" theme="pink" path="straight" /%}

{% /diagram %}

キャンディマシンとキャンディガードアカウントが連携して動作するため、SDKはそれらを一つのエンティティとして扱うことに注意してください。SDKでキャンディマシンを作成すると、関連するキャンディガードアカウントもデフォルトで作成されます。ガードを同時に更新できるため、キャンディマシンを更新する際も同じです。このページで具体的な例を見てみましょう。

## なぜ別のプログラムなのか？

ガードがメインのキャンディマシンプログラムに存在しない理由は、アクセス制御ロジックをNFTをミントするというメインのキャンディマシンの責任から分離するためです。

これにより、ガードはモジュラーだけでなく拡張可能になります。誰でも、残りすべてについてキャンディマシンコアプログラムに依存しながら、カスタムガードを作成するために独自のキャンディガードプログラムを作成・デプロイできます。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="キャンディマシン" theme="blue" /%}
{% node label="所有者: キャンディマシンコアプログラム" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="キャンディガード" theme="blue" /%}
{% node label="所有者: キャンディガードプログラム" theme="dimmed" /%}
{% node label="ガード" theme="mint" z=1 /%}
{% node label="SOL支払い" /%}
{% node label="トークン支払い" /%}
{% node label="開始日" /%}
{% node label="終了日" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=300 %}
{% node #mint-1 label="ミント" theme="pink" /%}
{% node label="キャンディガードプログラム" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=160 %}
{% node #mint-1b label="ミント" theme="pink" /%}
{% node label="カスタムキャンディガードプログラム" theme="pink" /%}
{% /node %}
{% node parent="mint-1b" x=-80 y=-22 label="異なるアクセス制御" theme="transparent" /%}

{% node parent="mint-1" x=60 y=100 %}
{% node #mint-2 label="ミント" theme="pink" /%}
{% node label="キャンディマシンコアプログラム" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=95 y=-20 label="同じミントロジック" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-1b" x=250 %}
{% node #candy-machine-2 label="キャンディマシン" theme="blue" /%}
{% node label="所有者: キャンディマシンコアプログラム" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-2" y=80 x=0 %}
{% node #candy-guard-2 label="キャンディガード" theme="blue" /%}
{% node label="所有者: カスタムキャンディガードプログラム" theme="dimmed" /%}
{% node label="ガード" theme="mint" z=1 /%}
{% node label="SOL支払い" /%}
{% node label="トークン支払い" /%}
{% node label="開始日" /%}
{% node %}
私のカスタムガード {% .font-semibold %}
{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="candy-guard-2" to="candy-machine-2" fromPosition="right" toPosition="right" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-1b" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-1b" theme="pink" /%}
{% edge from="candy-guard-2" to="mint-1b" theme="pink" /%}

{% /diagram %}

SDKは、独自のキャンディガードプログラムとそのカスタムガードを登録する方法も提供しているため、フレンドリーなAPIを活用し、ガードを他の人と簡単に共有できることに注意してください。

## 利用可能なすべてのガード

よし、ガードが何かを理解したので、利用可能なデフォルトガードを見てみましょう。

以下のリストでは、各ガードの簡単な説明と、より高度な読み物のための専用ページへのリンクを提供します。

- [**アドレスゲート**](/ja/smart-contracts/candy-machine/guards/address-gate): ミントを単一のアドレスに制限します。
- [**許可リスト**](/ja/smart-contracts/candy-machine/guards/allow-list): ウォレットアドレスリストを使用して誰がミントを許可されているかを決定します。
- [**ボット税**](/ja/smart-contracts/candy-machine/guards/bot-tax): 無効なトランザクションに請求する設定可能な税。
- [**終了日**](/ja/smart-contracts/candy-machine/guards/end-date): ミントを終了する日付を決定します。
- [**フリーズSOL支払い**](/ja/smart-contracts/candy-machine/guards/freeze-sol-payment): フリーズ期間付きでミントの価格をSOLで設定します。
- [**フリーズトークン支払い**](/ja/smart-contracts/candy-machine/guards/freeze-token-payment): フリーズ期間付きでミントの価格をトークン量で設定します。
- [**ゲートキーパー**](/ja/smart-contracts/candy-machine/guards/gatekeeper): ゲートキーパーネットワーク経由でミントを制限します（例：Captcha統合）。
- [**ミント制限**](/ja/smart-contracts/candy-machine/guards/mint-limit): ウォレットごとのミント数の制限を指定します。
- [**NFTバーン**](/ja/smart-contracts/candy-machine/guards/nft-burn): ミントを指定されたコレクションの保有者に制限し、NFTのバーンを要求します。
- [**NFTゲート**](/ja/smart-contracts/candy-machine/guards/nft-gate): ミントを指定されたコレクションの保有者に制限します。
- [**NFT支払い**](/ja/smart-contracts/candy-machine/guards/nft-payment): ミントの価格を指定されたコレクションのNFTとして設定します。
- [**引き換え済み量**](/ja/smart-contracts/candy-machine/guards/redeemed-amount): 総ミント量に基づいてミントの終了を決定します。
- [**SOL支払い**](/ja/smart-contracts/candy-machine/guards/sol-payment): ミントの価格をSOLで設定します。
- [**開始日**](/ja/smart-contracts/candy-machine/guards/start-date): ミントの開始日を決定します。
- [**サードパーティ署名者**](/ja/smart-contracts/candy-machine/guards/third-party-signer): トランザクションに追加の署名者を要求します。
- [**トークンバーン**](/ja/smart-contracts/candy-machine/guards/token-burn): ミントを指定されたトークンの保有者に制限し、トークンのバーンを要求します。
- [**トークンゲート**](/ja/smart-contracts/candy-machine/guards/token-gate): ミントを指定されたトークンの保有者に制限します。
- [**トークン支払い**](/ja/smart-contracts/candy-machine/guards/token-payment): ミントの価格をトークン量で設定します。

## ガード付きキャンディマシンの作成

これまで作成したキャンディマシンには、有効なガードがありませんでした。利用可能なすべてのガードを理解したので、いくつかのガードを有効にして新しいキャンディマシンを設定する方法を見てみましょう。

具体的な実装は使用しているSDKによって異なりますが（下記参照）、主要なアイデアは、必要な設定を提供してガードを有効にすることです。設定されていないガードは無効になります。

{% dialect-switcher title="ガード付きキャンディマシンの作成" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリを使用してガードを有効にするには、`create`関数に`guards`属性を提供し、有効にしたい各ガードの設定を渡すだけです。`none()`に設定されたり提供されなかったりしたガードは無効になります。

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1.5), destination: treasury }),
    startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    // 他のすべてのガードは無効...
  },
}).sendAndConfirm(umi)
```

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## ガードの更新

ガードで何か間違いを設定しましたか？ミント価格について考えが変わりましたか？ミントの開始を少し遅らせる必要がありますか？心配無用、ガードは作成時に使用したのと同じ設定で簡単に更新できます。

設定を提供して新しいガードを有効にしたり、空の設定を与えて現在のガードを無効にしたりできます。

{% dialect-switcher title="ガードの更新" %}
{% dialect title="JavaScript" id="js" %}

キャンディマシンのガードを作成したのと同じ方法で更新できます。つまり、`updateCandyGuard`関数の`guards`オブジェクト内で設定を提供することです。`none()`に設定されたり提供されなかったりしたガードは無効になります。

`guards`オブジェクト全体が更新されることに注意してください。つまり、**既存のすべてのガードを上書きします**！

したがって、設定が変更されていない場合でも、有効にしたいすべてのガードの設定を提供してください。まずキャンディガードアカウントを取得して、現在のガードにフォールバックしたい場合があります。

```tsx
import { some, none, sol } from '@metaplex-foundation/umi'

const candyGuard = fetchCandyGuard(umi, candyMachine.mintAuthority)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: {
    ...candyGuard.guards,
    botTax: none(),
    solPayment: some({ lamports: sol(3), destination: treasury }),
  },
})
```

APIリファレンス: [updateCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [CandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## キャンディマシンのガード表示

キャンディマシンでガードを設定したら、提供されたすべての設定をキャンディガードアカウントで誰でも取得・表示できます。

{% dialect-switcher title="ガードの取得" %}
{% dialect title="JavaScript" id="js" %}

キャンディマシンアカウントの`mintAuthority`属性で`fetchCandyGuard`関数を使用して、キャンディマシンに関連するキャンディガードにアクセスできます。

```ts
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

candyGuard.guards // すべてのガード設定。
candyGuard.guards.botTax // ボット税設定。
candyGuard.guards.solPayment // SOL支払い設定。
// ...
```

`create`関数を使用する際、関連するキャンディガードアカウントが各キャンディマシンに対して自動的に作成され、そのアドレスが決定的であることに注意してください。したがって、この場合、以下のように1つのRPC呼び出しのみを使用して両方のアカウントを取得できます。

```ts
import { assertAccountExists } from '@metaplex-foundation/umi'
import {
  findCandyGuardPda,
  deserializeCandyMachine,
  deserializeCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyGuardAddress = findCandyGuardPda(umi, { base: candyMachineAddress })
const [rawCandyMachine, rawCandyGuard] = await umi.rpc.getAccounts([
  candyMachineAddress,
  candyGuardAddress,
])
assertAccountExists(rawCandyMachine)
assertAccountExists(rawCandyGuard)

const candyMachine = deserializeCandyMachine(umi, rawCandyMachine)
const candyGuard = deserializeCandyGuard(umi, rawCandyGuard)
```

APIリファレンス: [fetchCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/fetchCandyGuard.html), [findCandyGuardPda](https://mpl-candy-machine.typedoc.metaplex.com/functions/findCandyGuardPda.html), [CandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## キャンディガードアカウントの手動ラップとアンラップ

これまでキャンディマシンとキャンディガードアカウントを一緒に管理してきました。これはほとんどのプロジェクトにとって最も理にかなっているからです。

しかし、SDKを使用しても、キャンディマシンとキャンディガードは異なるステップで作成・関連付けできることに注意することが重要です。

まず2つのアカウントを別々に作成し、手動で関連付け/関連付け解除する必要があります。

{% dialect-switcher title="キャンディマシンからのガードの関連付けと関連付け解除" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリの`create`関数は、作成された各キャンディマシンアカウントに対して真新しいキャンディガードアカウントの作成と関連付けを既に処理しています。

しかし、それらを別々に作成し、手動で関連付け/関連付け解除したい場合、以下のようにします。

```ts
import { some, percentAmount, sol, dateTime } from '@metaplex-foundation/umi'

// キャンディガードなしでキャンディマシンを作成します。
const candyMachine = generateSigner(umi)
await (await createCandyMachineV2(umi, {
  candyMachine,
  tokenStandard: TokenStandard.NonFungible,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  sellerFeeBasisPoints: percentAmount(1.23),
  creators: [
    { address: umi.identity.publicKey, verified: false, percentageShare: 100 },
  ],
  configLineSettings: some({
    prefixName: 'My NFT #',
    nameLength: 3,
    prefixUri: 'https://example.com/',
    uriLength: 20,
    isSequential: false,
  }),
})).sendAndConfirm(umi)

// キャンディガードを作成します。
const base = generateSigner(umi)
const candyGuard = findCandyGuardPda(umi, { base: base.publicKey })
await createCandyGuard(umi, {
  base,
  guards: {
    botTax: { lamports: sol(0.01), lastInstruction: false },
    solPayment: { lamports: sol(1.5), destination: treasury },
    startDate: { date: dateTime('2022-10-17T16:00:00Z') },
  },
}).sendAndConfirm(umi)

// キャンディガードをキャンディマシンに関連付けます。
await wrap(umi, {
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)

// 関連付けを解除します。
await unwrap(umi, {
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)
```

APIリファレンス: [createCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyMachineV2.html), [createCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyGuard.html), [wrap](https://mpl-candy-machine.typedoc.metaplex.com/functions/wrap.html), [unwrap](https://mpl-candy-machine.typedoc.metaplex.com/functions/unwrap.html)

{% /dialect %}
{% /dialect-switcher %}

## まとめ

ガードはキャンディマシンの重要なコンポーネントです。ミントプロセスの設定を簡単にしながら、誰でもアプリケーション固有のニーズに対して独自のガードを作成できます。[次のページ](/ja/smart-contracts/candy-machine/guard-groups)では、ガードグループを使用してさらに多くのミントシナリオを作成する方法を見てみましょう！