---
title: 가드 그룹
metaTitle: 가드 그룹 | Candy Machine
description: 여러 가드 그룹을 구성하는 방법을 설명합니다.
---

[이전 페이지](/ko/smart-contracts/candy-machine/guards)에서 가드를 소개하고 이를 사용하여 Candy Machine의 접근 제어를 정의했습니다. 가드를 사용하여 민팅당 1 SOL의 결제를 추가하고 특정 날짜 이후에 민팅이 시작되도록 할 수 있음을 보았습니다. 하지만 두 번째 날짜 이후에 2 SOL을 청구하고 싶다면 어떨까요? 특정 토큰 보유자가 무료로 또는 할인된 가격으로 민팅할 수 있도록 하고 싶다면 어떨까요? {% .lead %}

각각 고유한 요구 사항을 가진 여러 가드 세트를 정의할 수 있다면 어떨까요? 이러한 이유로 **가드 그룹**을 만들었습니다!

## 그룹은 어떻게 작동하나요?

활성화하려는 가드의 설정을 제공하여 [Candy Machine에 가드를 설정할 수 있는 방법](/ko/smart-contracts/candy-machine/guards#creating-a-candy-machine-with-guards)을 기억하시나요? 가드 그룹도 같은 방식으로 작동하지만, 식별을 위해 고유한 **레이블**을 제공해야 합니다.

따라서 각 가드 그룹은 다음과 같은 속성을 가집니다:

- **레이블**: 고유한 텍스트 식별자입니다. 6자 이하여야 합니다.
- **가드**: 해당 그룹 내에서 활성화된 모든 가드의 설정입니다. 이는 Candy Machine에 직접 가드를 설정하는 것과 같은 방식으로 작동합니다.

간단한 예시를 들어보겠습니다. 오후 4시부터 5시까지 1 SOL을 청구하고, 오후 5시부터 Candy Machine이 소진될 때까지 2 SOL을 청구하고 싶다고 해봅시다. 모든 것은 Bot Tax 가드를 통해 봇으로부터 보호받으면서 말입니다. 다음과 같이 가드를 설정할 수 있습니다:

- 그룹 1:
  - **레이블**: "early"
  - **가드**:
    - SOL 결제: 1 SOL
    - 시작 날짜: 오후 4시 (단순함을 위해 실제 날짜는 무시)
    - 종료 날짜: 오후 5시
    - Bot Tax: 0.001 SOL
- 그룹 2:
  - **레이블**: "late"
  - **가드**:
    - SOL 결제: 2 SOL
    - 시작 날짜: 오후 5시
    - Bot Tax: 0.001 SOL

이렇게 해서 맞춤형 2단계 민팅 프로세스를 만들었습니다!

이제 누군가가 우리의 Candy Machine에서 민팅을 시도할 때마다 **어느 그룹에서 민팅하는지 명시적으로 알려줘야 합니다**. 민팅할 때 그룹 레이블을 요청하는 것이 중요한 이유는:

- 구매자가 예상치 못한 민팅 동작을 경험하지 않도록 보장합니다. 첫 번째 그룹의 종료 날짜 맨 마지막에 1 SOL로 민팅을 시도했지만, 트랜잭션이 실행될 때까지 해당 날짜가 지났다고 해봅시다. 그룹 레이블을 요청하지 않았다면 트랜잭션은 성공하고 1 SOL만 지불할 것으로 예상했음에도 불구하고 2 SOL이 청구될 것입니다.
- 병렬 그룹을 지원할 수 있게 해줍니다. 이에 대해서는 이 페이지 뒷부분에서 더 자세히 다루겠습니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="소유자: Candy Guard Program" theme="dimmed" /%}
{% node #group-1 theme="mint" z=1 %}
그룹 1: "early" {% .font-semibold %}
{% /node %}
{% node label="SOL 결제" /%}
{% node label="시작 날짜" /%}
{% node label="종료 날짜" /%}
{% node label="Bot Tax" /%}
{% node theme="mint" z=1 %}
그룹 2: "late"
{% /node %}
{% node label="SOL 결제" /%}
{% node label="시작 날짜" /%}
{% node label="Bot Tax" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="민팅" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="접근 제어" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="민팅" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="민팅 로직" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" %}
어느 그룹에서 \
민팅할지 선택
{% /edge %}

{% /diagram %}

이제 SDK를 사용하여 그룹을 생성하고 업데이트하는 방법을 살펴보겠습니다.

{% dialect-switcher title="가드 그룹과 함께 Candy Machine 생성" %}
{% dialect title="JavaScript" id="js" %}

가드 그룹과 함께 Candy Machine을 생성하려면 `create` 함수에 `groups` 배열을 제공하기만 하면 됩니다. 이 배열의 각 항목은 `label`과 해당 그룹에서 활성화하려는 모든 가드의 설정을 포함하는 `guards` 객체를 포함해야 합니다.

Umi 라이브러리를 사용하여 위 예시를 구현하는 방법은 다음과 같습니다.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

그룹을 업데이트하려면 `updateCandyGuard` 함수에 동일한 `groups` 속성을 제공하면 됩니다.
전체 `guards` 객체와 `groups` 배열이 업데이트되므로 **기존의 모든 데이터를 덮어씁니다!**

따라서 설정이 변경되지 않더라도 모든 그룹의 설정을 제공해야 합니다. 기존 설정을 덮어쓰지 않도록 미리 최신 candy guard 계정 데이터를 가져올 수 있습니다.

다음은 "late" 그룹의 SOL 결제 가드를 2 SOL 대신 3 SOL로 변경하는 예시입니다.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: candyGuard.guards,
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(3), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [updateCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 기본 가드

위의 예시에서 두 그룹 모두에 동일한 **Bot Tax** 가드를 제공해야 했음에 주목하세요. 이는 Candy Machine에 설정된 글로벌 **가드**를 활용하여 단순화할 수 있습니다.

가드 그룹을 사용할 때, [이전 페이지](/ko/smart-contracts/candy-machine/guards)에서 설명한 Candy Machine의 글로벌 가드는 **기본 가드 역할**을 합니다! 즉, 그룹에서 명시적으로 활성화하여 덮어쓰지 않는 한 그룹은 글로벌 가드와 동일한 가드 설정을 기본값으로 사용합니다.

간단한 요약입니다:

- 기본 가드에서는 활성화되어 있지만 그룹의 가드에서는 활성화되어 있지 않은 가드가 있으면, 그룹은 **기본 가드에서 정의된 대로** 가드를 사용합니다.
- 기본 가드에서도 활성화되어 있고 그룹의 가드에서도 활성화되어 있는 가드가 있으면, 그룹은 **그룹의 가드에서 정의된 대로** 가드를 사용합니다.
- 기본 가드나 그룹의 가드에서 활성화되어 있지 않은 가드는 그룹에서 사용하지 않습니다.

이를 설명하기 위해 이전 섹션의 예시를 가져와서 **Bot Tax** 가드를 기본 가드로 이동해보겠습니다.

- 기본 가드:
  - Bot Tax: 0.001 SOL
- 그룹 1:
  - **레이블**: "early"
  - **가드**:
    - SOL 결제: 1 SOL
    - 시작 날짜: 오후 4시
    - 종료 날짜: 오후 5시
- 그룹 2:
  - **레이블**: "late"
  - **가드**:
    - SOL 결제: 2 SOL
    - 시작 날짜: 오후 5시

보시다시피, 기본 가드는 그룹 내에서 반복을 피하는 데 유용합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="소유자: Candy Guard Program" theme="dimmed" /%}
{% node label="가드 (기본 가드)" theme="mint" z=1 /%}
{% node label="Bot Tax" /%}
{% node #group-1 theme="mint" z=1 %}
그룹 1: "early" {% .font-semibold %}
{% /node %}
{% node label="SOL 결제" /%}
{% node label="시작 날짜" /%}
{% node label="종료 날짜" /%}
{% node theme="mint" z=1 %}
그룹 2: "late"
{% /node %}
{% node label="SOL 결제" /%}
{% node label="시작 날짜" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="민팅" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="접근 제어" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="민팅" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="민팅 로직" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" /%}

{% /diagram %}

기본 가드를 사용하더라도 민팅할 때 그룹을 제공해야 함에 주의하세요. 즉, 가드 그룹을 사용할 때는 **기본 가드만을 사용하여 민팅하는 것이 불가능합니다**.

{% dialect-switcher title="기본 가드와 가드 그룹으로 Candy Machine 생성" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리에서 기본 가드를 사용하려면 Candy Machine을 생성하거나 업데이트할 때 `guards` 속성을 `groups` 배열과 함께 사용하기만 하면 됩니다. 예를 들어, 위에서 설명한 가드 설정을 사용하여 Candy Machine을 생성하는 방법은 다음과 같습니다.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
  },
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 병렬 그룹

민팅할 때 그룹 레이블을 요구하는 정말 흥미로운 이점 중 하나는 **주어진 시간에 둘 이상의 유효한 그룹을 가질 수 있다**는 것입니다. 이는 프로그램에서 모든 모호함을 제거하고 구매자가 민팅을 시도할 그룹을 선택할 수 있게 해줍니다.

새로운 예시로 이를 설명해보겠습니다. "Innocent Bird"라는 NFT 컬렉션이 있고 "Innocent Bird" NFT를 보유한 누구에게나 1 SOL의 할인 가격을 제공하고 다른 모든 사람에게는 2 SOL을 청구하고 싶다고 해봅시다. 두 그룹 모두 동시에(오후 4시라고 하자) 민팅을 시작할 수 있도록 하고, 두 그룹 모두 봇으로부터 보호받고 싶습니다. 다음과 같이 가드를 구성할 수 있습니다:

- 기본 가드:
  - 시작 날짜: 오후 4시
  - Bot Tax: 0.001 SOL
- 그룹 1:
  - **레이블**: "nft"
  - **가드**:
    - SOL 결제: 1 SOL
    - NFT 게이트: "Innocent Bird" 컬렉션
- 그룹 2:
  - **레이블**: "public"
  - **가드**:
    - SOL 결제: 2 SOL

보시다시피, 이러한 가드 설정으로 두 그룹 모두 동시에 민팅할 수 있습니다. NFT 보유자가 "public" 그룹에서 민팅하기로 결정한다면 전체 2 SOL을 지불할 수도 있습니다. 하지만 가능하다면 "nft" 그룹을 선택하는 것이 그들의 최선의 이익입니다.

{% dialect-switcher title="병렬 그룹으로 Candy Machine 생성" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리를 통해 위에서 설명한 가드 설정을 사용하여 Candy Machine을 생성하는 방법은 다음과 같습니다.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
    startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
  },
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ amount: sol(1), destination: treasury }),
        nftGate: some({
          requiredCollection: innocentBirdCollectionNft.publicKey,
        }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ amount: sol(2), destination: treasury }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 결론

가드 그룹은 우리의 요구에 맞춘 순차적 그리고/또는 병렬 민팅 워크플로를 정의할 수 있게 하여 Candy Machine에 완전히 새로운 차원을 제공합니다.

[다음 페이지](/ko/smart-contracts/candy-machine/guard-route)에서는 가드에 대한 또 다른 흥미로운 기능인 가드 명령어를 살펴보겠습니다!
