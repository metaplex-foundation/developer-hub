---
title: 프로그램 개요
metaTitle: 프로그램 개요 | Core Candy Machine
description: Core Candy Machine 프로그램과 민팅 경험을 만드는 데 도움이 되는 기능 세트에 대한 개요입니다.
---

## 소개

2022년 9월까지 Solana의 모든 NFT 중 78%가 Metaplex의 Candy Machine을 통해 민팅되었습니다. 여기에는 Solana 생태계에서 잘 알려진 대부분의 NFT 프로젝트가 포함됩니다. 2024년 Metaplex는 Solana의 NFT를 재정의하는 `Core` 프로토콜을 도입했고, 이와 함께 `Core` 표준에 대해 사용자들이 좋아했던 동일한 민팅 메커니즘을 수용하는 새로운 Candy Machine을 출시했습니다.

다음은 제공되는 기능들입니다.

- SOL, NFT 또는 모든 Solana 토큰으로 결제를 받습니다.
- 시작/종료 날짜, 민팅 제한, 제3자 서명자 등을 통해 런칭을 제한합니다.
- 구성 가능한 봇 세금과 Captcha 같은 게이트키퍼를 통해 봇으로부터 런칭을 보호합니다.
- 특정 Asset/NFT/Token 보유자 또는 선별된 지갑 목록으로 민팅을 제한합니다.
- 서로 다른 규칙 세트를 가진 여러 민팅 그룹을 생성합니다.
- 사용자가 정보를 검증할 수 있도록 하면서 런칭 후 자산을 공개합니다.
- 그리고 훨씬 더 많은 기능들!

관심이 있으신가요? `Core Candy Machine`이 어떻게 작동하는지 간단히 둘러보겠습니다!

## Core Candy Machine의 생명주기

첫 번째 단계는 창작자가 새로운 Core Candy Machine을 생성하고 원하는 대로 구성하는 것입니다.

{% diagram %}
{% node #action label="1. 생성 및 구성" theme="pink" /%}
{% node parent="action" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="설정" /%}
{% /node %}
{% edge from="action" to="candy-machine" path="straight" /%}
{% /diagram %}

생성된 Core Candy Machine은 자체 설정을 추적하여 모든 NFT가 어떻게 생성되어야 하는지 이해하는 데 도움을 줍니다. 예를 들어, 이 Core Candy Machine에서 생성된 모든 자산에 할당될 `collection` 매개변수가 있습니다. **기능** 섹션의 메뉴에서 Core Candy Machine을 생성하고 구성하는 방법에 대해 더 자세히 알아보겠습니다.

하지만 여전히 해당 Core Candy Machine에서 어떤 자산을 민팅해야 하는지 알 수 없습니다. 즉, Core Candy Machine이 현재 로드되지 않은 상태입니다. 다음 단계는 아이템을 삽입하는 것입니다.

{% diagram %}
{% node #action-1 label="1. 생성 및 구성" theme="pink" /%}
{% node #action-2 label="2. 아이템 삽입" parent="action-1" y="50" theme="pink" /%}
{% node parent="action-1" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="설정" /%}
{% node #item-1 label="아이템 1" /%}
{% node #item-2 label="아이템 2" /%}
{% node #item-3 label="아이템 3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% /diagram %}

각 아이템은 두 개의 매개변수로 구성됩니다:

- `name`: 자산의 이름입니다.
- `uri`: 자산의 [JSON 메타데이터](https://developers.metaplex.com/token-metadata/token-standard#the-non-fungible-standard)를 가리키는 URI입니다. 이는 JSON 메타데이터가 이미 온체인(예: Arweave, IPFS) 또는 오프체인(예: AWS, 자체 서버) 스토리지 제공업체를 통해 업로드되었음을 의미합니다. Sugar나 JS SDK와 같이 Candy Machine을 생성하는 데 사용할 수 있는 도구들이 이를 위한 헬퍼를 제공합니다.

다른 모든 매개변수는 자산 간에 공유되므로 반복을 피하기 위해 Candy Machine의 설정에 직접 보관됩니다. 자세한 내용은 [아이템 삽입](/core-candy-machine/insert-items)을 참조하세요.

이 시점에서는 아직 실제 자산이 생성되지 않았다는 점에 주목하세요. 단순히 민팅 시간에 **온디맨드로 자산을 생성**하는 데 필요한 모든 데이터로 Candy Machine을 로드하고 있을 뿐입니다. 이것이 다음 단계로 이어집니다.

{% diagram %}
{% node #action-1 label="1. 생성 및 구성" theme="pink" /%}
{% node #action-2 label="2. 아이템 삽입" parent="action-1" y="50" theme="pink" /%}

{% node parent="action-1" x="250" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="설정" /%}
{% node #item-1 label="아이템 1" /%}
{% node #item-2 label="아이템 2" /%}
{% node #item-3 label="아이템 3" /%}
{% node #item-rest label="..." /%}
{% /node %}

{% node parent="candy-machine" x="180" y="20" %}
{% node #mint label="3. 민팅" theme="pink" /%}
{% node #mint-1 label="민팅 #1" theme="pink" /%}
{% node #mint-2 label="민팅 #2" theme="pink" /%}
{% node #mint-3 label="민팅 #3" theme="pink" /%}
{% /node %}

{% node #nft-1 parent="mint" x="120" label="자산" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="자산" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="자산" theme="blue" /%}

{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% edge from="item-1" to="mint-1" /%}
{% edge from="item-2" to="mint-2" /%}
{% edge from="item-3" to="mint-3" /%}
{% edge from="mint-1" to="nft-1" path="bezier" /%}
{% edge from="mint-2" to="nft-2" path="bezier" /%}
{% edge from="mint-3" to="nft-3" path="bezier" /%}
{% /diagram %}

Candy Machine이 로드되고 모든 사전 구성된 조건이 충족되면 사용자는 이를 통해 자산을 민팅하기 시작할 수 있습니다. 자산이 Solana 블록체인에 생성되는 것은 바로 이 시점입니다. 민팅하기 전에 일부 사용자는 Captcha를 수행하거나 Merkle Proof를 전송하는 등의 추가 검증 단계를 수행해야 할 수도 있습니다. 자세한 내용은 [민팅](/core-candy-machine/mint)을 참조하세요.

Candy Machine에서 모든 자산이 민팅되면 그 목적을 다했으므로 안전하게 삭제하여 블록체인의 일부 저장 공간을 확보하고 일부 임대료를 회수할 수 있습니다. 자세한 내용은 [Candy Machine 철회](/core-candy-machine/withdrawing-a-candy-machine)를 참조하세요.

{% diagram %}
{% node #action-1 label="4. 삭제" theme="pink" /%}
{% node parent="action-1" x="150" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="설정" /%}
{% node #item-1 label="아이템 1" /%}
{% node #item-2 label="아이템 2" /%}
{% node #item-3 label="아이템 3" /%}
{% node #item-rest label="..." /%}
{% /node %}
{% node #nft-1 parent="candy-machine" x="200" label="자산" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="자산" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="자산" theme="blue" /%}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% /diagram %}

## Core Candy Machine 계정 구조

저장되는 데이터와 그 데이터가 사용자에게 갖는 역할을 설명합니다.

{% totem %}
{% totem-accordion title="온체인 Core Candy Machine 데이터 구조" %}

MPL Core 자산의 온체인 계정 구조입니다. [링크](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| 이름           | 타입    | 크기 | 설명                                              |     |
| -------------- | ------- | ---- | ------------------------------------------------ | --- |
| version        | u8      | 1    | Candy Machine의 버전                              |     |
| features       | [u8; 6] | 6    | Candy Machine에 활성화된 기능 플래그               |     |
| authority      | Pubkey  | 32   | Candy Machine의 권한                             |     |
| mint_authority | Pubkey  | 32   | Candy Machine의 민팅 권한                         |     |
| collection     | Pubkey  | 32   | Candy Machine에 할당된 컬렉션 주소                 |     |
| items_redeemed | u64     |      | Candy Machine에서 상환된 아이템 수                 |     |

{% /totem-accordion %}
{% /totem %}

## Candy Guards

이제 Core Candy Machine이 어떻게 작동하는지 이해했으니, 창작자가 Core Candy Machine의 민팅 프로세스를 보호하고 사용자 정의할 수 있는 다양한 방법을 살펴보겠습니다.

창작자는 "**Guards**"라고 부르는 것을 사용하여 Core Candy Machine에 다양한 기능을 추가할 수 있습니다. Metaplex Core Candy Machine은 [**총 23개의 기본 가드**](/core-candy-machine/guards)와 함께 제공되는 **Candy Guard**라는 추가 Solana 프로그램을 제공합니다. 추가 프로그램을 사용함으로써, 고급 개발자들이 기본 Candy Guard 프로그램을 포크하여 자신만의 커스텀 가드를 생성하면서도 여전히 메인 Candy Machine 프로그램에 의존할 수 있도록 합니다.

각 가드는 원하는 대로 활성화하고 구성할 수 있으므로 창작자는 필요한 기능을 선택할 수 있습니다. 모든 가드를 비활성화하는 것은 누구나 언제든지 무료로 NFT를 민팅할 수 있도록 허용하는 것과 같으며, 이는 우리가 원하는 것이 아닐 수 있습니다. 그러니 몇 가지 가드를 살펴보고 더 현실적인 예를 만들어보겠습니다.

Core Candy Machine에 다음과 같은 가드가 있다고 가정해봅시다:

- **Sol Payment**: 이 가드는 민팅 지갑이 구성된 대상 지갑에 구성된 양의 SOL을 지불해야 함을 보장합니다.
- **Start Date**: 이 가드는 구성된 시간 이후에만 민팅이 시작될 수 있음을 보장합니다.
- **Mint Limit**: 이 가드는 각 지갑이 구성된 양보다 많이 민팅할 수 없음을 보장합니다.
- **Bot Tax**: 이 가드는 조금 특별합니다. 어떤 것도 가드하지 않지만 봇이 Candy Machine을 민팅하는 것을 방지하기 위해 실패한 민팅의 동작을 변경합니다. 이 가드가 활성화되면, 다른 활성화된 가드가 민팅 검증에 실패할 경우 민팅을 시도한 지갑에 구성된 소액의 SOL을 청구합니다.

결과적으로 SOL을 청구하고, 특정 시간에 런칭되며, 지갑당 제한된 양의 민팅만 허용하는 봇 보호 Candy Machine을 얻게 됩니다. 다음은 구체적인 예입니다.

{% diagram %}
{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="설정" /%}
{% node #items label="아이템" /%}
{% node #guards %}
가드:

- Sol Payment (0.1 SOL)
- Start Date (1월 6일)
- Mint Limit (1)
- Bot Tax (0.01 SOL)

{% /node %}
{% /node %}

{% node parent="candy-machine" x="250" %}
{% node #mints label="자산" theme="pink" /%}
{% node #mint-1 label="#1: 지갑 A (1 SOL) 1월 5일" theme="pink" /%}
{% node #mint-2 label="#2: 지갑 B (3 SOL) 1월 6일" theme="pink" /%}
{% node #mint-3 label="#3: 지갑 B (2 SOL) 1월 6일" theme="pink" /%}
{% node #mint-4 label="#4: 지갑 C (0.5 SOL) 1월 6일" theme="pink" /%}
{% /node %}
{% node #fail-1 parent="mints" x="250" theme="red" %}
너무 일찍 {% .text-xs %} \
봇 세금 청구됨
{% /node %}
{% node #nft-2 parent="fail-1" y="50" label="자산" theme="blue" /%}
{% node #fail-3 parent="nft-2" y="50" theme="red" %}
이미 1개 민팅함 {% .text-xs %} \
봇 세금 청구됨
{% /node %}
{% node #fail-4 parent="fail-3" y="50" theme="red" %}
SOL 부족 {% .text-xs %} \
봇 세금 청구됨
{% /node %}

{% edge from="candy-machine" to="mint-1" /%}
{% edge from="candy-machine" to="mint-2" /%}
{% edge from="candy-machine" to="mint-3" /%}
{% edge from="candy-machine" to="mint-4" /%}
{% edge from="mint-1" to="fail-1" path="bezier" /%}
{% edge from="mint-2" to="nft-2" path="bezier" /%}
{% edge from="mint-3" to="fail-3" path="bezier" /%}
{% edge from="mint-4" to="fail-4" path="bezier" /%}
{% /diagram %}

보시다시피, 23개 이상의 기본 가드와 커스텀 가드 생성 기능을 통해 창작자는 자신에게 중요한 기능을 선별하고 완벽한 Candy Machine을 구성할 수 있습니다. 이는 너무나 강력한 기능이어서 많은 페이지를 할애했습니다. 가드에 대해 더 알아보기 위한 최고의 시작점은 [Candy Guards](/core-candy-machine/guards) 페이지입니다.
최신 변경 사항을 문서화합니다.