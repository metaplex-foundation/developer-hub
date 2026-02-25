---
title: 개요
metaTitle: Metaplex Core | Solana를 위한 차세대 NFT 표준
description: Metaplex Core는 단일 계정 설계, 강제 로열티, 유연한 플러그인 시스템을 갖춘 Solana의 차세대 NFT 표준입니다. 낮은 비용, 낮은 컴퓨팅, 더 나은 성능.
updated: '01-31-2026'
keywords:
  - Metaplex Core
  - Solana NFT
  - NFT standard
  - single-account NFT
  - enforced royalties
  - mpl-core
about:
  - NFT standards
  - Solana blockchain
  - Digital assets
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: Metaplex Core란 무엇인가요?
    a: Metaplex Core는 단일 계정 설계로 낮은 비용, 강제 로열티, 유연한 플러그인 시스템을 제공하는 Solana의 차세대 NFT 표준입니다. 새로운 NFT 프로젝트에 권장되는 표준입니다.
  - q: Core는 Token Metadata와 어떻게 다른가요?
    a: Core는 자산당 하나의 계정을 사용하고(Token Metadata는 3개 이상), 민팅 비용이 약 80% 저렴하며, 컴퓨팅 사용량이 낮고, 로열티 강제가 내장되어 있습니다.
  - q: Token Metadata에서 Core로 마이그레이션할 수 있나요?
    a: Core Asset과 Token Metadata NFT는 별도의 표준입니다. 자동 마이그레이션은 없습니다. 새 프로젝트는 Core를 사용해야 하며, 기존 Token Metadata 컬렉션은 계속 작동합니다.
  - q: Core는 로열티를 지원하나요?
    a: 예. Core에는 기본적으로 로열티를 강제하는 Royalties 플러그인이 있습니다. 베이시스 포인트, 크리에이터 분배, 마켓플레이스용 허용/거부 목록 규칙을 설정할 수 있습니다.
  - q: 플러그인이란 무엇인가요?
    a: 플러그인은 Core Asset 또는 Collection에 동작을 추가하는 모듈식 확장입니다. 예로는 Freeze Delegate, Attributes, Royalties가 있습니다.
  - q: Core Asset을 민팅하는 데 비용이 얼마나 드나요?
    a: 자산당 약 0.0029 SOL이며, Token Metadata의 약 0.022 SOL과 비교됩니다. 이로써 Core는 민팅이 약 80% 저렴합니다.
  - q: 어떤 RPC 제공자가 Core를 지원하나요?
    a: DAS(Digital Asset Standard)를 지원하는 모든 주요 RPC 제공자가 Core 자산을 인덱싱합니다.
  - q: 게임 자산에 Core를 사용할 수 있나요?
    a: 예. Core의 플러그인 시스템은 온체인 스탯용 Attributes, 아이템 잠금용 Freeze Delegate, 마켓플레이스 통합용 Transfer Delegate로 게임에 이상적입니다.
---
Metaplex Core("Core")는 Solana의 **차세대 NFT 표준**입니다. **단일 계정 설계**를 사용하여 대안 대비 민팅 비용을 80% 이상 절감하면서 **강제 로열티**, **컬렉션 레벨 작업**, 그리고 사용자 정의 동작을 위한 **유연한 플러그인 시스템**을 제공합니다. {% .lead %}
{% callout title="학습 내용" %}
이 개요에서 다루는 내용:
- Metaplex Core란 무엇이며 왜 존재하는가
- Token Metadata 및 기타 표준 대비 주요 장점
- 핵심 개념: Asset, Collection, Plugin
- Core로 개발 시작하는 방법
{% /callout %}
## 요약
**Metaplex Core**는 대부분의 새 프로젝트에서 Token Metadata를 대체하는 Solana NFT 표준입니다. 가장 낮은 민팅 비용, 강제 로열티, 사용자 정의 기능을 위한 플러그인 아키텍처를 제공합니다.
- 단일 계정 설계: 민팅당 약 0.0029 SOL (Token Metadata의 0.022 SOL 대비)
- 기본적으로 강제 로열티, 허용/거부 목록 제어 포함
- 스테이킹, 속성, 위임, 사용자 정의 동작을 위한 플러그인 시스템
- 컬렉션 레벨 작업: 모든 자산을 한 번에 동결, 로열티 업데이트 또는 수정
## 범위 외
이 개요에서는 대체 가능 토큰(SPL Token 사용), Token Metadata 마이그레이션 경로, 상세한 플러그인 구현을 다루지 않습니다. 해당 주제는 특정 페이지를 참조하세요.
## 빠른 시작
**바로가기:** [시작하기](#다음-단계) · [주요 장점](#소개) · [FAQ](#faq) · [용어집](#용어집)
1. SDK 설치: `npm install @metaplex-foundation/mpl-core`
2. Asset 생성: [Asset 생성 가이드](/ko/smart-contracts/core/create-asset)
3. 플러그인 추가: [플러그인 개요](/ko/smart-contracts/core/plugins)
4. DAS로 쿼리: [Asset 가져오기](/ko/smart-contracts/core/fetch)
{% quick-links %}
{% quick-link title="시작하기" icon="InboxArrowDown" href="/ko/smart-contracts/core/sdk" description="원하는 언어 또는 라이브러리를 선택하고 Solana에서 디지털 자산을 시작하세요." /%}
{% quick-link title="API 레퍼런스" icon="CodeBracketSquare" href="https://mpl-core.typedoc.metaplex.com/" target="_blank" description="특정 내용을 찾고 계신가요? API 레퍼런스를 확인하세요." /%}
{% quick-link title="Token Metadata와의 차이점" icon="AcademicCap" href="/ko/smart-contracts/core/tm-differences" description="Token Metadata에서 오셨나요? 변경 사항과 새로운 기능을 확인하세요." /%}
{% quick-link title="UI에서 Core 체험하기" icon="Beaker" href="https://core.metaplex.com/" target="_blank" description="웹 인터페이스를 사용하여 직접 Core Asset을 민팅해 보세요." /%}
{% /quick-links %}
## 소개
Metaplex Core는 Solana에서 새 프로젝트에 권장되는 NFT 표준입니다. Token Metadata 및 기타 표준과 비교하여 Core는 다음을 제공합니다:
### 비용 효율성
| 표준 | 민팅 비용 | 컴퓨팅 유닛 |
|----------|-----------|---------------|
| **Metaplex Core** | ~0.0029 SOL | ~17,000 CU |
| Token Metadata | ~0.022 SOL | ~205,000 CU |
| Token Extensions | ~0.0046 SOL | ~85,000 CU |
### 주요 장점
- **단일 계정 설계**: Core는 여러 계정(mint + metadata + token account) 대신 자산당 하나의 계정을 사용합니다. 이로써 비용이 절감되고 개발이 간소화됩니다.
- **강제 로열티**: [Royalties 플러그인](/ko/smart-contracts/core/plugins/royalties)은 허용/거부 목록 제어와 함께 기본적으로 크리에이터 로열티를 강제합니다.
- **컬렉션 레벨 작업**: 단일 트랜잭션으로 전체 컬렉션의 로열티 업데이트, 자산 동결 또는 메타데이터 수정이 가능합니다.
- **플러그인 아키텍처**: 플러그인을 통해 자산에 사용자 정의 동작 추가:
  - [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) - 다른 사람이 동결/해제 가능
  - [Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) - 다른 사람이 소각 가능
  - [Attributes](/ko/smart-contracts/core/plugins/attribute) - 온체인 키/값 데이터 (DAS에서 자동 인덱싱)
  - [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) - 다른 사람이 전송 가능
  - 더 많은 내용은 [플러그인 섹션](/ko/smart-contracts/core/plugins)을 참조하세요
- **DAS 인덱싱**: [DAS를 지원하는](/solana/rpcs-and-das) 모든 주요 RPC 제공자가 이미 Core 자산을 인덱싱합니다.
## 핵심 개념
### Asset
**Asset**은 NFT를 나타내는 단일 온체인 계정입니다. Token Metadata(3개 이상의 계정 사용)와 달리, Core Asset은 소유권, 메타데이터 URI, 플러그인 데이터를 하나의 계정에 포함합니다.
참조: [Asset이란?](/ko/smart-contracts/core/what-is-an-asset)
### Collection
**Collection**은 관련 Asset을 그룹화하는 Core 계정입니다. Collection은 모든 멤버 Asset에 적용되는 자체 플러그인을 가질 수 있습니다. 예를 들어, 컬렉션 레벨 로열티는 재정의되지 않는 한 컬렉션의 모든 Asset에 적용됩니다.
참조: [Collection](/ko/smart-contracts/core/collections)
### Plugin
**Plugin**은 Asset 또는 Collection에 동작을 추가하는 모듈식 확장입니다. 라이프사이클 이벤트(생성, 전송, 소각)에 후킹하여 규칙을 강제하거나 데이터를 저장합니다.
참조: [플러그인 개요](/ko/smart-contracts/core/plugins)
## 빠른 참조
### 프로그램 ID
| 프로그램 | 주소 |
|---------|---------|
| MPL Core | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| MPL Core (Devnet) | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
### SDK 패키지
| 언어 | 패키지 |
|----------|---------|
| JavaScript/TypeScript | `@metaplex-foundation/mpl-core` |
| Rust | `mpl-core` |
## 다음 단계
1. **SDK 선택**: [시작하기](/ko/smart-contracts/core/sdk)에서 JavaScript 또는 Rust SDK 설치
2. **첫 번째 Asset 생성**: [Asset 생성](/ko/smart-contracts/core/create-asset) 가이드 따라하기
3. **플러그인 탐색**: [플러그인](/ko/smart-contracts/core/plugins)에서 사용 가능한 동작 확인
4. **Token Metadata에서 마이그레이션**: [Token Metadata와의 차이점](/ko/smart-contracts/core/tm-differences) 검토
{% callout %}
특정 Core 명령어에는 프로토콜 수수료가 필요합니다. 현재 정보는 [프로토콜 수수료](/protocol-fees) 페이지를 확인하세요.
{% /callout %}
## FAQ
### Metaplex Core란 무엇인가요?
Metaplex Core는 단일 계정 설계로 낮은 비용, 강제 로열티, 유연한 플러그인 시스템을 제공하는 Solana의 차세대 NFT 표준입니다. 새로운 NFT 프로젝트에 권장되는 표준입니다.
### Core는 Token Metadata와 어떻게 다른가요?
Core는 자산당 하나의 계정을 사용하고(Token Metadata는 3개 이상), 민팅 비용이 약 80% 저렴하며, 컴퓨팅 사용량이 낮고, 로열티 강제가 내장되어 있습니다. Token Metadata는 새 프로젝트에서 레거시로 간주됩니다. 자세한 비교는 [Token Metadata와의 차이점](/ko/smart-contracts/core/tm-differences)을 참조하세요.
### Token Metadata에서 Core로 마이그레이션할 수 있나요?
Core Asset과 Token Metadata NFT는 별도의 표준입니다. 자동 마이그레이션은 없습니다. 새 프로젝트는 Core를 사용해야 하며, 기존 Token Metadata 컬렉션은 계속 작동합니다.
### Core는 로열티를 지원하나요?
예. Core에는 기본적으로 로열티를 강제하는 [Royalties 플러그인](/ko/smart-contracts/core/plugins/royalties)이 있습니다. 베이시스 포인트, 크리에이터 분배, 마켓플레이스용 허용/거부 목록 규칙을 설정할 수 있습니다.
### 플러그인이란 무엇인가요?
플러그인은 Core Asset 또는 Collection에 동작을 추가하는 모듈식 확장입니다. 예로는 Freeze Delegate(동결 허용), Attributes(온체인 데이터), Royalties(크리에이터 지불)가 있습니다.
### Core Asset을 민팅하는 데 비용이 얼마나 드나요?
기본 자산당 약 0.0029 SOL이며, Token Metadata의 약 0.022 SOL과 비교됩니다. 이로써 Core는 민팅이 약 80% 저렴합니다. 자세한 내용은 [Token Metadata와의 차이점](/ko/smart-contracts/core/tm-differences)을 참조하세요.
### 어떤 RPC 제공자가 Core를 지원하나요?
DAS(Digital Asset Standard)를 지원하는 모든 주요 RPC 제공자가 Core 자산을 인덱싱합니다. 현재 목록은 [RPC 제공자](/solana/rpcs-and-das)를 참조하세요.
### 게임 자산에 Core를 사용할 수 있나요?
예. Core의 플러그인 시스템은 온체인 스탯용 Attributes, 아이템 잠금용 Freeze Delegate, 마켓플레이스 통합용 Transfer Delegate로 게임에 이상적입니다.
## 용어집
| 용어 | 정의 |
|------|------------|
| **Asset** | 소유권, 메타데이터, 플러그인을 가진 NFT를 나타내는 단일 Core 온체인 계정 |
| **Collection** | 관련 Asset을 그룹화하고 컬렉션 전체 플러그인을 적용할 수 있는 Core 계정 |
| **Plugin** | Asset 또는 Collection에 동작을 추가하는 모듈식 확장(로열티, 동결, 속성) |
| **DAS** | Digital Asset Standard - 인덱싱된 NFT 데이터를 쿼리하기 위한 API 사양 |
| **베이시스 포인트** | 퍼센트의 100분의 1 단위 로열티 비율 (500 = 5%) |
| **Delegate** | 소유하지 않고 Asset에 대해 특정 작업을 수행할 권한이 있는 계정 |
| **CPI** | Cross-Program Invocation - 다른 Solana 프로그램에서 Core 프로그램을 호출하는 것 |
| **URI** | 이름, 이미지, 속성이 포함된 JSON 파일을 가리키는 오프체인 메타데이터 URL |
