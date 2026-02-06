---
title: 序列化、反序列化和发送交易
metaTitle: Umi - 序列化、反序列化和发送交易
description: 学习如何在使用 Metaplex Umi 客户端时序列化和反序列化交易，以便在不同环境之间移动它们。
created: '08-15-2024'
updated: '08-15-2024'
---

**在本指南中，我们将讨论：**

- 序列化和反序列化交易
- Noop 签名者
- 部分签名的交易
- 在不同环境之间传递交易

## 简介

交易通常被序列化以便于在不同环境之间移动。但原因可能不同：

- 您可能需要来自存储在不同环境中的不同授权者的签名。
- 您可能希望在前端创建交易，然后在后端发送和验证它，然后再将其存储到数据库。

例如，在创建 NFT 时，您可能需要使用 `collectionAuthority` 密钥对签署交易以授权 NFT 进入集合。为了安全签名而不暴露您的密钥对，您可以首先在后端创建交易，使用 `collectionAuthority` 部分签署交易而无需在不安全的环境中暴露密钥对，序列化交易然后发送它。然后您可以安全地反序列化交易并使用 `Buyer` 钱包签名。

**注意**：使用 Candy Machine 时，您不需要 `collectionAuthority` 签名

## 初始设置

### 必需的包和导入

我们将使用以下包：

{% packagesUsed packages=["umi", "umiDefaults", "core"] type="npm" /%}

要安装它们，请使用以下命令：

```
npm i @metaplex-foundation/umi
```

```
npm i @metaplex-foundation/umi-bundle-defaults
```

```
npm i @metaplex-foundation/mpl-core
```

以下是本指南将使用的所有导入。

```ts
import { generateSigner, signerIdentity, createNoopSigner } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { fetchCollection, create, mplCore } from '@metaplex-foundation/mpl-core'
import { base64 } from '@metaplex-foundation/umi/serializers';
```

## 设置 Umi

在设置 Umi 时，您可以使用或生成来自不同来源的密钥对/钱包。您可以创建一个新钱包进行测试，从文件系统导入现有钱包，或者如果您正在创建网站/dApp，则使用 `walletAdapter`。

{% totem %}

{% totem-accordion title="使用新钱包" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// 生成新的密钥对签名者。
const signer = generateSigner(umi)

// 告诉 Umi 使用新签名者。
umi.use(signerIdentity(signer))
```

{% /totem-accordion %}

{% totem-accordion title="使用现有钱包" %}

```ts
import * as fs from "fs";
import * as path from "path";

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// 使用 fs 导航文件系统，直到通过相对路径
// 到达您希望使用的钱包。
const walletFile = fs.readFileSync(
  path.join(__dirname, './keypair.json')
)

// 通常密钥对保存为 Uint8Array，因此您
// 需要将其转换为可用的密钥对。
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// 在 Umi 使用此密钥对之前，您需要
// 用它生成一个 Signer 类型。
const signer = createSignerFromKeypair(umi, keyair);

// 告诉 Umi 使用新签名者。
umi.use(signerIdentity(walletFile))
```

{% /totem-accordion %}

{% totem-accordion title="使用 Wallet Adapter" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')
.use(mplCore())
// 将 Wallet Adapter 注册到 Umi
.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

## 序列化

交易的序列化是将交易对象转换为一系列字节或字符串的过程，以便以易于传输的形式保存交易的状态。这允许它通过 http 请求等方式传递。

在序列化示例中，我们将：

- 使用 `NoopSigner` 将 `Payer` 作为 `Signer` 添加到指令中
- 创建一个版本化交易并使用 `collectionAuthority` 和 `Asset` 签名
- 序列化它，以便保留所有详细信息，前端可以准确重建
- 并将其作为字符串而不是 u8 发送，以便可以通过请求传递

### Noop 签名者

部分签名交易然后序列化它们，只有因为 `NoopSigner` 才成为可能。

Umi 指令可以默认接受 `Signer` 类型，这些类型通常从本地密钥对文件或 `walletAdapter` 签名者生成。有时您可能无法访问某个签名者，需要在稍后的时间点使用该签名者签名。这就是 Noop 签名者发挥作用的地方。

**Noop 签名者** 接受一个公钥并生成一个特殊的 `Signer` 类型，允许 Umi 构建指令而无需 Noop 签名者在当前时间点存在或签署交易。

使用 *Noop 签名者* 构建的指令和交易将期望它们在发送交易到链之前的某个时间点签名，如果不存在将导致"缺少签名"错误。

使用方法是：

```ts
createNoopSigner(publickey('11111111111111111111111111111111'))
```

### 使用字符串而不是二进制数据

在环境之间传递序列化交易之前将其转换为字符串的决定源于：

- Base64 等格式被普遍认可，可以安全地通过 HTTP 传输而不会有数据损坏或误解的风险。
- 使用字符串符合 Web 通信的标准做法。大多数 API 和 Web 服务期望 JSON 或其他基于字符串的格式的数据

方法是使用 `@metaplex-foundation/umi/serializers` 包中的 `base64` 函数。

**注意**：您不需要安装该包，因为它已包含在 `@metaplex-foundation/umi` 包中

```ts
// 使用 base64.deserialize 并传入序列化的交易
const serializedTxAsString = base64.deserialize(serializedTx)[0];

// 使用 base64.serialize 并传入序列化的交易字符串
const deserializedTxAsU8 = base64.serialize(serializedTxAsString);
```

### 代码示例

```ts
// 使用集合授权密钥对
const collectionAuthority = generateSigner(umi)
umi.use(signerIdentity(collectionAuthority))

// 创建一个 noop 签名者，允许您稍后签名
const frontendPubkey = publickey('11111111111111111111111111111111')
const frontEndSigner = createNoopSigner(frontendPubkey)

// 创建资产密钥对
const asset = generateSigner(umi);

// 获取集合
const collection = await fetchCollection(umi, publickey(`11111111111111111111111111111111`));

// 创建 createAssetIx
const createAssetTx = await create(umi, {
  asset: asset,
  collection: collection,
  authority: collectionAuthority,
  payer: frontEndSigner,
  owner: frontendPubkey,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
})
  .useV0()
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi);

// 序列化交易
const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)

// 将 Uint8Array 编码为字符串并将交易返回给前端
const serializedCreateAssetTxAsString = base64.deserialize(serializedCreateAssetTx)[0];

return serializedCreateAssetTxAsString
```

## 反序列化

在反序列化示例中，我们将：

- 将通过请求收到的交易转换回 Uint8Array
- 反序列化它，以便我们可以从离开的地方继续操作
- 使用 `Payer` 密钥对签名，因为我们在另一个环境中通过 `NoopSigner` 使用了它
- 发送它

### 代码示例

```ts
// 将字符串解码为 Uint8Array 使其可用
const deserializedCreateAssetTxAsU8 = base64.serialize(serializedCreateAssetTxAsString);

// 反序列化后端返回的交易
const deserializedCreateAssetTx = umi.transactions.deserialize(deserializedCreateAssetTxAsU8)

// 使用从 walletAdapter 获取的密钥对签署交易
const signedDeserializedCreateAssetTx = await umi.identity.signTransaction(deserializedCreateAssetTx)

// 发送交易
await umi.rpc.sendTransaction(signedDeserializedCreateAssetTx)
```

## 完整代码示例

当然，要获得完全可重现的指令实际操作示例，我们需要包含额外的步骤，例如处理前端签名者和创建集合。

如果一切不完全相同，请不要担心；后端和前端部分保持一致。

```ts
import { generateSigner, createSignerFromKeypair, signerIdentity, sol, createNoopSigner, transactionBuilder } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createCollection, create, fetchCollection } from '@metaplex-foundation/mpl-core'

const umi = createUmi("https://api.devnet.solana.com", "finalized")

const collectionAuthority = generateSigner(umi);
umi.use(signerIdentity(collectionAuthority));

const frontEndSigner = generateSigner(umi);

(async () => {

  // 向钱包空投代币
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));
  await umi.rpc.airdrop(frontEndSigner.publicKey, sol(1));

  // 生成集合密钥对
  const collectionAddress = generateSigner(umi)
  console.log("\nCollection Address: ", collectionAddress.publicKey.toString())

  // 生成集合
  let createCollectionTx = await createCollection(umi, {
    collection: collectionAddress,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
  }).sendAndConfirm(umi)

  const createCollectionSignature = base58.deserialize(createCollectionTx.signature)[0]
  console.log(`\nCollection Created: https://solana.fm/tx/${createCollectionSignature}?cluster=devnet-alpha`);

  // 序列化

  const asset = generateSigner(umi);
  console.log("\nAsset Address: ", asset.publicKey.toString());

  const collection = await fetchCollection(umi, collectionAddress.publicKey);

  let createAssetIx = await create(umi, {
    asset: asset,
    collection: collection,
    authority: collectionAuthority,
    payer: createNoopSigner(frontEndSigner.publicKey),
    owner: frontEndSigner.publicKey,
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
  })
    .useV0()
    .setBlockhash(await umi.rpc.getLatestBlockhash())
    .buildAndSign(umi);


  const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)
  const serializedCreateAssetTxAsString = base64.deserialize(serializedCreateAssetTx)[0];

  // 反序列化

  const deserializedCreateAssetTxAsU8 = base64.serialize(serializedCreateAssetTxAsString);
  const deserializedCreateAssetTx = umi.transactions.deserialize(deserializedCreateAssetTxAsU8)
  const signedDeserializedCreateAssetTx = await frontEndSigner.signTransaction(deserializedCreateAssetTx)

  const createAssetSignature = base58.deserialize(await umi.rpc.sendTransaction(signedDeserializedCreateAssetTx))[0]
  console.log(`\nAsset Created: https://solana.fm/tx/${createAssetSignature}}?cluster=devnet-alpha`);
})();
```
