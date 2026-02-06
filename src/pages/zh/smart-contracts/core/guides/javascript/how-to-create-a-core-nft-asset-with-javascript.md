---
title: 使用Javascript创建Core NFT Asset
metaTitle: 使用Javascript创建Core NFT Asset | Core指南
description: 学习如何使用Metaplex Core JavaScript包在Solana区块链上创建Core NFT Asset。
created: '06-16-2024'
updated: '01-31-2026'
keywords:
  - create NFT JavaScript
  - mpl-core JavaScript
  - mint NFT tutorial
  - Solana NFT JavaScript
about:
  - JavaScript NFT creation
  - Umi framework
  - Step-by-step tutorial
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 设置新的Node.js项目并安装依赖项
  - 使用钱包和RPC端点配置Umi
  - 将图像和元数据上传到去中心化存储
  - 使用create()函数创建Asset
  - 验证Asset已成功创建
howToTools:
  - Node.js
  - Umi框架
  - mpl-core SDK
  - Irys或IPFS（用于存储）
---
本指南将演示如何使用`@metaplex-foundation/mpl-core` Javascript SDK包通过Metaplex Core链上程序创建**Core NFT Asset**。
{% callout title="什么是Core？" %}
**Core**使用单账户设计，与替代方案相比降低了铸造成本并改善了Solana网络负载。它还具有灵活的插件系统，允许开发人员修改资产的行为和功能。
{% /callout %}
但在开始之前，让我们谈谈Asset：
{% callout title="什么是Asset？" %}
与现有的Asset程序（如Solana的Token程序）不同，Metaplex Core和Core NFT Asset（有时称为Core NFT资产）不依赖于多个账户，如关联Token账户。相反，Core NFT Asset将钱包和"mint"账户之间的关系存储在资产本身中。
{% /callout %}
## 前提条件
- 您选择的代码编辑器（推荐**Visual Studio Code**）
- Node **18.x.x**或更高版本。
## 初始设置
本指南将教您如何基于单文件脚本用Javascript创建NFT Core Asset。您可能需要根据需要修改和移动函数。
### 初始化
使用您喜欢的包管理器（npm、yarn、pnpm、bun）初始化新项目（可选），并在提示时输入所需的详细信息。
```js
npm init
```
### 必需的包
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
这里我们定义本指南所需的所有导入，并创建一个包装函数来执行所有代码。
```ts
import { create, mplCore } from '@metaplex-foundation/mpl-core'
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
const createNft = async () => {
  ///
  ///
  ///  所有代码都在这里
  ///
  ///
}
// 运行包装函数
createNft()
```
## 设置Umi
设置Umi时，您可以从各种来源使用或生成密钥对/钱包。您可以创建新钱包进行测试，从文件系统导入现有钱包，或者如果您正在构建网站/dApp，可以使用`walletAdapter`。
**注意**：在此示例中，我们将使用`generatedSigner()`设置Umi，但您可以在下面找到所有可能的设置！
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
// 这将仅在开发网上空投SOL用于测试。
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
// 您需要使用fs并导航文件系统
// 通过相对路径加载您想使用的钱包。
const walletFile = fs.readFileSync('./keypair.json')
// 将您的walletFile转换为密钥对。
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));
// 将密钥对加载到umi中。
umi.use(keypairIdentity(umiSigner));
```
{% /totem-accordion %}
{% totem-accordion title="使用钱包适配器" %}
```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'
const wallet = useWallet()
const umi = createUmi('https://api.devnet.solana.com')
.use(mplCore())
// 将钱包适配器注册到Umi
.use(walletAdapterIdentity(wallet))
```
{% /totem-accordion %}
{% /totem %}
**注意**：`walletAdapter`部分仅提供连接到Umi所需的代码，假设您已经安装并设置了`walletAdapter`。有关完整指南，请参阅[此处](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)
## 创建Asset的元数据
要在钱包或Explorer中显示Asset的可识别图像，我们需要创建存储元数据的URI！
### 上传图像
Umi附带可下载的存储插件，允许您上传到`Arweave`、`NftStorage`、`AWS`和`ShdwDrive`等存储解决方案。在本指南中，我们将使用`irysUploader()`插件将内容存储在Arweave上。
在此示例中，我们将使用本地方法通过Irys上传到Arweave；如果您希望将文件上传到其他存储提供商或从浏览器上传，您需要采取不同的方法。在浏览器场景中导入和使用`fs`将不起作用。
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import fs from 'fs'
import path from 'path'
// 创建Umi并告诉它使用Irys
const umi = createUmi('https://api.devnet.solana.com')
  .use(irysUploader())
// 使用`fs`通过字符串路径读取文件。
// 您需要从计算角度理解路径的概念。
const imageFile = fs.readFileSync(
  path.join(__dirname, '..', '/assets/my-image.jpg')
)
// 使用`createGenericFile`将文件转换为umi可以理解的`GenericFile`类型
// 确保正确设置mimi标签类型
// 否则Arweave将不知道如何显示您的图像。
const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
  tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
})
// 这里我们通过Irys将图像上传到Arweave，并返回一个uri
// 地址，表示文件所在的位置。您可以记录这个，但由于
// 上传器可以接受文件数组，它也返回uri数组。
// 要获取我们想要的uri，我们可以调用数组中的索引[0]。
const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})
console.log(imageUri[0])
```
### 上传元数据
一旦我们有了有效且可用的图像URI，我们就可以开始处理资产的元数据。
可替代代币离链元数据的标准如下。这应该填写并写入Javascript中的对象`{}`或保存到`metadata.json`文件中。
我们将看看JavaScript对象方法。
```ts
const metadata = {
  name: 'My NFT',
  description: 'This is an NFT on Solana',
  image: imageUri[0],
  external_url: 'https://example.com',
  attributes: [
    {
      trait_type: 'trait1',
      value: 'value1',
    },
    {
      trait_type: 'trait2',
      value: 'value2',
    },
  ],
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
| name          | 您的NFT的名称。                                                                                                                                                                           |
| description   | 您的NFT的描述。                                                                                                                                                                           |
| image         | 这将设置为我们之前上传的`imageUri`（或图像的任何在线位置）。                                                                                                                              |
| animation_url | 这将设置为您上传的`animation_url`（或视频/glb的任何在线位置）。                                                                                                                           |
| external_url  | 这将链接到您选择的外部地址。这通常是项目的网站。                                                                                                                                          |
| attributes    | 使用`{trait_type: value, "value": "value1"}`的对象                                                                                                                                        |
| properties    | 包含`files`字段，接受`{uri: string, type: mimeType}`的`[]数组`。还包含category字段，可以设置为`image`、`audio`、`video`、`vfx`和`html`                                                    |
创建元数据后，我们需要将其作为JSON文件上传，以便获得附加到我们Collection的URI。为此，我们将使用Umi的`uploadJson()`函数：
```js
// 调用Umi的`uploadJson()`函数通过Irys将我们的元数据上传到Arweave。
const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```
此函数在上传之前自动将我们的JavaScript对象转换为JSON。
现在我们应该最终在`metadataUri`中存储了JSON文件的URI，前提是它没有抛出任何错误。
### 铸造NFT Core Asset
从这里我们可以使用`@metaplex-foundation/mpl-core`包中的`create`函数来创建我们的Core NFT Asset。
```ts
const asset = generateSigner(umi)
const tx = await create(umi, {
  asset,
  name: 'My NFT',
  uri: metadataUri,
}).sendAndConfirm(umi)
const signature = base58.deserialize(tx.signature)[0]
```
然后记录详细信息如下：
```ts
  // 记录签名和交易以及NFT的链接。
  console.log('\nNFT Created')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('\n')
  console.log('View NFT on Metaplex Explorer')
  console.log(`https://core.metaplex.com/explorer/${nftSigner.publicKey}?env=devnet`)
```
### 附加操作
在继续之前，如果我们想创建已经包含插件和/或外部插件（如`FreezeDelegate`插件或`AppData`外部插件）的资产怎么办？以下是方法。
`create()`指令通过`plugins`字段支持添加常规插件和外部插件。因此，我们可以轻松地添加特定插件所需的所有字段，一切都将由指令处理。
以下是如何操作的示例：
```typescript
const asset = generateSigner(umi)
const tx = await create(umi, {
  asset,
  name: 'My NFT',
  uri: metadataUri,
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
**注意**：如果您不确定使用哪些字段和插件，请参阅[文档](/smart-contracts/core/plugins)！
## 完整代码示例
```ts
import { create } from '@metaplex-foundation/mpl-core'
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
const createNft = async () => {
  //
  // ** 设置Umi **
  //
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
  // 空投1 SOL到身份
  // 如果您遇到429请求过多的错误，您可能需要使用
  // 文件系统钱包方法或更改rpc。
  console.log('Airdropping 1 SOL to identity')
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))
  //
  // ** 上传图像到Arweave **
  //
  // 使用`fs`通过字符串路径读取文件。
  // 您需要从计算角度理解路径的概念。
  const imageFile = fs.readFileSync(
    path.join('./image.png')
  )
  // 使用`createGenericFile`将文件转换为umi可以理解的`GenericFile`类型
  // 确保正确设置mimi标签类型
  // 否则Arweave将不知道如何显示您的图像。
  const umiImageFile = createGenericFile(imageFile, 'image.png', {
    tags: [{ name: 'Content-Type', value: 'image/png' }],
  })
  // 这里我们通过Irys将图像上传到Arweave，并返回一个uri
  // 地址，表示文件所在的位置。您可以记录这个，但由于
  // 上传器可以接受文件数组，它也返回uri数组。
  // 要获取我们想要的uri，我们可以调用数组中的索引[0]。
  console.log('Uploading Image...')
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err)
  })
  console.log('imageUri: ' + imageUri[0])
  //
  // ** 上传元数据到Arweave **
  //
  const metadata = {
    name: 'My NFT',
    description: 'This is an NFT on Solana',
    image: imageUri[0],
    external_url: 'https://example.com',
    attributes: [
      {
        trait_type: 'trait1',
        value: 'value1',
      },
      {
        trait_type: 'trait2',
        value: 'value2',
      },
    ],
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
  // 调用umi的`uploadJson`函数通过Irys将我们的元数据上传到Arweave。
  console.log('Uploading Metadata...')
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err)
  })
  //
  // ** 创建NFT **
  //
  // 我们为NFT生成一个签名者
  const asset = generateSigner(umi)
  console.log('Creating NFT...')
  const tx = await create(umi, {
    asset,
    name: 'My NFT',
    uri: metadataUri,
  }).sendAndConfirm(umi)
  // 最后我们可以反序列化签名，以便在链上检查。
  const signature = base58.deserialize(tx.signature)[0]
  // 记录签名和交易以及NFT的链接。
  console.log('\nNFT Created')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('\n')
  console.log('View NFT on Metaplex Explorer')
  console.log(`https://core.metaplex.com/explorer/${nftSigner.publicKey}?env=devnet`)
}
createNft()
```
