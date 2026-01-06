---
title: Execute Asset 签名
metaTitle: Execute 和 Asset Signer | Core
description: 了解 MPL Core Assets 如何使用 Execute 指令来签名指令和交易。
---

MPL Core Execute 指令为 MPL Core Assets 引入了 **Asset Signers** 的概念。

这些 **Asset Signers** 代表 Asset 本身充当签名者，这解锁了 MPL Core Assets 的以下能力：

- 转出 Solana 和 SPL 代币。
- 成为其他账户的权限。
- 执行其他已分配给 `assetSignerPda` 的需要交易/指令/CPI 签名的操作和验证。

MPL Core Assets 有能力签名并提交交易/CPI 到区块链。这实际上以 `assetSigner` 的形式为 Core Asset 提供了自己的钱包。

## Asset Signer PDA

Assets 现在能够访问 `assetSignerPda` 账户/地址，这允许 MPL Core 程序上的 `execute` 指令传递发送给它的额外指令，以使用 `assetSignerPda` 签署 CPI 指令。

这允许 `assetSignerPda` 账户有效地代表当前资产所有者拥有和执行账户指令。

您可以将 `assetSignerPda` 视为附加到 Core Asset 的钱包。

### findAssetSignerPda()

```ts
const assetId = publickey('11111111111111111111111111111111')

const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
```

## Execute 指令

### 概述

`execute` 指令允许用户传入 Core Asset 以及一些透传指令，这些指令在链上命中 MPL Core 程序的 `execute` 指令时将由 AssetSigner 签名。

`execute` 指令及其参数概述：

```ts
const executeIx = await execute(umi, {
    {
        // 通过 `fetchAsset()` 获取的签署交易的 asset。
        asset: AssetV1,
        // 通过 `fetchCollection()` 获取的 collection
        collection?: CollectionV1,
        // TransactionBuilder 或 Instruction[]
        instructions: ExecuteInput,
        // 交易/指令所需的额外签名者。
        signers?: Signer[]
    }
})
```

### 验证

{% callout title="assetSignerPda 验证" %}
MPL Core Execute 指令将验证**当前 Asset 所有者**是否也签署了交易。这确保只有当前 Asset 所有者才能在使用 `assetSignerPda` 和 `execute` 指令时执行交易。
{% /callout %}

### 控制 Execute 操作

execute 功能可以使用 [Freeze Execute 插件](/zh/smart-contracts/core/plugins/freeze-execute)来控制。此插件允许您冻结资产上的 execute 操作，防止任何 execute 指令被处理，直到解冻为止。

Freeze Execute 插件特别适用于：

- **支持型 NFT**：在需要时防止提取底层资产
- **无托管协议**：在协议操作期间临时锁定 execute 功能
- **安全措施**：为可以执行复杂操作的资产添加额外的保护层

当 Freeze Execute 插件处于活动状态且设置为 `frozen: true` 时，任何使用 execute 指令的尝试都将被阻止，直到插件更新为 `frozen: false`。

## 示例

### 从 Asset Signer 转移 SOL

在以下示例中，我们将已发送到 `assetSignerPda` 的 SOL 转移到我们选择的目的地。

```js
import {
  execute,
  findAssetSignerPda,
  fetchAsset,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { publickey, createNoopSigner, sol } from '@metaplex-foundation/umi'

const assetId = publickey('11111111111111111111111111111111')

const asset = await fetchAsset(umi, assetId)

// 可选 - 如果 Asset 是集合的一部分，则获取 collection 对象
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

// Asset signer 账户中有 1 SOL 余额。
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// 我们希望将 SOL 转移到的目标账户。
const destination = publickey('2222222222222222222222222222222222')

// 标准的 `transferSol()` transactionBuilder。
const transferSolIx = transferSol(umi, {
  // 创建一个 noopSigner，因为 assetSigner 将在 CPI 期间稍后签名
  source: createNoopSigner(publicKey(assetSigner)),
  // 目标地址
  destination,
  // 您希望转移的金额
  amount: sol(0.5),
})

// 调用 `execute` 指令并发送到链上。
const res = await execute(umi, {
  // 使用此 asset 执行指令
  asset,
  // 如果 Asset 是集合的一部分，通过 `fetchCollection()` 传入 collection 对象
  collection,
  // 要执行的 transactionBuilder/instruction[]
  instructions: transferSolIx,
}).sendAndConfirm(umi)

console.log({ res })
```

### 从 Asset Signer 转移 SPL 代币

在以下示例中，我们将 `assetSignerPda` 账户中的一些 SPL 代币余额转移到目的地。

此示例基于派生代币账户相对于基础钱包地址的最佳实践。如果代币不在基于 `assetSignerPda` 地址正确派生的代币账户中，则此示例需要调整。

```js
import {
  execute,
  findAssetSignerPda,
  fetchAsset,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'
import {
  transferTokens,
  findAssociatedTokenPda,
} from '@metaplex-foundation/mpl-toolbox'
import { publickey } from '@metaplex-foundation/umi'

const assetId = publickey('11111111111111111111111111111111')

const asset = await fetchAsset(umi, assetId)

// 可选 - 如果 Asset 是集合的一部分，则获取 collection 对象
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

const splTokenMint = publickey('2222222222222222222222222222222222')

// Asset signer 有代币余额。
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// 我们希望将 SOL 转移到的目标钱包。
const destinationWallet = publickey('3333333333333333333333333333333')

// 标准的 `transferTokens()` transactionBuilder。
const transferTokensIx = transferTokens(umi, {
  // 源是 `assetSignerPda` 派生的代币账户
  source: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: assetSignerPda,
  }),
  // 目的地是 `destinationWallet` 派生的代币账户
  destination: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: destinationWallet,
  }),
  // 以 lamports 为单位发送的金额。
  amount: 5000,
})

// 调用 `execute` 指令并发送到链上。
const res = await execute(umi, {
  // 使用此 asset 执行指令
  asset,
  // 如果 Asset 是集合的一部分，通过 `fetchCollection()` 传入 collection 对象
  collection,
  // 要执行的 transactionBuilder/instruction[]
  instructions: transferTokensIx,
}).sendAndConfirm(umi)

console.log({ res })
```

### 将 Asset 的所有权转移给另一个 Asset

在以下示例中，我们将一个由另一个 Core Asset 拥有的 Core Asset 转移给另一个。

```js
import {
  execute,
  fetchAsset,
  fetchCollection,
  findAssetSignerPda,
  transfer,
} from '@metaplex-foundation/mpl-core'
import { publickey } from '@metaplex-foundation/umi'

// 我们希望转移的 Asset。
const assetId = publickey('11111111111111111111111111111111')
const asset = await fetchAsset(assetId)

// 可选 - 如果 Asset 是集合的一部分，则获取 collection 对象
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

// 拥有我们希望转移的 Asset 的 Asset ID。
const sourceAssetId = publickey('2222222222222222222222222222222222')
// 源 Asset 对象。
const sourceAsset = fetchAsset(umi, sourceAssetId)
// Asset signer 账户中有 1 SOL 余额。
const sourceAssetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// 我们希望将 SOL 转移到的目标账户。
const destinationAssetId = publickey('33333333333333333333333333333333')
// 我们希望将 Asset 转移到的目标 Asset signer。
const destinationAssetSignerPda = findAssetSignerPda(umi, {
  asset: destinationAssetId,
})

const transferAssetIx = transfer(umi, {
  // 通过 `fetchAsset()` 获取的 Asset 对象。
  asset,
  // 可选 - 通过 `fetchCollection()` 获取的 Collection 对象
  collection,
  // Asset 的新所有者。
  newOwner: destinationAssetSignerPda,
}).sendAndConfirm(umi)

const res = await execute(umi, {
  // 使用此 asset 执行指令
  asset,
  // 如果 Asset 是集合的一部分，通过 `fetchCollection()` 传入 collection 对象
  collection,
  // 要执行的 transactionBuilder/instruction[]
  instructions: transferAssetIx,
}).sendAndConfirm(umi)

console.log({ res })
```
