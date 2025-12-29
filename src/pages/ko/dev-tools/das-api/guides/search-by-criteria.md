---
title: 여러 조건으로 자산 검색
metaTitle: 여러 조건으로 자산 검색 | DAS API 가이드
description: 여러 필터를 결합하여 특정 디지털 자산을 찾는 방법을 알아보세요
---

이 가이드는 DAS API의 `searchAssets` 메서드를 사용하여 여러 필터와 조건을 사용하여 디지털 자산을 찾는 방법을 보여줍니다. 이 강력한 메서드를 사용하면 다양한 매개변수를 결합하여 특정 자산을 찾기 위한 복잡한 쿼리를 만들 수 있습니다.

## 방법 1: 기본 다중 조건 검색

`searchAssets` 메서드를 사용하면 여러 필터를 결합할 수 있습니다. 예를 들어 주어진 지갑이 소유하고 특정 크리에이터가 생성한 자산을 찾습니다.

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // 여러 조건으로 자산 검색
  const searchResults = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    creator: publicKey("CREATOR_ADDRESS"),
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  console.log(`조건과 일치하는 ${searchResults.items.length}개의 자산 발견`);
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
          ownerAddress: 'WALLET_ADDRESS',
          creatorAddress: 'CREATOR_ADDRESS',
          limit: 1000,
          options: {
            showCollectionMetadata: true,
          }
        },
      }),
    }
  );

  const data = await response.json();
  console.log(`${data.result.items.length}개의 자산 발견`);
})();
```
{% /totem-accordion %}
{% totem-accordion title="cURL 예제" %}
```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "creatorAddress": "CREATOR_ADDRESS",
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true,
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

## 방법 2: 컬렉션 및 소유자 검색

특정 지갑이 소유한 특정 컬렉션의 자산을 찾습니다:

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // 지갑이 소유한 특정 컬렉션의 자산 찾기
  const collectionAssets = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    grouping: ["collection", "COLLECTION_ADDRESS"],
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
    }
  })

  console.log(`지갑이 소유한 컬렉션의 ${collectionAssets.items.length}개 자산 발견`)
  console.log(`총 사용 가능: ${collectionAssets.total}`)

  // 각 자산 처리
  collectionAssets.items.forEach(asset => {
    console.log(`자산 ID: ${asset.id}`)
    console.log(`이름: ${asset.content.metadata?.name || '알 수 없음'}`)
    console.log(`인터페이스: ${asset.interface}`)
    console.log('---')
  })
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
        ownerAddress: 'WALLET_ADDRESS',
        grouping: ['collection', 'COLLECTION_ADDRESS'],
        limit: 1000,
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const data = await response.json()
  console.log(`지갑이 소유한 컬렉션의 ${data.result.items.length}개 자산 발견`)
})();
```
{% /totem-accordion %}
{% /totem %}

## 방법 3: 여러 조건으로 고급 필터링

복잡한 쿼리를 위해 필터를 결합합니다. 예를 들어 다음과 같은 NFT를 찾습니다:
• 주어진 컬렉션에 속함
• 특정 지갑이 소유함
• 동결되거나 압축되지 **않음**
• 검증된 크리에이터 보유
• 생성 날짜로 정렬 (내림차순)
그리고 컬렉션 메타데이터를 포함합니다:

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
    const umi = createUmi(
        "<ENDPOINT>"
      ).use(dasApi());

    // 여러 조건으로 복잡한 검색
    const complexSearch = await umi.rpc.searchAssets({
      owner: publicKey('WALLET_ADDRESS'),
      creator: publicKey('CREATOR_ADDRESS'),
      grouping: ["collection", "COLLECTION_ADDRESS"],
      frozen: false,
      compressed: false,
      displayOptions: {
        showCollectionMetadata: true,
      }
    })

  console.log(
    `복잡한 조건과 일치하는 ${complexSearch.items.length}개의 자산 발견`
  );
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
        ownerAddress: 'WALLET_ADDRESS',
        creatorAddress: 'CREATOR_ADDRESS',
        grouping: ['collection', 'COLLECTION_ADDRESS'],
        frozen: false,
        compressed: false,
        options: {
          showCollectionMetadata: true,
        }
      }
    })
  })

  const data = await response.json()
  console.log(`복잡한 조건과 일치하는 ${data.result.items.length}개의 자산 발견`)
})();
```
{% /totem-accordion %}
{% /totem %}
## 팁과 모범 사례

1. **간단하게 시작**: 기본 조건으로 시작하여 점진적으로 복잡성 추가
2. **[페이지네이션](/das-api/guides/pagination) 사용**: 대규모 결과 세트의 경우 적절한 페이지네이션 구현
3. **결과 캐싱**: 자주 액세스하는 검색 결과 저장
4. **현명하게 필터 결합**: 너무 많은 필터는 결과가 없을 수 있습니다
5. **빈 결과 처리**: 빈 결과 세트를 항상 확인하되, 일부 자산이 숨겨져 있거나 아직 인덱싱되지 않았을 수 있음을 유념하세요
6. **[표시 옵션](/das-api/display-options) 사용**: 사용 사례에 관련된 표시 옵션 포함
7. **결과 정렬**: 의미 있는 방식으로 데이터를 제시하기 위해 정렬 사용
8. **쿼리 테스트**: 알려진 데이터로 검색 조건 확인

## 다음 단계

- [컬렉션의 모든 토큰 가져오기](/das-api/guides/get-collection-nfts) - 특정 컬렉션의 모든 자산 가져오기
- [소유자별 NFT 가져오기](/das-api/guides/get-nfts-by-owner) - 지갑이 소유한 모든 NFT 찾기
- [크리에이터별 자산 가져오기](/das-api/methods/get-assets-by-creator) - 특정 지갑이 생성한 모든 토큰 검색

## 더 읽어보기

- [크리에이터별 자산 가져오기](/das-api/methods/get-assets-by-creator) - 특정 지갑이 생성한 모든 토큰 검색
- [컬렉션의 모든 토큰 가져오기](/das-api/guides/get-collection-nfts) - 특정 컬렉션의 모든 자산 가져오기
- [압축 NFT 찾기](/das-api/guides/find-compressed-nfts) - 압축 NFT 검색 및 작업
