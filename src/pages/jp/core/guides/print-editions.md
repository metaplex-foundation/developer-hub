---
title: MPL CoreでEditionを発行
metaTitle: Print Editions | Core Guides
description: Metaplex Coreのプラグインを組み合わせてEdition（プリント）を作成する方法を解説します。
---

## はじめに

### Editionとは？

Editionは同一の「Master Edition」の複製（プリント）です。物理的な絵画で例えると、Master Editionが原画、Editionがそのプリント版に相当します。

### CoreでのEdition

MPL Coreではメインネットリリース直後にEditionのサポートが追加されました。Token MetadataのEditionと異なり、Edition番号や供給量は強制されず、情報的な位置づけです。

CoreでEdition概念を実現するには2つの[プラグイン](/core/plugins)を使います。
- コレクション側に[Master Edition](/core/plugins/master-edition)
- アセット側に[Edition](/core/plugins/edition)

階層イメージは次の通りです。

{% diagram %}
{% node %}
{% node #master label="Master Edition" theme="indigo" /%}
{% /node %}
{% node y="50" parent="master" theme="transparent" %}
Collection with 

Master Edition Plugin
{% /node %}

{% node x="200" y="-70" parent="master" %}
{% node #asset1 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset1" %}
{% node #asset2 label="Edition" theme="blue" /%}
{% /node %}
{% node y="70" parent="asset2" %}
{% node #asset3 label="Edition" theme="blue" /%}
{% /node %}

{% node y="50" parent="asset3" theme="transparent" %}
Assets with 

Edition Plugin
{% /node %}

{% edge from="master" to="asset1" /%}
{% edge from="master" to="asset2" /%}
{% edge from="master" to="asset3" /%}

{% /diagram %}

## Candy MachineでEditionを作成

Editionを作って販売する最も簡単な方法は、Core Candy Machineを活用することです。

以下のコードは、Master Editionコレクションと、EditionをプリントするCandy Machineを作成します。

{% dialect-switcher title="Edition GuardとMaster Editionコレクション付きのCandy Machineを作成" %}
{% dialect title="JavaScript" id="js" %}

まず必要な関数をインポートし、UmiをRPCとウォレットで初期化します。

```ts
import { create, mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'
import { createCollection, ruleSet } from '@metaplex-foundation/mpl-core'
import crypto from 'crypto'
import { generateSigner, keypairIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

// 任意のRPCエンドポイントを使用
const umi = createUmi('http://127.0.0.1:8899').use(mplCandyMachine())

// ウォレット/キーペアを設定
const keypair = generateSigner(umi)
umi.use(keypairIdentity(keypair))
```

次に、[Master Editionプラグイン](/core/plugins/master-edition)付きでコレクションを作成します。`maxSupply`はプリント数、`name`/`uri`は必要に応じて上書きできます。ここでは使い勝手のため[Royaltyプラグイン](/core/plugins/royalties)も追加します。

```ts
const collectionSigner = generateSigner(umi)
await createCollection(umi, {
  collection: collectionSigner,
  name: 'Master Edition',
  uri: 'https://example.com/master-edition.json',
  plugins: [
    {
      type: 'MasterEdition',
      maxSupply: 100,
      // 親コレクションと同じで良ければ省略可
      name: undefined,
      uri: undefined,
    },
    {
      type: 'Royalties',
      basisPoints: 500,
      creators: [{ address: umi.identity.publicKey, percentage: 100 }],
      ruleSet: ruleSet('None'),
    },
  ],
}).sendAndConfirm(umi)
```

続いて、`hiddenSettings`と`edition`ガードを使ってCandy Machineを作成します。

- `hiddenSettings`: ミントされる全アセットに同一（あるいは類似）のName/Metadataを適用します。`$ID$`でミント順の番号を差し込み可能です。
- `edition`ガード: 各アセットに[Editionプラグイン](/core/plugins/edition)を追加します。番号は`editionStartOffset`から始まり、ミントごとに増加します。

```ts
// 各EditionのNameとオフチェーンMetadata
const editionData = {
  name: 'Edition Name',
  uri: 'https://example.com/edition-asset.json',
}

// Candy Machine要件のハッシュ（Edition自体は未使用）
const string = JSON.stringify(editionData)
const hash = crypto.createHash('sha256').update(string).digest()

const candyMachine = generateSigner(umi)
const createIx = await create(umi, {
  candyMachine,
  collection: collectionSigner.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  hiddenSettings: {
    name: editionData.name,
    uri: editionData.uri,
    hash,
  },
  guards: {
    edition: { editionStartOffset: 0 },
    // 他のガードも併用可
  },
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

以上です。ユーザーはCandy MachineからEditionをミントできます。

## Core Candy MachineなしでEditionを作る

{% callout type="note" %}
MPL CoreのEditionではCore Candy Machineの利用を強く推奨します。作成と正しい採番を自動で処理してくれます。
{% /callout %}

Core Candy Machineを使わずにEditionを作る場合は次の手順です。

1. [Master Edition](/core/plugins/master-edition)プラグイン付きでコレクションを作成

{% dialect-switcher title="Master Editionプラグイン付きでMPL Coreコレクションを作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import { createCollection, ruleSet } from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

await createCollection(umi, {
  collection: collectionSigner,
  name: 'Master Edition',
  uri: 'https://example.com/master-edition.json',
  plugins: [
    {
      type: 'MasterEdition',
      maxSupply: 100,
      name: undefined,
      uri: undefined,
    },
    {
      type: 'Royalties',
      basisPoints: 500,
      creators: [
        { address: creator1, percentage: 50 },
        { address: creator2, percentage: 50 },
      ],
      ruleSet: ruleSet('None'),
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// 省略（コレクション作成のRust例）
```

{% /dialect %}

{% /dialect-switcher %}

2. アセットに[Edition](/core/plugins/edition)プラグインを付与（番号は都度インクリメント）

{% dialect-switcher title="Editionプラグイン付きMPL Coreアセットの作成" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)

const result = create(umi, {
  asset: asset,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  collection: collectionSigner.publicKey,
  plugins: [
    {
      type: 'Edition',
      number: 1,
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// 省略（アセット作成のRust例）
```

{% /dialect %}

{% /dialect-switcher %}

## 参考
- [Candy Machineからミント](/core-candy-machine/mint)
- [Master Editionプラグイン](/core/plugins/master-edition)
- [Editionプラグイン](/core/plugins/edition)

