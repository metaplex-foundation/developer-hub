---
title: 자산 가져오기
metaTitle: 자산 가져오기 | Token Metadata
description: Token Metadata에서 자산의 다양한 온체인 계정을 가져오는 방법을 알아보세요
---

이제 자산의 다양한 온체인 계정을 생성하고 민팅하는 방법을 알았으므로, 이를 가져오는 방법을 알아보겠습니다. {% .lead %}

## 디지털 자산

[이전 페이지](/ko/smart-contracts/token-metadata/mint#creating-accounts)에서 언급했듯이, 대체 가능하거나 그렇지 않은 자산은 여러 온체인 계정을 생성해야 합니다. 자산의 토큰 표준에 따라 일부 계정은 필요하지 않을 수 있습니다. 다음은 이러한 계정에 대한 간단한 개요입니다:

- **Mint** 계정 (SPL Token 프로그램에서): 기본 SPL 토큰의 핵심 속성을 정의합니다. 다른 모든 계정이 이로부터 파생되므로 모든 자산의 진입점입니다.
- **Metadata** 계정: 기본 SPL 토큰에 추가 데이터와 기능을 제공합니다.
- **Master Edition** 또는 **Edition** 계정 (대체 불가능한 토큰만): 원본 NFT의 여러 복사본을 인쇄할 수 있게 해줍니다. NFT가 에디션 인쇄를 허용하지 않는 경우에도 **Master Edition** 계정은 대체 불가능성을 보장하기 위해 **Mint** 계정의 Mint authority와 Freeze authority로 사용되므로 여전히 생성됩니다.

자산 가져오기를 더 쉽게 만들기 위해, 우리의 SDK는 한 번에 자산의 모든 관련 계정을 가져올 수 있는 헬퍼 메서드 세트를 제공합니다. 이러한 모든 계정을 저장하는 데이터 타입을 **디지털 자산**이라고 부릅니다. 다음 하위 섹션에서는 **디지털 자산**을 가져오는 다양한 방법을 살펴보겠습니다.

{% dialect-switcher title="디지털 자산 정의" %}
{% dialect title="Umi" id="umi" %}

```ts
import { PublicKey } from '@metaplex-foundation/umi'
import { Mint } from '@metaplex-foundation/mpl-toolbox'
import {
  Metadata,
  MasterEdition,
  Edition,
} from '@metaplex-foundation/mpl-token-metadata'

export type DigitalAsset = {
  publicKey: PublicKey
  mint: Mint
  metadata: Metadata
  edition?:
    | ({ isOriginal: true } & MasterEdition)
    | ({ isOriginal: false } & Edition)
}
```

{% /dialect %}

{% dialect title="Kit" id="kit" %}

```ts
import type { Address } from '@solana/addresses'
import type { Mint } from '@solana-program/token'
import type {
  Metadata,
  MasterEdition,
  Edition,
} from '@metaplex-foundation/mpl-token-metadata-kit'

export type DigitalAsset<TMint extends string = string> = {
  address: Address<TMint>
  mint: Mint
  metadata: Metadata
  edition?:
    | ({ isOriginal: true } & MasterEdition)
    | ({ isOriginal: false } & Edition)
}
```

{% /dialect %}
{% /dialect-switcher %}

### Mint로 가져오기

이 헬퍼는 **Mint** 계정의 공개 키에서 단일 **디지털 자산**을 가져옵니다.

{% code-tabs-imported from="token-metadata/fetch-asset" frameworks="umi,kit" /%}

### Metadata로 가져오기

이 헬퍼는 **Metadata** 계정의 공개 키에서 단일 **디지털 자산**을 가져옵니다. **Mint** 주소를 찾기 위해 먼저 **Metadata** 계정의 내용을 가져와야 하므로 이전 헬퍼보다 약간 덜 효율적이지만, **Metadata** 공개 키에만 액세스할 수 있는 경우 유용할 수 있습니다.

{% code-tabs-imported from="token-metadata/fetch-by-metadata" frameworks="umi,kit" /%}

### Mint 목록으로 모두 가져오기

이 헬퍼는 제공된 목록의 **Mint** 공개 키만큼 **디지털 자산**을 가져옵니다.

{% code-tabs-imported from="token-metadata/fetch-all-by-mint-list" frameworks="umi,kit" /%}

### 크리에이터로 모두 가져오기

이 헬퍼는 크리에이터별로 모든 **디지털 자산**을 가져옵니다. 크리에이터는 **Metadata** 계정의 5개 다른 위치에 있을 수 있으므로, 관심 있는 크리에이터 위치도 제공해야 합니다. 예를 들어, NFT 세트에서 첫 번째 크리에이터가 크리에이터 A이고 두 번째 크리에이터가 B라는 것을 알고 있다면, 위치 1에서 크리에이터 A를, 위치 2에서 크리에이터 B를 검색하려고 할 것입니다.

{% callout %}
이 헬퍼는 계정을 필터링하기 위한 RPC 호출이 필요하며 Umi SDK에서 사용할 수 있습니다. Kit SDK의 경우 효율적인 쿼리를 위해 DAS(Digital Asset Standard) API 프로바이더 사용을 고려하세요.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-creator" frameworks="umi" /%}

### 소유자로 모두 가져오기

이 헬퍼는 소유자별로 모든 **디지털 자산**을 가져옵니다.

{% callout %}
이 헬퍼는 계정을 필터링하기 위한 RPC 호출이 필요하며 Umi SDK에서 사용할 수 있습니다. Kit SDK의 경우 효율적인 쿼리를 위해 DAS(Digital Asset Standard) API 프로바이더 사용을 고려하세요.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-owner" frameworks="umi" /%}

### 업데이트 권한으로 모두 가져오기

이 헬퍼는 업데이트 권한의 공개 키에서 모든 **디지털 자산**을 가져옵니다.

{% callout %}
이 헬퍼는 계정을 필터링하기 위한 RPC 호출이 필요하며 Umi SDK에서 사용할 수 있습니다. Kit SDK의 경우 효율적인 쿼리를 위해 DAS(Digital Asset Standard) API 프로바이더 사용을 고려하세요.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-update-authority" frameworks="umi" /%}

## 토큰이 있는 디지털 자산

위에서 언급한 **디지털 자산** 데이터 구조는 자산의 소유자에 대한 정보를 제공하지 않는다는 점에 주목하세요. 이 첫 번째 정의는 소유자와 관계없이 필요한 온체인 계정에만 초점을 맞춥니다. 그러나 자산의 더 완전한 그림을 제공하기 위해서는 누가 소유하고 있는지도 알아야 할 수 있습니다. 이것이 바로 **토큰이 있는 디지털 자산** 데이터 구조가 나오는 곳입니다. 이는 다음 계정도 포함하는 디지털 자산 데이터 구조의 확장입니다:

- **Token** 계정 (SPL Token 프로그램에서): **Mint** 계정과 그 소유자 간의 관계를 정의합니다. 소유자가 소유한 토큰의 양과 같은 중요한 데이터를 저장합니다. NFT의 경우 양은 항상 1입니다.
- **Token Record** 계정 (PNFT만): 현재 [토큰 위임자](/ko/smart-contracts/token-metadata/delegates#token-delegates)와 그 역할과 같은 [프로그래머블 대체 불가능한 토큰](/ko/smart-contracts/token-metadata/pnfts)에 대한 추가 토큰 관련 정보를 정의합니다.

대체 가능한 자산의 경우, 동일한 디지털 자산이 여러 토큰 계정을 통해 여러 소유자와 연결될 가능성이 높다는 점에 주목하세요. 따라서 동일한 디지털 자산에 대해 여러 토큰이 있는 디지털 자산이 있을 수 있습니다.

여기서도 토큰이 있는 디지털 자산을 가져오는 헬퍼 세트를 제공합니다.

{% dialect-switcher title="토큰이 있는 디지털 자산 정의" %}
{% dialect title="Umi" id="umi" %}

```ts
import { Token } from '@metaplex-foundation/mpl-toolbox'
import {
  DigitalAsset,
  TokenRecord,
} from '@metaplex-foundation/mpl-token-metadata'

export type DigitalAssetWithToken = DigitalAsset & {
  token: Token
  tokenRecord?: TokenRecord
}
```

{% /dialect %}

{% dialect title="Kit" id="kit" %}

```ts
import type { Token } from '@solana-program/token'
import type {
  DigitalAsset,
  TokenRecord,
} from '@metaplex-foundation/mpl-token-metadata-kit'

export type DigitalAssetWithToken<TMint extends string = string> = DigitalAsset<TMint> & {
  token: Token
  tokenRecord?: TokenRecord
}
```

{% /dialect %}
{% /dialect-switcher %}

### Mint로 가져오기

이 헬퍼는 **Mint** 계정의 공개 키에서 단일 **토큰이 있는 디지털 자산**을 가져옵니다. 이는 대체 가능한 자산에 대해 얼마나 많이 존재하는지에 관계없이 하나의 토큰이 있는 디지털 자산만 반환하므로 주로 대체 불가능한 자산과 관련이 있습니다.

{% callout %}
Kit SDK는 토큰 주소 또는 소유자를 알고 있어야 합니다. 소유자를 알고 있다면 아래의 "Mint와 소유자로 가져오기" 헬퍼를 사용하세요.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-with-token-by-mint" frameworks="umi" /%}

### Mint와 소유자로 가져오기

이 헬퍼는 이전 헬퍼보다 더 성능이 좋지만 자산의 소유자를 알고 있어야 합니다.

{% code-tabs-imported from="token-metadata/fetch-with-token-by-owner" frameworks="umi,kit" /%}

### 소유자로 모두 가져오기

이 헬퍼는 주어진 소유자로부터 모든 **토큰이 있는 디지털 자산**을 가져옵니다.

{% callout %}
이 헬퍼는 계정을 필터링하기 위한 RPC 호출이 필요하며 Umi SDK에서 사용할 수 있습니다. Kit SDK의 경우 효율적인 쿼리를 위해 DAS(Digital Asset Standard) API 프로바이더 사용을 고려하세요.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-owner" frameworks="umi" /%}

### Mint로 모두 가져오기

이 헬퍼는 **Mint** 계정의 공개 키에서 모든 **토큰이 있는 디지털 자산**을 가져옵니다. 이는 모든 **토큰** 계정을 가져오므로 대체 가능한 자산에 특히 관련이 있습니다.

{% callout %}
이 헬퍼는 계정을 필터링하기 위한 RPC 호출이 필요하며 Umi SDK에서 사용할 수 있습니다. Kit SDK의 경우 효율적인 쿼리를 위해 DAS(Digital Asset Standard) API 프로바이더 사용을 고려하세요.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-mint" frameworks="umi" /%}

### 소유자와 Mint로 모두 가져오기

이 헬퍼는 소유자와 **Mint** 계정 모두에서 모든 **토큰이 있는 디지털 자산**을 가져옵니다. 이는 주어진 소유자에 대해 하나 이상의 **토큰** 계정을 가진 대체 가능한 자산에 유용할 수 있습니다.

{% callout %}
이 헬퍼는 계정을 필터링하기 위한 RPC 호출이 필요하며 Umi SDK에서 사용할 수 있습니다. Kit SDK의 경우 효율적인 쿼리를 위해 DAS(Digital Asset Standard) API 프로바이더 사용을 고려하세요.
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-owner-and-mint" frameworks="umi" /%}
