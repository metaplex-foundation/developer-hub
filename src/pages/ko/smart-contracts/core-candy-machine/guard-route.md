---
title: 특별 가드 지시사항
metaTitle: 특별 가드 지시사항 | 코어 캔디 머신
description: 코어 캔디 머신에 대한 가드별 지시사항을 실행하는 방법을 설명합니다.
---

이전 페이지에서 본 것처럼 가드는 캔디 머신의 민팅 프로세스를 커스터마이징하는 강력한 방법입니다. 하지만 가드가 자체적인 커스텀 지시사항도 제공할 수 있다는 것을 아셨나요? {% .lead %}

## 라우트 지시사항

코어 캔디 가드 프로그램은 **"라우트" 지시사항**이라는 특별한 지시사항을 함께 제공합니다.

이 지시사항을 통해 코어 캔디 머신에서 **특정 가드를 선택**하고 해당 가드에 특화된 **커스텀 지시사항을 실행**할 수 있습니다. 선택된 가드로 우리의 요청을 라우팅하기 때문에 "라우트" 지시사항이라고 부릅니다.

이 기능은 가드 자체의 프로그램 로직을 제공할 수 있게 함으로써 가드를 더욱 강력하게 만듭니다. 이를 통해 가드는 다음을 수행할 수 있습니다:

- 무거운 작업에 대해 검증 프로세스를 민팅 프로세스에서 분리할 수 있습니다.
- 커스텀 프로그램 배포 없이는 불가능했을 커스텀 기능을 제공할 수 있습니다.

라우트 지시사항을 호출하려면 어떤 가드로 해당 지시사항을 라우팅할지 지정하고 **해당 가드가 기대하는 라우트 설정을 제공**해야 합니다. 지원하지 않는 가드를 선택하여 "라우트" 지시사항을 실행하려고 하면 트랜잭션이 실패합니다.

캔디 가드 프로그램에서 등록된 가드당 하나의 "라우트" 지시사항만 존재할 수 있으므로, 라우트 설정에 **Path** 속성을 제공하여 동일한 가드가 제공하는 여러 기능을 구분하는 것이 일반적입니다.

예를 들어, 민팅이 완료된 후에만 해동될 수 있는 동결된 NFT에 대한 지원을 추가하는 가드는 라우트 지시사항을 사용하여 재무 에스크로 계정을 초기화하고 적절한 조건 하에서 민팅된 NFT를 누구든지 해동할 수 있게 할 수 있습니다. 전자의 경우 "init", 후자의 경우 "thaw"와 같은 **Path** 속성을 사용하여 이 두 기능을 구분할 수 있습니다.

라우트 지시사항을 지원하는 각 가드의 라우트 지시사항과 기본 경로에 대한 자세한 설명은 [각각의 페이지](/ko/smart-contracts/core-candy-machine/guards)에서 찾을 수 있습니다.

예시를 제공하여 라우트 지시사항이 어떻게 작동하는지 설명해보겠습니다. 예를 들어, [**Allow List**](/ko/smart-contracts/core-candy-machine/guards/allow-list) 가드는 민팅 지갑이 사전 구성된 지갑 목록에 포함되어 있는지 확인하기 위해 라우트 지시사항을 지원합니다.

이는 [머클 트리](https://en.m.wikipedia.org/wiki/Merkle_tree)를 사용하여 수행되며, 이는 허용된 지갑의 전체 목록에 대한 해시를 생성하고 해당 해시 — **머클 루트**로 알려진 — 를 가드 설정에 저장해야 함을 의미합니다. 지갑이 허용 목록에 있다는 것을 증명하려면 프로그램이 머클 루트를 계산하고 가드 설정과 일치하는지 확인할 수 있는 해시 목록 — **머클 증명**으로 알려진 — 을 제공해야 합니다.

따라서 Allow List 가드는 **라우트 지시사항을 사용하여 주어진 지갑의 머클 증명을 검증**하고, 성공하면 민트 지시사항에 대한 검증 증명 역할을 하는 작은 PDA 계정을 블록체인에 생성합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #allow-list-guard label="Allow List" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
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

{% node parent="mint-2" x=-250 %}
{% node #route label="Route" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="Verify Merkle Proof" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="Allow List PDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

그렇다면 왜 민트 지시사항 내에서 머클 증명을 직접 검증할 수 없을까요? 단순히 큰 허용 목록의 경우 머클 증명이 꽤 길어질 수 있기 때문입니다. 특정 크기가 넘어가면 이미 상당한 양의 지시사항이 포함된 민트 트랜잭션에 이를 포함하는 것이 불가능해집니다. 검증 프로세스를 민팅 프로세스에서 분리함으로써 허용 목록을 필요한 만큼 크게 만들 수 있게 됩니다.

{% dialect-switcher title="가드의 라우트 지시사항 호출" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리를 사용하여 가드의 라우트 지시사항을 호출하려면 `route` 함수를 사용할 수 있습니다. `guard` 속성을 통해 가드의 이름을, `routeArgs` 속성을 통해 라우트 설정을 전달해야 합니다.

민팅 전에 지갑의 머클 증명을 검증하는 Allow List 가드를 사용한 예시는 다음과 같습니다.

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from '@metaplex-foundation/mpl-core-candy-machine'

// 허용 목록을 준비합니다.
// 목록의 첫 번째 지갑이 Metaplex identity라고 가정해보겠습니다.
const allowList = [
  'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS',
  '2vjCrmEFiN9CLLhiqy8u1JPh48av8Zpzp3kNkdTtirYG',
  'AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy',
]
const merkleRoot = getMerkleRoot(allowList)

// Allow List 가드와 함께 캔디 머신을 생성합니다.
await create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot }),
  },
}).sendAndConfirm(umi)

// 지금 민팅을 시도하면 머클 증명을 검증하지 않았기 때문에 실패합니다.

// 라우트 지시사항을 사용하여 머클 증명을 검증합니다.
await route(umi, {
  candyMachine: candyMachine.publicKey,
  guard: 'allowList',
  routeArgs: {
    path: 'proof',
    merkleRoot,
    merkleProof: getMerkleProof(
      allowList,
      'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS'
    ),
  },
}).sendAndConfirm(umi)

// 이제 민팅을 시도하면 성공합니다.
```

API 참조: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 그룹과 함께하는 라우트 지시사항

가드 그룹을 사용하면서 라우트 지시사항을 호출할 때는 선택하려는 가드의 **그룹 레이블을 지정**하는 것이 중요합니다. 서로 다른 그룹에 같은 유형의 가드가 여러 개 있을 수 있고, 프로그램은 라우트 지시사항에 어떤 가드를 사용해야 하는지 알아야 하기 때문입니다.

예를 들어, 한 그룹에는 엄선된 VIP 지갑의 **Allow List**가 있고 다른 그룹에는 추첨 당첨자를 위한 또 다른 **Allow List**가 있다고 가정해보겠습니다. 그러면 Allow List 가드에 대한 머클 증명을 검증하고 싶다고 말하는 것만으로는 충분하지 않으며, 어떤 그룹에 대해 검증을 수행해야 하는지도 알아야 합니다.

{% dialect-switcher title="라우트 지시사항 호출 시 그룹으로 필터링" %}
{% dialect title="JavaScript" id="js" %}

그룹을 사용할 때 Umi 라이브러리의 `route` 함수는 선택하려는 그룹의 레이블로 설정해야 하는 `Option<string>` 타입의 추가 `group` 속성을 받습니다.

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { base58PublicKey, some } from "@metaplex-foundation/umi";

// 허용 목록들을 준비합니다.
const allowListA = [...];
const allowListB = [...];

// 두 개의 Allow List 가드가 있는 캔디 머신을 생성합니다.
await create(umi, {
  // ...
  groups: [
    {
      label: "listA",
      guards: {
        allowList: some({ merkleRoot: getMerkleRoot(allowListA) }),
      },
    },
    {
      label: "listB",
      guards: {
        allowList: some({ merkleRoot: getMerkleRoot(allowListB) }),
      },
    },
  ],
}).sendAndConfirm(umi);

// 어떤 그룹을 선택할지 지정하여 머클 증명을 검증합니다.
await route(umi, {
  candyMachine: candyMachine.publicKey,
  guard: 'allowList',
  group: some('listA'), // <- "allowListA"를 사용하여 검증합니다.
  routeArgs: {
    path: 'proof',
    merkleRoot: getMerkleRoot(allowListA),
    merkleProof: getMerkleProof(
      allowListA,
      base58PublicKey(umi.identity),
    ),
  },
}).sendAndConfirm(umi);
```

API 참조: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 결론

라우트 지시사항은 가드가 자체적인 커스텀 프로그램 로직을 제공할 수 있게 함으로써 가드를 더욱 강력하게 만듭니다. [사용 가능한 모든 가드](/ko/smart-contracts/core-candy-machine/guards)의 전용 페이지를 확인하여 각 가드의 전체 기능 세트를 확인하세요.

이제 코어 캔디 머신과 그 가드 설정에 대해 알아야 할 모든 것을 알았으니, 민팅에 대해 이야기할 때입니다. [다음 페이지](/ko/smart-contracts/core-candy-machine/mint)에서 만나요! [가져오는 방법](/ko/smart-contracts/core-candy-machine/fetching-a-candy-machine)도 읽어보고 싶을 것입니다.