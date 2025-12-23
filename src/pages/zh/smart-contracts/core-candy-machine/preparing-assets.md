---
title: 准备资产
metaTitle: 准备资产 | Core Candy Machine
description: 如何准备您的文件和资产以上传到 Core Candy Machine。
---

## 资产文件

创建资产需要准备和上传几个不同的文件以用于资产数据。
这些包括：

- 图像和动画文件。
- JSON 元数据文件。

## 资产类型

资产支持以下类别：

- image（图像）
- video（视频）
- audio（音频）
- vr（虚拟现实）
- html

## 准备图像

虽然对图像没有固有的规则，但最佳实践是尽可能优化您的图像以使其"适合网络交付"。您需要考虑到不是所有用户都能访问超快的宽带连接。用户可能在互联网访问稀少的偏远地区，因此尝试让用户查看 8MB 的图像可能会影响他们与您项目的体验。

即使您的资产类型是 `audio`、`video`、`html` 或 `vr`，仍然值得准备图像，因为这些将用作钱包或可能不支持加载其他资产类型的市场等区域的后备。

## 准备动画文件

动画文件包含资产类别的其余类型：`audio`、`video`、`vr` 和 `html`

这里与准备图像文件相同。您需要考虑文件大小和用户的预期下载大小。

以下文件类型已经过测试并确认在几乎所有主要钱包和市场中都能正常工作。

- video (.mp4)
- audio (.wav, .mp3)
- vr (.glb)
- html (.html)

## 准备 JSON 元数据

您的 JSON 元数据文件将遵循与 Metaplex 的其他 NFT、pNFT 和 cNFT 标准相同的代币标准。

{% partial file="token-standard-full.md" /%}

## 图像和元数据生成器

有几个自动化脚本和网站，您可以向生成器提供您的艺术图层和有关项目的一些基本信息，它将根据您给定的参数生成 x 个资产图像和 JSON 元数据组合。

| 名称                                                        | 类型   | 难度 | 要求 | 免费 |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | 脚本 | ⭐⭐⭐⭐   | JS 知识 | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | 脚本 | ⭐⭐⭐⭐   | JS 知识 | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | 网页 UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | 网页 UI | 未知    |              |      |

## 上传文件

### 存储选项

#### Arweave/Irys

_"Arweave 网络就像比特币，但用于数据：一个永久且去中心化的网络，位于开放账本内。" - [arweave.org](https://arweave.org)_

由于 Arweave 是其自己的区块链，我们需要使用桥接才能将文件存储在 Arweave 上。[Irys](https://irys.xyz/) 充当 Solana 和 Arweave 之间的中间人，允许您用 SOL 而不是 AR 支付存储费用，同时他们为您处理将数据上传到 Arweave 链。

您可以通过他们自己的 [SDK](https://docs.irys.xyz/) 手动实现，或使用 UMI 插件通过 Irys 上传到 Arweave。

#### 自托管

在 AWS、Google Cloud 甚至您自己的网络服务器上自托管您的图像或元数据也没有什么问题。只要数据可以从其存储位置访问，并且没有像 CORS 这样的东西阻止它，您就应该没问题。建议创建几个测试 Core Assets 或小型 Core Candy Machine 来测试自托管选项，以确保存储的数据是可查看的。

### 使用 Umi 上传文件

Umi 有几个可以通过插件帮助上传过程的插件。目前支持以下插件：

- Irys
- AWS

#### 使用 Umi 通过 Irys 上传到 Arweave

有关使用 Umi 上传文件的更深入了解，请访问 [Umi Storage](/zh/dev-tools/umi/storage)。

{% dialect-switcher title="使用 Umi 通过 Irys 将文件上传到 Arweave" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>").use(irysUploader())

const uriUploadArray = await umi.uploader.upload([myFile1, myFile2])

console.log(uriUploadArray)
```

{% /dialect %}
{% /dialect-switcher %}

### 将图像 URI 分配给 JSON 元数据文件

一旦您将所有 img 文件上传到您选择的存储媒介，您将需要将所有图像 URI 放入您的 JSON 元数据文件中。

如果您的资产集合有 1000 个资产，那么您应该已经将 1000 个图像/动画媒体上传到存储平台，并收到一组数据/日志/一种方式来告诉每个图像/动画媒体存储在哪里。如果您选择的上传平台不支持批量上传，您可能需要手动记录和存储链接，并且您必须单循环上传。

此时的目标是拥有一个完整的媒体 URI 列表。

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

## 创建 Collection Asset

为您的 Core Candy Machine 创建做准备的最后一步是创建一个 Core Collection，Core Candy Machine 可以使用它来将用户从您的 Core Candy Machine 购买的所有资产分组在一起。为此，我们需要 `mpl-core` 包。

{% callout %}
您需要上传图像并准备和上传 JSON 元数据，就像前面的步骤一样，以获得创建 Core Collection 所需的数据。
{% /callout %}

以下示例创建了一个没有插件的基本 Core Collection。要查看可用插件列表和更高级的 Core Collection 创建，您可以查看 Core 的 [Collection 管理](/zh/smart-contracts/core/collections) 文档。

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

## 结论

此时，您应该已经完成了创建 Core Candy Machine 所需的所有准备工作。

- 上传图像和其他媒体文件。
- 将图像和媒体文件 URI 分配给 JSON 元数据文件。
- 上传 JSON 元数据文件并存储 URI。
- 创建了 Core Collection
