---
title: 자산 거래
metaTitle: 자산 거래 | Auction House
description: Auction House에서 자산 거래를 관리하는 방법을 설명합니다.
---
## 소개

이전 페이지에서 Auction House와 이를 만들고 관리하는 방법에 대해 이야기했습니다. Auction House가 생성되면 그 위에서 자산을 거래할 수 있습니다. 마켓플레이스에서의 간단한 거래는 일반적으로 세 가지 작업으로 구성됩니다:

1. 판매자가 자산을 목록에 게시합니다
2. 구매자가 자산에 입찰합니다
3. 목록에 대한 일치하는 입찰이 발견되면 판매가 실행됩니다

이 페이지에서는 이 세 가지 작업에 대해 이야기하고 각 작업을 쉽게 실행하는 코드 예제를 살펴볼 것입니다. 또한 위의 간단한 거래 시나리오와 다른 거래 시나리오를 살펴보고 각 시나리오를 실행하는 코드 예제를 살펴볼 것입니다. 마지막으로 목록과 입찰이 생성된 후 어떻게 취소될 수 있는지도 살펴볼 것입니다.

Auction House에 자산을 목록에 게시하는 것부터 시작하겠습니다.

## 자산 목록 게시

[개요 페이지](../auction-house)에서 자산을 목록에 게시하는 프로세스를 살펴보았습니다. 이 작업은 **판매 주문**을 생성하는 것으로도 알려져 있습니다. Auction House를 사용하여 판매 주문이 생성되면 목록에 게시되는 자산은 판매자의 지갑에 남아 있습니다. 이것은 Auction House의 매우 중요한 기능으로, 사용자가 에스크로 없는 방식으로 자산을 목록에 게시할 수 있도록 하여 자산이 목록에 게시되어 있는 동안에도 사용자가 자산의 보관권을 유지할 수 있게 합니다.

자산 판매자는 자산을 목록에 게시하는 가격에 따라 두 가지 유형의 목록을 만들 수 있습니다:

1. **0보다 큰 가격으로 목록 게시**: 사용자가 0 SOL(또는 다른 SPL-token)보다 큰 가격으로 자산을 목록에 게시하는 경우. 이 경우 판매자의 지갑이 서명자여야 하므로 이 지갑이어야 합니다

2. **0 가격으로 목록 게시**: 사용자가 0 SOL(또는 다른 SPL-token)에 자산을 목록에 게시하는 경우. 이 경우 [Auction House 설정 페이지](settings)에서 논의한 `canChangeSalePrice` 옵션이 `true`로 설정되면 권한이 판매자를 대신하여 서명할 수 있습니다. 이런 일이 발생하면 Auction House는 판매자를 대신하여 0이 아닌 일치하는 입찰을 찾습니다. 자산은 판매자가 서명자로 행동하는 경우에만 0 가격으로 목록에 게시하고 판매할 수 있습니다. 권한 또는 판매자 중 하나만 서명해야 합니다.

목록에 게시되는 토큰 유형에 따라 판매 주문을 만들 때 목록에 게시할 토큰 수도 지정할 수 있습니다:

1. **Non-Fungible Token (NFT)**의 경우: 모든 토큰의 비대체성과 고유성으로 인해 1개의 토큰만 목록에 게시할 수 있습니다.

2. **대체 가능한 자산**의 경우: 판매자는 목록당 1개 이상의 토큰을 목록에 게시할 수 있습니다. 예를 들어: Alice가 5개의 DUST 토큰을 소유하고 있는 경우 동일한 판매 주문에서 이러한 DUST 토큰 중 1개 이상(하지만 5개 이하)을 목록에 게시할 수 있습니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

Auction House에서 목록 또는 판매 주문을 만드는 예를 살펴보겠습니다.

다음 코드 스니펫에서는 총 5 SOL의 가격으로 3개의 DUST 토큰(대체 가능한 토큰)에 대한 판매 주문을 만듭니다. 여기서 중요한 것은 NFT에 대한 판매 주문을 만드는 경우 토큰이 기본값인 1개이므로 목록에 게시할 토큰 수를 지정할 필요가 없다는 것입니다. 다른 양을 지정하면 오류가 발생합니다.

```tsx
await metaplex
    .auctionHouse()
    .createListing({
        auctionHouse,                              // 이 목록과 관련된 Auction House의 모델
        seller: Keypair.generate(),                // 목록의 생성자
        authority: Keypair.generate(),             // Auction House 권한
        mintAccount: new PublicKey("DUST...23df"), // 목록을 만들 민트 계정, 메타데이터를 찾는 데 사용됩니다
        tokenAccount: new PublicKey("soC...87g4"), // 목록이 생성된 자산과 연결된 토큰 계정 주소
        price: 5,                                  // 목록 가격
        tokens: 3                                  // 목록에 게시할 토큰 수, NFT 목록의 경우 1개 토큰이어야 합니다
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 자산에 입찰

자산을 구매하려는 사용자는 해당 자산에 대해 입찰 또는 **구매 주문**을 할 수 있습니다.

자산이 목록에 게시되었는지 여부에 따라 두 가지 유형의 구매 주문이 있을 수 있습니다:

1. **비공개 입찰**: 이것은 가장 일반적인 입찰 유형입니다. Auction House에 목록에 게시된 자산에 관심이 있는 사용자가 주어진 자산에 비공개 입찰을 만듭니다. 이 입찰은 자산 자체가 아닌 특정 경매에 연결됩니다. 즉, 경매가 종료되면(입찰이 거부되고 목록이 취소되거나 입찰이 수락되고 자산이 판매됨) 입찰도 종료됩니다.

2. **공개 입찰**: 사용자는 판매자 및 tokenAccount 속성을 건너뛰어 목록에 게시되지 않은 NFT에 공개 입찰을 게시할 수 있습니다. 공개 입찰은 특정 경매가 아닌 토큰 자체에 특정합니다. 즉, 입찰이 경매 종료 후에도 활성 상태를 유지할 수 있으며 해당 토큰의 후속 경매에 대한 기준을 충족하면 해결될 수 있습니다.

판매 주문의 경우와 마찬가지로 구매 주문도 목록에 게시된 자산 유형에 따라 입찰할 토큰 수를 지정할 수 있습니다:

1. **부분 구매 주문**: 대체 가능한 자산을 목록에 게시할 때 1개 이상의 토큰을 목록에 게시하는 경우에 대해 논의했습니다. 그러한 판매 주문이 존재하는 경우 사용자는 목록에 게시된 토큰의 일부만 구매하기 위해 입찰하거나 부분 구매 주문을 만들 수 있습니다. 예를 들어: Alice가 `3 DUST` 토큰을 `5 SOL`에 목록에 게시한 경우 Alice는 `2 SOL`에 `2 DUST` 토큰을 구매하기 위해 입찰할 수 있습니다. 즉, 사용자는 판매 주문의 `token_size`보다 작은 해당 자산의 구매 주문을 만들 수 있습니다.

2. **완전 구매 주문**: 이것은 구매자가 판매 주문에 목록에 게시된 모든 토큰을 구매하기 위해 입찰을 만드는 경우입니다. 판매 주문당 1개의 토큰만 목록에 게시할 수 있는 비대체 가능한 자산(NFT)의 경우 완전 구매 주문이 생성됩니다. 완전 구매 주문은 대체 가능한 토큰의 경우에도 만들 수 있습니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

Auction House에서 입찰 또는 구매 주문을 만드는 예를 살펴보겠습니다.

다음 코드 스니펫에서는 총 5 SOL의 가격으로 3개의 DUST 토큰(대체 가능한 토큰)에 대한 구매 주문을 만듭니다. 여기서 중요한 것은 NFT에 대한 판매 주문을 만드는 경우 토큰이 기본값인 1개이므로 목록에 게시할 토큰 수를 지정할 필요가 없다는 것입니다. 다른 양을 지정하면 오류가 발생합니다.

이것은 판매자 계정과 토큰 계정을 지정하고 있기 때문에 비공개 입찰의 예입니다. 입찰을 만드는 동안 둘 중 하나가 지정되지 않으면 입찰이 공개됩니다.

```tsx
await metaplex
    .auctionHouse()
    .createBid({
        auctionHouse,                              // 이 목록과 관련된 Auction House의 모델
        buyer: Keypair.generate(),                 // 입찰의 생성자
        seller: Keypair,generate(),                // 입찰이 생성된 자산을 보유하는 계정 주소, 이것 또는 tokenAccount가 제공되지 않으면 입찰이 공개됩니다.
        authority: Keypair.generate(),             // Auction House 권한
        mintAccount: new PublicKey("DUST...23df"), // 입찰을 만들 민트 계정
        tokenAccount: new PublicKey("soC...87g4"), // 입찰이 생성된 자산과 연결된 토큰 계정 주소, 이것 또는 판매자가 제공되지 않으면 입찰이 공개됩니다.
        price: 5,                                  // 구매자의 가격
        tokens: 3                                  // 입찰할 토큰 수, NFT 입찰의 경우 1개 토큰이어야 합니다
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 자산 판매 실행

이제 목록(판매 주문)과 입찰(구매 주문)을 만드는 방법을 알았으므로 자산의 판매를 실행하는 방법을 배울 수 있습니다. 자산의 판매가 실행될 때:

1. Auction House는 구매자 에스크로 계정에서 판매자의 지갑으로 입찰 금액을 전송합니다. 구매자 에스크로 계정과 마켓플레이스 권한이 해당 계정의 자금을 어떻게 관리할 수 있는지에 대해 자세히 이야기할 것입니다.

2. Auction House는 판매자의 지갑에서 구매자의 지갑으로 자산을 전송합니다.

이제 판매 실행이 무엇을 의미하는지 알았으므로 Auction House를 사용하여 자산을 판매할 수 있는 다양한 거래 시나리오를 살펴보겠습니다. [개요 페이지]에서 이미 자세히 논의했지만 각 시나리오에 대한 코드 스니펫과 함께 간략한 설명을 다시 제공합니다:

1. **직접 구매** 또는 *"목록 가격으로 구매"*: 이것은 사용자가 주어진 자산에 입찰할 때 판매 실행이 발생하는 경우입니다. 즉, 직접 구매 작업은 주어진 자산에 입찰을 만든 다음 생성된 입찰과 목록에서 판매를 실행합니다.

    대부분의 경우 이 시나리오는 구매자가 자산의 목록 가격으로 입찰할 때 발생합니다. 그러나 마켓플레이스가 임계값에서 작동하는 사용자 정의 주문 매칭 알고리즘을 가지고 있는 경우가 있을 수 있습니다. 예를 들어: 마켓플레이스는 목록 가격에서 +-20% 범위 내의 입찰이 있는 즉시 주어진 자산의 판매를 실행하는 규칙을 가질 수 있습니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음은 목록에 게시된 자산에 관심이 있는 사용자가 자산을 직접 구매하는 예입니다.

```tsx
const listing = await metaplex
    .auctionHouse()
    .findListingByReceipt({...}) // 다음 페이지에서 목록을 가져오는 방법을 살펴볼 것입니다

const directBuyResponse = await metaplex
    .auctionHouse()
    .buy({
        auctionHouse,                   // 입찰을 만들고 판매를 실행할 Auction House
        buyer: Keypair.generate(),      // 입찰의 생성자, 목록을 만드는 판매자와 같아서는 안 됩니다
        authority: Keypair.generate(),  // Auction House 권한, 이것이 서명자인 경우
                                        // 트랜잭션 수수료는 Auction House 수수료 계정에서 지불됩니다
        listing: listing,               // 판매에 사용되는 목록, `Listing` 모델의
                                        // 하위 집합만 필요하지만 판매를 실행하는 방법을 알기 위해
                                        // 설정에 대한 충분한 정보가 필요합니다.
        price: 5,                       // 구매자의 가격
    });
```

{% /dialect %}
{% /dialect-switcher %}

1. **직접 판매** 또는 *"입찰 가격으로 판매"*: 직접 구매의 경우와 반대로, 이것은 목록에 게시되지 않은 자산에 관심이 있는 사용자가 입찰하는 경우입니다. 이제 자산 소유자가 입찰 금액으로 자산을 목록에 게시하면 판매 실행이 발생할 수 있으므로 자산을 직접 판매합니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음은 자산에 대한 입찰에 관심이 있는 사용자가 자산을 직접 판매하는 예입니다.

```tsx
const bid = await metaplex
    .auctionHouse()
    .findBidByReceipt({...}) // 다음 페이지에서 입찰을 가져오는 방법을 살펴볼 것입니다

const directSellResponse = await metaplex
    .auctionHouse()
    .sell({
        auctionHouse,                              // 목록을 만들고 판매를 실행할 Auction House
        seller: Keypair.generate(),                // 목록의 생성자, 하나만 있어야 합니다. 권한 또는 판매자가 서명해야 합니다.
        authority: Keypair.generate(),             // Auction House 권한, 이것이 서명자인 경우
                                                   // 트랜잭션 수수료는 Auction House 수수료 계정에서 지불됩니다
        bid: bid,                                  // 판매에 사용되는 공개 입찰, `Bid` 모델의
                                                   // 하위 집합만 필요하지만 판매를 실행하는 방법을 알기 위해
                                                   // 설정에 대한 충분한 정보가 필요합니다.
        sellerToken: new PublicKey("DUST...23df")  // 판매할 자산의 토큰 계정, 공개 입찰에는
                                                   // 토큰이 포함되어 있지 않으므로 이 매개변수를 통해 외부에서 제공해야 합니다
    });
```

{% /dialect %}
{% /dialect-switcher %}

1. **독립적인 판매 실행** 또는 *목록 게시자가 입찰에 동의*: 이것은 주어진 자산에 대한 **구매 주문**(입찰) 및 **판매 주문**(목록)이 존재한 후 판매 실행이 독립적으로 발생하는 경우입니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음은 독립적인 판매 실행의 예입니다.

```tsx
const listing = await metaplex
    .auctionHouse()
    .findListingByReceipt({...}) // 다음 페이지에서 목록을 가져오는 방법을 살펴볼 것입니다

const bid = await metaplex
    .auctionHouse()
    .findBidByReceipt({...})     // 다음 페이지에서 입찰을 가져오는 방법을 살펴볼 것입니다

const executeSaleResponse = await metaplex
    .auctionHouse()
    .executeSale({
        auctionHouse,                   // 입찰을 만들고 판매를 실행할 Auction House
        authority: Keypair.generate(),  // Auction House 권한, 이것이 서명자인 경우
                                        // 트랜잭션 수수료는 Auction House 수수료 계정에서 지불됩니다
        listing: listing,               // 판매에 사용되는 목록, `Listing` 모델의
                                        // 하위 집합만 필요하지만 판매를 실행하는 방법을 알기 위해
                                        // 설정에 대한 충분한 정보가 필요합니다.
        bid: bid,                       // 판매에 사용되는 공개 입찰, `Bid` 모델의
                                        // 하위 집합만 필요하지만 판매를 실행하는 방법을 알기 위해
                                        // 설정에 대한 충분한 정보가 필요합니다.
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 목록 및 입찰 취소

지금까지 입찰과 목록을 만드는 방법과 Auction House에서 자산의 판매를 실행하는 방법을 살펴보았습니다. Auction House에서 목록과 입찰이 생성되면 권한을 통해 취소할 수 있습니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음은 JS SDK를 사용하여 입찰과 목록을 취소하는 예입니다.

```tsx
const listing = await metaplex
    .auctionHouse()
    .findListingByReceipt({...}) // 다음 페이지에서 목록을 가져오는 방법을 살펴볼 것입니다

const bid = await metaplex
    .auctionHouse()
    .findBidByReceipt({...})     // 다음 페이지에서 입찰을 가져오는 방법을 살펴볼 것입니다

// 입찰 취소
const cancelBidResponse = await metaplex
    .auctionHouse()
    .cancelBid({
        auctionHouse,            // 입찰을 취소할 Auction House
        bid: bid,                // 취소할 입찰
    });

// 목록 취소
const cancelListingResponse = await metaplex
    .auctionHouse()
    .cancelListing({
        auctionHouse,            // 목록을 취소할 Auction House
        listing: listing,        // 취소할 목록
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 결론

이 페이지에서 마켓플레이스에서 자산 거래를 관리하는 모든 구성 요소를 다루었습니다.

아직 논의하지 않은 한 가지 핵심 사항은 구매자가 자산에 입찰할 때 구매자의 자금을 임시로 보유하는 데 필요한 구매자 에스크로 계정입니다. 이 계정의 자금은 어떻게 관리되며 누가 이러한 자금을 추적할 책임이 있을까요? [다음 페이지](buyer-escrow)에서 알아보겠습니다.
