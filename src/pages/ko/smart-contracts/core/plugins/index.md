---
title: Plugin 개요
metaTitle: Core Plugin 개요 | Metaplex Core
description: Metaplex Core Plugin에 대해 알아봅니다. 로열티, 동결, 소각, 온체인 속성 등의 동작을 NFT Asset과 Collection에 추가하는 모듈식 확장 기능입니다.
---

이 페이지에서는 **Core Plugin 시스템**에 대해 설명합니다. Core Asset과 Collection에 동작과 데이터 저장을 추가하는 모듈식 확장 기능입니다. Plugin은 라이프사이클 이벤트에 연결되어 규칙을 적용하거나 온체인 데이터를 저장합니다. {% .lead %}

{% callout title="학습 내용" %}

- Plugin이 무엇이고 어떻게 작동하는지
- Plugin 유형: Owner Managed, Authority Managed, Permanent
- Plugin이 라이프사이클 이벤트(생성, 전송, 소각)에 미치는 영향
- Asset과 Collection 간의 Plugin 우선순위

{% /callout %}

## 요약

**Plugin**은 Core Asset 또는 Collection에 기능을 추가하는 온체인 확장 기능입니다. 데이터를 저장하거나(속성 등), 규칙을 적용하거나(로열티 등), 권한을 위임할 수 있습니다(동결/전송 권한 등).

- **Owner Managed**: 추가하려면 소유자 서명 필요 (Transfer, Freeze, Burn Delegate)
- **Authority Managed**: 업데이트 권한으로 추가 가능 (Royalties, Attributes, Update Delegate)
- **Permanent**: 생성 시에만 추가 가능 (Permanent Transfer/Freeze/Burn Delegate)

## 범위 외

커스텀 Plugin 생성(기본 제공 Plugin만 지원), Token Metadata Plugin(다른 시스템), 오프체인 Plugin 데이터 저장은 범위 외입니다.

## 빠른 시작

**바로 가기:** [Plugin 유형](#plugin-유형) · [Plugin 표](#plugin-표) · [라이프사이클 이벤트](#plugin과-라이프사이클-이벤트) · [Plugin 추가](/ko/smart-contracts/core/plugins/adding-plugins)

1. 사용 사례에 따라 Plugin 선택 (로열티, 동결, 속성 등)
2. `addPlugin()` 사용 또는 Asset/Collection 생성 시 Plugin 추가
3. Plugin이 자동으로 라이프사이클 이벤트에 연결
4. DAS 또는 온체인 fetch로 Plugin 데이터 쿼리

## 라이프사이클

Core Asset의 라이프사이클 동안 다음과 같은 여러 이벤트가 트리거될 수 있습니다:

- 생성
- 전송
- 업데이트
- 소각
- Plugin 추가
- 권한 Plugin 승인
- 권한 Plugin 제거

라이프사이클 이벤트는 생성부터 지갑 간 전송, 그리고 Asset 삭제까지 다양한 방식으로 Asset에 영향을 미칩니다. Asset 레벨 또는 Collection 레벨에 연결된 Plugin은 이러한 라이프사이클 이벤트 중에 유효성 검사 과정을 거쳐 이벤트 실행을 `승인`, `거부` 또는 `강제 승인`합니다.

## Plugin이란?

Plugin은 NFT를 위한 온체인 앱과 같은 것으로, 데이터를 저장하거나 Asset에 추가적인 기능을 제공할 수 있습니다.

## Plugin 유형

### Owner Managed Plugin

Owner Managed Plugin은 Asset 소유자의 서명이 트랜잭션에 포함된 경우에만 Core Asset에 추가될 수 있는 Plugin입니다.

Owner Managed Plugin에는 다음이 포함되지만 이에 국한되지 않습니다:

- [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) (마켓플레이스, 게임)
- [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) (마켓플레이스, 스테이킹, 게임)
- [Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) (게임)

Owner Managed Plugin이 권한 설정 없이 Asset/Collection에 추가되면 권한 타입이 `owner`로 기본 설정됩니다.

Owner Managed Plugin의 권한은 전송 시 자동으로 해제됩니다.

### Authority Managed Plugin

Authority Managed Plugin은 MPL Core Asset 또는 Core Collection의 권한이 언제든지 추가하고 업데이트할 수 있는 Plugin입니다.

Authority Managed Plugin에는 다음이 포함되지만 이에 국한되지 않습니다:

- [Royalties](/ko/smart-contracts/core/plugins/royalties)
- [Update Delegate](/ko/smart-contracts/core/plugins/update-delegate)
- [Attribute](/ko/smart-contracts/core/plugins/attribute)

Authority Managed Plugin이 권한 인수 없이 Asset/Collection에 추가되면 Plugin은 `update authority` 권한 타입으로 기본 설정됩니다.

### Permanent Plugin

**Permanent Plugin은 Core Asset 생성 시에만 추가될 수 있는 Plugin입니다.** Asset이 이미 존재하는 경우 Permanent Plugin은 추가할 수 없습니다.

Permanent Plugin에는 다음이 포함되지만 이에 국한되지 않습니다:

- [Permanent Transfer Delegate](/ko/smart-contracts/core/plugins/permanent-transfer-delegate)
- [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate)
- [Permanent Burn Delegate](/ko/smart-contracts/core/plugins/permanent-burn-delegate)

Permanent Plugin이 권한 설정 없이 Asset/Collection에 추가되면 권한 타입이 `update authority`로 기본 설정됩니다.

## Collection Plugin

Collection Plugin은 Collection 레벨에서 추가되는 Plugin으로 Collection 전체에 영향을 미칠 수 있습니다. 이는 특히 로열티에 유용합니다. [royalties plugin](/ko/smart-contracts/core/plugins/royalties)을 Collection Asset에 할당하면 해당 Collection의 모든 Asset이 해당 Plugin을 참조하게 됩니다.

Collection은 `Permanent Plugin`과 `Authority Managed Plugin`에만 액세스할 수 있습니다.

## Plugin 우선순위

MPL Core Asset과 MPL Core Collection Asset이 모두 동일한 Plugin 타입을 공유하는 경우, Asset 레벨 Plugin과 해당 데이터가 Collection 레벨 Plugin보다 우선순위를 갖습니다.

이는 Collection Asset에 대해 다양한 레벨의 로열티를 설정하는 것과 같은 창의적인 방법으로 사용될 수 있습니다.

- Collection Asset에 2% Royalties Plugin이 할당됨
- Collection 내의 슈퍼 레어 MPL Core Asset에 5% Royalty Plugin이 할당됨

위의 경우, Collection의 일반 MPL Core Asset 판매는 2% 로열티를 유지하는 반면, 슈퍼 레어 MPL Core Asset은 Collection Asset Royalties Plugin보다 우선순위를 갖는 자체 Royalties Plugin으로 인해 판매 시 5% 로열티를 유지합니다.

## Plugin 표

| Plugin                                                                   | Owner Managed | Authority Managed | Permanent |
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

## Plugin과 라이프사이클 이벤트

MPL Core의 Plugin은 Create, Transfer, Burn, Update와 같은 특정 라이프사이클 액션의 결과에 영향을 미칠 수 있는 기능을 가지고 있습니다.

각 Plugin은 액션을 원하는 결과로 `거부`, `승인` 또는 `강제 승인`할 수 있는 기능을 가지고 있습니다.

라이프사이클 이벤트 중에 액션은 미리 정의된 Plugin 목록을 따라 이동하면서 검사하고 유효성을 검증합니다.
Plugin 조건이 유효성 검사를 통과하면 라이프사이클이 통과하고 액션을 계속합니다.

Plugin 유효성 검사가 실패하면 라이프사이클이 중단되고 거부됩니다.

Plugin 유효성 검사 규칙은 다음 조건 계층 구조를 따릅니다:

- 강제 승인이 있으면 항상 승인
- 그렇지 않고 거부가 있으면 거부
- 그렇지 않고 승인이 있으면 승인
- 그렇지 않으면 거부

`강제 승인` 유효성 검사는 1st party Plugin과 `Permanent Delegate` Plugin에서만 사용할 수 있습니다.

### 강제 승인

강제 승인은 Plugin 유효성 검사를 확인할 때 첫 번째로 이루어지는 검사입니다. 현재 유효성 검사를 강제 승인하는 Plugin은 다음과 같습니다:

- **Permanent Transfer**
- **Permanent Burn**
- **Permanent Freeze**

이러한 Plugin은 비영구적 대응 Plugin 및 다른 Plugin보다 해당 액션에서 우선순위를 갖습니다.

#### 예시
Asset 레벨에서 Freeze Plugin으로 동결된 Asset이 있으면서 동시에 Asset에 **Permanent Burn** Plugin이 있는 경우, Asset이 동결되어 있더라도 Permanent Plugin의 `forceApprove` 특성으로 인해 **Permanent Burn** Plugin을 통해 호출된 소각 절차는 여전히 실행됩니다.

### Create

{% totem %}

| Plugin    | Action     | Conditions |
| --------- | ---------- | ---------- |
| Royalties | Can Reject | Ruleset    |

{% /totem %}

### Update

{% totem %}
Update는 현재 Plugin 조건이나 유효성 검사가 없습니다.
{% /totem %}

### Transfer

{% totem %}

| Plugin                      | Action      | Conditions  |
| --------------------------- | ----------- | ----------- |
| Royalties                   | Can Reject  | Ruleset     |
| Freeze Delegate             | Can Reject  | isFrozen    |
| Transfer Delegate           | Can Approve | isAuthority |
| Permanent Freeze Delegate   | Can Reject  | isFrozen    |
| Permanent Transfer Delegate | Can Approve | isAuthority |

{% /totem %}

### Burn

{% totem %}

| Plugin                    | Action      | Conditions  |
| ------------------------- | ----------- | ----------- |
| Freeze Delegate           | Can Reject  | isFrozen    |
| Burn Delegate             | Can Reject  | isAuthority |
| Permanent Freeze Delegate | Can Reject  | isFrozen    |
| Permanent Burn Delegate   | Can Approve | isAuthority |

{% /totem %}

### Add Plugin

{% totem %}

| Plugin          | Action      | Conditions  |
| --------------- | ----------- | ----------- |
| Royalties       | Can Reject  | Ruleset     |
| Update Delegate | Can Approve | isAuthority |

{% /totem %}

### Remove Plugin

{% totem %}

| Plugin          | Action      | Conditions  |
| --------------- | ----------- | ----------- |
| Royalties       | Can Reject  | Ruleset     |
| Update Delegate | Can Approve | isAuthority |

{% /totem %}

### Approve Plugin Authority

{% totem %}
Approve는 현재 Plugin 조건이나 유효성 검사가 없습니다.
{% /totem %}

### Revoke Authority Plugin

{% totem %}
Revoke는 현재 Plugin 조건이나 유효성 검사가 없습니다.
{% /totem %}

## 일반적인 사용 사례

| 사용 사례 | 추천 Plugin |
|----------|-------------------|
| 크리에이터 로열티 적용 | [Royalties](/ko/smart-contracts/core/plugins/royalties) |
| 에스크로 없는 스테이킹 | [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) |
| 마켓플레이스 리스팅 | [Freeze Delegate](/ko/smart-contracts/core/plugins/freeze-delegate) + [Transfer Delegate](/ko/smart-contracts/core/plugins/transfer-delegate) |
| 온체인 게임 스탯 | [Attributes](/ko/smart-contracts/core/plugins/attribute) |
| 서드파티 소각 허용 | [Burn Delegate](/ko/smart-contracts/core/plugins/burn-delegate) |
| 영구 스테이킹 프로그램 | [Permanent Freeze Delegate](/ko/smart-contracts/core/plugins/permanent-freeze-delegate) |

## FAQ

### Asset 생성 후에 Plugin을 추가할 수 있나요?

예, Permanent Plugin을 제외하고 가능합니다. Owner Managed Plugin은 소유자 서명이 필요하고, Authority Managed Plugin은 업데이트 권한 서명이 필요합니다.

### Asset이 전송되면 Plugin은 어떻게 되나요?

Owner Managed Plugin(Transfer, Freeze, Burn Delegate)은 전송 시 권한이 자동으로 해제됩니다. Authority Managed Plugin과 Permanent Plugin은 유지됩니다.

### Asset이 Collection과 동일한 Plugin을 가질 수 있나요?

예. 둘 다 동일한 Plugin 타입을 가질 경우, Asset 레벨 Plugin이 Collection 레벨 Plugin보다 우선합니다.

### Plugin을 제거하려면 어떻게 하나요?

`removePlugin` 명령을 사용합니다. Plugin 권한만 제거할 수 있습니다. [Plugin 제거](/ko/smart-contracts/core/plugins/removing-plugins)를 참조하세요.

### 커스텀 Plugin을 만들 수 있나요?

아니요. 기본 제공 Plugin만 지원됩니다. Plugin 시스템은 서드파티가 확장할 수 없습니다.

### Plugin에 추가 SOL이 드나요?

Plugin을 추가하면 계정 크기가 증가하여 렌트가 증가합니다. 비용은 데이터 크기에 따라 Plugin당 약 0.001 SOL로 최소입니다.

## 용어집

| 용어 | 정의 |
|------|------------|
| **Plugin** | Asset/Collection에 동작이나 데이터를 추가하는 모듈식 확장 기능 |
| **Owner Managed** | 추가에 소유자 서명이 필요한 Plugin 유형 |
| **Authority Managed** | 업데이트 권한이 추가할 수 있는 Plugin 유형 |
| **Permanent** | 생성 시에만 추가할 수 있는 Plugin 유형 |
| **라이프사이클 이벤트** | Plugin이 검증할 수 있는 액션(생성, 전송, 소각) |
| **강제 승인** | 다른 거부를 무시하는 Permanent Plugin 유효성 검사 |
| **Plugin 권한** | Plugin을 업데이트하거나 제거할 권한이 있는 계정 |

---

*Metaplex Foundation에서 관리 · 2026년 1월 마지막 확인 · @metaplex-foundation/mpl-core에 적용*
