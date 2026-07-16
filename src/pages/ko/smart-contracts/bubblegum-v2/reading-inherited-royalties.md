---
title: 상속 로열티 읽기
metaTitle: 상속 로열티 읽기 - Bubblegum V2 - Metaplex
description: 지갑, 마켓플레이스, 인덱서 및 기타 클라이언트가 MPL-Core 컬렉션에서 판매자 수수료를 상속하는 Bubblegum V2 cNFT에 대해 DAS getAsset 응답을 읽는 방법입니다.
created: '07-16-2026'
updated: '07-16-2026'
keywords:
  - inherited royalties
  - seller fee basis points
  - DAS API
  - getAsset
  - basis_points_inherited
  - creators_inherited
  - Bubblegum V2
about:
  - Compressed NFTs
  - DAS API
  - Royalties
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: royalty.basis_points가 65535로 표시되는 이유는 무엇인가요?
    a: 온체인 상속 센티널입니다. 사용자에게 보여줄 컬렉션 비율에는 royalty.basis_points_inherited를 사용하세요.
  - q: 상속된 cNFT에서 creators가 비어 있는 이유는 무엇인가요?
    a: SFBP가 상속될 때 리프 creators는 비어 있어야 합니다. 컬렉션 로열티 수취인은 creators_inherited를 사용하세요.
  - q: 상속하지 않는 cNFT에 대해 변경이 필요한가요?
    a: 아니요. 상속을 사용하지 않으면 *_inherited 필드는 생략되며 주요 royalty 및 creators 필드는 이전과 동일하게 동작합니다.
---

## 요약

Bubblegum V2는 리프에 **상속 센티널**(`65535`)로 판매자 수수료를 저장하고, MPL-Core 컬렉션의 Royalties 플러그인에서 실효 비율을 해석할 수 있습니다. DAS는 해시용으로 주 필드에 리프 값을 유지하고, 표시용으로 `*_inherited` 필드를 추가합니다.

- **리프 필드**는 증명, 해싱, 쓰기 명령에 사용
- **`*_inherited` 필드**는 로열티 UI 및 지급 표시에 사용
- 상속하지 않는 자산은 변경되지 않음 — `*_inherited`는 생략됨

이 페이지는 `getAsset` / DAS 응답을 **읽는** 모든 클라이언트(지갑, 마켓플레이스, 인덱서, 분석 도구, 앱)를 위한 것입니다. 상속 로열티 cNFT를 민팅하거나 업데이트하려면 [민팅](/ko/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection) 및 [업데이트](/ko/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)를 참조하세요.

## 적용 시점

다음 조건을 만족하면 cNFT가 상속 로열티를 사용합니다:

- `Royalties` 플러그인이 있는 MPL-Core 컬렉션의 Bubblegum V2 자산이고,
- 리프 판매자 수수료가 상속 센티널 `65535`(`0xffff`)인 경우

DAS는 컬렉션 로열티를 해석할 수 있을 때 `royalty.basis_points`를 `65535`로 설정하고 상속 필드를 채웁니다.

## 필드 맵

| 사용 사례 | 필드 |
|-----------|------|
| 해싱, 머클 증명, 쓰기 명령 | `royalty.basis_points`, `royalty.percent`, `creators` |
| 표시 비율 / 로열티 UI | `royalty.basis_points_inherited`, `royalty.percent_inherited` |
| 수취인 표시 / 지급 분할 | `creators_inherited` |

### 리프 (정규 / 해싱)

```json
"royalty": {
  "royalty_model": "creators",
  "target": null,
  "percent": 6.5535,
  "basis_points": 65535,
  "basis_points_inherited": 750,
  "percent_inherited": 0.075,
  "primary_sale_happened": false,
  "locked": false
},
"creators": [],
"creators_inherited": [
  {
    "address": "CJkzXwVwqiaSvMuRb3obrZHdrPFjCMBJBDrjspn72tDv",
    "share": 100,
    "verified": true
  }
]
```

- `basis_points: 65535`는 **655.35% 로열티가 아닙니다** — 리프 데이터 해시에 사용되는 온체인 센티널입니다.
- 상속된 SFBP에서는 `creators: []`가 정상입니다. 상속 필드가 있을 때 빈 creators 배열을 “로열티 수취인 없음”으로 취급하지 마세요.

### 표시 (컬렉션에서 해석)

| 필드 | 예시 | 의미 |
|------|------|------|
| `royalty.basis_points_inherited` | `750` | basis points 단위의 컬렉션 비율 (7.5%) |
| `royalty.percent_inherited` | `0.075` | 동일 비율의 소수 형태 |
| `creators_inherited` | `[{ address, share, verified }]` | 컬렉션 Royalties 플러그인 creators |

컬렉션을 해석할 수 없으면 `basis_points`가 `65535`로 유지된 채 `*_inherited`가 생략될 수 있습니다.

## 감지 및 표시 헬퍼

```ts
const INHERIT = 0xffff // 65535

function isInheritedRoyalty(royalty: {
  basis_points: number
  basis_points_inherited?: number | null
}): boolean {
  return (
    royalty.basis_points === INHERIT ||
    royalty.basis_points_inherited != null
  )
}

function displayBasisPoints(royalty: {
  basis_points: number
  basis_points_inherited?: number | null
}): number {
  return royalty.basis_points_inherited ?? royalty.basis_points
}

function displayCreators(asset: {
  creators: Array<{ address: string; share: number; verified: boolean }>
  creators_inherited?: Array<{
    address: string
    share: number
    verified: boolean
  }> | null
}) {
  return asset.creators_inherited ?? asset.creators
}
```

`@metaplex-foundation/digital-asset-standard-api` 사용:

```ts
import {
  SELLER_FEE_BASIS_POINTS_INHERIT,
  isInheritedSfbpRoyalty,
  getResolvedSellerFeeBasisPoints,
} from '@metaplex-foundation/digital-asset-standard-api'

const royalty = asset.royalty
if (isInheritedSfbpRoyalty(royalty)) {
  const rate = getResolvedSellerFeeBasisPoints(royalty) // e.g. 750
  const payees = asset.creators_inherited ?? asset.creators
}
```

## 하지 말아야 할 것

- 사용자에게 보이는 로열티 비율로 `65535` 또는 `6.5535%`를 **표시하지 마세요**.
- 상속이 사용 중일 때 빈 `creators`를 로열티 수취인 없음으로 **가정하지 마세요**.
- 리프 해시를 다시 계산하거나 Bubblegum 쓰기 명령을 구성할 때 `basis_points_inherited` 또는 `creators_inherited`를 **사용하지 마세요** — 리프 `basis_points`와 리프 `creators`가 필요합니다.

## Bubblegum SDK 참고

`getAssetWithProof`는 쓰기 명령이 올바르게 해시되도록 DAS의 **리프** 필드에서 `metadata`를 구성합니다. `getAssetWithProof` 이후 UI 비율이 필요하면 `rpcAsset.royalty.basis_points_inherited`와 `rpcAsset.creators_inherited`를 읽으세요. [JavaScript SDK](/ko/smart-contracts/bubblegum-v2/sdk/javascript#getassetwithproof-and-inherited-royalties)를 참조하세요.

## 관련 문서

- [압축 NFT 가져오기](/ko/smart-contracts/bubblegum-v2/fetch-cnfts)
- [민팅 — 로열티 상속](/ko/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)
- [cNFT 업데이트 — 상속 로열티](/ko/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)
- [NFT 데이터 해싱](/ko/smart-contracts/bubblegum-v2/hashed-nft-data)
- [DAS getAsset](/ko/dev-tools/das-api/methods/get-asset)
- [FAQ — 상속 로열티](/ko/smart-contracts/bubblegum-v2/faq#inherited-royalties)
