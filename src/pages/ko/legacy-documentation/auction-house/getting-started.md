---
title: 시작하기
metaTitle: 시작하기 | Auction House
description: Auction House를 관리하는 데 사용할 수 있는 다양한 라이브러리 및 SDK를 나열합니다.
---

Auction House는 Mainnet Beta 및 Devnet에서 실행되는 Solana 프로그램입니다. Solana 노드에 트랜잭션을 전송하여 다른 Solana 프로그램과 같이 상호 작용할 수 있지만 Metaplex는 이를 훨씬 쉽게 사용할 수 있도록 일부 도구를 구축했습니다. 경매 하우스를 관리할 수 있는 **CLI** 도구와 사용자 인터페이스를 시작하는 데 도움이 되는 **JS SDK**가 있습니다.

## SDK

### JavaScript SDK

**JS SDK**는 웹 개발자에게 자신만의 Auction House를 생성하고 구성할 수 있는 사용하기 쉬운 API를 제공합니다. SDK는 또한 개발자가 입찰, 목록 게시, Auction House 재무 및 수수료 계정에서 자금 인출 등과 같은 복잡한 절차를 수행할 수 있도록 합니다.

Auction House 프로그램과 상호 작용하는 주요 모듈은 [Auction House 모듈](https://github.com/metaplex-foundation/js/tree/main/packages/js/src/plugins/auctionHouseModule)입니다. 이 모듈에는 마켓플레이스를 만드는 프로세스를 간편하게 만드는 여러 메서드가 포함되어 있습니다. `Metaplex` 인스턴스의 `auctionHouse()` 메서드를 통해 이 클라이언트에 액세스할 수 있습니다.

```ts
const auctionHouseClient = metaplex.auctionHouse();
```

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음은 SDK에서 제공하는 유용한 메서드 중 일부입니다:

```ts
// Auction House 생성 및 업데이트
metaplex.auctionHouse().create();
metaplex.auctionHouse().update();

// Auction House에서 거래
metaplex.auctionHouse().bid();
metaplex.auctionHouse().list();
metaplex.auctionHouse().executeSale();

// 입찰 또는 목록 취소
metaplex.auctionHouse().cancelBid();
metaplex.auctionHouse().cancelListing();

// 입찰, 목록 및 구매 찾기
metaplex.auctionHouse().findBidBy();
metaplex.auctionHouse().findBidByTradeState();
metaplex.auctionHouse().findListingsBy();
metaplex.auctionHouse().findListingByTradeState();
metaplex.auctionHouse().findPurchasesBy();
```

{% /dialect %}
{% /dialect-switcher %}

Auction House 모듈에 이미 존재하는 다른 메서드도 있으며 향후 더 많은 메서드가 추가될 것입니다. Auction House 모듈의 *README*는 곧 이러한 모든 메서드에 대한 자세한 문서로 업데이트될 것입니다.

**유용한 링크:**

* [Github 저장소](https://github.com/metaplex-foundation/js/tree/main/packages/js/src/plugins/auctionHouseModule)
* [NPM 패키지](https://www.npmjs.com/package/@metaplex-foundation/js)

## 프로그램 라이브러리

프로그램 라이브러리는 Solita를 사용하여 프로그램의 IDL에서 자동 생성됩니다. Solana 프로그램을 이해하고 자체 명령어를 작성해야 하지만 SDK가 구현하는 데 시간이 조금 더 걸릴 수 있는 최신 기능을 즉시 사용할 수 있다는 장점이 있습니다.

### JavaScript 프로그램 라이브러리

이것은 Auction House 프로그램(Rust로 작성됨)이 업데이트될 때마다 생성되는 자동 생성된 저수준 JavaScript 라이브러리입니다.

따라서 이 라이브러리는 명령어를 준비하고 트랜잭션을 직접 전송하여 프로그램과 상호 작용하려는 고급 개발자를 위한 것입니다.

**유용한 링크:**

* [Github 저장소](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/auction-house/js)
* [NPM 패키지](https://www.npmjs.com/package/@metaplex-foundation/mpl-auction-house)

## Rust 크레이트

Rust에서 개발하는 경우 Rust 크레이트를 사용하여 Metaplex의 프로그램과 상호 작용할 수도 있습니다. 우리의 프로그램은 Rust로 작성되었기 때문에 이러한 크레이트에는 계정을 구문 분석하고 명령어를 빌드하는 데 필요한 모든 것이 포함되어 있어야 합니다.

이것은 Rust 클라이언트를 개발할 때 유용할 수 있지만 자체 프로그램 내에서 Metaplex 프로그램에 CPI 호출을 할 때도 유용합니다.

**유용한 링크:**

* [Github 저장소](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/auction-house/program)
* [크레이트 페이지](https://crates.io/crates/mpl-auction-house)
* [API 참조](https://docs.rs/mpl-auction-house/latest/mpl_auction_house/)
