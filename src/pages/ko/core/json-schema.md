---
title: JSON Schema
metaTitle: JSON Schema | Core
description: Metaplex Core assets의 오프체인 JSON 스키마의 구조와 요구 사항을 이해하세요.
---

Metaplex Core assets의 오프체인 JSON 메타데이터는 Metaplex Token Metadata 표준과 유사합니다. 하지만 플러그인을 사용하여 자산 자체에 더 많은 데이터를 온체인에 저장할 수 있기 때문에, 속성과 같은 일부 데이터는 추가적으로 온체인에 저장될 수 있습니다.

## 스키마 예시

다음은 다양한 알려진 NFT 유형의 예시입니다. 이러한 모든 다양한 유형은 `image`, `animation_url`, `properties` 필드를 사용하여 단일 Asset의 일부가 될 수도 있다는 점을 주목하는 것이 중요합니다. 모든 다양한 필드는 [JSON Schema Fields](#json-schema-fields) 섹션에서 자세히 설명됩니다.


{% totem title="예시" id="schema-examples" %}

{% totem-accordion title="Image" %}

속성은 [Attributes Plugin](/core/plugins/attribute)을 사용하여 대안적으로 온체인에 저장될 수 있습니다.
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

{% totem-accordion title="Animated GIF" %}

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
      },
    ],
    "category": "image"
  }
}
```

{% /totem-accordion  %}

{% totem-accordion title="Video" %}

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

{% totem-accordion title="Audio" %}

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

대부분의 Explorer와 지갑이 `.glb` 파일을 지원하지만, 스키마의 일부로 대체 이미지도 포함하는 것이 권장됩니다.

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

HTML Assets에 대한 다음 예시는 보안 위험으로 인해 현재 지갑에서 지원되지 않습니다. 일부 explorer는 올바르게 렌더링하므로, HTML Assets를 지원하지 않는 모든 도구에 대해 대체 이미지를 제공하는 것이 권장됩니다.

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

## JSON Schema 필드

다음은 다양한 필드에 대한 설명입니다.

Metaplex Token Metadata에서 알던 일부 필드가 누락되어 있다면 아마도 더 이상 사용되지 않는 것입니다. 예를 들어 `creators`는 이제 [Royalties Plugin](/core/plugins/royalties)의 일부입니다.

### 필수 필드

- **name**: NFT asset의 이름
  - 예시: "Solana Monkey #123", "Degen Ape #45"

- **description**: NFT에 대한 자세한 설명
  - 예시: "A rare cosmic monkey floating through the Solana blockchain"

- **image**: NFT의 주요 이미지를 가리키는 URI
  - 예시: `https://arweave.net/123abc...?ext=png`
  - 지원 형식: PNG, GIF, JPG/JPEG

- **category**: NFT 콘텐츠의 유형
    - 예시: `image`, `video`, `audio`, `vr`, `html`

### 선택적 필드

- **animation_url**: 멀티미디어 첨부 파일의 URI
  - 예시: `https://arweave.net/xyz789...?ext=mp4`
  - 지원 형식: MP4, GIF, GLB, HTML

- **external_url**: NFT의 외부 웹사이트 링크
  - 예시: `https://www.myproject.io/nft/123`

- **attributes**: 특성과 그 값의 배열. 이들은 [Attributes Plugin](/core/plugins/attribute)을 사용하여 대안적으로 온체인에 저장될 수 있습니다
  - 예시:
    ```json
    {
      "trait_type": "Background",
      "value": "Galaxy"
    }
    ```

- **properties**: 파일과 카테고리를 포함한 추가 메타데이터
  - **files**: NFT와 연관된 모든 자산의 배열. `type`은 파일의 [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types)입니다.
    ```json
    {
      "uri": "https://arweave.net/abc123...?ext=png",
      "type": "image/png"
    }
    ```