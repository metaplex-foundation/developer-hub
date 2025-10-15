---
title: 설정
metaTitle: 설정 | Auction House
description: Auction House 설정을 매우 자세하게 설명합니다.
---

## 소개

이 페이지에서는 Auction House에서 사용할 수 있는 설정에 대해 논의합니다. 이러한 설정에는 Auction House가 작동하는 방식을 정의하는 일부 일반 설정, Auction House의 작동을 지원하는 일부 계정(PDA)의 정의 및 Auction House 프로그램에 추가 구성 가능성을 제공하는 일부 더 구체적인 설정이 포함됩니다.

## 권한

권한은 계정의 사용을 제어하는 지갑이며, 이 경우 Auction House 인스턴스입니다. Auction House를 만들 때 권한 주소를 언급할 수 있습니다. 언급하지 않으면 Auction House를 만드는 데 사용되는 지갑이 권한으로 기본 설정됩니다.

권한은 Auction House를 만든 후 다른 지갑으로 전송할 수도 있으며, 이는 Auction House의 제어권을 이전합니다. 이 작업은 신중하게 수행해야 합니다.

권한 지갑은 또한 마켓플레이스에 목록에 올리고 판매할 수 있는 자산을 보호하는 중요한 역할을 합니다. [`requireSignOff`](#requiresignoff)를 논의할 때 권한의 이 기능에 대해 자세히 이야기할 것입니다

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

JS SDK를 사용할 때 Auction House의 권한은 항상 Auction House를 만드는 데 사용되는 지갑으로 기본 설정됩니다. authority 속성에 유효한 서명자를 제공하여 이 권한을 명시적으로 설정할 수 있습니다.

```tsx
import { Keypair } from "@solana/web3.js";

const myCustomAuthority = Keypair.generate();
const auctionHouseSettings = {
  authority: myCustomAuthority,
};
```

{% /dialect %}
{% /dialect-switcher %}

## 거래 설정

이것은 Auction House에 설정할 수 있는 거래 특정 설정입니다. 이러한 설정은 사용자가 마켓플레이스와 상호 작용하는 방식을 정의하는 데 도움이 됩니다:

1. `treasuryMint`: 이것은 마켓플레이스에서 교환 통화로 사용할 SPL-token의 민트 계정을 정의합니다. Solana의 대부분의 마켓플레이스는 일반적으로 교환 및 자산 거래 통화로 SOL을 사용합니다. 이 설정을 사용하여 Auction House의 권한은 주어진 마켓플레이스에서 자산을 사고 파는 데 사용할 SPL-token을 설정할 수 있습니다.

2. `sellerFeeBasisPoints`: 이것은 주어진 마켓플레이스에서 모든 자산의 각 판매에 대해 마켓플레이스가 받는 2차 판매 로열티를 정의합니다. `250`은 `2.5%` 로열티 몫을 의미합니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

이 스니펫에서는 spl-token을 만들고 Auction House의 `treasuryMint`로 설정합니다. 또한 `sellerFeeBasisPoints`를 사용하여 마켓플레이스 로열티를 설정합니다.

```tsx
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const myKeypair = Keypair.generate();
const connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed',
);
const myCustomToken = splToken.Token.createMint(connection, myKeypair, myKeypair.publicKey, null, 9, splToken.TOKEN_PROGRAM_ID)
const auctionHouseSettings = {
    treasuryMint: myCustomToken,
    sellerFeeBasisPoints: 150
};
```

{% /dialect %}
{% /dialect-switcher %}


## 도우미 계정

Auction House가 제대로 작동하는 데 필요한 여러 계정이 있습니다. Auction House에서 설정하면 권한은 원하는 대로 이러한 계정을 재설정하고 구성할 수 있습니다.

Auction House 프로그램에서 생성하고 제어하는 일부 계정이 있습니다. 이러한 계정은 [여기](https://solanacookbook.com/core-concepts/pdas.html)에서 자세히 읽을 수 있는 Program Derived Address (PDA)입니다. 이러한 계정을 설정하는 데 사용할 수 있는 두 가지 설정은 다음과 같습니다:

1. `auctionHouseFeeAccount`: 사용자를 대신하여 Auction House 관련 트랜잭션 비용을 지불하기 위한 자금을 저장하는 수수료 계정의 공개 키입니다.

2. `auctionHouseTreasury`: 마켓플레이스 로열티로 모든 판매에서 받은 자금을 저장하는 재무 계정의 공개 키입니다.

Auction House 프로그램에서 생성되지 않지만 Auction House에서 권한으로 다양한 유형의 자금을 인출하는 데 필수적인 다른 계정이 있습니다:

1. `feeWithdrawalDestination`: 수수료 계정에서 자금을 인출할 수 있는 계정의 공개 키입니다.

2. `treasuryWithdrawalDestination`: 재무 계정에서 자금을 인출할 수 있는 계정의 공개 키입니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음 코드 스니펫은 위에서 논의한 네 가지 계정에 해당하는 네 개의 서로 다른 키 쌍을 빌드하고 설정합니다.

```tsx
import { Keypair } from "@solana/web3.js";

const feeAccount = Keypair.generate();
const treasuryAccount = Keypair.generate();
const feeWithdrawalDestination = Keypair.generate();
const treasuryWithdrawalDestination = Keypair.generate();
const auctionHouseSettings = {
    auctionHouseFeeAccount: feeAccount,
    auctionHouseTreasury: treasuryAccount,
    feeWithdrawalDestination: feeWithdrawalDestination,
    treasuryWithdrawalDestination: treasuryWithdrawalDestination,
};
```

{% /dialect %}
{% /dialect-switcher %}


## Require Sign Off
이 설정을 통해 마켓플레이스는 자산 목록 및 판매를 게이트할 수 있습니다. 권한 섹션에서 논의한 것처럼 Auction House 권한은 자산 게이팅에서 역할을 합니다. 이러한 검열 또는 중앙 집중식 제어는 `requireSignOff = true`일 때만 발생할 수 있습니다.

이런 일이 발생하면 마켓플레이스의 모든 트랜잭션: 목록 게시, 입찰 및 판매 실행은 Auction House 권한에 의해 서명되어야 합니다. 완전히 분산된 마켓플레이스는 해당 마켓플레이스에서 작업의 검열 또는 중앙 집중식 제어를 피하기 위해 `requireSignOff` 설정을 `false`로 유지하도록 선택할 수 있습니다.

`requireSignOff = true`로 설정하면 다른 권한도 있습니다: 마켓플레이스가 자체 사용자 정의 주문 매칭 알고리즘을 구현할 수 있습니다. 다음 섹션에서 이에 대해 자세히 이야기할 것입니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음 코드 스니펫은 `requireSignOff`를 `true`로 설정합니다.

```tsx
const auctionHouseSettings = {
    requireSignOff: true
};
```

{% /dialect %}
{% /dialect-switcher %}

## Can Change Sale Price

`canChangeSalePrice`를 사용하면 사용자가 의도적으로 자산을 무료로 또는 0 SOL(또는 다른 SPL-token)에 목록에 올릴 때 마켓플레이스가 자산의 판매 가격을 변경할 수 있습니다. 자산을 0 SOL에 목록에 올림으로써 사용자는 마켓플레이스가 "자유롭게" 목록에 올린 자산에 대한 최상의 가격 일치를 찾기 위해 사용자 정의 매칭 알고리즘을 적용할 수 있도록 합니다.


여기서 주목해야 할 중요한 점은 `canChangeSalePrice`는 `requireSignOff`도 `true`로 설정된 경우에만 `true`로 설정할 수 있다는 것입니다. 이는 권한이 없는 목록 게시 및 입찰의 경우 사용자 정의 매칭이 불가능하기 때문입니다. Auction House는 일치하는 입찰에 "승인"하고 자산의 판매를 실행할 수 있어야 합니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음 코드 스니펫은 `canChangeSalePrice`를 `true`로 설정하는 동시에 `requireSignOff`도 `true`인지 확인합니다

```tsx
const auctionHouseSettings = {
    requireSignOff: true,
    canChangeSalePrice: true
};
```

{% /dialect %}
{% /dialect-switcher %}

## Auctioneer 설정

`Auctioneer` 계정은 Auction House 프로그램의 구성 가능성 패턴을 사용하여 Auction House 인스턴스를 제어하는 PDA입니다.

Auctioneer는 Auctioneer 가이드(*곧 제공*)에서 논의할 `DelegateAuctioneer` 명령어를 사용하여 Auction House 인스턴스에 대한 제어 또는 위임을 부여받을 수 있는 능력이 있습니다.

Auction House에서 구성할 수 있는 Auctioneer와 관련된 세 가지 설정이 있습니다:

1. `hasAuctioneer`: 주어진 Auction House 인스턴스에 대한 `Auctioneer` 인스턴스가 존재하는 경우 True입니다.
2. `auctioneerAuthority`: Auctioneer 권한 키입니다. Auction House에 Auctioneer가 활성화될 때 필요합니다.
3. `auctioneerScopes`: Auctioneer에서 사용자에게 제공되는 범위 목록입니다. 예를 들어: Bid, List, Execute Sale. Auction House에 Auctioneer가 활성화된 경우에만 적용됩니다.

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

다음 코드 스니펫은 `hasAuctioneer`를 `true`로 설정합니다. 또한 `auctioneerAuthority`를 생성된 공개 키로 지정하고 `auctioneerScopes`를 설정하여 Auctioneer가 Auction House를 대신하여 구매, 판매 및 판매 실행을 할 수 있도록 합니다.

```tsx
import { Keypair } from "@solana/web3.js";
import { AuthorityScope } from '@metaplex-foundation/mpl-auction-house';

const newAuthority = Keypair.generate();
const auctionHouseSettings = {
    hasAuctioneer: true,
    auctioneerAuthority: newAuthority,
    auctioneerScopes: [
        AuthorityScope.Buy,
        AuthorityScope.Sell,
        AuthorityScope.ExecuteSale,
    ]
};
```

{% /dialect %}
{% /dialect-switcher %}

## 결론
이제 Auction House 설정에 대해 알았으므로 [다음 페이지](/legacy-documentation/auction-house/manage)에서 이를 사용하여 자신만의 Auction House를 만들고 업데이트하는 방법을 살펴보겠습니다.
