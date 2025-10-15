---
title: 플러그인 개요
metaTitle: 애셋 플러그인 개요 | Core
description: 새로운 Metaplex Core 디지털 애셋 표준은 플러그인을 통해 애셋과 상호작용하는 새로운 방법을 제공합니다. 플러그인을 애셋에 추가하여 동작을 변경하거나 데이터를 저장할 수 있어 솔라나 블록체인의 NFT 및 디지털 애셋을 더욱 향상시킵니다.
---

## 라이프사이클

Core 애셋의 라이프사이클 동안 다음과 같은 여러 이벤트가 트리거될 수 있습니다:

- Creating (생성)
- Transferring (전송)
- Updating (업데이트)
- Burning (소각)
- Add Plugin (플러그인 추가)
- Approve Authority Plugin (권한 플러그인 승인)
- Remove Authority Plugin (권한 플러그인 제거)

라이프사이클 이벤트는 생성부터 지갑 간 전송, 그리고 애셋 삭제까지 다양한 방식으로 애셋에 영향을 미칩니다. 애셋 레벨 또는 컬렉션 레벨에 연결된 플러그인은 이러한 라이프사이클 이벤트 중에 유효성 검사 과정을 거쳐 이벤트 실행을 `승인`, `거부` 또는 `강제 승인`합니다.

## 플러그인이란?

플러그인은 NFT를 위한 온체인 앱과 같은 것으로, 데이터를 저장하거나 애셋에 추가적인 기능을 제공할 수 있습니다.

## 플러그인의 종류

### 소유자 관리 플러그인

소유자 관리 플러그인은 애셋 소유자의 서명이 트랜잭션에 포함된 경우에만 Core 애셋에 추가될 수 있는 플러그인입니다.

소유자 관리 플러그인에는 다음이 포함되지만 이에 국한되지 않습니다:

- [Transfer Delegate](/core/plugins/transfer-delegate) (마켓플레이스, 게임)
- [Freeze Delegate](/core/plugins/freeze-delegate) (마켓플레이스, 스테이킹, 게임)
- [Burn Delegate](/core/plugins/burn-delegate) (게임)

소유자 관리 플러그인이 권한 설정 없이 애셋/컬렉션에 추가되면 권한 타입이 `owner`로 기본 설정됩니다.

소유자 관리 플러그인의 권한은 전송 시 자동으로 해제됩니다.

### 권한 관리 플러그인

권한 관리 플러그인은 MPL Core 애셋 또는 Core 컬렉션의 권한이 언제든지 추가하고 업데이트할 수 있는 플러그인입니다.

권한 관리 플러그인에는 다음이 포함되지만 이에 국한되지 않습니다:

- [Royalties](/core/plugins/royalties)
- [Update Delegate](/core/plugins/update-delegate)
- [Attribute](/core/plugins/attribute)

권한 관리 플러그인이 권한 인수 없이 애셋/컬렉션에 추가되면 플러그인은 `update authority` 권한 타입으로 기본 설정됩니다.

### 영구 플러그인

**영구 플러그인은 Core 애셋 생성 시에만 추가될 수 있는 플러그인입니다.** 애셋이 이미 존재하는 경우 영구 플러그인은 추가할 수 없습니다.

영구 플러그인에는 다음이 포함되지만 이에 국한되지 않습니다:

- [Permanent Transfer Delegate](/core/plugins/permanent-transfer-delegate)
- [Permanent Freeze Delegate](/core/plugins/permanent-freeze-delegate)
- [Permanent Burn Delegate](/core/plugins/permanent-burn-delegate)

영구 플러그인이 권한 설정 없이 애셋/컬렉션에 추가되면 권한 타입이 `update authority`로 기본 설정됩니다.

## 컬렉션 플러그인

컬렉션 플러그인은 컬렉션 레벨에서 추가되는 플러그인으로 컬렉션 전체에 영향을 미칠 수 있습니다. 이는 특히 로열티에 유용합니다. [royalties plugin](/core/plugins/royalties)을 컬렉션 애셋에 할당하면 해당 컬렉션의 모든 애셋이 해당 플러그인을 참조하게 됩니다.

컬렉션은 `영구 플러그인`과 `권한 관리 플러그인`에만 액세스할 수 있습니다.

## 플러그인 우선순위

MPL Core 애셋과 MPL Core 컬렉션 애셋이 모두 동일한 플러그인 타입을 공유하는 경우, 애셋 레벨 플러그인과 해당 데이터가 컬렉션 레벨 플러그인보다 우선순위를 갖습니다.

이는 컬렉션 애셋에 대해 다양한 레벨의 로열티를 설정하는 것과 같은 창의적인 방법으로 사용될 수 있습니다.

- 컬렉션 애셋에 2% 로열티 플러그인이 할당됨
- 컬렉션 내의 슈퍼 레어 MPL Core 애셋에 5% 로열티 플러그인이 할당됨

위의 경우, 컬렉션의 일반 MPL Core 애셋 판매는 2% 로열티를 유지하는 반면, 슈퍼 레어 MPL Core 애셋은 컬렉션 애셋 로열티 플러그인보다 우선순위를 갖는 자체 로열티 플러그인으로 인해 판매 시 5% 로열티를 유지합니다.

## 플러그인 표

| Plugin                                                                   | Owner Managed | Authority Managed | Permanent |
| ------------------------------------------------------------------------ | ------------- | ----------------- | --------- |
| [Transfer Delegate](/core/plugins/transfer-delegate)                     | ✅            |                   |           |
| [Freeze Delegate](/core/plugins/freeze-delegate)                         | ✅            |                   |           |
| [Burn Delegate](/core/plugins/burn-delegate)                             | ✅            |                   |           |
| [Royalties](/core/plugins/royalties)                                     |               | ✅                |           |
| [Update Delegate](/core/plugins/update-delegate)                         |               | ✅                |           |
| [Attribute](/core/plugins/attribute)                                     |               | ✅                |           |
| [Permanent Transfer Delegate](/core/plugins/permanent-transfer-delegate) |               |                   | ✅        |
| [Permanent Freeze Delegate](/core/plugins/permanent-freeze-delegate)     |               |                   | ✅        |
| [Permanent Burn Delegate](/core/plugins/permanent-burn-delegate)         |               |                   | ✅        |

## 플러그인과 라이프사이클 이벤트

MPL Core의 플러그인은 Create, Transfer, Burn, Update와 같은 특정 라이프사이클 액션의 결과에 영향을 미칠 수 있는 기능을 가지고 있습니다.

각 플러그인은 액션을 원하는 결과로 `거부`, `승인` 또는 `강제 승인`할 수 있는 기능을 가지고 있습니다.

라이프사이클 이벤트 중에 액션은 미리 정의된 플러그인 목록을 따라 이동하면서 검사하고 유효성을 검증합니다.
플러그인 조건이 유효성 검사를 통과하면 라이프사이클이 통과하고 액션을 계속합니다.

플러그인 유효성 검사가 실패하면 라이프사이클이 중단되고 거부됩니다.

플러그인 유효성 검사 규칙은 다음 조건 계층 구조를 따릅니다:

- 강제 승인이 있으면 항상 승인
- 그렇지 않고 거부가 있으면 거부
- 그렇지 않고 승인이 있으면 승인
- 그렇지 않으면 거부

`강제 승인` 유효성 검사는 1st party 플러그인과 `Permanent Delegate` 플러그인에서만 사용할 수 있습니다.

### 강제 승인

강제 승인은 플러그인 유효성 검사를 확인할 때 첫 번째로 이루어지는 검사입니다. 현재 유효성 검사를 강제 승인하는 플러그인은 다음과 같습니다:

- **Permanent Transfer**
- **Pernament Burn**
- **Permanent Freeze**

이러한 플러그인은 비영구적 대응 플러그인 및 다른 플러그인보다 해당 액션에서 우선순위를 갖습니다.

#### 예시
애셋 레벨에서 Freeze 플러그인으로 동결된 애셋이 있으면서 동시에 애셋에 **Permanent Burn** 플러그인이 있는 경우, 애셋이 동결되어 있더라도 **Pernament Burn** 플러그인의 `forceApprove` 특성으로 인해 **Pernament Burn** 플러그인을 통해 호출된 소각 절차는 여전히 실행됩니다.

### Create

{% totem %}

| Plugin    | Action     | Conditions |
| --------- | ---------- | ---------- |
| Royalties | Can Reject | Ruleset    |

{% /totem %}

### Update

{% totem %}
Update는 현재 플러그인 조건이나 유효성 검사가 없습니다.
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
Approve는 현재 플러그인 조건이나 유효성 검사가 없습니다.
{% /totem %}

### Revoke Authority Plugin

{% totem %}
Revoke는 현재 플러그인 조건이나 유효성 검사가 없습니다.
{% /totem %}