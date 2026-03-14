---
title: 为 Core Candy Machine 准备资产
metaTitle: 准备资产 | Core Candy Machine
description: 如何准备图像文件、动画媒体和 JSON 元数据，以便上传到 Solana 上的 Core Candy Machine。
keywords:
  - NFT metadata
  - JSON metadata
  - asset preparation
  - Arweave
  - IPFS
  - image upload
  - Core Candy Machine assets
  - NFT collection
  - metadata standard
  - Irys uploader
  - Solana NFT images
  - NFT animation files
  - Umi storage plugin
  - decentralized storage
about:
  - Asset preparation
  - NFT metadata
  - File uploads
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Core Candy Machine 资产最适合使用什么图像格式？
    a: PNG 和 JPEG 是钱包和市场中支持最广泛的格式。PNG 适合像素艺术或需要透明度的图像，而 JPEG 适合照片或高细节艺术品，文件大小更小。请优化图像以适合网络交付，尽可能将文件大小保持在 1 MB 以下。
  - q: NFT 元数据和图像应该使用什么存储提供商？
    a: Arweave（通过 Irys）是最受欢迎的选择，因为它提供永久的去中心化存储，使用 SOL 支付。IPFS 是另一个去中心化选项，但需要固定服务以确保持久性。自托管解决方案（AWS、Google Cloud）可行但会引入中心化和持续维护成本。
  - q: 我可以将 IPFS 用于 Core Candy Machine 资产吗？
    a: 可以，IPFS URI 可以与 Core Candy Machine 资产一起使用。但是，您必须使用固定服务（如 Pinata、nft.storage 或专用 IPFS 节点）以确保文件保持可访问。未固定的 IPFS 内容可能会随时间变得不可用。
  - q: 创建 JSON 元数据文件之前需要先上传图像吗？
    a: 是的。JSON 元数据文件在其 "image" 字段和 "properties.files" 数组中引用图像 URI。您必须先上传所有图像和动画文件，收集其 URI，然后将这些 URI 插入每个对应的 JSON 元数据文件，再上传元数据本身。
  - q: 1,000 个物品的集合需要准备多少文件？
    a: 对于 1,000 个物品的集合，您至少需要 1,000 个图像文件和 1,000 个 JSON 元数据文件，外加一个额外的图像和一个 JSON 元数据文件用于 Core Collection 本身。如果您的资产包含动画文件（视频、音频、VR、HTML），您还需要 1,000 个动画文件。
---

## 概述

为 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 准备资产需要将图像文件和 JSON 元数据上传到存储提供商，然后创建一个 [Core Collection](/zh/smart-contracts/core/collections) 将所有铸造的资产分组在一起。

- 将图像和动画文件上传到去中心化存储（如 Arweave（通过 Irys）或 IPFS），或自托管解决方案 {% .lead %}
- 按照 Metaplex 代币标准构建 JSON 元数据文件，嵌入已上传的图像 URI {% .lead %}
- 上传完成的 JSON 元数据文件并记录生成的 URI 以用作配置行 {% .lead %}
- 创建 [Core](/zh/smart-contracts/core) Collection 作为从 Candy Machine 铸造的所有资产的父级 {% .lead %}

## 所需资产文件

从 Core Candy Machine 铸造的每个 [Core](/zh/smart-contracts/core) 资产在机器[创建](/zh/smart-contracts/core-candy-machine/create)和填充之前，都需要准备两类文件。
这些包括：

- 图像和动画文件。
- JSON 元数据文件。

## 支持的资产类型

Core 资产支持五种媒体类别，决定钱包和市场如何呈现内容：

- image（图像）
- video（视频）
- audio（音频）
- vr（虚拟现实）
- html

## 准备图像文件

图像文件作为每个资产的主要视觉表示，在所有钱包和市场中显示。虽然没有强制的格式限制，但最佳实践是优化图像以适合网络交付。并非所有用户都能访问高速互联网连接——偏远地区的用户可能难以加载大型文件，因此将图像保持在 1 MB 以下可以改善整个受众的体验。

即使您的资产类型是 `audio`、`video`、`html` 或 `vr`，仍然值得准备图像，因为这些将用作钱包或可能不支持加载其他资产类型的市场等区域的后备。

## 准备动画和媒体文件

动画和媒体文件涵盖剩余的资产类别：`audio`、`video`、`vr` 和 `html`。与图像相同的文件大小考虑同样适用——尽量保持文件尽可能小以最小化终端用户的下载时间。

以下文件类型已经过测试并确认在几乎所有主要钱包和市场中都能正常工作。

- video (.mp4)
- audio (.wav, .mp3)
- vr (.glb)
- html (.html)

## 准备 JSON 元数据文件

JSON 元数据文件定义每个资产的链上属性、名称、描述和媒体引用。这些文件遵循与其他 Metaplex 资产类型（包括 NFT、pNFT 和 cNFT）相同的代币标准。

{% partial file="token-standard-full.md" /%}

## 自动化图像和元数据生成器

几个开源脚本和 Web 应用程序可以从分层艺术品生成大批量的资产图像和 JSON 元数据文件。您提供艺术层和项目参数，生成器将生成完整的图像-元数据配对集。

| 名称                                                        | 类型   | 难度 | 要求 | 免费 |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | 脚本 | ⭐⭐⭐⭐   | JS 知识 | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | 脚本 | ⭐⭐⭐⭐   | JS 知识 | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | 网页 UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | 网页 UI | 未知    |              |      |

## 上传资产文件

所有图像和动画文件必须在引用到 JSON 元数据之前上传到存储提供商。存储提供商的选择影响持久性、成本和去中心化程度。

### 存储选项

#### Arweave/Irys

_"Arweave 网络就像比特币，但用于数据：一个永久且去中心化的网络，位于开放账本内。" - [arweave.org](https://arweave.org)_

由于 Arweave 是其自己的区块链，我们需要使用桥接才能将文件存储在 Arweave 上。[Irys](https://irys.xyz/) 充当 Solana 和 Arweave 之间的中间人，允许您用 SOL 而不是 AR 支付存储费用，同时他们为您处理将数据上传到 Arweave 链。

您可以通过他们自己的 [SDK](https://docs.irys.xyz/) 手动实现，或使用 [Umi 存储插件](/zh/dev-tools/umi/storage)通过 Irys 上传到 Arweave。

#### 自托管

在 AWS、Google Cloud 或您自己的 Web 服务器上自托管是存储图像和元数据的有效选项。只要数据可以从存储位置访问并且不被 CORS 限制阻止，即可正常工作。建议先创建几个测试 [Core](/zh/smart-contracts/core) 资产或小型 Core Candy Machine，以验证自托管文件在钱包和市场中正确显示。

### 使用 Umi 上传文件

[Umi](/zh/dev-tools/umi) 提供简化上传过程的存储插件。目前支持以下插件：

- Irys
- AWS

#### 使用 Umi 通过 Irys 上传到 Arweave

有关使用 Umi 上传文件的更深入指南，请访问 [Umi Storage](/zh/dev-tools/umi/storage)。

{% dialect-switcher title="使用 Umi 通过 Irys 将文件上传到 Arweave" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

const umi = createUmi("https://api.devnet.solana.com").use(irysUploader())

const uriUploadArray = await umi.uploader.upload([myFile1, myFile2])

console.log(uriUploadArray)
```

{% /dialect %}
{% /dialect-switcher %}

### 将图像 URI 分配给 JSON 元数据文件

一旦所有图像和动画文件上传到存储提供商，返回的 URI 必须插入到每个对应的 JSON 元数据文件中。如果您的资产集合有 1,000 个资产，您应该已经上传了 1,000 个图像或动画文件，并收到一组 URI，指示每个文件的存储位置。如果您的上传平台不支持批量上传，您可能需要手动记录和存储链接。

此时的目标是拥有所有已上传媒体的完整 URI 列表。

```js
[
  https://example.com/1.jpg
  https://example.com/2.jpg
  ...
]

```

使用上传媒体的索引 URI 列表，您将需要循环遍历您的 JSON 元数据文件并将 URI 添加到适当的位置。

图像 URI 将被插入到 `image:` 字段，以及 `properties: files: []` 数组中。

```json
{
  "name": "My Nft #1",
  "description": "This is My Nft Collection",
  "image": "https://example.com/1.jpg", <---- 在这里填写。
  ...
  "properties": {
    "files": [
      {
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }, <---- 在 files 数组中创建一个对象条目。
    ]
  }
}
```

### 上传 JSON 元数据文件

此时，您应该在机器上本地构建了一个 JSON 元数据文件文件夹，看起来类似于：

{% dialect-switcher title="1.json" %}
{% dialect title="Json" id="json" %}

```json
{
  "name": "My Nft #1",
  "description": "This is My Nft Collection",
  "image": "https://example.com/1.jpg",
  "external_url": "https://example.com",
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
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }
    ],
    "category": "image"
  }
}
```

{% /dialect %}
{% /dialect-switcher %}

您将需要将所有 JSON 元数据上传到您选择的存储媒介，并再次记录所有 URI 以供将来使用。

## 创建 Core Collection

资产准备的最后一步是创建一个 [Core Collection](/zh/smart-contracts/core/collections)，Core Candy Machine 使用它将所有铸造的资产分组在一起。这需要 `mpl-core` 包。

{% callout %}
您需要上传图像并准备和上传 JSON 元数据，就像前面的步骤一样，以获得创建 Core Collection 所需的数据。
{% /callout %}

以下示例创建了一个没有插件的基本 Core Collection。要查看可用插件列表和更高级的 [Core Collection](/zh/smart-contracts/core/collections) 创建，您可以查看 [Collection 管理](/zh/smart-contracts/core/collections)文档。

{% dialect-switcher title="创建 MPL Core Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, umi } from '@metaplex-foundation/umi'
import { createCollectionV1 } from '@metaplex-foundation/mpl-core'

const mainnet = 'https://api.mainnet-beta.solana.com'
const devnet = 'https://api.devnet.solana.com'

const keypair = // 分配密钥对

const umi = createUmi(mainnet)
.use(keypairIdentity(keypair)) // 分配您选择的身份签名者。
.use(mplCore())

const collectionSigner = generateSigner(umi)

await createCollectionV1(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 注意事项

- 优化所有图像以适合网络交付。尽可能将文件大小保持在 1 MB 以下，以确保在各种设备和网络条件下快速加载。
- 自托管资产时，验证 CORS 头是否正确配置。被 CORS 阻止的资产将不会在钱包或市场中渲染。
- 安全存储所有已上传的 URI 并备份它们。上传图像后丢失 URI 列表意味着您无法将元数据链接到正确的文件。
- Arweave 存储是永久且不可变的。上传前请仔细检查文件内容，因为文件一旦存储在 Arweave 上就无法删除或修改。
- JSON 元数据文件必须在图像文件*之后*上传，因为元数据引用的图像 URI 只有在上传完成后才可用。

## 结论

此时，您应该已经完成了[创建 Core Candy Machine](/zh/smart-contracts/core-candy-machine/create) 所需的所有准备工作。

- 上传图像和其他媒体文件。
- 将图像和媒体文件 URI 分配给 JSON 元数据文件。
- 上传 JSON 元数据文件并存储 URI。
- 创建了 [Core Collection](/zh/smart-contracts/core/collections)。

## FAQ

### Core Candy Machine 资产最适合使用什么图像格式？

PNG 和 JPEG 是钱包和市场中支持最广泛的格式。PNG 适合像素艺术或需要透明度的图像，而 JPEG 适合照片或高细节艺术品，文件大小更小。请优化图像以适合网络交付，尽可能将文件大小保持在 1 MB 以下。

### NFT 元数据和图像应该使用什么存储提供商？

Arweave（通过 Irys）是最受欢迎的选择，因为它提供永久的去中心化存储，使用 SOL 支付。IPFS 是另一个去中心化选项，但需要固定服务以确保持久性。自托管解决方案（AWS、Google Cloud）可行但会引入中心化和持续维护成本。

### 我可以将 IPFS 用于 Core Candy Machine 资产吗？

可以，IPFS URI 可以与 Core Candy Machine 资产一起使用。但是，您必须使用固定服务（如 Pinata、nft.storage 或专用 IPFS 节点）以确保文件保持可访问。未固定的 IPFS 内容可能会随时间变得不可用。

### 创建 JSON 元数据文件之前需要先上传图像吗？

是的。JSON 元数据文件在其 `image` 字段和 `properties.files` 数组中引用图像 URI。您必须先上传所有图像和动画文件，收集其 URI，然后将这些 URI 插入每个对应的 JSON 元数据文件，再上传元数据本身。

### 1,000 个物品的集合需要准备多少文件？

对于 1,000 个物品的集合，您至少需要 1,000 个图像文件和 1,000 个 JSON 元数据文件，外加一个额外的图像和一个 JSON 元数据文件用于 [Core Collection](/zh/smart-contracts/core/collections) 本身。如果您的资产包含动画文件（视频、音频、VR、HTML），您还需要 1,000 个动画文件。

## 术语表

| 术语 | 定义 |
| --- | --- |
| JSON Metadata（JSON 元数据） | 符合 Metaplex 代币标准的结构化 JSON 文件，定义资产的名称、描述、图像 URI、属性和关联媒体文件。 |
| URI | 统一资源标识符——已上传文件（图像、动画或元数据）的存储和检索网络地址。 |
| Arweave | 一个为不可变数据存储设计的永久、去中心化存储区块链。上传到 Arweave 的文件会无限期保存。 |
| Irys | 一种桥接服务（前身为 Bundlr），允许 Solana 用户使用 SOL 支付 Arweave 存储费用，处理跨链上传过程。 |
| IPFS | 星际文件系统——一种点对点去中心化存储协议。需要固定服务以保证文件的长期可用性。 |
| Config Line（配置行） | 插入 Core Candy Machine 的名称-URI 对，映射到存储上单个资产的 JSON 元数据文件。 |
| Core Collection | Metaplex Core 链上账户，将相关资产分组在一起，作为从 Candy Machine 铸造的所有资产的父集合。 |
| Token Standard（代币标准） | Metaplex 定义的 JSON 模式，指定 NFT 元数据的必需和可选字段（name、description、image、attributes、properties）。 |

