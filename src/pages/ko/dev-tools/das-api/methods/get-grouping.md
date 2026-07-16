---
title: 그룹 정보 가져오기
metaTitle: 그룹 정보 가져오기 | DAS API
description: 그룹(키, 값) 쌍의 그룹 메타데이터를 반환합니다. 그룹 이름과 인덱싱된 멤버 수가 포함됩니다.
created: '07-02-2026'
updated: '07-06-2026'
keywords:
  - das api getGrouping
  - get grouping metadata
  - group key group value
  - mpl-core groups
  - collection metadata
about:
  - DAS API
  - Group metadata
  - mpl-core GroupV1
proficiencyLevel: Beginner
tableOfContents: false
---

## 요약

`getGrouping` DAS API 메서드는 모든 멤버를 나열하지 않고 그룹(키, 값) 쌍의 메타데이터를 반환합니다.

- 조회한 그룹의 `group_key`, `group_name`, `group_size`를 반환합니다
- Token Metadata 및 mpl-core 컬렉션에는 `groupKey: "collection"`을 사용합니다
- 컬렉션, 자산, 중첩 그룹을 묶는 [mpl-core GroupV1](/ko/smart-contracts/core) 계정에는 `groupKey: "group"`을 사용합니다
- 개별 멤버를 나열하려면 [`getAssetsByGroup`](/ko/dev-tools/das-api/methods/get-assets-by-group)을 사용하세요

## 매개변수

| 이름         | 필수 | 설명                                                                                    |
| ------------ | :------: | ---------------------------------------------------------------------------------------------- |
| `groupKey`   |    ✅    | 그룹 키(예: `"collection"` 또는 mpl-core 그룹의 `"group"`).                |
| `groupValue` |    ✅    | 그룹 값(컬렉션 또는 mpl-core 그룹 주소 등).                           |

## 응답

응답에는 다음이 포함됩니다:

- `group_key` - 조회한 그룹 키
- `group_name` - 사용 가능한 경우 그룹 표시 이름
- `group_size` - 그룹에 인덱싱된 멤버 수

## Playground

{% apiRenderer method="getGrouping" /%}

## Notes

- `getGrouping`은 요약 메타데이터만 반환합니다 — 그룹 멤버를 페이지네이션하려면 [`getAssetsByGroup`](/ko/dev-tools/das-api/methods/get-assets-by-group)을 사용하세요
- `group_size`는 지정한 `groupKey`/`groupValue` 쌍에 대해 DAS가 인덱싱한 멤버 수를 나타냅니다
- mpl-core GroupV1 그룹의 경우 인덱서가 기록한 내용에 따라 컬렉션, 에셋, 중첩 그룹이 멤버로 포함될 수 있습니다
