---
title: Search Assets
metaTitle: Search Assets | DAS API
description: 검색 기준이 지정된 자산 목록을 반환합니다
tableOfContents: false
---

검색 기준이 지정된 자산 목록을 반환합니다.

## 매개변수

| 이름                | 필수 | 설명                                |
| ------------------- | :------: | ------------------------------------------ |
| `negate`            |          | 검색 기준을 반전할지 여부를 나타냅니다.  |
| `conditionType`     |          | 검색 기준과 일치하는 모든(`"all"`) 자산을 검색할지 아니면 일치하는 임의의(`"any"`) 자산을 검색할지 나타냅니다.  |
| `interface`         |          | 인터페이스 값입니다(`["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]` 중 하나).  |
| `ownerAddress`      |          | 소유자의 주소입니다.  |
| `ownerType`         |          | 소유권 유형입니다 `["single", "token"]`.  |
| `creatorAddress`    |          | 생성자의 주소입니다.  |
| `creatorVerified`   |          | 생성자가 검증되어야 하는지 여부를 나타냅니다.  |
| `authorityAddress`  |          | 권한의 주소입니다.  |
| `grouping`          |          | 그룹화 `["key", "value"]` 쌍입니다.  |
| `delegateAddress`   |          | 위임자의 주소입니다.  |
| `frozen`            |          | 자산이 동결되었는지 여부를 나타냅니다.  |
| `supply`            |          | 자산의 공급량입니다.  |
| `supplyMint`        |          | 공급 민트의 주소입니다.  |
| `compressed`        |          | 자산이 압축되었는지 여부를 나타냅니다.  |
| `compressible`      |          | 자산을 압축할 수 있는지 여부를 나타냅니다.  |
| `royaltyTargetType` |          | 로열티 유형입니다 `["creators", "fanout", "single"]`.  |
| `royaltyTarget`     |          | 로열티의 대상 주소입니다.  |
| `royaltyAmount`     |          | 로열티 금액입니다.  |
| `burnt`             |          | 자산이 소각되었는지 여부를 나타냅니다.  |
| `sortBy`            |          | 정렬 기준입니다. 이는 `{ sortBy: <값>, sortDirection: <값> }` 객체로 지정되며, 여기서 `sortBy`는 `["created", "updated", "recentAction", "id", "none"]` 중 하나이고 `sortDirection`은 `["asc", "desc"]` 중 하나입니다.     |
| `limit`             |          | 검색할 최대 자산 수입니다.  |
| `page`              |          | 검색할 "페이지"의 인덱스입니다.       |
| `before`            |          | 지정된 ID 이전의 자산을 검색합니다.   |
| `after`             |          | 지정된 ID 이후의 자산을 검색합니다.    |
| `jsonUri`           |          | JSON URI의 값입니다.  |
| `options`           |          | 표시 옵션 객체입니다. 자세한 내용은 [표시 옵션](/ko/dev-tools/das-api/display-options)을 참조하세요. |

## Playground

{% apiRenderer method="searchAssets" /%}
