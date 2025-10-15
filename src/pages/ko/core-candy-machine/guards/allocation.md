---
title: 할당 가드
metaTitle: 민트 할당 가드 | 코어 캔디 머신
description: "코어 캔디 머신에서 가드 그룹당 최대 민팅 수를 지정할 수 있는 '할당' 가드에 대해 알아보세요."
---

## 개요

**할당** 가드는 각 가드 그룹이 민팅할 수 있는 자산 수에 제한을 지정할 수 있습니다.

제한은 설정에 제공된 식별자별로 설정되어 동일한 코어 캔디 머신 내에서 여러 할당을 허용합니다.

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #allocation label="Allocation" /%}
{% node label="- id" /%}
{% node label="- limit" /%}
{% node label="..." /%}
{% /node %}

{% node parent="allocation" x="270" y="-9" %}
{% node #pda theme="indigo" %}
Allocation Tracker PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="600" %}
  {% node theme="pink" %}
    Mint from

    _Candy Guard Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="71" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="allocation" to="pda" arrow="none" /%}
{% edge from="pda" to="mint-candy-guard" arrow="none" fromPosition="top" dashed=true%}
if the allocation tracker count

is equal to the limit

Minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}


{% /diagram %}

## 가드 설정

할당 가드에는 다음 설정이 포함됩니다:

- **ID**: 이 가드의 고유 식별자입니다. 서로 다른 식별자는 주어진 지갑이 민팅한 아이템 수를 추적하기 위해 서로 다른 카운터를 사용합니다. 이는 가드 그룹을 사용할 때 특히 유용하며, 각각에 다른 민트 제한을 적용하고 싶을 때 사용됩니다.
- **Limit**: 가드 그룹에서 허용되는 최대 민팅 수입니다.

{% dialect-switcher title="할당 가드를 사용하여 캔디 머신 설정" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    allocation: some({ id: 1, limit: 5 }),
  },
});
```

API 참조: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [Allocation](https://mpl-core-candy-machine.typedoc.metaplex.com/types/Allocation.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json 파일의 guard 섹션에 이 객체를 추가하세요:

```json
"allocation" : {
    "id": number,
    "limit": number
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 민트 설정

할당 가드에는 다음 민트 설정이 포함됩니다:

- **ID**: 이 가드의 고유 식별자입니다.

SDK의 도움 없이 지시사항을 구성할 계획이라면, 이러한 민트 설정과 더 많은 것들을 지시사항 인수와 나머지 계정의 조합으로 제공해야 합니다. 자세한 내용은 [Candy Guard의 프로그램 문서](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#allocation)를 참조하세요.

{% dialect-switcher title="할당 가드로 민팅" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

다음과 같이 `mintArgs` 인수를 사용하여 할당 가드의 민트 설정을 전달할 수 있습니다.

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    allocation: some({ id: 1 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_가드가 할당되는 즉시 sugar를 사용하여 민팅할 수 없습니다 - 따라서 특정 민트 설정이 없습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 라우트 지시사항

할당 가드 라우트 지시사항은 다음 기능을 지원합니다.

### 할당 추적기 초기화

할당 가드를 사용할 때 민팅이 시작되기 전에 할당 추적기 계정을 초기화해야 합니다. 이는 가드 설정의 id 속성에서 파생된 PDA 계정을 생성합니다.

할당 추적기 PDA 계정은 가드 그룹 내의 민팅 수를 추적하고 제한에 도달하면 해당 그룹 내의 모든 민팅을 차단합니다.

이 할당 추적기 계정을 초기화할 때 가드의 라우트 지시사항에 다음 인수를 제공해야 합니다:

- **ID**: 가드 설정의 할당 id입니다.
- **Candy Guard Authority**: 서명자로서 코어 캔디 가드 계정의 권한입니다.

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
{% node #allocation label="Allocation" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="415" %}
  {% node #candy-guard-route theme="pink" %}
    Route from the

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="-4" theme="transparent" %}
  Initialize Allocation Tracker
{% /node %}

{% edge from="guards" to="candy-guard-route" theme="pink" toPosition="left" /%}
{% edge from="candy-guard-route" to="freezeEscrow-PDA3" theme="pink" path="straight" y="-10" /%}

{% node #freezeEscrow-PDA3 parent="allocation" x="390" y="-10" %}
{% node label="Allocation Tracker PDA" theme="blue" /%}
{% node label="count = 0" theme="dimmed" /%}
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="allocation" to="freezeEscrow-PDA3" arrow="none" dashed=true path="straight" /%}
{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

{% seperator h="6" /%}

{% dialect-switcher title="할당 추적기 PDA 초기화" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

기본 가드에 대한 할당 추적기 PDA를 초기화하려면:

```ts
route(umi, {
  // ...
  guard: 'allocation',
  routeArgs: {
    id: 1,
    candyGuardAuthority: umi.identity,
  },
})
```

할당 가드가 특정 그룹에 추가된 경우 **group** 이름을 추가해야 합니다:

```ts
route(umi, {
  // ...
  guard: 'allocation',
  routeArgs: {
    id: 1,
    candyGuardAuthority: umi.identity,
  },
  group: some('GROUPA'),
})
```

API 참조: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [AllocationRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AllocationRouteArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_Sugar는 현재 라우트 지시사항을 지원하지 않습니다._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 할당 계정
`Allocation` 가드를 사용할 때 라우트 지시사항이 실행된 후 `allocationTracker` 계정이 생성됩니다. 검증 목적으로 다음과 같이 가져올 수 있습니다:

```js
import {
  safeFetchAllocationTrackerFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allocationTracker = await safeFetchAllocationTrackerFromSeeds(umi, {
  id: 1, // 가드 설정에서 설정한 할당 id
  candyMachine: candyMachine.publicKey,
  // 또는 candyMachine: publicKey("Address") CM 주소와 함께
  candyGuard: candyMachine.mintAuthority,
  // 또는 candyGuard: publicKey("Address") candyGuard 주소와 함께
});
```