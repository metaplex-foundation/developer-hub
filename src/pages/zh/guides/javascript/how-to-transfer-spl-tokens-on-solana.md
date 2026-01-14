---
title: 如何在 Solana 上发送和转移 SPL 代币
metaTitle: 如何在 Solana 上发送和转移 SPL 代币 | 指南
description: 了解如何使用 Metaplex 包通过 javascript 在 Solana 区块链上发送和转移 SPL 代币。
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-24-2024'
---

本指南将向您展示如何使用 Metaplex Umi 客户端包装器和 MPL Toolbox 包构建 Javascript 函数以在 Solana 区块链上发送和转移 SPL 代币。

对于本指南，您需要在钱包中拥有一些 SPL 代币才能转移，因此如果您的钱包中没有任何代币，您需要让某人向您转移一些，或者您可以按照我们的其他 [如何创建 SPL 代币指南](/zh/guides/javascript/how-to-create-a-solana-token)。

## 先决条件

- 您选择的代码编辑器（推荐 Visual Studio Code）
- Node 18.x.x 或更高版本。

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
import {
  findAssociatedTokenPda,
  mplToolbox,
  transferTokens,
} from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const transferSplTokens = async () => {
  const umi = createUmi("https://api.devnet.solana.com").use(mplToolbox())

  // import a wallet that has the SPL Token you want to transfer
  const walletFile = fs.readFileSync('./keypair.json')

  // Convert your walletFile onto a keypair.
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

  // Load the keypair into umi.
  umi.use(keypairIdentity(keypair))

//
  // Key Accounts
  //

  // The address of the Token you want to transfer.
  const splToken = publicKey("111111111111111111111111111111");

  // The address of the wallet you want to transfer the Token to.
  const destinationWallet = publicKey("22222222222222222222222222222222");

  // Find the associated token account for the SPL Token on the senders wallet.
  const sourceTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: umi.identity.publicKey,
  });

  // Find the associated token account for the SPL Token on the receivers wallet.
  const destinationTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: destinationWallet,
  });

  //
  // Transfer SPL Token
  //

  const res = await transferTokens(umi, {
    source: sourceTokenAccount,
    destination: destinationTokenAccount,
    amount: 10000, // amount of tokens to transfer
  }).sendAndConfirm(umi);

  // Finally we can deserialize the signature that we can check on chain.
  const signature = base58.deserialize(res.signature)[0];

  // Log out the signature and the links to the transaction and the NFT.
  console.log("\nTransfer Complete")
  console.log("View Transaction on SolanaFM");
  console.log(`https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
}

transferSplTokens()
```
