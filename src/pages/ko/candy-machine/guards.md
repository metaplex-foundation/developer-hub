---
title: Candy 가드
metaTitle: Candy 가드 | Candy Machine
description: 가드가 어떻게 작동하고 어떻게 활성화하는지 설명합니다.
---

이제 Candy Machine이 어떻게 작동하고 어떻게 로드하는지 알았으니, 퍼즐의 마지막 조각인 가드에 대해 이야기해보겠습니다. {% .lead %}

## 가드란 무엇인가요?

가드는 Candy Machine의 민팅에 대한 접근을 제한하고 새로운 기능을 추가할 수도 있는 모듈식 코드 조각입니다!

선택할 수 있는 다양한 가드가 있으며, 각각 원하는 대로 활성화하고 구성할 수 있습니다.

이 문서의 뒷부분에서 사용 가능한 모든 가드를 다룰 예정이지만, 여기서는 몇 가지 예시를 통해 설명해보겠습니다.

- **시작 날짜** 가드가 활성화되면 사전 구성된 날짜 이전에는 민팅이 금지됩니다. 주어진 날짜 이후의 민팅을 금지하는 **종료 날짜** 가드도 있습니다.
- **SOL 결제** 가드가 활성화되면 민팅 지갑은 구성된 금액을 구성된 대상 지갑에 지불해야 합니다. 특정 컬렉션의 토큰이나 NFT로 결제하는 유사한 가드들이 존재합니다.
- **토큰 게이트**와 **NFT 게이트** 가드는 각각 특정 토큰 보유자와 NFT 보유자로 민팅을 제한합니다.
- **허용 목록** 가드는 지갑이 미리 정의된 지갑 목록의 일부인 경우에만 민팅을 허용합니다. 민팅을 위한 게스트 리스트와 같습니다.

보시다시피, 각 가드는 하나의 책임만을 담당하며, 이는 가드들을 조합 가능하게 만듭니다. 다시 말해, 완벽한 Candy Machine을 만들기 위해 필요한 가드들을 선택하고 조합할 수 있습니다.

## Candy Guard 계정

[Candy Machine 계정](/ko/candy-machine/manage#candy-machine-account)의 내용을 기억해보시면, 그곳에서는 가드의 흔적을 찾을 수 없습니다. 이는 가드들이 **Candy Guard 프로그램**에 의해 생성되는 **Candy Guard 계정**이라는 별도의 계정에 저장되기 때문입니다.

각 Candy Machine 계정은 일반적으로 자체 Candy Guard 계정과 연결되어야 하며, 이는 추가적인 보호 계층을 제공합니다.

이는 Candy Guard 계정을 생성하고 이를 Candy Machine 계정의 **민트 권한**으로 만드는 방식으로 작동합니다. 이렇게 함으로써 더 이상 메인 Candy Machine 프로그램(**Candy Machine Core 프로그램**이라고 알려진)에서 직접 민팅하는 것이 불가능해집니다. 대신, 모든 가드가 성공적으로 해결되면 Candy Machine Core 프로그램에 위임하여 민팅 프로세스를 완료하는 Candy Guard 프로그램을 통해 민팅해야 합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% node label="기능" /%}
{% node label="권한" /%}
{% node #mint-authority-1 %}

민트 권한 = Candy Guard {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="소유자: Candy Guard Program" theme="dimmed" /%}
{% node label="가드" theme="mint" z=1 /%}
{% node label="SOL 결제" /%}
{% node label="토큰 결제" /%}
{% node label="시작 날짜" /%}
{% node label="종료 날짜" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="민팅" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="접근 제어" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
활성화된 가드들을 \
준수하는 한 누구나 \
민팅할 수 있습니다.
{% /node %}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="민팅" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="민팅 로직" theme="transparent" /%}
{% node parent="mint-2" x=200 y=-18 theme="transparent" %}
Alice만 \
민팅할 수 \
있습니다.
{% /node %}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% node label="기능" /%}
{% node label="권한" /%}
{% node #mint-authority-2 %}

민트 권한 = Alice {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="mint-authority-1" fromPosition="left" toPosition="left" arrow=false dashed=true /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-2" theme="pink" path="straight" /%}

{% /diagram %}

Candy Machine과 Candy Guard 계정이 함께 작동하므로, 저희 SDK들은 이들을 하나의 엔티티로 취급합니다. SDK로 Candy Machine을 생성하면 연결된 Candy Guard 계정도 기본적으로 함께 생성됩니다. Candy Machine을 업데이트할 때도 마찬가지로 동시에 가드를 업데이트할 수 있습니다. 이 페이지에서 구체적인 예시들을 보겠습니다.

## 왜 별도의 프로그램인가요?

가드들이 메인 Candy Machine 프로그램에 포함되지 않은 이유는 접근 제어 로직을 NFT를 민팅하는 것이 주 책임인 메인 Candy Machine 책임과 분리하기 위함입니다.

이는 가드들을 모듈식으로 만들 뿐만 아니라 확장 가능하게 만듭니다. 누구나 커스텀 가드를 생성하기 위해 자신만의 Candy Guard 프로그램을 만들고 배포할 수 있으며, 나머지 모든 것은 Candy Machine Core 프로그램에 의존할 수 있습니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="소유자: Candy Guard Program" theme="dimmed" /%}
{% node label="가드" theme="mint" z=1 /%}
{% node label="SOL 결제" /%}
{% node label="토큰 결제" /%}
{% node label="시작 날짜" /%}
{% node label="종료 날짜" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=300 %}
{% node #mint-1 label="민팅" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=160 %}
{% node #mint-1b label="민팅" theme="pink" /%}
{% node label="커스텀 Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1b" x=-80 y=-22 label="다른 접근 제어" theme="transparent" /%}

{% node parent="mint-1" x=60 y=100 %}
{% node #mint-2 label="민팅" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=95 y=-20 label="동일한 민팅 로직" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-1b" x=250 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-2" y=80 x=0 %}
{% node #candy-guard-2 label="Candy Guard" theme="blue" /%}
{% node label="소유자: 커스텀 Candy Guard Program" theme="dimmed" /%}
{% node label="가드" theme="mint" z=1 /%}
{% node label="SOL 결제" /%}
{% node label="토큰 결제" /%}
{% node label="시작 날짜" /%}
{% node %}
나의 커스텀 가드 {% .font-semibold %}
{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="candy-guard-2" to="candy-machine-2" fromPosition="right" toPosition="right" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-1b" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-1b" theme="pink" /%}
{% edge from="candy-guard-2" to="mint-1b" theme="pink" /%}

{% /diagram %}

저희 SDK들은 또한 자신만의 Candy Guard 프로그램과 커스텀 가드들을 등록할 수 있는 방법을 제공하므로 친숙한 API를 활용하고 가드들을 다른 사람들과 쉽게 공유할 수 있습니다.

## 사용 가능한 모든 가드

이제 가드가 무엇인지 이해했으니, 저희가 사용할 수 있는 기본 가드들이 무엇인지 살펴보겠습니다.

다음 목록에서는 각 가드에 대한 간단한 설명과 더 자세한 내용을 위한 전용 페이지 링크를 제공합니다.

- [**Address Gate**](/ko/candy-machine/guards/address-gate): 민팅을 단일 주소로 제한합니다.
- [**Allow List**](/ko/candy-machine/guards/allow-list): 지갑 주소 목록을 사용하여 누가 민팅할 수 있는지 결정합니다.
- [**Bot Tax**](/ko/candy-machine/guards/bot-tax): 유효하지 않은 트랜잭션에 대해 부과할 구성 가능한 세금입니다.
- [**End Date**](/ko/candy-machine/guards/end-date): 민팅을 종료할 날짜를 결정합니다.
- [**Freeze Sol Payment**](/ko/candy-machine/guards/freeze-sol-payment): 동결 기간과 함께 민팅 가격을 SOL로 설정합니다.
- [**Freeze Token Payment**](/ko/candy-machine/guards/freeze-token-payment): 동결 기간과 함께 민팅 가격을 토큰 양으로 설정합니다.
- [**Gatekeeper**](/ko/candy-machine/guards/gatekeeper): Gatekeeper Network를 통해 민팅을 제한합니다 (예: Captcha 통합).
- [**Mint Limit**](/ko/candy-machine/guards/mint-limit): 지갑당 민팅 수 제한을 지정합니다.
- [**Nft Burn**](/ko/candy-machine/guards/nft-burn): 지정된 컬렉션의 보유자로 민팅을 제한하며, NFT 소각을 요구합니다.
- [**Nft Gate**](/ko/candy-machine/guards/nft-gate): 지정된 컬렉션의 보유자로 민팅을 제한합니다.
- [**Nft Payment**](/ko/candy-machine/guards/nft-payment): 민팅 가격을 지정된 컬렉션의 NFT로 설정합니다.
- [**Redeemed Amount**](/ko/candy-machine/guards/redeemed-amount): 민팅된 총량을 기준으로 민팅 종료를 결정합니다.
- [**Sol Payment**](/ko/candy-machine/guards/sol-payment): 민팅 가격을 SOL로 설정합니다.
- [**Start Date**](/ko/candy-machine/guards/start-date): 민팅 시작 날짜를 결정합니다.
- [**Third Party Signer**](/ko/candy-machine/guards/third-party-signer): 트랜잭션에 추가 서명자를 요구합니다.
- [**Token Burn**](/ko/candy-machine/guards/token-burn): 지정된 토큰의 보유자로 민팅을 제한하며, 토큰 소각을 요구합니다.
- [**Token Gate**](/ko/candy-machine/guards/token-gate): 지정된 토큰의 보유자로 민팅을 제한합니다.
- [**Token Payment**](/ko/candy-machine/guards/token-payment): 민팅 가격을 토큰 양으로 설정합니다.

## 가드와 함께 Candy Machine 생성하기

지금까지 우리가 생성한 Candy Machine에는 활성화된 가드가 없었습니다. 이제 사용 가능한 모든 가드를 알았으니, 일부 가드가 활성화된 새로운 Candy Machine을 설정하는 방법을 살펴보겠습니다.

구체적인 구현은 사용하는 SDK에 따라 달라지지만(아래 참조), 주요 아이디어는 필요한 설정을 제공하여 가드를 활성화한다는 것입니다. 설정되지 않은 가드는 비활성화됩니다.

{% dialect-switcher title="가드와 함께 Candy Machine 생성" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리를 사용하여 가드를 활성화하려면, `create` 함수에 `guards` 속성을 제공하고 활성화하려는 모든 가드의 설정을 전달하기만 하면 됩니다. `none()`으로 설정되거나 제공되지 않은 가드는 비활성화됩니다.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1.5), destination: treasury }),
    startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    // 다른 모든 가드는 비활성화됩니다...
  },
}).sendAndConfirm(umi)
```

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 가드 업데이트

가드에서 뭔가 잘못 설정하셨나요? 민팅 가격에 대해 마음이 바뀌셨나요? 민팅 시작을 조금 연기해야 하나요? 걱정하지 마세요. 가드는 생성할 때 사용한 것과 동일한 설정으로 쉽게 업데이트할 수 있습니다.

설정을 제공하여 새로운 가드를 활성화하거나 빈 설정을 제공하여 현재 가드를 비활성화할 수 있습니다.

{% dialect-switcher title="가드 업데이트" %}
{% dialect title="JavaScript" id="js" %}

Candy Machine의 가드를 생성할 때와 같은 방식으로 업데이트할 수 있습니다. 즉, `updateCandyGuard` 함수의 `guards` 객체 내에 설정을 제공하면 됩니다. `none()`으로 설정되거나 제공되지 않은 가드는 비활성화됩니다.

전체 `guards` 객체가 업데이트되므로 **기존의 모든 가드를 덮어씁니다!**

따라서 설정이 변경되지 않더라도 활성화하려는 모든 가드의 설정을 제공해야 합니다. 현재 가드로 폴백하기 위해 먼저 candy guard 계정을 가져올 수 있습니다.

```tsx
import { some, none, sol } from '@metaplex-foundation/umi'

const candyGuard = fetchCandyGuard(umi, candyMachine.mintAuthority)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: {
    ...candyGuard.guards,
    botTax: none(),
    solPayment: some({ lamports: sol(3), destination: treasury }),
  },
})
```

API 참조: [updateCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [CandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Candy Machine의 가드 보기

Candy Machine에 가드를 설정하면, 제공된 모든 설정을 Candy Guard 계정에서 누구나 검색하고 볼 수 있습니다.

{% dialect-switcher title="가드 가져오기" %}
{% dialect title="JavaScript" id="js" %}

candy machine의 `mintAuthority` 속성에서 `fetchCandyGuard` 함수를 사용하여 candy machine과 연결된 candy guard에 접근할 수 있습니다.

```ts
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

candyGuard.guards // 모든 가드 설정
candyGuard.guards.botTax // Bot Tax 설정
candyGuard.guards.solPayment // Sol Payment 설정
// ...
```

`create` 함수를 사용할 때 각 candy machine에 대해 연결된 candy guard 계정이 자동으로 생성되어 주소가 결정적임을 참고하세요. 따라서 이 경우 다음과 같이 하나의 RPC 호출만 사용하여 두 계정을 모두 가져올 수 있습니다.

```ts
import { assertAccountExists } from '@metaplex-foundation/umi'
import {
  findCandyGuardPda,
  deserializeCandyMachine,
  deserializeCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyGuardAddress = findCandyGuardPda(umi, { base: candyMachineAddress })
const [rawCandyMachine, rawCandyGuard] = await umi.rpc.getAccounts([
  candyMachineAddress,
  candyGuardAddress,
])
assertAccountExists(rawCandyMachine)
assertAccountExists(rawCandyGuard)

const candyMachine = deserializeCandyMachine(umi, rawCandyMachine)
const candyGuard = deserializeCandyGuard(umi, rawCandyGuard)
```

API 참조: [fetchCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/fetchCandyGuard.html), [findCandyGuardPda](https://mpl-candy-machine.typedoc.metaplex.com/functions/findCandyGuardPda.html), [CandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 수동으로 Candy Guard 계정 래핑 및 언래핑

지금까지 우리는 대부분의 프로젝트에 가장 적합하기 때문에 Candy Machine과 Candy Guard 계정을 함께 관리했습니다.

하지만 Candy Machine과 Candy Guard는 SDK를 사용하더라도 다른 단계에서 생성하고 연결할 수 있다는 점을 유의하는 것이 중요합니다.

먼저 두 계정을 별도로 생성하고 수동으로 연결/분리해야 합니다.

{% dialect-switcher title="Candy Machine에서 가드 연결 및 분리" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리의 `create` 함수는 이미 생성된 모든 Candy Machine 계정에 대해 새로운 Candy Guard 계정을 생성하고 연결하는 작업을 처리합니다.

하지만 별도로 생성하고 수동으로 연결/분리하고 싶다면 다음과 같이 할 수 있습니다.

```ts
import { some, percentAmount, sol, dateTime } from '@metaplex-foundation/umi'

// Candy Guard 없이 Candy Machine 생성
const candyMachine = generateSigner(umi)
await (await createCandyMachineV2(umi, {
  candyMachine,
  tokenStandard: TokenStandard.NonFungible,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  sellerFeeBasisPoints: percentAmount(1.23),
  creators: [
    { address: umi.identity.publicKey, verified: false, percentageShare: 100 },
  ],
  configLineSettings: some({
    prefixName: 'My NFT #',
    nameLength: 3,
    prefixUri: 'https://example.com/',
    uriLength: 20,
    isSequential: false,
  }),
})).sendAndConfirm(umi)

// Candy Guard 생성
const base = generateSigner(umi)
const candyGuard = findCandyGuardPda(umi, { base: base.publicKey })
await createCandyGuard(umi, {
  base,
  guards: {
    botTax: { lamports: sol(0.01), lastInstruction: false },
    solPayment: { lamports: sol(1.5), destination: treasury },
    startDate: { date: dateTime('2022-10-17T16:00:00Z') },
  },
}).sendAndConfirm(umi)

// Candy Guard를 Candy Machine과 연결
await wrap(umi, {
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)

// 연결 해제
await unwrap(umi, {
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)
```

API 참조: [createCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyMachineV2.html), [createCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyGuard.html), [wrap](https://mpl-candy-machine.typedoc.metaplex.com/functions/wrap.html), [unwrap](https://mpl-candy-machine.typedoc.metaplex.com/functions/unwrap.html)

{% /dialect %}
{% /dialect-switcher %}

## 결론

가드는 Candy Machine의 중요한 구성 요소입니다. 가드는 민팅 프로세스를 쉽게 구성할 수 있게 하며, 애플리케이션 특정 요구에 따라 누구나 자신만의 가드를 만들 수 있게 해줍니다. [다음 페이지](/ko/candy-machine/guard-groups)에서는 가드 그룹을 사용하여 훨씬 더 많은 민팅 시나리오를 만드는 방법을 살펴보겠습니다!