---
title: Get Assets By Creator
metaTitle: Get Assets By Creator | DAS API
description: 생성자 주소가 지정된 자산 목록을 반환합니다
tableOfContents: false
---

생성자 주소가 지정된 자산 목록을 반환합니다.

{% callout %}
자산이 실제로 해당 생성자에 속하는지 확인하려면 `onlyVerified: true`로 데이터를 가져오는 것이 좋습니다.
{% /callout %}

## 매개변수

| 이름               | 필수 | 설명                                |
| ------------------ | :------: | ------------------------------------------ |
| `creatorAddress`   |    ✅    | 자산의 생성자 주소입니다.  |
| `onlyVerified`     |          | 검증된 자산만 검색할지 여부를 나타냅니다.  |
| `sortBy`           |          | 정렬 기준입니다. 이는 `{ sortBy: <값>, sortDirection: <값> }` 객체로 지정되며, 여기서 `sortBy`는 `["created", "updated", "recentAction", "id", "none"]` 중 하나이고 `sortDirection`은 `["asc", "desc"]` 중 하나입니다     |
| `limit`            |          | 검색할 최대 자산 수입니다.  |
| `page`             |          | 검색할 "페이지"의 인덱스입니다.       |
| `before`           |          | 지정된 ID 이전의 자산을 검색합니다.   |
| `after`            |          | 지정된 ID 이후의 자산을 검색합니다.    |
| `options`          |          | 표시 옵션 객체입니다. 자세한 내용은 [표시 옵션](/ko/dev-tools/das-api/display-options)을 참조하세요. |

## Playground

{% apiRenderer method="getAssetsByCreator" /%}
