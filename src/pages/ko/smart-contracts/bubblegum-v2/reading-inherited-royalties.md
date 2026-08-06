---
title: 상속 로열티 읽기
metaTitle: 상속 로열티 읽기 - Bubblegum V2 - Metaplex
description: 지갑, 마켓플레이스, 인덱서 및 기타 클라이언트가 MPL-Core 컬렉션에서 판매자 수수료를 상속하는 Bubblegum V2 cNFT에 대해 DAS getAsset 응답을 읽는 방법입니다.
created: '07-16-2026'
updated: '08-06-2026'
keywords:
  - inherited royalties
  - seller fee basis points
  - DAS API
  - getAsset
  - basis_points_raw
  - creators_raw
  - sfbp_inherited
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
  - q: royalty.basis_points_raw가 65535로 표시되는 이유는 무엇인가요?
    a: 리프 해싱에 사용되는 온체인 상속 센티널입니다. royalty.basis_points에는 이미 표시용 컬렉션 비율이 들어 있습니다.
  - q: 상속된 cNFT에서 creators_raw가 비어 있는 이유는 무엇인가요?
    a: SFBP가 상속될 때 리프 creators는 비어 있어야 합니다. 컬렉션 로열티 수취인은 creators를 사용하세요.
  - q: 상속하지 않는 cNFT에 대해 변경이 필요한가요?
    a: 아니요. 상속을 사용하지 않으면 _raw 필드와 sfbp_inherited는 생략되며 주요 royalty 및 creators 필드는 이전과 동일하게 동작합니다.
---

## 요약

Bubblegum V2는 리프에 **상속 센티널**(`65535`)로 판매자 수수료를 저장하고, MPL-Core 컬렉션의 Royalties 플러그인에서 실효 비율을 해석할 수 있습니다. DAS는 **컬렉션에서 해석된 값을 주 필드에 두고**(표시용), 리프 값은 `_raw` 필드에 노출합니다(해싱용).

- **주 필드**(`royalty.basis_points`, `creators`)는 로열티 UI 및 지급 표시에 사용
- **`_raw` 필드**(`royalty.basis_points_raw`, `creators_raw`)는 증명, 해싱, 쓰기 명령에 사용
- 상속하지 않는 자산은 변경되지 않음 — `_raw` / `sfbp_inherited`는 생략됨

이 페이지는 `getAsset` / DAS 응답을 **읽는** 모든 클라이언트(지갑, 마켓플레이스, 인덱서, 분석 도구, 앱)를 위한 것입니다. 상속 로열티 cNFT를 민팅하거나 업데이트하려면 [민팅](/ko/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection) 및 [업데이트](/ko/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)를 참조하세요.

## 적용 시점

다음 조건을 만족하면 cNFT가 상속 로열티를 사용 중입니다.

- `Royalties` 플러그인이 있는 MPL-Core 컬렉션의 Bubblegum V2 자산이고
- 리프 판매자 수수료가 상속 센티널 `65535`(`0xffff`)인 경우

컬렉션 로열티를 주 필드에 해석할 수 있을 때 DAS는 `royalty.sfbp_inherited: true`와 `royalty.basis_points_raw: 65535`로 이를 표시합니다.

## 필드 맵

| 용도 | 필드 |
|------|------|
| 표시 비율 / 로열티 UI | `royalty.basis_points`, `royalty.percent` |
| 수취인 표시 / 지급 분할 | `creators` |
| 해싱, 머클 증명, 쓰기 명령 | `royalty.basis_points_raw`, `creators_raw` |
| 상속 모드 감지 | `royalty.sfbp_inherited` (또는 `basis_points_raw === 65535`) |

### 예시 DAS 응답 (상속)

```json
"royalty": {
  "royalty_model": "creators",
  "target": null,
  "percent": 0.075,
  "basis_points": 750,
  "basis_points_raw": 65535,
  "sfbp_inherited": true,
  "primary_sale_happened": false,
  "locked": false
},
"creators": [
  {
    "address": "CJkzXwVwqiaSvMuRb3obrZHdrPFjCMBJBDrjspn72tDv",
    "share": 100,
    "verified": true
  }
],
"creators_raw": []
```

- `basis_points: 750`은 사용자에게 보여줄 컬렉션 비율(7.5%)입니다.
- `basis_points_raw: 65535`는 리프 데이터 해시에 사용되는 온체인 센티널이며 — **655.35% 로열티가 아닙니다**.
- `creators`는 컬렉션 Royalties 플러그인 수취인이고, `creators_raw: []`는 해싱용 리프 creators 배열입니다.

컬렉션을 해석할 수 없으면 `basis_points`가 폴백될 수 있지만 `basis_points_raw`는 `65535`로 유지됩니다.

## 감지 및 표시 헬퍼

```ts
const INHERIT = 0xffff // 65535

function isInheritedRoyalty(royalty: {
  basis_points: number
  basis_points_raw?: number | null
  sfbp_inherited?: boolean | null
}): boolean {
  return (
    royalty.sfbp_inherited === true ||
    royalty.basis_points_raw === INHERIT
  )
}

function leafBasisPoints(royalty: {
  basis_points: number
  basis_points_raw?: number | null
  sfbp_inherited?: boolean | null
}): number {
  if (royalty.basis_points_raw != null) return royalty.basis_points_raw
  if (royalty.sfbp_inherited) return INHERIT
  return royalty.basis_points
}

function leafCreators(asset: {
  creators: Array<{ address: string; share: number; verified: boolean }>
  creators_raw?: Array<{
    address: string
    share: number
    verified: boolean
  }> | null
}) {
  return asset.creators_raw ?? asset.creators
}
```

`@metaplex-foundation/digital-asset-standard-api` 사용:

```ts
import {
  SELLER_FEE_BASIS_POINTS_INHERIT,
  isInheritedSfbpRoyalty,
  getRawSellerFeeBasisPoints,
  getResolvedSellerFeeBasisPoints,
} from '@metaplex-foundation/digital-asset-standard-api'

const royalty = asset.royalty
if (isInheritedSfbpRoyalty(royalty)) {
  const rate = getResolvedSellerFeeBasisPoints(royalty) // e.g. 750 (display)
  const leaf = getRawSellerFeeBasisPoints(royalty) // 65535
  const payees = asset.creators // collection payees
  const leafCreators = asset.creators_raw ?? []
}
```

## 하지 말아야 할 것

- `65535` 또는 `6.5535%`를 사용자용 로열티 비율로 **표시하지 마세요** — 그 값은 `basis_points_raw`에 있습니다.
- 빈 `creators_raw`가 로열티 수취인이 없음을 의미한다고 **가정하지 마세요**; 표시용 수취인은 `creators`에 있습니다.
- 리프 해시를 다시 계산하거나 Bubblegum 쓰기 명령을 구성할 때 주 필드의 `basis_points` / `creators`를 **사용하지 마세요** — `basis_points_raw`와 `creators_raw`를 사용하세요.

## Bubblegum SDK 참고

`getAssetWithProof`는 쓰기 명령이 올바르게 해시되도록 DAS의 **리프** 필드(`basis_points_raw`, `creators_raw`)에서 `metadata`를 구성합니다. `getAssetWithProof` 이후 UI 비율이 필요하면 `rpcAsset.royalty.basis_points`와 `rpcAsset.creators`를 읽으세요. [JavaScript SDK](/ko/smart-contracts/bubblegum-v2/sdk/javascript#getassetwithproof-and-inherited-royalties)를 참조하세요.

## 관련

- [압축 NFT 가져오기](/ko/smart-contracts/bubblegum-v2/fetch-cnfts)
- [민팅 — 로열티 상속](/ko/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)
- [cNFT 업데이트 — 상속 로열티](/ko/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)
- [NFT 데이터 해싱](/ko/smart-contracts/bubblegum-v2/hashed-nft-data)
- [DAS getAsset](/ko/dev-tools/das-api/methods/get-asset)
- [FAQ — 상속 로열티](/ko/smart-contracts/bubblegum-v2/faq#inherited-royalties)
