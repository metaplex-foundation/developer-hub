---
title: JavaScript SDK
metaTitle: JavaScript SDK - Bubblegum V2 - Metaplex
description: Metaplex Bubblegum V2 JavaScript SDK 完整参考文档，涵盖 Umi 设置、创建树、铸造、转移、销毁、更新、委托、冻结以及获取压缩 NFT。
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
  - '安装 @metaplex-foundation/mpl-bubblegum 和 Umi'
  - '使用 mplBubblegum 插件创建并配置 Umi 实例'
  - '使用 createTree 创建 Bubblegum 树'
  - '使用 mintV2 铸造压缩 NFT'
faqs:
  - q: 什么是 Bubblegum V2 JavaScript SDK？
    a: Bubblegum V2 JavaScript SDK（@metaplex-foundation/mpl-bubblegum）是用于在 Solana 上创建和管理压缩 NFT 的 TypeScript 库。它基于 Umi 框架构建，并自动包含 DAS API 插件。
  - q: 使用此 SDK 是否需要特殊的 RPC 提供商？
    a: 是的。您需要支持 Metaplex DAS API 的 RPC 提供商来获取和索引压缩 NFT。标准 Solana RPC 端点不支持 DAS。请参阅 RPC 提供商页面了解兼容选项。
  - q: 铸造后如何获取 cNFT 的资产 ID？
    a: 在铸造交易确认后使用 parseLeafFromMintV2Transaction。它从交易中提取包含资产 ID 的叶子模式。
  - q: 为什么会出现"Transaction too large"错误？
    a: 默克尔证明随树深度增长。向 getAssetWithProof 传入 truncateCanopy true，或使用带有地址查找表的版本化交易。
  - q: 我可以将此 SDK 用于 Bubblegum V1 树吗？
    a: 不可以。此 SDK 针对 Bubblegum V2，使用 LeafSchemaV2。V1 树请使用旧版 Bubblegum SDK。
  - q: getAssetWithProof 是什么，为什么需要它？
    a: getAssetWithProof 是一个辅助函数，可以从 DAS API 一次调用中获取叶子变更指令所需的所有参数（证明、根、叶子索引、随机数、元数据）。几乎所有写入指令都需要它。
---

**Bubblegum V2 JavaScript SDK**（`@metaplex-foundation/mpl-bubblegum`）是在 Solana 上创建和管理[压缩 NFT](/zh/smart-contracts/bubblegum-v2) 的推荐 TypeScript/JavaScript 库。基于 [Umi 框架](/zh/dev-tools/umi)构建，它为所有 Bubblegum V2 操作提供类型安全的函数，并自动包含 [DAS API](/zh/smart-contracts/bubblegum-v2/fetch-cnfts) 插件。 {% .lead %}

{% callout title="您将学到的内容" %}
本 SDK 参考文档涵盖：
- 使用 Bubblegum V2 插件设置 Umi
- 创建用于存储 cNFT 的默克尔树
- 铸造、转移、销毁和更新 cNFT
- 委托、冻结和验证创建者
- 使用 DAS API 获取 cNFT
- 处理交易大小限制和常见错误
{% /callout %}

## 概要

**Bubblegum V2 JavaScript SDK** 将所有 MPL-Bubblegum V2 程序指令封装在类型安全的 API 中，并包含用于读取 cNFT 数据的 DAS API 插件。

- 安装：`npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults`
- 使用 `.use(mplBubblegum())` 在 Umi 中注册 — DAS API 插件自动包含
- 在任何写入操作（转移、销毁、更新、委托、冻结、验证）前使用 `getAssetWithProof`
- 适用于 Bubblegum V2（MPL-Bubblegum 5.x）— 与 V1 树不兼容

*由 Metaplex Foundation 维护 · February 2026 最后验证 · 适用于 MPL-Bubblegum 5.x · [在 GitHub 上查看源代码](https://github.com/metaplex-foundation/mpl-bubblegum)*

## 快速入门

**跳转至：** [设置](#umi-setup) · [创建树](#create-a-bubblegum-tree) · [铸造](#mint-a-compressed-nft) · [转移](#transfer-a-compressed-nft) · [销毁](#burn-a-compressed-nft) · [更新](#update-a-compressed-nft) · [委托](#delegate-a-compressed-nft) · [集合](#collections) · [冻结](#freeze-and-thaw) · [验证创建者](#verify-creators) · [获取](#fetching-cnfts) · [错误](#common-errors) · [快速参考](#quick-reference)

1. 安装依赖：`npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults`
2. 使用 `.use(mplBubblegum())` 创建 Umi 实例
3. 使用 `createTree` 创建 Bubblegum 树
4. 使用 `mintV2` 铸造 cNFT；在后续写入操作前使用 `getAssetWithProof`

## 安装

```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-bundle-defaults
```

{% quick-links %}
{% quick-link title="TypeDoc API 参考" target="_blank" icon="JavaScript" href="https://mpl-bubblegum.typedoc.metaplex.com/" description="SDK 的完整生成 API 文档。" /%}
{% quick-link title="npm 包" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-bubblegum" description="npmjs.com 上带版本历史的包。" /%}
{% /quick-links %}

## Umi 设置

`mplBubblegum` 插件将所有 Bubblegum V2 指令和 DAS API 插件注册到您的 Umi 实例中。

```ts {% title="setup.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'
import { keypairIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(keypairIdentity(yourKeypair))
```

{% totem %}
{% totem-accordion title="从文件加载密钥对" %}
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
{% totem-accordion title="浏览器钱包适配器" %}
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

## 创建 Bubblegum 树

`createTree` 在链上分配一个新的[默克尔树](/zh/smart-contracts/bubblegum-v2/concurrent-merkle-trees)并将其注册为 Bubblegum V2 树。树的参数是永久性的 — 创建前请仔细选择。

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
`public: false` 表示只有树创建者（或已批准的树委托人）才能从树中铸造。设置 `public: true` 允许任何人铸造。请参阅[创建树](/zh/smart-contracts/bubblegum-v2/create-trees)了解树大小成本估算。
{% /callout %}

## 铸造压缩 NFT

### 不带集合铸造

`mintV2` 在指定树中创建新的 cNFT 叶子。

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

### 铸造到集合

传入 `coreCollection` 以将 cNFT 与 [MPL-Core 集合](/zh/smart-contracts/bubblegum-v2/collections)关联。集合必须启用 `BubblegumV2` 插件。

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

### 铸造后获取资产 ID

铸造确认后，使用 `parseLeafFromMintV2Transaction` 获取叶子模式（包括资产 ID）。

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

## 转移压缩 NFT

`transferV2` 将 cNFT 的所有权转移到新钱包。`getAssetWithProof` 从 [DAS API](/zh/smart-contracts/bubblegum-v2/fetch-cnfts) 获取所有必需的证明参数。

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

## 销毁压缩 NFT

`burnV2` 永久销毁 cNFT 并从树中移除其叶子。

```ts {% title="burn.ts" %}
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await burnV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity, // owner must sign
}).sendAndConfirm(umi)
```

## 更新压缩 NFT

`updateMetadataV2` 修改 cNFT 的元数据。更新权限取决于 cNFT 是否属于集合 — 请参阅[更新 cNFT](/zh/smart-contracts/bubblegum-v2/update-cnfts) 了解权限规则。

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

## 委托压缩 NFT

[叶子委托人](/zh/smart-contracts/bubblegum-v2/delegate-cnfts)可以代表所有者转移、销毁和冻结 cNFT。委托人在任何转移后重置为新所有者。

### 批准委托人

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

### 撤销委托人

将新委托人设置为所有者自己的地址。

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

## 集合

`setCollectionV2` 设置、更改或移除 cNFT 上的 MPL-Core 集合。详情请参阅[管理集合](/zh/smart-contracts/bubblegum-v2/collections)。

### 设置或更改集合

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

### 移除集合

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

## 冻结与解冻

有两种冻结机制可用。请参阅[冻结 cNFT](/zh/smart-contracts/bubblegum-v2/freeze-cnfts) 了解资产级别与集合级别冻结的完整说明。

### 冻结 cNFT（叶子委托人）

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

### 解冻 cNFT

```ts {% title="thaw.ts" %}
import { getAssetWithProof, thawV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await thawV2(umi, {
  ...assetWithProof,
  leafDelegate: umi.identity, // freeze authority must sign
}).sendAndConfirm(umi)
```

### 创建灵魂绑定 cNFT

灵魂绑定 cNFT 是永久不可转移的。集合必须启用 `PermanentFreezeDelegate` 插件。设置详情请参阅[冻结 cNFT](/zh/smart-contracts/bubblegum-v2/freeze-cnfts#create-a-soulbound-c-nft)。

```ts {% title="soulbound.ts" %}
import { getAssetWithProof, setNonTransferableV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })

await setNonTransferableV2(umi, {
  ...assetWithProof,
  // permanent freeze delegate must sign
}).sendAndConfirm(umi)
```

{% callout type="warning" %}
`setNonTransferableV2` 是不可逆的。调用此函数后，cNFT 无法再次变为可转移状态。
{% /callout %}

## 验证创建者

`verifyCreatorV2` 在创建者条目上设置 `verified` 标志。被验证的创建者必须签署交易。详情请参阅[验证创建者](/zh/smart-contracts/bubblegum-v2/verify-creators)。

### 验证创建者

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

### 取消验证创建者

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

## 获取 cNFT

DAS API 插件由 `mplBubblegum()` 自动注册。请参阅[获取 cNFT](/zh/smart-contracts/bubblegum-v2/fetch-cnfts) 了解可用方法的完整说明。

### 获取单个 cNFT

```ts {% title="fetch-asset.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const asset = await umi.rpc.getAsset(assetId)
console.log('Owner:', asset.ownership.owner)
console.log('Name:', asset.content.metadata.name)
```

### 按所有者获取 cNFT

```ts {% title="fetch-by-owner.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const result = await umi.rpc.getAssetsByOwner({
  owner: publicKey('OwnerAddressHere'),
})
console.log('cNFTs owned:', result.items.length)
```

### 按集合获取 cNFT

```ts {% title="fetch-by-collection.ts" %}
import { publicKey } from '@metaplex-foundation/umi'

const result = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: publicKey('CollectionAddressHere'),
})
console.log('cNFTs in collection:', result.items.length)
```

### 从树和索引推导叶子资产 ID

```ts {% title="find-asset-id.ts" %}
import { findLeafAssetIdPda } from '@metaplex-foundation/mpl-bubblegum'

const [assetId] = await findLeafAssetIdPda(umi, {
  merkleTree: merkleTree.publicKey,
  leafIndex: 0,
})
```

## 交易模式

### 处理"Transaction Too Large"错误

默克尔证明随树深度增长。向 `getAssetWithProof` 传入 `truncateCanopy: true` 可自动移除已缓存在[树冠](/zh/smart-contracts/bubblegum-v2/merkle-tree-canopy)中的证明节点，从而减小交易大小。

```ts {% title="truncate-canopy.ts" %}
import { getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'

// truncateCanopy fetches tree config and removes redundant proof nodes
const assetWithProof = await getAssetWithProof(umi, assetId, { truncateCanopy: true })
```

对于即使截断后证明仍超过交易限制的极深树，请使用[带有地址查找表的版本化交易](/zh/dev-tools/umi/toolbox/address-lookup-table)。

### 发送并确认

```ts {% title="send-and-confirm.ts" %}
const result = await mintV2(umi, { ... }).sendAndConfirm(umi)
console.log('Signature:', result.signature)
```

### 构建但不发送

```ts {% title="build-only.ts" %}
const tx = await mintV2(umi, { ... }).buildAndSign(umi)
// send later: await umi.rpc.sendTransaction(tx)
```

## 常见错误

### `Transaction too large`
默克尔证明超过了 1232 字节的交易限制。在 `getAssetWithProof` 中使用 `{ truncateCanopy: true }`，或实现带有地址查找表的版本化交易。

### `Invalid proof`
证明已过期 — 在获取证明后树被修改了。提交写入交易前始终立即调用 `getAssetWithProof`。

### `Leaf already exists` / `Invalid leaf`
资产 ID 或叶子索引不正确。使用 `findLeafAssetIdPda` 重新推导资产 ID，或通过 `getAssetsByOwner` 重新获取。

### `InvalidAuthority`
您不是此指令的所有者、委托人或所需权限者。验证正确的签名者是否被设置为 `leafOwner` 或 `leafDelegate`。

### `Tree is full`
默克尔树已达到其 `maxDepth` 容量（`2^maxDepth` 个叶子）。创建新树以继续铸造。

### DAS 获取时的 `Account not found`
您的 RPC 提供商可能不支持 Metaplex DAS API。请切换到[兼容的 RPC 提供商](/zh/rpc-providers)。

## 注意事项

- `getAssetWithProof` 在几乎每个写入指令之前都是必需的。始终在提交前立即调用它以避免过期证明错误。
- 通过 DAS 获取的证明如果在获取和提交之间树被修改，可能会过期。高并发场景应在同一原子流中获取和提交。
- `setNonTransferableV2`（灵魂绑定）是不可逆的。一旦设置，无法恢复可转移性。
- 委托权限在任何 `transferV2` 后重置为新所有者。新所有者需要时必须重新委托。
- 此 SDK 针对 Bubblegum V2（`LeafSchemaV2`）。与 Bubblegum V1 树或解压缩工作流不兼容。
- 与 cNFT 一起使用的集合必须启用 `BubblegumV2` 插件。没有此插件的标准 MPL-Core 集合无法使用。

## 快速参考

### Bubblegum V2 函数

| 函数 | 用途 |
|----------|---------|
| `createTree` | 创建新的 Bubblegum V2 默克尔树 |
| `mintV2` | 铸造新的压缩 NFT |
| `transferV2` | 转移 cNFT 所有权 |
| `burnV2` | 永久销毁 cNFT |
| `updateMetadataV2` | 更新 cNFT 元数据（名称、URI、创建者、版税） |
| `delegate` | 批准或撤销叶子委托人 |
| `setTreeDelegate` | 批准或撤销树委托人 |
| `setCollectionV2` | 设置、更改或移除 MPL-Core 集合 |
| `freezeV2` | 冻结 cNFT（需要现有叶子委托人） |
| `thawV2` | 解冻已冻结的 cNFT |
| `delegateAndFreezeV2` | 在单个指令中委托并冻结 |
| `setNonTransferableV2` | 使 cNFT 永久灵魂绑定（不可逆） |
| `verifyCreatorV2` | 在创建者条目上设置 verified 标志 |
| `unverifyCreatorV2` | 从创建者条目中移除 verified 标志 |
| `getAssetWithProof` | 获取写入指令所需的所有证明参数 |
| `findLeafAssetIdPda` | 从树地址和叶子索引推导 cNFT 资产 ID |
| `parseLeafFromMintV2Transaction` | 从铸造交易中提取叶子模式（包括资产 ID） |

### 最小依赖

```json {% title="package.json" %}
{
  "dependencies": {
    "@metaplex-foundation/mpl-bubblegum": "^5.0.0",
    "@metaplex-foundation/umi": "^1.0.0",
    "@metaplex-foundation/umi-bundle-defaults": "^1.0.0"
  }
}
```

### 程序地址

| 程序 | 地址 |
|---------|---------|
| MPL-Bubblegum V2 | `BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY` |
| SPL Account Compression | `cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK` |
| SPL Noop | `noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV` |

### 树大小参考

| 最大深度 | 容量 | 大约成本 |
|-----------|----------|-------------|
| 14 | 16,384 | ~0.34 SOL |
| 17 | 131,072 | ~1.1 SOL |
| 20 | 1,048,576 | ~8.5 SOL |
| 24 | 16,777,216 | ~130 SOL |
| 30 | 1,073,741,824 | ~2,000 SOL |

## 常见问题

### 什么是 Bubblegum V2 JavaScript SDK？

Bubblegum V2 JavaScript SDK（`@metaplex-foundation/mpl-bubblegum`）是用于在 Solana 上创建和管理[压缩 NFT](/zh/smart-contracts/bubblegum-v2) 的 TypeScript 库。基于 [Umi 框架](/zh/dev-tools/umi)构建，它为所有 MPL-Bubblegum V2 程序指令提供类型安全的封装，并自动包含 [DAS API](/zh/smart-contracts/bubblegum-v2/fetch-cnfts) 插件。

### 使用此 SDK 是否需要特殊的 RPC 提供商？

是的。压缩 NFT 需要支持 Metaplex DAS API 的 RPC 提供商来索引和获取 cNFT 数据。标准 Solana RPC 不支持 DAS。请参阅 [RPC 提供商](/zh/rpc-providers)页面了解兼容选项（Helius、Triton、Shyft 等）。

### 铸造后如何获取 cNFT 的资产 ID？

使用带有已确认交易签名的 `parseLeafFromMintV2Transaction`。它解码铸造交易并返回完整的叶子模式，包括 `leaf.id`（资产 ID）和 `leaf.nonce`（叶子索引）。

### 为什么会出现"Transaction too large"错误？

默克尔证明随树深度增长。向 `getAssetWithProof` 传入 `{ truncateCanopy: true }` 可自动移除缓存在链上树冠中的证明节点。对于极深的树，请使用[带有地址查找表的版本化交易](/zh/dev-tools/umi/toolbox/address-lookup-table)。

### 我可以将此 SDK 用于 Bubblegum V1 树吗？

不可以。此 SDK 针对使用 `LeafSchemaV2` 和 V2 默克尔树的 Bubblegum V2。V1 树请使用旧版 Bubblegum SDK。V2 树和 V1 树不能交叉兼容。

### `getAssetWithProof` 是什么，为什么需要它？

`getAssetWithProof` 是一个辅助函数，它在 DAS API 上同时调用 `getAsset` 和 `getAssetProof`，并将响应解析为 Bubblegum V2 写入指令期望的精确参数形态。几乎所有变更指令（转移、销毁、更新、委托、冻结、验证）都需要这些参数。始终在提交前立即调用它以避免过期证明错误。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Umi** | Metaplex 用于构建 Solana 应用程序的框架；处理钱包连接、RPC 和交易构建 |
| **mplBubblegum** | 注册所有 Bubblegum V2 指令和 DAS API 插件的 Umi 插件 |
| **cNFT** | 压缩 NFT — 以链上默克尔树中的哈希叶子存储，而非专用账户 |
| **默克尔树** | 以叶子形式存储哈希 NFT 数据的链上账户；使用 `createTree` 创建 |
| **叶子** | 默克尔树中的单个 cNFT 条目，由其叶子索引标识 |
| **证明** | 能够加密验证叶子属于树的兄弟哈希列表 |
| **树冠** | 存储在链上的默克尔树上层节点缓存，用于减少交易中所需的证明大小 |
| **LeafSchemaV2** | V2 叶子数据结构，包含 id、所有者、委托人、随机数、数据哈希、创建者哈希、集合哈希、资产数据哈希和标志 |
| **getAssetWithProof** | 获取并解析写入指令所需的所有 DAS API 数据的 SDK 辅助函数 |
| **DAS API** | Digital Asset Standard API — 用于索引和获取 cNFT 数据的 RPC 扩展 |
| **TreeConfig** | 从默克尔树地址派生的 PDA，存储 Bubblegum 树配置 |
| **叶子委托人** | 由 cNFT 所有者授权转移、销毁或冻结 cNFT 的账户 |
| **树委托人** | 由树创建者授权从私有树铸造 cNFT 的账户 |
| **灵魂绑定** | 通过 `setNonTransferableV2` 设置的永久不可转移 cNFT — 不可逆 |
