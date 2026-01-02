---
title: 如何在 Solana 上创建 NFT
metaTitle: 如何在 Solana 上创建 NFT | Token Metadata 指南
description: 学习如何使用 Metaplex 在 Solana 区块链上创建 NFT。
# 记得同时更新 /components/guides/index.js 中的日期
created: '06-16-2024'
updated: '06-18-2024'
---

这是关于如何使用 Metaplex Token Metadata 协议在 Solana 区块链上创建 NFT 的入门指南。

## 前提条件

- 您选择的代码编辑器（推荐 Visual Studio Code）
- Node 18.x.x 或更高版本。

## 初始设置

本指南将介绍基于单文件脚本使用 Javascript 创建 NFT。您可能需要修改和移动函数以适应您的需求。

### 初始化

首先使用您选择的包管理器（npm、yarn、pnpm、bun）初始化一个新项目（可选），并在提示时填写所需的详细信息。

```js
npm init
```

### 所需包

安装本指南所需的包。

{% packagesUsed packages=["umi", "umiDefaults" ,"tokenMetadata", "core", "@solana/spl-token"] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

```js
npm i @metaplex-foundation/umi-uploader-irys;
```

### 导入和包装函数

在这里，我们将定义本指南所需的所有导入，并创建一个包装函数，我们所有的代码都将在其中执行。

```ts
import { createProgrammableNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { base58 } from "@metaplex-foundation/umi/serializers";
import fs from "fs";
import path from "path";

// 创建包装函数
const createNft = async () => {
  ///
  ///
  ///  我们所有的代码都将放在这里
  ///
  ///
}

// 运行包装函数
createNft()
```

## 设置 Umi

此示例将介绍使用 `generatedSigner()` 设置 Umi。如果您希望在 React 中尝试此示例，您需要通过 `React - Umi w/ Wallet Adapter` 指南设置 Umi。除了钱包设置之外，本指南将适用于 fileStorage 密钥和钱包适配器。

### 生成新钱包

```ts
const umi = createUmi("https://api.devnet.solana.com")
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // 主网地址: "https://node1.irys.xyz"
      // 开发网地址: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

// 生成新的密钥对签名者。
const signer = generateSigner(umi)

// 告诉 umi 使用新签名者。
umi.use(signerIdentity(signer))

// 这将仅在 devnet 上空投 SOL 用于测试。
await umi.rpc.airdrop(umi.identity.publickey)
```

### 使用现有钱包

```ts
const umi = createUmi("https://api.devnet.solana.com")
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // 主网地址: "https://node1.irys.xyz"
      // 开发网地址: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

// 生成新的密钥对签名者。
const signer = generateSigner(umi)

// 您需要使用 fs 并通过相对路径导航文件系统
// 来加载您希望使用的钱包。
const walletFile = const imageFile = fs.readFileSync(
    path.join(__dirname, './keypair.json')
  )
```

## 创建 NFT

### 上传图像

我们需要做的第一件事是上传代表 NFT 并使其可识别的图像。这可以是 jpeg、png 或 gif 格式。

Umi 带有可下载的存储插件，允许您上传到 Arweave、NftStorage、AWS 和 ShdwDrive 等存储解决方案。在本指南开始时，我们安装了 `irsyUploader()` 插件，该插件将内容存储在 Arweave 区块链上，所以我们将继续使用它。

{% callout title="本地脚本/Node.js" %}
此示例使用本地脚本/node.js 方法，使用 Irys 上传到 Arweave。如果您希望将文件上传到不同的存储提供商或从浏览器上传，您将需要采取不同的方法。在浏览器场景中导入和使用 `fs` 不起作用。
{% /callout %}

```ts
// 使用 `fs` 通过字符串路径读取文件。
// 您需要从计算角度理解路径的概念。

const imageFile = fs.readFileSync(
  path.join(__dirname, '..', '/assets/my-image.jpg')
)

// 使用 `createGenericFile` 将文件转换为 umi 可以理解的 `GenericFile` 类型
// 确保正确设置 mimi 标签类型
// 否则 Arweave 将不知道如何显示您的图像。

const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
  tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
})

// 在这里，我们通过 Irys 将图像上传到 Arweave，并获得返回的 uri
// 文件所在的地址。您可以记录这个，但由于
// 上传器可以接受文件数组，它也返回 uri 数组。
// 要获取我们想要的 uri，我们可以在数组中调用索引 [0]。

const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})

console.log(imageUri[0])
```

### 上传元数据

一旦我们有了有效且可用的图像 URI，我们就可以开始处理 NFT 的元数据。

同质化代币的链下元数据标准如下：

```json
{
  "name": "My NFT",
  "description": "This is an NFT on Solana",
  "image": "https://arweave.net/my-image",
  "external_url": "https://example.com/my-nft.json",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/my-image",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

这里的字段包括

#### name

您的代币名称。

#### symbol

您的代币的简称。例如 Solana 的简称是 `SOL`。

#### description

您的代币的描述。

#### image

这将设置为我们之前上传的 imageUri（或图像的任何在线位置）。

```js
// 调用 umi 的 uploadJson 函数通过 Irys 将我们的元数据上传到 Arweave。


const metadata = {
  "name": "My NFT",
  "description": "This is an NFT on Solana",
  "image": imageUri[0],
  "external_url": "https://example.com/my-nft.json",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": imageUri[0],
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}

const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

现在如果一切顺利，我们应该将 json 文件的 URI 存储在 `metadataUri` 中，前提是它没有抛出任何错误。

### NFT vs pNFT

Token Metadata 程序可以铸造 2 种 NFT，普通 NFT 和 pNFT（可编程非同质化资产）。
这里两种 NFT 的主要区别是一种强制执行版税（pNFT），另一种不强制（NFT）。

#### NFT

- 无版税强制执行
- 初始设置更简单，未来更容易使用。

#### pNFT

- 在未来开发中需要处理更多账户。
- 版税强制执行
- 可编程，我们有规则集可以阻止程序进行转移。

### 铸造 NFT

从这里，您可以选择您希望使用的 NFT 铸造指令类型，`NFT` 或 `pNFT`。

#### NFT

```ts
// 我们为 Nft 生成一个签名者
const nftSigner = generateSigner(umi)

const tx = await createNft(umi, {
  mint: nftSigner,
  sellerFeeBasisPoints: percentAmount(5.5),
  name: 'My NFT',
  uri: metadataUri,
}).sendAndConfirm(umi)

// 最后我们可以反序列化签名，以便我们可以在链上检查。
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

#### pNFT

```ts
// 我们为 NFT 生成一个签名者
const nftSigner = generateSigner(umi)

// 决定 Nft 的规则集。
// Metaplex 规则集 - publicKey("eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9")
// 兼容性规则集 - publicKey("AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5")
const ruleset = null // 或从上面设置一个 publicKey

const tx = await createProgrammableNft(umi, {
  mint: nftSigner,
  sellerFeeBasisPoints: percentAmount(5.5),
  name: 'My NFT',
  uri: metadataUri,
  ruleSet: ruleset,
}).sendAndConfirm(umi)

// 最后我们可以反序列化签名，以便我们可以在链上检查。
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

## 完整代码示例

```js
import { createProgrammableNft } from '@metaplex-foundation/mpl-token-metadata'
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createNft = async () => {
  //
  // ** 设置 Umi **
  //

  const umi = createUmi("https://api.devnet.solana.com")
    .use(mplTokenMetadata())
  .use(
    irysUploader({
      // 主网地址: "https://node1.irys.xyz"
      // 开发网地址: "https://devnet.irys.xyz"
      address: "https://devnet.irys.xyz",
    })
  );

  const signer = generateSigner(umi);

  umi.use(signerIdentity(signer));

  // 向身份空投 1 SOL
  // 如果您遇到 429 too many requests 错误，您可能需要使用
  // 文件系统钱包方法或更改 rpc。
  console.log("向身份空投 1 SOL");
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));

  //
  // ** 上传图像到 Arweave **
  //

  // 使用 `fs` 通过字符串路径读取文件。
  // 您需要从计算角度理解路径的概念。

  const imageFile = fs.readFileSync(
    path.join(__dirname, "../assets/images/0.png")
  );

  // 使用 `createGenericFile` 将文件转换为 umi 可以理解的 `GenericFile` 类型
  // 确保正确设置 mimi 标签类型
  // 否则 Arweave 将不知道如何显示您的图像。

  const umiImageFile = createGenericFile(imageFile, "0.png", {
    tags: [{ name: "Content-Type", value: "image/png" }],
  });

  // 在这里，我们通过 Irys 将图像上传到 Arweave，并获得返回的 uri
  // 文件所在的地址。您可以记录这个，但由于
  // 上传器可以接受文件数组，它也返回 uri 数组。
  // 要获取我们想要的 uri，我们可以在数组中调用索引 [0]。

  console.log("上传图像...");
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err);
  });

  //
  // ** 上传元数据到 Arweave **
  //

  const metadata = {
    name: "My Nft",
    description: "This is an Nft on Solana",
    image: imageUri[0],
    external_url: "https://example.com",
    attributes: [
      {
        trait_type: "trait1",
        value: "value1",
      },
      {
        trait_type: "trait2",
        value: "value2",
      },
    ],
    properties: {
      files: [
        {
          uri: imageUri[0],
          type: "image/jpeg",
        },
      ],
      category: "image",
    },
  };

  // 调用 umi 的 uploadJson 函数通过 Irys 将我们的元数据上传到 Arweave。
  console.log("上传元数据...");
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err);
  });

  //
  // ** 创建 Nft **
  //

  // 我们为 Nft 生成一个签名者
  const nftSigner = generateSigner(umi);

  // 决定 Nft 的规则集。
  // Metaplex 规则集 - publicKey("eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9")
  // 兼容性规则集 - publicKey("AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5")
  const ruleset = null // 或从上面设置一个 publicKey

  console.log("创建 Nft...");
  const tx = await createProgrammableNft(umi, {
    mint: nftSigner,
    sellerFeeBasisPoints: percentAmount(5.5),
    name: metadata.name,
    uri: metadataUri,
    ruleSet: ruleset,
  }).sendAndConfirm(umi);

  // 最后我们可以反序列化签名，以便我们可以在链上检查。
  const signature = base58.deserialize(tx.signature)[0];

  // 记录签名和交易及 NFT 的链接。
  console.log("\npNFT 已创建")
  console.log("在 Solana Explorer 上查看交易");
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log("\n");
  console.log("在 Metaplex Explorer 上查看 NFT");
  console.log(`https://explorer.solana.com/address/${nftSigner.publicKey}?cluster=devnet`);
}

createNft()
```

## 下一步是什么？

本指南帮助您创建了一个基本的 NFT，从这里您可以前往 [Token Metadata 程序](/zh/smart-contracts/token-metadata) 查看创建集合并将您的新 NFT 添加到集合中的内容，以及您可以使用 NFT 执行的各种其他交互。
