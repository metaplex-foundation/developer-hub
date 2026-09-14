---
title: 영수증
metaTitle: 영수증 | Auction House
description: Auction House 영수증 생성 방법을 설명합니다.
---
## 소개

마켓플레이스에서 트랜잭션 / 활동 추적을 돕기 위해 Auction House 프로그램은 목록, 입찰 및 판매에 대한 영수증 생성을 지원합니다.

영수증 인쇄 외에도 Auction House는 해당 명령어(입찰, 목록 또는 판매)가 취소될 때 영수증을 취소합니다.

영수증이 어떻게 인쇄되는지 살펴보겠습니다.

## 영수증 인쇄

이러한 영수증을 생성하려면 해당 트랜잭션(`PrintListingReceipt`, `PrintBidReceipt` 및 `PrintPurchaseReceipt`) 직후에 영수증 인쇄 함수를 호출해야 합니다.

또한 목록과 입찰이 취소된 경우 `CancelListingReceipt` 및 `CancelBidReceipt` 명령어를 호출해야 합니다. 이 두 명령어를 호출하면 `ListingReceipt` 및 `BidReceipt` 계정의 `canceled_at` 필드가 채워집니다.

> 영수증은 표준 getProgramAccounts 데이터 흐름을 사용하여 검색할 수 있지만 공식 권장 사항은 Solana의 AccountsDB 플러그인을 사용하여 생성된 영수증을 인덱싱하고 추적하는 것입니다.

위의 각 함수에 해당 영수증을 인쇄하기 위해 도입할 수 있는 두 가지 필드가 있습니다:

1. `printReceipt`: 기본값이 `true`인 부울 필드입니다. 이 필드가 `true`로 설정되면 해당 함수에 대한 영수증이 인쇄됩니다.

2. `bookkeeper`: 영수증을 담당하는 부기 지갑의 주소입니다. 즉, 부기는 영수증 비용을 지불한 지갑입니다. 현재의 유일한 책임은 영수증 지불자를 추적하여 향후 계정을 닫을 수 있는 경우 프로그램이 임대료를 환불해야 하는 사람을 알 수 있도록 하는 것입니다. 이 필드는 기본값이 `metaplex.identity()`입니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}
다음은 입찰, 목록 및 판매 실행 명령어에 대한 영수증을 인쇄하는 예입니다.

```tsx
// ListReceipt 인쇄
await metaplex
    .auctionHouse()
    .createListing({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })

// BidReceipt 인쇄
await metaplex
    .auctionHouse()
    .createBid({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })

// PurchaseReceipt 인쇄
await metaplex
    .auctionHouse()
    .executeSale({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })
```

{% /dialect %}
{% /dialect-switcher %}

## 결론

이제 쉬운 트랜잭션 추적을 위해 영수증을 인쇄하는 방법을 알았으므로 실제로 이러한 작업에 대한 세부 정보를 어떻게 가져올까요? [다음 페이지](find)에서 Auction House에 대한 입찰, 목록 및 판매를 찾는 방법을 살펴보겠습니다.
