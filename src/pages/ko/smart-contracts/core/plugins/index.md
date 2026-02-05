---
title: 플러그인 개요
metaTitle: Core 플러그인 개요 | Metaplex Core
description: Metaplex Core 플러그인에 대해 알아보세요. 로열티, 동결, 소각, 온체인 속성과 같은 동작을 NFT Asset과 Collection에 추가하는 모듈식 확장입니다.
updated: '01-31-2026'
keywords:
  - Core plugins
  - NFT plugins
  - plugin system
  - royalties plugin
  - freeze plugin
about:
  - Plugin architecture
  - NFT extensions
  - Lifecycle events
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: Asset 생성 후에 플러그인을 추가할 수 있나요?
    a: 네, Permanent 플러그인을 제외하고 가능합니다. Owner Managed 플러그인은 소유자 서명이 필요하고, Authority Managed 플러그인은 update authority 서명이 필요합니다.
  - q: Asset이 전송되면 플러그인은 어떻게 되나요?
    a: Owner Managed 플러그인(Transfer, Freeze, Burn Delegate)은 전송 시 권한이 자동으로 취소됩니다. Authority Managed와 Permanent 플러그인은 유지됩니다.
  - q: Asset이 Collection과 동일한 플러그인을 가질 수 있나요?
    a: 네. 둘 다 동일한 플러그인 유형을 가지고 있으면 Asset 수준 플러그인이 Collection 수준 플러그인보다 우선합니다.
  - q: 플러그인을 제거하려면 어떻게 하나요?
    a: removePlugin 명령을 사용합니다. 플러그인 권한자만 제거할 수 있습니다.
  - q: 커스텀 플러그인을 만들 수 있나요?
    a: 아니요. 내장 플러그인만 지원됩니다. 플러그인 시스템은 제3자가 확장할 수 없습니다.
  - q: 플러그인에 추가 SOL이 드나요?
    a: 플러그인을 추가하면 계정 크기가 증가하여 rent가 증가합니다. 대부분의 플러그인은 약 0.001 SOL이지만, 데이터 저장 플러그인(AppData나 Attributes 등)은 저장하는 데이터 양에 따라 비용이 더 들 수 있습니다.
---
이 페이지에서는 **Core 플러그인 시스템**에 대해 설명합니다. Core Asset과 Collection에 동작과 데이터 저장을 추가하는 모듈식 확장입니다. 플러그인은 라이프사이클 이벤트에 연결하여 규칙을 적용하거나 온체인 데이터를 저장합니다. {% .lead %}
{% callout title="배울 내용" %}
- 플러그인이란 무엇이며 어떻게 작동하는지
- 플러그인 유형: Owner Managed, Authority Managed, Permanent
- 플러그인이 라이프사이클 이벤트(생성, 전송, 소각)에 미치는 영향
- Asset과 Collection 간의 플러그인 우선순위
{% /callout %}
## 요약
**플러그인**은 Core Asset 또는 Collection에 기능을 추가하는 온체인 확장입니다. 데이터를 저장하거나(속성 등), 규칙을 적용하거나(로열티 등), 권한을 위임(동결/전송 권한 등)할 수 있습니다.
- **Owner Managed**: 추가에 소유자 서명 필요 (Transfer, Freeze, Burn Delegate)
- **Authority Managed**: update authority가 추가 가능 (Royalties, Attributes, Update Delegate)
- **Permanent**: 생성 시에만 추가 가능 (Permanent Transfer/Freeze/Burn Delegate)
## 범위 외
커스텀 플러그인 생성(내장 플러그인만 지원), Token Metadata 플러그인(다른 시스템), 오프체인 플러그인 데이터 저장.
## 빠른 시작
**바로가기:** [플러그인 유형](#플러그인-유형) · [플러그인 테이블](#플러그인-테이블) · [라이프사이클 이벤트](#플러그인과-라이프사이클-이벤트) · [플러그인 추가](/ko/smart-contracts/core/plugins/adding-plugins)
1. 사용 사례에 따라 플러그인 선택 (로열티, 동결, 속성 등)
2. `addPlugin()` 또는 Asset/Collection 생성 시 플러그인 추가
3. 플러그인이 자동으로 라이프사이클 이벤트에 연결
4. DAS 또는 온체인 fetch를 통해 플러그인 데이터 쿼리
## 라이프사이클
Core Asset의 라이프사이클 동안 여러 이벤트가 트리거될 수 있습니다:
- 생성
- 전송
- 업데이트
- 소각
- 플러그인 추가
- 권한 플러그인 승인
- 권한 플러그인 제거
라이프사이클 이벤트는 생성부터 지갑 간 전송, Asset 파괴까지 다양한 방식으로 Asset에 영향을 미칩니다. Asset 수준 또는 Collection 수준에 첨부된 플러그인은 이러한 라이프사이클 이벤트 동안 검증 프로세스를 거쳐 이벤트 실행을 `approve`, `reject` 또는 `force approve`합니다.
## 플러그인이란?
플러그인은 NFT를 위한 온체인 앱과 같으며 데이터를 저장하거나 Asset에 추가 기능을 제공할 수 있습니다.
## 플러그인 유형
### Owner Managed 플러그인
Owner Managed 플러그인은 Asset 소유자의 서명이 트랜잭션에 있는 경우에만 Core Asset에 추가할 수 있는 플러그인입니다.
Owner Managed 플러그인에는 다음이 포함되지만 이에 국한되지 않습니다:
- [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) (마켓플레이스, 게임)
- [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) (마켓플레이스, 스테이킹, 게임)
- [Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) (게임)
Owner Managed 플러그인이 권한 없이 Asset/Collection에 추가되면 권한 유형이 기본적으로 `owner` 유형이 됩니다.
Owner Managed 플러그인의 권한은 전송 시 자동으로 취소됩니다.
### Authority Managed 플러그인
Authority Managed 플러그인은 MPL Core Asset 또는 Core Collection의 권한자가 언제든지 추가 및 업데이트할 수 있는 플러그인입니다.
Authority Managed 플러그인에는 다음이 포함되지만 이에 국한되지 않습니다:
- [Royalties](/ko/smart-contracts/core/plugins/royalties)
- [Update Delegate](/ko/smart-contracts/core/plugins/update-delegate)
- [Attribute](/ko/smart-contracts/core/plugins/attribute)
Authority Managed 플러그인이 권한 인수 없이 Asset/Collection에 추가되면 플러그인은 기본적으로 `update authority` 유형의 권한이 됩니다.
### Permanent 플러그인
**Permanent 플러그인은 생성 시에만 Core Asset에 추가할 수 있는 플러그인입니다.** Asset이 이미 존재하는 경우 Permanent 플러그인을 추가할 수 없습니다.
Permanent 플러그인에는 다음이 포함되지만 이에 국한되지 않습니다:
- [Permanent Transfer Delegate](/ko/smart-contracts/core/plugins/permanent-transfer-delegate)
- [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate)
- [Permanent Burn Delegate](/ko/smart-contracts/core/plugins/permanent-burn-delegate)
Permanent 플러그인이 권한 없이 Asset/Collection에 추가되면 권한 유형이 기본적으로 `update authority` 유형이 됩니다.
## Collection 플러그인
Collection 플러그인은 Collection 수준에서 추가되어 컬렉션 전체에 영향을 미칠 수 있는 플러그인입니다. 이는 특히 로열티에 유용한데, Collection Asset에 [Royalties 플러그인](/ko/smart-contracts/core/plugins/royalties)을 할당하면 해당 Collection의 모든 Asset이 해당 플러그인을 참조하게 됩니다.
Collection은 `Permanent 플러그인`과 `Authority Managed 플러그인`에만 접근할 수 있습니다.
## 플러그인 우선순위
MPL Core Asset과 MPL Core Collection Asset이 모두 동일한 플러그인 유형을 공유하는 경우, Asset 수준 플러그인과 그 데이터가 Collection 수준 플러그인보다 우선합니다.
이는 Asset 컬렉션에 다른 수준의 로열티를 설정하는 것과 같이 창의적인 방식으로 사용될 수 있습니다.
- Collection Asset에 2%로 Royalties 플러그인이 할당됨
- 컬렉션 내 슈퍼 레어 MPL Core Asset에 5%로 Royalty 플러그인이 할당됨
위의 경우, 컬렉션의 일반 MPL Core Asset 판매는 2% 로열티를 유지하고, 슈퍼 레어 MPL Core Asset은 Collection Asset Royalties 플러그인보다 우선하는 자체 Royalties 플러그인을 가지고 있기 때문에 판매 시 5% 로열티를 유지합니다.
## 플러그인 테이블
| 플러그인                                                                   | Owner Managed | Authority Managed | Permanent |
| ------------------------------------------------------------------------ | ------------- | ----------------- | --------- |
| [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate)                     | ✅            |                   |           |
| [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate)                         | ✅            |                   |           |
| [Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate)                             | ✅            |                   |           |
| [Royalties](/ko/smart-contracts/core/plugins/royalties)                                     |               | ✅                |           |
| [Update Delegate](/ko/smart-contracts/core/plugins/update-delegate)                         |               | ✅                |           |
| [Attribute](/ko/smart-contracts/core/plugins/attribute)                                     |               | ✅                |           |
| [Permanent Transfer Delegate](/ko/smart-contracts/core/plugins/permanent-transfer-delegate) |               |                   | ✅        |
| [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate)     |               |                   | ✅        |
| [Permanent Burn Delegate](/ko/smart-contracts/core/plugins/permanent-burn-delegate)         |               |                   | ✅        |
## 플러그인과 라이프사이클 이벤트
MPL Core의 플러그인은 생성, 전송, 소각, 업데이트와 같은 특정 라이프사이클 동작의 결과에 영향을 미칠 수 있습니다.
각 플러그인은 동작을 원하는 결과로 `reject`, `approve` 또는 `force approve`할 수 있습니다.
라이프사이클 이벤트 동안 동작은 미리 정의된 플러그인 목록을 순서대로 확인하고 검증합니다.
플러그인 조건이 검증되면 라이프사이클이 통과하고 동작을 계속합니다.
플러그인 검증이 실패하면 라이프사이클이 중단되고 거부됩니다.
플러그인 검증 규칙은 다음 조건 계층을 따릅니다:
- force approve가 있으면 항상 approve
- 그렇지 않으면 reject가 있으면 reject
- 그렇지 않으면 approve가 있으면 approve
- 그렇지 않으면 reject
`force approve` 검증은 자사 플러그인과 `Permanent Delegate` 플러그인에서만 사용 가능합니다.
### Force Approve
Force approve는 플러그인 검증을 확인할 때 첫 번째로 이루어지는 검사입니다. 현재 force approve 검증을 수행하는 플러그인은:
- **Permanent Transfer**
- **Permanent Burn**
- **Permanent Freeze**
이러한 플러그인은 비영구적 대응 플러그인 및 다른 플러그인보다 우선하여 동작을 실행합니다.
#### 예시
Freeze Plugin으로 Asset 수준에서 동결된 Asset이 있고 동시에 Asset에 **Permanent Burn** 플러그인이 있는 경우, Asset이 동결되어 있어도 영구 플러그인의 `forceApprove` 특성으로 인해 **Permanent Burn** 플러그인을 통해 호출된 소각 절차는 여전히 실행됩니다.
### 생성
{% totem %}
| 플러그인    | 동작     | 조건 |
| --------- | ---------- | ---------- |
| Royalties | 거부 가능 | Ruleset    |
{% /totem %}
### 업데이트
{% totem %}
업데이트에는 현재 플러그인 조건이나 검증이 없습니다.
{% /totem %}
### 전송
{% totem %}
| 플러그인                      | 동작      | 조건  |
| --------------------------- | ----------- | ----------- |
| Royalties                   | 거부 가능  | Ruleset     |
| Freeze Delegate             | 거부 가능  | isFrozen    |
| Transfer Delegate           | 승인 가능 | isAuthority |
| Permanent Freeze Delegate   | 거부 가능  | isFrozen    |
| Permanent Transfer Delegate | 승인 가능 | isAuthority |
{% /totem %}
### 소각
{% totem %}
| 플러그인                    | 동작      | 조건  |
| ------------------------- | ----------- | ----------- |
| Freeze Delegate           | 거부 가능  | isFrozen    |
| Burn Delegate             | 거부 가능  | isAuthority |
| Permanent Freeze Delegate | 거부 가능  | isFrozen    |
| Permanent Burn Delegate   | 승인 가능 | isAuthority |
{% /totem %}
### 플러그인 추가
{% totem %}
| 플러그인          | 동작      | 조건  |
| --------------- | ----------- | ----------- |
| Royalties       | 거부 가능  | Ruleset     |
| Update Delegate | 승인 가능 | isAuthority |
{% /totem %}
### 플러그인 제거
{% totem %}
| 플러그인          | 동작      | 조건  |
| --------------- | ----------- | ----------- |
| Royalties       | 거부 가능  | Ruleset     |
| Update Delegate | 승인 가능 | isAuthority |
{% /totem %}
### 플러그인 권한 승인
{% totem %}
승인에는 현재 플러그인 조건이나 검증이 없습니다.
{% /totem %}
### 권한 플러그인 취소
{% totem %}
취소에는 현재 플러그인 조건이나 검증이 없습니다.
{% /totem %}
## 일반적인 사용 사례
| 사용 사례 | 권장 플러그인 |
|----------|-------------------|
| 크리에이터 로열티 적용 | [Royalties](/ko/smart-contracts/core/plugins/royalties) |
| 에스크로 없는 스테이킹 | [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) |
| 마켓플레이스 리스팅 | [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) + [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) |
| 온체인 게임 스탯 | [Attributes](/ko/smart-contracts/core/plugins/attribute) |
| 제3자 소각 허용 | [Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) |
| 영구 스테이킹 프로그램 | [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate) |
## FAQ
### Asset 생성 후에 플러그인을 추가할 수 있나요?
네, Permanent 플러그인을 제외하고 가능합니다. Owner Managed 플러그인은 소유자 서명이 필요하고, Authority Managed 플러그인은 update authority 서명이 필요합니다.
### Asset이 전송되면 플러그인은 어떻게 되나요?
Owner Managed 플러그인(Transfer, Freeze, Burn Delegate)은 전송 시 권한이 자동으로 취소됩니다. Authority Managed와 Permanent 플러그인은 유지됩니다.
### Asset이 Collection과 동일한 플러그인을 가질 수 있나요?
네. 둘 다 동일한 플러그인 유형을 가지고 있으면 Asset 수준 플러그인이 Collection 수준 플러그인보다 우선합니다.
### 플러그인을 제거하려면 어떻게 하나요?
`removePlugin` 명령을 사용합니다. 플러그인 권한자만 제거할 수 있습니다. [플러그인 제거](/ko/smart-contracts/core/plugins/removing-plugins)를 참조하세요.
### 커스텀 플러그인을 만들 수 있나요?
아니요. 내장 플러그인만 지원됩니다. 플러그인 시스템은 제3자가 확장할 수 없습니다.
### 플러그인에 추가 SOL이 드나요?
플러그인을 추가하면 계정 크기가 증가하여 rent가 증가합니다. 대부분의 플러그인은 약 0.001 SOL이지만, 데이터 저장 플러그인(AppData나 Attributes 등)은 저장하는 데이터 양에 따라 비용이 더 들 수 있습니다.
## 용어집
| 용어 | 정의 |
|------|------------|
| **Plugin** | Asset/Collection에 동작이나 데이터를 추가하는 모듈식 확장 |
| **Owner Managed** | 추가에 소유자 서명이 필요한 플러그인 유형 |
| **Authority Managed** | update authority가 추가할 수 있는 플러그인 유형 |
| **Permanent** | 생성 시에만 추가할 수 있는 플러그인 유형 |
| **Lifecycle Event** | 플러그인이 검증할 수 있는 동작 (생성, 전송, 소각) |
| **Force Approve** | 다른 거부를 재정의하는 Permanent 플러그인 검증 |
| **Plugin Authority** | 플러그인을 업데이트하거나 제거할 권한이 있는 계정 |
