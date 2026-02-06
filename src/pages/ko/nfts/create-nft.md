---
title: NFT 생성하기
metaTitle: NFT 생성하기 | NFT
description: Metaplex Core를 사용하여 Solana에서 NFT를 생성하는 방법을 알아보세요
created: '03-12-2025'
updated: '03-12-2025'
---

Metaplex Core를 사용하여 Solana에서 NFT를 생성합니다. {% .lead %}

## 학습 내용

이 가이드에서는 다음을 포함한 NFT 생성 방법을 설명합니다:

- 커스텀 이름과 메타데이터
- 이미지와 설명
- 선택적 속성

## NFT 생성하기

다음 코드는 완전히 실행 가능한 예제입니다. 아래에 커스터마이징할 수 있는 파라미터가 표시됩니다. NFT 생성 세부 사항에 대해서는 [Core 문서](/ko/smart-contracts/core)에서 자세히 알아볼 수 있습니다.

{% code-tabs-imported from="core/create-asset" frameworks="umi,cli" /%}

## 온체인 파라미터

NFT에 맞게 다음 파라미터를 커스터마이징하세요:

| 파라미터 | 설명 |
|-----------|-------------|
| `name` | NFT 이름 (최대 32자) |
| `uri` | 오프체인 메타데이터 JSON 링크 |

## 메타데이터와 이미지

아래는 업로드에 필요한 최소 메타데이터입니다. `external_url`, `attributes`, `properties` 등의 추가 필드는 선택 사항이며, 자세한 설명과 예제는 [JSON 스키마](/ko/smart-contracts/core/json-schema)에서 확인할 수 있습니다. JSON과 이미지를 어디서나 접근할 수 있도록 업로드해야 합니다. Arweave와 같은 web3 스토리지 제공업체 사용을 권장합니다. 코드로 수행하려면 이 [가이드](/ko/guides/general/create-deterministic-metadata-with-turbo)를 따르세요.

```json
{
  "name": "My NFT",
  "description": "An NFT on Solana",
  "image": "https://arweave.net/tx-hash",
  "attributes": []
}
```

## 플러그인

MPL Core 자산은 컬렉션 및 자산 수준 모두에서 플러그인 사용을 지원합니다. 플러그인이 있는 Core Asset을 생성하려면 생성 시 `plugins` 배열 인자에 플러그인 유형과 파라미터를 전달합니다. 플러그인에 대한 자세한 정보는 [플러그인 개요](/ko/smart-contracts/core/plugins) 페이지에서 확인할 수 있습니다. 프로필 사진과 같은 NFT의 맥락에서 [로열티 플러그인](/ko/smart-contracts/core/plugins/royalties)이 일반적인 사용 사례입니다.
