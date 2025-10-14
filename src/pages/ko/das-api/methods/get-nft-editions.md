---
title: Get NFT Editions
metaTitle: Get NFT Editions | DAS API
description: 마스터 에디션 NFT 민트의 모든 인쇄 가능한 에디션을 가져옵니다
---

마스터 에디션 NFT 민트의 모든 인쇄 가능한 에디션을 반환합니다. 에디션 번호, 주소 및 공급 정보가 포함됩니다. 또한 에디션 주소를 전달하여 해당 마스터 에디션 및 형제 에디션을 검색할 수 있습니다.

## 매개변수

| 이름          | 필수 | 설명                                        |
| ------------- | :------: | -------------------------------------------------- |
| `mintAddress` |    ✅    | 마스터 에디션 NFT의 민트 주소입니다.       |
| `cursor`      |         | 페이지네이션을 위한 커서입니다.                             |
| `page`        |         | 페이지네이션을 위한 페이지 번호입니다.                        |
| `limit`       |         | 반환할 최대 에디션 수입니다.              |
| `before`      |         | 이 커서 이전의 에디션을 반환합니다.                |
| `after`       |         | 이 커서 이후의 에디션을 반환합니다.                 |

## 응답

응답에는 다음이 포함됩니다:

- `editions` - 다음을 포함하는 에디션 객체 배열:
  - `edition_address` - [에디션 계정](/token-metadata#printing-editions)의 주소
  - `edition_number` - 에디션 번호(1, 2, 3 등)
  - `mint_address` - 에디션의 민트 주소
- `master_edition_address` - 마스터 에디션 계정의 주소
- `supply` - 현재 발행된 에디션 수
- `max_supply` - 발행할 수 있는 최대 에디션 수(무제한의 경우 null)


## Playground

{% apiRenderer method="getNftEditions" noUmi=true /%}
