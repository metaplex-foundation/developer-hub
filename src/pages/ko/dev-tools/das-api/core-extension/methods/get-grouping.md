---
title: 그룹 정보 가져오기 (Core 확장)
metaTitle: 그룹 정보 가져오기 | DAS API Core 확장
description: 컬렉션 또는 mpl-core GroupV1의 그룹 이름과 인덱싱된 멤버 수를 반환합니다.
created: '07-22-2026'
updated: '11-04-2026'
keywords:
  - das getGrouping core extension
  - mpl-core-das getGrouping
  - group size
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 요약

`das.getGrouping`은 모든 멤버를 나열하지 않고 그룹 키/값 쌍의 요약 메타데이터를 반환합니다.

- `group_key`, `group_name`, `group_size`를 반환합니다
- 컬렉션에는 `groupKey: "collection"`을, [GroupV1](/ko/smart-contracts/core/groups)에는 `groupKey: "group"`을 사용합니다
- 멤버를 나열하려면 [`getAssetsByGroup`](/ko/dev-tools/das-api/core-extension/methods/get-assets-by-group)(Core) 또는 [기본 DAS 메서드](/ko/dev-tools/das-api/methods/get-assets-by-group)를 사용하세요

## 코드 예제

`das.getGrouping`은 Umi 인스턴스와 `GroupV1` 주소를 받아 멤버를 나열하지 않고 그룹 이름과 크기를 반환합니다.

{% code-tabs-imported from="das-api/core-extension/get-grouping" frameworks="umi" /%}

## 파라미터

이 헬퍼는 Umi 인스턴스와 그 뒤의 옵션 객체를 받습니다.

| 이름         | 필수 | 설명 |
| ------------ | :------: | ----------- |
| `groupKey`   |    ✅    | `"collection"` 또는 `"group"`. |
| `groupValue` |    ✅    | 컬렉션 또는 GroupV1 주소(문자열 또는 공개 키). |

## 참고 사항

- `group_size`는 인덱서가 기록한 값을 반영하며, 현재 온체인 벡터 길이와 반드시 일치하지는 않습니다.
- DAS 클라이언트 ≥ 2.1.1과 `getGrouping`을 지원하는 RPC가 필요합니다.
