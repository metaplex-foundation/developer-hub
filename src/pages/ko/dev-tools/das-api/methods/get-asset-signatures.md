---
title: Get Asset Signatures
metaTitle: Get Asset Signatures | DAS API
description: 압축된 자산에 대한 트랜잭션 서명을 반환합니다
tableOfContents: false
---

압축된 자산과 관련된 트랜잭션 서명을 반환합니다. ID 또는 트리 및 리프 인덱스로 자산을 식별할 수 있습니다.

## 매개변수

| 이름            | 필수 | 설명                                |
| --------------- | :------: | ------------------------------------------ |
| `assetId`       |    ✅ (또는 tree + leafIndex)   | 자산의 ID입니다.                       |
| `tree`          |    ✅ (또는 assetId)    | 리프에 해당하는 트리입니다.        |
| `leafIndex`     |    ✅ (또는 assetId)    | 자산의 리프 인덱스입니다.               |
| `limit`         |          | 검색할 최대 서명 수입니다. |
| `page`          |          | 검색할 "페이지"의 인덱스입니다.        |
| `before`        |          | 지정된 서명 이전의 서명을 검색합니다. |
| `after`         |          | 지정된 서명 이후의 서명을 검색합니다. |
| `cursor`        |          | 서명의 커서입니다.               |
| `sortDirection` |          | 정렬 방향입니다. "asc" 또는 "desc"일 수 있습니다. |

## Playground

{% apiRenderer method="getAssetSignatures" /%}
