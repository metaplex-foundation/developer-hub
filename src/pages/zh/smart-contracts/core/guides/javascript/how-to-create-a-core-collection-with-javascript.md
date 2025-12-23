---
title: 如何使用 Javascript 创建 Core Collection
metaTitle: 如何使用 Javascript 创建 Core Collection | Core 指南
description: 学习如何使用 Metaplex Core javascript 包在 Solana 上创建 Core Collection。
created: '08-21-2024'
updated: '08-21-2024'
---

本指南将演示使用 `@metaplex-foundation/mpl-core` Javascript SDK 包来使用 Metaplex Core 链上程序创建 **Core Collection**。

{% callout title="什么是 Core？" %}

**Core** 使用单账户设计，与其他方案相比降低了铸造成本并改善了 Solana 网络负载。它还具有灵活的插件系统，允许开发者修改资产的行为和功能。

{% /callout %}

在开始之前，让我们先谈谈 Collections：

{% callout title="什么是 Collections？" %}

Collections 是一组属于同一系列或群组的 Assets。为了将 Assets 分组在一起，我们必须首先创建一个 Collection Asset，其目的是存储与该集合相关的任何元数据，如集合名称和集合图片。Collection Asset 作为您集合的封面，还可以存储集合范围的插件。

{% /callout %}

## 前提条件

- 您选择的代码编辑器（推荐 **Visual Studio Code**）
- Node **18.x.x** 或更高版本。

## 初始设置

本指南将教您如何基于单文件脚本使用 Javascript 创建 Core Collection。您可能需要根据需要修改和移动函数。

### 初始化项目

首先使用您选择的包管理器（npm、yarn、pnpm、bun）初始化一个新项目（可选），并在提示时填写所需的详细信息。

```js
npm init
```

### 所需包

安装本指南所需的包。

{% packagesUsed packages=["umi", "umiDefaults", "core", "@metaplex-foundation/umi-uploader-irys"] type="npm" /%}

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
npm i @metaplex-foundation/umi-uploader-irys;
```

### 导入和包装函数

这里我们将定义本指南所需的所有导入，并创建一个包装函数，我们所有的代码将在其中执行。

```ts
import {
  createCollection,
  mplCore
} from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

// 创建包装函数
const createCollection = async () => {
  ///
  ///
  ///  我们所有的代码都将放在这里
  ///
  ///
}

// 运行包装函数
createCollection()
```

## 设置 Umi

在设置 Umi 时，您可以使用或从不同来源生成密钥对/钱包。您可以创建一个新钱包用于测试，从文件系统导入现有钱包，或者如果您正在创建网站/dApp，则使用 `walletAdapter`。

**注意**：对于此示例，我们将使用 `generatedSigner()` 设置 Umi，但您可以在下面找到所有可能的设置！

{% totem %}

{% totem-accordion title="使用新钱包" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
  .use(
    irysUploader({
      // 主网地址："https://node1.irys.xyz"
      // 开发网地址："https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// 这将仅在开发网上空投 SOL 用于测试。
console.log('Airdropping 1 SOL to identity')
await umi.rpc.airdrop(umi.identity.publickey)
```

{% /totem-accordion %}

{% totem-accordion title="使用现有钱包" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
    .use(
    irysUploader({
      // 主网地址："https://node1.irys.xyz"
      // 开发网地址："https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

// 生成新的密钥对签名者。
const signer = generateSigner(umi)

// 您需要使用 fs 并通过相对路径导航文件系统
// 来加载您希望使用的钱包。
const walletFile = fs.readFileSync('./keypair.json')


// 将您的 walletFile 转换为密钥对。
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// 将密钥对加载到 umi 中。
umi.use(keypairIdentity(umiSigner));
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

**注意**：`walletAdapter` 部分仅提供将其连接到 Umi 所需的代码，假设您已经安装并设置了 `walletAdapter`。有关完整指南，请参阅[此处](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)

## 为 Collection 创建元数据

要在钱包或浏览器中为您的 Collection 显示可识别的图像，我们需要创建可以存储元数据的 URI！

### 上传图像

Umi 带有可下载的存储插件，允许您上传到 `Arweave`、`NftStorage`、`AWS` 和 `ShdwDrive` 等存储解决方案。对于本指南，我们将使用将内容存储在 Arweave 上的 `irysUploader()` 插件。

在此示例中，我们将使用 Irys 本地方法上传到 Arweave；如果您希望将文件上传到不同的存储提供商或从浏览器上传，您需要采取不同的方法。在浏览器场景中导入和使用 `fs` 将不起作用。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import fs from 'fs'
import path from 'path'

// 创建 Umi 并告诉它使用 Irys
const umi = createUmi('https://api.devnet.solana.com')
  .use(irysUploader())

// 使用 `fs` 通过字符串路径读取文件。
// 您需要从计算角度理解路径的概念。
const imageFile = fs.readFileSync(
  path.join(__dirname, '..', '/assets/my-image.jpg')
)

// 使用 `createGenericFile` 将文件转换为 umi 可以理解的 `GenericFile` 类型
// 确保正确设置 mime 标签类型，否则 Arweave 将不知道如何显示您的图像。
const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
  tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
})

// 这里我们通过 Irys 将图像上传到 Arweave，我们得到返回的
// 文件所在位置的 uri 地址。您可以记录这个，但由于
// uploader 可以接受文件数组，它也返回 uri 数组。
// 要获取我们想要的 uri，我们可以调用数组中的索引 [0]。
const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})

console.log(imageUri[0])
```

### 上传元数据

一旦我们有了有效且可用的图像 URI，我们就可以开始处理集合的元数据。

非同质化代币的链下元数据标准如下。这应该填写并写入 Javascript 之外的对象 `{}` 或保存到 `metadata.json` 文件。
我们将看看 JavaScript 对象方法。

```ts
const metadata = {
  name: 'My Collection',
  description: 'This is a Collection on Solana',
  image: imageUri[0],
  external_url: 'https://example.com',
  properties: {
    files: [
      {
        uri: imageUri[0],
        type: 'image/jpeg',
      },
    ],
    category: 'image',
  },
}
```

这里的字段包括：

| 字段          | 描述                                                                                                                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | 您的 Collection 的名称。                                                                                                                                                                  |
| description   | 您的 Collection 的描述。                                                                                                                                                                  |
| image         | 这将设置为我们之前上传的 `imageUri`（或任何图像的在线位置）。                                                                                                                             |
| animation_url | 这将设置为您上传的 `animation_url`（或任何视频/glb 的在线位置）。                                                                                                                         |
| external_url  | 这将链接到您选择的外部地址。这通常是项目的网站。                                                                                                                                          |
| image         | 这将设置为我们之前上传的 `imageUri`（或任何图像的在线位置）。                                                                                                                             |
| properties    | 包含接受 `{uri: string, type: mimeType}` 的 `[] 数组` 的 `files` 字段。还包含可以设置为 `image`、`audio`、`video`、`vfx` 和 `html` 的 category 字段                                       |

创建元数据后，我们需要将其作为 JSON 文件上传，以便获取附加到 Collection 的 URI。为此，我们将使用 Umi 的 `uploadJson()` 函数：

```js
// 调用 Umi 的 `uploadJson()` 函数通过 Irys 将我们的元数据上传到 Arweave。
const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

此函数在上传前自动将我们的 JavaScript 对象转换为 JSON。

现在我们应该最终得到存储在 `metadataUri` 中的 JSON 文件的 URI，前提是它没有抛出任何错误。

### 铸造 Core Collection

从这里我们可以使用 `@metaplex-foundation/mpl-core` 包中的 `createCollection` 函数来创建我们的 Core NFT Asset。

```ts
const collection = generateSigner(umi)

const tx = await createCollection(umi, {
  collection,
  name: 'My Collection',
  uri: metadataUri,
}).sendAndConfirm(umi)

const signature = base58.deserialize(tx.signature)[0]
```

并按如下方式记录详情：

```ts
// 记录签名以及交易和 NFT 的链接。
console.log('\nCollection Created')
console.log('View Transaction on Solana Explorer')
console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
console.log('\n')
console.log('View Collection on Metaplex Explorer')
console.log(`https://core.metaplex.com/explorer/${collection.publicKey}?env=devnet`)
```

### 附加操作

在继续之前，如果我们想创建已包含插件和/或外部插件（如 `FreezeDelegate` 插件或 `AppData` 外部插件）的集合怎么办？以下是我们如何做到的。

`createCollection()` 指令支持通过 `plugins` 字段添加普通插件和外部插件。所以我们可以轻松添加特定插件所需的所有字段，一切都将由指令处理。

以下是如何操作的示例：

```typescript
const collection = generateSigner(umi)

const tx = await createCollection(umi, {
  collection: collection,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  plugins: [
    {
      type: "PermanentFreezeDelegate",
      frozen: true,
      authority: { type: "UpdateAuthority"}
    },
    {
      type: "AppData",
      dataAuthority: { type: "UpdateAuthority"},
      schema: ExternalPluginAdapterSchema.Binary,
    }
  ]
}).sendAndConfirm(umi)

const signature = base58.deserialize(tx.signature)[0]
```

**注意**：如果您不确定使用什么字段和插件，请参考[文档](/zh/smart-contracts/core/plugins)！

## 完整代码示例

```ts
import {
  createCollection,
  mplCore,
} from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createCollection = async () => {
  //
  // ** 设置 Umi **
  //

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplCore())
    .use(irysUploader({address: 'https://devnet.irys.xyz'}))

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))


  console.log('Airdropping 1 SOL to identity')
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  //
  // ** 上传图像到 Arweave **
  //

  const imageFile = fs.readFileSync(
    path.join(__dirname, '..', '/assets/my-image.jpg')
  )

  const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
    tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
  })

  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err)
  })

  console.log('imageUri: ' + imageUri[0])

  //
  // ** 上传元数据到 Arweave **
  //

  const metadata = {
    name: 'My Collection',
    description: 'This is a Collection on Solana',
    image: imageUri[0],
    external_url: 'https://example.com',
    properties: {
      files: [
        {
          uri: imageUri[0],
          type: 'image/jpeg',
        },
      ],
      category: 'image',
    },
  }

  console.log('Uploading Metadata...')
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err)
  })

  //
  // ** 创建 Collection **
  //

  const collection = generateSigner(umi)

  console.log('Creating Collection...')
  const tx = await createCollection(umi, {
    collection,
    name: 'My Collection',
    uri: metadataUri,
  }).sendAndConfirm(umi)

  const signature = base58.deserialize(tx.signature)[0]

  console.log('\Collection Created')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('\n')
  console.log('View NFT on Metaplex Explorer')
  console.log(`https://core.metaplex.com/explorer/${nftSigner.publicKey}?env=devnet`)
}

createCollection()
```
