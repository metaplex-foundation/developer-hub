---
title: 소유자별 대체 가능 자산 가져오기
metaTitle: 대체 가능 자산 가져오기 | DAS API 가이드
description: 특정 지갑이 소유한 모든 대체 가능 토큰을 검색하는 방법을 알아보세요
---

이 가이드는 DAS API를 사용하여 특정 지갑 주소가 소유한 모든 대체 가능 토큰(SPL 토큰, SOL 등)을 검색하는 방법을 보여줍니다.

## 방법 1: 인터페이스 필터로 검색 자산 사용 (권장)

대체 가능 자산을 가져오는 가장 효과적인 방법은 `FungibleToken` 인터페이스 필터와 함께 `searchAssets`를 사용하는 것입니다. 대체 가능 자산만 반환하므로 필터링할 필요가 없습니다.

이 방법이 가장 효과적이지만 현재 모든 DAS API 공급자가 지원하는 것은 아닙니다.

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 지갑이 소유한 모든 대체 가능 자산 가져오기
  const fungibleTokens = await umi.rpc.searchAssets({
    owner: publicKey('WALLET_ADDRESS'),
    interface: 'FungibleToken',
    limit: 1000,
    displayOptions: {
      showFungible: true
    }
  })

  console.log(`${fungibleTokens.items.length}개의 대체 가능 자산 발견`)
  fungibleTokens.items.forEach(asset => {
    console.log(`토큰: ${asset.id}`)
    console.log(`공급량: ${asset.supply}`)
    console.log(`이름: ${asset.content.metadata?.name || '알 수 없음'}`)
    console.log(`심볼: ${asset.content.metadata?.symbol || '알 수 없음'}`)
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
        interface: 'FungibleToken',
        limit: 10000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const data = await response.json()
  console.log(`${data.result.items.length}개의 대체 가능 자산 발견`)
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
      "interface": "FungibleToken",
      "limit": 10000,
      "options": {
        "showFungible": true
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

## 방법 2: 필터링으로 소유자별 자산 가져오기 사용

`getAssetsByOwner`를 사용하고 결과를 클라이언트 측에서 필터링할 수도 있습니다:

{% totem %}
{% totem-accordion title="UMI 예제" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 모든 자산을 가져와서 대체 가능한 것만 필터링
  const allAssets = await umi.rpc.getAssetsByOwner({
    owner: publicKey('WALLET_ADDRESS'),
    limit: 10000,
    displayOptions: {
      showFungible: true
    }
  })

  // 대체 가능 자산 필터링
  const fungibleTokens = allAssets.items.filter(
    (asset) => asset.interface === 'FungibleToken',
  )

  console.log(
    `전체 ${allAssets.items.length}개의 자산 중 ${fungibleTokens.length}개의 대체 가능 자산 발견`,
  )
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
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: 'WALLET_ADDRESS',
        options: {
          showFungible: true
        }
      }
    })
  })

  const data = await response.json()
  const allAssets = data.result

  // 대체 가능 자산 필터링
  const FungibleTokens = allAssets.items.filter(asset =>
    asset.interface === 'FungibleToken'
  )

  console.log(`전체 ${allAssets.items.length}개의 자산 중 ${FungibleTokens.length}개의 대체 가능 자산 발견`)
})();
```
{% /totem-accordion %}
{% /totem %}

## 방법 3: 토큰 속성으로 필터링

다양한 속성으로 대체 가능 토큰을 필터링할 수 있습니다:

{% totem %}
{% totem-accordion title="UMI 예제" %}
```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// 특정 공급량 범위의 토큰 가져오기
const tokensBySupply = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleToken',
  supply: 1000000, // 공급량 >= 1M인 토큰
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

// 크리에이터별 토큰 가져오기
const creatorTokens = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleToken',
  creatorAddress: 'CREATOR_ADDRESS',
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

console.log(`공급량별 토큰: ${tokensBySupply.items.length}`)
console.log(`크리에이터 토큰: ${creatorTokens.items.length}`)
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript 예제" %}
```javascript
(async () => {
  // 특정 공급량 범위의 토큰 가져오기
  const tokensBySupplyResponse = await fetch('<ENDPOINT>', {
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
        interface: 'FungibleToken',
        supply: 1000000, // 공급량 >= 1M인 토큰
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const tokensBySupplyData = await tokensBySupplyResponse.json()
  const tokensBySupply = tokensBySupplyData.result

  // 크리에이터별 토큰 가져오기
  const creatorResponse = await fetch('<ENDPOINT>', {
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
        interface: 'FungibleToken',
        creatorAddress: 'CREATOR_ADDRESS',
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const creatorData = await creatorResponse.json()
  const creatorTokens = creatorData.result

  console.log(`공급량별 토큰: ${tokensBySupply.items.length}`)
  console.log(`크리에이터 토큰: ${creatorTokens.items.length}`)
})();
```
{% /totem-accordion %}
{% /totem %}

## 팁과 모범 사례

1. **인터페이스 필터 사용**: 자세한 내용은 [조건별 자산 검색](/das-api/guides/search-by-criteria)을 참조하세요.
2. **대체 가능 표시 활성화**: [표시 옵션](/das-api/guides/display-options)에 표시된 대로 완전한 토큰 정보를 얻으려면 표시 옵션에서 `showFungible: true`를 사용합니다.
3. **소수점 고려**: 토큰 금액을 올바르게 포맷하려면 `decimals` 필드를 확인합니다.
4. **결과 캐싱**: 토큰 잔액은 자주 변경되지만 토큰 메타데이터는 비교적 안정적입니다.

## 관련 가이드

- [지갑의 모든 토큰 가져오기](/das-api/guides/get-wallet-tokens)
- [소유자별 NFT 가져오기](/das-api/guides/get-nfts-by-owner)
- [여러 조건으로 자산 검색](/das-api/guides/search-by-criteria)
- [컬렉션 통계 분석](/das-api/guides/collection-statistics)
