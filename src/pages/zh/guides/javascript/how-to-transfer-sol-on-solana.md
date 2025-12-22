---
title: 如何在 Solana 上发送和转移 SOL
metaTitle: 如何在 Solana 上发送和转移 SOL | 指南
description: 了解如何通过 javascript 在 Solana 区块链上发送和转移 SOL。
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-24-2024'
---

本指南将向您展示如何构建一个 Javascript 函数，使用 Metaplex Umi 客户端包装器和 MPL Toolbox 包在 Solana 区块链上将 SOL 从一个钱包转移到另一个钱包。

## 先决条件

- 您选择的代码编辑器（推荐 Visual Studio Code）
- Node 18.x.x 或更高版本。
- 基本的 Javascript 知识

## 初始设置

### 初始化

首先使用您选择的包管理器（npm、yarn、pnpm、bun）初始化一个新项目（可选），并在提示时填写所需的详细信息。

```js
npm init
```

### 所需包

安装本指南所需的包。

{% packagesUsed packages=["umi", "umiDefaults" ,"toolbox"] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-toolbox
```

### 导入和包装函数

在这里，我们将定义本特定指南所需的所有导入并创建一个包装函数，我们的所有代码都将在其中执行。

```ts
import { mplToolbox, transferSol } from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

// Create the wrapper function
const transfer = async () => {
  ///
  ///
  ///  all our code will go in here
  ///
  ///
}

// run the wrapper function
transfer()
```

## 设置 Umi

此示例将演示如何使用 `generatedSigner()` 设置 Umi。如果您希望以不同的方式设置钱包或签名者，可以查看 [**连接到 Umi**](/zh/umi/connecting-to-umi) 指南。

### 生成新钱包

如果您希望生成新的钱包/私钥进行测试，可以使用 `umi` 生成新的签名者。

```ts
const umi = createUmi("https://api.devnet.solana.com")
  .use(mplToolbox())

// Generate a new keypair signer.
const signer = generateSigner(umi)

// Tell Umi to use the new signer.
umi.use(signerIdentity(signer))

// This will airdrop SOL on devnet only for testing.
await umi.rpc.airdrop(umi.identity.publicKey)
```

### 使用本地存储的现有钱包

```ts
import fs from 'fs';

const umi = createUmi("https://api.devnet.solana.com")
  .use(mplToolbox())

// You will need to use fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync('./keypair.json')

// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Load the keypair into umi.
umi.use(keypairIdentity(keypair));
```

## 转移 Sol

`mpl-toolbox` 包提供了一个名为 `transferSol` 的辅助函数，可创建在区块链上执行转移所需的指令。

```ts
// Here we call the transferSol() function and send it to the chain.

const res = await transferSol(umi, {
  source: umi.identity,
  destination: publicKey('111111111111111111111111111111'),
  amount: sol(1),
}).sendAndConfirm(umi)
```

## 完整代码示例

```ts
import { mplToolbox, transferSol } from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

const transfer = async () => {
  const umi = createUmi("https://api.devnet.solana.com").use(mplToolbox())

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

  // Airdrop 1 SOL to the identity
  // if you end up with a 429 too many requests error, you may have to use
  // the filesystem wallet method or change rpcs.
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  //
  // Transfer SOL
  //

  const res = await transferSol(umi, {
    source: umi.identity,
    destination: publicKey('111111111111111111111111111111'),
    amount: sol(1),
  }).sendAndConfirm(umi)

  // Log the signature of the transaction
  console.log(base58.deserialize(res.signature))
}

transfer()
```
