---
title: 개요
metaTitle: 개요 | Core
description: Metaplex에서 만든 Core라는 새로운 Solana NFT 자산 표준의 개략적인 개요를 제공합니다.
---

Metaplex Core("Core")는 이전 표준의 복잡성과 기술적 부채를 제거하고 디지털 자산을 위한 깔끔하고 간단한 핵심 사양을 제공합니다. 이 차세대 Solana NFT 표준은 단일 계정 설계를 사용하여 민팅 비용을 줄이고 다른 대안과 비교하여 Solana 네트워크 부하를 개선합니다. 또한 개발자가 자산의 동작과 기능을 수정할 수 있도록 하는 유연한 플러그인 시스템을 가지고 있습니다. {% .lead %}

[https://core.metaplex.com/](https://core.metaplex.com/)에서 Core의 기능을 직접 체험해보고 자산을 민팅해보세요!

{% quick-links %}

{% quick-link title="시작하기" icon="InboxArrowDown" href="/ko/core/getting-started" description="원하는 언어나 라이브러리를 찾고 Solana에서 디지털 자산으로 시작하세요." /%}

{% quick-link title="API 참조" icon="CodeBracketSquare" href="https://mpl-core.typedoc.metaplex.com/" target="_blank" description="특정한 내용을 찾고 있나요? API 참조를 확인하고 답을 찾으세요." /%}

{% quick-link title="MPL Token Metadata와의 차이점 개요" icon="AcademicCap" href="/ko/core/tm-differences" description="Token Metadata에 익숙하고 새로운 기능이나 변경된 동작의 개요를 보고 싶나요?" /%}

{% quick-link title="UI에서 직접 체험해보세요!" icon="Beaker" href="https://core.metaplex.com/" target="_blank" description="사용하기 쉬운 웹사이트를 통해 Core를 직접 체험해보세요!" /%}

{% /quick-links %}

## 소개

Metaplex Core는 Metaplex Protocol의 새로운 NFT 표준입니다. Metaplex Token Metadata Program을 포함한 다른 표준과 비교하여 다음과 같은 장점이 있습니다:

- **전례 없는 비용 효율성**: Metaplex Core는 사용 가능한 대안과 비교하여 가장 낮은 민팅 비용을 제공합니다. 예를 들어, Token Metadata로 .022 SOL 또는 Token Extensions로 .0046 SOL이 드는 NFT를 Core로는 .0029 SOL에 민팅할 수 있습니다.
- **낮은 컴퓨트**: Core 작업은 작은 Compute Unit 발자국을 가집니다. 이를 통해 더 많은 트랜잭션이 하나의 블록에 포함될 수 있으며, 민팅을 위해 205000 CU 대신 Core는 단지 17000 CU만 필요합니다.
- **단일 계정 설계**: SPL Token이나 Token Extensions(일명 Token22)와 같은 대체 가능한 토큰 표준에 의존하는 대신 Core는 NFT 표준의 요구사항에 집중합니다. 이를 통해 Core는 소유자를 추적하는 단일 계정만 사용할 수 있습니다.
- **강제 로열티**: Core는 기본적으로 [로열티 집행](/ko/core/plugins/royalties)을 허용합니다.
- **일급 컬렉션 지원**: 자산을 [컬렉션](/ko/core/collections)으로 그룹화할 수 있습니다. 이는 Token Metadata에서도 가능하지만, Core에서는 컬렉션이 자체 자산 클래스로서 다음과 같은 추가 기능을 허용합니다:
- **컬렉션 레벨 작업**: Core는 사용자가 컬렉션 레벨에서 모든 자산에 대한 변경을 할 수 있게 해줍니다. 예를 들어, 모든 컬렉션 자산을 동결하거나 로열티 세부사항을 단일 트랜잭션으로 동시에 변경할 수 있습니다!
- **고급 플러그인 지원**: 내장된 스테이킹부터 자산 기반 포인트 시스템까지, Metaplex Core의 플러그인 아키텍처는 광범위한 유틸리티와 커스터마이제이션의 환경을 제공합니다. 플러그인을 통해 개발자는 생성, 전송, 소각과 같은 자산 생명 주기 이벤트에 훅을 걸어 커스텀 동작을 추가할 수 있습니다. 자산에 플러그인을 추가할 수 있습니다. 예: 권한 위임 또는 DAS에 의해 자동으로 색인화되는 온체인 속성 추가:
- **즉석 색인화**: [DAS를 지원하는 많은 RPC 제공업체](/ko/rpc-providers)가 이미 Core를 지원하고 있습니다.

## 다음 단계

Metaplex Core가 무엇인지 개략적으로 살펴보았으므로, Core 자산과 상호 작용하는 데 사용할 수 있는 다양한 언어/프레임워크를 나열하는 [시작하기](/ko/core/getting-started) 페이지를 확인하는 것을 권장합니다. [MPL Token Metadata와의 차이점](/ko/core/tm-differences) 페이지도 살펴보는 것이 좋습니다. 그 이후에 다양한 기능 페이지를 사용하여 cNFT에서 수행할 수 있는 특정 작업에 대해 자세히 알아볼 수 있습니다.