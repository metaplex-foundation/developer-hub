---
title: 입찰, 목록 및 판매 찾기
metaTitle: 찾기 | Auction House
description: "입찰, 목록 및 판매를 찾는 방법을 설명합니다."
---
## 소개

이전 페이지에서 입찰, 목록 및 판매에 대한 영수증을 만드는 방법을 살펴보았습니다. 이러한 영수증을 통해 마켓플레이스 운영자는 이러한 작업을 쉽게 추적할 수 있습니다. 그러나 이러한 입찰, 목록 및 판매를 어떻게 가져올까요?

입찰, 목록 및 판매를 가져오기 위해 제공되는 세 가지 유형의 함수가 있습니다:

1. **경매 하우스에서 모두 찾기**: 이 유형의 함수를 사용하여 주어진 Auction House에 대한 모든 입찰 / 목록 / 판매를 찾을 수 있습니다.

2. **영수증으로 찾기**: 이 유형의 함수를 사용하여 해당 영수증 계정의 주소가 주어지면 단일 입찰 / 목록 / 판매를 찾을 수 있습니다.

3. **거래 상태로 찾기**: [개요 페이지](/legacy-documentation/auction-house)에서 Trade State에 대해 이야기했습니다. 입찰 / 목록 / 판매 주문을 인코딩하는 Trade State PDA 계정을 사용하여 해당 작업을 찾을 수도 있습니다.

### 경매 하우스에서 모두 찾기

Auction House에서 모든 입찰, 목록 및 판매(또는 *구매*)를 찾는 여러 기준이 있습니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음은 여러 기준으로 입찰을 찾는 스니펫입니다. 키의 조합을 사용할 수 있습니다.

```tsx
// Auction House에서 모든 입찰 찾기.
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse });

// 구매자 및 민트로 입찰 찾기.
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse, buyer, mint });

// 메타데이터로 입찰 찾기.
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse, metadata });
```

다음은 여러 기준으로 목록을 찾는 스니펫입니다. 다시 말하지만, 키의 조합을 사용할 수 있습니다.

```tsx
// Auction House에서 모든 목록 찾기.
const listings = await metaplex
  .auctionHouse()
  .findListings({ auctionHouse });

// 판매자 및 민트로 목록 찾기.
const listings = await metaplex
  .auctionHouse()
  .findListings({ auctionHouse, seller, mint });
```

다음은 여러 기준으로 구매를 찾는 스니펫입니다. 필수 `auctionHouse` 속성을 포함하여 한 번에 3가지 기준만 지원합니다.

```ts
// Auction House에서 모든 구매 찾기.
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse });

// 구매자 및 민트로 구매 찾기.
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, buyer, mint });

// 메타데이터로 구매 찾기.
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, metadata });

// 판매자 및 구매자로 구매 찾기.
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, seller, buyer });
```

{% /dialect %}
{% /dialect-switcher %}

### 영수증으로 찾기

다음은 해당 영수증 계정 주소로 입찰, 목록 및 판매를 찾는 스니펫입니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

```tsx
// 영수증으로 입찰 찾기
const nft = await metaplex
  .auctionHouse()
  .findBidByReceipt({ receiptAddress, auctionHouse };

// 영수증으로 목록 찾기
const nft = await metaplex
  .auctionHouse()
  .findListingByReceipt({ receiptAddress, auctionHouse };

// 영수증으로 판매 / 구매 찾기
const nft = await metaplex
  .auctionHouse()
  .findPurchaseByReceipt({ receiptAddress, auctionHouse };
```

{% /dialect %}
{% /dialect-switcher %}

### 거래 상태로 찾기

다음은 해당 거래 상태 PDA 계정으로 입찰, 목록 및 판매를 찾는 스니펫입니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

```tsx
// 거래 상태로 입찰 찾기
const nft = await metaplex
  .auctionHouse()
  .findBidByTradeState({ tradeStateAddress, auctionHouse };

// 거래 상태로 목록 찾기
const nft = await metaplex
  .auctionHouse()
  .findListingByTradeState({ tradeStateAddress, auctionHouse };

// 거래 상태로 판매 / 구매 찾기
const nft = await metaplex
  .auctionHouse()
  .findPurchaseByTradeState({ sellerTradeState, buyerTradeState, auctionHouse };
```

{% /dialect %}
{% /dialect-switcher %}

## 결론

마켓플레이스에서 거래를 관리하는 모든 측면을 마침내 다루었습니다. 지금까지 다룬 모든 내용은 JS SDK를 사용한 코드 스니펫을 사용하여 설명되었습니다.
