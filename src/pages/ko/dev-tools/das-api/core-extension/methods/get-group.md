---
title: Core 그룹 가져오기
metaTitle: Core 그룹 가져오기 | DAS API Core 확장
description: DAS를 통해 단일 mpl-core GroupV1 계정을 가져와 Core 타입의 GroupResult로 반환합니다.
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das getGroup
  - mpl-core-das getGroup
  - GroupV1
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 요약

`das.getGroup`은 공개 키로 [mpl-core GroupV1](/ko/smart-contracts/core/groups) 하나를 가져와 [`GroupResult`](/ko/smart-contracts/core/groups#groupv1-계정)를 반환합니다.

- MPL Core SDK와 함께 사용하도록 타입이 지정되어 있습니다
- 멤버십 벡터는 인덱서에 따라 비어 있을 수 있습니다
- 온체인의 정확한 `collections` / `groups` / `assets` / `parentGroups`가 필요하면 [`fetchGroupV1`](/ko/smart-contracts/core/groups)을 우선 사용하세요

## 코드 예제

`das.getGroup`은 Umi 인스턴스와 `GroupV1` 주소를 받아 Core 타입의 그룹 하나를 반환합니다.

{% code-tabs-imported from="das-api/core-extension/get-group" frameworks="umi" /%}

## 참고 사항

- 인터페이스는 `MplCoreGroup`이어야 하며, 그렇지 않으면 헬퍼가 오류를 발생시킵니다.
- 그룹의 멤버를 나열하려면 [`getAssetsByGroup`](/ko/dev-tools/das-api/core-extension/methods/get-assets-by-group)을 사용하세요.
