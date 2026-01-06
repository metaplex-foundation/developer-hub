---
title: 표시 옵션
metaTitle: 표시 옵션 | DAS API
description: DAS API 메서드에서 사용 가능한 표시 옵션에 대해 알아보세요
---

DAS API는 응답에 포함할 추가 정보를 제어할 수 있는 표시 옵션을 제공합니다. 이러한 옵션은 여러 API 메서드에서 `options` 객체 매개변수로 사용할 수 있습니다.

## 사용 가능한 표시 옵션

| 옵션 | 타입 | 설명 | 기본값 |
|--------|------|-------------|---------|
| `showCollectionMetadata` | boolean | `true`일 때 응답에 컬렉션 메타데이터를 포함합니다. 자산이 속한 컬렉션에 대한 정보를 제공합니다. | `false` |
| `showFungible` | boolean | `true`일 때 응답에 대체 가능한 토큰 정보를 포함합니다. 대체 가능한 토큰을 나타내는 자산이나 `getAssetsByOwner`로 모든 자산을 실제로 보고 싶을 때 유용합니다. | `false` |
| `showInscription` | boolean | `true`일 때 응답에 인스크립션 데이터를 포함합니다. 포함된 자산과 관련된 인스크립션에 대한 정보를 제공합니다. | `false` |
| `showUnverifiedCollections` | boolean | `true`일 때 응답에 검증되지 않은 컬렉션을 포함합니다. 기본적으로 검증된 컬렉션만 표시됩니다. | `false` |
| `showZeroBalance` | boolean | `true`일 때 응답에 잔액이 0인 토큰 계정을 포함합니다. 기본적으로 잔액이 0이 아닌 계정만 표시됩니다. | `false` |

## 사용 예제

### 기본 사용법

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// 컬렉션 메타데이터와 함께 자산 가져오기
const asset = await umi.rpc.getAsset({
  id: publicKey('your-asset-id'),
  displayOptions: {
    showCollectionMetadata: true
  }
})
```

### 여러 옵션 사용

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// 여러 표시 옵션이 활성화된 자산 가져오기
const assets = await umi.rpc.getAssetsByOwner({
  owner: publicKey('owner-address'),
  displayOptions: {
    showCollectionMetadata: true,
    showFungible: true,
    showInscription: true
  }
})
```

### 모든 옵션 활성화

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// 모든 표시 옵션 활성화
const assets = await umi.rpc.searchAssets({
  owner: publicKey('owner-address'),
  displayOptions: {
    showCollectionMetadata: true,
    showFungible: true,
    showInscription: true,
    showUnverifiedCollections: true,
    showZeroBalance: true
  }
})
```

## 표시 옵션을 지원하는 메서드

다음 DAS API 메서드는 표시 옵션과 함께 `options` 매개변수를 지원합니다:

- [Get Asset](/ko/dev-tools/das-api/methods/get-asset)
- [Get Assets](/ko/dev-tools/das-api/methods/get-assets)
- [Get Assets By Owner](/ko/dev-tools/das-api/methods/get-assets-by-owner)
- [Get Assets By Creator](/ko/dev-tools/das-api/methods/get-assets-by-creator)
- [Get Assets By Authority](/ko/dev-tools/das-api/methods/get-assets-by-authority)
- [Get Assets By Group](/ko/dev-tools/das-api/methods/get-assets-by-group)
- [Search Assets](/ko/dev-tools/das-api/methods/search-assets)

## 성능 고려사항

표시 옵션을 활성화하면 응답 크기와 처리 시간이 증가할 수 있습니다. 성능을 최적화하려면 특정 사용 사례에 필요한 옵션만 활성화하세요.
