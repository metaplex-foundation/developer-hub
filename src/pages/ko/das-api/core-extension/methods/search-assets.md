---
title: Core 자산 검색
metaTitle: Core 자산 검색 | DAS API Core 확장
description: 검색 기준이 주어진 MPL Core 자산 목록을 반환합니다
---

검색 기준이 주어진 Core 자산 목록을 반환합니다.

## 코드 예제

이 예제에서는 두 가지 필터가 적용됩니다:
1. 소유자의 공개 키
2. 메타데이터 uri `jsonUri`

이렇게 하면 해당 지갑이 소유하고 있는 주어진 URI를 가진 NFT만 반환됩니다.

추가 가능한 파라미터는 [아래](#parameters)에서 찾을 수 있습니다.

```js
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

const umi = createUmi('<ENDPOINT>').use(dasApi());

const asset = await das.searchAssets(umi, {
    owner: publicKey('AUtnbwWJQfYZjJ5Mc6go9UancufcAuyqUZzR1jSe4esx'),
    jsonUri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
});

console.log(asset);
```

## 예제 응답
```json
[
  {
    publicKey: '8VrqN8b8Y7rqWsUXqUw7dxQw9J5UAoVyb6YDJs1mBCCz',
    header: {
      executable: false,
      owner: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d',
      lamports: [Object],
      rentEpoch: 18446744073709551616n,
      exists: true
    },
    pluginHeader: { key: 3, pluginRegistryOffset: 179n },
    royalties: {
      authority: [Object],
      offset: 138n,
      basisPoints: 500,
      creators: [Array],
      ruleSet: [Object]
    },
    key: 1,
    updateAuthority: {
      type: 'Collection',
      address: 'FgEKkVTSfLQ7a7BFuApypy4KaTLh65oeNRn2jZ6fiBav'
    },
    name: 'Number 1',
    uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
    content: {
      '$schema': 'https://schema.metaplex.com/nft1.0.json',
      json_uri: 'https://arweave.net/TkklLLQKiO9t9_JPmt-eH_S-VBLMcRjFcgyvIrENBzA',
      files: [Array],
      metadata: [Object],
      links: [Object]
    },
    owner: 'AUtnbwWJQfYZjJ5Mc6go9UancufcAuyqUZzR1jSe4esx',
    seq: { __option: 'None' }
  }
]
```

## 파라미터

| 이름                | 필수 | 설명                                |
| ------------------- | :------: | ------------------------------------------ |
| `negate`            |          | 검색 기준을 반전할지 여부를 나타냅니다.  |
| `conditionType`     |          | 검색 기준과 일치하는 모든 자산(`"all"`) 또는 일부 자산(`"any"`)을 가져올지 여부를 나타냅니다.  |
| `interface`         |          | 인터페이스 값 (`["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]` 중 하나).  |
| `ownerAddress`      |          | 소유자의 주소.  |
| `ownerType`         |          | 소유권 유형 `["single", "token"]`.  |
| `creatorAddress`    |          | 크리에이터의 주소.  |
| `creatorVerified`   |          | 크리에이터가 검증되어야 하는지 여부를 나타냅니다.  |
| `authorityAddress`  |          | 권한의 주소.  |
| `grouping`          |          | 그룹화 `["key", "value"]` 쌍.  |
| `delegateAddress`   |          | 위임자의 주소.  |
| `frozen`            |          | 자산이 동결되었는지 여부를 나타냅니다.  |
| `supply`            |          | 자산의 공급량.  |
| `supplyMint`        |          | 공급 민트의 주소.  |
| `compressed`        |          | 자산이 압축되었는지 여부를 나타냅니다.  |
| `compressible`      |          | 자산이 압축 가능한지 여부를 나타냅니다.  |
| `royaltyTargetType` |          | 로열티 유형 `["creators", "fanout", "single"]`.  |
| `royaltyTarget`     |          | 로열티 대상 주소.  |
| `royaltyAmount`     |          | 로열티 금액.  |
| `burnt`             |          | 자산이 소각되었는지 여부를 나타냅니다.  |
| `sortBy`            |          | 정렬 기준. 객체 `{ sortBy: <value>, sortDirection: <value> }`로 지정되며, `sortBy`는 `["created", "updated", "recentAction", "none"]` 중 하나이고 `sortDirection`은 `["asc", "desc"]` 중 하나입니다.     |
| `limit`             |          | 가져올 최대 자산 수.  |
| `page`              |          | 가져올 "페이지"의 인덱스.       |
| `before`            |          | 지정된 ID 이전의 자산을 가져옵니다.   |
| `after`             |          | 지정된 ID 이후의 자산을 가져옵니다.    |
| `jsonUri`           |          | JSON URI 값.  |

기술적으로 함수는 표준 DAS 패키지에서 상속되므로 위의 모든 파라미터를 허용합니다. 그러나 일부 파라미터는 사용하지 않는 것이 좋습니다. 예를 들어 패키지는 어쨌든 MPL Core에 대해 `interface`를 필터링합니다.
