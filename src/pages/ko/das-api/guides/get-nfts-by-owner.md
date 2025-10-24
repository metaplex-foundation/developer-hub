---
title: 소유자별 NFT 가져오기
metaTitle: 소유자별 NFT 가져오기 | DAS API 가이드
description: 특정 지갑이 소유한 모든 대체 불가능 토큰을 검색하는 방법을 알아보세요
---

# 소유자별 NFT 가져오기

이 가이드는 DAS API를 사용하여 특정 지갑 주소가 소유한 모든 대체 불가능 토큰(NFT)을 검색하는 방법을 보여줍니다. 이는 NFT 갤러리, 포트폴리오 추적기 또는 마켓플레이스 기능을 구축하는 데 유용합니다.

## 방법 1: 인터페이스 필터로 소유자별 자산 가져오기 사용 (권장)

인터페이스 필터링과 결합된 `getAssetsByOwner` 메서드는 특정 지갑이 소유한 NFT를 가져오는 가장 효율적인 방법입니다. 인터페이스 필터에 적용되는 NFT만 반환하므로 `MplCoreAsset`은 압축 NFT를 반환하지 않습니다.

{% totem %}
{% totem-accordion title="UMI 예제" %}

```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());
  console.log("umi.rpc.getAssetsByOwner");
  // 특정 지갑이 소유한 모든 NFT 가져오기
  const ownerNfts = await umi.rpc.getAssetsByOwner({
    owner: publicKey("WALLET_ADDRESS"),
    interface: "MplCoreAsset", //선택사항, 이것 없이는 지갑이 소유한 모든 자산을 가져옵니다
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: false, // 대체 가능 토큰 제외
    },
  });

  console.log(`이 지갑이 소유한 ${ownerNfts.items.length}개의 NFT 발견`);
  console.log(`총 자산: ${ownerNfts.total}`);

  // 각 NFT 처리
  ownerNfts.items.forEach((nft) => {
    console.log(`NFT ID: ${nft.id}`);
    console.log(`이름: ${nft.content.metadata?.name || "알 수 없음"}`);
    console.log(
      `컬렉션: ${
        nft.grouping?.find((g) => g.group_key === "collection")?.group_value ||
        "없음"
      }`
    );
    console.log("---");
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
          showFungible: false, // 대체 가능 토큰 제외
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`${data.result.items.length}개의 NFT 발견`);
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
        "showFungible": false
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

## 방법 2: 소유자 및 인터페이스 필터로 검색 자산 사용

`MplCoreAsset`만 가져오기 위해 인터페이스와 같은 추가 필터와 함께 `searchAssets`를 사용하여 더 구체적인 결과를 얻을 수 있습니다.

{% totem %}
{% totem-accordion title="UMI 예제" %}
```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // 특정 지갑이 소유한 NFT 검색
  const ownerNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000,
    interface: "MplCoreAsset",
    displayOptions: {
      showCollectionMetadata: true,
    },
  });

  console.log(`${ownerNfts.items.length}개의 Core 자산 발견`);
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
        interface: "MplCoreAsset",
        limit: 1000,
        options: {
          showCollectionMetadata: true,
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`${data.result.items.length}개의 Core 자산 발견`);
})();
```
{% /totem-accordion %}
{% /totem %}

## 방법 3 – 컬렉션별 NFT 필터링

지갑 주소에 추가로 특정 컬렉션별로 NFT를 필터링할 수 있습니다. 예를 들어 자신의 컬렉션에서 NFT를 찾을 때입니다.

{% totem %}
{% totem-accordion title="UMI 예제" %}
```typescript
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // 이 지갑이 소유한 특정 컬렉션의 NFT 가져오기
  const collectionNfts = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    grouping: ["collection", "COLLECTION_ADDRESS"],
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: false,
    },
  });

  console.log(`이 컬렉션에서 ${collectionNfts.items.length}개의 NFT 발견`);
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "searchAssets",
        params: {
          ownerAddress: "WALLET_ADDRESS",
          grouping: [
            "collection",
            "COLLECTION_ADDRESS",
          ],
          options: {
            showCollectionMetadata: true,
          },
        },
      }),
    }
  );

  const data = await response.json();
  console.log(`이 지갑의 이 컬렉션에서 ${data.result.items.length}개의 NFT 발견`);
})();

```
{% /totem-accordion %}
{% /totem %}

## 일반적인 사용 사례

- **NFT 갤러리**: 사용자가 소유한 모든 NFT 표시
- **포트폴리오 추적기**: NFT 보유 모니터링
- **마켓플레이스 통합**: 사용자의 NFT 인벤토리 표시
- **컬렉션 관리**: 컬렉션별로 NFT 구성
- **게임 애플리케이션**: 사용자의 NFT 게임 자산 로드

## 팁과 모범 사례

1. **인터페이스 필터링 사용** - NFT만 가져오기 (예: 대체 가능 토큰 제외)
2. **NFT가 많은 지갑의 경우 [페이지네이션](/das-api/guides/pagination) 구현**
3. **빈번한 쿼리의 성능 향상을 위해 결과 캐싱**
4. **추가 메타데이터를 얻으려면 [표시 옵션](/das-api/guides/display-options) 포함**
5. **의미 있는 방식으로 데이터를 제시하기 위해 결과 정렬**
6. **특정 NFT 유형에 집중하기 위해 컬렉션별 필터링**

## 더 읽어보기

- [크리에이터별 자산 가져오기](/das-api/methods/get-assets-by-creator) - 특정 주소가 생성한 모든 토큰 검색
- [컬렉션의 모든 토큰 가져오기](/das-api/guides/get-collection-nfts) - 특정 컬렉션의 모든 자산 가져오기
- [여러 조건으로 자산 검색](/das-api/guides/search-by-criteria) - 고급 쿼리를 위해 여러 필터 결합
