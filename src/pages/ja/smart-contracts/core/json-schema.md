---
title: JSONスキーマ
metaTitle: JSONスキーマ | Core
description: Metaplex CoreアセットのオフチェーンJSONスキーマの構造と要件を理解します。
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
Metaplex CoreアセットのオフチェーンJSONメタデータは、Metaplex Token Metadataスタンダードに似ています。ただし、プラグインを使用してアセット自体にオンチェーンでより多くのデータを保存できるため、属性などの一部のデータはオンチェーンでも保存できます。

## スキーマの例

以下は、異なる種類のNFTの例です。これらの異なるタイプはすべて、`image`、`animation_url`、`properties`フィールドを使用して単一のAssetの一部にすることもできることに注意してください。すべての異なるフィールドについては、[JSONスキーマフィールド](#jsonスキーマフィールド)セクションで詳しく説明しています。
{% totem title="例" id="schema-examples" %}
{% totem-accordion title="画像" %}
属性は、[Attributesプラグイン](/smart-contracts/core/plugins/attribute)を使用してオンチェーンに保存することもできます。

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
{% totem-accordion title="アニメーションGIF" %}

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
{% totem-accordion title="動画" %}

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
{% totem-accordion title="オーディオ" %}

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
ほとんどのエクスプローラーとウォレットは`.glb`ファイルをサポートしていますが、スキーマの一部としてフォールバック画像も用意することをお勧めします。

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
HTML Assetsの以下の例は、セキュリティリスクと見なされる可能性があるため、現在ウォレットではサポートされていません。ただし、一部のエクスプローラーは正しくレンダリングするため、HTML Assetsをサポートしていないすべてのツールに対してフォールバック画像を用意することをお勧めします。

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

## JSONスキーマフィールド

以下は、異なるフィールドの説明です。
Metaplex Token Metadataから知っていた一部のフィールドがない場合、それらはおそらく非推奨です。例えば、`creators`は現在[Royaltiesプラグイン](/smart-contracts/core/plugins/royalties)の一部です。

### 必須フィールド

- **name**: NFTアセットの名前
  - 例: "Solana Monkey #123", "Degen Ape #45"

- **description**: NFTの詳細な説明
  - 例: "Solanaブロックチェーンを漂う珍しい宇宙の猿"
- **image**: NFTのプライマリ画像を指すURI
  - 例: `https://arweave.net/123abc...?ext=png`
  - サポート: PNG, GIF, JPG/JPEG
- **category**: NFTコンテンツのタイプ
  - 例: `image`, `video`, `audio`, `vr`, `html`

### オプションフィールド

- **animation_url**: マルチメディア添付ファイル用のURI
  - 例: `https://arweave.net/xyz789...?ext=mp4`
  - サポート: MP4, GIF, GLB, HTML
- **external_url**: NFTの外部ウェブサイトへのリンク
  - 例: `https://www.myproject.io/nft/123`
- **attributes**: 特性とその値の配列。これらは[Attributesプラグイン](/smart-contracts/core/plugins/attribute)を使用してオンチェーンに保存することもできます
  - 例:

    ```json
    {
      "trait_type": "Background",
      "value": "Galaxy"
    }
    ```

- **properties**: ファイルとカテゴリを含む追加のメタデータ
  - **files**: NFTに関連付けられたすべてのアセットの配列。`type`はファイルの[MIMEタイプ](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types)です。

    ```json
    {
      "uri": "https://arweave.net/abc123...?ext=png",
      "type": "image/png"
    }
    ```
