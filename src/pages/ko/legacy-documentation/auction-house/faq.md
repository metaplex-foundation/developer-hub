---
title: FAQ
metaTitle: FAQ | Auction House
description: "Auction House에 대한 FAQ"
---

## Auction House에서 NFT가 판매될 때 수수료를 받을 수 있나요?

예, Auction House는 `seller fee basis points`를 취하도록 구성할 수 있습니다. 이것은 create 및 update 명령의 일부입니다. CLI 사용을 참조하세요.

수수료는 크리에이터에게 먼저 지불되고, 그 다음 Auction House에 지불되며, 판매자는 판매의 나머지를 받습니다. NFT 로열티, 판매 가격, Auction House 수수료를 가져와서 구매자에게 총 이득이 얼마인지 UI에 표시하여 쉽게 계산할 수 있습니다.

## Auction House는 사용자가 다른 비-Auction House 마켓플레이스에서 NFT를 판매하는 것을 제한하나요?

아니요, Auction House는 사용자가 판매 목록이 있어도 NFT를 전송하는 것을 막을 수 없습니다. 이런 일이 발생하면 `execute_sale` 작업이 실패하고 구매자는 입찰을 취소하여 자금을 돌려받을 수 있습니다.
Auction House 경험을 만드는 마켓플레이스는 Buy/Sell 거래 상태 계정을 추적하고 판매자의 TokenAccount를 감시해야 원래 판매자로부터 전송된 NFT에 대한 목록과 입찰을 자동으로 취소할 수 있습니다.

특히 마켓플레이스는 현재 다음을 저장해야 합니다:

1. Trade State Account Keys
2. 시드의 Trade State 토큰 크기 및 가격 부분
3. 거래 상태에 저장된 토큰 계정 키
4. Auction House 영수증(목록 영수증, 입찰 영수증 및 구매 영수증)

특히 마켓플레이스는 토큰 계정에서 다음 두 이벤트를 추적해야 합니다:

1. 소유권이 NFT의 원래 판매자에서 변경되었습니다
2. 토큰 계정 금액이 0으로 변경되었습니다

이러한 이벤트가 발생하면 Auction House Authority는 판매자 또는 구매자가 없어도 입찰과 목록을 취소하는 명령어를 호출할 수 있습니다.

## 사람들이 내 Auction House의 설정을 볼 수 있나요?

예, 누구나 Auction House의 설정, 특히 `Can Change Sale Price` 매개변수를 확인할 수 있고 확인해야 합니다.
이것은 CLI에서 `show` 명령으로 수행할 수 있습니다.

## Auction House가 내 NFT의 판매 가격을 변경할 수 있나요?

예, 그러나 특정 시나리오에서만 가능합니다. Auction House가 이 기능을 사용할 수 있으려면 다음 조건이 필요합니다:

1. Auction House 인스턴스의 `Can Change Sale Price`가 `true`로 설정되어야 합니다
2. NFT 판매자가 NFT를 0 가격으로 판매 목록에 올려야 합니다.

{% callout type="warning" %}
Auction House는 키로 트랜잭션에 서명하면 0에 판매할 수 있지만, 현재 임의로 낮은 가격(예: 1 lamport)에 판매할 수 있습니다. 신뢰할 수 있는 Auction House에만 목록을 올리는 것이 중요합니다.
{% /callout %}

1. 이제 Auction House는 #2에서 만든 `0` 가격 거래 상태를 사용하여 다른 가격으로 새 `sale` 목록을 만들 수 있습니다.

## 공개 입찰과 비공개 입찰의 차이점은 무엇인가요?

표준 입찰(비공개 입찰이라고도 함)은 경매에 특정한 입찰을 의미합니다. 경매가 완료되면 입찰을 취소하고 에스크로의 자금을 입찰자에게 반환할 수 있습니다. 그러나 Auction House는 토큰 자체에 특정하고 특정 경매에 특정하지 않은 공개 입찰도 지원합니다. 이는 입찰이 경매 종료 후에도 활성 상태를 유지할 수 있으며 해당 토큰의 후속 경매에 대한 기준을 충족하면 해결될 수 있음을 의미합니다.

예:

1. Alice는 토큰 A에 1 SOL의 공개 입찰을 합니다.
2. Bob도 토큰 A에 2 SOL을 입찰합니다.
3. Bob이 경매에서 낙찰되어 토큰 A의 새 소유자가 됩니다.
4. 일주일 후 Bob은 토큰 A를 경매에 올리지만 아무도 새로운 입찰을 하지 않습니다.
5. Alice가 공개 입찰을 취소하지 않았기 때문에 그녀의 입찰이 토큰 A의 새 경매에서 유일한 입찰이 되어 경매에서 낙찰됩니다.
