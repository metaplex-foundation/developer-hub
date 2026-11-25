---
title: Core 그룹 검색
metaTitle: Core 그룹 검색 | DAS API Core 확장
description: DAS를 통해 mpl-core GroupV1 계정을 검색하고 Core 타입의 GroupResult 값을 반환합니다.
created: '07-22-2026'
updated: '11-04-2026'
keywords:
  - das searchGroups
  - mpl-core-das searchGroups
  - GroupV1 search
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 요약

`das.searchGroups`는 DAS에서 [`MplCoreGroup`](/ko/smart-contracts/core/groups) 인터페이스를 검색하고 `GroupResult` 값을 반환합니다.

- Core 그룹만 필터링합니다
- 해당되는 경우 Core 자산 검색과 동일한 검색 필터(예: authority)를 허용합니다
- 주소로 단일 그룹을 가져오려면 [`getGroup`](/ko/dev-tools/das-api/core-extension/methods/get-group)을 우선 사용하세요
- 업데이트 권한별로 나열하려면 [`getGroupsByUpdateAuthority`](#by-update-authority)를 사용하세요

## 코드 예제

`das.searchGroups`는 Umi 인스턴스와 필터 객체를 받아 일치하는 Core 타입의 그룹을 반환합니다.

{% code-tabs-imported from="das-api/core-extension/search-groups" frameworks="umi" /%}

## 업데이트 권한별 {% #by-update-authority %}

`das.getGroupsByUpdateAuthority`는 지정된 업데이트 권한의 Core 그룹을 나열하고 `GroupResult` 값을 반환합니다. [`getAssetsByGroup`](/ko/dev-tools/das-api/core-extension/methods/get-assets-by-group)과 함께 사용하면 각 그룹의 멤버를 나열할 수 있습니다.

{% code-tabs-imported from="das-api/core-extension/get-groups-by-update-authority" frameworks="umi" /%}

## 참고 사항

- `MplCoreGroup` 인덱싱을 지원하는 DAS 클라이언트 ≥ 2.1.1이 필요합니다.
- 결과의 멤버십 벡터는 비어 있을 수 있습니다. 전체 온체인 멤버십은 [`fetchGroupV1`](/ko/smart-contracts/core/groups)을 사용하세요.
