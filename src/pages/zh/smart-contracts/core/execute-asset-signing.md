---
title: Execute和Asset签名
metaTitle: Execute和Asset签名 | Core
description: 了解MPL Core Asset如何使用Execute指令来签署指令和交易。
updated: '01-31-2026'
keywords:
  - asset signer
  - execute instruction
  - NFT as signer
  - asset PDA
about:
  - Asset signing
  - Execute instruction
  - Advanced operations
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
  - JavaScript
---
MPL Core Execute指令为MPL Core Asset引入了**Asset Signer**的概念。
这些**Asset Signer**代表Asset本身充当签名者，这使MPL Core Asset能够：
- 转移Solana和SPL代币
- 成为其他账户的authority
- 执行已分配给`assetSignerPda`的其他需要交易/指令/CPI签名的操作和验证
MPL Core Asset能够签署并向区块链提交交易/CPI。这有效地为Core Asset提供了自己的钱包，形式为`assetSigner`。
## Asset Signer PDA
Asset现在可以访问`assetSignerPda`账户/地址，这允许MPL Core程序上的`execute`指令传递发送给它的额外指令，以使用`assetSignerPda`签署CPI指令。
这允许`assetSignerPda`账户代表当前资产所有者有效地拥有和执行账户指令。
您可以将`assetSignerPda`视为附加到Core Asset的钱包。
### findAssetSignerPda()
```ts
const assetId = publickey('11111111111111111111111111111111')
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
```
## Execute指令
### 概述
`execute`指令允许用户传入Core Asset以及一些通过指令，当它到达链上MPL Core程序的`execute`指令时，AssetSigner将签署这些指令。
`execute`指令及其参数的概述。
```ts
const executeIx = await execute(umi, {
    {
        // 通过`fetchAsset()`签署交易的asset
        asset: AssetV1,
        // 通过`fetchCollection()`的collection
        collection?: CollectionV1,
        // TransactionBuilder | Instruction[]
        instructions: ExecuteInput,
        // 交易/指令所需的额外签名者
        signers?: Signer[]
    }
})
```
### 验证
{% callout title="assetSignerPda验证" %}
MPL Core Execute指令将验证**当前Asset所有者**也已签署交易。这确保只有当前Asset所有者可以使用`execute`指令与`assetSignerPda`执行交易。
{% /callout %}
### 控制Execute操作
execute功能可以使用[Freeze Execute插件](/smart-contracts/core/plugins/freeze-execute)进行控制。此插件允许您冻结资产上的execute操作，防止在解冻之前处理任何execute指令。
Freeze Execute插件特别适用于：
- **担保NFT**：在需要时防止提取底层资产
- **无托管协议**：在协议操作期间临时锁定execute功能
- **安全措施**：为可以执行复杂操作的资产添加额外的保护层
当Freeze Execute插件处于活动状态并设置为`frozen: true`时，任何使用execute指令的尝试都将被阻止，直到插件更新为`frozen: false`。
## 示例
### 从Asset Signer转移SOL
在以下示例中，我们将发送到`assetSignerPda`的SOL转移到我们选择的目的地。
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
// 可选 - 如果Asset是收藏品的一部分，获取收藏品对象
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined
// Asset signer账户中有1 SOL余额
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
// 我们希望将SOL转移到的目标账户
const destination = publickey('2222222222222222222222222222222222')
// 标准`transferSol()` transactionBuilder
const transferSolIx = transferSol(umi, {
  // 创建noopSigner，因为assetSigner稍后将在CPI期间签名
  source: createNoopSigner(publicKey(assetSigner)),
  // 目标地址
  destination,
  // 您希望转移的金额
  amount: sol(0.5),
})
// 调用`execute`指令并发送到链上
const res = await execute(umi, {
  // 使用此asset执行指令
  asset,
  // 如果Asset是收藏品的一部分，通过`fetchCollection()`传入收藏品对象
  collection,
  // 要执行的transactionBuilder/instruction[]
  instructions: transferSolIx,
}).sendAndConfirm(umi)
console.log({ res })
```
### 从Asset Signer转移SPL代币
在以下示例中，我们将`assetSignerPda`账户中的部分SPL代币余额转移到目的地。
此示例基于有关基础钱包地址的派生代币账户的最佳实践。如果代币不在基于`assetSignerPda`地址正确派生的代币账户中，则需要调整此示例。
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
// 可选 - 如果Asset是收藏品的一部分，获取收藏品对象
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined
const splTokenMint = publickey('2222222222222222222222222222222222')
// Asset signer有代币余额
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
// 我们希望将SOL转移到的目标钱包
const destinationWallet = publickey('3333333333333333333333333333333')
// 标准`transferTokens()` transactionBuilder
const transferTokensIx = transferTokens(umi, {
  // Source是`assetSignerPda`派生的代币账户
  source: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: assetSignerPda,
  }),
  // Destination是`destinationWallet`派生的代币账户
  destination: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: destinationWallet,
  }),
  // 以lamport为单位的发送金额
  amount: 5000,
})
// 调用`execute`指令并发送到链上
const res = await execute(umi, {
  // 使用此asset执行指令
  asset,
  // 如果Asset是收藏品的一部分，通过`fetchCollection()`传入收藏品对象
  collection,
  // 要执行的transactionBuilder/instruction[]
  instructions: transferTokensIx,
}).sendAndConfirm(umi)
console.log({ res })
```
### 将Asset所有权转移到另一个Asset
在以下示例中，我们将一个Core Asset拥有的另一个Core Asset转移到另一个Asset。
```js
import {
  execute,
  fetchAsset,
  fetchCollection,
  findAssetSignerPda,
  transfer,
} from '@metaplex-foundation/mpl-core'
import { publickey } from '@metaplex-foundation/umi'
// 我们希望转移的Asset
const assetId = publickey('11111111111111111111111111111111')
const asset = await fetchAsset(assetId)
// 可选 - 如果Asset是收藏品的一部分，获取收藏品对象
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined
// 拥有我们要转移的Asset的Asset ID
const sourceAssetId = publickey('2222222222222222222222222222222222')
// 源Asset对象
const sourceAsset = fetchAsset(umi, sourceAssetId)
// Asset signer账户中有1 SOL余额
const sourceAssetSignerPda = findAssetSignerPda(umi, { asset: assetId })
// 我们希望将SOL转移到的目标账户
const destinationAssetId = publickey('33333333333333333333333333333333')
// 我们希望将Asset转移到的目标Asset signer
const destinationAssetSignerPda = findAssetSignerPda(umi, {
  asset: destinationAssetId,
})
const transferAssetIx = transfer(umi, {
  // 通过`fetchAsset()`的Asset对象
  asset,
  // 可选 - 通过`fetchCollection()`的Collection对象
  collection,
  // Asset的新所有者
  newOwner: destinationAssetSignerPda,
}).sendAndConfirm(umi)
const res = await execute(umi, {
  // 使用此asset执行指令
  asset,
  // 如果Asset是收藏品的一部分，通过`fetchCollection()`传入收藏品对象
  collection,
  // 要执行的transactionBuilder/instruction[]
  instructions: transferAssetIx,
}).sendAndConfirm(umi)
console.log({ res })
```
