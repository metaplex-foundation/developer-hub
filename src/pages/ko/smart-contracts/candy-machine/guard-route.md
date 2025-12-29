---
title: 특별한 가드 명령어
metaTitle: 특별한 가드 명령어 | Candy Machine
description: 가드별 명령어를 실행하는 방법을 설명합니다.
---

이전 페이지에서 본 바와 같이, 가드는 Candy Machine의 민팅 프로세스를 맞춤화할 수 있는 강력한 방법입니다. 하지만 가드가 고유한 맞춤 명령어를 제공할 수도 있다는 것을 알고 계셨나요? {% .lead %}

## Route 명령어

Candy Guard 프로그램은 **"Route" 명령어**라고 불리는 특별한 명령어와 함께 제공됩니다.

이 명령어를 사용하면 Candy Machine에서 **특정 가드를 선택**하고 해당 가드에 특화된 **맞춤 명령어를 실행**할 수 있습니다. 요청을 선택된 가드로 라우팅하기 때문에 "Route" 명령어라고 부릅니다.

이 기능은 가드가 고유한 프로그램 로직과 함께 제공될 수 있게 하여 가드를 더욱 강력하게 만듭니다. 이를 통해 가드는 다음과 같은 일을 할 수 있습니다:

- 무거운 작업에 대해 검증 프로세스를 민팅 프로세스에서 분리합니다.
- 커스텀 프로그램 배포가 필요했던 맞춤 기능을 제공합니다.

route 명령어를 호출하려면 라우팅할 가드를 지정하고 **가드가 기대하는 route 설정을 제공**해야 합니다. 지원하지 않는 가드를 선택하여 "route" 명령어를 실행하려고 하면 트랜잭션이 실패할 것입니다.

Candy Guard 프로그램에 등록된 가드당 하나의 "route" 명령어만 있을 수 있기 때문에, 동일한 가드에서 제공하는 여러 기능을 구분하기 위해 route 설정에 **Path** 속성을 제공하는 것이 일반적입니다.

예를 들어, 민팅이 끝난 후에만 해동될 수 있는 동결된 NFT에 대한 지원을 추가하는 가드는 route 명령어를 사용하여 treasury escrow 계정을 초기화하고 올바른 조건 하에서 누구나 민팅된 NFT를 해동할 수 있게 할 수 있습니다. 전자의 경우 "init", 후자의 경우 "thaw"와 같은 **Path** 속성을 사용하여 이 두 기능을 구분할 수 있습니다.

route 명령어를 지원하는 각 가드와 그 기본 경로에 대한 자세한 설명은 [각각의 페이지](/ko/smart-contracts/candy-machine/guards)에서 찾을 수 있습니다.

예시를 제공하여 route 명령어가 어떻게 작동하는지 설명해보겠습니다. 예를 들어 [**Allow List**](/ko/smart-contracts/candy-machine/guards/allow-list) 가드는 민팅 지갑이 미리 구성된 지갑 목록의 일부인지 확인하기 위해 route 명령어를 지원합니다.

이는 [Merkle Trees](https://en.m.wikipedia.org/wiki/Merkle_tree)를 사용하여 수행되므로 허용된 지갑의 전체 목록의 해시를 생성하고 해당 해시(**Merkle Root**라고 알려진)를 가드 설정에 저장해야 합니다. 지갑이 허용 목록에 있음을 증명하려면 프로그램이 Merkle Root를 계산하고 가드의 설정과 일치하는지 확인할 수 있는 해시 목록(**Merkle Proof**라고 알려진)을 제공해야 합니다.

따라서 Allow List 가드는 **route 명령어를 사용하여 주어진 지갑의 Merkle Proof를 확인**하고, 성공하면 민팅 명령어에 대한 검증 증명 역할을 하는 블록체인에 작은 PDA 계정을 생성합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="소유자: Candy Guard Program" theme="dimmed" /%}
{% node label="가드" theme="mint" z=1 /%}
{% node #allow-list-guard label="Allow List" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
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

{% node parent="mint-2" x=-250 %}
{% node #route label="Route" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="Merkle Proof 검증" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="Allow List PDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

그렇다면 왜 민팅 명령어 내에서 직접 Merkle Proof를 검증하지 않을까요? 단순히 큰 허용 목록의 경우 Merkle Proof가 상당히 길어질 수 있기 때문입니다. 특정 크기 이후에는 이미 상당한 양의 명령어를 포함하는 민팅 트랜잭션에 포함하는 것이 불가능해집니다. 검증 프로세스를 민팅 프로세스에서 분리함으로써 허용 목록을 필요한 만큼 크게 만들 수 있게 됩니다.

{% dialect-switcher title="가드의 route 명령어 호출" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리를 사용하여 가드의 route 명령어를 호출하려면 `route` 함수를 사용할 수 있습니다. `guard` 속성을 통해 가드의 이름을 전달하고 `routeArgs` 속성을 통해 route 설정을 전달해야 합니다.

다음은 민팅 전에 지갑의 Merkle Proof를 검증하는 Allow List 가드를 사용한 예시입니다.

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from '@metaplex-foundation/mpl-candy-machine'

// 허용 목록을 준비합니다.
// 목록의 첫 번째 지갑이 Metaplex identity라고 가정해봅시다.
const allowList = [
  'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS',
  '2vjCrmEFiN9CLLhiqy8u1JPh48av8Zpzp3kNkdTtirYG',
  'AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy',
]
const merkleRoot = getMerkleRoot(allowList)

// Allow List 가드와 함께 Candy Machine을 생성합니다.
await create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot }),
  },
}).sendAndConfirm(umi)

// 지금 민팅을 시도하면 Merkle Proof를 검증하지 않았기 때문에 실패합니다.

// route 명령어를 사용하여 Merkle Proof를 검증합니다.
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

API 참조: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 그룹과 함께하는 Route 명령어

가드 그룹을 사용하면서 route 명령어를 호출할 때는 선택하려는 가드의 **그룹 레이블을 지정하는 것**이 중요합니다. 이는 서로 다른 그룹에 동일한 타입의 여러 가드가 있을 수 있고 프로그램이 route 명령어에 어떤 것을 사용해야 하는지 알아야 하기 때문입니다.

예를 들어, 한 그룹에는 엄선된 VIP 지갑의 **Allow List**가 있고 다른 그룹에는 추첨 당첨자를 위한 또 다른 **Allow List**가 있다고 해봅시다. 그러면 Allow List 가드에 대한 Merkle Proof를 검증하고 싶다고 말하는 것만으로는 충분하지 않으며, 어느 그룹에 대해 검증을 수행해야 하는지도 알아야 합니다.

{% dialect-switcher title="route 명령어 호출 시 그룹으로 필터링" %}
{% dialect title="JavaScript" id="js" %}

그룹을 사용할 때 Umi 라이브러리의 `route` 함수는 선택하려는 그룹의 레이블로 설정되어야 하는 `Option<string>` 타입의 추가 `group` 속성을 받습니다.

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";
import { base58PublicKey, some } from "@metaplex-foundation/umi";

// 허용 목록들을 준비합니다.
const allowListA = [...];
const allowListB = [...];

// 두 개의 Allow List 가드와 함께 Candy Machine을 생성합니다.
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

// 선택할 그룹을 지정하여 Merkle Proof를 검증합니다.
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

API 참조: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 결론

route 명령어는 가드가 고유한 맞춤 프로그램 로직과 함께 제공될 수 있게 하여 가드를 더욱 강력하게 만듭니다. 각 가드의 전체 기능 세트를 보려면 [사용 가능한 모든 가드](/ko/smart-contracts/candy-machine/guards)의 전용 페이지를 확인하세요.

이제 Candy Machine과 가드 설정에 대해 알아야 할 모든 것을 알았으니 민팅에 대해 이야기할 때입니다. [다음 페이지](/ko/smart-contracts/candy-machine/mint)에서 만나요!