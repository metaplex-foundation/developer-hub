---
title: Core Candy Machine 가드의 라우트 지시사항
metaTitle: Core Candy Machine 가드의 라우트 지시사항 | 코어 캔디 머신
description: Route 지시사항을 사용하면 Core Candy Machine의 개별 가드가 민팅 전에 실행되는 사전 검증 단계와 같은 커스텀 온체인 로직을 노출할 수 있습니다.
keywords:
  - route instruction
  - core candy machine
  - candy guard
  - guard instructions
  - allow list
  - merkle proof
  - merkle tree
  - pre-validation
  - minting guards
  - Solana NFT
  - Metaplex
  - guard groups
  - custom guard logic
  - PDA verification
about:
  - Route instruction
  - Guard instructions
  - Pre-validation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: 어떤 가드가 Route 지시사항을 지원하나요?
    a: 모든 가드가 Route 지시사항을 지원하는 것은 아닙니다. 사전 검증이나 커스텀 온체인 로직이 필요한 가드만 라우트 핸들러를 노출합니다. Allow List 가드가 가장 일반적인 예시로, 민팅 전에 머클 증명을 검증하기 위해 라우트를 사용합니다. 라우트 지원 여부는 각 가드의 전용 문서 페이지를 확인하세요.
  - q: Route 지시사항을 지원하지 않는 가드에서 호출하면 어떻게 되나요?
    a: 트랜잭션이 실패합니다. Core Candy Guard 프로그램은 라우트 핸들러를 구현하지 않은 가드에 대한 라우트 호출을 거부합니다. 호출하기 전에 항상 가드가 라우트 지시사항을 지원하는지 확인하세요.
  - q: Allow List 가드가 민팅 중 검증 대신 별도의 Route 지시사항을 사용하는 이유는 무엇인가요?
    a: 대규모 허용 목록은 민트 지시사항 자체 데이터와 결합하면 트랜잭션 크기 제한을 초과할 수 있는 머클 증명을 생성합니다. 증명 검증을 전용 라우트 트랜잭션으로 분리함으로써 Allow List 가드는 Solana의 트랜잭션 크기 제약에 구애받지 않고 임의로 큰 목록을 지원할 수 있습니다.
  - q: Route 지시사항을 호출할 때 그룹 레이블을 지정해야 하나요?
    a: Core Candy Machine이 가드 그룹을 사용하는 경우에만 필요합니다. 동일한 가드 유형이 여러 그룹에 나타날 수 있으므로 프로그램은 어떤 가드 인스턴스가 라우트 호출을 처리해야 하는지 식별하기 위해 그룹 레이블이 필요합니다. 그룹이 없으면 그룹 파라미터는 필요하지 않습니다.
  - q: 라우트 설정의 Path 속성이란 무엇인가요?
    a: Path 속성은 단일 가드의 라우트 지시사항이 제공하는 여러 기능을 구분합니다. 예를 들어, Frozen NFT를 지원하는 가드는 path "init"을 사용하여 에스크로 계정을 초기화하고 path "thaw"를 사용하여 민팅된 NFT를 해동할 수 있습니다. 각 가드는 자체적인 유효한 경로 세트를 정의합니다.
---

## 요약

Route 지시사항은 Core Candy Guard 프로그램의 특별한 지시사항으로, 특정 [가드](/ko/smart-contracts/core-candy-machine/guards)에 실행을 위임하여 가드가 표준 [민팅](/ko/smart-contracts/core-candy-machine/mint) 흐름 외부에서 커스텀 온체인 로직을 실행할 수 있게 합니다.

- 선택된 가드에 요청을 라우팅하여 민트 트랜잭션과 독립적으로 자체 프로그램 로직을 실행할 수 있게 합니다.
- [Allow List 가드](/ko/smart-contracts/core-candy-machine/guards/allow-list)의 머클 증명 검증과 같은 사전 검증 워크플로우를 가능하게 합니다.
- 단일 가드의 라우트 핸들러 내에서 여러 기능을 구분하기 위한 **Path** 속성을 지원합니다.
- Core Candy Machine이 [가드 그룹](/ko/smart-contracts/core-candy-machine/guard-groups)을 사용할 때 **그룹 레이블**이 필요합니다.

이전 페이지에서 본 것처럼 가드는 캔디 머신의 민팅 프로세스를 커스터마이징하는 강력한 방법입니다. 하지만 가드가 자체적인 커스텀 지시사항도 제공할 수 있다는 것을 아셨나요? {% .lead %}

## 라우트 지시사항

Route 지시사항은 Core Candy Guard 프로그램의 전용 진입점으로, 특정 가드에 요청을 전달하여 해당 가드가 민트 트랜잭션과 독립적으로 커스텀 온체인 로직을 실행할 수 있게 합니다.

이 지시사항을 통해 코어 캔디 머신에서 **특정 가드를 선택**하고 해당 가드에 특화된 **커스텀 지시사항을 실행**할 수 있습니다. 선택된 가드로 우리의 요청을 라우팅하기 때문에 "라우트" 지시사항이라고 부릅니다.

이 기능은 가드 자체의 프로그램 로직을 제공할 수 있게 함으로써 가드를 더욱 강력하게 만듭니다. 이를 통해 가드는 다음을 수행할 수 있습니다:

- 무거운 작업에 대해 검증 프로세스를 민팅 프로세스에서 분리할 수 있습니다.
- 커스텀 프로그램 배포 없이는 불가능했을 커스텀 기능을 제공할 수 있습니다.

라우트 지시사항을 호출하려면 어떤 가드로 해당 지시사항을 라우팅할지 지정하고 **해당 가드가 기대하는 라우트 설정을 제공**해야 합니다.

{% callout type="warning" %}
지원하지 않는 가드를 선택하여 Route 지시사항을 실행하면 트랜잭션이 실패합니다. 호출하기 전에 [가드 문서 페이지](/ko/smart-contracts/core-candy-machine/guards)에서 라우트 지원 여부를 확인하세요.
{% /callout %}

캔디 가드 프로그램에서 등록된 가드당 하나의 "라우트" 지시사항만 존재할 수 있으므로, 라우트 설정에 **Path** 속성을 제공하여 동일한 가드가 제공하는 여러 기능을 구분하는 것이 일반적입니다.

예를 들어, 민팅이 완료된 후에만 해동될 수 있는 동결된 NFT에 대한 지원을 추가하는 가드는 라우트 지시사항을 사용하여 재무 에스크로 계정을 초기화하고 적절한 조건 하에서 민팅된 NFT를 누구든지 해동할 수 있게 할 수 있습니다. 전자의 경우 "init", 후자의 경우 "thaw"와 같은 **Path** 속성을 사용하여 이 두 기능을 구분할 수 있습니다.

라우트 지시사항을 지원하는 각 가드의 라우트 지시사항과 기본 경로에 대한 자세한 설명은 [각각의 페이지](/ko/smart-contracts/core-candy-machine/guards)에서 찾을 수 있습니다.

### Allow List 가드 라우트 예시

[Allow List 가드](/ko/smart-contracts/core-candy-machine/guards/allow-list)는 Route 지시사항을 사용하는 가장 일반적인 가드로, 민팅을 허용하기 전에 민팅 지갑이 사전 구성된 허용 지갑 목록에 속하는지 검증합니다.

이는 [머클 트리](https://en.m.wikipedia.org/wiki/Merkle_tree)를 사용하여 수행되며, 이는 허용된 지갑의 전체 목록에 대한 해시를 생성하고 해당 해시 -- **머클 루트**로 알려진 -- 를 가드 설정에 저장해야 함을 의미합니다. 지갑이 허용 목록에 있다는 것을 증명하려면 프로그램이 머클 루트를 계산하고 가드 설정과 일치하는지 확인할 수 있는 해시 목록 -- **머클 증명**으로 알려진 -- 을 제공해야 합니다.

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

## 가드 그룹과 함께하는 라우트 지시사항

Route 지시사항은 Core Candy Machine이 [가드 그룹](/ko/smart-contracts/core-candy-machine/guard-groups)을 사용할 때 그룹 레이블이 필요합니다. 동일한 가드 유형이 여러 그룹에 나타날 수 있으며 프로그램은 어떤 인스턴스를 대상으로 해야 하는지 알아야 하기 때문입니다.

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

## 참고사항

- 모든 [가드](/ko/smart-contracts/core-candy-machine/guards)가 Route 지시사항을 지원하는 것은 아닙니다. 사전 검증이 필요하거나 추가 온체인 기능을 노출하는 가드만 라우트 핸들러를 구현합니다.
- Route 지시사항을 지원하지 않는 가드에서 호출하면 트랜잭션이 실패합니다.
- [가드 그룹](/ko/smart-contracts/core-candy-machine/guard-groups)을 사용할 때 `group` 레이블이 필요하므로 프로그램이 어떤 가드 인스턴스가 라우트 호출을 처리해야 하는지 식별할 수 있습니다.
- 각 가드는 하나의 라우트 지시사항만 가질 수 있지만, **Path** 속성을 통해 단일 라우트 핸들러가 여러 개의 고유한 기능을 노출할 수 있습니다.
- Route 지시사항은 [민트](/ko/smart-contracts/core-candy-machine/mint) 트랜잭션과 별도입니다. 생성하는 온체인 상태(예: Allow List PDA)는 지속되며 민팅 중에 확인됩니다.

## FAQ

### 어떤 가드가 Route 지시사항을 지원하나요?

모든 가드가 Route 지시사항을 지원하는 것은 아닙니다. 사전 검증이나 커스텀 온체인 로직이 필요한 가드만 라우트 핸들러를 노출합니다. [Allow List 가드](/ko/smart-contracts/core-candy-machine/guards/allow-list)가 가장 일반적인 예시로, [민팅](/ko/smart-contracts/core-candy-machine/mint) 전에 머클 증명을 검증하기 위해 라우트를 사용합니다. 각 가드의 [전용 문서 페이지](/ko/smart-contracts/core-candy-machine/guards)에서 라우트 지원 여부를 확인하세요.

### Route 지시사항을 지원하지 않는 가드에서 호출하면 어떻게 되나요?

트랜잭션이 실패합니다. Core Candy Guard 프로그램은 라우트 핸들러를 구현하지 않은 [가드](/ko/smart-contracts/core-candy-machine/guards)에 대한 라우트 호출을 거부합니다. 호출하기 전에 항상 가드가 라우트 지시사항을 지원하는지 확인하세요.

### Allow List 가드가 민팅 중 검증 대신 별도의 Route 지시사항을 사용하는 이유는 무엇인가요?

대규모 허용 목록은 [민트](/ko/smart-contracts/core-candy-machine/mint) 지시사항 자체 데이터와 결합하면 트랜잭션 크기 제한을 초과할 수 있는 머클 증명을 생성합니다. 증명 검증을 전용 라우트 트랜잭션으로 분리함으로써 [Allow List 가드](/ko/smart-contracts/core-candy-machine/guards/allow-list)는 Solana의 트랜잭션 크기 제약에 구애받지 않고 임의로 큰 목록을 지원할 수 있습니다.

### Route 지시사항을 호출할 때 그룹 레이블을 지정해야 하나요?

Core Candy Machine이 [가드 그룹](/ko/smart-contracts/core-candy-machine/guard-groups)을 사용하는 경우에만 필요합니다. 동일한 가드 유형이 여러 그룹에 나타날 수 있으므로 프로그램은 어떤 가드 인스턴스가 라우트 호출을 처리해야 하는지 식별하기 위해 그룹 레이블이 필요합니다. 그룹이 없으면 그룹 파라미터는 필요하지 않습니다.

### 라우트 설정의 Path 속성이란 무엇인가요?

Path 속성은 단일 가드의 라우트 지시사항이 제공하는 여러 기능을 구분합니다. 예를 들어, Frozen NFT를 지원하는 가드는 path "init"을 사용하여 에스크로 계정을 초기화하고 path "thaw"를 사용하여 민팅된 NFT를 해동할 수 있습니다. 각 가드는 자체적인 유효한 경로 세트를 정의합니다.

## 용어집

| 용어 | 정의 |
|------|------|
| Route Instruction (라우트 지시사항) | Core Candy Guard 프로그램의 특별한 지시사항으로, 특정 가드에 실행을 위임하여 민트 트랜잭션 외부에서 커스텀 온체인 로직을 실행할 수 있게 합니다. |
| Merkle Tree (머클 트리) | 각 리프 노드가 데이터의 해시이고 각 비리프 노드가 자식의 해시인 해시 기반 데이터 구조로, 대규모 데이터셋에서 멤버십을 효율적으로 검증하는 데 사용됩니다. |
| Merkle Proof (머클 증명) | 전체 트리를 공개하지 않고 특정 요소가 머클 트리에 속하는지 검증할 수 있는 정렬된 해시 목록입니다. |
| Merkle Root (머클 루트) | 전체 데이터셋을 나타내는 머클 트리의 단일 최상위 해시로, 온체인 비교를 위해 Allow List 가드 설정에 저장됩니다. |
| Path (경로) | 단일 가드의 라우트 핸들러가 노출하는 여러 기능을 구분하는 라우트 설정의 속성입니다 (예: "init" vs. "thaw"). |
| Allow List PDA | Allow List 가드의 라우트 지시사항에 의해 생성되는 프로그램 파생 계정으로, 지갑이 머클 증명을 성공적으로 검증했음을 기록하여 후속 민트 트랜잭션의 증명 역할을 합니다. |
| Guard Groups (가드 그룹) | Core Candy Machine의 명명된 가드 세트로, 서로 다른 대상에 서로 다른 민팅 조건을 허용하며, 라우트 지시사항을 호출할 때 그룹 레이블이 필요합니다. |

