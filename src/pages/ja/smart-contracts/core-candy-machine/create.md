---
title: Core Candy Machineの作成
metaTitle: Core Candy Machineの作成 | Core Candy Machine
description: JavaScriptとRustの両方でCore Candy Machineとその様々な設定を作成する方法を学びます。
---

## 前提条件

- [アセットの準備](/ja/smart-contracts/core-candy-machine/preparing-assets)
- [Coreコレクションの作成](/ja/smart-contracts/core/collections#コレクションの作成)

Core Candy Machineアセットをコレクション（新規または既存）に作成したい場合は、Core Candy Machineの作成時にCoreコレクションを提供する必要があります。

## Candy Machineの作成

{% dialect-switcher title="Core Candy Machineの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
// Candy Machineを作成します。
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

const candyMachine = generateSigner(umi)

const createIx = await create(umi, {
  candyMachine,
  collection: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### 引数

createCandyMachine関数に渡すことができる利用可能な引数。

Core Candy Machineの作成に使用される新しく生成されたキーペア/サイナー。

{% dialect-switcher title="CandyMachine作成引数" %}
{% dialect title="JavaScript" id="js" %}

| 名前                      | タイプ                        |
| ------------------------- | ----------------------------- |
| candyMachine              | signer                        |
| authorityPda (オプション)   | publicKey                     |
| authority (オプション)      | publicKey                     |
| payer (オプション)          | signer                        |
| collection                | publicKey                     |
| collectionUpdateAuthority | signer                        |
| itemsAvailable            | number                        |
| isMutable                 | boolean                       |
| configLineSettings        | [Config Line Settings](#config-line-settings) |
| hiddenSettings            | [Hidden Settings](#hidden-settings)      |

{% /dialect %}
{% dialect title="Rust" id="rust" %}

| 名前                      | タイプ                        |
| ------------------------- | ----------------------------- |
| candyMachine              | signer                        |
| authorityPda (オプション)   | pubkey                        |
| authority (オプション)      | pubkey                        |
| payer (オプション)          | signer                        |
| collection                | pubkey                        |
| collectionUpdateAuthority | signer                        |
| itemsAvailable            | number                        |
| isMutable                 | boolean                       |
| configLineSettings        | [Config Line Settings](#config-line-settings) |
| hiddenSettings            | [Hidden Settings](#hidden-settings)      |

{% /dialect %}
{% /dialect-switcher %}

### authorityPda (オプション)

{% dialect-switcher title="Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authorityPda: string
```

{% /dialect %}
{% /dialect-switcher %}

authorityPdaフィールドは、ミントされたアセットをコレクションに検証するために使用されるPDAです。これはオプションであり、省略された場合はデフォルトのシードに基づいて自動的に計算されます。

### authority (オプション)

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authority: string
```

{% /dialect %}
{% /dialect-switcher %}

### payer (オプション)

トランザクションとレント費用を支払うウォレット。デフォルトはサイナーです。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
payer: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

authorityフィールドは、Core Candy Machineの管理者となるウォレット/publicKeyです。

### Collection

Core Candy Machineがアセットを作成するコレクション。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### Collection Update Authority

コレクションの更新権限。Candy Machineが作成されたアセットをコレクションに検証するためのデリゲートを承認できるよう、これは署名者である必要があります。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collectionUpdateAuthority: signer
```

{% /dialect %}
{% /dialect-switcher %}

<!-- ### Seller Fee Basis Points

{% dialect-switcher title="sellerFeeBasisPoints" %}
{% dialect title="JavaScript" id="js" %}

```ts
sellerFeeBasisPoints: number
```

{% /dialect %}
{% /dialect-switcher %}

`sellerFeeBasisPoints`フィールドは、Candy Machineから作成される各アセットに書き込まれるロイヤリティベーシスポイントです。
これは小数点以下2桁に基づく数値として指定されるため、`500`ベーシスポイントは`5%`に等しくなります。

`umi`ライブラリからインポートできる計算用の`percentageAmount`ヘルパーもあります。

{% dialect-switcher title="percentageAmount" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { percentAmount } from '@metaplex-foundation/umi'

sellerFeeBasisPoints: percentageAmount(5)
```

{% /dialect %}
{% /dialect-switcher %} -->

### itemsAvailable

Core Candy Machineに読み込まれるアイテム数。

{% dialect-switcher title="itemsAvailable" %}
{% dialect title="JavaScript" id="js" %}

```ts
itemsAvailable: number
```

{% /dialect %}
{% /dialect-switcher %}

### Is Mutable

作成時にアセットを可変または不変としてマークするブール値。

{% dialect-switcher title="isMutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: boolean
```

{% /dialect %}
{% /dialect-switcher %}

### Config Line Settings

{% callout type="note" title="ランダム性" %}

Config Line SettingsとHidden Settingsは相互に排他的です。一度に使用できるのは一つだけです。

アセットの「ランダム」ミントプロセスは完全に予測不可能ではなく、十分なリソースと悪意ある意図によって影響を受ける可能性があるため、リビールメカニズムにはHidden Settingsを利用することが推奨される場合があります。

{% /callout %}

Config Line Settingsは、Core Candy Machineにアセットデータを追加する高度なオプションを可能にするオプションフィールドで、Core Candy Machineのレント費用を大幅に安くします。

アセットの名前とURIプレフィックスをCore Candy Machineに保存することで、すべてのアセットに同じ名前とURIを保存する必要がないため、保存に必要なデータが大幅に削減されます。

例えば、すべてのアセットが`Example Asset #1`から`Example Asset #1000`まで同じ命名構造を持っている場合、通常は文字列`Example Asset #`を1000回保存する必要があり、15,000バイトを占有します。

名前のプレフィックスをCore Candy Machineに保存し、Core Candy Machineが作成されたインデックス番号を文字列に追加することで、レント費用でこれらの15,000バイトを節約できます。

これはURIプレフィックスにも適用されます。

{% dialect-switcher title="ConfigLineSettingsオブジェクト" %}
{% dialect title="JavaScript" id="js" %}

```ts
ConfigLineSettings = {
    prefixName: string;
    nameLength: number;
    prefixUri: string;
    uriLength: number;
    isSequential: boolean;
}
```

{% /dialect %}
{% /dialect-switcher %}

#### prefixName

これはNFTの名前プレフィックスを保存し、ミント時に名前の末尾にミントされたインデックスを追加します。

アセットの命名構造が`Example Asset #1`の場合、プレフィックスは`Example Asset #`になります。ミント時にCore Candy Machineは文字列の末尾にインデックスを追加します。

#### nameLength

名前プレフィックスを除く、挿入される各アイテムの名前の最大長。

例：
- 1000アイテムを含むCandy Machine
- 各アイテムの名前は`Example Asset #X`（Xは1から始まるアイテムのインデックス）

この場合、19文字を保存する必要があります。"My NFT Project #"で15文字、最高数の"1000"で4文字。`prefixName`を使用する場合、`nameLength`は代わりに4に削減できます。

#### prefixUri

可変識別IDを除く、メタデータのベースURI。

アセットのメタデータURIが`https://example.com/metadata/0.json`の場合、ベースメタデータURIは`https://example.com/metadata/`になります。

#### uriLength

`prefixUri`を除く、URIの最大長。

例：
- 20文字のベースURI `https://arweave.net/`
- 最大43文字の一意の識別子

プレフィックスなしでは63文字の保存が必要になります。`prefixUri`を使用する場合、`uriLength`は`https://arweave.net/`の20文字分削減され、一意識別子の43文字になります。

#### isSequential

順次インデックスジェネレーターを使用するかどうかを示します。falseの場合、Candy Machineはランダムにミントします。HiddenSettingsは常に順次です。

#### configLineSettings

`configLineSettings`を適用してCore Candy Machineを作成する例を示します：

{% dialect-switcher title="configLineSettingsでCore Candy Machineを作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

const coreCollection = publicKey('11111111111111111111111111111111')

const createIx = await create(umi, {
  candyMachine,
  collection: coreCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 5000,
  configLineSettings: some({
    prefixName: 'Example Asset #',
    nameLength: 15,
    prefixUri: 'https://example.com/metadata/',
    uriLength: 29,
    isSequential: false,
  }),
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### Hidden Settings

Hidden Settingsにより、Core Candy Machineはすべての購入者に対して全く同じアセットをミントできます。この設計原理の背後にある考えは、人気の'リビール'メカニズムを後日実行できるようにすることです。Edition Guardと組み合わせることで、Core Editionの印刷も可能になります。

{% dialect-switcher title="Hidden Settings" %}
{% dialect title="JavaScript" id="js" %}

```ts
hiddenSettings = {
  name: string,
  uri: string,
  hash: Uint8Array,
}
```

{% /dialect %}
{% /dialect-switcher %}

#### name

Hidden Settingsが有効な状態でミントされるすべてのアセットに表示される名前。Config Line Settingsのプレフィックスと同様に、Hidden SettingsのNameとURIには特別な変数を使用できることに注意してください。これらの変数は：

- `$ID$`: これは0から始まるミントされたアセットのインデックスに置き換えられます。
- `$ID+1$`: これは1から始まるミントされたアセットのインデックスに置き換えられます。

これを使用して、希望するアセットをリビールされたデータに一致させることができるようにする必要があります。

#### uri

Hidden Settingsが有効な状態でミントされるすべてのアセットに表示されるURI。

#### hash

ハッシュの目的は、更新/リビールされた各NFTがCandy Machineからミントされたインデックスに一致する正しいものであることを検証するデータ片の暗号化ハッシュ/チェックサムを保存することです。これにより、ユーザーは検証をチェックでき、データが変更されているかどうか、実際に`Hidden NFT #39`が`Revealed NFT #39`であり、元のデータがレアアイテムを特定の人/ホルダーに移動するために改ざんされていないことを確認できます。

{% dialect-switcher title="リビールデータのハッシュ化" %}
{% dialect title="JavaScript" id="js" %}

```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```

{% /dialect %}
{% /dialect-switcher %}

#### Hidden SettingsによるCore Candy Machineの例

{% dialect-switcher title="Hidden SettingsでCandy Machineを作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import crypto from "crypto";

const candyMachine = generateSigner(umi)

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

const createIx = await create(umi, {
  candyMachine,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
  sellerFeeBasisPoints: percentAmount(10),
  itemsAvailable: 5000,
  hiddenSettings: {
    name: "Hidden Asset",
    uri: "https://example.com/hidden-asset.json",
    hash,
  }
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## ガード付きCore Candy Machineの作成

`ガード`付きの`Core Candy Machine`を作成するには、作成時に`guards:`フィールドを提供し、Candy Machineに適用したいデフォルトガードを指定できます。

これまでに作成したCore Candy Machineにはガードが有効になっていませんでした。利用可能なすべてのガードがわかったので、いくつかのガードを有効にして新しいCandy Machineを設定する方法を見てみましょう。

具体的な実装は使用するSDKによって異なります（以下を参照）が、基本的な考え方は、必要な設定を提供してガードを有効にすることです。設定されていないガードは無効になります。

{% dialect-switcher title="ガード付きCore Candy Machineの作成" %}
{% dialect title="JavaScript" id="js" %}

<!-- Umiライブラリでガードを有効にするには、`create`関数に`guards`属性を提供し、有効にしたいすべてのガードの設定を渡すだけです。`none()`に設定されているか、提供されていないガードは無効になります。 -->

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const createIx = await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1.5), destination: treasury }),
    startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    // 他のすべてのガードは無効...
  },
})

await createIx.sendAndConfirm(umi)
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}
