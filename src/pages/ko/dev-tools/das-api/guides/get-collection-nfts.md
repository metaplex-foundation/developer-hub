---
title: 컬렉션의 모든 토큰 가져오기
metaTitle: 컬렉션의 모든 토큰 가져오기 | DAS API 가이드
description: 특정 컬렉션에 속한 모든 디지털 자산을 검색하는 방법을 알아보세요
---

이 가이드는 DAS API를 사용하여 특정 컬렉션에 속한 모든 디지털 자산(NFT, 토큰)을 검색하는 방법을 보여줍니다. 이는 컬렉션 탐색기, 분석 대시보드 또는 마켓플레이스 기능을 구축하는 데 유용합니다.

## 방법 1: 그룹별 자산 가져오기 사용 (권장)

`getAssetsByGroup` 메서드는 특정 컬렉션에 속한 자산을 찾기 위해 특별히 설계되었습니다.

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
const umi = createUmi('<ENDPOINT>').use(dasApi())

// 특정 컬렉션의 모든 자산 가져오기
const collectionAssets = await umi.rpc.getAssetsByGroup({
  groupKey: 'collection',
  groupValue: '<COLLECTION_ADDRESS>'
})

console.log(`컬렉션에서 ${collectionAssets.items.length}개의 자산 발견`)
console.log(`총: ${collectionAssets.total}개의 자산 사용 가능`)

// 각 자산 처리
collectionAssets.items.forEach(asset => {
  console.log(`자산 ID: ${asset.id}`)
  console.log(`이름: ${asset.content.metadata?.name || '알 수 없음'}`)
  console.log(`인터페이스: ${asset.interface}`)
  console.log(`소유자: ${asset.ownership.owner}`)
  console.log('---')
})

})()
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript 예제" %}

```javascript
(async () => {
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
        groupValue: '<COLLECTION_ADDRESS>'
      }
    })
  })

  const data = await response.json()
  console.log(`컬렉션에서 ${data.result.items.length}개의 자산 발견`)
})()
```
{% /totem-accordion %}
{% totem-accordion title="cURL 예제" %}
```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAssetsByGroup",
    "params": {
      "groupKey": "collection",
      "groupValue": "COLLECTION_ADDRESS"
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## 방법 2: 컬렉션 필터로 검색 자산 사용

더 구체적인 쿼리를 위해 컬렉션 그룹화와 함께 `searchAssets`를 사용할 수도 있습니다. 자세한 내용은 [조건별 자산 검색](/ko/dev-tools/das-api/guides/search-by-criteria)을 참조하세요.

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 추가 필터로 컬렉션의 모든 자산 검색
  const allCollectionNfts = await umi.rpc.searchAssets({
    grouping: ['collection', '<COLLECTION_ADDRESS>'],
    // 선택사항: DAS는 일반적으로 10,000개의 자산을 반환합니다
    limit: 1000,
    // 선택사항: 각 자산에 컬렉션 메타데이터 표시
    displayOptions: {
      showCollectionMetadata: true
    }
  });

  console.log(`${allCollectionNfts.items.length}개의 자산 발견`)
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript 예제" %}

```javascript
(async () => {
  const response = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'searchAssets',
      params: {
        grouping: ['collection', '<COLLECTION_ADDRESS>'],
        limit: 1000,
        options: {
          showCollectionMetadata: true,
        }
      }
    })
  })

  const data = await response.json()
  console.log(`${data.result.items.length}개의 자산 발견`)
})();
```

{% /totem-accordion %}
{% /totem %}

## 방법 3: 컬렉션 자산 정렬

다양한 기준으로 컬렉션 자산을 정렬할 수 있습니다:

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 생성 날짜로 정렬된 컬렉션 자산 가져오기 (최신순)
  const newestAssets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: 'COLLECTION_ADDRESS',
    limit: 1000,
    sortBy: {
      sortBy: 'created',
      sortDirection: 'desc'
    },
    displayOptions: {
      showCollectionMetadata: true
    }
  })

  // 이름으로 정렬된 컬렉션 자산 가져오기
  const nameSortedAssets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: 'COLLECTION_ADDRESS',
    limit: 1000,
    sortBy: {
      sortBy: 'name',
      sortDirection: 'asc'
    },
    displayOptions: {
      showCollectionMetadata: true
    }
  })

  console.log('최신 자산 우선:')
  newestAssets.items.slice(0, 5).forEach(asset => {
    console.log(`${asset.content.metadata?.name} - ID: ${asset.id}`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript 예제" %}

```javascript
(async () => {
  // 생성 날짜로 정렬된 컬렉션 자산 가져오기 (최신순)
  const newestResponse = await fetch('<ENDPOINT>', {
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
        groupValue: 'COLLECTION_ADDRESS',
        limit: 1000,
        sortBy: {
          sortBy: 'created',
          sortDirection: 'desc'
        },
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const newestData = await newestResponse.json()
  const newestAssets = newestData.result

  // 이름으로 정렬된 컬렉션 자산 가져오기
  const nameResponse = await fetch('<ENDPOINT>', {
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
        groupValue: 'COLLECTION_ADDRESS',
        limit: 1000,
        sortBy: {
          sortBy: 'name',
          sortDirection: 'asc'
        },
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const nameData = await nameResponse.json()
  const nameSortedAssets = nameData.result

  console.log('최신 자산 우선:')
  newestAssets.items.slice(0, 5).forEach(asset => {
    console.log(`${asset.content.metadata?.name} - ID: ${asset.id}`)
  })
})();
```
{% /totem-accordion %}
{% /totem %}

## 일반적인 사용 사례

- **컬렉션 탐색기**: 필터링 및 정렬로 컬렉션의 모든 자산 표시
- **마켓플레이스 통합**: 특정 컬렉션에서 사용 가능한 자산 표시
- **분석 대시보드**: 컬렉션 통계 및 소유권 분포 추적
- **게임 애플리케이션**: 게임 컬렉션의 모든 자산 로드

## 팁과 모범 사례

1. **대규모 컬렉션의 경우 [페이지네이션](/ko/dev-tools/das-api/guides/pagination) 사용** - 속도 제한 방지
2. **가능한 경우 결과 캐싱** - 성능 향상
3. **추가 메타데이터를 얻으려면 [표시 옵션](/ko/dev-tools/das-api/display-options) 포함**
4. **의미 있는 방식으로 데이터를 제시하기 위해 결과 정렬**
5. **컬렉션 주소가 유효하지 않을 때 오류를 적절히 처리**

## 다음 단계

- [크리에이터별 자산 가져오기](/ko/dev-tools/das-api/methods/get-assets-by-creator) - 특정 지갑이 생성한 모든 토큰 검색
- [지갑의 모든 토큰 가져오기](/ko/dev-tools/das-api/guides/get-wallet-tokens) - 지갑이 소유한 모든 것 보기
- [여러 조건으로 자산 검색](/ko/dev-tools/das-api/guides/search-by-criteria) - 고급 쿼리를 위해 여러 필터 결합
