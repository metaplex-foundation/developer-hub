---
title: 그룹 정보 가져오기
metaTitle: 그룹 정보 가져오기 | DAS API
description: 그룹(키, 값) 쌍의 그룹 메타데이터를 반환합니다
tableOfContents: false
---

그룹(키, 값) 쌍의 그룹 메타데이터를 반환합니다. 그룹 이름과 인덱싱된 멤버 수가 포함됩니다.

Token Metadata 및 mpl-core 컬렉션에는 `groupKey: "collection"`을 사용합니다. 컬렉션, 자산, 중첩 그룹을 묶는 [mpl-core GroupV1](/ko/smart-contracts/core) 계정에는 `groupKey: "group"`을 사용합니다.

## 매개변수

| 이름         | 필수 | 설명                                                                                    |
| ------------ | :------: | ---------------------------------------------------------------------------------------------- |
| `groupKey`   |    ✅    | 그룹 키(예: `"collection"` 또는 mpl-core 그룹의 `"group"`).                |
| `groupValue` |    ✅    | 그룹 값(컬렉션 또는 mpl-core 그룹 주소 등).                           |

## 응답

응답에는 다음이 포함됩니다:

- `group_key` - 조회한 그룹 키
- `group_name` - 사용 가능한 경우 그룹 표시 이름
- `group_size` - 그룹에 인덱싱된 자산 수

## Playground

{% apiRenderer method="getGrouping" /%}
