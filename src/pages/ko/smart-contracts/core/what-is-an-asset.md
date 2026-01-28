---
title: MPL Core 자산
metaTitle: Core 자산이란 무엇인가 | Metaplex Core
description: Solana에서 Core Asset이 무엇인지 알아보세요. 단일 계정 NFT 모델, 계정 구조, 컬렉션 멤버십, 오프체인 메타데이터를 이해합니다.
---

이 페이지는 **Core Asset이 무엇인지** 그리고 전통적인 Solana NFT와 어떻게 다른지 설명합니다. 계정 구조, 컬렉션 관계, 메타데이터 저장에 대해 이해합니다. {% .lead %}

{% callout title="주요 개념" %}

- **단일 계정 모델**: Core Assets는 Asset 계정 자체 내에 소유권을 저장합니다
- **토큰 계정 불필요**: SPL 토큰과 달리 Core는 Associated Token Account가 필요하지 않습니다
- **컬렉션 멤버십**: Assets는 updateAuthority 필드를 통해 컬렉션에 속할 수 있습니다
- **오프체인 메타데이터**: URI는 Arweave/IPFS에 저장된 JSON 메타데이터를 가리킵니다

{% /callout %}

## 요약

Core Asset은 NFT를 나타내는 단일 Solana 계정입니다. Token Metadata (3개 이상의 계정 필요)와 달리 Core는 하나의 계정에 모든 필수 데이터를 저장합니다: 소유자, 이름, URI, Update Authority. 이로 인해 Core Assets는 약 80% 더 저렴하고 작업하기 쉽습니다.

## 개요

[Solana의 Token 프로그램](https://spl.solana.com/token)과 같은 기존 자산 프로그램과 구별되는 점은, Metaplex Core와 Core 자산(때때로 Core NFT 자산이라고 불림)은 연관 토큰 계정과 같은 여러 계정에 의존하지 않는다는 것입니다. 대신 Core 자산은 지갑과 "민트" 계정 간의 관계를 자산 자체 내에 저장합니다.

{% diagram %}
{% node %}
{% node #wallet label="지갑 계정" theme="indigo" /%}
{% node label="소유자: 시스템 프로그램" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="누군가의 지갑." theme="transparent" /%}

{% node x="200" parent="wallet" %}
{% node #asset label="자산 계정" theme="blue" /%}
{% node label="소유자: Core 프로그램" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
소유자를 포함한 \
자산에 대한 정보를 저장
{% /node %}

{% edge from="wallet" to="asset" /%}

{% /diagram %}

## Core 자산 계정

Core 자산 계정은 디지털 자산을 위한 최소한의 데이터를 나타냅니다. 이 구조는 온체인 소유권을 위한 편견 없는 블록체인 원시 요소를 제공합니다.

{% diagram %}
{% node %}
{% node #wallet label="지갑 계정" theme="indigo" /%}
{% node label="소유자: 시스템 프로그램" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="자산 계정" theme="blue" /%}
{% node label="소유자: Core 프로그램" theme="dimmed" /%}
{% node label="Key = Asset" /%}
{% node label="Owner" /%}
{% node label="Update Authority" /%}
{% node label="Name" /%}
{% node label="URI" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
{% /node %}

{% edge from="wallet" to="asset" /%}

{% /diagram %}

{% seperator h="6" /%}

{% totem %}
{% totem-accordion title="온체인 자산 계정 구조" %}

MPL Core 자산의 온체인 계정 구조입니다. [링크](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| 이름             | 타입            | 크기 | 설명                                                      |                                                                                                                            |
| ---------------- | --------------- | ---- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| key              | u8              | 1    | 계정 타입의 구분자                                         |                                                                                                                            |
| owner            | pubKey          | 32   | 자산의 소유자                                              |                                                                                                                            |
| update_authority | enum<publicKey> | 33   | 새 자산의 권한 또는 CollectionID                           | [링크](https://github.com/metaplex-foundation/mpl-core/blob/main/clients/rust/src/generated/types/update_authority.rs#L14) |
| name             | string          | 36   | 자산의 이름                                                |                                                                                                                            |
| uri              | string          | 204  | 오프체인 데이터를 가리키는 자산의 URI                       |                                                                                                                            |
| seq              | string          |      | 압축과 함께 색인화에 사용되는 시퀀스 번호                   |                                                                                                                            |

{% /totem-accordion %}
{% /totem %}

## 내 Asset이 컬렉션에 속해 있나요?

MPL Core 자산은 컬렉션에 속할 수 있습니다. MPL Core 자산 데이터의 `updateAuthority` 필드는 두 가지 역할을 제공합니다. 자산의 Update Authority를 보고하거나 자산이 속한 MPL Core 컬렉션의 publicKey를 제공합니다.

자산을 통해 직접 또는 MPL Core 자산의 `collectionAddress` 헬퍼를 통해 `updateAuthority` 필드에 액세스할 때, 반환되는 결과는 다음 결과 중 하나가 됩니다:

**컬렉션**

자산이 주어진 주소의 컬렉션에 속합니다.
{% dialect-switcher title="자산 생성" %}
{% dialect title="JavaScript" id="js" %}

```javascript
{
  __kind: 'Collection'
  fields: [PublicKey]
}
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// 로그
collection: '2222222222222222222222222222222'
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'Collection',
      address: '2222222222222222222222222222222'
    },
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
    ...
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
Collection(Pubkey)
```

{% /dialect %}
{% /dialect-switcher %}

**주소**

자산에 Update Authority가 설정되어 있고 컬렉션에 속하지 않습니다.
{% dialect-switcher title="자산 생성" %}
{% dialect title="JavaScript" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// 로그
collectionId: undefined
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'Address',
      address: '2222222222222222222222222222222'
    }
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
    ...
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
Address(Pubkey)
```

{% /dialect %}
{% /dialect-switcher %}

**없음**

자산에 Update Authority가 설정되지 않았습니다.

{% dialect-switcher title="자산 생성" %}
{% dialect title="JavaScript" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// 로그
collectionId: undefined
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'None',
    },
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
None
```

{% /dialect %}
{% /dialect-switcher %}

## 오프체인 메타데이터

자산 계정의 중요한 속성 중 하나는 오프체인의 JSON 파일을 가리키는 `URI` 속성입니다. 이는 온체인 데이터 저장과 관련된 수수료의 제약을 받지 않으면서 안전하게 추가 데이터를 제공하는 데 사용됩니다. 그 JSON 파일은 누구나 토큰에서 유용한 정보를 찾는 데 사용할 수 있는 [특정 표준](/ko/smart-contracts/token-metadata/token-standard)을 따릅니다.

오프체인 메타데이터는 공개적으로 액세스 가능한 모든 위치에 저장할 수 있습니다. JSON 파일을 호스팅하는 인기 있는 장소는 다음과 같습니다:

- Arweave
- NFT.Storage/IPFS
- Amazon AWS S3/Google Cloud

{% diagram %}
{% node %}
{% node #wallet label="지갑 계정" theme="indigo" /%}
{% node label="소유자: 시스템 프로그램" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="자산 계정" theme="blue" /%}
{% node label="소유자: Core 프로그램" theme="dimmed" /%}
{% node label="Key = Asset" /%}
{% node label="Owner" /%}
{% node label="Update Authority" /%}
{% node label="Name" /%}
{% node #uri label="URI" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
{% /node %}

{% node parent="uri" x="-200" y="-23" %}
{% node #json theme="slate" %}
오프체인 \
JSON 메타데이터
{% /node %}
{% node label="이름" /%}
{% node label="설명" /%}
{% node label="이미지" /%}
{% node label="애니메이션 URL" /%}
{% node label="속성" /%}
{% node label="..." /%}
{% /node %}

{% edge from="wallet" to="asset" /%}
{% edge from="uri" to="json" path="straight" /%}

{% /diagram %}

{% partial file="token-standard-full.md" /%}

{% totem %}
{% totem-accordion title="예시" %}

```json
{
  "name": "SolanaArtProject #1",
  "description": "Generative art on Solana.",
  "image": "https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg",
  "animation_url": "https://arweave.net/ZAultcE_eAzv26YdhY1uu9uiA3nmDZYwP8MwuiA3nm?ext=glb",
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
        "uri": "https://www.arweave.net/abcd5678?ext=png",
        "type": "image/png"
      },
      {
        "uri": "https://watch.videodelivery.net/9876jkl",
        "type": "unknown",
        "cdn": true
      },
      {
        "uri": "https://www.arweave.net/efgh1234?ext=mp4",
        "type": "video/mp4"
      }
    ],
    "category": "video"
  }
}
```

{% /totem-accordion %}
{% /totem %}

이 JSON 파일은 업데이트할 수 없도록 Arweave와 같은 영구 저장 솔루션을 사용하여 저장할 수 있습니다. 또한 `Update Authority` 필드를 None으로 설정하여 불변으로 만들고, 따라서 `URI`와 `Name` 속성이 변경되는 것을 금지할 수 있습니다. 이 조합을 사용하여 오프체인 JSON 파일의 불변성을 보장할 수 있습니다.

## FAQ

### Core는 Token Metadata NFT와 어떻게 다른가요?

Token Metadata는 3개 이상의 계정 (민트, 메타데이터, 토큰 계정)이 필요합니다. Core는 소유자와 메타데이터를 함께 저장하는 단일 계정을 사용합니다. 이로 인해 Core는 약 80% 더 저렴하고 생성이 빠릅니다.

### 온체인과 오프체인에 어떤 데이터가 저장되나요?

**온체인**: 소유자, 이름, URI, Update Authority, 플러그인. **오프체인** (URI에서): 설명, 이미지, 속성, 애니메이션 URL, 기타 확장 메타데이터.

### Token Metadata NFT를 Core로 변환할 수 있나요?

직접은 안 됩니다. Core와 Token Metadata는 별도의 표준입니다. 이전 NFT를 소각하고 새 Core Asset을 민팅해야 합니다. 이 프로세스를 돕는 일부 마이그레이션 도구가 있습니다.

### Core는 기존 NFT 마켓플레이스와 호환되나요?

대부분의 주요 Solana 마켓플레이스는 Core Assets를 지원합니다. 호환되는 플랫폼의 현재 목록은 [에코시스템 지원](/ko/smart-contracts/core/ecosystem-support)을 확인하세요.

### 오프체인 메타데이터가 오프라인이 되면 어떻게 되나요?

Asset은 이름과 URI와 함께 온체인에 계속 존재하지만 이미지/속성에 액세스할 수 없습니다. 이를 방지하려면 영구 저장소 (Arweave, 피닝이 있는 IPFS)를 사용하세요.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Asset** | NFT를 나타내는 단일 Core 계정 |
| **Owner** | 현재 Asset을 소유한 지갑 |
| **Update Authority** | Asset 메타데이터를 수정할 권한이 있는 계정 |
| **URI** | 오프체인 JSON 메타데이터를 가리키는 URL |
| **Collection** | 관련 Assets를 그룹화하는 Core 계정 |
| **Key** | 계정 유형을 식별하는 계정 구분자 |
| **seq** | 압축 인덱싱에 사용되는 시퀀스 번호 |

---

*Metaplex Foundation에서 관리 · 2026년 1월 최종 확인 · @metaplex-foundation/mpl-core에 적용*
