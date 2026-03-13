---
title: 개요
metaTitle: 개요 | Candy Machine
description: Candy Machine의 개요를 제공합니다.
---

Metaplex Protocol **Candy Machine**은 Solana에서 공정한 NFT 컬렉션 출시를 위한 선도적인 민팅 및 배포 프로그램입니다. 이름에서 알 수 있듯이 Candy Machine을 창작자가 먼저 로드하고 구매자가 언로드하는 임시 구조물로 생각할 수 있습니다. 이를 통해 창작자들은 안전하고 사용자 정의 가능한 방식으로 디지털 자산을 온체인으로 가져올 수 있습니다. {% .lead %}

이 이름은 기계적 크랭크를 통해 동전을 넣고 사탕을 나누어주는 자판기를 의미합니다. 이 경우 사탕은 NFT이고 지불은 SOL 또는 SPL 토큰입니다.

{% figure src="/assets/candy-machine/candy-machine-photo.png" alt="전형적인 사탕 자판기의 AI 생성 사진" caption="전형적인 사탕 자판기" /%}

{% quick-links %}

{% quick-link title="시작하기" icon="InboxArrowDown" href="/ko/smart-contracts/candy-machine/getting-started" description="원하는 언어나 라이브러리를 찾고 Candy Machine으로 시작하세요." /%}
{% quick-link title="API 참조" icon="CodeBracketSquare" href="https://mpl-candy-machine.typedoc.metaplex.com/" target="_blank" description="특정한 내용을 찾고 있나요? 여기에 있습니다." /%}
{% /quick-links %}

{% callout %}
이 문서는 Metaplex Token Metadata NFT를 민팅하는 데 사용할 수 있는 Candy Machine V3을 참조합니다. Core Asset을 생성하려면 [Core Candy Machine](/ko/smart-contracts/core-candy-machine)을 참조하세요.
{% /callout %}

## 소개

2022년 9월까지 Solana의 모든 NFT 중 78%가 Metaplex의 Candy Machine을 통해 민팅되었습니다. 여기에는 Solana 생태계에서 잘 알려진 대부분의 NFT 프로젝트가 포함됩니다.

다음은 제공하는 기능들입니다.

- SOL, NFT 또는 모든 Solana 토큰으로 지불 받기.
- 시작/종료 날짜, 민팅 제한, 제3자 서명자 등을 통해 출시를 제한.
- 구성 가능한 봇 세금과 Captcha와 같은 게이트키퍼를 통해 봇으로부터 출시를 보호.
- 특정 NFT/토큰 보유자 또는 선별된 지갑 목록으로 민팅 제한.
- 다양한 규칙 세트로 여러 민팅 그룹 생성.
- 사용자가 해당 정보를 확인할 수 있도록 하면서 출시 후 NFT 공개.
- 그리고 훨씬 더 많은 기능!

관심이 있으신가요? Candy Machine이 어떻게 작동하는지 간단히 살펴보겠습니다!

## Candy Machine의 생명주기

첫 번째 단계는 창작자가 새로운 Candy Machine을 생성하고 원하는 대로 구성하는 것입니다.

{% diagram %}
{% node #action label="1. 생성 및 구성" theme="pink" /%}
{% node parent="action" x="250" %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="설정" /%}
{% /node %}
{% edge from="action" to="candy-machine" path="straight" /%}
{% /diagram %}

생성된 Candy Machine은 자체 설정을 추적하여 모든 NFT가 어떻게 민팅되어야 하는지 이해할 수 있도록 도와줍니다. 예를 들어, 이 Candy Machine에서 민팅된 모든 NFT에 할당될 `creators` 매개변수가 있습니다. 다음 페이지에서 일부 코드 예제를 포함하여 Candy Machine을 생성하고 구성하는 방법에 대한 더 자세한 내용을 확인할 수 있습니다: [Candy Machine 설정](/ko/smart-contracts/candy-machine/settings) 및 [Candy Machine 관리](/ko/smart-contracts/candy-machine/manage).

그러나 우리는 여전히 해당 Candy Machine에서 어떤 NFT가 민팅되어야 하는지 모릅니다. 다시 말해, Candy Machine이 로드되지 않았습니다. 따라서 다음 단계는 Candy Machine에 아이템을 삽입하는 것입니다.

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
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% edge from="action-2" to="item-1" /%}
{% edge from="action-2" to="item-2" /%}
{% edge from="action-2" to="item-3" /%}
{% edge from="action-2" to="item-rest" /%}
{% /diagram %}

각 아이템은 두 개의 매개변수로 구성됩니다:

- `name`: NFT의 이름.
- `uri`: NFT의 [JSON 메타데이터](/ko/smart-contracts/token-metadata/token-standard)를 가리키는 URI. 이는 JSON 메타데이터가 이미 온체인(예: Arweave, IPFS) 또는 오프체인(예: AWS, 자체 서버) 스토리지 제공업체를 통해 업로드되었음을 의미합니다.

다른 모든 매개변수는 모든 NFT 간에 공유되므로 중복을 피하기 위해 Candy Machine의 설정에 직접 보관됩니다. 자세한 내용은 [아이템 삽입](/ko/smart-contracts/candy-machine/insert-items)을 참조하세요.

이 시점에서 실제 NFT는 아직 생성되지 않았다는 점에 주목하세요. 우리는 단순히 민팅 시 **온디맨드로 NFT를 생성**하는 데 필요한 모든 데이터로 Candy Machine을 로드하고 있습니다. 이것이 다음 단계로 이어집니다.

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

{% node #nft-1 parent="mint" x="120" label="NFT" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="NFT" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="NFT" theme="blue" /%}

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

Candy Machine이 로드되고 모든 사전 구성된 조건이 충족되면 사용자가 NFT 민팅을 시작할 수 있습니다. 이 시점에서만 Solana 블록체인에 NFT가 생성됩니다. 민팅 전에 일부 사용자는 Captcha 수행이나 머클 증명 전송과 같은 추가 검증 단계를 수행해야 할 수 있습니다. 자세한 내용은 [민팅](/ko/smart-contracts/candy-machine/mint)을 참조하세요.

Candy Machine에서 모든 NFT가 민팅되면 목적을 달성했으므로 안전하게 삭제하여 블록체인에서 일부 저장 공간을 해제하고 일부 임대료를 회수할 수 있습니다. 자세한 내용은 [Candy Machine 관리](/ko/smart-contracts/candy-machine/manage)를 참조하세요.

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
{% node #nft-1 parent="candy-machine" x="200" label="NFT" theme="blue" /%}
{% node #nft-2 parent="nft-1" y="50" label="NFT" theme="blue" /%}
{% node #nft-3 parent="nft-2" y="50" label="NFT" theme="blue" /%}
{% edge from="action-1" to="candy-machine" path="straight" /%}
{% /diagram %}

## Candy Guard

이제 Candy Machine이 어떻게 작동하는지 이해했으므로 창작자가 Candy Machine의 민팅 프로세스를 보호하고 사용자 정의할 수 있는 다양한 방법을 살펴보겠습니다.

창작자는 "**가드**"를 사용하여 Candy Machine에 다양한 기능을 추가할 수 있습니다. Metaplex Candy Machine은 [**총 21개의 기본 가드**](/ko/smart-contracts/candy-machine/guards)와 함께 제공되는 **Candy Guard**라는 추가 Solana 프로그램과 함께 제공됩니다. 추가 프로그램을 사용함으로써 고급 개발자가 기본 Candy Guard 프로그램을 포크하여 자체 커스텀 가드를 만들면서도 여전히 메인 Candy Machine 프로그램을 사용할 수 있습니다.

각 가드는 원하는 대로 활성화하고 구성할 수 있으므로 창작자가 필요한 기능을 선택할 수 있습니다. 모든 가드를 비활성화하는 것은 누구나 언제든지 무료로 NFT를 민팅할 수 있도록 허용하는 것과 같으며, 이는 우리가 원하는 것이 아닐 것입니다. 따라서 더 현실적인 예제를 만들기 위해 몇 가지 가드를 살펴보겠습니다.

Candy Machine에 다음과 같은 가드가 있다고 가정해보겠습니다:

- **Sol Payment**: 이 가드는 민팅 지갑이 구성된 목적지 지갑에 구성된 SOL 금액을 지불해야 함을 보장합니다.
- **Start Date**: 이 가드는 구성된 시간 이후에만 민팅이 시작될 수 있도록 보장합니다.
- **Mint Limit**: 이 가드는 각 지갑이 구성된 금액보다 많이 민팅할 수 없도록 보장합니다.
- **Bot Tax**: 이 가드는 조금 특별합니다. 어떤 것도 보호하지 않지만 봇이 Candy Machine을 민팅하는 것을 방지하기 위해 실패한 민팅의 동작을 변경합니다. 이 가드가 활성화되면 다른 활성화된 가드가 민팅 검증에 실패하면 민팅을 시도한 지갑에 작은 구성된 SOL 금액을 청구합니다.

결과적으로 SOL을 청구하고, 특정 시간에 출시되며, 지갑당 제한된 민팅만 허용하는 봇 방지 Candy Machine이 만들어집니다. 다음은 구체적인 예시입니다.

{% diagram %}
{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
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
{% node #mints label="민팅" theme="pink" /%}
{% node #mint-1 label="#1: 지갑 A (1 SOL) 1월 5일" theme="pink" /%}
{% node #mint-2 label="#2: 지갑 B (3 SOL) 1월 6일" theme="pink" /%}
{% node #mint-3 label="#3: 지갑 B (2 SOL) 1월 6일" theme="pink" /%}
{% node #mint-4 label="#4: 지갑 C (0.5 SOL) 1월 6일" theme="pink" /%}
{% /node %}
{% node #fail-1 parent="mints" x="250" theme="red" %}
너무 이름 {% .text-xs %} \
봇 세금 청구됨
{% /node %}
{% node #nft-2 parent="fail-1" y="50" label="NFT" theme="blue" /%}
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

보시다시피, 21개 이상의 기본 가드와 커스텀 가드를 생성할 수 있는 기능을 통해 창작자는 중요한 기능을 선별하고 완벽한 Candy Machine을 구성할 수 있습니다. 이는 매우 강력한 기능이므로 많은 페이지를 할애했습니다. 가드에 대해 더 자세히 알아보기 위한 최고의 시작점은 [Candy Guards](/ko/smart-contracts/candy-machine/guards) 페이지입니다.

## 다음 단계

이것이 Candy Machine의 좋은 개요를 제공하지만, 발견하고 배울 것이 훨씬 더 많습니다. 이 Candy Machine 문서의 다른 페이지에서 기대할 수 있는 내용은 다음과 같습니다.

- [시작하기](/ko/smart-contracts/candy-machine/getting-started). Candy Machine을 관리하는 데 사용할 수 있는 다양한 라이브러리와 SDK를 나열합니다.
- [Candy Machine 설정](/ko/smart-contracts/candy-machine/settings). Candy Machine 설정을 매우 자세히 설명합니다.
- [Candy Machine 관리](/ko/smart-contracts/candy-machine/manage). Candy Machine을 관리하는 방법을 설명합니다.
- [아이템 삽입](/ko/smart-contracts/candy-machine/insert-items). Candy Machine에 아이템을 로드하는 방법을 설명합니다.
- [Candy Guards](/ko/smart-contracts/candy-machine/guards). 가드가 작동하는 방식과 활성화하는 방법을 설명합니다.
- [가드 그룹](/ko/smart-contracts/candy-machine/guard-groups). 여러 가드 그룹을 구성하는 방법을 설명합니다.
- [특수 가드 명령어](/ko/smart-contracts/candy-machine/guard-route). 가드별 명령어를 실행하는 방법을 설명합니다.
- [민팅](/ko/smart-contracts/candy-machine/mint). Candy Machine에서 민팅하는 방법과 민팅 전 요구사항을 처리하는 방법을 설명합니다.
- [참조](/ko/smart-contracts/candy-machine/references). Candy Machine과 관련된 API 참조를 나열합니다.
