---
title: JSON 스키마
metaTitle: JSON 스키마 | Core
description: Metaplex Core 자산의 오프체인 JSON 스키마 구조와 요구 사항을 이해합니다.
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
Metaplex Core 자산의 오프체인 JSON 메타데이터는 Metaplex Token Metadata 표준과 유사합니다. 그러나 플러그인을 사용하여 자산 자체에 더 많은 데이터를 온체인에 저장할 수 있으므로 속성과 같은 일부 데이터는 추가로 온체인에 저장할 수 있습니다.
## 스키마 예제
아래는 알려진 다양한 NFT 유형에 대한 예제입니다. 이러한 모든 다른 유형은 `image`, `animation_url` 및 `properties` 필드를 사용하여 단일 Asset의 일부가 될 수도 있다는 점에 유의하세요. 모든 다른 필드는 [JSON 스키마 필드](#json-스키마-필드) 섹션에서 자세히 설명합니다.
{% totem title="예제" id="schema-examples" %}
{% totem-accordion title="이미지" %}
Attributes는 [Attributes 플러그인](/smart-contracts/core/plugins/attribute)을 사용하여 온체인에 저장할 수도 있습니다.
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
{% totem-accordion title="애니메이션 GIF" %}
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
{% totem-accordion title="비디오" %}
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
{% totem-accordion title="오디오" %}
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
대부분의 익스플로러와 지갑이 `.glb` 파일을 지원하지만 스키마의 일부로 대체 이미지를 포함하는 것이 좋습니다.
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
다음 HTML Asset 예제는 현재 지갑에서 지원되지 않으며 보안 위험으로 간주될 수 있습니다. 그러나 일부 익스플로러는 올바르게 렌더링하므로 HTML Asset을 지원하지 않는 모든 도구에 대해 대체 이미지를 포함하는 것이 좋습니다.
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
## JSON 스키마 필드
아래에서 다양한 필드에 대한 설명을 찾을 수 있습니다.
Metaplex Token Metadata에서 알고 있던 일부 필드가 없다면 아마도 더 이상 사용되지 않을 것입니다. 예를 들어 `creators`는 이제 [Royalties 플러그인](/smart-contracts/core/plugins/royalties)의 일부입니다.
### 필수 필드
- **name**: NFT 자산의 이름
  - 예: "Solana Monkey #123", "Degen Ape #45"

- **description**: NFT에 대한 상세 설명
  - 예: "Solana 블록체인을 통해 떠다니는 희귀한 우주 원숭이"
- **image**: NFT의 기본 이미지를 가리키는 URI
  - 예: `https://arweave.net/123abc...?ext=png`
  - 지원: PNG, GIF, JPG/JPEG
- **category**: NFT 콘텐츠 유형
    - 예: `image`, `video`, `audio`, `vr`, `html`
### 선택 필드

- **animation_url**: 멀티미디어 첨부 파일용 URI
  - 예: `https://arweave.net/xyz789...?ext=mp4`
  - 지원: MP4, GIF, GLB, HTML
- **external_url**: NFT의 외부 웹사이트 링크
  - 예: `https://www.myproject.io/nft/123`
- **attributes**: 특성 및 해당 값의 배열. [Attributes 플러그인](/smart-contracts/core/plugins/attribute)을 사용하여 온체인에 저장할 수도 있습니다.
  - 예:
    ```json
    {
      "trait_type": "Background",
      "value": "Galaxy"
    }
    ```
- **properties**: 파일 및 카테고리를 포함한 추가 메타데이터
  - **files**: NFT와 관련된 모든 자산의 배열. `type`은 파일의 [MIME 유형](https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types)입니다.
    ```json
    {
      "uri": "https://arweave.net/abc123...?ext=png",
      "type": "image/png"
    }
    ```
