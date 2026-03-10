---
title: Core Candy Machine 프로그램 개요
metaTitle: 프로그램 개요 | Core Candy Machine
description: Solana에서 MPL Core Asset 컬렉션 런칭을 위한 Core Candy Machine 프로그램 아키텍처, 수명주기, 계정 구조, 가드 시스템에 대한 종합 개요입니다.
keywords:
  - core candy machine
  - candy machine overview
  - solana nft launch
  - mpl core candy machine
  - candy guard
  - nft minting
  - core assets
  - metaplex candy machine
  - candy machine lifecycle
  - candy machine account structure
  - guard system
  - config line settings
  - hidden settings
  - mint authority
  - candy machine architecture
  - solana nft distribution
  - bot protection
  - guard groups
about:
  - Core Candy Machine
  - Candy Guard
  - MPL Core
  - Solana NFT Launch
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Core Candy Machine이란 무엇이며 Candy Machine V3와 어떻게 다른가요?
    a: Core Candy Machine은 MPL Core Asset을 위해 특별히 설계된 최신 Metaplex 민팅 프로그램입니다. Candy Machine V3는 이전 표준을 사용하여 Token Metadata NFT를 민팅합니다. Core Candy Machine은 MPL Core가 NFT당 여러 계정 대신 단일 계정 모델을 사용하기 때문에 더 가볍고 비용 효율적인 자산을 생산합니다.
  - q: Core Candy Machine에서 사용 가능한 가드는 몇 개인가요?
    a: Core Candy Machine은 동반 Candy Guard 프로그램을 통해 23개 이상의 기본 가드를 제공합니다. 이 가드들은 결제 수집(SOL, SPL 토큰, NFT), 접근 제어(허용 목록, 토큰 게이트, NFT 게이트), 스케줄링(시작 및 종료 날짜), 봇 보호(봇 세금, 게이트키퍼)를 포함합니다.
  - q: Core Candy Machine에서 커스텀 가드를 사용할 수 있나요?
    a: 네. 가드 시스템은 포크할 수 있는 별도의 Candy Guard 프로그램으로 구현되어 있습니다. 개발자는 실제 민팅 로직을 위해 메인 Candy Machine 프로그램에 의존하면서 커스텀 가드를 만들 수 있습니다.
  - q: 모든 아이템이 민팅된 후 Core Candy Machine은 어떻게 되나요?
    a: 모든 아이템이 민팅된 후 Candy Machine을 삭제(철회)하여 온체인 저장소 임대료를 회수할 수 있습니다. 이 작업은 되돌릴 수 없으며 임대료로 사용된 SOL을 권한 지갑으로 반환합니다.
  - q: Core Candy Machine을 로드하기 전에 NFT를 만들어야 하나요?
    a: 아닙니다. 실제 온체인 자산이 아닌 아이템 메타데이터(이름과 URI 쌍)를 Candy Machine에 로드합니다. Core Asset은 사용자가 Candy Machine에서 민팅하는 순간에만 온체인에 생성됩니다.
  - q: Candy Machine 권한과 민팅 권한의 차이점은 무엇인가요?
    a: 권한(authority)은 Candy Machine의 구성과 관리(설정 업데이트, 아이템 삽입, 철회)를 제어합니다. 민팅 권한(mint authority)은 누가 민팅을 트리거할 수 있는지를 제어합니다. 일반적으로 Candy Guard 계정이 민팅 권한으로 설정되어 민팅이 발생하기 전에 가드 검증이 시행됩니다.
---

## 요약

Core Candy Machine은 Solana에서 [MPL Core](/ko/smart-contracts/core) Asset 컬렉션 런칭을 위해 특별히 설계된 Metaplex 민팅 및 배포 프로그램입니다. 아이템 메타데이터 로딩부터 가드 민팅, 런칭 후 정리까지 NFT 드롭의 전체 수명주기를 관리합니다.

- 결제, 접근 제어, 스케줄링, 봇 보호를 위한 23개 이상의 조합 가능한 [가드](/ko/smart-contracts/core-candy-machine/guards) 지원
- [MPL Core Asset](/ko/smart-contracts/core) (단일 계정 NFT)을 민팅하며, 레거시 Token Metadata NFT가 아님
- 아이템은 메타데이터 참조로 로드되며, 온체인 자산은 민팅 시에만 생성됨
- 별도의 [Candy Guard](/ko/smart-contracts/core-candy-machine/guards) 프로그램이 커스텀 민팅 워크플로우를 위한 포크 가능한 접근 제어 레이어를 제공

## 소개

2022년 9월까지 Solana의 모든 NFT 중 78%가 Metaplex의 Candy Machine을 통해 민팅되었습니다. 여기에는 Solana 생태계에서 잘 알려진 대부분의 NFT 프로젝트가 포함됩니다. 2024년 Metaplex는 Solana의 NFT를 재정의하는 [Core](/ko/smart-contracts/core) 프로토콜을 도입했고, 이와 함께 Core 표준에 대해 사용자들이 좋아했던 동일한 민팅 메커니즘을 수용하는 새로운 Candy Machine을 출시했습니다.

다음은 제공되는 기능들입니다.

- SOL, NFT 또는 모든 Solana 토큰으로 결제를 받습니다.
- 시작/종료 날짜, 민팅 제한, 제3자 서명자 등을 통해 런칭을 제한합니다.
- 구성 가능한 봇 세금과 Captcha 같은 게이트키퍼를 통해 봇으로부터 런칭을 보호합니다.
- 특정 Asset/NFT/Token 보유자 또는 선별된 지갑 목록으로 민팅을 제한합니다.
- 서로 다른 규칙 세트를 가진 여러 민팅 그룹을 생성합니다.
- 사용자가 정보를 검증할 수 있도록 하면서 런칭 후 자산을 공개합니다.
- 그리고 훨씬 더 많은 기능들!

{% callout type="note" %}
이 페이지는 [MPL Core](/ko/smart-contracts/core) Asset을 민팅하는 Core Candy Machine을 다룹니다. Token Metadata NFT를 민팅해야 하는 경우 [Candy Machine V3](/ko/smart-contracts/candy-machine)를 참조하세요.
{% /callout %}

## Core Candy Machine 수명주기

Core Candy Machine 수명주기는 생성, 아이템 로딩, 민팅, 선택적 철회의 4단계 순차적 단계로 구성됩니다. 각 단계는 다음 단계가 시작되기 전에 완료되어야 합니다.

### 1단계 — Candy Machine 생성 및 구성

첫 번째 단계는 창작자가 새로운 Core Candy Machine을 생성하고 [컬렉션](/ko/smart-contracts/core/collections) 주소, 아이템 수, 선택적 [Config Line Settings](/ko/smart-contracts/core-candy-machine/create) 또는 [Hidden Settings](/ko/smart-contracts/core-candy-machine/guides/create-a-core-candy-machine-with-hidden-settings)를 포함한 설정을 구성하는 것입니다.

{% diagram %}
{% node #action label="1. 생성 및 구성" theme="pink" /%}
{% node parent="action" x="250" %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node label="설정" /%}
{% /node %}
{% edge from="action" to="candy-machine" path="straight" /%}
{% /diagram %}

생성된 Core Candy Machine은 자체 설정을 추적하여 모든 자산이 어떻게 생성되어야 하는지 결정합니다. 예를 들어, 이 Core Candy Machine에서 생성된 모든 자산에 할당될 `collection` 매개변수가 있습니다. 사용 가능한 모든 설정에 대한 자세한 내용은 [Core Candy Machine 생성하기](/ko/smart-contracts/core-candy-machine/create)를 참조하세요.

### 2단계 — Candy Machine에 아이템 삽입

생성 후 Candy Machine에 민팅될 각 아이템의 메타데이터를 로드해야 합니다. 각 아이템은 `name`과 사전 업로드된 JSON 메타데이터를 가리키는 `uri`로 구성됩니다.

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
- `uri`: 자산의 [JSON 메타데이터](/ko/smart-contracts/token-metadata/token-standard#the-non-fungible-standard)를 가리키는 URI입니다. 이는 JSON 메타데이터가 이미 온체인(예: Arweave, IPFS) 또는 오프체인(예: AWS, 자체 서버) 스토리지 제공업체를 통해 업로드되었음을 의미합니다. [CLI](/ko/dev-tools/cli/cm)나 JS SDK와 같이 Candy Machine을 생성하는 데 사용할 수 있는 도구들이 이를 위한 헬퍼를 제공합니다.

다른 모든 매개변수는 자산 간에 공유되므로 반복을 피하기 위해 Candy Machine의 설정에 직접 보관됩니다. 자세한 내용은 [아이템 삽입](/ko/smart-contracts/core-candy-machine/insert-items)을 참조하세요.

{% callout type="note" %}
이 시점에서는 실제 온체인 자산이 존재하지 않습니다. Candy Machine은 메타데이터 참조만 저장합니다. 자산은 민팅 시점에 Solana 블록체인에 생성됩니다.
{% /callout %}

### 3단계 — Candy Machine에서 자산 민팅

Candy Machine이 완전히 로드되고 모든 구성된 [가드](/ko/smart-contracts/core-candy-machine/guards) 조건이 충족되면, 사용자는 Core Asset 민팅을 시작할 수 있습니다. 각 민팅은 Candy Machine에서 하나의 아이템을 소비하고 새로운 온체인 자산을 생성합니다.

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

민팅하기 전에 일부 사용자는 Captcha를 수행하거나 Merkle Proof를 제출하는 등의 추가 검증 단계를 수행해야 할 수도 있습니다. 자세한 내용은 [민팅](/ko/smart-contracts/core-candy-machine/mint)을 참조하세요.

### 4단계 — Candy Machine 철회

모든 자산이 민팅된 후, Candy Machine은 그 목적을 다했으므로 삭제하여 온체인 저장소 임대료를 회수할 수 있습니다. 권한 지갑이 회수된 SOL을 받습니다.

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

{% callout type="warning" %}
Candy Machine 철회는 되돌릴 수 없습니다. 민팅 프로세스가 완료된 것이 확실한 후에만 철회하세요. 자세한 내용은 [Candy Machine 철회](/ko/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)를 참조하세요.
{% /callout %}

## Core Candy Machine 계정 구조

Core Candy Machine 계정은 민팅 프로세스를 관리하는 데 필요한 모든 구성 및 상태 데이터를 저장합니다. 온체인 데이터 구조는 머신 버전, 활성화된 기능, 권한 키, 컬렉션 바인딩, 상환 카운트를 추적합니다.

{% totem %}
{% totem-accordion title="온체인 Core Candy Machine 데이터 구조" %}

Core Candy Machine의 온체인 계정 구조입니다. [GitHub에서 보기](https://github.com/metaplex-foundation/mpl-core-candy-machine)

| 이름           | 타입    | 크기 | 설명                                              |
| -------------- | ------- | ---- | ------------------------------------------------ |
| version        | u8      | 1    | Candy Machine 계정의 버전                          |
| features       | [u8; 6] | 6    | Candy Machine에 활성화된 기능 플래그               |
| authority      | Pubkey  | 32   | Candy Machine을 관리하는 권한 지갑                 |
| mint_authority | Pubkey  | 32   | 민팅 권한 — 일반적으로 Candy Guard 계정            |
| collection     | Pubkey  | 32   | 생성 시 할당된 MPL Core 컬렉션 주소                |
| items_redeemed | u64     | 8    | 이 머신에서 민팅된 아이템 수                        |

{% /totem-accordion %}
{% /totem %}

**권한(authority)**은 설정 업데이트, 아이템 삽입, 임대료 철회와 같은 관리 작업을 제어합니다. **민팅 권한(mint_authority)**은 누가 민팅 지시를 트리거할 수 있는지를 제어합니다. [Candy Guard](/ko/smart-contracts/core-candy-machine/guards)가 연결되면 민팅 권한이 되어 민팅이 진행되기 전에 모든 가드 검증이 통과해야 합니다.

## Candy Guard 시스템

Candy Guard 프로그램은 Core Candy Machine 민팅에 대한 조합 가능하고 구성 가능한 접근 제어를 제공하는 동반 Solana 프로그램입니다. 가드는 민팅 프로세스를 제한하거나 수정하는 모듈형 규칙입니다.

창작자는 "**Guards**"라고 부르는 것을 사용하여 Core Candy Machine에 다양한 기능을 추가할 수 있습니다. Metaplex Core Candy Machine은 [**총 23개 이상의 기본 가드**](/ko/smart-contracts/core-candy-machine/guards)와 함께 제공되는 **Candy Guard**라는 추가 Solana 프로그램을 제공합니다. 추가 프로그램을 사용함으로써, 고급 개발자들이 기본 Candy Guard 프로그램을 포크하여 자신만의 [커스텀 가드](/ko/smart-contracts/core-candy-machine/custom-guards/generating-client)를 생성하면서도 여전히 메인 Candy Machine 프로그램에 의존할 수 있도록 합니다.

각 가드는 원하는 대로 활성화하고 구성할 수 있으므로 창작자는 필요한 기능을 선택할 수 있습니다. 모든 가드를 비활성화하면 누구나 언제든지 무료로 자산을 민팅할 수 있게 되며, 이는 창작자가 원하는 바가 아닐 수 있습니다.

### Candy Guard 조합 예제

가드는 함께 조합되어 완전한 민팅 정책을 형성합니다. 다음 예제는 봇 보호, 시간 제한, 수량 제한, 유료 민팅을 만들기 위해 네 개의 가드가 어떻게 결합되는지 보여줍니다.

Core Candy Machine에 다음과 같은 가드가 있다고 가정해봅시다:

- **[Sol Payment](/ko/smart-contracts/core-candy-machine/guards/sol-payment)**: 민팅 지갑이 구성된 대상 지갑에 구성된 양의 SOL을 지불해야 합니다.
- **[Start Date](/ko/smart-contracts/core-candy-machine/guards/start-date)**: 구성된 시간 이후에만 민팅이 시작될 수 있습니다.
- **[Mint Limit](/ko/smart-contracts/core-candy-machine/guards/mint-limit)**: 각 지갑이 구성된 양보다 많이 민팅할 수 없습니다.
- **[Bot Tax](/ko/smart-contracts/core-candy-machine/guards/bot-tax)**: 다른 활성화된 가드가 민팅 검증에 실패할 경우 민팅을 시도한 지갑에 구성된 소액의 SOL을 청구하여 자동화된 봇을 억제합니다.

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

23개 이상의 기본 가드와 커스텀 가드 생성 기능을 통해 창작자는 자신에게 중요한 기능을 선별하고 완벽한 Candy Machine을 구성할 수 있습니다. 가드는 [가드 그룹](/ko/smart-contracts/core-candy-machine/guard-groups)으로 구성하여 서로 다른 규칙을 가진 여러 민팅 단계를 정의할 수도 있습니다(예: 허용 목록 지갑을 위한 조기 접근 단계 후 퍼블릭 민팅). 가드에 대해 배우기 시작하는 가장 좋은 곳은 [Candy Guards](/ko/smart-contracts/core-candy-machine/guards) 페이지입니다.

## 참고 사항

- Core Candy Machine은 [MPL Core](/ko/smart-contracts/core) Asset만 독점적으로 민팅합니다. Token Metadata NFT를 민팅하려면 대신 [Candy Machine V3](/ko/smart-contracts/candy-machine)를 사용하세요.
- Config Line Settings를 사용할 때는 민팅이 시작되기 전에 모든 아이템을 삽입해야 합니다.
- 각 아이템의 JSON 메타데이터는 Candy Machine에 아이템을 삽입하기 전에 스토리지 제공업체(Arweave, IPFS, AWS 등)에 업로드되어야 합니다.
- Candy Machine [철회](/ko/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)는 되돌릴 수 없으며 해당 머신의 모든 온체인 데이터를 삭제합니다.
- Candy Guard 프로그램은 Candy Machine Core 프로그램과 별개입니다. 커스텀 로직을 위해 가드 프로그램을 포크하더라도 핵심 민팅 프로그램을 수정할 필요가 없습니다.
- [Bot Tax](/ko/smart-contracts/core-candy-machine/guards/bot-tax)가 활성화된 상태에서 가드 검증에 실패하면 트랜잭션을 단순히 거부하는 대신 실패한 민터에게 비용을 청구합니다.


## FAQ

### Core Candy Machine이란 무엇이며 Candy Machine V3와 어떻게 다른가요?

Core Candy Machine은 [MPL Core](/ko/smart-contracts/core) Asset을 위해 특별히 설계된 최신 Metaplex 민팅 프로그램입니다. [Candy Machine V3](/ko/smart-contracts/candy-machine)는 이전 표준을 사용하여 Token Metadata NFT를 민팅합니다. Core Candy Machine은 MPL Core가 NFT당 여러 계정 대신 단일 계정 모델을 사용하기 때문에 더 가볍고 비용 효율적인 자산을 생산합니다.

### Core Candy Machine에서 사용 가능한 가드는 몇 개인가요?

Core Candy Machine은 동반 Candy Guard 프로그램을 통해 23개 이상의 기본 [가드](/ko/smart-contracts/core-candy-machine/guards)를 제공합니다. 이 가드들은 결제 수집(SOL, SPL 토큰, NFT), 접근 제어(허용 목록, 토큰 게이트, NFT 게이트), 스케줄링(시작 및 종료 날짜), 봇 보호(봇 세금, 게이트키퍼)를 포함합니다.

### 개발자가 Core Candy Machine용 커스텀 가드를 만들 수 있나요?

네. 가드 시스템은 포크할 수 있는 별도의 Candy Guard 프로그램으로 구현되어 있습니다. 개발자는 실제 민팅 로직을 위해 메인 Candy Machine 프로그램에 의존하면서 [커스텀 가드](/ko/smart-contracts/core-candy-machine/custom-guards/generating-client)를 만들 수 있습니다.

### 모든 아이템이 민팅된 후 Core Candy Machine은 어떻게 되나요?

모든 아이템이 민팅된 후 Candy Machine을 [철회](/ko/smart-contracts/core-candy-machine/withdrawing-a-candy-machine)하여 온체인 저장소 임대료를 회수할 수 있습니다. 이 작업은 되돌릴 수 없으며 임대료로 사용된 SOL을 권한 지갑으로 반환합니다.

### Core Candy Machine을 로드하기 전에 아이템이 온체인 자산으로 존재해야 하나요?

아닙니다. 실제 온체인 자산이 아닌 아이템 메타데이터(이름과 URI 쌍)를 Candy Machine에 로드합니다. Core Asset은 사용자가 Candy Machine에서 민팅하는 순간에만 Solana 블록체인에 생성됩니다. 자세한 내용은 [아이템 삽입](/ko/smart-contracts/core-candy-machine/insert-items)을 참조하세요.

### Candy Machine 권한과 민팅 권한의 차이점은 무엇인가요?

**권한(authority)**은 Candy Machine의 구성과 관리(설정 업데이트, 아이템 삽입, 철회)를 제어합니다. **민팅 권한(mint authority)**은 누가 민팅을 트리거할 수 있는지를 제어합니다. 일반적으로 [Candy Guard](/ko/smart-contracts/core-candy-machine/guards) 계정이 민팅 권한으로 설정되어 민팅이 발생하기 전에 가드 검증이 시행됩니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| Candy Machine | NFT 런칭을 위한 아이템 메타데이터와 구성을 저장하는 임시 온체인 계정. 소진될 때까지 한 번에 하나씩 아이템이 민팅됩니다. |
| Candy Guard | Candy Machine에 조합 가능한 접근 제어 규칙(가드)을 제공하는 동반 Solana 프로그램. 민팅 권한 역할을 하며 Candy Machine 프로그램에 위임하기 전에 조건을 검증합니다. |
| 가드 | Candy Guard 프로그램 내의 단일 모듈형 규칙으로, 민팅 프로세스를 제한하거나 수정합니다 — 예를 들어 SOL 결제 요구 또는 시작 날짜 시행. |
| 가드 그룹 | 고유한 민팅 단계 또는 등급을 정의하는 명명된 가드 세트. 여러 가드 그룹을 통해 다양한 청중에게 서로 다른 규칙을 적용할 수 있습니다(예: 허용 목록 vs. 퍼블릭). |
| Config Line Settings | 구성 가능한 길이 제약 조건으로 각 아이템의 이름과 URI를 온체인에 개별적으로 저장하는 Candy Machine 구성 모드. |
| Hidden Settings | 민팅된 모든 자산이 동일한 초기 메타데이터를 공유하는 Candy Machine 구성 모드로, 일반적으로 민팅 후 공개 메커니즘에 사용됩니다. |
| 아이템 | Candy Machine에 로드되어 하나의 미래 자산에 대한 메타데이터를 나타내는 이름과 URI 쌍. 민팅될 때까지 온체인 자산이 아닙니다. |
| 권한 (Authority) | Candy Machine을 소유하고 관리하는 지갑 — 설정 업데이트, 아이템 삽입, 임대료 철회 권한이 있습니다. |
| 민팅 권한 (Mint Authority) | Candy Machine의 민팅 지시를 호출할 수 있는 권한이 있는 계정. 가드 검증을 시행하기 위해 일반적으로 Candy Guard 계정으로 설정됩니다. |
| 컬렉션 | 생성 시 Candy Machine에 할당된 [MPL Core 컬렉션](/ko/smart-contracts/core/collections) 주소. 민팅된 모든 자산은 자동으로 이 컬렉션에 추가됩니다. |
