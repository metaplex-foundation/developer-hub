---
title: 구매자 에스크로 계정 관리
metaTitle: 구매자 에스크로 계정 관리 | Auction House
description: "구매자 에스크로 계정을 관리하는 방법을 설명합니다."
---
## 소개

이전 페이지에서 입찰 및 목록을 만들고 자산의 판매를 실행하는 방법에 대해 논의했습니다. 판매 실행에 대해 이야기할 때 **구매자 에스크로 계정**에 대해 간략하게 언급했습니다. 이 계정의 유용성은 무엇이며 왜 이에 대해 이야기해야 할까요?

이 계정은 입찰자의 자금(SOL 또는 SPL-token)을 임시로 보유하여 에스크로 역할을 하는 프로그램 파생 주소(PDA)입니다. 이러한 자금은 입찰 가격과 같으며 판매가 진행될 때까지 이 PDA에 저장됩니다. 판매가 실행되면 Auction House는 구매자 에스크로 계정 PDA에서 판매자의 지갑으로 이러한 자금을 전송합니다.

이제 질문은: 입찰이 이루어질 때 이러한 자금이 입찰자의 지갑에서 구매자 에스크로 계정으로 자동으로 전송될까요?

답은 아니요입니다. 그것이 바로 구매자 에스크로 계정과 그 안의 자금을 관리하는 것에 대해 이야기해야 하는 이유입니다. 이러한 자금은 Auction House 권한에 의해 관리됩니다. 권한이 이 계정을 어떻게 관리하는지 살펴보겠습니다.

## 잔액 가져오기

이전 섹션의 논의에 추가하여, 판매가 진행되기 위해서는 구매자 에스크로 계정에 충분한 자금이 있는지 확인하는 것이 Auction House의 책임입니다.

그러기 위해서는 먼저 Auction House가 현재 구매자 에스크로 계정에 얼마나 많은 자금이 있는지 알아야 합니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음은 주어진 Auction House에 대한 구매자 에스크로 계정의 잔액을 가져오는 코드 스니펫입니다.

```tsx
import { Keypair } from "@solana/web3.js";

const buyerBalance = await metaplex
    .auctionHouse()
    .getBuyerBalance({
        auctionHouse,
        buyerAddress: Keypair.generate() // 구매자의 주소
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 자금 입금

이 시점에서 Auction House는 사용자에 해당하는 구매자 에스크로 계정에 현재 얼마나 많은 자금이 있는지 알고 있습니다.

이제 이 사용자가 자산에 입찰하면 Auction House는 자금이 부족한 경우 사용자의 지갑에서 구매자 에스크로 계정으로 자금을 전송하기로 결정할 수 있습니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

Auction House에 대한 구매자의 지갑에서 구매자 에스크로 계정으로 자금을 전송하는 방법을 살펴보겠습니다.

```tsx
import { Keypair } from "@solana/web3.js";

const depositResponse = await metaplex
    .auctionHouse()
    .depositToBuyerAccount({
        auctionHouse,              // 에스크로 구매자가 자금을 입금하는 Auction House. Auction House 모델의
                                   // 하위 집합만 필요하지만 자금을 입금하는 방법을 알기 위해 설정에
                                   // 대한 충분한 정보가 필요합니다.
        buyer: metaplex.identity() // 자금을 입금하는 구매자. Signer를 기대합니다
        amount: 10                 // 입금할 자금의 양. SOL 또는 Auction House에서
                                   // 통화로 사용하는 SPL 토큰일 수 있습니다.
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 자금 인출

Auction House는 사용자가 자금을 돌려받기를 원하거나 입찰을 취소한 경우 구매자 에스크로 지갑에서 구매자의 지갑으로 자금을 다시 인출할 수 있어야 합니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

주어진 Auction House에 대한 구매자 에스크로 지갑에서 구매자의 지갑으로 자금을 인출하는 방법을 살펴보겠습니다.

```tsx
import { Keypair } from "@solana/web3.js";

const withdrawResponse = await metaplex
    .auctionHouse()
    .withdrawFromBuyerAccount({
        auctionHouse,              // 에스크로 구매자가 자금을 인출하는 Auction House
        buyer: metaplex.identity() // 자금을 인출하는 구매자
        amount: 10                 // 인출할 자금의 양. SOL 또는 Auction House에서
                                   // 통화로 사용하는 SPL 토큰일 수 있습니다.
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 결론

이제 구매자 에스크로 계정의 자금을 관리하는 방법에 대해서도 논의했으므로 우리는 자신만의 마켓플레이스를 완전히 시작하고 제어할 수 있는 단계에 매우 가깝습니다.

현재 누락된 중요한 정보 하나: 마켓플레이스는 목록, 입찰 및 판매를 어떻게 추적할까요? Auction House 프로그램에는 이를 수행하기 위한 것, 즉 [영수증](receipts)이 있습니다.
