---
title: 'Freeze Sol Payment Guard'
metaTitle: "Freeze Sol Payment 가드 - SOL 청구 및 민팅된 Asset 동결 | 코어 캔디 머신"
description: "Freeze Sol Payment 가드는 지불자에게 SOL을 청구하고 민팅된 Core Asset을 구성 가능한 기간 동안 동결합니다. 동결된 Asset은 route instruction을 통해 해제될 때까지 전송할 수 없습니다."
keywords:
  - freeze sol payment
  - Core Candy Machine
  - candy guard
  - frozen assets
  - freeze escrow
  - SOL payment
  - thaw NFT
  - Solana NFT
  - minting restriction
about:
  - Candy Machine guards
  - SOL payment with asset freezing
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

**Freeze Sol Payment** 가드는 지불자에게 SOL 금액을 청구하고 민팅된 Core Asset을 구성 가능한 기간 동안 동결하여, Asset이 해제될 때까지 전송을 방지합니다. {% .lead %}

## 개요

**Freeze Sol Payment** 가드는 지불자에게 SOL로 금액을 청구하여 동결된 Asset의 민팅을 허용합니다. 동결된 Asset은 해제될 때까지 전송되거나 마켓플레이스에 상장될 수 없습니다.

동결된 Asset은 다음 조건 중 하나가 충족되는 한 누구나 해제할 수 있습니다:

- Core Candy Machine이 완전히 민팅되었을 때
- Core Candy Machine이 삭제되었을 때
- 구성된 동결 기간 — 최대 30일 — 이 지났을 때

자금은 민팅이 시작되기 전에 Candy Guard 권한자에 의해 초기화되어야 하는 "Freeze Escrow" 계정으로 전송됩니다. 모든 동결된 Asset이 해제되면, Candy Guard 권한자에 의해 자금이 잠금 해제되어 구성된 목적지 계정으로 전송될 수 있습니다.

이 가드의 [route instruction](#route-instruction)을 통해 Freeze Escrow 계정을 초기화하고, Asset을 해제하고, 자금을 잠금 해제할 수 있습니다.

{% diagram  %}

{% node #initialize label="Initialize Freeze Escrow" theme="indigo" /%}
{% node parent="initialize"  theme="transparent" x="-8" y="-1" %}
①
{% /node %}
{% edge from="initialize" to="freezeEscrow-pda" path="straight" /%}
{% node #freezeEscrow-pda label="Freeze Escrow PDA" theme="slate" parent="initialize" x="15" y="70" /%}
{% node theme="transparent" parent="freezeEscrow-pda" x="178" y="-15"%}
Funds are transferred

to the escrow account
{% /node %}
{% node #mintFrozen label="Mint Frozen Assets" theme="indigo" parent="initialize" x="250" /%}
{% node parent="mintFrozen"  theme="transparent" x="-8" y="-1" %}
②
{% /node %}
{% edge from="mintFrozen" to="frozen-NFT-bg2" path="straight" /%}
{% edge from="mintFrozen" to="freezeEscrow-pda" toPosition="right" fromPosition="bottom" /%}
{% node #frozen-NFT-bg2 label="Frozen Asset" theme="slate" parent="frozen-NFT" x="-10" y="-10" /%}
{% node #frozen-NFT-bg1 label="Frozen Asset" theme="slate" parent="frozen-NFT" x="-5" y="-5" /%}
{% node #frozen-NFT label="Frozen Asset" theme="slate" parent="mintFrozen" x="33" y="120" /%}

{% node #clock label="🕑" theme="transparent" parent="mintFrozen" x="165" y="-30" /%}
{% edge from="clock" to="clockDesc" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc  theme="transparent" parent="clock" y="220" x="-91" %}
_When all Assets have been minted_

_OR at the end of the freeze period._
{% /node %}

{% edge from="frozen-NFT" to="thawed-NFT-bg2" path="straight" /%}

{% node #thaw label="Thaw Assets" theme="indigo" parent="mintFrozen" x="200" /%}
{% node parent="thaw"  theme="transparent" x="-8" y="-1" %}
③
{% /node %}
{% edge from="thaw" to="thawed-NFT-bg2" path="straight" /%}
{% node #thawed-NFT-bg2 label="Thawed Asset" theme="slate" parent="thawed-NFT" x="-10" y="-10" /%}
{% node #thawed-NFT-bg1 label="Thawed Asset" theme="slate" parent="thawed-NFT" x="-5" y="-5" /%}
{% node #thawed-NFT label="Thawed Asset" theme="slate" parent="thaw" y="130" x="3" /%}

{% node #clock2 label="🕑" theme="transparent" parent="thaw" x="130" y="-30" /%}
{% edge from="clock2" to="clockDesc2" arrow="none" theme="dimmed" path="straight" /%}
{% node #clockDesc2  theme="transparent" parent="clock2" y="260" x="-91" %}
_When all Assets have been thawed._
{% /node %}

{% node #unlock label="Unlock Funds" theme="indigo" parent="thaw" x="180" /%}
{% node parent="unlock"  theme="transparent" x="-8" y="-1"%}
④
{% /node %}
{% node #freezeEscrow-pda2 label="Freeze Escrow PDA" theme="slate" parent="unlock" x="-20" y="70" /%}
{% edge from="freezeEscrow-pda2" to="treasury" theme="dimmed" path="straight" /%}
{% node #treasury label="Treasury" theme="slate" parent="freezeEscrow-pda2" y="70" x="40" /%}

{% /diagram %}
## 가드 설정

Freeze Sol Payment 가드에는 다음 설정이 포함됩니다:

- **Lamports**: 지불자에게 청구할 SOL(또는 lamports) 금액입니다.
- **Destination**: 이 가드와 관련된 모든 지불을 최종적으로 받을 지갑의 주소입니다.

{% dialect-switcher title="Freeze Sol Payment 가드를 사용한 Candy Machine 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```tsx
create(umi, {
  // ...
  guards: {
    freezeSolPayment: some({
      lamports: sol(1.5),
      destination: umi.identity.publicKey,
    }),
  },
})
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [FreezeSolPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/FreezeSolPayment.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}
config.json 파일의 가드 섹션에 이 객체를 추가하세요:

```json
"freezeSolPayment" : {
    "value": SOL value,
    "destination": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민팅 설정

Freeze Sol Payment 가드에는 다음 민팅 설정이 포함됩니다:

- **Destination**: 이 가드와 관련된 모든 지불을 최종적으로 받을 지갑의 주소입니다.

참고로, SDK의 도움 없이 직접 지시문을 구성할 계획이라면, 이러한 민팅 설정과 추가 항목들을 지시문 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#freezesolpayment)를 참조하세요.

{% dialect-switcher title="Freeze Sol Payment 가드로 민팅하기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 Freeze Sol Payment 가드의 민팅 설정을 전달할 수 있습니다.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    freezeSolPayment: some({ destination: umi.identity.publicKey }),
  },
})
```

API References: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [FreezeSolPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_가드가 할당되는 즉시 sugar를 사용하여 민팅할 수 없으므로 특정 민팅 설정이 없습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

Freeze Sol Payment route instruction은 다음 기능들을 지원합니다.

- [개요](#overview)
- [가드 설정](#guard-settings)
- [민팅 설정](#mint-settings)
- [Route Instruction](#route-instruction)
  - [Freeze Escrow 초기화](#initialize-the-freeze-escrow)
  - [동결된 Asset 해제](#thaw-a-frozen-asset)
  - [자금 잠금 해제](#unlock-funds)
- [Asset 동결 중단](#stop-freezing-assets)
- [Freeze Escrow와 가드 그룹](#freeze-escrows-and-guard-groups)

### Freeze Escrow 초기화

_Path: `initialize`_

Freeze Sol Payment 가드를 사용할 때는 민팅이 시작되기 전에 Freeze Escrow 계정을 초기화해야 합니다. 이는 가드 설정의 Destination 속성에서 파생된 PDA 계정을 생성합니다.

Freeze Escrow PDA 계정은 다음과 같은 여러 매개변수를 추적합니다:

- 이 가드를 통해 얼마나 많은 동결된 Asset이 민팅되었는지
- 이 가드를 통해 첫 번째 동결된 Asset이 언제 민팅되었는지 (동결 기간이 그 이후부터 시작되므로)

이 Freeze Escrow 계정을 초기화할 때는 가드의 route instruction에 다음 인수를 제공해야 합니다:

- **Path** = `initialize`: route instruction에서 실행할 경로를 선택합니다.
- **Destination**: 이 가드와 관련된 모든 지불을 최종적으로 받을 지갑의 주소입니다.
- **Period**: 동결 기간이 지속되어야 하는 초 단위의 시간입니다. 이는 최대 30일(2,592,000초)이 될 수 있으며, 이 가드를 통해 민팅된 첫 번째 동결된 Asset부터 시작됩니다. 동결 기간은 Candy Machine이 완전히 민팅되지 않더라도 동결된 Asset이 결국 해제될 수 있도록 하는 안전 메커니즘을 제공합니다.
- **Candy Guard Authority**: Candy Guard 계정의 권한자가 서명자로 포함되어야 합니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}

Owner: Candy Machine Core Program {% .whitespace-nowrap %}

{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guards" theme="mint" z=1/%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="- Amount"  /%}
{% node #destination label="- Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="415" %}
  {% node #candy-guard-route theme="pink" %}
    Route with Path {% .whitespace-nowrap %}

    = *Initialize*
  {% /node %}
  {% node parent="candy-guard-route" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="-4" theme="transparent" %}
  Initialize Freeze Escrow
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="220" y="13" label="Freeze Period" theme="slate" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}

{% edge from="candy-guard-route" to="freezeEscrow-PDA3" theme="pink" path="straight" y="-10" /%}

{% node #freezeEscrow-PDA3 parent="destination" x="390" y="-10" %}
  Freeze Escrow PDA
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="destination" to="freezeEscrow-PDA3" arrow="none" dashed=true path="straight" /%}

{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

마지막으로, Freeze Escrow PDA 계정은 이 가드를 통해 민팅된 모든 동결된 Asset의 자금을 받게 됩니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount"  /%}
{% node #destination label="Destination" /%}
{% node label="..." /%}
{% /node %}

{% node #freezeEscrow-PDA4 parent="destination" x="300" y="-8" theme="slate" %}
  Freeze Escrow PDA
{% /node %}
{% edge from="destination" to="freezeEscrow-PDA4" arrow="none" dashed=true path="straight" /%}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Route with

    Path = *Initialize*
  {% /node %}
    {% node parent="candy-guard-route" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}
{% edge from="mint-candy-guard" to="freezeEscrow-PDA4" theme="pink" /%}

{% node parent="mint-candy-guard" y="150" x="2" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint
  {% /node %}
  {% node parent="candy-guard-route" theme="pink" %}
    Candy Machine Core Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="130" theme="transparent" %}
  Mint Logic
{% /node %}

{% edge from="mint-candy-machine" to="frozen-NFT" path="straight" /%}
{% node #frozen-NFT parent="mint-candy-machine" y="120" x="29" theme="slate" %}
  Frozen Asset
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

{% seperator h="6" /%}

{% dialect-switcher title="Freeze Escrow 초기화" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

아래 예제에서는 최대 15일의 동결 기간으로 Freeze Escrow 계정을 초기화하고 현재 identity를 Candy Guard 권한자로 사용합니다.

```ts
route(umi, {
  // ...
  guard: 'freezeSolPayment',
  routeArgs: {
    path: 'initialize',
    destination: umi.identity.publicKey,
    period: 15 * 24 * 60 * 60, // 15일
    candyGuardAuthority: umi.identity,
  },
})
```

API References: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [FreezeSolPaymentRouteArgsInitialize](https://mpl-core-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentRouteArgsInitialize.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 동결된 Asset 해제

_Path: `thaw`_

동결된 Asset은 다음 조건 중 하나가 충족되는 한 누구나 해제할 수 있습니다:

- Candy Machine이 완전히 민팅되었을 때
- Candy Machine이 삭제되었을 때
- 구성된 동결 기간 — 최대 30일 — 이 지났을 때

Freeze Escrow의 자금은 모든 Asset이 해제될 때까지 양도할 수 없으므로, 가능한 한 빨리 모든 Asset을 해제하도록 하는 인센티브가 treasury에 생깁니다.

동결된 Asset을 해제하려면 가드의 route instruction에 다음 인수를 제공해야 합니다:

- **Path** = `thaw`: route instruction에서 실행할 경로를 선택합니다.
- **Destination**: 이 가드와 관련된 모든 지불을 최종적으로 받을 지갑의 주소입니다.
- **Asset Address**: 해제할 동결된 Asset의 민트 주소입니다.
- **Asset Owner**: 해제할 동결된 Asset의 소유자 주소입니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
  Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="-4" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Candy Machine Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #guards label="Guards" theme="mint" z=1 /%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount"  /%}
{% node #destination label="Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="427" y="-14" %}
  {% node #candy-guard-route theme="pink" %}
    Route with

    Path = *thaw*
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Core Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="80" theme="transparent" %}
  Thaw a Frozen Asset
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="218" y="15" label="Freeze Escrow PDA" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="candy-machine" to="candy-guard-route" theme="pink" /%}
{% edge from="candy-guard" to="candy-guard-route" theme="pink" toPosition="left" /%}
{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}

{% edge from="candy-guard-route" to="freezeEscrow-PDA5" theme="pink" path="straight" /%}

{% node #frozen-NFT parent="candy-guard-route" y="-100" x="29" label="Frozen Asset" /%}
{% edge from="frozen-NFT" to="candy-guard-route" path="straight" /%}

{% node #freezeEscrow-PDA5 parent="candy-guard-route" x="25" y="150" label="Thawed Asset" /%}
{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

{% seperator h="6" /%}

{% dialect-switcher title="동결된 Asset 해제" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

아래 예제에서는 현재 identity에 속한 동결된 Asset을 해제합니다.

```ts
route(umi, {
  // ...
  guard: 'freezeSolPayment',
  routeArgs: {
    path: 'thaw',
    destination,
    nftMint: nftMint.publicKey,
    nftOwner: umi.identity.publicKey,
    nftTokenStandard: candyMachine.tokenStandard,
  },
})
```

API References: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [FreezeSolPaymentRouteArgsThaw](https://mpl-core-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentRouteArgsThaw.html)

{% /totem %}
{% /dialect %}

{% /dialect-switcher %}

### 자금 잠금 해제

_Path: `unlockFunds`_

모든 동결된 Asset이 해제되면, treasury는 Freeze Escrow 계정에서 자금을 잠금 해제할 수 있습니다. 이는 자금을 구성된 Destination 주소로 전송합니다.

자금을 잠금 해제하려면 가드의 route instruction에 다음 인수를 제공해야 합니다:

- **Path** = `unlockFunds`: route instruction에서 실행할 경로를 선택합니다.
- **Destination**: 이 가드와 관련된 모든 지불을 최종적으로 받을 지갑의 주소입니다.
- **Candy Guard Authority**: Candy Guard 계정의 권한자가 서명자로 포함되어야 합니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="19" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Candy Machine Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #guards label="Guards" theme="mint" z=1/%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount"  /%}
{% node #destination label="Destination" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="431" %}
  {% node #candy-guard-route theme="pink" %}
    Route with

    Path = *unlockFunds*
  {% /node %}
  {% node parent="mint-candy-guard" theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}

{% node parent="candy-guard-route" y="-20" x="10" theme="transparent" %}
  Unlock funds from the escrow
{% /node %}

{% node #freeze-period parent="candy-guard-route" x="220" y="15" label="Freeze Escrow PDA" /%}
{% edge from="freeze-period" to="candy-guard-route" theme="pink" path="straight" /%}

{% edge from="amount" to="candy-guard-route" theme="pink" toPosition="left" /%}

{% node parent="candy-guard-route" y="209" x="-18" %}
{% node #destination-wallet label="Destination Wallet" theme="indigo" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program
{% /node %}
{% /node %}
{% edge from="destination-wallet" to="destination" arrow="none" dashed=true /%}
{% edge from="candy-guard-route" to="destination-wallet" theme="pink" path="straight" %}
Transfer all funds from

the Freeze Escrow Account
{% /edge %}

{% edge from="candy-guard" to="candy-machine" /%}

{% edge from="candy-guard-guards" to="guards" /%}

{% /diagram %}

{% separator h="6" /%}

{% dialect-switcher title="자금 잠금 해제" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

아래 예제에서는 현재 identity를 Candy Guard 권한자로 사용하여 Freeze Escrow 계정에서 자금을 잠금 해제합니다.

```ts
route(umi, {
  // ...
  guard: 'freezeSolPayment',
  routeArgs: {
    path: 'unlockFunds',
    destination,
    candyGuardAuthority: umi.identity,
  },
})
```

API References: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [FreezeSolPaymentRouteArgsUnlockFunds](https://mpl-core-candy-machine.typedoc.metaplex.com/types/FreezeSolPaymentRouteArgsUnlockFunds.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Asset 동결 중단

Freeze Sol Payment 가드 내에서 Asset의 동결을 중단하는 것이 가능합니다. 즉, 새로 민팅된 Asset은 더 이상 동결되지 않지만 **기존 동결된 Asset은 동결 상태를 유지합니다**.

이를 달성하는 여러 가지 방법이 있으며, 두 가지 범주로 나눌 수 있습니다:

- ☀️ **해제 가능**: 기존 동결된 Asset은 route instruction의 `thaw` 경로를 사용하여 누구나 해제할 수 있습니다.
- ❄️ **해제 불가**: 기존 동결된 Asset은 아직 해제할 수 없으며 "해제 가능" 조건 중 하나가 충족될 때까지 기다려야 합니다.

이를 염두에 두고, Asset 동결을 중단하는 모든 방법의 목록과 각각이 기존 동결된 Asset의 해제를 허용하는지 여부는 다음과 같습니다:

- Candy Machine이 완전히 민팅됨 → ☀️ **해제 가능**.
- 구성된 동결 기간 — 최대 30일 — 이 지남 → ☀️ **해제 가능**.
- Candy Machine 계정이 삭제됨 → ☀️ **해제 가능**.
- Candy Guard 계정이 삭제됨 → ❄️ **해제 불가**.
- Freeze Sol Payment 가드가 설정에서 제거됨 → ❄️ **해제 불가**.

## Freeze Escrow와 가드 그룹

다양한 [가드 그룹](/ko/smart-contracts/core-candy-machine/guard-groups) 내에서 여러 Freeze Sol Payment 가드를 사용할 때는 Freeze Sol Payment 가드와 Freeze Escrow 계정 간의 관계를 이해하는 것이 중요합니다.

Freeze Escrow 계정은 Destination 주소에서 파생된 PDA입니다. 이는 **여러 Freeze Sol Payment 가드**가 **같은 Destination 주소**를 사용하도록 구성된 경우, 모두 **같은 Freeze Escrow 계정을 공유**한다는 의미입니다.

따라서 같은 동결 기간을 공유하고 모든 자금이 같은 escrow 계정에 의해 수집됩니다. 이는 또한 구성된 Destination 주소당 한 번만 `initialize` route instruction을 호출하면 된다는 것을 의미합니다. 이는 route instruction이 구성된 Destination 주소당 한 번만 필요하다는 것을 의미합니다. `unlockFunds`에 대해서도 마찬가지입니다. `thaw`의 경우 같은 escrow 계정을 공유한다면 원하는 라벨을 사용할 수 있습니다.

서로 다른 Destination 주소로 여러 Freeze Sol Payment 가드를 사용하는 것도 가능합니다. 이 경우 각 Freeze Sol Payment 가드는 자체 Freeze Escrow 계정과 자체 동결 기간을 갖습니다.

아래 예제는 세 그룹에 세 개의 Freeze Sol Payment 가드가 있는 Candy Machine을 보여줍니다:

- 그룹 1과 2는 같은 Destination 주소를 공유하므로 같은 Freeze Escrow 계정을 공유합니다.
- 그룹 3은 자체 Destination 주소를 가지므로 자체 Freeze Escrow 계정을 갖습니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guard Group 1" theme="mint" z=1/%}
{% node #freezeSolPayment label="Freeze Sol Payment" /%}
{% node #amount label="Amount = 1 SOL" /%}
{% node #destination label="Destination A" /%}
{% node label="..." /%}
{% node #guards-2 label="Guard Group 2" theme="mint" z=1/%}
{% node #freezeSolPayment-2 label="Freeze Sol Payment" /%}
{% node #amount-2 label="Amount = 2 SOL" /%}
{% node #destination-2 label="Destination A" /%}
{% node label="..." /%}
{% node #guards-3 label="Guard Group 3" theme="mint" z=1/%}
{% node #freezeSolPayment-3 label="Freeze Sol Payment" /%}
{% node #amount-3 label="Amount = 3 SOL" /%}
{% node #destination-3 label="Destination B" /%}
{% node label="..." /%}
{% /node %}
{% /node %}

{% node #freezeEscrow-PDA-A parent="destination" x="220" y="-22" %}
  Freeze Escrow PDA

  For Destination A
{% /node %}
{% edge from="destination" to="freezeEscrow-PDA-A" arrow="none" dashed=true path="straight" /%}
{% edge from="destination-2" to="freezeEscrow-PDA-A" arrow="none" dashed=true toPosition="bottom" /%}

{% node parent="freezeEscrow-PDA-A" y="-125" x="-4" %}
  {% node #route-init-a theme="pink" %}
    Route with

    Path = *Initialize*
  {% /node %}
  {% node theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="route-init-a" y="-20" x="50" theme="transparent" %}
  Initialize Freeze Escrow
{% /node %}
{% edge from="route-init-a" to="freezeEscrow-PDA-A" theme="pink" path="straight" /%}

{% node #freeze-period-a parent="route-init-a" x="240" y="15" theme="slate" %}
  Freeze Period A
{% /node %}
{% edge from="freeze-period-a" to="route-init-a" theme="pink" path="straight" /%}

{% node #freezeEscrow-PDA-B parent="destination-3" x="420" y="-22" %}
  Freeze Escrow PDA

  For Destination B
{% /node %}
{% edge from="destination-3" to="freezeEscrow-PDA-B" arrow="none" dashed=true path="straight" /%}

{% node parent="freezeEscrow-PDA-B" y="-125" x="-4" %}
  {% node #route-init-b theme="pink" %}
    Route with

    Path = *Initialize*
  {% /node %}
  {% node theme="pink" %}
    Candy Machine Guard Program {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="route-init-b" y="-20" x="50" theme="transparent" %}
  Initialize Freeze Escrow
{% /node %}
{% edge from="route-init-b" to="freezeEscrow-PDA-B" theme="pink" path="straight" /%}

{% node #freeze-period-b parent="route-init-b" x="240" y="15" theme="slate" %}
  Freeze Period B
{% /node %}
{% edge from="freeze-period-b" to="route-init-b" theme="pink" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}

{% /diagram %}

## Notes

- Freeze Escrow 계정은 민팅이 시작되기 전에 `initialize` route instruction을 통해 초기화해야 합니다.
- 최대 동결 기간은 30일(2,592,000초)입니다. 기간은 초기화 시점이 아닌 첫 번째 동결된 Asset이 민팅된 시점부터 시작됩니다.
- Freeze Escrow의 자금은 모든 동결된 Asset이 해제될 때까지 잠금 해제할 수 없습니다.
- 동결된 Asset이 존재하는 상태에서 Candy Guard 계정을 삭제하면, 다른 해제 조건이 충족될 때까지 해당 Asset은 영구적으로 동결됩니다.
- 여러 가드 그룹이 같은 Destination 주소를 공유하면, 단일 Freeze Escrow와 동결 기간을 공유합니다.

