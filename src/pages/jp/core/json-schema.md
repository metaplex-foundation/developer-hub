---
title: JSONスキーマ
metaTitle: JSONスキーマ | Core
description: Metaplex CoreアセットのオフチェーンJSONスキーマの構造と要件について理解しましょう。
---

Metaplex CoreアセットのオフチェーンJSONメタデータは、Metaplex Token Metadata標準に似ています。ただし、プラグインを用いてアセット自体により多くのデータをオンチェーン保存できるため、たとえばAttributesなど一部のデータはオンチェーンにも格納できます。

## スキーマ例

以下は、代表的なNFTタイプごとの例です。これらはすべて、`image`、`animation_url`、`properties`フィールドを使うことで、単一のアセット内に共存できます。各フィールドの詳細は[JSONスキーマのフィールド](#json-schema-fields)で説明します。

{% totem title="Examples" id="schema-examples" %}

{% totem-accordion title="画像（Image）" %}

Attributesは[Attributesプラグイン](/core/plugins/attribute)を使ってオンチェーンに保存することもできます。
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
      }
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
  "image": "https://nftstorage.link/ipfs/bafybeihh2fcxwvm5qj555hfeywikptip5olyizdbkwkoxspt63332x2tpe/5307.gif?ext=gif",
  "external_url": "https://example.com",
  "properties": {
    "files": [
      {
        "uri": "https://nftstorage.link/ipfs/bafybeihh2fcxwvm5qj555hfeywikptip5olyizdbkwkoxspt63332x2tpe/5307.gif?ext=gif",
        "type": "image/gif"
      }
    ],
    "category": "image"
  }
}
```

{% /totem-accordion  %}

{% totem-accordion title="動画（Video）" %}

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

{% totem-accordion title="オーディオ（Audio）" %}

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

多くのエクスプローラーやウォレットは`.glb`に対応していますが、フォールバック画像を用意することを推奨します。

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

以下のHTMLアセット例は、セキュリティ上の理由からウォレットでは未対応の場合があります。一部のエクスプローラーでは正しく表示されるため、対応していないツール向けにフォールバック画像を用意することを推奨します。

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

## JSONスキーマのフィールド

各フィールドの説明です。

Metaplex Token Metadataで存在した一部のフィールドはCoreでは廃止されている可能性があります。たとえば`creators`は現在[Royaltiesプラグイン](/core/plugins/royalties)の一部です。

### 必須フィールド

- **name**: NFTアセットの名前
  - 例: "Solana Monkey #123", "Degen Ape #45"

- **description**: NFTの詳細説明
  - 例: "A rare cosmic monkey floating through the Solana blockchain"

- **image**: NFTのメイン画像のURI
  - 例: `https://arweave.net/123abc...?ext=png`
  - 対応形式: PNG, GIF, JPG/JPEG

- **category**: NFTコンテンツの種別
  - 例: `image`, `video`, `audio`, `vr`, `html`

### 任意フィールド

- **animation_url**: マルチメディア添付のURI
  - 例: `https://arweave.net/xyz789...?ext=mp4`
  - 対応形式: MP4, GIF, GLB, HTML

- **external_url**: NFTの外部Webサイトリンク
  - 例: `https://www.myproject.io/nft/123`

- **attributes**: 特徴と値の配列。これは[Attributesプラグイン](/core/plugins/attribute)を使ってオンチェーンに保存することも可能です。
  - 例:
    ```json
    {
      "trait_type": "Background",
      "value": "Galaxy"
    }
    ```

- **properties**: ファイルやカテゴリなどの追加メタデータ
  - **files**: NFTに関連する全アセットの配列。`type`はファイルの[MIMEタイプ](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types)。
    ```json
    {
      "uri": "https://arweave.net/abc123...?ext=png",
      "type": "image/png"
    }
    ```

