---
title: Core 그룹
metaTitle: Core 그룹 개요 | Metaplex Core
description: mpl-core GroupV1 계정 개요 — 컬렉션, 자산, 중첩 그룹을 묶는 분류 기능
updated: '07-02-2026'
keywords:
  - mpl-core groups
  - GroupV1
  - taxonomy
  - group collections
about:
  - NFT collections
  - Collection management
proficiencyLevel: Intermediate
faqs:
  - q: 컬렉션과 그룹의 차이점은 무엇인가요?
    a: 컬렉션은 공유 메타데이터와 컬렉션 레벨 플러그인 아래에서 Core Asset을 그룹화합니다. 그룹은 컬렉션, 스탠드얼론 에셋, 다른 그룹을 참조할 수 있는 분류 컨테이너입니다. 컬렉션은 "이 NFT가 어떤 시리즈에 속하는가?"에 답하고, 그룹은 "이 컬렉션이나 에셋이 어떤 상위 세트에 포함되는가?"에 답합니다.
  - q: 컬렉션이 여러 그룹에 속할 수 있나요?
    a: 네. 컬렉션을 그룹에 추가하면 mpl-core가 부모 그룹 주소를 컬렉션의 Groups 플러그인에 기록합니다. 컬렉션은 온체인 벡터 한도까지 여러 부모 그룹을 나열할 수 있습니다.
  - q: 그룹을 중첩할 수 있나요?
    a: 네. 그룹은 자식 그룹을 포함하고 부모 그룹도 나열할 수 있습니다. 부모/자식 링크는 두 계정에서 동기화됩니다. 그룹은 최대 8개의 부모 그룹에 속할 수 있습니다.
  - q: 그룹화된 컬렉션 안의 에셋이 자동으로 그룹에 속하나요?
    a: 아니요. 그룹 멤버십은 직접 멤버에만 저장됩니다. 컬렉션을 그룹에 추가하면 해당 컬렉션이 `group.collections`에 추가되고 컬렉션에 Groups 플러그인이 기록됩니다. 그 컬렉션에 민팅된 NFT는 자동으로 `group.assets`에 추가되지 않습니다.
  - q: 스탠드얼론 에셋이 그룹의 직접 멤버가 될 수 있나요?
    a: 네. `addAssetsToGroup`을 사용해 컬렉션 없이 에셋을 `group.assets`에 직접 추가할 수 있습니다. 컬렉션 관리 에셋도 올바른 권한자가 서명하면 명시적으로 추가할 수 있습니다.
  - q: 누가 그룹 멤버십을 변경할 수 있나요?
    a: 그룹 update authority가 추가/제거 명령에 서명합니다. 컬렉션 관리 에셋의 경우 컬렉션 update authority(또는 인가된 delegate)가 그룹을 대신해 해당 에셋을 추가하거나 제거할 수 있습니다.
---

## 요약

**Core Groups**(`GroupV1`)는 [컬렉션](/ko/smart-contracts/core/collections), [에셋](/ko/smart-contracts/core/what-is-an-asset), 다른 그룹을 상위 세트로 묶는 분류 계정입니다. 예를 들어 여러 컬렉션을 포함하는 브랜드 우산 또는 스탠드얼론 에셋 큐레이션 디렉터리가 있습니다.

- 그룹은 컬렉션과 같이 자체 `name`과 `uri`를 저장합니다
- 그룹은 벡터당 최대 **256**개의 컬렉션, 자식 그룹, 부모 그룹 링크 또는 에셋을 직접 포함할 수 있습니다
- 그룹에 추가된 컬렉션과 에셋에는 부모 그룹 주소를 나열하는 **Groups** 플러그인이 부여됩니다

**작업으로 이동:** [그룹 생성](#그룹-생성) · [멤버십 관리](#그룹-멤버십-관리) · [그룹 조회](#그룹-조회)

## 컬렉션 vs 그룹

| | **컬렉션** | **그룹** |
| --- | --- | --- |
| 목적 | 시리즈 NFT의 공유 메타데이터와 플러그인 | 컬렉션·에셋·그룹 분류/디렉터리 |
| 사용자 NFT 소유 | 예 — 에셋이 컬렉션을 참조 | 아니요 — 에셋은 (있는 경우) 원래 컬렉션에 남음 |
| 일반적인 질문 | "이 NFT는 어떤 시리즈?" | "어떤 브랜드·시즌·디렉터리에 이 컬렉션이 포함되나?" |
| 온체인 | 에셋 `updateAuthority`가 컬렉션을 가리킴 | `group.collections`, `group.assets`, `group.groups`에 나열 |

시리즈 전체 로열티, 동결 규칙, 공유 아트워크가 필요하면 **컬렉션**을 사용하세요. 민팅 방식을 바꾸지 않고 여러 컬렉션이나 스탠드얼론 에셋을 하나의 라벨로 정리하려면 **그룹**을 사용하세요.

## GroupV1 계정

`GroupV1` 계정에는 다음이 저장됩니다:

| 필드 | 설명 |
| --- | --- |
| `updateAuthority` | 그룹을 업데이트하고 멤버십을 변경할 수 있는 권한 |
| `name` | 표시 이름 |
| `uri` | 오프체인 JSON 메타데이터 URI |
| `collections` | 이 그룹의 **직접** 자식 컬렉션 |
| `groups` | 이 그룹이 포함하는 자식 그룹 |
| `parentGroups` | 이 그룹을 포함하는 부모 그룹 |
| `assets` | 이 그룹의 **직접** 멤버 에셋 |

온체인 제한(mpl-core 기준):

- 벡터(`collections`, `groups`, `parentGroups`, `assets`)당 최대 **256**개
- 그룹당 부모 그룹 최대 **8**개(`MAX_GROUP_NESTING_DEPTH`)

{% callout type="note" %}
그룹은 컬렉션 멤버십을 자동으로 순회하지 않습니다. 컬렉션을 그룹에 추가해도 해당 컬렉션의 NFT가 `group.assets`에 추가되지 않습니다. 그룹화된 컬렉션의 NFT를 다루려면 컬렉션과 해당 에셋을 별도로 작업하세요.
{% /callout %}

## Groups 플러그인

컬렉션이나 에셋을 그룹에 추가하면 mpl-core는 해당 멤버에 **Groups** 권한 관리 플러그인이 존재하도록 합니다. 플러그인에는 부모 그룹 공개 키가 저장됩니다.

Groups 플러그인은 최소 하나의 그룹에 속해 있는 동안 **그룹 멤버 자체**(컬렉션 계정 또는 직접 그룹화된 에셋)의 소각을 차단합니다. 그룹화된 컬렉션 안의 에셋을 소각해도 컬렉션은 그룹에서 제거되지 않습니다.

## 그룹 생성

`createGroup` / `createGroupV1`로 새 그룹 계정을 배포합니다:

{% code-tabs-imported from="core/create-group" frameworks="umi" /%}

생성 시 `relationships`를 전달하면 한 트랜잭션에서 컬렉션, 자식 그룹, 부모 그룹, 에셋을 연결할 수 있습니다. 각 relationship 항목은 `RelationshipKind`를 사용합니다: `Collection`, `ChildGroup`, `ParentGroup`, `Asset`.

## 그룹 멤버십 관리

별도 언급이 없으면 모든 멤버십 변경은 **그룹 update authority**가 서명합니다.

| 작업 | SDK 헬퍼 | 업데이트 내용 |
| --- | --- | --- |
| 컬렉션 추가 | `addCollectionsToGroup` | 그룹 `collections` + 컬렉션 Groups 플러그인 |
| 컬렉션 제거 | `removeCollectionsFromGroup` | 양쪽 |
| 에셋 추가 | `addAssetsToGroup` | 그룹 `assets` + 에셋 Groups 플러그인 |
| 에셋 제거 | `removeAssetsFromGroup` | 양쪽 |
| 자식 그룹 추가 | `addGroupsToGroup` | 부모 `groups` + 자식 `parentGroups` |
| 자식 그룹 제거 | `removeGroupsFromGroup` | 양쪽 |
| 메타데이터/권한 업데이트 | `updateGroup` | 그룹 이름, URI, update authority |
| 빈 그룹 닫기 | `closeGroup` | 그룹 계정 닫기 |

### 컬렉션을 그룹에 추가

{% code-tabs-imported from="core/add-collection-to-group" frameworks="umi" /%}

### 스탠드얼론 에셋을 그룹에 추가

{% code-tabs-imported from="core/add-asset-to-group" frameworks="umi" /%}

### 그룹 중첩

{% code-tabs-imported from="core/nest-groups" frameworks="umi" /%}

부모와 자식 벡터는 동기화됩니다. 부모는 `groups`에 자식을, 자식은 `parentGroups`에 부모를 기록합니다.

## 그룹 조회

mpl-core SDK로 온체인 상태를 읽습니다:

{% code-tabs-imported from="core/fetch-group" frameworks="umi" /%}

update authority별 그룹 목록은 `getGroupV1GpaBuilder`(GPA 쿼리)로 조회합니다. 그룹 수는 보통 적어 괜찮지만, 대량의 Asset을 스캔할 때는 DAS를 우선하세요.

{% code-tabs-imported from="core/fetch-groups-by-authority" frameworks="umi" /%}

## 빠른 참조

### 프로그램 ID

| 네트워크 | 주소 |
| --- | --- |
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### SDK 헬퍼

| 작업 | 함수 |
| --- | --- |
| 생성 | `createGroup` |
| 조회 | `fetchGroupV1` |
| 권한별 목록 | `getGroupV1GpaBuilder` |
| 업데이트 | `updateGroup` |
| 컬렉션 추가 | `addCollectionsToGroup` |
| 에셋 추가 | `addAssetsToGroup` |
| 중첩 | `addGroupsToGroup` |
| 닫기 | `closeGroup` |
