---
title: Core Candy Machineからのミント
metaTitle: Core Candy Machineからのミント | Core Candy Machine
description: mintV1命令を使用してCore Candy MachineからCore NFTアセットをミントする方法。ガード設定、ガードグループ、事前検証、ボット税の動作を含みます。
keywords:
  - core candy machine minting
  - mintV1 instruction
  - candy guard program
  - mint settings
  - guard groups
  - bot tax
  - pre-validation
  - route instruction
  - NFT minting Solana
  - mpl-core-candy-machine
  - Metaplex Core
  - mint args
  - allow list
  - compute unit limit
about:
  - Minting NFTs from a Core Candy Machine
  - Configuring guards and guard groups for minting workflows
  - Pre-validation and bot protection for minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Candy Guardプログラム経由のミントとCore Candy Machineプログラムからの直接ミントの違いは何ですか？
    a: Candy Guardプログラム経由のミントでは、設定されたガードを満たす限り誰でもミントでき、支払い、許可リスト、開始日などの複雑なアクセス制御ワークフローが可能です。Core Candy Machineプログラムからの直接ミントはすべてのガードをバイパスしますが、設定されたミント権限がトランザクションに署名する必要があり、権限制御のミントにのみ適しています。
  - q: 複数のガードでミントする際にコンピュートユニット制限を増やすにはどうすればよいですか？
    a: トランザクションビルダー内で@metaplex-foundation/mpl-toolboxのsetComputeUnitLimitヘルパーを使用します。300,000ユニットが一般的な出発点ですが、設定されたガードの数に基づいて調整する必要があります。ガードが多いほど、より多くのコンピュートユニットが必要です。
  - q: ミントが失敗してBot Taxが有効な場合はどうなりますか？
    a: Bot Taxが有効で別のガードがミントを拒否した場合、トランザクションはオンチェーンで成功しますがNFTは作成されません。代わりに、設定されたボット税額（SOL）がミンターからCandy Machineアカウントに転送されます。この設計により、失敗した試行にもSOLがかかるため、ボットがガード条件を安価に調査することを防ぎます。
  - q: ミント時にすべてのガードにMint Settingsを提供する必要がありますか？
    a: いいえ。追加のランタイム情報を必要とするガードのみがMint Settingsを必要とします。例えば、Third Party Signerは署名者参照を必要とし、Mint LimitはIDを必要とします。Start DateやEnd Dateなどのガードは自動的に検証され、Mint Settingsは不要です。各ガードのドキュメントページでMint Settingsが必要かどうかが指定されています。
  - q: minter署名者とpayer署名者の違いは何ですか？
    a: Candy Guard v1.0から、mintV1命令は別々のminterとpayer署名者を受け取ります。payerはストレージやSOL支払いガードなどのSOLベースの手数料をカバーします。minterはガード条件（許可リストやミント制限など）に対して検証され、トークンベースの手数料を支払います。この分離により、バックエンドのpayerがエンドユーザーに代わってSOLコストをカバーするガスレスミントワークフローが可能になります。
---

## 概要

`mintV1`命令は、ロードされた[Core Candy Machine](/ja/smart-contracts/core-candy-machine)からアクセス制御のために[Candy Guard](/ja/smart-contracts/core-candy-machine/guards)プログラムを経由し、実際のミントをCore Candy Machineプログラムに委譲してCore Assetを作成します。

- **2つのミントパス**: Candy Guardプログラム経由のミント（推奨、ガードサポート）またはCore Candy Machineプログラムからの直接ミント（ミント権限の署名が必要）
- **Mint Settings**: ランタイムデータを必要とするガード（Third Party SignerやNFT Paymentなど）は、ミント時に追加の`mintArgs`が必要
- **ガードグループ**: [ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)が設定されている場合、ミントするグループラベルを指定する必要があり、Mint Settingsはそのグループの解決されたガードに適用
- **事前検証**: 一部のガード（Allow ListやGatekeeperなど）はmint命令が成功する前に別の検証ステップが必要

## 基本的なミント

Core Candy Machineはミントを処理するために2つのオンチェーンプログラムを使用します：**Core Candy Machineプログラム**（実際のミントロジックを担当）と**Candy Guardプログラム**（その上に設定可能なアクセス制御レイヤーを追加）。[Candy Guardsページ](/ja/smart-contracts/core-candy-machine/guards#why-another-program)で説明されているように、これらのプログラムは柔軟なミントワークフローを可能にするために連携して機能します。

Core Candy Machineからミントする方法は2つあります：

- **Candy Guardプログラムから**のミント。Candy Machine Coreプログラムにミントを委譲します。はるかに複雑なミントワークフローを可能にするため、ほとんどの場合これを行いたいでしょう。アカウントで設定されたガードに基づいて、ミント命令に追加の残存アカウントと命令データを渡す必要があるかもしれません。幸いなことに、SDKはいくつかの追加パラメータを要求し、残りを計算してくれるため、これを簡単にします。

- **Core Candy Machine Coreプログラムからの直接ミント**。この場合、設定されたミント権限のみがミントでき、したがってトランザクションに署名する必要があります。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-1 %}

Mint Authority = Candy Guard {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
有効化されたガードに \
準拠する限り誰でも \
ミントできます。
{% /node %}

{% node parent="mint-1" x=-36 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}
{% node parent="mint-2" x=200 y=-18 theme="transparent" %}
Aliceのみが \
ミントできます。
{% /node %}

{% node #nft parent="mint-2" x=77 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-2 %}

Mint Authority = Alice {% .font-semibold %}

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

すべてが順調に進んだ場合、Core Candy Machineで設定されたパラメータに従ってNFTが作成されます。例えば、指定されたCore Candy Machineが**Config Line Settings**を使用し、**Is Sequential**が`false`に設定されている場合、次のアイテムをランダムに取得します。

{% callout type="note" %}
Candy Guardプログラムのバージョン`1.0`から、mint命令は既存の`payer`署名者とは異なる追加の`minter`署名者を受け取ります。`payer`はSOLベースの手数料（ストレージ、SOL支払いガード）をカバーし、`minter`はガード条件に対して検証され、トークンベースの手数料を支払います。これにより、バックエンドウォレットがエンドユーザーに代わってSOLコストを支払うガスレスミントワークフローが可能になります。
{% /callout %}

{% dialect-switcher title="Core Candy Machineからのミント" %}
{% dialect title="JavaScript" id="js" %}

設定されたCandy Guardアカウント経由でCore Candy Machineからミントするには、`mintV1`関数を使用し、ミントされたNFTが属するコレクションNFTのミントアドレスと更新権限を提供できます。`minter`署名者と`payer`署名者も提供できますが、それぞれUmiのidentityとpayerにデフォルト設定されます。

```ts
import { mintV1 } from "@metaplex-foundation/mpl-core-candy-machine";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { generateSigner } from "@metaplex-foundation/umi";

const candyMachineId = publicKey("11111111111111111111111111111111");
const coreCollection = publicKey("22222222222222222222222222222222");
const asset = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachineId,
  asset,
  collection: coreCollection,
}).sendAndConfirm(umi);

```

Candy GuardプログラムではなくCore Candy Machineプログラムから直接ミントしたい稀なケースでは、代わりに`mintAssetFromCandyMachine`関数を使用できます。この関数は、Core Candy Machineのミント権限が署名者として提供される必要があり、明示的な`assetOwner`属性を受け取ります。

```ts
import { mintFromCandyMachineV2 } from '@metaplex-foundation/mpl-core-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await mintAssetFromCandyMachine(umi, {
  candyMachine: candyMachineId,
  mintAuthority: umi.identity,
  assetOwner: umi.identity.publicKey,
  asset,
  collection: coreCollection,
}).sendAndConfirm(umi);
```

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [mintAssetFromCandyMachine](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintAssetFromCandyMachine.html)

{% /dialect %}
{% /dialect-switcher %}

## ガード付きミント

ランタイム情報を必要とするガードは**Mint Settings**を使用します。署名者参照、トークンミントアドレス、制限識別子などのガード固有データを`mintArgs`経由で渡す追加パラメータです。ミント命令を手動で構築する場合、その情報は命令データと残存アカウントの混合として提供されます。しかし、SDKを使用すると、ミント時に追加情報を必要とする各ガードは、**Mint Settings**と呼ぶ設定セットを定義します。これらのMint Settingsは、プログラムが必要とするものに解析されます。

Mint Settingsを必要とするガードの良い例は**NFT Payment**ガードで、これはミントの支払いに使用すべきNFTのミントアドレスなどを必要とします。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #nft-payment-guard label="NFT Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node #third-party-signer-guard label="Third Party Signer" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=700 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-400 %}
{% node #mint-settings label="Mint Settings" /%}
{% node label="SDKを使用" theme="dimmed" /%}
{% /node %}

{% node #mint-args label="Mint Arguments" parent="mint-settings" x=100 y=80 theme="slate" /%}
{% node #mint-accounts label="Mint Remaining Accounts" parent="mint-args" y=50 theme="slate" /%}

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

[利用可能な各ガード](/ja/smart-contracts/core-candy-machine/guards)には独自のドキュメントページがあり、そのガードがミント時にMint Settingsの提供を期待するかどうかを教えてくれます。

Mint Settingsを必要としないガードのみを使用する場合、上記の「基本的なミント」セクションで説明したのと同じ方法でミントできます。そうでなければ、それらを必要とするすべてのガードのMint Settingsを含む追加のオブジェクト属性を提供する必要があります。SDKを使用して実際にどのように見えるかを見てみましょう。

{% callout type="note" %}
Core Candy Machineに設定された[ガード](/ja/smart-contracts/core-candy-machine/guards)の数に応じて、コンピュートユニット制限を増やす必要がある場合があります。`@metaplex-foundation/mpl-toolbox`の`setComputeUnitLimit`を使用して、より高い制限（例：`300_000`ユニット）を設定してください。使用するガードの数に基づいてこの値を調整してください。
{% /callout %}

{% dialect-switcher title="ガード付きCore Candy Machineからのミント" %}
{% dialect title="JavaScript" id="js" %}

Umiライブラリ経由でミントする場合、`mintArgs`属性を使用して必要な**Mint Settings**を提供できます。

以下は、追加の署名者を必要とする**Third Party Signer**ガードと、ウォレットがCore Candy Machineから何回ミントしたかを追跡する**Mint Limit**ガードを使用した例です。

上で言及したように、`mintV1`命令が成功することを保証するために、トランザクションのコンピュートユニット制限を増やす必要がある場合があります。現在のユニットは`300_000`に設定されていますが、必要に応じてこの数を調整できます。以下のコードスニペットで示すように、`mpl-toolbox` Umiライブラリの`setComputeUnitLimit`ヘルパー関数を使用してこれを行うことができます。

```ts
import {
  some,
  generateSigner,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { create, mintV1 } from '@metaplex-foundation/mpl-core-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

// ガード付きCore Candy Machineを作成します。
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    mintLimit: some({ id: 1, limit: 3 }),
  },
}).sendAndConfirm(umi)

// Core Candy Machineからミントします。
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 300_000 }))
  .add(
    mintV1(umi, {
      candyMachine: candyMachineId,
      asset,
      collection: coreCollection,
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        mintLimit: some({ id: 1 }),
      },
    })
  )
  .sendAndConfirm(umi)
```

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [DefaultGuardSetMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## ガードグループでのミント

[ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)が設定されている場合、mint命令にはミントするグループを選択するための明示的な`group`ラベルが必要です。Mint Settingsは選択されたグループの**解決されたガード** -- そのグループのガードとデフォルトガードのマージされた組み合わせ -- に適用されます。

例えば、以下のガードを持つCore Candy Machineを想像してください：

- **デフォルトガード**:
  - Bot Tax
  - Third Party Signer
  - Start Date
- **グループ1**
  - ラベル: "nft"
  - ガード:
    - NFT Payment
    - Start Date
- **グループ2**
  - ラベル: "public"
  - ガード:
    - Sol Payment

グループ1（"nft"ラベル）の解決されたガードは：

- Bot Tax: **デフォルトガード**から。
- Third Party Signer: **デフォルトガード**から。
- NFT Payment: **グループ1**から。
- Start Date: デフォルトガードを上書きするため**グループ1**から。

したがって、提供されるMint Settingsはこれらの解決されたガードに関連する必要があります。上記の例では、Third Party SignerガードとNFT PaymentガードにMint Settingsを提供する必要があります。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards (デフォルトガード)" theme="mint" z=1 /%}
{% node label="Bot Tax" /%}
{% node #third-party-signer-guard label="Third Party Signer" /%}
{% node label="Start Date" /%}
{% node #nft-group theme="mint" z=1 %}
グループ1: "nft" {% .font-semibold %}
{% /node %}
{% node #nft-payment-guard label="NFT Payment" /%}
{% node label="Start Date" /%}
{% node theme="mint" z=1 %}
グループ2: "public"
{% /node %}
{% node label="SOL Payment" /%}
{% /node %}

{% node parent="candy-machine-1" x=700 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-400 y=60 %}
{% node #mint-settings label="Mint Settings" /%}
{% node label="SDKを使用" theme="dimmed" /%}
{% /node %}

{% node #mint-args label="Mint Arguments" parent="mint-settings" x=100 y=80 theme="slate" /%}
{% node #mint-accounts label="Mint Remaining Accounts" parent="mint-args" y=50 theme="slate" /%}

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

{% dialect-switcher title="ガードグループ付きCore Candy Machineからのミント" %}
{% dialect title="JavaScript" id="js" %}

ガードグループを使用するCore Candy Machineからミントする場合、選択したいグループのラベルを`group`属性経由で提供する必要があります。

さらに、そのグループの解決されたガードのMint Settingsを`mintArgs`属性経由で提供できます。

以下は、上記で説明したCore Candy Machineの例からミントするためにUmiライブラリを使用する方法です。

```ts
// ガード付きCore Candy Machineを作成します。
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

// Core Candy Machineからミントします。

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 300_000 }))
  .add(
    mintV1(umi, {
      candyMachine: candyMachineId,
      asset,
      collection: coreCollection,
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

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [DefaultGuardSetMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 事前検証付きミント

一部のガードは、mint命令が成功する前に追加の検証ステップを必要とします。この事前検証ステップは通常、オンチェーンアカウントを作成するか、適格性の証明として機能するトークンを発行し、mint命令が実行時にチェックします。

### Route命令による事前検証

[route命令](/ja/smart-contracts/core-candy-machine/guard-route)は、ガードがミント前の検証のために独自のカスタム命令を実行できるようにします。ガードがroute命令の内容を定義し、結果のオンチェーン証明が後続のmint呼び出し中にチェックされます。

その良い例は**Allow List**ガードです。このガードを使用する場合、route命令を呼び出し、有効なMerkle Proofを提供することで、ウォレットが事前定義されたウォレットリストに属することを確認する必要があります。このroute命令が成功すると、そのウォレット用のAllow List PDAが作成され、mint命令がAllow Listガードを検証するために読み取ることができます。[Allow Listガードについて専用ページで詳しく読むことができます](/ja/smart-contracts/core-candy-machine/guards/allow-list)。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #allow-list-guard label="Allow List" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 %}
{% node #route label="Route" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="Merkle Proofの検証" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="Allow List PDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

### 外部サービスによる事前検証

一部のガードは、route命令を使用する代わりに、外部サービスに事前検証を委譲します。外部サービスがトークンまたは資格情報を発行し、ガードがミント時にそれをチェックします。

例えば、**Gatekeeper**ガードを使用する場合、設定されたGatekeeper Networkに応じてチャレンジ（Captchaの完了など）を実行することでGateway Tokenをリクエストする必要があります。Gatekeeperガードは、ミントを検証または拒否するために、そのようなGateway Tokenの存在をチェックします。[Gatekeeperガードについて専用ページで詳しく学ぶことができます](/ja/smart-contracts/core-candy-machine/guards/gatekeeper)。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #gatekeeper-guard label="Gatekeeper" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 y=-40 %}
{% node #network label="Gatekeeper Network" theme="slate" /%}
{% node theme="slate" %}
Gatekeeper Networkから \
Gateway Tokenをリクエスト \
（例：Captcha）。
{% /node %}
{% /node %}

{% node #gateway-token parent="network" x=23 y=140 label="Gateway Token" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="gatekeeper-guard" to="network" theme="slate" /%}
{% edge from="network" to="gateway-token" theme="slate" path="straight" /%}
{% edge from="gateway-token" to="mint-1" theme="pink" /%}

{% /diagram %}

## ボット税付きミント

[Bot Tax](/ja/smart-contracts/core-candy-machine/guards/bot-tax)ガードは、トランザクションを元に戻すのではなく、失敗したミントに設定可能なSOL手数料を課金することで、Core Candy Machineをボットから保護します。この金額は通常、実際のユーザーの本物の間違いに影響を与えることなくボットを傷つけるために小さく設定されます。すべてのボット税はCore Candy Machineアカウントに転送されるため、ミント完了後にCore Candy Machineアカウントを削除してこれらの資金にアクセスできます。

このガードは少し特別で、他のすべてのガードのミント動作に影響を与えます。Bot Taxが有効化され、他のガードのミント検証が失敗した場合、**トランザクションは成功したふりをします**。これは、プログラムからエラーが返されませんが、NFTもミントされないことを意味します。これは、ボットからCore Candy Machineアカウントに資金を転送するためにトランザクションが成功する必要があるためです。[Bot Taxガードについて専用ページで詳しく学ぶことができます](/ja/smart-contracts/core-candy-machine/guards/bot-tax)。

{% callout type="warning" %}
Bot Taxは失敗したミントを成功したトランザクションのように見せるため、ミントトランザクション確認後に期待されたNFTが実際に作成されたことを常に確認する必要があります。トランザクションログを確認するか、アセットアカウントの存在を検証してください。
{% /callout %}

## 注意事項

- **コンピュートユニット制限**: 複数の[ガード](/ja/smart-contracts/core-candy-machine/guards)を使用したミントはデフォルトのコンピュートバジェットを超える可能性があります。`@metaplex-foundation/mpl-toolbox`の`setComputeUnitLimit`を使用して制限を増やしてください。`300_000`ユニットが一般的な出発点ですが、アクティブなガードの数に基づいて調整してください。
- **minterとpayer署名者**: Candy Guardプログラムv1.0から、`mintV1`命令は別々の`minter`と`payer`署名者を受け取ります。`payer`はSOL手数料（レント、SOL支払いガード）をカバーし、`minter`はガードに対して検証され、トークンベースの手数料をカバーします。明示的に設定されない場合、両方ともUmiのidentityとpayerにデフォルト設定されます。
- **Bot Taxの動作**: [Bot Tax](/ja/smart-contracts/core-candy-machine/guards/bot-tax)が有効で別のガードがミントを拒否した場合、トランザクションはオンチェーンで成功しますがNFTは作成されません。ボット税のSOL額がCandy Machineアカウントに転送されます。Bot Taxがアクティブな場合は、ミント後に常にNFTの作成を確認してください。
- **Config Line順序**: Core Candy MachineがConfig Line Settingsを使用し`isSequential`が`false`に設定されている場合、ミントされたアイテムは残りのプールからランダムに選択されます。`true`に設定すると、順序通りにミントされます。
- **ガードグループラベル必須**: [ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups)が設定されている場合、`group`パラメータは必須です。省略するとmint命令が失敗します。

## FAQ

### Candy Guardプログラム経由のミントとCore Candy Machineプログラムからの直接ミントの違いは何ですか？

Candy Guardプログラム経由のミントでは、設定された[ガード](/ja/smart-contracts/core-candy-machine/guards)を満たす限り誰でもミントでき、支払い、許可リスト、開始日などの複雑なアクセス制御ワークフローが可能です。Core Candy Machineプログラムからの直接ミントはすべてのガードをバイパスしますが、設定されたミント権限がトランザクションに署名する必要があり、権限制御のミントにのみ適しています。

### 複数のガードでミントする際にコンピュートユニット制限を増やすにはどうすればよいですか？

トランザクションビルダー内で`@metaplex-foundation/mpl-toolbox`の`setComputeUnitLimit`ヘルパーを使用します。`300_000`ユニットが一般的な出発点ですが、設定されたガードの数に基づいて調整する必要があります。ガードが多いほど、より多くのコンピュートユニットが必要です。

### ミントが失敗してBot Taxが有効な場合はどうなりますか？

[Bot Tax](/ja/smart-contracts/core-candy-machine/guards/bot-tax)が有効で別のガードがミントを拒否した場合、トランザクションはオンチェーンで成功しますがNFTは作成されません。代わりに、設定されたボット税額（SOL）がミンターからCandy Machineアカウントに転送されます。この設計により、失敗した試行にもSOLがかかるため、ボットがガード条件を安価に調査することを防ぎます。

### ミント時にすべてのガードにMint Settingsを提供する必要がありますか？

いいえ。追加のランタイム情報を必要とするガードのみがMint Settingsを必要とします。例えば、Third Party Signerは署名者参照を必要とし、Mint LimitはIDを必要とします。Start DateやEnd Dateなどのガードは自動的に検証され、Mint Settingsは不要です。各[ガードのドキュメントページ](/ja/smart-contracts/core-candy-machine/guards)でMint Settingsが必要かどうかが指定されています。

### minter署名者とpayer署名者の違いは何ですか？

Candy Guard v1.0から、`mintV1`命令は別々の`minter`と`payer`署名者を受け取ります。`payer`はストレージやSOL支払いガードなどのSOLベースの手数料をカバーします。`minter`はガード条件（許可リストやミント制限など）に対して検証され、トークンベースの手数料を支払います。この分離により、バックエンドのpayerがエンドユーザーに代わってSOLコストをカバーするガスレスミントワークフローが可能になります。

---

## 次のステップ

興味があるかもしれない追加の読み物リソースは次のとおりです：

- [利用可能なすべてのガード](/ja/smart-contracts/core-candy-machine/guards): 必要なガードを厳選できるよう、利用可能なすべてのガードを確認してください。
- [ガードグループ](/ja/smart-contracts/core-candy-machine/guard-groups): 異なるミントフェーズのために複数のガードグループを設定する方法を学びます。
- [Route命令](/ja/smart-contracts/core-candy-machine/guard-route): ガードが事前検証のためにroute命令を使用する方法を理解します。

