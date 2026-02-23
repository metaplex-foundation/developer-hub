---
title: 创建您的第一个混合集合
metaTitle: 创建您的第一个混合集合 | Hybrid指南
description: 学习如何端到端创建混合集合！
# remember to update dates also in /components/products/guides/index.js
created: '09-17-2024'
updated: '09-17-2024'
---

本指南将演示如何**端到端创建混合集合**。从如何创建所需的所有资产开始，到如何创建托管并设置所有参数，实现同质化代币与非同质化代币之间的交换！

{% callout title="什么是MPL-Hybrid？" %}

MPL-Hybrid是数字资产、Web3游戏和链上社区的新模式。该模式的核心是一个交换程序，用于将固定数量的同质化资产兑换为非同质化资产，反之亦然。

{% /callout %}

## 前提条件

- 您选择的代码编辑器（推荐**Visual Studio Code**）
- Node **18.x.x**或更高版本。

## 初始设置

本指南将教您如何使用Javascript创建混合集合！您可能需要根据需要修改和调整函数。

### 初始化项目

首先使用您选择的包管理器（npm、yarn、pnpm、bun）初始化一个新项目（可选），并在提示时填写所需的详细信息。

```js
npm init
```

### 所需包

安装本指南所需的包。

{% packagesUsed packages=["umi", "umiDefaults", "core", "@metaplex-foundation/mpl-hybrid", "tokenMetadata" ] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-core
```

```js
npm i @metaplex-foundation/mpl-hybrid
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

## 准备工作

在为MPL-Hybrid程序设置托管（用于促进同质化代币与非同质化代币（NFT）之间的交换）之前，您需要已经铸造了Core NFT集合和同质化代币。

如果您缺少这些先决条件，不用担心！我们将为您提供完成每个步骤所需的所有资源。

**注意**：为了正常工作，托管需要用NFT、同质化代币或两者的组合来资助。在托管中保持平衡的最简单方法是完全填充一种类型的资产，同时分发另一种！

### 创建NFT集合

要使用MPL-Hybrid程序中的元数据随机化功能，链下元数据URI需要遵循一致的递增结构。为此，我们使用Arweave的[路径清单](https://cookbook.arweave.dev/concepts/manifests.html)功能与Turbo SDK结合。

清单允许多个交易链接在单个基础交易ID下，并分配人类可读的文件名，如下所示：
- https://arweave.net/manifestID/0.json
- https://arweave.net/manifestID/1.json
- ...
- https://arweave.net/manifestID/9999.json

如果您不熟悉创建确定性URI，可以按照[本指南](/zh/guides/general/create-deterministic-metadata-with-turbo)获取详细步骤。此外，您可以在此处找到有关创建[集合](/zh/smart-contracts/core/guides/javascript/how-to-create-a-core-collection-with-javascript)和Hybrid程序所需[资产](/zh/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript)的说明。

**注意**：目前，MPL-Hybrid程序在提供的最小和最大URI索引之间随机选择一个数字，不检查URI是否已被使用。因此，交换会受到[生日悖论](https://betterexplained.com/articles/understanding-the-birthday-paradox/)的影响。为了让项目受益于足够的交换随机化，我们建议准备和上传至少25万个可随机选择的资产元数据。可用的潜在资产越多越好！

### 创建同质化代币

MPL-Hybrid托管需要一个关联的同质化代币，可用于赎回或支付NFT的释放。这可以是已经铸造和流通的现有代币，也可以是全新的代币！

如果您不熟悉创建代币，可以按照[本指南](/zh/guides/javascript/how-to-create-a-solana-token)学习如何在Solana上铸造自己的同质化代币。

## 创建托管

**在创建NFT集合和代币后，我们终于准备好创建托管并开始交换了！**

但在深入了解MPL-Hybrid的相关信息之前，最好先了解如何设置Umi实例，因为我们在指南中会多次这样做。

### 设置Umi

在设置Umi时，您可以从不同来源使用或生成密钥对/钱包。您可以创建一个新钱包用于测试，从文件系统导入现有钱包，或者如果您正在创建网站/dApp，可以使用`walletAdapter`。

**注意**：在本示例中，我们将使用`generatedSigner()`设置Umi，但您可以在下面找到所有可能的设置！

{% totem %}

{% totem-accordion title="使用新钱包" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// 这将仅在devnet上空投SOL用于测试。
console.log('Airdropping 1 SOL to identity')
umi.rpc.airdrop(umi.identity.publicKey, sol(1));
```

{% /totem-accordion %}

{% totem-accordion title="使用现有钱包" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')

// 您需要使用fs并浏览文件系统
// 通过相对路径加载您想使用的钱包。
const walletFile = fs.readFileSync('./keypair.json')


// 将您的walletFile转换为密钥对。
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// 将密钥对加载到umi中。
umi.use(keypairIdentity(keypair));
```

{% /totem-accordion %}

{% totem-accordion title="使用钱包适配器" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')
// 将钱包适配器注册到Umi
.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

**注意**：`walletAdapter`部分仅提供连接到Umi所需的代码，假设您已经安装和设置了`walletAdapter`。有关完整指南，请参阅[此处](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)

### 设置参数

设置Umi实例后，下一步是配置MPL-Hybrid托管所需的参数。

我们将首先定义托管合约的通用设置：

```javascript
// 托管设置 - 根据您的需要更改这些
const name = "MPL-404 Hybrid Escrow";
const uri = "https://arweave.net/manifestId";
const max = 15;
const min = 0;
const path = 0;
```

| 参数     | 描述                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| **Name**      | 托管合约的名称（例如，"MPL-404 Hybrid Escrow"）。             |
| **URI**       | NFT集合的基础URI。这应该遵循确定性元数据结构。 |
| **Max & Min** | 这些定义了集合元数据的确定性URI范围。 |
| **Path**      | 在两条路径之间选择：`0`在交换时更新NFT元数据，或`1`在交换后保持元数据不变。 |

接下来，我们配置托管所需的关键账户：

```javascript
// 托管账户 - 根据您的需要更改这些
const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');
const token = publicKey('<YOUR-TOKEN-ADDRESS>');
const feeLocation = publicKey('<YOUR-FEE-ADDRESS>');
const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
]);
```

| 账户           | 描述                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Collection**    | 要交换进/出的集合。这是NFT集合的地址。 |
| **Token**         | 要交换进/出的代币。这是同质化代币的地址。 |
| **Fee Location**  | 交换产生的任何费用将发送到的地址。 |
| **Escrow**        | 派生的托管账户，负责在交换过程中持有NFT和代币。 |

最后，我们定义与代币相关的参数，并创建一个辅助函数`addZeros()`来调整代币数量的小数位：

```javascript
// 代币交换设置 - 根据您的需要更改这些
const tokenDecimals = 6;
const amount = addZeros(100, tokenDecimals);
const feeAmount = addZeros(1, tokenDecimals);
const solFeeAmount = addZeros(0, 9);

// 向数字添加零的函数，用于添加正确数量的小数位
function addZeros(num: number, numZeros: number): number {
  return num * Math.pow(10, numZeros)
}
```

| 参数         | 描述                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Amount**         | 用户在交换期间将收到的代币数量，已调整小数位。 |
| **Fee Amount**     | 用户在交换NFT时将支付的代币费用金额。       |
| **Sol Fee Amount** | 交换NFT时将收取的额外费用（以SOL计），已针对Solana的9位小数进行调整。 |

### 初始化托管

现在我们可以使用`initEscrowV1()`方法初始化托管，传入我们设置的所有参数和变量。这将创建您自己的MPL-Hybrid托管。

```javascript
const initEscrowTx = await initEscrowV1(umi, {
  name,
  uri,
  max,
  min,
  path,
  escrow,
  collection,
  token,
  feeLocation,
  amount,
  feeAmount,
  solFeeAmount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(initEscrowTx.signature)[0]
console.log(`Escrow created! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
```

**注意**：正如我们之前所说，仅仅创建托管不会使其"准备好"进行交换。您需要用NFT或代币（或两者）填充托管。**方法如下**：

{% totem %}

{% totem-accordion title="将资产发送到托管" %}

```javascript
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import {
  MPL_HYBRID_PROGRAM_ID,
  mplHybrid,
} from "@metaplex-foundation/mpl-hybrid";
import { readFileSync } from "fs";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  string,
  publicKey as publicKeySerializer,
} from "@metaplex-foundation/umi/serializers";
import { transfer } from "@metaplex-foundation/mpl-core";

(async () => {
  const collection = publicKey("<COLLECTION>"); // 我们要交换进/出的集合
  const asset = publicKey("<NFT MINT>"); // 您要发送的NFT的铸造地址

  const umi = createUmi("<ENDPOINT>").use(mplHybrid()).use(mplTokenMetadata());

  const wallet = "<path to wallet>"; // 您的文件系统钱包路径
  const secretKey = JSON.parse(readFileSync(wallet, "utf-8"));

  // 从您的私钥创建密钥对
  const keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(secretKey)
  );
  umi.use(keypairIdentity(keypair));

  // 派生托管
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: "variable" }).serialize("escrow"),
    publicKeySerializer().serialize(collection),
  ])[0];

  // 将资产转移到托管
  const transferAssetTx = await transfer(umi, {
    asset,
    collection,
    newOwner: escrow,
  }).sendAndConfirm(umi);
})();

```

{% /totem-accordion %}

{% totem-accordion title="将同质化代币发送到托管" %}

```javascript
import {
  keypairIdentity,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  transferTokens,
} from "@metaplex-foundation/mpl-toolbox";
import {
  MPL_HYBRID_PROGRAM_ID,
  mplHybrid,
} from "@metaplex-foundation/mpl-hybrid";
import { readFileSync } from "fs";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  string,
  publicKey as publicKeySerializer,
} from "@metaplex-foundation/umi/serializers";

(async () => {
  const collection = publicKey("<COLLECTION>"); // 我们要交换进/出的集合
  const token = publicKey("<TOKEN MINT>"); // 我们要交换进/出的代币

  const umi = createUmi("<ENDPOINT>").use(mplHybrid()).use(mplTokenMetadata());

  const wallet = "<path to wallet>"; // 您的文件系统钱包路径
  const secretKey = JSON.parse(readFileSync(wallet, "utf-8"));

  // 从您的私钥创建密钥对
  const keypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(secretKey)
  );
  umi.use(keypairIdentity(keypair));

  // 派生托管
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: "variable" }).serialize("escrow"),
    publicKeySerializer().serialize(collection),
  ])[0];

  // 将同质化代币转移到托管（如果需要，先创建ATA）
  const transferTokenTx = await transactionBuilder()
    .add(
      createTokenIfMissing(umi, {
        mint: token,
        owner: escrow,
      })
    )
    .add(
      transferTokens(umi, {
        source: findAssociatedTokenPda(umi, {
          mint: token,
          owner: umi.identity.publicKey,
        }),
        destination: findAssociatedTokenPda(umi, {
          mint: token,
          owner: escrow,
        }),
        amount: 300000000,
      })
    )
    .sendAndConfirm(umi);
})();

```
{% /totem-accordion %}

{% /totem %}

### 完整代码示例

如果您想简单地复制粘贴创建托管的完整代码，这里就是！

{% totem %}

{% totem-accordion title="完整代码示例" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey, signerIdentity, generateSigner, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, initEscrowV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { string, base58, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'

(async () => {
  /// 步骤1：设置Umi
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  let signer = generateSigner(umi);

  umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

  /// 步骤2：设置托管

  // 托管设置 - 根据您的需要更改这些
  const name = "MPL-404 Hybrid Escrow";                       // 托管的名称
  const uri = "https://arweave.net/manifestId";               // 集合的基础URI
  const max = 15;                                             // 最大URI
  const min = 0;                                              // 最小URI
  const path = 0;                                             // 0：交换时更新Nft，1：交换时不更新Nft

  // 托管账户 - 根据您的需要更改这些
  const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // 我们要交换进/出的集合
  const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // 我们要交换进/出的代币
  const feeLocation = publicKey('<YOUR-FEE-ADDRESS>');        // 费用将发送到的地址
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]);                                                         // 派生的托管账户

  // 代币交换设置 - 根据您的需要更改这些
  const tokenDecimals = 6;                                    // 代币的小数位
  const amount = addZeros(100, tokenDecimals);                // 用户交换时将收到的金额
  const feeAmount = addZeros(1, tokenDecimals);               // 用户交换NFT时支付的费用金额
  const solFeeAmount = addZeros(0, 9);                        // 交换NFT时支付的额外费用（Sol有9位小数）

  /// 步骤3：创建托管
  const initEscrowTx = await initEscrowV1(umi, {
    name,
    uri,
    max,
    min,
    path,
    escrow,
    collection,
    token,
    feeLocation,
    amount,
    feeAmount,
    solFeeAmount,
  }).sendAndConfirm(umi);

  const signature = base58.deserialize(initEscrowTx.signature)[0]
  console.log(`Escrow created! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
})()

// 向数字添加零的函数，用于添加正确数量的小数位
function addZeros(num: number, numZeros: number): number {
  return num * Math.pow(10, numZeros)
}
```

{% /totem-accordion %}

{% /totem %}

## 捕获与释放

### 设置账户

设置Umi后（正如我们在[上一节](#设置umi)中所做的那样），下一步是配置`捕获`和`释放`过程所需的账户。这些账户会让您感到熟悉，因为它们与我们之前使用的类似，而且对于两个指令都是相同的：

```javascript
// 步骤2：托管账户 - 根据您的需要更改这些
const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');
const token = publicKey('<YOUR-TOKEN-ADDRESS>');
const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');
const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
]);
```

**注意**：`feeProjectAccount`与上一个脚本中的`feeLocation`字段相同。

### 选择要捕获/释放的资产

如何选择要捕获和释放的资产取决于您在创建托管时选择的路径：
- **路径0**：如果路径设置为`0`，NFT元数据将在交换期间更新，因此您可以从托管中随机抓取一个资产，因为这无关紧要。
- **路径1**：如果路径设置为`1`，NFT元数据在交换后保持不变，因此您可以让用户选择他们想要交换的特定NFT。

**对于捕获**

如果您正在捕获NFT，以下是如何选择托管拥有的随机资产：

```javascript
// 获取集合中的所有资产
const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
})

// 查找托管拥有的资产
const asset = assetsListByCollection.filter(
    (a) => a.owner === publicKey(escrow)
)[0].publicKey
```

**对于释放**

如果您正在释放NFT，通常由用户选择他们想要释放哪一个。但在本示例中，我们只是选择用户拥有的随机资产：

```javascript
// 获取集合中的所有资产
const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
})

// 通常用户选择要交换什么
const asset = assetsListByCollection.filter(
    (a) => a.owner === umi.identity.publicKey
)[0].publicKey
```

### 捕获（同质化到非同质化）

现在，让我们最终讨论捕获指令。这是您用同质化代币交换NFT的过程（交换所需的代币数量在托管创建时设置）。

```javascript
// 通过交换同质化代币捕获NFT
const captureTx = await captureV1(umi, {
  owner: umi.identity.publicKey,
  escrow,
  asset,
  collection,
  token,
  feeProjectAccount,
  amount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(captureTx.signature)[0];
console.log(`Captured! Check it out: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

### 释放（非同质化到同质化）

释放是捕获的反向操作——在这里您用NFT交换同质化代币：

```javascript
// 释放NFT并接收同质化代币
const releaseTx = await releaseV1(umi, {
  owner: umi.payer,
  escrow,
  asset,
  collection,
  token,
  feeProjectAccount,
}).sendAndConfirm(umi);

const signature = base58.deserialize(releaseTx.signature)[0];
console.log(`Released! Check it out: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
```

### 完整代码示例

以下是`捕获`和`释放`的完整代码

{% totem %}

{% totem-accordion title="捕获" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity, publicKey, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, captureV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { base58, string, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'

(async () => {
  /// 步骤1：设置Umi
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  let signer = generateSigner(umi);

  umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

  // 步骤2：托管账户 - 根据您的需要更改这些
  const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // 我们要交换进/出的集合
  const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // 我们要交换进/出的代币
  const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');  // 费用将发送到的地址
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]);

  // 获取集合中的所有资产
  const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
  })

  // 查找托管拥有的资产
  const asset = assetsListByCollection.filter(
    (a) => a.owner === publicKey(escrow)
  )[0].publicKey

  /// 步骤3："捕获"（从同质化交换到非同质化）资产
  const captureTx = await captureV1(umi, {
    owner: umi.payer,
    escrow,
    asset,
    collection,
    token,
    feeProjectAccount,
  }).sendAndConfirm(umi)
  const signature = base58.deserialize(captureTx.signature)[0]
  console.log(`Captured! https://explorer.solana.com/tx/${signature}?cluster=devnet`)})();
```

{% /totem-accordion %}

{% totem-accordion title="释放" %}

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity, publicKey, sol } from '@metaplex-foundation/umi'
import { mplHybrid, MPL_HYBRID_PROGRAM_ID, releaseV1 } from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { base58, string, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'

import walletFile from "/Users/leo/.config/solana/id.json";

(async () => {
  /// 步骤1：设置Umi
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplHybrid())
    .use(mplTokenMetadata())

  let signer = generateSigner(umi);

  umi.use(signerIdentity(signer)).rpc.airdrop(umi.identity.publicKey, sol(1));

  // 步骤2：托管账户 - 根据您的需要更改这些
  const collection = publicKey('<YOUR-COLLECTION-ADDRESS>');  // 我们要交换进/出的集合
  const token = publicKey('<YOUR-TOKEN-ADDRESS>');            // 我们要交换进/出的代币
  const feeProjectAccount = publicKey('<YOUR-FEE-ADDRESS>');  // 费用将发送到的地址
  const escrow = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
    string({ size: 'variable' }).serialize('escrow'),
    publicKeySerializer().serialize(collection),
  ]);

  // 获取集合中的所有资产
  const assetsListByCollection = await fetchAssetsByCollection(umi, collection, {
    skipDerivePlugins: false,
  })

  // 通常用户选择要交换什么
  const asset = assetsListByCollection.filter(
    (a) => a.owner === umi.identity.publicKey
  )[0].publicKey

  /// 步骤3："捕获"（从同质化交换到非同质化）资产
  const releaseTx = await releaseV1(umi, {
    owner: umi.payer,
    escrow,
    asset,
    collection,
    token,
    feeProjectAccount,
  }).sendAndConfirm(umi)

  const signature = base58.deserialize(releaseTx.signature)[0]
  console.log(`Released! https://explorer.solana.com/tx/${signature}?cluster=devnet`)
})();
```

{% /totem-accordion %}

{% /totem %}
