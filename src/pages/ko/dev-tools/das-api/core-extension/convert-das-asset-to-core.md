---
title: 표준 DAS 자산을 Core 자산 또는 컬렉션 타입으로 변환
metaTitle: 표준 DAS를 Core 타입으로 변환 | DAS API Core 확장
description: DAS 자산을 Core 자산 또는 컬렉션으로 변환
---

Core 자산뿐만 아니라 Token Metadata와 같은 다른 자산으로 작업하는 경우, `@metaplex-foundation/digital-asset-standard-api`를 사용하여 페칭할 때 다른 DAS 자산 타입과 함께 변환 헬퍼에 직접 액세스하는 것이 유용할 수 있습니다.

## 자산 변환 예제

다음 예제는 다음을 보여줍니다:
1. 표준 DAS API 패키지로 DAS 자산을 페칭하는 방법
2. Core 자산만 가지도록 자산 필터링
3. 모든 표준 자산을 Core 자산으로 캐스팅

```js
// ... @metaplex-foundation/digital-asset-standard-api에 대한 표준 설정

const dasAssets = await umi.rpc.getAssetsByOwner({ owner: publicKey('<pubkey>') });

// core 자산만 필터링
const dasCoreAssets = assets.items.filter((a) => a.interface === 'MplCoreAsset')

// AssetV1 타입으로 변환 (실제로는 DAS에서 채워진 content 필드도 포함하는 AssetResult 타입)
const coreAssets = await das.dasAssetsToCoreAssets(umi, dasCoreAssets)
```

## 컬렉션 변환 예제

다음 예제는 다음을 보여줍니다:
1. 표준 DAS API 패키지로 DAS 컬렉션을 페칭하는 방법
2. Core 자산만 가지도록 자산 필터링
3. 모든 표준 자산을 Core 자산으로 캐스팅

```js
// ... @metaplex-foundation/digital-asset-standard-api에 대한 표준 설정

const dasAssets = await umi.rpc.getAssetsByOwner({ owner: publicKey('<pubkey>') });

// core 자산만 필터링
const dasCoreAssets = assets.items.filter((a) => a.interface === 'MplCoreCollection')

// AssetV1 타입으로 변환 (실제로는 DAS에서 채워진 content 필드도 포함하는 AssetResult 타입)
const coreAssets = await das.dasAssetsToCoreAssets(umi, dasCoreAssets)
```
