---
title: 가드 그룹
metaTitle: 가드 그룹 | 코어 캔디 머신
description: 가드 그룹을 사용하면 단일 Core Candy Machine에서 각각 고유한 레이블과 액세스 제어 규칙을 가진 여러 개의 독립적인 가드 세트를 정의하여 순차적 및 병렬 민팅 워크플로우를 구현할 수 있습니다.
keywords:
  - guard groups
  - Core Candy Machine
  - candy guard
  - minting workflow
  - default guards
  - parallel minting
  - group label
  - access control
  - NFT minting
  - Solana
  - Metaplex
  - guard configuration
  - multi-tier mint
about:
  - Guard Groups
  - Candy Machine configuration
  - Minting workflows
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: 가드 그룹의 최대 레이블 길이는 얼마인가요?
    a: 가드 그룹 레이블은 6자 이하여야 합니다. 온체인 계정 구조가 이 제한을 적용하므로 6자를 초과하는 레이블은 트랜잭션 실패를 유발합니다.
  - q: 가드 그룹이 구성된 경우 기본 가드만으로 민팅할 수 있나요?
    a: 아니요. 가드 그룹이 존재할 때 모든 민트 트랜잭션은 그룹 레이블을 지정해야 합니다. 기본 가드만으로는 민팅할 수 없으며, 기본 가드는 그룹에 상속되는 폴백 설정으로만 작용합니다.
  - q: 가드 그룹은 단일 아이템 풀을 공유하나요, 아니면 각 그룹에 자체 공급이 있나요?
    a: 모든 가드 그룹은 동일한 Core Candy Machine 아이템 풀에서 가져옵니다. 각 그룹 내에 Allocation과 같은 가드를 추가하여 해당 그룹이 배포할 수 있는 아이템 수를 제한하지 않는 한 그룹별 공급 제한은 없습니다.
  - q: 병렬 가드 그룹이 겹치는 시간 윈도우를 어떻게 처리하나요?
    a: 두 개 이상의 그룹이 겹치는 시작 및 종료 날짜를 가질 때, 구매자는 민트 지시사항에서 그룹 레이블을 지정하여 어느 그룹에서 민팅할지 선택합니다. Candy Guard 프로그램은 선택된 그룹의 가드만 평가하므로(기본 가드와 병합) 두 그룹이 충돌 없이 동시에 작동할 수 있습니다.
  - q: 기존 Candy Machine에서 가드 그룹을 업데이트하면 어떻게 되나요?
    a: updateCandyGuard 지시사항은 전체 가드 및 그룹 구성을 한 번에 교체합니다. 설정이 변경되지 않은 그룹도 업데이트 호출에 포함해야 하며, 그렇지 않으면 제거됩니다. 기존 설정을 실수로 덮어쓰지 않으려면 업데이트 전에 현재 Candy Guard 계정 데이터를 가져오세요.
---

## 요약

가드 그룹을 사용하면 단일 [Core Candy Machine](/ko/smart-contracts/core-candy-machine/overview)에서 여러 개의 독립적인 [가드](/ko/smart-contracts/core-candy-machine/guards) 세트를 정의할 수 있으며, 각 세트는 고유한 레이블로 식별되어 서로 다른 민팅 단계나 대상에 서로 다른 액세스 제어 규칙이 적용됩니다.

- 각 그룹은 자체 가드 구성과 최대 6자의 레이블을 가지며, 구매자는 [민팅](/ko/smart-contracts/core-candy-machine/mint) 시 이 레이블을 지정합니다.
- 기본(글로벌) 가드는 그룹 수준에서 명시적으로 재정의하지 않는 한 모든 그룹에 상속됩니다.
- 그룹은 순차적(시간 게이트된 티어) 또는 병렬(보유자 할인과 퍼블릭 세일 동시 진행)로 실행할 수 있습니다.
- 그룹이 존재할 때 기본 가드만으로는 민팅할 수 없으며, 항상 그룹 레이블이 필요합니다.

[이전 페이지](/ko/smart-contracts/core-candy-machine/guards) 중 하나에서 가드를 소개하고 이를 사용하여 캔디 머신의 액세스 제어를 정의했습니다. 가드를 사용하면 예를 들어 민트당 1 SOL의 결제를 추가하고 특정 날짜 이후에 민팅이 시작되도록 할 수 있다는 것을 보았습니다. 하지만 두 번째 날짜 이후에 2 SOL을 청구하고 싶다면 어떨까요? 특정 토큰 보유자가 무료로 또는 할인된 가격으로 민팅할 수 있게 하고 싶다면 어떨까요? {% .lead %}

각각 고유한 요구 사항을 가진 여러 가드 세트를 정의할 수 있다면 어떨까요? 이러한 이유로 **가드 그룹**을 만들었습니다!

## 가드 그룹의 작동 방식

가드 그룹은 표준 [가드](/ko/smart-contracts/core-candy-machine/guards) 시스템을 확장하여 단일 Core Candy Machine에 여러 개의 명명된 가드 구성 세트를 연결할 수 있게 합니다. 각 세트는 짧은 레이블로 식별되며 민팅 시 독립적으로 평가됩니다.

따라서 각 가드 그룹에는 다음 속성이 있습니다:

- **레이블**: 고유한 텍스트 식별자입니다. 6자를 초과할 수 없습니다.
- **가드**: 해당 그룹 내에서 활성화된 모든 가드의 설정입니다. 이는 코어 캔디 머신에서 직접 가드를 설정하는 것과 같은 방식으로 작동합니다.

빠른 예시를 들어보겠습니다. 오후 4시부터 5시까지는 1 SOL을, 오후 5시부터 코어 캔디 머신이 소진될 때까지는 2 SOL을 청구하고 싶다고 가정해보겠습니다. 이 모든 것을 봇 택스 가드를 통해 봇으로부터 보호받으면서 말이죠. 다음과 같이 가드를 설정할 수 있습니다:

- 그룹 1:
  - **레이블**: "early"
  - **가드**:
    - Sol Payment: 1 SOL
    - Start Date: 4 pm (단순화를 위해 실제 날짜는 무시합니다)
    - End Date: 5 pm
    - Bot Tax: 0.001 SOL
- 그룹 2:
  - **레이블**: "late"
  - **가드**:
    - Sol Payment: 2 SOL
    - Start Date: 5 pm
    - Bot Tax: 0.001 SOL

이렇게 해서 맞춤형 2단계 민팅 프로세스를 만들었습니다!

이제 누군가 우리의 코어 캔디 머신에서 [민팅](/ko/smart-contracts/core-candy-machine/mint)을 시도할 때마다 **어느 그룹에서 민팅하는지 명시적으로 알려줘야 합니다**. 민팅할 때 그룹 레이블을 요청하는 것이 중요한 이유는 다음과 같습니다:

- 구매자가 예상치 못한 민팅 동작을 경험하지 않도록 보장합니다. 첫 번째 그룹의 종료 날짜 바로 끝에 1 SOL로 민팅을 시도했지만, 트랜잭션이 실행될 때쯤에는 이미 그 날짜를 지났다고 가정해보겠습니다. 그룹 레이블을 요청하지 않았다면, 트랜잭션이 성공하고 1 SOL만 청구될 것으로 예상했음에도 불구하고 2 SOL이 청구될 것입니다.
- 병렬 그룹을 지원할 수 있게 해줍니다. 이에 대해서는 이 페이지의 뒷부분에서 자세히 이야기하겠습니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node #group-1 theme="mint" z=1 %}
Group 1: "early" {% .font-semibold %}
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="Bot Tax" /%}
{% node theme="mint" z=1 %}
Group 2: "late"
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="Bot Tax" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=70 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=78 y=100 label="NFT" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" %}
Select which group \
to mint from
{% /edge %}

{% /diagram %}

이제 SDK를 사용하여 그룹을 생성하고 업데이트하는 방법을 살펴보겠습니다.

{% dialect-switcher title="가드 그룹으로 캔디 머신 생성" %}
{% dialect title="JavaScript" id="js" %}

가드 그룹으로 캔디 머신을 생성하려면 `create` 함수에 `groups` 배열을 제공하기만 하면 됩니다. 이 배열의 각 항목에는 `label`과 해당 그룹에서 활성화하려는 모든 가드의 설정이 포함된 `guards` 객체가 있어야 합니다.

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
전체 `guards` 객체와 `groups` 배열이 업데이트되어 **기존 데이터를 모두 덮어쓴다는 점**에 주의하세요!

따라서 설정이 변경되지 않더라도 모든 그룹의 설정을 제공해야 합니다. 기존 설정을 덮어쓰는 것을 방지하기 위해 미리 최신 캔디 가드 계정 데이터를 가져오고 싶을 수도 있습니다.

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

API 참조: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [updateCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 기본 가드와 가드 그룹 상속

기본(글로벌) 가드는 모든 가드 그룹이 자동으로 상속하는 공유 기준선 역할을 합니다. 그룹이 명시적으로 가드를 활성화하지 않으면 기본 설정으로 폴백하고, 그룹이 동일한 가드를 활성화하면 그룹 수준 설정이 우선합니다.

간단한 요약은 다음과 같습니다:

- 기본 가드에서는 활성화되었지만 그룹의 가드에서는 활성화되지 않은 가드의 경우, 그룹은 **기본 가드에서 정의된 대로** 가드를 사용합니다.
- 기본 가드에서_와_ 그룹의 가드에서 모두 활성화된 가드의 경우, 그룹은 **그룹의 가드에서 정의된 대로** 가드를 사용합니다.
- 기본 가드나 그룹의 가드에서 활성화되지 않은 가드의 경우, 그룹은 이 가드를 사용하지 않습니다.

이를 설명하기 위해 이전 섹션의 예시를 가져와서 **봇 택스** 가드를 기본 가드로 이동해보겠습니다.

- 기본 가드:
  - Bot Tax: 0.001 SOL
- 그룹 1:
  - **레이블**: "early"
  - **가드**:
    - Sol Payment: 1 SOL
    - Start Date: 4 pm
    - End Date: 5 pm
- 그룹 2:
  - **레이블**: "late"
  - **가드**:
    - Sol Payment: 2 SOL
    - Start Date: 5 pm

보시다시피 기본 가드는 그룹 내에서 반복을 피하는 데 유용합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards (default guards)" theme="mint" z=1 /%}
{% node label="Bot Tax" /%}
{% node #group-1 theme="mint" z=1 %}
Group 1: "early" {% .font-semibold %}
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node theme="mint" z=1 %}
Group 2: "late"
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" /%}

{% /diagram %}

{% callout type="warning" %}
기본 가드를 사용하더라도 민팅 시 그룹 레이블을 제공해야 합니다. 가드 그룹이 구성된 경우 **기본 가드만으로는 민팅할 수 없습니다**.
{% /callout %}

{% dialect-switcher title="기본 가드와 가드 그룹으로 캔디 머신 생성" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리에서 기본 가드를 사용하려면 캔디 머신을 생성하거나 업데이트할 때 `groups` 배열과 함께 `guards` 속성을 사용하면 됩니다. 예를 들어, 위에서 설명한 가드 설정을 사용하여 캔디 머신을 생성하는 방법은 다음과 같습니다.

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

API 참조: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 병렬 가드 그룹

병렬 가드 그룹을 사용하면 두 개 이상의 그룹이 동시에 유효할 수 있으며, 구매자가 어느 그룹에서 민팅할지 선택할 수 있습니다. 민트 지시사항에서 그룹 레이블을 요구하면 모호함이 제거되고 동시 그룹이 가능해집니다.

새로운 예시로 이를 설명해보겠습니다. "Innocent Bird"라는 자산 컬렉션이 있고, "Innocent Bird" 자산을 보유한 사람에게는 1 SOL의 할인된 가격을, 다른 사람에게는 2 SOL을 청구하고 싶다고 가정해보겠습니다. 두 그룹 모두 동시에 -- 예를 들어 오후 4시에 -- 민팅을 시작할 수 있게 하고, 두 그룹 모두 봇으로부터 보호받고 싶습니다. 다음과 같이 가드를 구성할 수 있습니다:

- 기본 가드:
  - Start Date: 4 pm
  - Bot Tax: 0.001 SOL
- 그룹 1:
  - **레이블**: "nft"
  - **가드**:
    - Sol Payment: 1 SOL
    - NFT Gate: "Innocent Bird" Collection
- 그룹 2:
  - **레이블**: "public"
  - **가드**:
    - Sol Payment: 2 SOL

보시다시피 이러한 가드 설정으로는 두 그룹이 동시에 민팅할 수 있습니다. NFT 보유자가 "public" 그룹에서 민팅하기로 결정하면 전체 2 SOL을 지불하는 것도 가능합니다. 하지만 가능하다면 "nft" 그룹을 선택하는 것이 그들에게 가장 유리합니다.

{% dialect-switcher title="병렬 그룹으로 코어 캔디 머신 생성" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리를 통해 위에서 설명한 가드 설정을 사용하여 코어 캔디 머신을 생성하는 방법은 다음과 같습니다.

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

API 참조: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 참고사항

- 가드 그룹 레이블은 최대 **6자**로 제한됩니다. 이 제한을 초과하면 트랜잭션이 실패합니다.
- 가드 그룹이 구성된 경우, 그룹은 명시적으로 활성화한 기본 가드를 **재정의**합니다. 그룹에서 비활성화된 가드는 기본값으로 폴백합니다.
- 그룹이 존재할 때 구매자는 모든 민트 트랜잭션에서 **그룹 레이블을 지정해야** 합니다. 기본 가드만으로는 민팅할 수 없습니다.
- `updateCandyGuard`를 통한 가드 그룹 업데이트는 **전체** 가드 및 그룹 구성을 교체합니다. 데이터 손실을 방지하려면 변경되지 않은 그룹도 포함하여 업데이트에 모든 그룹을 포함하세요.
- 모든 그룹은 동일한 Core Candy Machine 아이템 풀을 공유합니다. 그룹별 공급을 제한해야 하는 경우 Allocation과 같은 그룹별 가드를 사용하세요.
- [라우트 지시사항](/ko/smart-contracts/core-candy-machine/guard-route)이 필요한 가드(예: Allow List 검증)의 경우 라우트 호출에도 그룹 레이블을 포함해야 올바른 가드 구성이 평가됩니다.

## 결론

가드 그룹은 우리의 요구에 맞는 순차적 및/또는 병렬 민팅 워크플로우를 정의할 수 있게 함으로써 코어 캔디 머신에 완전히 새로운 차원을 가져다줍니다.

[다음 페이지](/ko/smart-contracts/core-candy-machine/guard-route)에서는 가드에 대한 또 다른 흥미로운 기능인 가드 지시사항을 살펴보겠습니다!

## FAQ

### 가드 그룹의 최대 레이블 길이는 얼마인가요?

가드 그룹 레이블은 6자 이하여야 합니다. 온체인 계정 구조가 이 제한을 적용하므로 6자를 초과하는 레이블은 트랜잭션 실패를 유발합니다.

### 가드 그룹이 구성된 경우 기본 가드만으로 민팅할 수 있나요?

아니요. 가드 그룹이 존재할 때 모든 [민트](/ko/smart-contracts/core-candy-machine/mint) 트랜잭션은 그룹 레이블을 지정해야 합니다. 기본 가드만으로는 민팅할 수 없으며, 기본 가드는 그룹에 상속되는 폴백 설정으로만 작용합니다.

### 가드 그룹은 단일 아이템 풀을 공유하나요, 아니면 각 그룹에 자체 공급이 있나요?

모든 가드 그룹은 동일한 Core Candy Machine 아이템 풀에서 가져옵니다. 각 그룹 내에 Allocation과 같은 가드를 추가하여 해당 그룹이 배포할 수 있는 아이템 수를 제한하지 않는 한 그룹별 공급 제한은 없습니다.

### 병렬 가드 그룹이 겹치는 시간 윈도우를 어떻게 처리하나요?

두 개 이상의 그룹이 겹치는 시작 및 종료 날짜를 가질 때, 구매자는 민트 지시사항에서 그룹 레이블을 지정하여 어느 그룹에서 민팅할지 선택합니다. Candy Guard 프로그램은 선택된 그룹의 [가드](/ko/smart-contracts/core-candy-machine/guards)만 평가하므로(기본 가드와 병합) 두 그룹이 충돌 없이 동시에 작동할 수 있습니다.

### 기존 Candy Machine에서 가드 그룹을 업데이트하면 어떻게 되나요?

`updateCandyGuard` 지시사항은 전체 가드 및 그룹 구성을 한 번에 교체합니다. 설정이 변경되지 않은 그룹도 업데이트 호출에 포함해야 하며, 그렇지 않으면 제거됩니다. 기존 설정을 실수로 덮어쓰지 않으려면 업데이트 전에 현재 Candy Guard 계정 데이터를 가져오세요.

## 용어집

| 용어 | 정의 |
|------|------|
| Guard Group (가드 그룹) | 고유한 레이블로 식별되는 Core Candy Machine에 연결된 명명된 가드 구성 세트입니다. |
| Label (레이블) | 가드 그룹을 고유하게 식별하며 민트 지시사항에서 지정해야 하는 문자열 식별자(최대 6자)입니다. |
| Default Guards (기본 가드) | 명시적으로 재정의하지 않는 한 모든 가드 그룹이 상속하는 Core Candy Machine의 글로벌 가드 설정입니다. |
| Resolved Guards (해결된 가드) | 그룹의 가드와 기본 가드를 병합하여 민팅 시 적용되는 최종 가드 설정 세트입니다. |
| Parallel Guard Groups (병렬 가드 그룹) | 시간 윈도우가 겹치는 두 개 이상의 가드 그룹으로, 구매자가 동시에 어느 그룹에서 민팅할지 선택할 수 있습니다. |
| Candy Guard | Core Candy Machine에 대한 모든 가드 및 그룹 구성을 저장하며 민트 권한 역할을 하는 온체인 계정입니다. |
| Bot Tax | 다른 가드 검사에 실패한 지갑에 소액의 SOL 패널티를 부과하여 봇 활동을 억제하는 가드입니다. |
| Route Instruction (라우트 지시사항) | Allow List 검증과 같은 민트 흐름 외부의 가드별 로직을 실행하는 Candy Guard 프로그램의 특별한 지시사항입니다. |

