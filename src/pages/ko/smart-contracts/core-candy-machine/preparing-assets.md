---
title: Core Candy Machine을 위한 자산 준비
metaTitle: 자산 준비 | Core Candy Machine
description: Solana에서 Core Candy Machine에 업로드하기 위해 이미지 파일, 애니메이션 미디어, JSON 메타데이터를 준비하는 방법입니다.
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
  - q: Core Candy Machine 자산에 가장 좋은 이미지 형식은 무엇인가요?
    a: PNG와 JPEG가 지갑과 마켓플레이스 전반에서 가장 널리 지원되는 형식입니다. PNG는 픽셀 아트나 투명도가 필요한 이미지에 이상적이며, JPEG는 사진이나 고품질 아트워크에 작은 파일 크기로 잘 작동합니다. 가능하면 이미지를 웹 전달에 최적화하여 파일 크기를 1MB 미만으로 유지하세요.
  - q: NFT 메타데이터와 이미지에 어떤 저장소 제공자를 사용해야 하나요?
    a: Arweave (Irys를 통한)가 SOL로 지불하는 영구적이고 분산화된 저장소를 제공하므로 가장 인기 있는 선택입니다. IPFS는 또 다른 분산화 옵션이지만 지속성을 보장하기 위해 피닝 서비스가 필요합니다. 자체 호스팅 솔루션(AWS, Google Cloud)은 작동하지만 중앙화와 지속적인 유지보수 비용이 발생합니다.
  - q: Core Candy Machine 자산에 IPFS를 사용할 수 있나요?
    a: 네, IPFS URI는 Core Candy Machine 자산과 호환됩니다. 하지만 Pinata, nft.storage 또는 전용 IPFS 노드와 같은 피닝 서비스를 사용하여 파일이 계속 접근 가능하도록 해야 합니다. 피닝되지 않은 IPFS 콘텐츠는 시간이 지남에 따라 사용 불가능해질 수 있습니다.
  - q: JSON 메타데이터 파일을 만들기 전에 이미지를 먼저 업로드해야 하나요?
    a: 네. JSON 메타데이터 파일은 "image" 필드와 "properties.files" 배열에서 이미지 URI를 참조합니다. 모든 이미지와 애니메이션 파일을 먼저 업로드하고 URI를 수집한 다음, 메타데이터 자체를 업로드하기 전에 각 해당 JSON 메타데이터 파일에 해당 URI를 삽입해야 합니다.
  - q: 1,000개 아이템 컬렉션을 위해 몇 개의 파일을 준비해야 하나요?
    a: 1,000개 아이템 컬렉션의 경우 최소 1,000개의 이미지 파일과 1,000개의 JSON 메타데이터 파일이 필요하며, Core Collection 자체를 위한 추가 이미지 1개와 JSON 메타데이터 파일 1개가 필요합니다. 자산에 애니메이션 파일(비디오, 오디오, VR, HTML)이 포함되어 있다면 1,000개의 애니메이션 파일도 필요합니다.
---

## 요약

[Core Candy Machine](/ko/smart-contracts/core-candy-machine)을 위한 자산 준비는 이미지 파일과 JSON 메타데이터를 저장소 제공자에 업로드한 다음, 민팅된 모든 자산을 함께 그룹화하는 [Core Collection](/ko/smart-contracts/core/collections)을 생성하는 과정을 필요로 합니다.

- Arweave(Irys를 통한) 또는 IPFS와 같은 분산화 저장소, 또는 자체 호스팅 솔루션에 이미지와 애니메이션 파일을 업로드합니다 {% .lead %}
- 업로드된 이미지 URI를 포함하여 Metaplex 토큰 표준을 따르는 JSON 메타데이터 파일을 작성합니다 {% .lead %}
- 완성된 JSON 메타데이터 파일을 업로드하고 구성 라인으로 사용할 결과 URI를 기록합니다 {% .lead %}
- Candy Machine에서 민팅된 모든 자산의 부모 역할을 하는 [Core](/ko/smart-contracts/core) Collection을 생성합니다 {% .lead %}

## 필수 자산 파일

Core Candy Machine에서 민팅되는 모든 [Core](/ko/smart-contracts/core) 자산은 머신을 [생성](/ko/smart-contracts/core-candy-machine/create)하고 채우기 전에 두 가지 카테고리의 준비된 파일이 필요합니다.
여기에는 다음이 포함됩니다:

- 이미지 및 애니메이션 파일
- JSON 메타데이터 파일

## 지원되는 자산 유형

Core 자산은 지갑과 마켓플레이스가 콘텐츠를 렌더링하는 방식을 결정하는 다섯 가지 미디어 카테고리를 지원합니다:

- image
- video
- audio
- vr
- html

## 이미지 파일 준비

이미지 파일은 각 자산의 기본 시각적 표현 역할을 하며 모든 지갑과 마켓플레이스에 표시됩니다. 형식에 대한 강제 제한은 없지만, 이미지를 웹 전달에 최적화하는 것이 모범 사례입니다. 모든 사용자가 고속 인터넷에 접근할 수 있는 것은 아닙니다 -- 원격 지역의 사용자는 큰 파일을 로드하는 데 어려움을 겪을 수 있으므로, 이미지를 1MB 미만으로 유지하면 전체 사용자의 경험이 향상됩니다.

자산이 `audio`, `video`, `html`, 또는 `vr` 유형이더라도 다른 자산 유형의 로딩을 지원하지 않을 수 있는 지갑이나 마켓플레이스 같은 영역의 대체 이미지로 사용될 것이므로 이미지를 준비하는 것이 여전히 가치가 있습니다.

## 애니메이션 및 미디어 파일 준비

애니메이션 및 미디어 파일은 나머지 자산 카테고리인 `audio`, `video`, `vr`, `html`을 포함합니다. 이미지에 적용되는 것과 동일한 파일 크기 고려사항이 여기에도 적용됩니다 -- 최종 사용자의 다운로드 시간을 최소화하기 위해 파일을 가능한 한 작게 유지하세요.

다음 파일 유형은 테스트되었으며 거의 모든 주요 지갑과 마켓플레이스에서 작동하는 것이 확인되었습니다.

- video (.mp4)
- audio (.wav, .mp3)
- vr (.glb)
- html (.html)

## JSON 메타데이터 파일 준비

JSON 메타데이터 파일은 각 자산의 온체인 속성, 이름, 설명 및 미디어 참조를 정의합니다. 이 파일들은 NFT, pNFT, cNFT를 포함한 다른 Metaplex 자산 유형에서 사용하는 것과 동일한 토큰 표준을 따릅니다.

{% partial file="token-standard-full.md" /%}

## 자동화된 이미지 및 메타데이터 생성기

여러 오픈 소스 스크립트와 웹 애플리케이션이 레이어드 아트워크에서 대량의 자산 이미지와 JSON 메타데이터 파일을 생성할 수 있습니다. 아트 레이어와 프로젝트 매개변수를 제공하면 생성기가 전체 이미지-메타데이터 쌍 세트를 생성합니다.

| 이름                                                        | 유형   | 난이도     | 요구사항     | 무료 |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | script | ⭐⭐⭐⭐   | JS 지식     | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | script | ⭐⭐⭐⭐   | JS 지식     | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | web UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | web UI | unknown    |              |      |

## 자산 파일 업로드

모든 이미지와 애니메이션 파일은 JSON 메타데이터에서 참조되기 전에 저장소 제공자에 업로드해야 합니다. 저장소 제공자의 선택은 영속성, 비용, 분산화에 영향을 줍니다.

### 저장소 옵션

#### Arweave/Irys

_"Arweave 네트워크는 데이터를 위한 비트코인과 같습니다: 오픈 원장 내의 영구적이고 분산된 웹입니다." - [arweave.org](https://arweave.org)_

Arweave는 자체 블록체인이므로 파일을 Arweave에 저장하기 위해 브릿지를 사용해야 합니다. [Irys](https://irys.xyz/)는 Solana와 Arweave 사이의 중개자 역할을 하여 AR 대신 SOL로 저장 비용을 지불할 수 있게 하면서 데이터를 Arweave 체인에 업로드하는 것을 대신 처리해줍니다.

자체 [SDK](https://docs.irys.xyz/)를 통해 수동으로 구현하거나 Irys를 통해 Arweave에 업로드하는 [Umi 저장소 플러그인](/ko/dev-tools/umi/storage)을 사용할 수 있습니다.

#### 자체 호스팅

AWS, Google Cloud, 또는 자신의 웹서버에서 자체 호스팅하는 것은 이미지와 메타데이터를 저장하기 위한 유효한 옵션입니다. 데이터가 저장된 위치에서 접근 가능하고 CORS 제한에 의해 차단되지 않는 한 작동합니다. 자체 호스팅 파일이 지갑과 마켓플레이스에서 올바르게 표시되는지 확인하기 위해 몇 개의 테스트 [Core](/ko/smart-contracts/core) 자산이나 소규모 Core Candy Machine을 먼저 만드는 것이 권장됩니다.

### Umi로 파일 업로드

[Umi](/ko/dev-tools/umi)는 업로드 프로세스를 단순화하는 저장소 플러그인을 제공합니다. 현재 다음 플러그인이 지원됩니다:

- Irys
- AWS

#### Umi로 Irys를 통해 Arweave에 업로드하기

Umi로 파일을 업로드하는 것에 대한 더 자세한 내용은 [Umi Storage](/ko/dev-tools/umi/storage)를 방문하세요.

{% dialect-switcher title="Umi로 Irys를 통해 Arweave에 파일 업로드하기" %}
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

### JSON 메타데이터 파일에 이미지 URI 할당

모든 이미지와 애니메이션 파일이 저장소 제공자에 업로드되면, 반환된 URI를 각 해당 JSON 메타데이터 파일에 삽입해야 합니다. 자산 컬렉션에 1,000개의 자산이 있다면 1,000개의 이미지 또는 애니메이션 파일을 업로드하고 각 파일이 저장된 위치를 나타내는 URI 세트를 받아야 합니다. 업로드 플랫폼이 배치 업로드를 지원하지 않는 경우 수동으로 링크를 로그하고 저장해야 할 수 있습니다.

이 시점의 목표는 업로드된 모든 미디어에 대한 완전한 URI 목록을 갖는 것입니다.

```js
[
  https://example.com/1.jpg
  https://example.com/2.jpg
  ...
]

```

업로드된 미디어의 인덱스 URI 목록으로 JSON 메타데이터 파일을 반복하여 적절한 위치에 URI를 추가해야 합니다.

이미지 URI는 `image:` 필드와 `properties: files: []` 배열에 삽입됩니다.

```json
{
  "name": "My Nft #1",
  "description": "This is My Nft Collection",
  "image": "https://example.com/1.jpg", <---- 여기에 채우세요.
  ...
  "properties": {
    "files": [
      {
        "uri": "https://example.com/1.jpg",
        "type": "image/jpg"
      }, <---- files 배열에 객체 항목을 만드세요.
    ]
  }
}
```

### JSON 메타데이터 파일 업로드

이 시점에서 다음과 같은 JSON 메타데이터 파일 폴더가 로컬 머신에 구축되어 있어야 합니다:

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

모든 JSON 메타데이터를 선택한 저장 매체에 업로드하고 향후 사용을 위해 모든 URI를 다시 로그해야 합니다.

## Core Collection 생성

자산 준비의 마지막 단계는 Core Candy Machine이 민팅된 모든 자산을 함께 그룹화하는 데 사용하는 [Core Collection](/ko/smart-contracts/core/collections)을 생성하는 것입니다. 이를 위해 `mpl-core` 패키지가 필요합니다.

{% callout %}
Core Collection을 생성하는 데 필요한 데이터를 갖기 위해 이전 단계와 같이 이미지를 업로드하고 JSON 메타데이터를 준비하고 업로드해야 합니다.
{% /callout %}

아래 예제는 플러그인이 없는 기본 Core Collection을 생성합니다. 사용 가능한 플러그인 목록과 더 고급 [Core Collection](/ko/smart-contracts/core/collections) 생성을 보려면 [Collection Management](/ko/smart-contracts/core/collections)에서 문서를 볼 수 있습니다.

{% dialect-switcher title="MPL Core Collection 생성하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, umi } from '@metaplex-foundation/umi'
import { createCollectionV1 } from '@metaplex-foundation/mpl-core'

const mainnet = 'https://api.mainnet-beta.solana.com'
const devnet = 'https://api.devnet.solana.com'

const keypair = // 키페어 할당

const umi = createUmi(mainnet)
.use(keypairIdentity(keypair)) // 선택한 신원 서명자를 할당합니다.
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

## 참고사항

- 모든 이미지를 웹 전달에 최적화하세요. 디바이스와 네트워크 조건 전반에서 빠른 로딩을 보장하기 위해 가능하면 파일 크기를 1MB 미만으로 유지하세요.
- 자체 호스팅 자산의 경우 CORS 헤더가 올바르게 구성되었는지 확인하세요. CORS에 의해 차단된 자산은 지갑이나 마켓플레이스에서 렌더링되지 않습니다.
- 업로드된 모든 URI를 안전하게 저장하고 백업하세요. 이미지 업로드 후 URI 목록을 분실하면 메타데이터를 올바른 파일에 연결할 수 없습니다.
- Arweave 저장소는 영구적이고 불변입니다. Arweave에 저장된 파일은 삭제하거나 수정할 수 없으므로 업로드 전에 파일 내용을 다시 확인하세요.
- JSON 메타데이터 파일은 이미지 파일 *이후에* 업로드해야 합니다. 메타데이터가 업로드 완료 후에만 사용할 수 있는 이미지 URI를 참조하기 때문입니다.

## 결론

이 시점에서 [Core Candy Machine을 생성](/ko/smart-contracts/core-candy-machine/create)하는 데 필요한 모든 준비를 완료했어야 합니다.

- 이미지 및 기타 미디어 파일 업로드
- JSON 메타데이터 파일에 이미지 및 미디어 파일 URI 할당
- JSON 메타데이터 파일 업로드 및 URI 저장
- [Core Collection](/ko/smart-contracts/core/collections) 생성

## FAQ

### Core Candy Machine 자산에 가장 좋은 이미지 형식은 무엇인가요?

PNG와 JPEG가 지갑과 마켓플레이스 전반에서 가장 널리 지원되는 형식입니다. PNG는 픽셀 아트나 투명도가 필요한 이미지에 이상적이며, JPEG는 사진이나 고품질 아트워크에 작은 파일 크기로 잘 작동합니다. 가능하면 이미지를 웹 전달에 최적화하여 파일 크기를 1MB 미만으로 유지하세요.

### NFT 메타데이터와 이미지에 어떤 저장소 제공자를 사용해야 하나요?

Arweave(Irys를 통한)가 SOL로 지불하는 영구적이고 분산화된 저장소를 제공하므로 가장 인기 있는 선택입니다. IPFS는 또 다른 분산화 옵션이지만 지속성을 보장하기 위해 피닝 서비스가 필요합니다. 자체 호스팅 솔루션(AWS, Google Cloud)은 작동하지만 중앙화와 지속적인 유지보수 비용이 발생합니다.

### Core Candy Machine 자산에 IPFS를 사용할 수 있나요?

네, IPFS URI는 Core Candy Machine 자산과 호환됩니다. 하지만 Pinata, nft.storage 또는 전용 IPFS 노드와 같은 피닝 서비스를 사용하여 파일이 계속 접근 가능하도록 해야 합니다. 피닝되지 않은 IPFS 콘텐츠는 시간이 지남에 따라 사용 불가능해질 수 있습니다.

### JSON 메타데이터 파일을 만들기 전에 이미지를 먼저 업로드해야 하나요?

네. JSON 메타데이터 파일은 `image` 필드와 `properties.files` 배열에서 이미지 URI를 참조합니다. 모든 이미지와 애니메이션 파일을 먼저 업로드하고 URI를 수집한 다음, 메타데이터 자체를 업로드하기 전에 각 해당 JSON 메타데이터 파일에 해당 URI를 삽입해야 합니다.

### 1,000개 아이템 컬렉션을 위해 몇 개의 파일을 준비해야 하나요?

1,000개 아이템 컬렉션의 경우 최소 1,000개의 이미지 파일과 1,000개의 JSON 메타데이터 파일이 필요하며, [Core Collection](/ko/smart-contracts/core/collections) 자체를 위한 추가 이미지 1개와 JSON 메타데이터 파일 1개가 필요합니다. 자산에 애니메이션 파일(비디오, 오디오, VR, HTML)이 포함되어 있다면 1,000개의 애니메이션 파일도 필요합니다.

## 용어집

| 용어 | 정의 |
| --- | --- |
| JSON Metadata (JSON 메타데이터) | 자산의 이름, 설명, 이미지 URI, 속성 및 관련 미디어 파일을 정의하는 Metaplex 토큰 표준에 부합하는 구조화된 JSON 파일입니다. |
| URI | Uniform Resource Identifier -- 업로드된 파일(이미지, 애니메이션 또는 메타데이터)이 저장되고 검색될 수 있는 웹 주소입니다. |
| Arweave | 불변 데이터 저장을 위해 설계된 영구적이고 분산화된 저장소 블록체인입니다. Arweave에 업로드된 파일은 무기한 지속됩니다. |
| Irys | Solana 사용자가 SOL로 Arweave 저장 비용을 지불할 수 있게 하는 브릿지 서비스(이전 Bundlr)로, 크로스 체인 업로드 프로세스를 처리합니다. |
| IPFS | InterPlanetary File System -- 피어 투 피어 분산화 저장 프로토콜입니다. 장기적인 파일 가용성을 보장하기 위해 피닝 서비스가 필요합니다. |
| Config Line (구성 라인) | Core Candy Machine에 삽입되는 이름-URI 쌍으로, 저장소의 단일 자산 JSON 메타데이터 파일에 매핑됩니다. |
| Core Collection | Candy Machine에서 민팅된 모든 자산의 부모 컬렉션 역할을 하며 관련 자산을 함께 그룹화하는 Metaplex Core 온체인 계정입니다. |
| Token Standard (토큰 표준) | NFT 메타데이터에 대한 필수 및 선택 필드(이름, 설명, 이미지, 속성, 속성)를 지정하는 Metaplex 정의 JSON 스키마입니다. |

