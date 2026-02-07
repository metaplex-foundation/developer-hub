---
title: ミント
metaTitle: ミント | キャンディマシン
description: キャンディマシンからのミント方法とミント前要件の処理方法を説明します。
---

これまでキャンディマシンの作成と保守について学習しました。設定方法と、ガードおよびガードグループを使用した複雑なミントワークフローの設定方法を見てきました。最後のパズルのピースについて話すときが来ました：ミント！ {% .lead %}

## 基本的なミント

[キャンディガードページ](/ja/smart-contracts/candy-machine/guards#why-another-program)で述べたように、キャンディマシンからNFTをミントする責任を持つ2つのプログラムがあります：NFTのミントを担当するキャンディマシンコアプログラムと、その上に設定可能なアクセス制御レイヤーを追加し、カスタムガードを提供するためにフォークできるキャンディガードプログラムです。

そのため、キャンディマシンからミントする方法は2つあります：

- **キャンディガードプログラムから**、その後キャンディマシンコアプログラムにミントを委譲します。ほとんどの場合、より複雑なミントワークフローが可能になるため、これを行いたいでしょう。アカウントで設定されたガードに基づいて、ミント命令に追加の残りアカウントと命令データを渡す必要がある場合があります。幸い、SDKはいくつかの追加パラメーターを要求し、残りを計算することでこれを簡単にします。

- **キャンディマシンコアプログラムから直接**。この場合、設定されたミント権限のみがミントでき、したがってトランザクションに署名する必要があります。

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

すべてがうまくいけば、キャンディマシンで設定されたパラメーターに従ってNFTが作成されます。例えば、指定されたキャンディマシンが**シーケンシャル**を`false`に設定した**コンフィグライン設定**を使用している場合、次のアイテムをランダムに取得します。

キャンディガードプログラムのバージョン`1.0`以降、ミント命令は既存の`payer`署名者とは異なる可能性がある追加の`minter`署名者を受け入れます。これにより、NFTをミントするウォレットがSOL手数料（ストレージ手数料やSOLミント支払いなど）を支払う必要がなくなるミントワークフローを作成できます。`payer`署名者がそれらの手数料を抽象化するからです。`minter`署名者は依然としてトークンベースの手数料を支払う必要があり、設定されたガードの検証に使用されることに注意してください。

最新のミント命令は、大量の計算ユニットを使用する最新のトークンメタデータ命令に依存することに注意してください。そのため、成功を確実にするためにトランザクションの計算ユニット制限を増やす必要がある場合があります。SDKもこれを支援する場合があります。

{% dialect-switcher title="キャンディマシンからのミント" %}
{% dialect title="JavaScript" id="js" %}

設定されたキャンディガードアカウント経由でキャンディマシンからミントするには、`mintV2`関数を使用し、ミントされたNFTが属するコレクションNFTのミントアドレスと更新権限を提供できます。`minter`署名者と`payer`署名者も提供できますが、それらはそれぞれUmiのアイデンティティとペイヤーにデフォルト設定されます。

上述のとおり、`mintV2`命令が成功することを確実にするためにトランザクションの計算ユニット制限を増やす必要がある場合があります。以下のコードスニペットで示すように、`mpl-toolbox` Umiライブラリの`setComputeUnitLimit`ヘルパー関数を使用してこれを行えます。

pNFT（例えばロイヤリティ強制のため）をミントしたく、キャンディマシンをそれに応じて設定している場合は、`tokenStandard`フィールドを追加する必要があります。デフォルトでは`NonFungible`が使用されます。事前にキャンディマシンを取得した場合は`candyMachine.tokenStandard`を使用できます。そうでなければ`@metaplex-foundation/mpl-token-metadata`から`tokenStandard: TokenStandard.ProgrammableNonFungible`を使用して自分で割り当てる必要があります。

```ts
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
      tokenStandard: candyMachine.tokenStandard,
    })
  )
  .sendAndConfirm(umi)
```

`mintV2`命令はデフォルトでミントおよびトークンアカウントを作成し、NFT所有者を`minter`に設定することに注意してください。事前にこれらを自分で作成したい場合は、署名者ではなく公開鍵としてNFTミントアドレスを単純に指定できます。`mpl-toolbox` Umiライブラリの`createMintWithAssociatedToken`関数を使用した例を次に示します：

```ts
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import {
  createMintWithAssociatedToken,
  setComputeUnitLimit,
} from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
const nftOwner = generateSigner(umi).publicKey
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: nftOwner }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint: nftMint.publicKey,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```

キャンディマシンコアプログラムから直接ミントすることを希望するまれなケースでは、代わりに`mintFromCandyMachineV2`関数を使用できます。この関数はキャンディマシンのミント権限を署名者として提供する必要があり、明示的な`nftOwner`属性を受け入れます。

```ts
import { mintFromCandyMachineV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
const nftOwner = generateSigner(umi).publicKey
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintFromCandyMachineV2(umi, {
      candyMachine: candyMachine.publicKey,
      mintAuthority: umi.identity,
      nftOwner,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```

APIリファレンス: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [mintFromCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintFromCandyMachineV2.html)

{% /dialect %}
{% /dialect-switcher %}

## ガード付きミント

多数のガードを使用するキャンディマシンからミントする際、追加のガード固有の情報を提供する必要がある場合があります。

ミント命令を手動で構築する場合、その情報は命令データと残りアカウントの組み合わせとして提供されます。しかし、SDKを使用する場合、ミント時に追加情報が必要な各ガードは、**ミント設定**と呼ばれる設定セットを定義します。これらのミント設定は、プログラムが必要とするものに解析されます。

ミント設定が必要なガードの良い例は、ミントの支払いに使用すべきNFTのミントアドレスなどを必要とする**NFT支払い**ガードです。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="キャンディマシン" theme="blue" /%}
{% node label="所有者: キャンディマシンコアプログラム" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="キャンディガード" theme="blue" /%}
{% node label="所有者: キャンディガードプログラム" theme="dimmed" /%}
{% node label="ガード" theme="mint" z=1 /%}
{% node #nft-payment-guard label="NFT支払い" /%}
{% node label="トークン支払い" /%}
{% node label="開始日" /%}
{% node #third-party-signer-guard label="サードパーティ署名者" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=700 %}
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

{% node parent="mint-2" x=-400 %}
{% node #mint-settings label="ミント設定" /%}
{% node label="SDKを使用" theme="dimmed" /%}
{% /node %}

{% node #mint-args label="ミント引数" parent="mint-settings" x=100 y=80 theme="slate" /%}
{% node #mint-accounts label="ミント残りアカウント" parent="mint-args" y=50 theme="slate" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="nft-payment-guard" to="mint-settings" theme="slate" /%}
{% edge from="third-party-signer-guard" to="mint-settings" theme="slate" /%}
{% edge from="mint-settings" to="mint-args" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-settings" to="mint-accounts" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-args" to="mint-1" theme="pink" /%}
{% edge from="mint-accounts" to="mint-1" theme="pink" /%}

{% /diagram %}

[利用可能な各ガード](/ja/smart-contracts/candy-machine/guards)には独自のドキュメントページがあり、そのガードがミント時にミント設定の提供を期待するかどうかがわかります。

ミント設定を必要としないガードのみを使用する場合は、上記の「基本的なミント」セクションで説明したのと同じ方法でミントできます。それ以外の場合は、それらを必要とするすべてのガードのミント設定を含む追加のオブジェクト属性を提供する必要があります。SDKを使用した実際の例を見てみましょう。

{% dialect-switcher title="ガード付きキャンディマシンからのミント" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリ経由でミントする際、`mintArgs`属性を使用して必要な**ミント設定**を提供できます。

追加の署名者が必要な**サードパーティ署名者**ガードと、ウォレットがキャンディマシンからミントした回数を追跡する**ミント制限**ガードを使用した例です。

```ts
import {
  some,
  generateSigner,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { create, mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

// ガード付きキャンディマシンを作成します。
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    mintLimit: some({ id: 1, limit: 3 }),
  },
}).sendAndConfirm(umi)

// キャンディマシンからミントします。
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        mintLimit: some({ id: 1 }),
      },
    })
  )
  .sendAndConfirm(umi)
```

APIリファレンス: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [DefaultGuardSetMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## ガードグループ付きミント

ガードグループを使用するキャンディマシンからミントする際、**ラベルを提供することでミントしたいグループを明示的に選択する必要があります**。

さらに、[前のセクション](#minting-with-guards)で説明したようにミント設定も必要な場合があります。しかし、**ミント設定は選択されたグループの「解決されたガード」に適用されます**。

例えば、以下のガードを持つキャンディマシンを想像してください：

- **デフォルトガード**:
  - ボット税
  - サードパーティ署名者
  - 開始日
- **グループ1**
  - ラベル: "nft"
  - ガード:
    - NFT支払い
    - 開始日
- **グループ2**
  - ラベル: "public"
  - ガード:
    - SOL支払い

「nft」とラベル付けされたグループ1の解決されたガードは：

- ボット税: **デフォルトガード**から。
- サードパーティ署名者: **デフォルトガード**から。
- NFT支払い: **グループ1**から。
- 開始日: デフォルトガードを上書きするため**グループ1**から。

したがって、提供されるミント設定はこれらの解決されたガードに関連する必要があります。上記の例では、サードパーティ署名者ガードとNFT支払いガードのミント設定を提供する必要があります。

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
{% node #third-party-signer-guard label="サードパーティ署名者" /%}
{% node label="開始日" /%}
{% node #nft-group theme="mint" z=1 %}
グループ1: "nft" {% .font-semibold %}
{% /node %}
{% node #nft-payment-guard label="NFT支払い" /%}
{% node label="開始日" /%}
{% node theme="mint" z=1 %}
グループ2: "public"
{% /node %}
{% node label="SOL支払い" /%}
{% /node %}

{% node parent="candy-machine-1" x=700 %}
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

{% node parent="mint-2" x=-400 y=60 %}
{% node #mint-settings label="ミント設定" /%}
{% node label="SDKを使用" theme="dimmed" /%}
{% /node %}

{% node #mint-args label="ミント引数" parent="mint-settings" x=100 y=80 theme="slate" /%}
{% node #mint-accounts label="ミント残りアカウント" parent="mint-args" y=50 theme="slate" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="nft-payment-guard" to="mint-settings" theme="slate" /%}
{% edge from="third-party-signer-guard" to="mint-settings" theme="slate" /%}
{% edge from="mint-settings" to="mint-args" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-settings" to="mint-accounts" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-args" to="mint-1" theme="pink" /%}
{% edge from="mint-accounts" to="mint-1" theme="pink" /%}
{% edge from="nft-group" to="mint-1" theme="pink" /%}

{% /diagram %}

{% seperator h="6" /%}

{% dialect-switcher title="ガードグループ付きキャンディマシンからのミント" %}
{% dialect title="JavaScript" id="js" %}

ガードグループを使用するキャンディマシンからミントする際、選択したいグループのラベルを`group`属性経由で提供する必要があります。

さらに、そのグループの解決されたガードのミント設定を`mintArgs`属性経由で提供できます。

上記で説明した例のキャンディマシンからミントするためにUmiライブラリを使用する方法は次のとおりです。

```ts
// ガード付きキャンディマシンを作成します。
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
  },
  groups: [
    {
      label: 'nft',
      guards: {
        nftPayment: some({ requiredCollection, destination: nftTreasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
      },
    },
    {
      label: 'public',
      guards: {
        solPayment: some({ lamports: sol(1), destination: solTreasury }),
      },
    },
  ],
}).sendAndConfirm(umi)

// キャンディマシンからミントします。
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
      group: some('nft'),
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        nftPayment: some({
          mint: nftFromRequiredCollection.publicKey,
          destination: nftTreasury,
          tokenStandard: TokenStandard.NonFungible,
        }),
      },
    })
  )
  .sendAndConfirm(umi)
```

APIリファレンス: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [DefaultGuardSetMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 事前検証付きミント

一部のガードは、キャンディマシンからミントできるようになる前に追加の検証ステップを必要とする場合があることに注意することが重要です。この事前検証ステップは通常、ブロックチェーン上にアカウントを作成するか、その検証の証明として機能するトークンでウォレットに報酬を与えます。

### ルート命令の使用

ガードが事前検証ステップを必要とする方法の1つは、「ルート」命令を介して[独自の特別な命令](/ja/smart-contracts/candy-machine/guard-route)を使用することです。

その良い例が**許可リスト**ガードです。このガードを使用する際、ルート命令を呼び出し、有効なMerkle Proofを提供することで、ウォレットが事前定義されたウォレットのリストに属することを検証する必要があります。このルート命令が成功すると、そのウォレット用の許可リストPDAが作成され、ミント命令がそれを読み取って許可リストガードを検証できます。[許可リストガードの専用ページで詳細を読むことができます](/ja/smart-contracts/candy-machine/guards/allow-list)。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="キャンディマシン" theme="blue" /%}
{% node label="所有者: キャンディマシンコアプログラム" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="キャンディガード" theme="blue" /%}
{% node label="所有者: キャンディガードプログラム" theme="dimmed" /%}
{% node label="ガード" theme="mint" z=1 /%}
{% node #allow-list-guard label="許可リスト" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
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

{% node parent="mint-2" x=-250 %}
{% node #route label="ルート" theme="pink" /%}
{% node label="キャンディマシンコアプログラム" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="Merkle Proof検証" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="許可リストPDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

### 外部サービスの使用

ガードが事前検証ステップを実行するもう一つの方法は、外部ソリューションに依存することです。

例えば、**ゲートキーパー**ガードを使用する際、設定されたゲートキーパーネットワークに依存するチャレンジ（Captchaの完了など）を実行してゲートウェイトークンを要求する必要があります。その後、ゲートキーパーガードはそのようなゲートウェイトークンの存在をチェックして、ミントを検証または拒否します。[ゲートキーパーガードの専用ページで詳細を学ぶことができます](/ja/smart-contracts/candy-machine/guards/gatekeeper)。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="キャンディマシン" theme="blue" /%}
{% node label="所有者: キャンディマシンコアプログラム" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="キャンディガード" theme="blue" /%}
{% node label="所有者: キャンディガードプログラム" theme="dimmed" /%}
{% node label="ガード" theme="mint" z=1 /%}
{% node #gatekeeper-guard label="ゲートキーパー" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
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

{% node parent="mint-2" x=-250 y=-40 %}
{% node #network label="ゲートキーパーネットワーク" theme="slate" /%}
{% node theme="slate" %}
ゲートキーパー \
ネットワークから \
ゲートウェイトークンを \
要求（例：Captcha）
{% /node %}
{% /node %}

{% node #gateway-token parent="network" x=23 y=140 label="ゲートウェイトークン" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="gatekeeper-guard" to="network" theme="slate" /%}
{% edge from="network" to="gateway-token" theme="slate" path="straight" /%}
{% edge from="gateway-token" to="mint-1" theme="pink" /%}

{% /diagram %}

## ボット税付きミント

キャンディマシンに含めたいガードの1つは、失敗したミントに設定可能なSOL量を請求することでキャンディマシンをボットから保護するボット税ガードです。この金額は通常、本物のユーザーからの純粋なミスに影響を与えることなくボットを傷つけるために小額に設定されます。すべてのボット税はキャンディマシンアカウントに転送されるため、ミントが終了した後、キャンディマシンアカウントを削除してこれらの資金にアクセスできます。

このガードは少し特別で、他のすべてのガードのミント動作に影響を与えます。ボット税が有効化され、他のガードがミントの検証に失敗した場合、**トランザクションは成功したふりをします**。つまり、プログラムからエラーは返されませんが、NFTもミントされません。これは、資金がボットからキャンディマシンアカウントに転送されるためにトランザクションが成功する必要があるためです。[ボット税ガードの専用ページで詳細を学ぶことができます](/ja/smart-contracts/candy-machine/guards/bot-tax)。

## まとめ

おめでとうございます！キャンディマシンのAからZまでの動作を理解しました！

興味を持たれるかもしれない追加の読み物リソースは次のとおりです：

- [利用可能なすべてのガード](/ja/smart-contracts/candy-machine/guards)：利用可能なすべてのガードを見て、必要なものを厳選できます。
- [初めてのキャンディマシンを作成](/ja/smart-contracts/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine)：このハウツーガイドは、「[Sugar](/ja/smart-contracts/candy-machine/sugar)」というCLIツールを使用してアセットをアップロードし、ゼロから新しいキャンディマシンを作成するのに役立ちます。
