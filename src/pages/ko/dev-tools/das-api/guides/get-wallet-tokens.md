---
title: 지갑의 모든 토큰 가져오기
metaTitle: 지갑 토큰 가져오기 | DAS API 가이드
description: 특정 지갑이 소유한 모든 토큰을 검색하는 방법을 알아보세요
---

이 가이드는 DAS API를 사용하여 특정 지갑 주소가 소유한 모든 토큰(NFT, 대체 가능 토큰 및 기타 디지털 자산)을 검색하는 방법을 보여줍니다.

## 방법 1: 소유자별 자산 가져오기 사용 (권장)

`getAssetsByOwner` 메서드는 지갑이 소유한 모든 토큰을 가져오는 가장 직접적인 방법입니다.

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

  // 지갑이 소유한 모든 토큰 가져오기
  const walletTokens = await umi.rpc.getAssetsByOwner({
    owner: publicKey("WALLET_ADDRESS"),
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: true,
    },
  });

  console.log(`${walletTokens.items.length}개의 토큰 발견`);
  walletTokens.items.forEach((token) => {
    console.log(`토큰: ${token.id}`);
    console.log(`인터페이스: ${token.interface}`);
    console.log(`이름: ${token.content.metadata?.name || "알 수 없음"}`);
  });
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript 예제" %}

```javascript
(async () => {
  const response = await fetch("<ENDPOINT>", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getAssetsByOwner",
      params: {
        ownerAddress: "WALLET_ADDRESS",
        options: {
          showCollectionMetadata: true,
          showFungible: true,
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`${data.result.items.length}개의 토큰 발견`);
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
    "method": "getAssetsByOwner",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "options": {
        "showCollectionMetadata": true,
        "showFungible": true
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## 방법 2: 소유자 필터로 검색 자산 사용

더 구체적인 쿼리를 위해 소유자 필터와 함께 `searchAssets`를 사용할 수도 있습니다. 이 방법은 모든 DAS API 공급자가 지원하는 것은 아닙니다.

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

  // 특정 지갑이 소유한 모든 자산 검색
  const walletAssets = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: true,
    },
  });

  console.log(`${walletAssets.items.length}개의 자산 발견`);
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript 예제" %}

```javascript
(async () => {
  const response = await fetch("<ENDPOINT>", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "searchAssets",
      params: {
        ownerAddress: "WALLET_ADDRESS",
        limit: 1000,
        options: {
          showCollectionMetadata: true,
          showFungible: true,
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`${data.result.items.length}개의 자산 발견`);
})();
```

{% /totem-accordion %}
{% /totem %}

## 팁과 모범 사례

1. **[표시 옵션](/ko/dev-tools/das-api/display-options) 사용**: 완전한 토큰 정보를 얻으려면 `showCollectionMetadata` 및 `showFungible` 또는 `showInscription`과 같은 다른 옵션을 활성화합니다.

2. **[페이지네이션](/ko/dev-tools/das-api/guides/pagination) 처리**: 토큰이 많은 지갑의 경우 항상 페이지네이션을 구현합니다.

3. **인터페이스로 필터링**: 특정 토큰 유형을 가져오려면 `interface` 매개변수를 사용합니다.

4. **결과 캐싱**: 지갑 내용이 자주 변경되지 않으므로 더 나은 성능을 위해 캐싱을 고려합니다.

5. **속도 제한**: 여러 요청을 할 때 API 속도 제한에 유의하세요.

## 관련 가이드

- [소유자별 대체 가능 자산 가져오기](/ko/dev-tools/das-api/guides/get-fungible-assets)
- [소유자별 NFT 가져오기](/ko/dev-tools/das-api/guides/get-nfts-by-owner)
- [소유자 및 컬렉션별 자산 가져오기](/ko/dev-tools/das-api/guides/owner-and-collection)
- [컬렉션 통계 분석](/ko/dev-tools/das-api/guides/collection-statistics)
