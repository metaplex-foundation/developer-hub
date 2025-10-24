---
title: DAS API 요청 페이지네이션
metaTitle: 페이지네이션 | DAS API
description: DAS API 요청을 효율적으로 페이지네이션하는 방법을 배웁니다
---

Digital Asset Standard (DAS) API는 일반적으로 요청당 최대 10,000개의 레코드를 반환합니다. 더 많은 데이터를 검색해야 할 때 페이지네이션이 필수적입니다. 이 가이드에서는 사용 가능한 페이지네이션 방법과 이를 효율적으로 구현하기 위한 모범 사례를 다룹니다.

## 정렬 옵션 이해하기

페이지네이션을 시작하기 전에 사용 가능한 정렬 옵션을 이해하는 것이 중요합니다. 정렬 옵션은 결과를 페이지네이션하는 방식에 영향을 미칩니다:

- `id` (기본값): 자산을 바이너리 ID로 정렬
- `created`: 생성 타임스탬프로 정렬
- `recentAction`: 마지막 업데이트 타임스탬프로 정렬
- `none`: 정렬 없음 (페이지네이션에는 권장하지 않음)

정렬 옵션 외에도 `sortDirection` 매개변수 `asc` 또는 `desc`를 사용하여 결과를 오름차순 또는 내림차순으로 정렬할 수 있습니다.

## 페이지네이션 방법

## 페이지 기반 페이지네이션 (초보자에게 권장)

페이지 기반 페이지네이션은 구현하고 이해하기 가장 쉬운 방법입니다. 초보자와 가장 일반적인 사용 사례에 완벽합니다.

### 작동 방식

- 페이지 번호와 페이지당 항목 수를 지정합니다
- 페이지 번호를 증가시켜 결과를 탐색합니다

### 주요 매개변수

- `page`: 현재 페이지 번호 (1부터 시작)
- `limit`: 페이지당 항목 수 (일반적으로 최대 10,000)
- `sortBy`: 정렬 옵션

### 고려사항

- 구현하고 이해하기 쉽습니다
- 가장 일반적인 사용 사례에 잘 작동합니다
- 큰 페이지 번호에서 성능이 저하될 수 있습니다

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

async function getAllAssetsByPage(collectionAddress: string) {
  const limit = 1000
  let page = 1
  let allAssets: any[] = []
  let hasMore = true

  while (hasMore) {
    console.log(`Fetching page ${page}...`)
    
    const assets = await umi.rpc.getAssetsByGroup({
      groupKey: 'collection',
      groupValue: collectionAddress,
      limit: limit,
      page: page,
      sortBy: {
        sortBy: 'created',
        sortDirection: 'desc'
      }
    })

    if (assets.items.length === 0) {
      hasMore = false
    } else {
      allAssets = [...allAssets, ...assets.items]
      page++
      
      // 무한 루프를 방지하기 위한 안전 점검
      if (page > 100) {
        console.log('Reached maximum page limit')
        break
      }
    }
  }

  console.log(`Total assets retrieved: ${allAssets.length}`)
  return allAssets
}

// 사용법
const collectionAssets = await getAllAssetsByPage('J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w')
```

{% /totem-accordion %}
{% /totem %}

{% totem %}
{% totem-accordion title="JavaScript 예제" %}

```javascript
const url = '<ENDPOINT>'

async function getAllAssetsByPage(collectionAddress) {
  let page = 1
  let allAssets = []
  let hasMore = true

  while (hasMore) {
    console.log(`Fetching page ${page}...`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'getAssetsByGroup',
        params: {
          groupKey: 'collection',
          groupValue: collectionAddress,
          page: page,
          limit: 1000,
          sortBy: { sortBy: 'created', sortDirection: 'desc' },
        },
      }),
    })

    const { result } = await response.json()
    
    if (result.items.length === 0) {
      hasMore = false
    } else {
      allAssets = [...allAssets, ...result.items]
      page++
      
      // 안전 점검
      if (page > 100) {
        console.log('Reached maximum page limit')
        break
      }
    }
  }

  console.log(`Total assets retrieved: ${allAssets.length}`)
  return allAssets
}

// 사용법
const collectionAssets = await getAllAssetsByPage('J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w')
```

{% /totem-accordion %}
{% /totem %}

## 커서 기반 페이지네이션 (고급 사용자에게 권장)

대규모 데이터셋이나 성능이 중요한 경우 커서 기반 페이지네이션은 더 나은 효율성을 제공하며 프로덕션 애플리케이션에 권장되는 접근 방식입니다.

### 작동 방식

- 커서 문자열을 사용하여 위치를 추적합니다
- 각 응답과 함께 커서 값이 반환됩니다
- 다음 페이지를 가져오려면 커서를 다음 요청에 전달합니다
- 순차적인 데이터 탐색에 완벽합니다

### 주요 매개변수

- `cursor`: 다음 결과 세트의 위치 마커
- `limit`: 페이지당 항목 수 (최대 10,000)
- `sortBy`: 커서 기반 페이지네이션의 경우 `id`로 설정해야 합니다

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

async function getAllAssetsByCursor(collectionAddress: string) {
  const limit = 1000
  let allAssets: any[] = []
  let cursor: string | undefined

  do {
    console.log(`Fetching batch with cursor: ${cursor || 'initial'}`)
    
    const response = await umi.rpc.searchAssets({
      grouping: {
        key: 'collection',
        value: collectionAddress
      },
      limit: limit,
      cursor: cursor,
      sortBy: {
        sortBy: 'id',
        sortDirection: 'asc'
      }
    })

    allAssets = [...allAssets, ...response.items]
    cursor = response.cursor
    
    console.log(`Fetched ${response.items.length} items, total: ${allAssets.length}`)
    
  } while (cursor !== undefined)

  console.log(`Total assets retrieved: ${allAssets.length}`)
  return allAssets
}

// 사용법
const collectionAssets = await getAllAssetsByCursor('COLLECTION_ADDRESS')
```

{% /totem-accordion %}
{% /totem %}

{% totem %}
{% totem-accordion title="JavaScript 예제" %}

```javascript
const url = '<ENDPOINT>'

async function getAllAssetsByCursor(collectionAddress) {
  let allAssets = []
  let cursor

  do {
    console.log(`Fetching batch with cursor: ${cursor || 'initial'}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'my-id',
        method: 'searchAssets',
        params: {
          grouping: ['collection', collectionAddress],
          limit: 1000,
          cursor: cursor,
          sortBy: { sortBy: 'id', sortDirection: 'asc' },
        },
      }),
    })

    const { result } = await response.json()
    
    allAssets = [...allAssets, ...result.items]
    cursor = result.cursor
    
    console.log(`Fetched ${result.items.length} items, total: ${allAssets.length}`)
    
  } while (cursor !== undefined)

  console.log(`Total assets retrieved: ${allAssets.length}`)
  return allAssets
}

// 사용법
const collectionAssets = await getAllAssetsByCursor('COLLECTION_ADDRESS')
```

{% /totem-accordion %}
{% /totem %}

## 성능 비교

| 방법 | 복잡도 | 성능 | 사용 사례 |
|--------|------------|-------------|----------|
| 페이지 기반 | 낮음 | 소규모 데이터셋에 좋음 | 초보자, 간단한 애플리케이션 |
| 커서 기반 | 중간 | 우수 | 프로덕션 애플리케이션, 대규모 데이터셋 |
| 범위 기반 | 높음 | 우수 | 고급 쿼리, 병렬 처리 |

## 모범 사례

### 올바른 방법 선택
- 간단한 사용 사례와 초보자의 경우 **페이지 기반 페이지네이션 사용**
- 프로덕션 애플리케이션과 대규모 컬렉션의 경우 **커서 기반 페이지네이션 사용**
- 고급 쿼리 패턴의 경우 **범위 기반 페이지네이션 사용**

### 오류 처리
- 항상 빈 결과 세트를 확인합니다
- 실패한 요청에 대한 재시도 로직을 구현합니다
- 속도 제한을 적절히 처리합니다
- 무한 루프를 방지하기 위한 안전 점검을 추가합니다

### 성능 최적화
- 마지막으로 처리된 항목을 추적합니다
- 적절한 캐싱 전략을 구현하되 데이터, 특히 증명이 빠르게 변경될 수 있음을 명심하세요
- 적절한 정렬 방법을 사용합니다
- 장기 실행 작업에 대한 체크포인트 구현을 고려합니다

### 데이터 일관성
- 페이지네이션 시 항상 정렬을 사용합니다
- 요청 간에 일관된 정렬 매개변수를 유지합니다

## 결론

올바른 페이지네이션 전략을 선택하는 것은 특정 사용 사례에 따라 다릅니다:

- **초보자와 간단한 애플리케이션의 경우**: 페이지 기반 페이지네이션 사용
- **프로덕션 애플리케이션의 경우**: 커서 기반 페이지네이션 사용
- **고급 사용 사례의 경우**: 범위 기반 페이지네이션 사용

커서 기반 페이지네이션은 우수한 성능을 제공하고 구현이 비교적 간단하므로 대부분의 애플리케이션에 일반적으로 최선의 선택입니다. 페이지 기반 페이지네이션은 학습과 간단한 사용 사례에 완벽하며, 범위 기반 페이지네이션은 고급 시나리오를 위한 최대의 유연성을 제공합니다.

## 추가 자료

- [컬렉션의 모든 토큰 가져오기](/das-api/guides/get-collection-nfts) - 특정 컬렉션에서 모든 자산 검색
- [기준별 자산 검색](/das-api/guides/search-by-criteria) - 고급 검색 및 필터링
- [압축된 NFT 찾기](/das-api/guides/find-compressed-nfts) - 압축된 NFT 작업
