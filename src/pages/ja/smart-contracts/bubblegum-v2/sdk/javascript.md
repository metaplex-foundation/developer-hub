---
title: JavaScript SDK
metaTitle: JavaScript SDK - Bubblegum V2 - Metaplex
description: Metaplex Bubblegum V2 JavaScript SDKの完全なリファレンス。Umiのセットアップ、ツリーの作成、ミント、転送、バーン、更新、委任、フリーズ、圧縮NFTのフェッチを網羅。
created: '01-15-2025'
updated: '02-25-2026'
keywords:
  - mpl-bubblegum JavaScript
  - Bubblegum V2 TypeScript SDK
  - compressed NFT JavaScript
  - cNFT SDK
  - Umi framework
  - mintV2
  - transferV2
  - createTree
  - getAssetWithProof
about:
  - Compressed NFTs
  - JavaScript SDK
  - Umi framework
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - '@metaplex-foundation/mpl-bubblegum とUmiをインストールする'
  - 'mplBubblegumプラグインを使用してUmiインスタンスを作成・設定する'
  - 'createTreeを使用してBubblegumツリーを作成する'
  - 'mintV2を使用して圧縮NFTをミントする'
faqs:
  - q: Bubblegum V2 JavaScript SDKとは何ですか？
    a: Bubblegum V2 JavaScript SDK（@metaplex-foundation/mpl-bubblegum）は、SolanaでのコンプレッストNFTの作成と管理のためのTypeScriptライブラリです。UmiフレームワークをベースにしておりDAS APIプラグインが自動的に含まれています。
  - q: このSDKを使用するために特別なRPCプロバイダーが必要ですか？
    a: はい。圧縮NFTをフェッチおよびインデックスするために、Metaplex DAS APIをサポートするRPCプロバイダーが必要です。標準のSolana RPCエンドポイントはDASをサポートしていません。互換性のあるオプションについてはRPCプロバイダーページを参照してください。
  - q: ミント後にcNFTのアセットIDを取得するにはどうすればよいですか？
    a: ミントトランザクションの確認後、parseLeafFromMintV2Transactionを使用してください。アセットIDを含むリーフスキーマをトランザクションから抽出します。
  - q: 「Transaction too large」エラーが発生するのはなぜですか？
    a: マークルプルーフはツリーの深さに比例して大きくなります。getAssetWithProofにtruncateCanopy trueを渡すか、アドレスルックアップテーブル付きのバージョン管理されたトランザクションを使用してください。
  - q: このSDKをBubblegum V1ツリーで使用できますか？
    a: いいえ。このSDKはBubblegum V2を対象としておりLeafSchemaV2を使用します。V1ツリーにはレガシーBubblegum SDKを使用してください。
  - q: getAssetWithProofとは何で、なぜ必要なのですか？
    a: getAssetWithProofは、DAS APIからリーフ変更命令に必要なすべてのパラメーター（プルーフ、ルート、リーフインデックス、ノンス、メタデータ）を1回の呼び出しで取得するヘルパーです。ほぼすべての書き込み命令にこれが必要です。
---

**Bubblegum V2 JavaScript SDK**（`@metaplex-foundation/mpl-bubblegum`）は、Solanaで[圧縮NFT](/ja/smart-contracts/bubblegum-v2)を作成・管理するための推奨TypeScript/JavaScriptライブラリです。[Umiフレームワーク](/ja/dev-tools/umi)をベースに構築されており、すべてのBubblegum V2操作に対してタイプセーフな関数を提供し、[DAS API](/ja/smart-contracts/bubblegum-v2/fetch-cnfts)プラグインが自動的に含まれています。 {% .lead %}

{% callout title="学習内容" %}
このSDKリファレンスでは以下を解説します：
- Bubblegum V2プラグインを使用したUmiのセットアップ
- cNFTを保存するためのマークルツリーの作成
- cNFTのミント、転送、バーン、更新
- 委任、フリーズ、クリエイターの検証
- DAS APIを使用したcNFTのフェッチ
- トランザクションサイズ制限と一般的なエラーへの対処
{% /callout %}

## 概要

**Bubblegum V2 JavaScript SDK**は、すべてのMPL-Bubblegum V2プログラム命令をタイプセーフなAPIでラップし、cNFTデータを読み取るためのDAS APIプラグインを含んでいます。

- インストール：`npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults`
- `.use(mplBubblegum())`を使用してUmiに登録 — DAS APIプラグインは自動的に含まれます
- 書き込み操作（転送、バーン、更新、委任、フリーズ、検証）の前に`getAssetWithProof`を使用する
- Bubblegum V2（MPL-Bubblegum 5.x）対象 — V1ツリーとは互換性なし

*Metaplex Foundationが管理 · February 2026最終確認 · MPL-Bubblegum 5.xに適用 · [GitHubでソースを見る](https://github.com/metaplex-foundation/mpl-bubblegum)*

## クイックスタート

**ジャンプ先：** [セットアップ](#umi-setup) · [ツリー作成](#create-a-bubblegum-tree) · [ミント](#mint-a-compressed-nft) · [転送](#transfer-a-compressed-nft) · [バーン](#burn-a-compressed-nft) · [更新](#update-a-compressed-nft) · [委任](#delegate-a-compressed-nft) · [コレクション](#collections) · [フリーズ](#freeze-and-thaw) · [クリエイター検証](#verify-creators) · [フェッチ](#fetching-cnfts) · [エラー](#common-errors) · [クイックリファレンス](#quick-reference)

1. 依存関係のインストール：`npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults`
2. `.use(mplBubblegum())`を使用してUmiインスタンスを作成する
3. `createTree`でBubblegumツリーを作成する
4. `mintV2`でcNFTをミントし、その後の書き込み操作の前には`getAssetWithProof`を使用する

## インストール

```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults
```

{% quick-links %}
{% quick-link title="TypeDoc APIリファレンス" target="_blank" icon="JavaScript" href="https://mpl-bubblegum.typedoc.metaplex.com/" description="SDKの完全な生成APIドキュメント。" /%}
{% quick-link title="npmパッケージ" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-bubblegum" description="バージョン履歴付きのnpmjs.comのパッケージ。" /%}
{% /quick-links %}

## Umiのセットアップ

`mplBubblegum`プラグインは、すべてのBubblegum V2命令とDAS APIプラグインをUmiインスタンスに登録します。

```ts {% title="setup.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { keypairIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(keypairIdentity(yourKeypair))
```

{% totem %}
{% totem-accordion title="ファイルからキーペアを読み込む" %}
```ts {% title="load-keypair.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { readFileSync } from 'fs'

const secretKey = JSON.parse(readFileSync('/path/to/keypair.json', 'utf-8'))
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey))
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(keypairIdentity(keypair))
```
{% /totem-accordion %}
{% totem-accordion title="ブラウザウォレットアダプター" %}
```ts {% title="browser-wallet.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(walletAdapterIdentity(wallet)) // from @solana/wallet-adapter-react
```
{% /totem-accordion %}
{% /totem %}

## Bubblegumツリーの作成

`createTree`は新しい[マークルツリー](/ja/smart-contracts/bubblegum-v2/concurrent-merkle-trees)をオンチェーンに割り当て、Bubblegum V2ツリーとして登録します。ツリーのパラメーターは永続的なので、作成前に慎重に選択してください。

```ts {% title="create-tree.ts" %}
import { createTree } from '@metaplex-foundation/mpl-bubblegum'
import { generateSigner } from '@metaplex-foundation/umi'

const merkleTree = generateSigner(umi)

await createTree(umi, {
  merkleTree,
  maxDepth: 14,        // tree holds 2^14 = 16,384 cNFTs
  maxBufferSize: 64,   // concurrent writes per block
  canopyDepth: 10,     // cached upper nodes (reduces proof size in txs)
  public: false,       // false = only tree creator/delegate can mint
}).sendAndConfirm(umi)

console.log('Tree address:', merkleTree.publicKey)
```

{% callout type="note" %}
`public: false`はツリークリエイター（または承認されたツリーデリゲート）のみがツリーからミントできることを意味します。誰でもミントできるようにするには`public: true`を設定してください。ツリーサイズのコスト見積もりについては[ツリーの作成](/ja/smart-contracts/bubblegum-v2/create-trees)を参照してください。
{% /callout %}

## 圧縮NFTのミント

### コレクションなしでミント

`mintV2`は指定したツリーに新しいcNFTリーフを作成します。

```ts {% title="mint-cnft.ts" %}
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum'
import { none } from '@metaplex-foundation/umi'

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 500, // 5% royalty
    collection: none(),
    creators: [{ address: umi.identity.publicKey, verified: false, share: 100 }],
  },
}).sendAndConfirm(umi)
```

### コレクションへのミント

`coreCollection`を渡して、cNFTを[MPL-Coreコレクション](/ja/smart-contracts/bubblegum-v2/collections)に関連付けます。コレクションには`BubblegumV2`プラグインが有効になっている必要があります。

```ts {% title="mint-to-collection.ts" %}
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My Collection cNFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 500,
    collection: publicKey('YourCollectionAddressHere'),
    creators: [{ address: umi.identity.publicKey, verified: false, share: 100 }],
  },
  coreCollection: publicKey('YourCollectionAddressHere'),
}).sendAndConfirm(umi)
```

### ミント後のアセットIDの取得

ミントが確認された後、`parseLeafFromMintV2Transaction`を使用してリーフスキーマ（アセットIDを含む）を取得します。

```ts {% title="parse-mint.ts" %}
import { mintV2, parseLeafFromMintV2Transaction } from '@metaplex-foundation/mpl-bubblegum'
import { none } from '@metaplex-foundation/umi'

const { signature } = await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 500,
    collection: none(),
    creators: [],
  },
}).sendAndConfirm(umi)

const leaf = await parseLeafFromMintV2Transaction(umi, signature)
console.log('Asset ID:', leaf.id)
console.log('Leaf index:', leaf.nonce)
```

## 圧縮NFTの転送

`transferV2`はcNFTの所有権を新しいウォレットに移動します。`getAssetWithProof`は[DAS API](/ja/smart-contracts/bubblegum-v2/fetch-cnfts)から必要なすべてのプルーフパラメーターを取得します。

```ts {% title="transfer.ts" %}
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await transferV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity, // current owner as signer
  newLeafOwner: publicKey('NewOwnerAddressHere'),
}).sendAndConfirm(umi)
```

## 圧縮NFTのバーン

`burnV2`はcNFTを永久に破壊し、ツリーからリーフを削除します。

```ts {% title="burn.ts" %}
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await burnV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity, // owner must sign
}).sendAndConfirm(umi)
```

## 圧縮NFTの更新

`updateMetadataV2`はcNFTのメタデータを変更します。更新権限はcNFTがコレクションに属しているかどうかによって異なります。権限のルールについては[cNFTの更新](/ja/smart-contracts/bubblegum-v2/update-cnfts)を参照してください。

```ts {% title="update.ts" %}
import {
  getAssetWithProof,
  updateMetadataV2,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'
import { some, publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

const updateArgs: UpdateArgsArgs = {
  name: some('Updated Name'),
  uri: some('https://example.com/updated.json'),
}

await updateMetadataV2(umi, {
  ...assetWithProof,
  leafOwner: assetWithProof.leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // If cNFT belongs to a collection, pass the collection address:
  coreCollection: publicKey('YourCollectionAddressHere'),
}).sendAndConfirm(umi)
```

## 圧縮NFTの委任

[リーフデリゲート](/ja/smart-contracts/bubblegum-v2/delegate-cnfts)は、オーナーに代わってcNFTを転送、バーン、フリーズできます。デリゲートは転送後に新しいオーナーにリセットされます。

### デリゲートの承認

```ts {% title="approve-delegate.ts" %}
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await delegate(umi, {
  ...assetWithProof,
  leafOwner: umi.identity,
  previousLeafDelegate: umi.identity.publicKey, // current delegate (use owner if none)
  newLeafDelegate: publicKey('DelegateAddressHere'),
}).sendAndConfirm(umi)
```

### デリゲートの取り消し

新しいデリゲートをオーナー自身のアドレスに設定します。

```ts {% title="revoke-delegate.ts" %}
import { getAssetWithProof, delegate } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await delegate(umi, {
  ...assetWithProof,
  leafOwner: umi.identity,
  previousLeafDelegate: currentDelegatePublicKey,
  newLeafDelegate: umi.identity.publicKey, // revoke by delegating to self
}).sendAndConfirm(umi)
```

## コレクション

`setCollectionV2`はcNFTのMPL-Coreコレクションを設定、変更、または削除します。詳細については[コレクションの管理](/ja/smart-contracts/bubblegum-v2/collections)を参照してください。

### コレクションの設定または変更

```ts {% title="set-collection.ts" %}
import {
  getAssetWithProof,
  setCollectionV2,
  MetadataArgsV2Args,
} from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption, publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
const collection = unwrapOption(assetWithProof.metadata.collection)

const metadata: MetadataArgsV2Args = {
  ...assetWithProof.metadata,
  collection: collection?.key ?? null,
}

await setCollectionV2(umi, {
  ...assetWithProof,
  metadata,
  newCollectionAuthority: newCollectionUpdateAuthority,
  newCoreCollection: publicKey('NewCollectionAddressHere'),
}).sendAndConfirm(umi)
```

### コレクションの削除

```ts {% title="remove-collection.ts" %}
import { getAssetWithProof, setCollectionV2 } from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
const collection = unwrapOption(assetWithProof.metadata.collection)

await setCollectionV2(umi, {
  ...assetWithProof,
  authority: collectionAuthoritySigner,
  coreCollection: collection!.key,
}).sendAndConfirm(umi)
```

## フリーズと解除

2つのフリーズメカニズムが利用可能です。アセットレベルとコレクションレベルのフリーズの詳細については[cNFTのフリーズ](/ja/smart-contracts/bubblegum-v2/freeze-cnfts)を参照してください。

### cNFTのフリーズ（リーフデリゲート）

```ts {% title="freeze.ts" %}
import {
  getAssetWithProof,
  delegateAndFreezeV2,
} from '@metaplex-foundation/mpl-bubblegum'
import { publicKey } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

// Delegates and freezes in one instruction
await delegateAndFreezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity,
  newLeafDelegate: publicKey('FreezeAuthorityAddressHere'),
}).sendAndConfirm(umi)
```

### cNFTの解除

```ts {% title="thaw.ts" %}
import { getAssetWithProof, thawV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await thawV2(umi, {
  ...assetWithProof,
  leafDelegate: umi.identity, // freeze authority must sign
}).sendAndConfirm(umi)
```

### ソウルバウンドcNFTの作成

ソウルバウンドcNFTは永続的に転送不可能です。コレクションには`PermanentFreezeDelegate`プラグインが有効になっている必要があります。セットアップの詳細については[cNFTのフリーズ](/ja/smart-contracts/bubblegum-v2/freeze-cnfts#create-a-soulbound-c-nft)を参照してください。

```ts {% title="soulbound.ts" %}
import { getAssetWithProof, setNonTransferableV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await setNonTransferableV2(umi, {
  ...assetWithProof,
  // permanent freeze delegate must sign
}).sendAndConfirm(umi)
```

{% callout type="warning" %}
`setNonTransferableV2`は不可逆です。この呼び出し後、cNFTを再び転送可能にすることはできません。
{% /callout %}

## クリエイターの検証

`verifyCreatorV2`はクリエイターエントリに`verified`フラグを設定します。検証されるクリエイターはトランザクションに署名する必要があります。詳細については[クリエイターの検証](/ja/smart-contracts/bubblegum-v2/verify-creators)を参照してください。

### クリエイターの検証

```ts {% title="verify-creator.ts" %}
import {
  getAssetWithProof,
  verifyCreatorV2,
  MetadataArgsV2Args,
} from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption, none } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
const collectionOption = unwrapOption(assetWithProof.metadata.collection)

const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: collectionOption ? collectionOption.key : none(),
  creators: assetWithProof.metadata.creators,
}

await verifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity, // the creator being verified must sign
}).sendAndConfirm(umi)
```

### クリエイターの検証解除

```ts {% title="unverify-creator.ts" %}
import {
  getAssetWithProof,
  unverifyCreatorV2,
  MetadataArgsV2Args,
} from '@metaplex-foundation/mpl-bubblegum'
import { unwrapOption, none } from '@metaplex-foundation/umi'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: unwrapOption(assetWithProof.metadata.collection)?.key ?? none(),
  creators: assetWithProof.metadata.creators,
}

await unverifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity,
}).sendAndConfirm(umi)
```

## cNFTのフェッチ

DAS APIプラグインは`mplBubblegum()`によって自動的に登録されます。利用可能なメソッドの詳細については[cNFTのフェッチ](/ja/smart-contracts/bubblegum-v2/fetch-cnfts)を参照してください。

### 単一cNFTのフェッチ

```ts {% title="fetch-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const asset = await umi.rpc.getAsset(assetId)
console.log('Owner:', asset.ownership.owner)
console.log('Name:', asset.content.metadata.name)
```

### オーナー別cNFTのフェッチ

```ts {% title="fetch-by-owner.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const result = await umi.rpc.getAssetsByOwner({
  owner: publicKey('OwnerAddressHere'),
})
console.log('cNFTs owned:', result.items.length)
```

### コレクション別cNFTのフェッチ

```ts {% title="fetch-by-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const result = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: publicKey('CollectionAddressHere'),
})
console.log('cNFTs in collection:', result.items.length)
```

### ツリーとインデックスからリーフアセットIDを導出

```ts {% title="find-asset-id.ts" %}
import { findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum'

const [assetId] = await findLeafAssetIdPda(umi, {
  merkleTree: merkleTree.publicKey,
  leafIndex: 0,
})
```

## トランザクションパターン

### 「Transaction Too Large」エラーへの対処

マークルプルーフはツリーの深さに比例して大きくなります。`getAssetWithProof`に`truncateCanopy: true`を渡すと、[キャノピー](/ja/smart-contracts/bubblegum-v2/merkle-tree-canopy)にキャッシュされたプルーフノードを自動的に削除し、トランザクションサイズを削減します。

```ts {% title="truncate-canopy.ts" %}
import { getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'

// truncateCanopy fetches tree config and removes redundant proof nodes
const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
```

非常に深いツリーで切り詰めたプルーフでもトランザクション制限を超える場合は、[アドレスルックアップテーブル付きのバージョン管理されたトランザクション](/ja/dev-tools/umi/toolbox/address-lookup-table)を使用してください。

### 送信と確認

```ts {% title="send-and-confirm.ts" %}
const result = await mintV2(umi, { ... }).sendAndConfirm(umi)
console.log('Signature:', result.signature)
```

### 送信せずにビルド

```ts {% title="build-only.ts" %}
const tx = await mintV2(umi, { ... }).buildAndSign(umi)
// send later: await umi.rpc.sendTransaction(tx)
```

## 一般的なエラー

### `Transaction too large`
マークルプルーフが1232バイトのトランザクション制限を超えています。`getAssetWithProof`で`{ truncateCanopy: true }`を使用するか、アドレスルックアップテーブル付きのバージョン管理されたトランザクションを実装してください。

### `Invalid proof`
プルーフが古くなっています — プルーフを取得した後にツリーが変更されました。書き込みトランザクションを送信する直前に必ず`getAssetWithProof`を呼び出してください。

### `Leaf already exists` / `Invalid leaf`
アセットIDまたはリーフインデックスが正しくありません。`findLeafAssetIdPda`を使用してアセットIDを再導出するか、`getAssetsByOwner`を使用して再フェッチしてください。

### `InvalidAuthority`
この命令のオーナー、デリゲート、または必要な権限者ではありません。正しい署名者が`leafOwner`または`leafDelegate`として設定されていることを確認してください。

### `Tree is full`
マークルツリーが`maxDepth`容量（`2^maxDepth`リーフ）に達しました。ミントを続けるには新しいツリーを作成してください。

### DASフェッチでの`Account not found`
RPCプロバイダーがMetaplex DAS APIをサポートしていない可能性があります。[互換性のあるRPCプロバイダー](/ja/rpc-providers)に切り替えてください。

## 注意事項

- `getAssetWithProof`はほぼすべての書き込み命令の前に必要です。古いプルーフエラーを避けるために、送信する直前に呼び出してください。
- DAS経由でフェッチされたプルーフは、フェッチと送信の間にツリーが変更されると古くなる場合があります。高並行性のシナリオでは、同じアトミックなフローでフェッチと送信を行う必要があります。
- `setNonTransferableV2`（ソウルバウンド）は不可逆です。一度設定すると転送可能性を回復する方法はありません。
- デリゲート権限は`transferV2`の後に新しいオーナーにリセットされます。必要に応じて新しいオーナーが再委任する必要があります。
- このSDKはBubblegum V2（`LeafSchemaV2`）を対象としています。Bubblegum V1ツリーや解凍ワークフローとは互換性がありません。
- cNFTで使用されるコレクションには`BubblegumV2`プラグインが有効になっている必要があります。このプラグインのない標準的なMPL-Coreコレクションは使用できません。

## クイックリファレンス

### Bubblegum V2 関数

| 関数 | 目的 |
|----------|---------|
| `createTree` | 新しいBubblegum V2マークルツリーを作成する |
| `mintV2` | 新しい圧縮NFTをミントする |
| `transferV2` | cNFTの所有権を転送する |
| `burnV2` | cNFTを永久に破壊する |
| `updateMetadataV2` | cNFTメタデータを更新する（名前、URI、クリエイター、ロイヤリティ） |
| `delegate` | リーフデリゲートを承認または取り消す |
| `setTreeDelegate` | ツリーデリゲートを承認または取り消す |
| `setCollectionV2` | MPL-Coreコレクションを設定、変更、または削除する |
| `freezeV2` | cNFTをフリーズする（既存のリーフデリゲートが必要） |
| `thawV2` | フリーズされたcNFTを解除する |
| `delegateAndFreezeV2` | 1つの命令で委任とフリーズを行う |
| `setNonTransferableV2` | cNFTを永続的にソウルバウンドにする（不可逆） |
| `verifyCreatorV2` | クリエイターエントリにverifiedフラグを設定する |
| `unverifyCreatorV2` | クリエイターエントリからverifiedフラグを削除する |
| `getAssetWithProof` | 書き込み命令に必要なすべてのプルーフパラメーターをフェッチする |
| `findLeafAssetIdPda` | ツリーアドレスとリーフインデックスからcNFTアセットIDを導出する |
| `parseLeafFromMintV2Transaction` | ミントトランザクションからリーフスキーマ（アセットIDを含む）を抽出する |

### 最小依存関係

```json {% title="package.json" %}
{
  "dependencies": {
    "@metaplex-foundation/mpl-bubblegum": "^5.0.0",
    "@metaplex-foundation/umi": "^1.0.0",
    "@metaplex-foundation/umi-bundle-defaults": "^1.0.0"
  }
}
```

### プログラムアドレス

| プログラム | アドレス |
|---------|---------|
| MPL-Bubblegum V2 | `BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY` |
| SPL Account Compression | `cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK` |
| SPL Noop | `noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV` |

### ツリーサイズリファレンス

| 最大深度 | 容量 | 概算コスト |
|-----------|----------|-------------|
| 14 | 16,384 | ~0.34 SOL |
| 17 | 131,072 | ~1.1 SOL |
| 20 | 1,048,576 | ~8.5 SOL |
| 24 | 16,777,216 | ~130 SOL |
| 30 | 1,073,741,824 | ~2,000 SOL |

## よくある質問

### Bubblegum V2 JavaScript SDKとは何ですか？

Bubblegum V2 JavaScript SDK（`@metaplex-foundation/mpl-bubblegum`）は、Solanaで[圧縮NFT](/ja/smart-contracts/bubblegum-v2)を作成・管理するためのTypeScriptライブラリです。[Umiフレームワーク](/ja/dev-tools/umi)をベースに構築されており、すべてのMPL-Bubblegum V2プログラム命令にタイプセーフなラッパーを提供し、[DAS API](/ja/smart-contracts/bubblegum-v2/fetch-cnfts)プラグインが自動的に含まれています。

### このSDKを使用するために特別なRPCプロバイダーが必要ですか？

はい。圧縮NFTはcNFTデータをインデックス化・取得するためにMetaplex DAS APIをサポートするRPCプロバイダーが必要です。標準のSolana RPCはDASをサポートしていません。互換性のあるオプション（Helius、Triton、Shyftなど）については[RPCプロバイダー](/ja/rpc-providers)ページを参照してください。

### ミント後にcNFTのアセットIDを取得するにはどうすればよいですか？

確認されたトランザクション署名とともに`parseLeafFromMintV2Transaction`を使用してください。ミントトランザクションをデコードして、`leaf.id`（アセットID）と`leaf.nonce`（リーフインデックス）を含む完全なリーフスキーマを返します。

### 「Transaction too large」エラーが発生するのはなぜですか？

マークルプルーフはツリーの深さに比例して大きくなります。`getAssetWithProof`に`{ truncateCanopy: true }`を渡すと、オンチェーンキャノピーにキャッシュされたプルーフノードを自動的に削除します。非常に深いツリーには[アドレスルックアップテーブル付きのバージョン管理されたトランザクション](/ja/dev-tools/umi/toolbox/address-lookup-table)を使用してください。

### このSDKをBubblegum V1ツリーで使用できますか？

いいえ。このSDKは`LeafSchemaV2`とV2マークルツリーを使用するBubblegum V2を対象としています。V1ツリーにはレガシーBubblegum SDKを使用してください。V2ツリーとV1ツリーはクロス互換性がありません。

### `getAssetWithProof`とは何で、なぜ必要なのですか？

`getAssetWithProof`は、DAS APIで`getAsset`と`getAssetProof`の両方を呼び出し、Bubblegum V2書き込み命令が期待する正確なパラメーター形状にレスポンスを解析するヘルパーです。ほぼすべての変更命令（転送、バーン、更新、委任、フリーズ、検証）にこれらのパラメーターが必要です。古いプルーフエラーを避けるために、送信する直前に必ず呼び出してください。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Umi** | Solanaアプリケーション構築のためのMetaplexのフレームワーク。ウォレット接続、RPC、トランザクション構築を処理する |
| **mplBubblegum** | すべてのBubblegum V2命令とDAS APIプラグインを登録するUmiプラグイン |
| **cNFT** | 圧縮NFT — 専用アカウントではなく、オンチェーンマークルツリーのハッシュされたリーフとして保存される |
| **マークルツリー** | ハッシュされたNFTデータをリーフとして保存するオンチェーンアカウント。`createTree`で作成される |
| **リーフ** | マークルツリーの単一のcNFTエントリ。リーフインデックスで識別される |
| **プルーフ** | リーフがツリーに属することを暗号学的に検証するための兄弟ハッシュのリスト |
| **キャノピー** | トランザクションで必要なプルーフサイズを削減するためにオンチェーンに保存されたマークルツリーの上位ノードのキャッシュ |
| **LeafSchemaV2** | id、オーナー、デリゲート、ノンス、データハッシュ、クリエイターハッシュ、コレクションハッシュ、アセットデータハッシュ、フラグを含むV2リーフデータ構造 |
| **getAssetWithProof** | 書き込み命令に必要なすべてのDAS APIデータをフェッチ・解析するSDKヘルパー |
| **DAS API** | Digital Asset Standard API — cNFTデータのインデックス化とフェッチのためのRPC拡張 |
| **TreeConfig** | Bubblegumツリー設定を保存するマークルツリーアドレスから導出されるPDA |
| **リーフデリゲート** | cNFTオーナーによってcNFTの転送、バーン、フリーズが許可されたアカウント |
| **ツリーデリゲート** | プライベートツリーからcNFTをミントするためにツリークリエイターによって許可されたアカウント |
| **ソウルバウンド** | `setNonTransferableV2`で設定された永続的に転送不可能なcNFT — 不可逆 |
