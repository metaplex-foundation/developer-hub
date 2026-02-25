---
title: 압축 NFT 찾기
metaTitle: 압축 NFT 찾기 | DAS API 가이드
description: DAS API를 사용하여 압축 NFT를 검색하고 작업하는 방법을 알아보세요
---

이 가이드는 DAS API를 사용하여 압축 NFT를 찾고 작업하는 방법을 보여줍니다. 압축 NFT는 Bubblegum 또는 Bubblegum V2를 사용하여 Solana에 NFT 데이터를 저장하는 공간 효율적인 방법이며, DAS API는 이를 처리하기 위한 특별한 메서드를 제공합니다.

## 방법 1: 소유자별 압축 NFT 찾기

특정 지갑이 소유한 압축 NFT를 검색합니다:

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { publicKey } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"

(async () => {
  const umi = createUmi("<ENDPOINT>").use(dasApi());

  // 특정 지갑이 소유한 모든 NFT 찾기 (압축 및 일반)
  const allOwnerNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000
  });

  // 압축 상태로 필터링
  const compressedNfts = allOwnerNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allOwnerNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `지갑이 소유한 압축 NFT ${compressedNfts.length}개 발견`
  );
  console.log(`일반 NFT: ${regularNfts.length}`);
  console.log(`압축 NFT: ${compressedNfts.length}`);
  console.log(`총 NFT: ${allOwnerNfts.items.length}`);
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
        limit: 1000
      }
    })
  });

  const data = await response.json();
  const allOwnerNfts = data.result;

  // 압축 상태로 필터링
  const compressedNfts = allOwnerNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allOwnerNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `지갑이 소유한 압축 NFT ${compressedNfts.length}개 발견`
  );
  console.log(`일반 NFT: ${regularNfts.length}`);
  console.log(`압축 NFT: ${compressedNfts.length}`);
  console.log(`총 NFT: ${allOwnerNfts.items.length}`);
})();

```
{% /totem-accordion %}
{% /totem %}

## 방법 2: 컬렉션별 압축 NFT 찾기

특정 컬렉션의 압축 NFT를 찾습니다:

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // 특정 컬렉션의 모든 NFT 찾기 (압축 및 일반)
  const allCollectionNfts = await umi.rpc.searchAssets({
    grouping: [
      'collection',
      '<COLLECTION_ADDRESS>'
    ],
    limit: 1000,
    // 선택사항: 각 자산에 컬렉션 메타데이터 표시
    displayOptions: {
      showCollectionMetadata: true
    }
  });

  // 압축 상태로 필터링
  const compressedNfts = allCollectionNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCollectionNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `컬렉션에서 압축 NFT ${compressedNfts.length}개 발견`
  );
  console.log(`일반 NFT: ${regularNfts.length}`);
  console.log(`압축 NFT: ${compressedNfts.length}`);
  console.log(`총 NFT: ${allCollectionNfts.items.length}`);
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
        grouping: [
          'collection',
          '<COLLECTION_ADDRESS>'
        ],
        limit: 1000,
        options: {
          showCollectionMetadata: true
        }
      }
    })
  });

  const data = await response.json();
  const allCollectionNfts = data.result;

  // 압축 상태로 필터링
  const compressedNfts = allCollectionNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCollectionNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `컬렉션에서 압축 NFT ${compressedNfts.length}개 발견`
  );
  console.log(`일반 NFT: ${regularNfts.length}`);
  console.log(`압축 NFT: ${compressedNfts.length}`);
  console.log(`총 NFT: ${allCollectionNfts.items.length}`);
})();

```
{% /totem-accordion %}
{% /totem %}

## 방법 3: 크리에이터별 압축 NFT 찾기

특정 지갑이 생성한 압축 NFT를 검색합니다:

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { publicKey } from "@metaplex-foundation/umi"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"

(async () => {
  const umi = createUmi("<ENDPOINT>").use(dasApi());

  // 특정 지갑이 생성한 모든 NFT 찾기 (압축 및 일반)
  const allCreatorNfts = await umi.rpc.searchAssets({
    creator: publicKey("CREATOR_ADDRESS"),
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  // 압축 상태로 필터링
  const compressedNfts = allCreatorNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCreatorNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `지갑이 생성한 압축 NFT ${compressedNfts.length}개 발견`
  );
  console.log(`크리에이터의 일반 NFT: ${regularNfts.length}`);
  console.log(`크리에이터의 압축 NFT: ${compressedNfts.length}`);
  console.log(`크리에이터의 총 NFT: ${allCreatorNfts.items.length}`);
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
        creatorAddress: 'CREATOR_ADDRESS',
        options: {
          showCollectionMetadata: true,
        }
      }
    })
  });

  const data = await response.json();
  const allCreatorNfts = data.result;

  // 압축 상태로 필터링
  const compressedNfts = allCreatorNfts.items.filter(
    (nft) => nft.compression?.compressed === true
  );
  const regularNfts = allCreatorNfts.items.filter(
    (nft) => !nft.compression?.compressed
  );

  console.log(
    `지갑이 생성한 압축 NFT ${compressedNfts.length}개 발견`
  );
  console.log(`크리에이터의 일반 NFT: ${regularNfts.length}`);
  console.log(`크리에이터의 압축 NFT: ${compressedNfts.length}`);
  console.log(`크리에이터의 총 NFT: ${allCreatorNfts.items.length}`);
})();

```
{% /totem-accordion %}
{% /totem %}

## 팁과 모범 사례

1. **대규모 압축 NFT 컬렉션에는 [페이지네이션](/ko/dev-tools/das-api/guides/pagination) 사용**
2. **증명을 사용할 수 없을 때 오류를 적절히 처리**
3. **압축 NFT 메타데이터에 적절한 표시 옵션 사용**

## 더 읽어보기

- [컬렉션의 모든 토큰 가져오기](/ko/dev-tools/das-api/guides/get-collection-nfts) - 특정 컬렉션의 모든 자산 가져오기
- [소유자별 NFT 가져오기](/ko/dev-tools/das-api/guides/get-nfts-by-owner) - 지갑이 소유한 모든 NFT 찾기
- [여러 조건으로 자산 검색](/ko/dev-tools/das-api/guides/search-by-criteria) - 고급 쿼리를 위해 여러 필터 결합
