---
title: ミント
metaTitle: ミント | Core Candy Machine
description: Core Candy Machineからミントして、ユーザーがCore NFTアセットを購入できるようにする方法。
---

これまで、Candy Machineの作成とメンテナンス方法を学びました。それらを設定する方法と、ガードとガードグループを使用して複雑なミントワークフローを設定する方法も見てきました。最後のピースについて話す時が来ました：ミントです！{% .lead %}

## 基本的なミント

[Candy Guardsページ](/ja/smart-contracts/core-candy-machine/guards#なぜ別のプログラムなのか)で言及したように、Candy MachineからNFTをミントする責任を持つ2つのプログラムがあります：NFTのミントを担当するCandy Machine Coreプログラムと、その上に設定可能なアクセス制御層を追加し、カスタムガードを提供するためにフォークできるCandy Guardプログラムです。

そのため、Candy Machineからミントする方法は2つあります：

- **Candy GuardプログラムからのミントQndy Machine Coreプログラムにミントを委譲します。はるかに複雑なミントワークフローを可能にするため、ほとんどの場合これを行いたいでしょう。アカウントで設定されたガードに基づいて、ミント命令に追加の残存アカウントと命令データを渡す必要があるかもしれません。幸いなことに、SDKはいくつかの追加パラメータを要求し、残りを計算してくれるため、これを簡単にします。

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

すべてが順調に進んだ場合、Core Candy Machineで設定されたパラメータに従ってNFTが作成されます。例えば、指定されたCore Candy MachineがCore Candy Machine**Config Line Settings**を使用し、**Is Sequential**が`false`に設定されている場合、次のアイテムをランダムに取得します。

Candy Guardプログラムのバージョン`1.0`から、mint命令は既存の`payer`署名者とは異なる追加の`minter`署名者を受け取ります。これにより、NFTをミントするウォレットが、`payer`署名者がこれらの手数料を抽象化するため、ストレージ手数料やSOLミント支払いなどのSOL手数料を支払う必要がないミントワークフローを作成できます。`minter`署名者はトークンベースの手数料を支払い、設定されたガードの検証に使用されることに注意してください。

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

Candy GuardプログラムではなくCore Candy Machineプログラムから直接ミントしたい稀なケースでは、代わりに`mintAssetFromCandyMachine`関数を使用できます。この関数は、Core Candy MachineのミントSOLPayment권한が署名者として提供される必要があり、明示的な`assetOwner`属性を受け取ります。

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

多くのガードを使用するCore Candy Machineからミントする場合、追加のガード固有情報を提供する必要がある場合があります。

ミント命令を手動で構築する場合、その情報は命令データと残存アカウントの混合として提供されます。しかし、SDKを使用すると、ミント時に追加情報を必要とする各ガードは、**Mint Settings**と呼ぶ設定セットを定義します。これらのMint Settingsは、プログラムが必要とするものに解析されます。

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

作成したCandy Guardの数に応じて、トランザクションが成功することを保証するためにコンピュータユニット数を増やす必要がある場合があることに注意してください。SDKもこれを支援してくれるかもしれません。

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

ガードグループを使用するCore Candy Machineからミントする場合、**ラベルを提供してミントしたいグループを明示的に選択する必要があります**。

さらに、[前のセクション](#ガード付きミント)で説明したように、Mint Settingsも必要な場合があります。しかし、**Mint Settingsは選択されたグループの「解決されたガード」に適用されます**。

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

一部のガードは、Core Candy Machineからミントする前に追加の検証ステップを要求する場合があることに注意することが重要です。この事前検証ステップは通常、ブロックチェーン上にアカウントを作成するか、その検証の証明として機能するトークンでウォレットに報酬を与えます。

### Route命令の使用

ガードが事前検証ステップを要求できる一つの方法は、「route」命令を通じて[独自の特別な命令](/ja/smart-contracts/core-candy-machine/guard-route)を使用することです。

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

### 外部サービスの使用

ガードがその事前検証ステップを実行するもう一つの方法は、外部ソリューションに依存することです。

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

Core Candy Machineに含めたいであろう一つのガードは、失敗したミントに設定可能なSOL量を課金することでCore Candy Machineをボットから守るBot Taxガードです。この金額は通常、実際のユーザーからの本物の間違いに影響を与えることなくボットを傷つけるために小さく設定されます。すべてのボット税はCore Candy Machineアカウントに転送されるため、ミント完了後にCore Candy Machineアカウントを削除してこれらの資金にアクセスできます。

このガードは少し特別で、他のすべてのガードのミント動作に影響を与えます。Bot Taxが有効化され、他のガードのミント検証が失敗した場合、**トランザクションは成功したふりをします**。これは、プログラムからエラーが返されませんが、NFTもミントされないことを意味します。これは、ボットからCore Candy Machineアカウントに資金を転送するためにトランザクションが成功する必要があるためです。[Bot Taxガードについて専用ページで詳しく学ぶことができます](/ja/smart-contracts/core-candy-machine/guards/bot-tax)。

## まとめ

おめでとうございます。Core Candy MachineがAからZまでどのように機能するかを理解しました！

興味があるかもしれない追加の読み物リソースは次のとおりです：

- [利用可能なすべてのガード](/ja/smart-contracts/core-candy-machine/guards)：必要なガードを厳選できるよう、利用可能なすべてのガードを確認してください。
