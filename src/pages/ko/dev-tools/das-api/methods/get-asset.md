---
title: Get Asset
metaTitle: Get Asset | DAS API
description: 압축된/표준 자산의 정보를 반환합니다
tableOfContents: false
---

메타데이터 및 소유자를 포함한 압축된/표준 자산의 정보를 반환합니다.

MPL-Core 컬렉션에서 판매자 수수료를 상속하는 Bubblegum V2 cNFT의 경우, 컬렉션에서 해석된 표시 값은 `royalty.basis_points` / `creators`에 있고, 리프 값은 `royalty.basis_points_raw` / `creators_raw`에 있습니다(`royalty.sfbp_inherited: true`). [상속 로열티 읽기](/ko/smart-contracts/bubblegum-v2/reading-inherited-royalties)를 참조하세요.

## 매개변수

| 이름            | 필수 | 설명                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | 자산의 ID입니다.                       |
| `options`       |          | 표시 옵션 객체입니다. 자세한 내용은 [표시 옵션](/ko/dev-tools/das-api/display-options)을 참조하세요. |

## Playground

{% apiRenderer method="getAsset" /%}
