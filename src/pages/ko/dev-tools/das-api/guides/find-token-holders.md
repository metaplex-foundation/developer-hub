---
title: 특정 토큰 보유자 찾기
metaTitle: 토큰 보유자 찾기 | DAS API 가이드
description: 특정 토큰을 보유한 모든 지갑을 검색하는 방법을 알아보세요
---

이 가이드는 DAS API를 사용하여 컬렉션 내에서 특정 NFT를 보유한 모든 지갑을 찾는 방법을 보여줍니다. 이는 토큰 분포를 이해하거나, 고래 보유자를 찾거나, 소유권 패턴을 분석하는 데 유용합니다.

## 방법 1: 검색 자산 사용 (권장)

`searchAssets` 메서드는 컬렉션 내의 NFT의 모든 보유자를 찾는 가장 효율적인 방법입니다. `getAssetsByGroup`도 실행 가능한 옵션이지만 필터링 기능이 적습니다.

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 컬렉션에서 특정 NFT의 모든 보유자 찾기
  const holders = await umi.rpc.searchAssets({
    grouping: {
      key: 'collection',
      value: 'YOUR_COLLECTION_ADDRESS'
    },
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true
    }
  })

  console.log(`${holders.items.length}명의 보유자 발견`)
  holders.items.forEach(asset => {
    console.log(`소유자: ${asset.ownership.owner}`)
    console.log(`토큰 ID: ${asset.id}`)
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
        grouping: ['collection', 'YOUR_COLLECTION_ADDRESS'],
        limit: 1000,
        options: {
          showCollectionMetadata: true
        }
      }
    })
  })

  const data = await response.json()
  console.log(`컬렉션에서 ${data.result.items.length}개의 자산 발견`)
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
      "grouping": ["collection", "YOUR_COLLECTION_ADDRESS"],
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## 방법 2: 그룹별 자산 가져오기 사용

컬렉션 기반 NFT의 경우 `getAssetsByGroup`을 사용하여 컬렉션의 모든 NFT를 찾을 수도 있습니다. `searchAssets`보다 사용하기 쉽지만 추가 필터링을 위한 옵션이 적습니다.

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<<ENDPOINT>>"
  ).use(dasApi());

  // 컬렉션의 모든 자산 가져오기
  const collectionAssets = await umi.rpc.getAssetsByGroup({
    grouping: ["collection", "COLLECTION_ADDRESS"],
  });

  // 고유한 소유자 추출
  const uniqueOwners = new Set();
  collectionAssets.items.forEach((asset) => {
    uniqueOwners.add(asset.ownership.owner);
  });

  console.log(`${uniqueOwners.size}명의 고유 보유자 발견`);
  console.log("보유자:", Array.from(uniqueOwners));
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript 예제" %}

```javascript
(async () => {
  const response = await fetch(
    "<ENDPOINT>",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getAssetsByGroup",
        params: {
          grouping: ["collection", "COLLECTION_ADDRESS"],
        },
      }),
    }
  );
  const collectionAssets = await response.json();

  // 고유한 소유자 추출
  const uniqueOwners = new Set();
  collectionAssets.result.items.forEach((asset) => {
    uniqueOwners.add(asset.ownership.owner);
  });

  console.log(`${uniqueOwners.size}명의 고유 보유자 발견`);
  console.log("보유자:", Array.from(uniqueOwners));
})();
```

{% /totem-accordion %}
{% /totem %}

## 방법 3: 개별 토큰의 경우
컬렉션의 일부가 아닌 특정 개별 NFT의 보유자를 찾으려면 `getAsset`에서 NFT의 특정 주소를 사용해야 합니다.

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

  // 특정 토큰 가져오기
  const token = await umi.rpc.getAsset({
    assetId: publicKey("SPECIFIC_TOKEN_ID")
  });

  console.log(`토큰 ${token.id}의 소유자: ${token.ownership.owner}`);
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript 예제" %}

```javascript
(async () => {
    const response = await fetch("<ENDPOINT>", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": 1,
          "method": "getAsset",
          "params": {
            "id": "SPECIFIC_TOKEN_ID"
          }
        })
    })
})();
```

{% /totem-accordion %}
{% /totem %}

## 팁과 모범 사례

1. **[페이지네이션](/ko/dev-tools/das-api/guides/pagination) 처리**: 대규모 컬렉션의 경우 항상 페이지네이션을 구현하여 모든 결과를 가져옵니다.

2. **[표시 옵션](/ko/dev-tools/das-api/display-options) 사용**: `showCollectionMetadata`를 활성화하여 추가 컬렉션 정보를 가져옵니다.

3. **결과 캐싱**: NFT 보유자 데이터가 자주 변경되지 않는 경우 결과를 캐싱하여 더 나은 성능을 얻습니다.

4. **속도 제한**: 여러 요청을 할 때 API 속도 제한에 유의하세요.

## 관련 가이드

- [컬렉션의 모든 토큰 가져오기](/ko/dev-tools/das-api/guides/get-collection-nfts)
- [컬렉션 통계 분석](/ko/dev-tools/das-api/guides/collection-statistics)
