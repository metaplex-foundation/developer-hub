---
title: Get Token Accounts
metaTitle: Get Token Accounts | DAS API
description: 소유자 또는 민트별 토큰 계정 목록을 가져옵니다
tableOfContents: false
---

소유자 주소, 민트 주소 또는 둘 다로 필터링된 토큰 계정 목록을 반환합니다. 지갑과 연결된 모든 토큰 계정 또는 특정 토큰을 보유한 모든 계정을 찾는 데 유용합니다.

`ownerAddress` 또는 `mintAddress` 중 하나 이상이 필요합니다.

## 매개변수

| 이름           | 필수 | 설명                                          |
| -------------- | :------: | ---------------------------------------------------- |
| `ownerAddress` |    (`mintAddress`가 제공되지 않은 경우에만 필수)    | 소유자 주소로 필터링합니다.                             |
| `mintAddress`  |    (`ownerAddress`가 제공되지 않은 경우에만 필수)    | 민트 주소로 필터링합니다.                              |
| `cursor`       |         | 페이지네이션을 위한 커서입니다.                               |
| `page`         |         | 페이지네이션을 위한 페이지 번호입니다.                          |
| `limit`        |         | 반환할 최대 토큰 계정 수입니다.          |
| `before`       |         | 이 커서 이전의 계정을 반환합니다.                  |
| `after`        |         | 이 커서 이후의 계정을 반환합니다.                   |
| `options`      |         | 쿼리 표시 옵션입니다. `displayOptions`로도 허용됩니다. |
| `options.showZeroBalance` | | 잔액이 0인 계정을 결과에 포함할지 여부입니다. |
| `options.showFungible` | | API에서 허용되지만 이 메서드에서는 향후 사용을 위해 예약되어 있습니다. |
| `options.showCollectionMetadata` | | API에서 허용되지만 이 메서드에서는 향후 사용을 위해 예약되어 있습니다. |
| `options.showUnverifiedCollections` | | API에서 허용되지만 이 메서드에서는 향후 사용을 위해 예약되어 있습니다. |
| `options.showInscription` | | API에서 허용되지만 이 메서드에서는 향후 사용을 위해 예약되어 있습니다. |

## 응답

응답에는 다음이 포함됩니다:

- `token_accounts` - 다음을 포함하는 토큰 계정 객체 배열:
  - `address` - 토큰 계정 주소
  - `amount` - 계정의 토큰 잔액
  - `mint` - 토큰의 민트 주소
  - `owner` - 계정의 소유자 주소
  - `delegate` - 위임자 주소(있는 경우)
  - `delegated_amount` - 위임자에게 위임된 금액
  - `frozen` - 계정이 동결되었는지 여부
  - `close_authority` - 종료 권한 주소(있는 경우)
  - `extensions` - 토큰 확장 데이터
- `errors` - 처리 중 발생한 오류 배열
- `total` - 현재 페이지에서 반환된 토큰 계정 수
- 페이지네이션 필드: `cursor`, `page`, `limit`, `before`, `after`

일치하는 계정이 없는 소유자 또는 민트의 경우 오류 대신 빈 `token_accounts` 배열이 반환됩니다.

## Playground

{% apiRenderer method="getTokenAccounts" /%}
