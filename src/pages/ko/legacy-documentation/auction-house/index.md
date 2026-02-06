---
title: 개요
metaTitle: 개요 | Auction House
description: Auction House 프로그램에 대한 개요를 제공합니다
---


{% callout type="warning" %}

이 프로그램은 더 이상 사용되지 않는 것으로 표시되어 있으며 Metaplex Foundation 팀에서 더 이상 적극적으로 유지 관리하지 않습니다. 새로운 기능, 보안 수정 및 하위 호환성이 보장되지 않습니다. 주의해서 사용하시기 바랍니다.

{% /callout %}

## 소개

Auction House는 사용자가 Solana 블록체인 내에서 자산을 교환할 수 있도록 하는 프로그램입니다.

Solana에서 자산을 교환하는 방법은 많이 있는데, 왜 이 문제를 해결하는 데 중점을 둔 또 다른 프로그램이 필요할까요? 자세히 살펴보겠습니다.

이 프로그램의 정신은 누구나 자신만의 마켓플레이스를 생성하고 구성할 수 있도록 하며, 심지어 자산을 교환하는 방법에 대한 자체 사용자 정의 로직을 제공할 수도 있다는 것입니다. Auction House 프로토콜의 동기는 다양한 사용 사례에 중점을 둔 마켓플레이스의 건강한 생태계를 만드는 것이며, 더 중요하게는 각각이 사용자가 자산을 거래할 수 있도록 하는 방식에 자신만의 특색을 가져오는 것입니다.

Auction House 프로그램의 가장 중요한 측면은 사용자에게 자산의 소유권을 제공한다는 것입니다.

전통적으로 사용자가 마켓플레이스에 자산을 목록에 올리면 자산은 사용자의 지갑에서 마켓플레이스가 소유한 [Escrow](https://www.investopedia.com/terms/e/escrow.asp) 지갑이라는 지갑으로 이동하고 자산이 목록에서 제거되거나 판매될 때까지 거기에 보관되거나 **에스크로**됩니다. 이는 몇 가지 우려를 야기합니다:

- 사용자는 여러 마켓플레이스에 동일한 자산을 목록에 올릴 수 없습니다
- 사용자는 마켓플레이스의 에스크로 계약이 자산을 안전하게 보유할 것이라고 믿어야 합니다.

바로 여기서 Auction House가 그 힘을 보여줍니다. 이것은 마켓플레이스가 **에스크로 없는** 판매 계약을 구현할 수 있도록 하여 사용자에게 자산의 소유권을 제공하는 거래 프로토콜입니다.

## Auction House 생성

Auction House 프로그램은 새 **Auction House** 계정을 인스턴스화하여 새 마켓플레이스를 만드는 데 사용할 수 있습니다. Auction House 계정은 주어진 공개 키에서 파생되고 선택적으로 통화로 사용할 SPL 토큰에서 파생되는 [Program Derived Address (PDA)](../../understanding-programs#program-derived-addresses-pda)입니다(아래에서 자세히 설명).

   ![Properties.PNG](https://i.imgur.com/2HPpM9g.png#radius)

계정은 사용자가 원하는 방식으로 구성할 수 있습니다. [전용 페이지에서 이러한 구성에 대해 자세히 이야기할 것](auction-house/settings)이지만 다음은 몇 가지 흥미로운 구성 가능한 매개변수입니다:

- `requireSignOff`: 이를 통해 마켓플레이스는 어떤 자산을 목록에 올릴 수 있고 어떤 입찰을 할 수 있는지 게이트할 수 있습니다. 모든 관련 명령어에서 Auction House [권한](https://docs.solana.com/staking/stake-accounts#understanding-account-authorities)이 트랜잭션에 서명해야 합니다.
- `canChangeSalePrice`: 이 매개변수는 `requireSignOff`가 `true`로 설정된 Auction House에서만 사용하기 위한 것입니다. 이를 통해 Auction House는 판매자에게 최상의 가격을 찾기 위해 사용자 정의 주문 매칭을 수행할 수 있습니다.
- `sellerFeeBasisPoints`: 이는 마켓플레이스가 모든 거래에서 차지하는 몫을 나타냅니다. 예를 들어, 이것이 `200`, 즉 2%로 설정되면 마켓플레이스는 플랫폼에서 발생하는 모든 단일 거래의 2%를 차지합니다.

## 목록 게시 및 입찰

활성 Auction House가 있으면 사용자는 마켓플레이스에서 자산을 목록에 게시하고 자산에 입찰을 시작할 수 있습니다.

### 목록 게시

사용자가 자산을 목록에 게시하면 Auction House는 두 가지를 수행합니다:

1. Auction House는 **판매 주문**을 생성합니다: 즉, 자산의 목록을 나타내는 `SellerTradeState`로 알려진 PDA를 생성합니다. Trade State는 다른 PDA / 계정에 비해 매우 저렴한 특별한 PDA입니다. 이는 이러한 PDA가 PDA의 [bump](https://solanacookbook.com/core-concepts/pdas.html#generating-pdas)인 1바이트의 데이터만 저장하기 때문입니다. 목록 가격, 토큰 양, 민트 계정 등과 같은 목록과 관련된 다른 모든 정보는 PDA 내부에 저장하는 대신 PDA의 시드로 해시되므로 PDA는 매우 비용 효율적이면서 해당 목록에 대한 "존재 증명"으로 작동합니다.

![](https://i.imgur.com/ki27Ds8.png#radius)

1. Auction House는 또한 다른 PDA를 할당합니다: `programAsSigner` PDA를 **위임자**로 지정합니다. 위임자는 Solana SPL-token 프로그램의 기능이며 [여기](https://spl.solana.com/token#authority-delegation)에서 자세히 논의됩니다. 위임을 통해 Auction House는 나중에 판매가 진행될 때 토큰 계정에서 자산을 가져올 수 있습니다. 이렇게 하면 자산을 에스크로할 필요가 없으며 판매가 진행될 때까지 사용자의 지갑에 남아 있을 수 있습니다.

![](https://i.imgur.com/aIRl7Hb.png#radius)

### 입찰

목록 게시의 경우와 마찬가지로 사용자가 입찰하면 Auction House는 **구매 주문**을 생성합니다. 즉, 입찰을 나타내는 `BuyerTradeState` PDA를 생성합니다. 입찰 금액(네이티브 또는 SPL 토큰)은 판매가 진행될 때까지 이 금액을 보유하는 `BuyerEscrowAccount` PDA로 마켓플레이스에서 수동으로 전송해야 합니다.

> 예:
>
> - Alice는 자산 A를 5 SOL에 목록에 게시합니다. 그렇게 함으로써 Auction House는 입찰을 나타내는 `SellerTradeState` PDA를 생성합니다. Auction House는 또한 `programAsSigner` PDA를 **위임자**로 할당하여 판매가 진행될 때 Alice의 지갑에서 자산을 가져올 **권한**을 부여합니다.
> - Bob은 자산 A에 5 SOL의 입찰을 합니다. 그렇게 함으로써 마켓플레이스는 Bob의 지갑에서 `BuyerEscrowAccount` PDA로 5 SOL을 가져옵니다. 이 금액은 판매가 진행될 때까지 여기에 남아 있습니다.

## 판매 실행

주어진 자산에 대한 목록과 적어도 하나의 입찰이 있으면 `executeSale` 명령어를 호출하여 거래를 완료할 수 있습니다.

`executeSale` 명령어는 권한이 없는 크랭크입니다: 즉, 수수료나 보상 없이 누구나 실행할 수 있습니다. `executeSale` 명령어가 실행되면 두 가지 일이 발생합니다:

- Auction House는 `BuyerEscrowAccount`에 저장된 입찰 금액을 가져와서 이 금액을 목록 게시자에게 전송합니다(Auction House 수수료 제외).
- Auction House가 **위임자**로 할당한 `programAsSigner` PDA는 목록 게시자의 지갑(보다 구체적으로 목록 게시자의 지갑에 있는 토큰 계정)에서 자산을 가져와서 입찰자의 지갑으로 자산을 전송하여 거래를 완료합니다.
  ![](https://i.imgur.com/gpAX63m.png#radius)

이제 `executeSale` 명령어가 어떻게 작동하는지 알았으므로 `executeSale` 명령어가 다른 방식으로 실행되는 세 가지 거래 시나리오에 대해 논의해 보겠습니다:

1. _"목록 가격으로 구매"_: 이것은 사용자가 목록에 게시된 자산에 대해 목록에 게시된 금액 자체로 입찰하는 경우입니다. 이러한 경우 `bid` 및 `executeSale` 명령어가 동일한 트랜잭션에서 실행되므로 입찰자가 실제로 자산을 "구매"합니다.

> 예:
>
> - Alice는 자산 A를 5 SOL에 목록에 게시합니다. 이것은 자산 A에 대한 **판매 주문**을 생성합니다.
> - Bob은 목록을 보고 자산 A에 5 SOL의 입찰을 합니다. 이것은 자산 A에 대한 **구매 주문**을 생성합니다.
> - 이를 통해 마켓플레이스는 동일한 트랜잭션에서 자산에 입찰하고 판매를 실행할 수 있으므로 실제로 Bob이 자산 A를 "구매"할 수 있습니다.

1. _"입찰 가격으로 판매"_: 이것은 목록에 게시되지 않은 자산에 관심이 있는 사용자가 입찰하는 경우입니다. 이제 자산 소유자가 입찰 금액으로 자산을 목록에 게시하면 `list` 및 `executeSale` 명령어가 동일한 명령어에서 실행되므로 목록 게시자가 실제로 요청된 가격으로 자산을 "판매"합니다.

> 예:
>
> - Bob은 목록에 게시되지 않은 자산 A에 5 SOL의 입찰을 합니다. 이것은 자산 A에 대한 **구매 주문**을 생성합니다.
> - Alice는 입찰을 보고 자산 A를 5 SOL에 목록에 게시합니다. 이것은 자산 A에 대한 **판매 주문**을 생성합니다.
> - 이를 통해 마켓플레이스는 동일한 트랜잭션에서 자산을 목록에 게시하고 판매를 실행할 수 있으므로 실제로 Alice가 자산 A를 "판매"할 수 있습니다.

1. _목록 게시자가 입찰에 동의_: 이것은 주어진 자산에 대한 **구매 주문** 및 **판매 주문**이 존재한 후 `executeSale` 명령어가 독립적으로 실행되는 경우입니다.

> 예:
>
> - Alice는 자산 A를 5 SOL에 목록에 게시합니다. 이것은 자산 A에 대한 **판매 주문**을 생성합니다.
> - Bob은 Alice의 목록을 알지 못한 채 자산 A에 5 SOL의 입찰을 합니다. 이것은 자산 A에 대한 **구매 주문**을 생성합니다.
> - Alice는 일치하는 입찰을 보고 판매를 실행합니다.

## 대체 가능한 자산 경매

지금까지 Auction House 계정을 사용하여 자산을 교환하는 것에 대해 이야기했지만, 어떤 유형의 자산을 그런 방식으로 교환할 수 있는지에 대해서는 자세히 다루지 않았습니다. Auction House에 목록에 게시할 수 있는 가장 인기 있는 자산은 [Non-Fungible Tokens (NFT)](/ko/smart-contracts/token-metadata/token-standard#the-non-fungible-standard)입니다.

그러나 이것이 Auction House 프로그램의 혜택을 받을 수 있는 유일한 자산은 아닙니다. 사실, 자산은 민트 계정에 메타데이터 계정이 첨부되어 있는 한 모든 SPL 토큰이 될 수 있습니다. SPL 토큰 및 메타데이터 계정에 대해 자세히 알고 싶다면 [토큰 메타데이터 프로그램의 개요에서 자세히 읽을 수 있습니다](/token-metadata).

## 사용자 정의 SPL 토큰을 사용하여 자산 구매

위에 소개된 예에서 우리는 Auction House 프로그램이 어떻게 작동하는지 논의하기 위해 SOL을 교환 통화로 사용했습니다. 그러나 SOL이 자산을 교환하기 위해 구성할 수 있는 유일한 통화는 아닙니다. Auction House 프로그램을 사용하면 마켓플레이스가 모든 SPL-token을 통화로 작동하도록 구성할 수 있습니다.

이것은 Auction House 계정의 `treasuryMint` 매개변수를 원하는 SPL-token의 민트 계정으로 설정하여 달성할 수 있습니다.

## 사용자 정의 주문 매칭

Trade State에 대해 논의할 때 Trade State 다이어그램에 표시된 세 번째 Trade State가 있었습니다: `FreeSellerTradeState`. 이 Trade State의 유용성은 무엇입니까?

Auction House 프로그램에 대한 소개에서 Auction House가 마켓플레이스에서 자산을 교환하는 방법에 대한 자체 사용자 정의 로직을 제공하는 데 사용할 수 있는 방법에 대해 간략하게 논의했습니다. 바로 여기서 `FreeSellerTradeState`가 사용됩니다.

구매자가 의도적으로 자산을 0 SOL / SPL-token의 가격으로 목록에 게시하면 `FreeSellerTradeState`가 생성됩니다. 그런 다음 Auction House는 판매 가격을 0보다 큰 일치하는 입찰과 일치하도록 변경할 수 있습니다. 이를 통해 Auction House는 판매자에게 최상의 가격을 찾기 위해 복잡한 주문 매칭을 수행할 수 있으며 마켓플레이스는 이 주문 매칭을 수행하기 위해 자체 사용자 정의 로직을 작성할 수 있습니다.

## Auctioneer

지금까지 본 모든 경매에는 한 가지 공통점이 있습니다. 그들은 우리가 [**이중 경매**](https://blogs.cornell.edu/info2040/2021/11/29/four-common-types-of-auctions/#:~:text=sealed%2Dbid%20auction.-,DOUBLE%20AUCTION,-Both%20buyers%20and)라고 부르는 것입니다. 즉, 구매자와 판매자가 공통점을 찾을 때까지 입찰하고 목록에 게시하는 시간이 정해지지 않은 경매입니다.
그러나 영어 경매 및 네덜란드 경매와 같은 Solana 생태계에서 인기를 얻은 여러 다른 형태의 경매가 있습니다.
Auction House 구현은 의도적으로 즉시 판매를 염두에 두고 설계되었으며 즉시 사용 가능한 다른 경매 유형을 제공하지 않습니다.

**Auctioneer**는 개별 Auction House 계정을 제어하기 위해 Auction House의 구성 가능성 패턴을 사용하는 사용자가 작성한 사용자 정의 계약 유형입니다.

Auction House에서 Auctioneer 인스턴스를 활성화하려면 먼저 명시적으로 위임되어야 합니다. 그런 다음 이 Auctioneer 인스턴스는 자체 사용자 정의 로직을 주입하기 위해 대부분의 Auction House 명령어를 가로챌 수 있습니다. Metaplex는 또한 Timed Auctions와 같은 일부 Auctioneer 구현을 제공합니다. 이 문서의 후반부에서 이에 대해 자세히 이야기할 것입니다.

![](https://i.imgur.com/RyZUfR9.png#radius)

## 다음 단계

이 페이지에서 우리는 Auction House 프로토콜의 기본 사항과 그것이 가지고 있는 힘에 대해 살펴보았습니다. Auction House가 할 수 있는 것이 훨씬 더 많습니다.

먼저 이 프로그램을 시작하는 데 사용할 수 있는 다양한 라이브러리를 나열합니다:

- [시작하기](auction-house/getting-started)

다음으로 Auction House 설정 및 Auction House 인스턴스를 관리하는 방법에 대해 자세히 살펴보겠습니다:

- [Auction House 설정](auction-house/settings)
- [Auction House 관리](auction-house/manage)

Auction House의 기본 사항을 이해하면 Auction House 기반 마켓플레이스에서 자산을 거래하는 방법을 배울 수 있습니다:

- [Auction House에서 자산 거래](auction-house/trading-assets)
- [구매자 계정 관리](auction-house/buyer-escrow)

또한 Auction House에서 목록, 입찰 및 판매를 추적하는 방법과 가져오는 방법을 살펴볼 것입니다:

- [영수증 인쇄](auction-house/receipts)
- [입찰, 목록 및 구매 찾기](auction-house/find)

## 추가 읽기 자료

- [Jordan의 트위터 스레드](https://twitter.com/redacted_j/status/1453926144248623104)
- [Armani의 트위터 스레드](https://twitter.com/armaniferrante/status/1460760940454965248)
