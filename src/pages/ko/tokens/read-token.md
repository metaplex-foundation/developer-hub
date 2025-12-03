---
title: 토큰 데이터 읽기
metaTitle: 토큰 데이터 읽기 | 토큰
description: Solana 블록체인과 DAS API를 사용하여 대체 가능 토큰 데이터를 가져오는 방법을 알아보세요
created: '11-28-2025'
updated: '11-28-2025'
---

Solana 블록체인에서 직접 또는 DAS API를 통해 최적화된 쿼리로 대체 가능 토큰 정보를 가져옵니다. {% .lead %}

## 학습 내용

이 가이드에서는 토큰 데이터를 읽는 두 가지 접근 방식을 다룹니다:

- **직접 블록체인 쿼리** - RPC 호출을 사용하여 토큰 데이터 가져오기
- **DAS API 쿼리** - 인덱싱된 데이터를 사용하여 빠르고 유연한 검색

## 토큰 데이터 직접 가져오기

### 민트 주소로 토큰 메타데이터 가져오기

블록체인에서 토큰의 메타데이터를 직접 가져오려면 민트 주소가 필요합니다. 이 접근 방식은 온체인 계정에서 데이터를 직접 읽습니다.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  fetchDigitalAsset,
  mplTokenMetadata
} from '@metaplex-foundation/mpl-token-metadata'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(mplTokenMetadata())

  const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')

  // Fetch the token's metadata
  const asset = await fetchDigitalAsset(umi, mintAddress)

  console.log('Token Name:', asset.metadata.name)
  console.log('Token Symbol:', asset.metadata.symbol)
  console.log('Token URI:', asset.metadata.uri)
  console.log('Decimals:', asset.mint.decimals)
  console.log('Supply:', asset.mint.supply)
})();
```
{% /totem-accordion %}
{% /totem %}

### 지갑의 토큰 잔액 가져오기

특정 지갑이 지정된 토큰 민트에 대해 보유한 토큰 잔액을 가져옵니다.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  findAssociatedTokenPda,
  fetchToken
} from '@metaplex-foundation/mpl-toolbox'

(async () => {
  const umi = createUmi('<ENDPOINT>')

  const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')
  const walletAddress = publicKey('WALLET_ADDRESS')

  // Find the Associated Token Account
  const tokenAccount = findAssociatedTokenPda(umi, {
    mint: mintAddress,
    owner: walletAddress,
  })

  // Fetch the token account data
  const tokenData = await fetchToken(umi, tokenAccount)

  console.log('Token Balance:', tokenData.amount)
  console.log('Mint:', tokenData.mint)
  console.log('Owner:', tokenData.owner)
})();
```
{% /totem-accordion %}
{% /totem %}

### 지갑의 모든 토큰 계정 가져오기

특정 지갑이 소유한 모든 토큰 계정을 조회하여 모든 토큰 보유 현황을 확인합니다.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { SPL_TOKEN_PROGRAM_ID } from '@metaplex-foundation/mpl-toolbox'

(async () => {
  const umi = createUmi('<ENDPOINT>')

  const walletAddress = publicKey('WALLET_ADDRESS')

  // Get all token accounts using getProgramAccounts
  const tokenAccounts = await umi.rpc.getProgramAccounts(SPL_TOKEN_PROGRAM_ID, {
    filters: [
      { dataSize: 165 }, // Token account size
      {
        memcmp: {
          offset: 32, // Owner offset in token account
          bytes: walletAddress,
        },
      },
    ],
  })

  console.log(`Found ${tokenAccounts.length} token accounts`)

  tokenAccounts.forEach((account) => {
    console.log('Token Account:', account.publicKey)
  })
})();
```
{% /totem-accordion %}
{% /totem %}

## DAS API로 토큰 데이터 가져오기

[Digital Asset Standard (DAS) API](/das-api)는 토큰 데이터에 대한 인덱싱된 접근을 제공하여 빠른 쿼리와 고급 필터링 기능을 가능하게 합니다. 여러 토큰을 쿼리하거나 다양한 기준으로 검색해야 하는 애플리케이션에 권장되는 접근 방식입니다.

### 민트 주소로 토큰 가져오기

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')

  // Fetch the asset using DAS
  const asset = await umi.rpc.getAsset(mintAddress, {
    displayOptions: {
      showFungible: true
    }
  })

  console.log('Token ID:', asset.id)
  console.log('Name:', asset.content.metadata?.name)
  console.log('Symbol:', asset.content.metadata?.symbol)
  console.log('Interface:', asset.interface)
  console.log('Supply:', asset.supply)
  console.log('Decimals:', asset.token_info?.decimals)
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

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
      method: 'getAsset',
      params: {
        id: 'YOUR_TOKEN_MINT_ADDRESS',
        displayOptions: {
          showFungible: true
        }
      }
    })
  })

  const { result: asset } = await response.json()

  console.log('Token ID:', asset.id)
  console.log('Name:', asset.content.metadata?.name)
  console.log('Symbol:', asset.content.metadata?.symbol)
  console.log('Interface:', asset.interface)
})();
```
{% /totem-accordion %}
{% totem-accordion title="cURL Example" %}

```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAsset",
    "params": {
      "id": "YOUR_TOKEN_MINT_ADDRESS",
      "displayOptions": {
        "showFungible": true
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

### 소유자별 모든 대체 가능 토큰 가져오기

지갑 주소가 소유한 모든 대체 가능 토큰을 조회합니다. 효율적인 쿼리를 위해 `FungibleToken` 인터페이스 필터를 사용합니다.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  const walletAddress = publicKey('WALLET_ADDRESS')

  // Search for all fungible tokens owned by the wallet
  const fungibleTokens = await umi.rpc.searchAssets({
    owner: walletAddress,
    interface: 'FungibleToken',
    limit: 1000,
    displayOptions: {
      showFungible: true
    }
  })

  console.log(`Found ${fungibleTokens.items.length} fungible tokens`)

  fungibleTokens.items.forEach(token => {
    console.log(`\nToken: ${token.id}`)
    console.log(`Name: ${token.content.metadata?.name || 'Unknown'}`)
    console.log(`Symbol: ${token.content.metadata?.symbol || 'Unknown'}`)
    console.log(`Balance: ${token.token_info?.balance}`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

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
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const { result } = await response.json()

  console.log(`Found ${result.items.length} fungible tokens`)

  result.items.forEach(token => {
    console.log(`Token: ${token.id}`)
    console.log(`Name: ${token.content.metadata?.name || 'Unknown'}`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="cURL Example" %}

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
      "limit": 1000,
      "options": {
        "showFungible": true
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

### 생성자별 토큰 검색

특정 주소가 생성한 모든 대체 가능 토큰을 찾습니다.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  const creatorAddress = publicKey('CREATOR_ADDRESS')

  // Search for tokens by creator
  const tokens = await umi.rpc.searchAssets({
    creatorAddress: creatorAddress,
    interface: 'FungibleToken',
    limit: 1000,
    displayOptions: {
      showFungible: true
    }
  })

  console.log(`Found ${tokens.items.length} tokens by creator`)

  tokens.items.forEach(token => {
    console.log(`Token: ${token.content.metadata?.name} (${token.id})`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

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
        creatorAddress: 'CREATOR_ADDRESS',
        interface: 'FungibleToken',
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const { result } = await response.json()
  console.log(`Found ${result.items.length} tokens by creator`)
})();
```
{% /totem-accordion %}
{% /totem %}

## 접근 방식 비교

| 기능 | 직접 RPC | DAS API |
|---------|-----------|---------|
| 속도 | 대량 쿼리에서 느림 | 대량 쿼리에 최적화 |
| 데이터 신선도 | 실시간 | 거의 실시간 (인덱싱됨) |
| 검색 기능 | 제한적 | 고급 필터링 |
| 속도 제한 | 표준 RPC 제한 | 제공업체 의존 |
| 사용 사례 | 단일 토큰 조회 | 포트폴리오 보기, 검색 |

## 팁과 모범 사례

1. **포트폴리오 보기에 DAS 사용** - 사용자가 소유한 모든 토큰을 표시할 때, DAS API는 여러 RPC 호출보다 훨씬 빠릅니다.

2. **showFungible 활성화** - 잔액과 소수점 자릿수를 포함한 완전한 토큰 정보를 얻으려면 표시 옵션에서 항상 `showFungible: true`를 설정하세요.

3. **소수점 자릿수 올바르게 처리** - 토큰 수량은 원시 정수로 반환됩니다. 사람이 읽을 수 있는 수량을 얻으려면 `10^decimals`로 나누세요.

4. **메타데이터 캐시** - 토큰 메타데이터는 거의 변경되지 않습니다. API 호출을 줄이고 성능을 향상시키기 위해 캐시하세요.

5. **대량 결과 페이지네이션** - 많은 토큰을 가져올 때, 대량 결과 집합을 효율적으로 처리하기 위해 페이지네이션을 사용하세요. 자세한 내용은 [DAS 페이지네이션 가이드](/das-api/guides/pagination)를 참조하세요.

## 관련 가이드

- [토큰 생성하기](/tokens/create-a-token)
- [DAS API 개요](/das-api)
- [소유자별 대체 가능 자산 가져오기](/das-api/guides/get-fungible-assets)
- [기준별 자산 검색](/das-api/guides/search-by-criteria)
