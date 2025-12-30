---
title: 소유자 및 컬렉션별 자산 가져오기
metaTitle: 소유자 및 컬렉션별 자산 가져오기 | DAS API 가이드
description: 특정 컬렉션에서 특정 지갑이 소유한 디지털 자산을 찾는 방법을 알아보세요
---

# 소유자 및 컬렉션별 자산 가져오기

이 가이드는 특정 컬렉션에 속하고 특정 지갑 주소가 소유한 디지털 자산을 찾는 방법을 보여줍니다. 이는 컬렉션별 포트폴리오 보기, 마켓플레이스 기능 또는 분석 도구를 구축하는 데 유용합니다.

## 소유자 및 컬렉션 그룹화로 검색 자산 사용

`searchAssets` 메서드를 사용하면 정확한 결과를 위해 소유자 및 컬렉션 필터를 결합할 수 있습니다.

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
      "grouping": ["collection", "COLLECTION_ADDRESS"],
      "limit": 1000,
      "options": {
        "showCollectionMetadata": true
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## 일반적인 사용 사례

- **컬렉션 포트폴리오**: 사용자가 소유한 특정 컬렉션의 모든 자산 표시
- **마켓플레이스 통합**: 사용자 지갑의 컬렉션에서 사용 가능한 자산 표시
- **컬렉션 분석**: 특정 컬렉션 내 보유 분석
- **거래 도구**: 거래 전략을 위한 컬렉션 보유 추적

## 팁과 모범 사례

1. **대규모 데이터셋의 경우 [페이지네이션](/ko/dev-tools/das-api/guides/pagination) 사용**
2. **추가 메타데이터를 얻으려면 [표시 옵션](/ko/dev-tools/das-api/display-options) 포함**
3. **의미 있는 방식으로 데이터를 제시하기 위해 결과 정렬**
4. **컬렉션이 비어있을 때 빈 결과를 적절히 처리**
5. **쿼리 전에 컬렉션 주소 확인**

## 더 읽어보기

- [컬렉션의 모든 토큰 가져오기](/ko/dev-tools/das-api/guides/get-collection-nfts) - 특정 컬렉션의 모든 자산 가져오기
- [소유자별 NFT 가져오기](/ko/dev-tools/das-api/guides/get-nfts-by-owner) - 지갑이 소유한 모든 NFT 찾기
- [여러 조건으로 자산 검색](/ko/dev-tools/das-api/guides/search-by-criteria) - 고급 쿼리를 위해 여러 필터 결합
