---
title: JSON Schema
metaTitle: JSON Schema | Core
description: 了解 Metaplex Core 资产的链下 JSON schema 结构和要求。
---

Metaplex Core 资产的链下 JSON 元数据与 Metaplex Token Metadata 标准类似。然而，由于更多数据可以使用插件存储在资产本身的链上，一些数据如属性也可以额外存储在链上。

## Schema 示例

以下是不同已知 NFT 类型的示例。重要的是要注意，所有这些不同类型也可以使用 `image`、`animation_url` 和 `properties` 字段成为单个 Asset 的一部分。所有不同的字段在 [JSON Schema 字段](#json-schema-字段)部分有进一步描述。


{% totem title="示例" id="schema-examples" %}

{% totem-accordion title="图片" %}

属性也可以使用 [Attributes 插件](/zh/smart-contracts/core/plugins/attribute)在链上存储。
```json
{
  "name": "Number #0001",
  "description": "Collection of 10 numbers on the blockchain. This is the number 1/10.",
  "image": "https://arweave.net/swS5eZNrKGtuu5ebdqotzPny4OBoM4wHneZ_Ld17ZU8?ext=png",
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
        "uri": "https://arweave.net/swS5eZNrKGtuu5ebdqotzPny4OBoM4wHneZ_Ld17ZU8?ext=png",
        "type": "image/png"
      },
    ],
    "category": "image"
  }
}
```

{% /totem-accordion  %}

{% totem-accordion title="动画 GIF" %}

```json
{
  "name": "Number #0001",
  "description": "Collection of 10 numbers on the blockchain. This is the number 1/10.",
  "image": "https://arweave.net/example",
  "external_url": "https://example.com",
  "properties": {
    "files": [
      {
        "uri": "https://arweave.net/example",
        "type": "image/gif"
      },
    ],
    "category": "image"
  }
}
```

{% /totem-accordion  %}

{% totem-accordion title="视频" %}

```json
{
    "name": "Video Asset",
    "image": "https://arweave.net/uMH-lDz73Q5LQQAdb2HlGu_6KzAgL7pkIKGq1tjqmJc",
    "animation_url": "https://arweave.net/b2oifxVmEaHQVTko9l1tEx-eaTLwKErBn-GRRDy2qvM",
    "description": "This is a video Asset. It has an image and animation URL with it's category set to 'video'.",
    "external_url": "https://example.com",
    "properties": {
        "files": [
            {
                "uri": "https://arweave.net/uMH-lDz73Q5LQQAdb2HlGu_6KzAgL7pkIKGq1tjqmJc",
                "type": "image/png"
            },
            {
                "uri": "https://arweave.net/b2oifxVmEaHQVTko9l1tEx-eaTLwKErBn-GRRDy2qvM",
                "type": "video/quicktime"
            }
        ],
        "category": "video"
    }
}
```

{% /totem-accordion  %}

{% totem-accordion title="音频" %}

```json
{
    "name": "Audio Asset",
    "image": "https://arweave.net/bc5-O7d81hO6F54wFkQHFlCxMQJy9azsWcAL63uYZpg?ext=png",
    "animation_url": "https://arweave.net/Ymlb5ONszJKIH405I2ZqgLJec-J5Wf1UjJs4K8LPz5M?ext=wav",
    "description": "This is a audio NFT to test how explorers and wallets handle this NFT type. It has an image and the animation url is linked to an MP3. The metadata category is set to audio.",
    "external_url": "https://example.com",
    "properties": {
        "files": [
            {
                "uri": "https://arweave.net/bc5-O7d81hO6F54wFkQHFlCxMQJy9azsWcAL63uYZpg?ext=png",
                "type": "image/png"
            },
            {
                "uri": "https://arweave.net/Ymlb5ONszJKIH405I2ZqgLJec-J5Wf1UjJs4K8LPz5M?ext=wav",
                "type": "video/wav"
            }
        ],
        "category": "audio"
    }
}
```
{% /totem-accordion  %}

{% totem-accordion title="VR" %}

虽然大多数浏览器和钱包支持 `.glb` 文件，但建议在 schema 中也包含一个后备图片。

```json
{
    "name": "VR Asset",
    "image": "https://arweave.net/2MZgcwIbuSRndVW2jz6M85RgAbNBP2r52PM4vkaE4vA",
    "animation_url": "https://arweave.net/x-aTcZDaSIUGHkyee3j7Z158754oQijs2bStmbjOi1g",
    "description": "This is a VR Asset. It has an image and the animation url is linked to a glb file. The metadata category is set to vr.",
    "external_url": "https://example.com",
    "properties": {
        "files": [
            {
                "uri": "https://arweave.net/2MZgcwIbuSRndVW2jz6M85RgAbNBP2r52PM4vkaE4vA",
                "type": "image/png"
            },
            {
                "uri": "https://arweave.net/x-aTcZDaSIUGHkyee3j7Z158754oQijs2bStmbjOi1g",
                "type": "video/undefined"
            }
        ],
        "category": "vr"
    }
}
```

{% /totem-accordion  %}

{% totem-accordion title="HTML" %}

以下 HTML Assets 示例目前不被钱包支持，因为它们可能被视为安全风险。不过一些浏览器可以正确渲染它们，因此建议为所有不支持 HTML Assets 的工具提供后备图片。

```json
{
    "name": "HTML Asset",
    "image": "https://arweave.net/UV74zleArOaBkmIamruFZDrRWru3wEfwmdOJFgOSKIE",
    "animation_url": "https://arweave.net/b0Ww2l2Qq62WwH6nRwwn2784a9RJWLBi21HVLELvpVQ",
    "description": "This is a html NFT showing a clock. It has an image and the animation url is linked to a html file.",
    "external_url": "https://example.com",
    "properties": {
        "files": [
            {
                "uri": "https://arweave.net/UV74zleArOaBkmIamruFZDrRWru3wEfwmdOJFgOSKIE",
                "type": "image/png"
            },
            {
                "uri": "https://arweave.net/b0Ww2l2Qq62WwH6nRwwn2784a9RJWLBi21HVLELvpVQ",
                "type": "video/html"
            }
        ],
        "category": "html"
    }
}
```

{% /totem-accordion  %}

{% /totem %}

## JSON Schema 字段

以下是不同字段的说明。

如果您缺少一些您从 Metaplex Token Metadata 中了解的字段，那些可能已被弃用。例如 `creators` 现在是 [Royalties 插件](/zh/smart-contracts/core/plugins/royalties)的一部分。

### 必填字段

- **name**：您的 NFT 资产名称
  - 示例："Solana Monkey #123"，"Degen Ape #45"

- **description**：您的 NFT 的详细描述
  - 示例："一只罕见的宇宙猴子漂浮在 Solana 区块链上"

- **image**：指向您的 NFT 主图像的 URI
  - 示例：`https://arweave.net/123abc...?ext=png`
  - 支持：PNG、GIF、JPG/JPEG

- **category**：NFT 内容类型
    - 示例：`image`、`video`、`audio`、`vr`、`html`

### 可选字段

- **animation_url**：多媒体附件的 URI
  - 示例：`https://arweave.net/xyz789...?ext=mp4`
  - 支持：MP4、GIF、GLB、HTML

- **external_url**：链接到 NFT 外部网站的链接
  - 示例：`https://www.myproject.io/nft/123`

- **attributes**：特征及其值的数组。这些也可以使用 [Attributes 插件](/zh/smart-contracts/core/plugins/attribute)在链上存储
  - 示例：
    ```json
    {
      "trait_type": "Background",
      "value": "Galaxy"
    }
    ```

- **properties**：包括文件和类别的附加元数据
  - **files**：与 NFT 关联的所有资产的数组。`type` 是文件的 [MIME 类型](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types)。
    ```json
    {
      "uri": "https://arweave.net/abc123...?ext=png",
      "type": "image/png"
    }
    ```
