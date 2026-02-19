---
title: Solana에서 NFT를 만드는 방법
metaTitle: Solana에서 NFT를 만드는 방법 | Token Metadata 가이드
description: Metaplex로 Solana 블록체인에서 NFT를 만드는 방법을 배우세요.
# /components/products/guides/index.js의 날짜도 업데이트하는 것을 잊지 마세요
created: '06-16-2024'
updated: '06-18-2024'
---

이것은 Metaplex Token Metadata 프로토콜을 사용하여 Solana 블록체인에서 NFT를 만드는 방법에 대한 초기 가이드입니다.

## 전제조건

- 선택한 코드 에디터 (Visual Studio Code 권장)
- Node 18.x.x 이상.

## 초기 설정

이 가이드는 단일 파일 스크립트를 기반으로 한 Javascript를 사용한 NFT 생성을 다룹니다. 필요에 따라 함수를 수정하고 이동해야 할 수 있습니다.

### 초기화

선택한 패키지 매니저(npm, yarn, pnpm, bun)로 새 프로젝트를 초기화하고(선택사항) 프롬프트가 나타나면 필요한 세부 정보를 입력하여 시작하세요.

```js
npm init
```

### 필수 패키지

이 가이드에 필요한 패키지를 설치하세요.

{% code-tabs-imported from="token-metadata/getting-started" frameworks="umi,kit" /%}

## SDK 설정

{% code-tabs-imported from="token-metadata/getting-started" frameworks="umi,kit" /%}

## NFT 생성

### 이미지 업로드

가장 먼저 해야 할 일은 NFT를 나타내고 인식 가능하게 만드는 이미지를 업로드하는 것입니다. 이것은 jpeg, png 또는 gif 형태일 수 있습니다.

Umi는 Arweave, NftStorage, AWS, ShdwDrive와 같은 스토리지 솔루션에 업로드할 수 있는 다운로드 가능한 스토리지 플러그인과 함께 제공됩니다. 이 가이드의 시작 부분에서 Arweave 블록체인에 콘텐츠를 저장하는 `irysUploader()` 플러그인을 설치했습니다.

{% callout title="로컬 스크립트/Node.js" %}
이 예제는 Irys를 사용하여 Arweave에 업로드하는 로컬 스크립트/node.js 접근 방식을 사용합니다. 다른 스토리지 제공업체에 파일을 업로드하거나 브라우저에서 업로드하려면 다른 접근 방식을 취해야 합니다. 브라우저 시나리오에서는 `fs`를 가져와서 사용하는 것이 작동하지 않습니다.
{% /callout %}

{% code-tabs-imported from="token-metadata/upload-assets" frameworks="umi" /%}

### 메타데이터 업로드

유효하고 작동하는 이미지 URI를 얻으면 NFT의 메타데이터 작업을 시작할 수 있습니다.

오프체인 메타데이터의 표준은 다음과 같습니다:

```json
{
  "name": "My NFT",
  "description": "This is an NFT on Solana",
  "image": "https://arweave.net/my-image",
  "external_url": "https://example.com/my-nft.json",
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
        "uri": "https://arweave.net/my-image",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

필드 설명:

#### name

토큰의 이름.

#### symbol

토큰의 약어. Solana의 약어는 `SOL`입니다.

#### description

토큰의 설명.

#### image

이전에 업로드한 imageUri(또는 이미지의 온라인 위치)로 설정됩니다.

### NFT vs pNFT

Token Metadata 프로그램은 일반 NFT와 pNFT(프로그래머블 Non-Fungible Asset) 두 가지 종류의 NFT를 민팅할 수 있습니다.
두 유형의 NFT 간의 주요 차이점은 하나는 로열티가 강제되고(pNFT) 다른 하나는 그렇지 않다는 것입니다(NFT).

#### NFT

- 로열티 강제 없음
- 초기 설정이 더 간단하고 향후 작업이 더 쉬움

#### pNFT

- 향후 개발과 관련하여 더 많은 계정을 다뤄야 함
- 로열티 강제
- 프로그래머블 - 프로그램이 전송을 차단할 수 있는 규칙 세트가 있음

### NFT 민팅

여기에서 사용하려는 NFT 민트 명령어 유형(`NFT` 또는 `pNFT`)을 선택할 수 있습니다.

#### NFT

{% code-tabs-imported from="token-metadata/create-nft" frameworks="umi,kit" /%}

#### pNFT

{% code-tabs-imported from="token-metadata/create-pnft" frameworks="umi,kit" /%}

## 다음 단계

이 가이드는 기본 NFT를 만드는 데 도움이 되었습니다. 여기에서 [Token Metadata 프로그램](/smart-contracts/token-metadata)으로 이동하여 컬렉션 만들기, 새 NFT를 컬렉션에 추가하기, NFT로 수행할 수 있는 다양한 기타 상호 작용을 확인할 수 있습니다.
