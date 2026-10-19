---
title: 상속 로열티 읽기
metaTitle: 상속 로열티 읽기 - Bubblegum V2 - Metaplex
description: 지갑, 마켓플레이스, 인덱서 및 기타 클라이언트가 MPL-Core 컬렉션에서 판매자 수수료를 상속하는 Bubblegum V2 cNFT에 대해 DAS getAsset 응답을 읽는 방법입니다.
created: '07-16-2026'
updated: '10-01-2026'
keywords:
  - inherited royalties
  - seller fee basis points
  - DAS API
  - getAsset
  - basis_points_raw
  - creators_raw
  - inherited
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
  - q: 지갑이나 마켓플레이스에서 내 cNFT의 로열티가 655.35%로 표시되는 이유는 무엇인가요?
    a: 앱의 DAS 제공자가 아직 상속 로열티를 지원하지 않기 때문입니다. 컬렉션 비율 대신 royalty.basis_points에 리프 상속 센티널 65535(655.35%)를, creators는 빈 배열로 반환합니다. 온체인 로열티에는 문제가 없으며, 앱이 업그레이드된 DAS 제공자를 사용하거나 컬렉션 Royalties 플러그인을 읽어야 합니다.
  - q: 상속하지 않는 cNFT에 대해 변경이 필요한가요?
    a: 아니요. 상속을 사용하지 않으면 _raw 필드와 inherited는 생략되며 주요 royalty 및 creators 필드는 이전과 동일하게 동작합니다.
---

## 요약

Bubblegum V2는 리프에 **상속 센티널**(`65535`)로 판매자 수수료를 저장하고, MPL-Core 컬렉션의 Royalties 플러그인에서 실효 비율을 해석할 수 있습니다. DAS는 **컬렉션에서 해석된 값을 주 필드에 두고**(표시용), 리프 값은 `_raw` 필드에 노출합니다(해싱용).

- **주 필드**(`royalty.basis_points`, `creators`)는 로열티 UI 및 지급 표시에 사용
- **`_raw` 필드**(`royalty.basis_points_raw`, `creators_raw`)는 증명, 해싱, 쓰기 명령에 사용
- 상속하지 않는 자산은 변경되지 않음 — `_raw` / `inherited`는 생략됨
- 상속 로열티를 지원하지 않는 DAS 제공자는 대신 원시 센티널을 반환하며, 앱은 이를 크리에이터 없는 **655.35%** 로열티로 표시함

이 페이지는 `getAsset` / DAS 응답을 **읽는** 모든 클라이언트(지갑, 마켓플레이스, 인덱서, 분석 도구, 앱)를 위한 것입니다. 상속 로열티 cNFT를 민팅하거나 업데이트하려면 [민팅](/ko/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection) 및 [업데이트](/ko/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)를 참조하세요.

## 적용 시점

다음 조건을 만족하면 cNFT가 상속 로열티를 사용 중입니다.

- `Royalties` 플러그인이 있는 MPL-Core 컬렉션의 Bubblegum V2 자산이고
- 리프 판매자 수수료가 상속 센티널 `65535`(`0xffff`)인 경우

컬렉션 로열티를 주 필드에 해석할 수 있을 때 DAS는 `royalty.inherited: true`와 `royalty.basis_points_raw: 65535`로 이를 표시합니다.

## 필드 맵

표시용 값과 리프 값은 서로 다른 DAS 필드에 있으며, 쓰기에는 리프 값을 사용해야 합니다.

| 용도 | 필드 |
|------|------|
| 표시 비율 / 로열티 UI | `royalty.basis_points`, `royalty.percent` |
| 수취인 표시 / 지급 분할 | `creators` |
| 해싱, 머클 증명, 쓰기 명령 | `royalty.basis_points_raw`, `creators_raw` |
| 상속 모드 감지 | `royalty.inherited` (또는 `basis_points_raw === 65535`) |

### 예시 DAS 응답 (상속)

상속된 자산은 `basis_points`에 컬렉션의 확정 요율을, `basis_points_raw`에 `65535` 센티넬을 반환합니다.

```json
"royalty": {
  "royalty_model": "creators",
  "target": null,
  "percent": 0.075,
  "basis_points": 750,
  "basis_points_raw": 65535,
  "inherited": true,
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

## 상속 로열티를 지원하지 않는 DAS 제공자의 응답 {% #unsupported-das %}

아직 상속 로열티를 지원하지 않는 DAS 제공자는 리프 데이터를 그대로 반환하므로, 상속된 cNFT가 **크리에이터 없이** **655.35% 로열티**로 표시됩니다(UI에서는 흔히 "650%" 또는 "655%"로 반올림됨). 온체인 자산은 올바르며, 인덱서 응답에 컬렉션 해석이 빠져 있을 뿐입니다.

위 예시의 동일한 상속 자산은 지원하지 않는 제공자에서 다음과 같이 보입니다.

```json
"royalty": {
  "royalty_model": "creators",
  "target": null,
  "percent": 6.5535,
  "basis_points": 65535,
  "primary_sale_happened": false,
  "locked": false
},
"creators": []
```

| 필드 | 지원 DAS | 미지원 DAS | 미지원 DAS에서 사용자에게 보이는 것 |
|------|----------|------------|-------------------------------------|
| `royalty.basis_points` | `750` (컬렉션 비율) | `65535` (리프 센티널) | 655.35% 로열티 |
| `royalty.percent` | `0.075` | `6.5535` | 655.35% 로열티 |
| `creators` | 컬렉션 Royalties 플러그인 수취인 | `[]` | 로열티 수취인 없음 |
| `royalty.basis_points_raw` / `creators_raw` / `royalty.inherited` | 있음 | 생략됨 | — |

{% callout type="warning" title="655.35%는 실제 로열티가 아니라 상속 센티널입니다" %}
지갑, 마켓플레이스 또는 익스플로러가 Bubblegum V2 cNFT의 로열티를 약 650%로 표시한다면, 해당 DAS 제공자가 아직 상속 로열티를 지원하지 않는 것입니다. 자산이나 컬렉션에는 아무 문제가 없습니다. 이 값은 `SELLER_FEE_BASIS_POINTS_INHERIT` 센티널인 `65535` basis points를 비율인 것처럼 읽은 것입니다.
{% /callout %}

클라이언트는 지원하지 않는 제공자를 세 가지 방법으로 처리할 수 있습니다.

- `basis_points_raw` 없이 `royalty.basis_points === 65535`인 경우를 상속으로 취급합니다 — 아래 `isInheritedRoyalty` 헬퍼가 이렇게 동작합니다.
- DAS 대신 MPL-Core 컬렉션의 [Royalties 플러그인](/ko/smart-contracts/core/plugins/royalties)에서 실효 비율과 수취인을 읽습니다. 컬렉션 주소는 자산의 `grouping`에서 `group_key: "collection"` 항목에 있습니다.
- 상속 로열티를 지원하는 DAS 제공자로 전환합니다. [RPC 및 DAS](/ko/solana/rpcs-and-das)를 참조하세요.

## 감지 및 표시 헬퍼

아래 세 헬퍼는 상속 로열티에서 동작이 달라지는 작업, 즉 상속 감지, 쓰기용 리프 값 복원, 올바른 크리에이터 목록 선택을 다룹니다.

```ts
const INHERIT = 0xffff // 65535

function isInheritedRoyalty(royalty: {
  basis_points: number
  basis_points_raw?: number | null
  inherited?: boolean | null
}): boolean {
  if (royalty.inherited === true) return true
  if (royalty.basis_points_raw != null) {
    return royalty.basis_points_raw === INHERIT
  }
  // Older DAS versions return neither field and surface the sentinel
  // directly in basis_points. Without this, 65535 reads as a 655.35% fee.
  return royalty.basis_points === INHERIT
}

function leafBasisPoints(royalty: {
  basis_points: number
  basis_points_raw?: number | null
  inherited?: boolean | null
}): number {
  if (royalty.basis_points_raw != null) return royalty.basis_points_raw
  if (royalty.inherited) return INHERIT
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

통합 과정의 버그는 대부분 리프 값을 사용자에게 표시하거나, 표시용 값을 쓰기에 해싱하면서 발생합니다.

- `65535` basis points(655.35%)를 사용자용 로열티 비율로 **표시하지 마세요** — 지원 DAS에서는 그 값이 `basis_points_raw`에 있으며, [미지원 DAS](#unsupported-das)에서는 비율을 컬렉션에서 해석해야 한다는 의미입니다.
- 빈 `creators_raw`가 로열티 수취인이 없음을 의미한다고 **가정하지 마세요**; 표시용 수취인은 `creators`에 있습니다.
- 리프 해시를 다시 계산하거나 Bubblegum 쓰기 명령을 구성할 때 주 필드의 `basis_points` / `creators`를 **사용하지 마세요** — `basis_points_raw`와 `creators_raw`를 사용하세요.

{% callout type="warning" title="미지원 DAS를 사용하는 마켓플레이스의 로열티 지급" %}
상속 로열티에는 컬렉션 비율을 주 필드로 해석하는 DAS 인덱서가 필요합니다. [미지원 DAS 제공자](#unsupported-das)에서는 `getAsset`가 리프를 그대로 반환합니다: `royalty.basis_points: 65535`(655.35%), `creators: []`, 그리고 `basis_points_raw` / `inherited` / `creators_raw` 없음.

이러한 DAS 자산 필드만으로 정산을 하는 마켓플레이스는 자산을 **로열티 수취인 없음**(또는 잘못된 비율)으로 보고 **크리에이터에게 아무 것도 지급하지 않을** 수 있습니다. 다음을 우선하세요:

- `inherited` / `_raw`와 컬렉션에서 해석된 `creators` / `basis_points`를 반환하는 업그레이드된 DAS, 또는
- 정산을 위해 MPL-Core 컬렉션 **Royalties** 플러그인을 직접 읽기

로열티 *강제*(누가 전송할 수 있는지)는 별개입니다: 컬렉션 Royalties 플러그인 `ruleSet`(`ProgramAllowList` / `ProgramDenyList`)를 구성하세요. Bubblegum은 전송 시 로열티 지급을 에스크로하지 않습니다.
{% /callout %}

## Bubblegum SDK 참고

`getAssetWithProof`는 **읽기 호환**을 유지합니다: `metadata`는 DAS 주 필드를 미러링합니다(상속 시 해석된 컬렉션 비율). `currentMetadata`는 쓰기용 리프 정규 값입니다. 선택적 형제 필드 `sellerFeeBasisPointsRaw` / `creatorsRaw`와 `inherited`는 DAS `_raw` / 상속 감지를 미러링합니다. 쓰기 시 `...assetWithProof`를 전개하고 리프 인자에는 `currentMetadata`를 사용하세요. 표시용 `metadata`는 전달하지 마세요. [JavaScript SDK](/ko/smart-contracts/bubblegum-v2/sdk/javascript#getassetwithproof-and-inherited-royalties)를 참조하세요.

## 참고사항

- DAS 지원 범위는 제공자마다 다릅니다. 업그레이드된 인덱서는 `basis_points_raw`, `creators_raw`, `inherited`를 반환하지만, 이전 버전은 셋 다 생략하고 `65535` 센티넬을 `basis_points`에 직접 실어 보냅니다. 이 필드들은 선택적인 것으로 취급하고 센티넬로 폴백하세요.
- 상속은 읽기 시점에 MPL-Core 컬렉션의 Royalties 플러그인에서 확정됩니다. 컬렉션 요율을 바꾸면 리프를 전혀 건드리지 않고도 상속 중인 모든 자산에 대해 DAS가 보고하는 값이 바뀝니다.
- 로열티 *집행*과 로열티 *지급*은 별개입니다. 어떤 프로그램이 전송할 수 있는지는 컬렉션의 `ruleSet`(`ProgramAllowList` / `ProgramDenyList`)이 결정하며, Bubblegum은 전송 시 로열티 지급을 에스크로하지 않습니다.
- 이 페이지는 Bubblegum V2(MPL-Bubblegum)에 적용됩니다. V1 트리에는 컬렉션 수준의 로열티 상속이 없습니다.
- 이 페이지의 DAS 필드(`basis_points_raw`, `creators_raw`, `inherited`)에는 `@metaplex-foundation/digital-asset-standard-api` **2.1.0 이상**이 필요합니다. `getAssetWithProof`의 `currentMetadata`는 `@metaplex-foundation/mpl-bubblegum` **5.1.0**에서 사용할 수 있지만, `sellerFeeBasisPointsRaw`, `creatorsRaw`, `inherited` 필드는 아직 게시되지 않았습니다. [mpl-bubblegum#173](https://github.com/metaplex-foundation/mpl-bubblegum/pull/173)에서 추가되며, 그때까지는 `rpcAsset`에서 읽으세요.

## 자주 묻는 질문

### `royalty.basis_points_raw`가 65535로 표시되는 이유는 무엇인가요?

리프 해싱에 사용되는 온체인 상속 센티널입니다. `royalty.basis_points`에는 이미 표시용 컬렉션 비율이 들어 있습니다.

### 상속된 cNFT에서 `creators_raw`가 비어 있는 이유는 무엇인가요?

SFBP가 상속될 때 리프 `creators`는 비어 있어야 합니다. 컬렉션 로열티 수취인은 `creators`를 사용하세요.

### 지갑이나 마켓플레이스에서 내 cNFT의 로열티가 655.35%로 표시되는 이유는 무엇인가요?

앱의 DAS 제공자가 아직 상속 로열티를 지원하지 않기 때문입니다. 컬렉션 비율 대신 `royalty.basis_points`에 리프 상속 센티널 `65535`(655.35%)를, `creators`는 빈 배열로 반환합니다. 온체인 로열티에는 문제가 없으며, 앱이 업그레이드된 DAS 제공자를 사용하거나 컬렉션 Royalties 플러그인을 읽어야 합니다. [상속 로열티를 지원하지 않는 DAS 제공자의 응답](#unsupported-das)을 참조하세요.

### 상속하지 않는 cNFT에 대해 변경이 필요한가요?

아니요. 상속을 사용하지 않으면 `_raw` 필드와 `inherited`는 생략되며 주요 `royalty` 및 `creators` 필드는 이전과 동일하게 동작합니다.

## 관련

- [압축 NFT 가져오기](/ko/smart-contracts/bubblegum-v2/fetch-cnfts)
- [민팅 — 로열티 상속](/ko/smart-contracts/bubblegum-v2/mint-cnfts#inheriting-royalties-from-the-collection)
- [cNFT 업데이트 — 상속 로열티](/ko/smart-contracts/bubblegum-v2/update-cnfts#inherited-royalties)
- [NFT 데이터 해싱](/ko/smart-contracts/bubblegum-v2/hashed-nft-data)
- [DAS getAsset](/ko/dev-tools/das-api/methods/get-asset)
- [FAQ — 상속 로열티](/ko/smart-contracts/bubblegum-v2/faq#inherited-royalties)
