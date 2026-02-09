---
title: Auction House 관리
metaTitle: Auction House 관리 | Auction House
description: Auction House를 관리하는 방법을 설명합니다.
---

## 소개

[이전 페이지](/legacy-documentation/auction-house/settings)에서 Auction House의 다양한 설정을 살펴보았습니다. 이제 이러한 설정을 사용하여 Auction House를 만들고 업데이트하는 방법을 살펴보겠습니다.

또한 Auction House를 가져오는 다양한 방법에 대해서도 이야기할 것입니다. 마지막으로 Auction House 수수료 및 재무 계정에서 자금을 인출하는 방법을 살펴보겠습니다.

## Auction House 생성

Auction House는 이전 페이지에서 논의한 모든 설정으로 만들 수 있습니다. 생성된 Auction House 계정을 Auction House **인스턴스**라고 합니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

Metaplex JS SDK를 사용하여 Auction House를 만드는 예를 살펴보겠습니다. 기본적으로 현재 ID가 Auction House의 권한으로 사용됩니다. 또한 기본적으로 `SOL`이 `treasuryMint`로 설정됩니다. 마지막으로 마지막 페이지에서 논의한 도우미 계정은 Auction House에서 자동으로 생성되지만 Auction House 생성 중에 수동으로 설정할 수도 있습니다.

```tsx
const auctionHouseSettings = await metaplex
    .auctionHouse()
    .create({
        sellerFeeBasisPoints: 500 // 5% 수수료
        authority: metaplex.identity(),
        requireSignOff: true,
        canChangeSalePrice: true,
        hasAuctioneer: true, // auctioneer를 활성화하려면
        auctioneerAuthority: metaplex.identity(),
    });
```

{% /dialect %}
{% /dialect-switcher %}

## Auction House 계정

이제 Auction House 인스턴스를 만들었으므로 그 안에 저장된 데이터를 살펴보겠습니다.

첫째, 이미 논의한 모든 설정을 저장합니다. 이러한 설정 외에도 Auction House 계정은 Auction House 인스턴스를 만드는 데 사용된 지갑의 주소를 가리키는 `creator` 필드를 저장합니다.

마지막으로 Auction House 인스턴스는 PDA 계정의 주소를 파생하는 데 사용되는 일부 PDA 범프도 저장합니다.

> PDA로 빌드할 때 계정 데이터 자체에 범프 시드를 저장하는 것이 일반적입니다. 이를 통해 개발자는 범프를 명령어 인수로 전달하지 않고도 PDA의 유효성을 쉽게 검사할 수 있습니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

Auction House 계정 모델은 [`AuctionHouse` 모델의 API 참조](https://metaplex-foundation.github.io/js/types/js.AuctionHouse.html)에서 탐색할 수 있습니다.

다음은 Auction House 속성 중 일부를 보여주는 작은 코드 예입니다.

```tsx
const { auctionHouse } = await metaplex.auctionHouse().create({...});

auctionHouse.address;                   // Auction House 계정의 공개 키
auctionHouse.auctionHouseFeeAccount;    // Auction House 수수료 계정의 공개 키
auctionHouse.feeWithdrawalDestination;  // Auction House 수수료 계정에서 자금을 인출할 계정의 공개 키
auctionHouse.treasuryMint;              // Auction House 통화로 사용할 토큰의 민트 주소
auctionHouse.authority;                 // Auction House 권한의 공개 키
auctionHouse.creator;                   // Auction House 인스턴스를 만드는 데 사용된 계정의 공개 키
auctionHouse.bump;                      // Auction House 인스턴스의 `Bump`
auctionHouse.feePayerBump;              // 수수료 계정의 `Bump`
auctionHouse.treasuryBump;              // 재무 계정의 `Bump`
auctionHouse.auctioneerAddress;         // `Auctioneer` 계정의 공개 키
```

{% /dialect %}
{% /dialect-switcher %}

## Auction House 가져오기

생성되면 Auction House 인스턴스를 가져올 수 있습니다. Auction House는 PDA 계정 주소 또는 크리에이터 주소와 재무 민트 주소의 조합으로 고유하게 식별할 수 있습니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

Auction House는 두 가지 방법으로 가져올 수 있습니다:

1. **주소로**: Auction House 주소를 사용하여
2. **크리에이터 및 민트로**: `creator` 주소와 재무 민트의 조합을 사용하여. Auction House에 Auctioneer가 활성화된 경우 크리에이터와 민트 외에 `auctioneerAuthority`도 필요합니다.

```tsx
// 주소로
const auctionHouse = await metaplex
    .auctionHouse()
    .findByAddress({ address: new PublicKey("Gjwc...thJS") });

// 크리에이터 및 민트로
// 이 예에서는 Auction House에
// Auctioneer가 활성화되지 않았다고 가정합니다
const auctionHouse = await metaplex
    .auctionHouse()
    .findByCreatorAndMint({
        creator: new PublicKey("Gjwc...thJS"),
        treasuryMint: new PublicKey("DUST...23df")
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 설정 업데이트

Candy Machine의 경우와 마찬가지로 Auction House 인스턴스를 만든 후에는 Auction House 인스턴스의 권한인 한 나중에 대부분의 설정을 업데이트할 수 있습니다. 다음 설정을 업데이트할 수 있습니다: `authority`, `sellerFeeBasisPoints`, `requiresSignOff`, `canChangeSalePrice`, `feeWithdrawalDestination`, `treasuryWithdrawalDestination`, `auctioneerScopes`.

이미 논의한 것처럼 Auction House의 권한은 현재 권한이 서명자이고 새 권한의 주소가 언급되는 한 업데이트할 수 있는 설정 중 하나입니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

설정을 업데이트하려면 현재 데이터와 제공된 데이터를 비교하기 위해 전체 모델이 필요합니다. 예를 들어 `feeWithdrawalDestination`만 업데이트하려는 경우 다른 모든 속성을 동일하게 유지하면서 데이터를 업데이트하는 명령어를 보내야 합니다.

또한 기본적으로 `feeWithdrawalDestination` 및 `treasuryWithdrawalDestination`은 `metaplex.identity()`, 즉 기본적으로 권한 및 크리에이터로 설정된 동일한 지갑으로 설정됩니다.

```tsx
import { Keypair } from "@solana/web3.js";

const currentAuthority = Keypair.generate();
const newAuthority = Keypair.generate();
const newFeeWithdrawalDestination = Keypair.generate();
const newTreasuryWithdrawalDestination = Keypair.generate();
const auctionHouse = await metaplex
    .auctionHouse()
    .findByAddress({...});

const updatedAuctionHouse = await metaplex
    .auctionHouse()
    .update({
        auctionHouse,
        authority: currentAuthority,
        newAuthority: newAuthority.address,
        sellerFeeBasisPoints: 100,
        requiresSignOff: true,
        canChangeSalePrice: true,
        feeWithdrawalDestination: newFeeWithdrawalDestination,
        treasuryWithdrawalDestination: newTreasuryWithdrawalDestination
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 자금 인출

이전 페이지에서 Auction House의 다양한 도우미 계정에 대해 논의했습니다. 이것은 **수수료 계정** 및 **재무 계정**입니다.

이 두 계정의 자금은 "대상" 지갑으로 다시 전송할 수 있습니다. 이러한 인출 대상 계정은 Auction House 권한에 의해 설정할 수 있습니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음은 자금을 전송하는 코드 스니펫입니다.

1. Auction House 수수료 지갑에서 수수료 인출 대상 지갑으로.
2. Auction House 재무 지갑에서 재무 인출 대상 지갑으로 자금을 전송합니다.

두 경우 모두 자금을 전송할 Auction House와 인출할 자금의 양을 지정해야 합니다. 이 양은 SOL 또는 Auction House에서 통화로 사용하는 SPL 토큰일 수 있습니다.

```tsx
// 수수료 계정에서 자금 인출
await metaplex
    .auctionHouse()
    .withdrawFromFeeAccount({
        auctionHouse,
        amount: 5
    });

// 재무 계정에서 자금 인출
await metaplex
    .auctionHouse()
    .withdrawFromTreasuryAccount({
        auctionHouse,
        amount: 10
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 결론

이 시점에서 우리는 Auction House 설정, Auction House 인스턴스가 저장하는 데이터 및 이 데이터를 만들고 업데이트하는 방법을 살펴보았습니다. 그러나 우리는 아직 Auction House에서 자산이 어떻게 거래되는지 모릅니다. [다음 페이지](/legacy-documentation/auction-house/trading-assets)에서 이에 대해 이야기할 것입니다.
