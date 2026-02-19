---
title: 자산 준비하기
metaTitle: 자산 준비하기 | Core Candy Machine
description: Core Candy Machine에 업로드하기 위해 파일과 자산을 준비하는 방법입니다.
---

## 자산 파일

자산을 생성하려면 자산 데이터에서 사용하기 위해 준비하고 업로드해야 하는 몇 가지 다른 파일이 필요합니다.
여기에는 다음이 포함됩니다:

- 이미지 및 애니메이션 파일
- JSON 메타데이터 파일

## 자산 유형

자산은 다음 카테고리를 지원합니다:

- image
- video
- audio
- vr
- html

## 이미지 준비하기

이미지에 대한 고유한 규칙은 없지만, 이미지를 가능한 한 `웹 전달`에 최적화하는 것이 모범 사례입니다. 모든 사용자가 매우 빠른 브로드밴드 연결에 액세스할 수 있는 것은 아니라는 점을 고려해야 합니다. 사용자가 인터넷 액세스가 희박한 원격 지역에 있을 수 있으므로 8MB 이미지를 보도록 하는 것은 프로젝트에 대한 그들의 경험에 영향을 줄 수 있습니다.

자산이 `audio`, `video`, `html`, 또는 `vr` 유형이더라도 다른 자산 유형의 로딩을 지원하지 않을 수 있는 지갑이나 마켓플레이스 같은 영역의 대체 이미지로 사용될 것이므로 이미지를 준비하는 것이 여전히 가치가 있습니다.

## 애니메이션 파일 준비하기

애니메이션 파일은 나머지 자산 카테고리 유형인 `audio`, `video`, `vr`, `html`로 구성됩니다.

이미지 파일 준비와 마찬가지로 여기에도 동일하게 적용됩니다. 사용자를 위한 파일 크기와 예상 다운로드 크기를 고려해야 합니다.

다음 파일 유형은 테스트되었으며 거의 모든 주요 지갑과 마켓플레이스에서 작동하는 것이 확인되었습니다.

- video (.mp4)
- audio (.wav, .mp3)
- vr (.glb)
- html (.html)

## JSON 메타데이터 준비하기

JSON 메타데이터 파일은 다른 Metaplex 표준인 NFT, pNFT, cNFT에서 사용하는 동일한 토큰 표준을 따릅니다.

{% partial file="token-standard-full.md" /%}

## 이미지 및 메타데이터 생성기

아트 레이어와 프로젝트에 대한 기본 정보를 생성기에 제공하면 주어진 매개변수를 기반으로 x개의 자산 이미지와 JSON 메타데이터 조합을 생성하는 여러 자동화된 스크립트와 웹사이트가 있습니다.

| 이름                                                        | 유형   | 난이도     | 요구사항     | 무료 |
| ----------------------------------------------------------- | ------ | ---------- | ------------ | ---- |
| [nftchef](https://github.com/nftchef/art-engine)            | script | ⭐⭐⭐⭐   | JS 지식     | ✅   |
| [hashlips](https://github.com/HashLips/hashlips_art_engine) | script | ⭐⭐⭐⭐   | JS 지식     | ✅   |
| [Nft Art Generator](https://nft-generator.art/)             | web UI | ⭐⭐       |              |      |
| [bueno](https://bueno.art/generator)                        | web UI | unknown    |              |      |

## 파일 업로드하기

### 저장소 옵션

#### Arweave/Irys

_"Arweave 네트워크는 데이터를 위한 비트코인과 같습니다: 오픈 원장 내의 영구적이고 분산된 웹입니다." - [arweave.org](https://arweave.org)_

Arweave는 자체 블록체인이므로 파일을 Arweave에 저장하기 위해 브릿지를 사용해야 합니다. [Irys](https://irys.xyz/)는 Solana와 Arweave 사이의 중개자 역할을 하여 AR 대신 SOL로 저장 비용을 지불할 수 있게 하면서 데이터를 Arweave 체인에 업로드하는 것을 대신 처리해줍니다.

자체 [SDK](https://docs.irys.xyz/)를 통해 수동으로 구현하거나 Irys를 통해 Arweave에 업로드하는 UMI 플러그인을 사용할 수 있습니다.

#### 자체 호스팅

AWS, Google Cloud, 또는 자신의 웹서버에서 이미지나 메타데이터를 자체 호스팅하는 것도 전혀 문제없습니다. 저장된 위치에서 데이터에 액세스할 수 있고 CORS 같은 것이 차단하지 않는 한 괜찮습니다. 자체 호스팅 옵션을 테스트하여 저장된 데이터를 볼 수 있는지 확인하기 위해 몇 개의 테스트 Core 자산이나 소규모 Core Candy Machine을 만드는 것이 권장됩니다.

### Umi로 파일 업로드하기

Umi에는 플러그인을 통해 업로드 프로세스를 도와주는 몇 가지 플러그인이 있습니다. 현재 다음 플러그인이 지원됩니다:

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

### JSON 메타데이터 파일에 이미지 URI 할당하기

선택한 저장 매체에 모든 이미지 파일을 업로드했으면 JSON 메타데이터 파일에 모든 이미지 URI를 배치해야 합니다.

자산 컬렉션에 1000개의 자산이 있다면 저장 플랫폼에 1000개의 이미지/애니메이션 미디어를 업로드하고 각 이미지/애니메이션 미디어가 저장된 위치를 알려주는 데이터/로그/방법을 받아야 합니다. 선택한 업로드 플랫폼이 배치 업로드를 지원하지 않고 단일 루프 업로드를 해야 하는 경우 수동으로 링크를 로그하고 저장해야 할 수 있습니다.

이 시점의 목표는 미디어가 있는 위치의 URI 전체 목록을 갖는 것입니다.

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

### JSON 메타데이터 파일 업로드하기

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

## Core Collection 자산 생성하기

Core Candy Machine 생성을 위한 준비의 마지막 단계는 Core Candy Machine이 사용자가 Core Candy Machine에서 구매하는 모든 자산을 함께 그룹화하는 데 사용할 수 있는 Core Collection을 생성하는 것입니다. 이를 위해 `mpl-core` 패키지가 필요합니다.

{% callout %}
Core Collection을 생성하는 데 필요한 데이터를 갖기 위해 이전 단계와 같이 이미지를 업로드하고 JSON 메타데이터를 준비하고 업로드해야 합니다.
{% /callout %}

아래 예제는 플러그인이 없는 기본 Core Collection을 생성합니다. 사용 가능한 플러그인 목록과 더 고급 Core Collection 생성을 보려면 Core의 [Collection Management](/ko/smart-contracts/core/collections)에서 문서를 볼 수 있습니다.

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

## 결론

이 시점에서 Core Candy Machine을 생성하기 위해 필요한 모든 준비를 완료했어야 합니다.

- 이미지 및 기타 미디어 파일 업로드
- JSON 메타데이터 파일에 이미지 및 미디어 파일 URI 할당
- JSON 메타데이터 파일 업로드 및 URI 저장
- Core Collection 생성
