---
title: 로열티 카드 컨셉 가이드
metaTitle: 로열티 카드 컨셉 가이드 | Core 가이드
description: 이 가이드에서는 MPL Core NFT Asset과 MPL Core 플러그인 시스템을 사용하여 Solana에서 로열티 카드 프로그램을 구축하는 방법에 대해 설명합니다.
updated: '01-31-2026'
keywords:
  - loyalty card
  - NFT membership
  - rewards program
  - Core plugins
about:
  - Loyalty programs
  - Membership NFTs
  - Plugin architecture
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
howToSteps:
  - 프로그램 PDA를 가리키는 Update Delegate가 있는 로열티 카드용 Collection 생성
  - 포인트용 AppData와 소울바운드 동작용 Freeze Delegate가 있는 로열티 카드 Asset 민팅
  - 카드 민팅, 포인트 추가, 보상 교환을 위한 명령어 구축
  - CPI 빌더를 사용하여 프로그램에서 Core와 상호작용
howToTools:
  - Anchor 프레임워크
  - mpl-core Rust 크레이트
  - Solana CLI
---
## 컨셉 가이드: Metaplex Core와 플러그인으로 로열티 카드 설정
{% callout %}
⚠️ 이것은 **컨셉 가이드**이며 완전한 엔드투엔드 튜토리얼이 아닙니다. Rust와 Solana, 특히 Anchor 프레임워크를 사용한 개발에 익숙한 개발자를 위한 것입니다. 주요 아키텍처 결정과 코드 예제를 설명하지만 프로그램 구조, CPI, Solana 스마트 컨트랙트 배포에 대한 지식이 있다고 가정합니다.
{% /callout %}
>
이 가이드는 Anchor로 Rust와 Solana의 기본 지식이 있다고 가정합니다. Metaplex Core를 활용하여 Solana의 Core NFT Asset을 사용한 로열티 카드 시스템을 구현하는 한 가지 방법을 탐구합니다. 엄격한 접근 방식을 규정하는 것이 아니라 자신의 프로젝트에 맞게 조정할 수 있는 유연한 패턴을 보여주는 것을 목표로 합니다.
### Metaplex Core란?
Metaplex Core는 플러그인 기반 아키텍처를 제공하는 Solana의 최신 NFT Asset 표준입니다. 레거시 Token Metadata 프로그램과 달리 Core는 개발자가 사용자 정의 데이터 저장, 소유권 제어, 규칙 적용과 같은 모듈식 기능을 NFT에 첨부할 수 있게 합니다.
이 예에서는 Metaplex Core의 세 가지 구성 요소를 사용합니다:
- **AppData 플러그인**: 사용자 정의 구조화된 데이터(로열티 포인트 등)를 저장하기 위해.
- **Freeze Delegate 플러그인**: 사용자가 전송하거나 소각할 수 없도록 NFT를 잠금(소울바운드 동작)하기 위해.
- **Update Delegate Authority (PDA 경유)**: 특정 컬렉션에서 민팅된 자식 NFT를 업데이트할 제어권을 프로그램에 부여하기 위해.
또한 Metaplex Core 프로그램과 상호작용하기 위해 **CPI 빌더**(예: `CreateV2CpiBuilder`)를 사용합니다. 이러한 빌더는 명령어를 구성하고 호출하는 방법을 단순화하여 코드를 읽고 유지 관리하기 쉽게 만듭니다.
### 간단한 라이프사이클 개요
```
[사용자] → 로열티 카드 요청
    ↓
[프로그램] → NFT + AppData + FreezeDelegate(소울바운드) 민팅
    ↓
[사용자] → 커피 구매 또는 포인트 교환
    ↓
[프로그램] → AppData 플러그인의 로열티 데이터 업데이트
```
설정에 대한 자세한 내용은 [Metaplex Core 문서](https://metaplex.com/docs/core)를 참조하세요.
## 로열티 시스템 아키텍처
이 예에서는 Solana 블록체인에서 Metaplex Core를 사용하여 로열티 카드 시스템을 만들기 위한 잠재적 구조 하나를 개요합니다. 로열티 카드는 NFT이며, 각각 동작과 데이터 저장 방법을 관리하는 플러그인과 연결됩니다.
### 왜 소울바운드 NFT Asset을 사용하나요?
로열티 카드를 소울바운드로 만들면 단일 사용자에게 연결되어 전송하거나 판매할 수 없습니다. 이는 로열티 프로그램의 무결성을 유지하고 사용자가 보상을 거래하거나 복제하여 시스템을 악용하는 것을 방지하는 데 도움이 됩니다.
### LoyaltyCardData 구조
각 로열티 카드는 구매하거나 교환한 커피 수와 같은 사용자별 데이터를 추적해야 합니다. Core NFT는 가볍고 확장 가능하게 설계되었으므로 AppData 플러그인을 사용하여 이 구조화된 로열티 데이터를 바이너리 형식으로 NFT에 직접 저장합니다.
이 플러그인은 NFT에 첨부되며 민팅 시 설정된 authority(이 경우 로열티 카드별로 파생되는 PDA, 아래 설명)만 쓸 수 있습니다. Solana 프로그램은 스탬프가 획득되거나 교환될 때마다 이 플러그인에 씁니다.
저장할 수 있는 데이터 구조의 예는 다음과 같습니다:
```rust
pub struct LoyaltyCardData {
    pub current_stamps: u8,
    pub lifetime_stamps: u64,
    pub last_used: u64,
    pub issue_date: u64,
}
impl LoyaltyCardData {
    pub fn new_card() -> Self {
        let timestamp = clock::Clock::get().unwrap().unix_timestamp as u64;
        LoyaltyCardData {
            current_stamps: 0,
            lifetime_stamps: 0,
            last_used: 0,
            issue_date: timestamp,
        }
    }
}
```
이 구조는 사용자가 가진 스탬프 수, 전체적으로 획득한 스탬프 수, 카드가 발급되거나 마지막으로 사용된 시간을 추적합니다. 다른 보상 로직에 맞게 이 구조를 사용자 정의할 수 있습니다.
### PDA Collection Delegate
PDA(Program Derived Addresses)에 익숙하지 않다면 시드와 프로그램 ID를 사용하여 생성되는 결정론적이고 프로그램이 소유한 주소라고 생각하세요. 이러한 주소는 개인 키로 제어되지 않고 `invoke_signed`를 사용하여 프로그램 자체에서만 서명할 수 있습니다. 이로 인해 프로그램 로직에서 authority나 역할을 할당하는 데 이상적입니다.
이 경우 **collection delegate**는 시드 `[b"collection_delegate"]`를 사용하여 생성되는 PDA입니다. 프로그램이 로열티 카드 컬렉션의 NFT를 관리하는 데 사용하는 신뢰할 수 있는 authority 역할을 합니다. 이 authority는 예를 들어 플러그인 데이터(스탬프 등) 업데이트나 NFT 동결/해제에 필요합니다.
이 접근 방식은 프로그램만(외부 지갑이 아닌) 로열티 카드 데이터를 업데이트할 수 있도록 보장합니다.
Collection Delegate는 컬렉션의 모든 에셋을 업데이트할 권한을 프로그램에 부여하는 Program Derived Address(PDA)입니다. 시드 `[b"collection_delegate"]`를 사용하여 이 PDA를 생성할 수 있습니다. 컬렉션 수준 권한을 관리하는 다른 방법도 있지만 이것은 일반적으로 사용되는 패턴 중 하나입니다.
```rust
// PDA를 생성하는 데 사용되는 시드
let seeds = &[b"collection_delegate"];
let (collection_delegate, bump) = Pubkey::find_program_address(seeds, &program_id);
```
### Loyalty Authority PDA (카드별 Authority)
collection delegate 외에도 이 패턴은 로열티 카드별로 고유한 PDA를 플러그인 authority로 사용합니다. 이 PDA는 카드의 공개 키를 시드로 사용하여 파생됩니다:
```rust
// 각 로열티 카드 NFT를 기반으로 PDA를 파생하는 데 사용되는 시드
let seeds = &[loyalty_card.key().as_ref()];
let (loyalty_authority, bump) = Pubkey::find_program_address(seeds, &program_id);
```
이 PDA는 민팅 시 AppData와 FreezeDelegate 플러그인의 authority로 설정됩니다. 올바른 시드로 `invoke_signed`를 사용하는 프로그램만 해당 특정 카드의 데이터를 수정하거나 동결 상태를 관리할 수 있도록 보장합니다.
카드별 authority를 사용하는 것은 모든 NFT를 단일 중앙 집중식 authority로 관리하는 것보다 세밀한 에셋별 제어가 필요할 때 특히 유용합니다.
자세한 구현 내용은 영문 문서의 전체 가이드를 참조하세요.
## 요약
이 가이드에서는 Metaplex Core를 사용한 로열티 카드 시스템의 개념적 구현을 설명했습니다. 다음을 탐구했습니다:
- 로열티 카드용 컬렉션 NFT 생성
- AppData 및 FreezeDelegate와 같은 플러그인을 사용한 데이터 저장 및 NFT 소울바운드화
- 프로그램이 로열티 카드를 제어할 수 있도록 PDA authority 할당
- 포인트 획득 및 교환과 같은 사용자 상호작용 처리
이 구조는 프로그램 로직, 사용자 상호작용, 각 로열티 카드 상태 간의 깔끔한 관심사 분리를 제공합니다.
## 기능 확장 아이디어
기본을 갖춘 후 로열티 시스템을 더 강력하고 매력적으로 만들기 위해 탐구할 수 있는 몇 가지 방향:
- **티어 보상**: 생애 스탬프에 기반한 여러 보상 레벨(예: 실버, 골드, 플래티넘) 도입.
- **만료 로직**: 스탬프나 카드의 만료 기간을 추가하여 지속적인 참여 장려.
- **크로스 스토어 사용**: 브랜드 내 여러 매장 또는 판매자에서 로열티 카드 사용 허용.
- **사용자 정의 배지 또는 메타데이터**: 진행 상황의 시각적 표현을 보여주도록 NFT 메타데이터를 동적으로 업데이트.
- **알림 또는 훅**: 획득한 보상이나 로열티 마일스톤을 사용자에게 알리는 오프체인 시스템 통합.
Metaplex Core의 플러그인 시스템과 자신만의 창의성을 결합하여 진정으로 보람 있고 독특한 로열티 플랫폼을 구축할 수 있습니다.
