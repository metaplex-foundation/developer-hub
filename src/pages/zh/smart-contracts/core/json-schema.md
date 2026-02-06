---
title: JSON Schema
metaTitle: JSON Schema | Core
description: 了解Metaplex Core资产的链下JSON schema结构和要求。
updated: '01-31-2026'
keywords:
  - NFT metadata
  - JSON schema
  - off-chain metadata
  - metadata standard
about:
  - Metadata structure
  - JSON format
  - Off-chain data
proficiencyLevel: Beginner
---
Metaplex Core资产的链下JSON元数据与Metaplex Token Metadata标准类似。但是，由于可以使用插件在资产本身中存储更多数据，因此属性等一些数据也可以额外存储在链上。

## Schema示例

以下是不同已知NFT类型的示例。需要注意的是，所有这些不同类型也可以使用`image`、`animation_url`和`properties`字段成为单个Asset的一部分。所有不同的字段在[JSON Schema字段](#json-schema字段)部分进一步描述。
{% totem title="示例" id="schema-examples" %}
{% totem-accordion title="图像" %}
Attributes也可以使用[Attributes插件](/smart-contracts/core/plugins/attribute)存储在链上。

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
{% totem-accordion title="动画GIF" %}

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
虽然大多数浏览器和钱包支持`.glb`文件，但建议在schema中包含一个备用图像。

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
以下HTML Asset示例目前不受钱包支持，因为它们可能被视为安全风险。但是，一些浏览器会正确渲染它们，因此建议为所有不支持HTML Asset的工具提供备用图像。

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

## JSON Schema字段

以下是不同字段的说明。
如果您缺少Metaplex Token Metadata中已知的某些字段，这些字段可能已被弃用。例如，`creators`现在是[Royalties插件](/smart-contracts/core/plugins/royalties)的一部分。

### 必填字段

- **name**：NFT资产的名称
  - 示例："Solana Monkey #123"，"Degen Ape #45"

- **description**：NFT的详细描述
  - 示例："一只稀有的宇宙猴子漂浮在Solana区块链中"
- **image**：指向NFT主图像的URI
  - 示例：`https://arweave.net/123abc...?ext=png`
  - 支持：PNG、GIF、JPG/JPEG
- **category**：NFT内容类型
  - 示例：`image`、`video`、`audio`、`vr`、`html`

### 可选字段

- **animation_url**：多媒体附件的URI
  - 示例：`https://arweave.net/xyz789...?ext=mp4`
  - 支持：MP4、GIF、GLB、HTML
- **external_url**：NFT外部网站的链接
  - 示例：`https://www.myproject.io/nft/123`
- **attributes**：特征及其值的数组。也可以使用[Attributes插件](/smart-contracts/core/plugins/attribute)存储在链上。
  - 示例：

    ```json
    {
      "trait_type": "Background",
      "value": "Galaxy"
    }
    ```

- **properties**：包括文件和类别的额外元数据
  - **files**：与NFT关联的所有资产的数组。`type`是文件的[MIME类型](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types)。

    ```json
    {
      "uri": "https://arweave.net/abc123...?ext=png",
      "type": "image/png"
    }
    ```
