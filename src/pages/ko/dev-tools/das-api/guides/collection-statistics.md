---
title: 컬렉션 통계 분석
metaTitle: 컬렉션 통계 분석 | DAS API 가이드
description: DAS API를 사용하여 컬렉션 분포와 소유권에 대한 인사이트를 얻는 방법을 알아보세요
---

이 가이드는 DAS API를 사용하여 컬렉션 통계, 분포 및 소유권 패턴을 분석하는 방법을 보여줍니다. 이는 분석 대시보드, 마켓플레이스 인사이트 또는 컬렉션 관리 도구를 구축하는 데 유용합니다.

## 기본 컬렉션 통계

총 자산, 소유권 분포를 포함한 컬렉션의 기본 통계를 가져옵니다. 결과를 창의적으로 활용하고 데이터를 사용하여 자신만의 인사이트를 구축하세요.

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  async function getCollectionStatistics(collectionAddress) {
    // 컬렉션의 모든 자산 가져오기
    const collectionAssets = await umi.rpc.getAssetsByGroup({
      groupKey: 'collection',
      groupValue: collectionAddress,
      limit: 1000,
      displayOptions: {
        showCollectionMetadata: true
      }
    })

    const assets = collectionAssets.items

    // 기본 통계
    const totalAssets = assets.length
    const uniqueOwners = new Set(assets.map(asset => asset.ownership.owner))

    // 소유권 분포
    const ownershipCounts = {}
    assets.forEach(asset => {
      ownershipCounts[asset.ownership.owner] = (ownershipCounts[asset.ownership.owner] || 0) + 1
    })

    // 상위 소유자
    const topOwners = Object.entries(ownershipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    console.log('컬렉션 통계:')
    console.log(`총 자산: ${totalAssets}`)
    console.log(`고유 소유자: ${uniqueOwners.size}`)
    console.log('상위 10명의 소유자:', topOwners)

    return {
      totalAssets,
      uniqueOwners: uniqueOwners.size,
      ownershipCounts,
      topOwners
    }
  }

  // 사용법
  const stats = await getCollectionStatistics('COLLECTION_ADDRESS')
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript 예제" %}

```javascript
(async () => {
  async function getCollectionStatistics(collectionAddress) {
    const response = await fetch('<ENDPOINT>', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getAssetsByGroup',
        params: {
          groupKey: 'collection',
          groupValue: collectionAddress,
          limit: 1000,
          options: {
            showCollectionMetadata: true,
          }
        }
      })
    })

    const data = await response.json()
    const assets = data.result.items

    // 기본 통계
    const totalAssets = assets.length
    const uniqueOwners = new Set(assets.map(asset => asset.ownership.owner))

    // 소유권 분포
    const ownershipCounts = {}
    assets.forEach(asset => {
      ownershipCounts[asset.ownership.owner] = (ownershipCounts[asset.ownership.owner] || 0) + 1
    })

    // 상위 소유자
    const topOwners = Object.entries(ownershipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    console.log('컬렉션 통계:')
    console.log(`총 자산: ${totalAssets}`)
    console.log(`고유 소유자: ${uniqueOwners.size}`)
    console.log('상위 10명의 소유자:', topOwners)

    return {
      totalAssets,
      uniqueOwners: uniqueOwners.size,
      ownershipCounts,
      topOwners
    }
  }

  // 사용법
  const stats = await getCollectionStatistics('COLLECTION_ADDRESS')
})();
```
{% /totem-accordion %}
{% /totem %}

## 일반적인 사용 사례

- **분석 대시보드**: 컬렉션 통계와 트렌드 표시
- **컬렉션 관리**: 컬렉션 상태와 성장 모니터링
- **투자자 도구**: 컬렉션 성과와 희귀도 분석

## 팁과 모범 사례

1. **[페이지네이션 사용](/ko/dev-tools/das-api/guides/pagination)** - 대규모 컬렉션의 경우 완전한 데이터를 얻기 위해 페이지네이션 사용
2. **결과 캐싱** - 빈번한 쿼리의 성능 향상을 위해 결과 캐싱
3. **엣지 케이스 처리** - 누락된 메타데이터나 속성 처리
4. **데이터 정규화** - 컬렉션 간 일관된 분석을 위한 데이터 정규화
5. **트렌드 추적** - 의미 있는 인사이트를 위해 시간에 따른 트렌드 추적

## 더 읽어보기

- [컬렉션의 모든 토큰 가져오기](/ko/dev-tools/das-api/guides/get-collection-nfts) - 특정 컬렉션의 모든 자산 가져오기
- [압축 NFT 찾기](/ko/dev-tools/das-api/guides/find-compressed-nfts) - 압축 NFT 검색 및 작업
- [여러 조건으로 자산 검색](/ko/dev-tools/das-api/guides/search-by-criteria) - 고급 쿼리를 위해 여러 필터 결합
