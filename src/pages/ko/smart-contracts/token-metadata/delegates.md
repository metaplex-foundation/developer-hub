---
title: 위임된 권한
metaTitle: 위임된 권한 | Token Metadata
description: Token Metadata에서 자산에 대한 위임된 권한을 승인하는 방법을 알아보세요
---

자산에 단일 권한을 갖는 것이 항상 이상적인 것은 아닙니다. 때로는 이러한 책임 중 일부를 다른 지갑이나 프로그램에 위임하여 우리를 대신해 작업을 수행할 수 있도록 하고 싶습니다. 이것이 바로 Token Metadata가 다양한 범위를 가진 전체 위임자 세트를 제공하는 이유입니다. {% .lead %}

## 메타데이터 vs 토큰 위임자

Token Metadata가 제공하는 위임자는 **메타데이터 위임자**와 **토큰 위임자**의 두 카테고리로 나눌 수 있습니다. 아래에서 각각에 대해 더 자세히 살펴보겠지만, 먼저 이들이 어떻게 다른지 간단히 살펴보겠습니다.

- **메타데이터 위임자**는 자산의 Mint 계정과 연결되며 위임된 권한이 Metadata 계정에서 업데이트를 수행할 수 있게 해줍니다. 이들은 자산의 업데이트 권한에 의해 승인되며 필요한 만큼 많이 가질 수 있습니다.
- **토큰 위임자**는 자산의 Token 계정과 연결되며 위임된 권한이 토큰을 전송, 소각 및/또는 잠금할 수 있게 해줍니다. 이들은 자산의 소유자에 의해 승인되며 토큰 계정당 한 번에 하나만 가질 수 있습니다.

## 메타데이터 위임자

메타데이터 위임자는 메타데이터 수준에서 작동하는 위임자입니다. 이러한 위임자는 **메타데이터 위임자 레코드** PDA를 사용하여 저장됩니다 — 시드는 `["metadata", program id, mint id, delegate role, update authority id, delegate id]`입니다.

해당 계정은 **위임자** 권한과 이를 승인한 **업데이트 권한**을 추적합니다.

{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-15" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-240" %}
{% node #metadata label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #metadata-delegate-pda parent="mint" x="-15" y="-260" label="PDA" theme="crimson" /%}

{% node parent="metadata-delegate-pda" x="-283" %}
{% node #metadata-delegate label="Metadata Delegate Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = MetadataDelegate" /%}
{% node label="Bump" /%}
{% node label="Mint" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Update Authority" theme="orange" z=1 /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="metadata-delegate-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="metadata-delegate-pda" to="metadata-delegate" path="straight" /%}
{% /diagram %}

메타데이터 위임자의 주요 속성은 다음과 같습니다:

- 주어진 자산에 대해 필요한 만큼 많은 메타데이터 위임자를 가질 수 있습니다.
- 메타데이터 위임자는 Mint 계정에서 파생되므로 자산의 소유자와 관계없이 존재합니다. 따라서 자산을 전송해도 메타데이터 위임자에는 영향을 주지 않습니다.
- 메타데이터 위임자는 또한 자산의 현재 업데이트 권한에서 파생됩니다. 이는 자산에서 업데이트 권한이 업데이트될 때마다 모든 메타데이터 위임자가 무효화되고 새로운 업데이트 권한에서 사용할 수 없다는 의미입니다. 그러나 업데이트 권한이 다시 이전되면, 그와 연결된 모든 메타데이터 위임자가 자동으로 다시 활성화됩니다.
- 메타데이터 위임자는 그들을 승인한 업데이트 권한에 의해 취소될 수 있습니다.
- 메타데이터 위임자는 또한 스스로 취소할 수 있습니다.

서로 다른 행동 범위를 가진 7가지 다른 유형의 메타데이터 위임자가 존재합니다. 다음은 메타데이터 위임자의 다양한 유형을 요약한 표입니다:

| 위임자                    | 자기 업데이트 | 컬렉션 항목 업데이트 | 업데이트 범위                                                              |
| ------------------------- | ------------ | -------------------------- | ------------------------------------------------------------------------- |
| Authority Item            | ✅           | ❌                         | `newUpdateAuthority` ,`primarySaleHappened` ,`isMutable` ,`tokenStandard` |
| Collection                | ✅           | ✅                         | `collection` + 항목의 컬렉션 검증/해제                        |
| Collection Item           | ✅           | ❌                         | `collection`                                                              |
| Data                      | ✅           | ✅                         | `data`                                                                    |
| Data Item                 | ✅           | ❌                         | `data`                                                                    |
| Programmable Configs      | ✅           | ✅                         | `programmableConfigs`                                                     |
| Programmable Configs Item | ✅           | ❌                         | `programmableConfigs`                                                     |

이름이 `Item`으로 끝나는 메타데이터 위임자는 자기 자신에게만 작동할 수 있는 반면, 다른 위임자들은 위임자 자산의 컬렉션 항목에도 작동할 수 있다는 점에 주목하세요. 예를 들어, NFT B와 C를 포함하는 컬렉션 NFT A가 있다고 가정해보겠습니다. A에 **Data** 위임자를 승인하면 NFT A, B, C의 `data` 객체를 업데이트할 수 있습니다. 그러나 A에 **Data Item** 위임자를 승인하면 NFT A의 `data` 객체만 업데이트할 수 있습니다.

또한 **Collection** 위임자는 컬렉션의 항목에서 위임된 NFT를 검증/검증 해제할 수 있도록 해준다는 점에서 조금 특별합니다. 위의 예에서, A에 **Collection** 위임자를 승인하면 NFT B와 C에서 해당 컬렉션을 검증/검증 해제할 수 있습니다.

이러한 각 메타데이터 위임자에 대해 좀 더 자세히 살펴보고 승인, 취소 및 사용에 대한 코드 샘플을 제공해보겠습니다.

### Authority Item 위임자

- 위임자 권한은 자산의 하위 집합을 업데이트할 수 있습니다. Metadata 계정의 다음 속성을 업데이트할 수 있습니다:
  - `newUpdateAuthority`: 업데이트 권한을 다른 계정으로 이전합니다.
  - `primarySaleHappened`: 자산의 1차 판매가 발생했을 때 `true`로 토글합니다.
  - `isMutable`: 자산을 불변으로 만들기 위해 `false`로 토글합니다.
  - `tokenStandard`: 자산이 설정이 필수가 되기 전에 생성된 경우 토큰 표준을 설정할 수 있습니다.

{% dialect-switcher title="Authority Item 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateAuthorityItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateAuthorityItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: authorityItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeAuthorityItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeAuthorityItemV1(umi, {
  mint,
  authority: updateAuthority, // 또는 위임자 권한을 서명자로 전달하여 자기 취소.
  delegate: authorityItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 업데이트" %}

```ts
import { updateAsAuthorityItemDelegateV2 } from '@metaplex-foundation/mpl-token-metadata'

await updateAsAuthorityItemDelegateV2(umi, {
  mint,
  authority: authorityItemDelegate,
  newUpdateAuthority,
  isMutable: false,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Collection 위임자

- 위임자 권한은 자산의 하위 집합을 업데이트할 수 있습니다. Metadata 계정의 `collection` 속성을 설정할 수 있습니다.
- 컬렉션 NFT에 적용될 때, 위임자 권한은 해당 컬렉션 내의 항목에 대해 다음 작업을 수행할 수 있습니다:
  - 항목에서 해당 컬렉션 NFT를 검증하고 검증 해제할 수 있습니다. 컬렉션 NFT가 이미 항목에 설정되어 있는 경우에만 이를 수행할 수 있습니다. 그렇지 않으면 항목이 위임된 컬렉션 NFT의 일부인지 알 수 있는 방법이 없습니다.
  - 항목에서 컬렉션 NFT를 지울 수 있습니다.

{% dialect-switcher title="Collection 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateCollectionV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateCollectionV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: collectionDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeCollectionV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeCollectionV1(umi, {
  mint,
  authority: updateAuthority, // 또는 위임자 권한을 서명자로 전달하여 자기 취소.
  delegate: collectionDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 자산의 컬렉션 업데이트" %}

```ts
import {
  updateAsCollectionDelegateV2,
  collectionToggle,
} from '@metaplex-foundation/mpl-token-metadata'

await updateAsCollectionDelegateV2(umi, {
  mint,
  authority: collectionDelegate,
  collection: collectionToggle('Set', [
    { key: collectionMint, verified: false },
  ]),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="항목의 컬렉션 지우기" %}

```ts
import {
  updateAsCollectionDelegateV2,
  collectionToggle,
} from '@metaplex-foundation/mpl-token-metadata'

await updateAsCollectionDelegateV2(umi, {
  mint,
  delegateMint: collectionMint,
  authority: collectionDelegate,
  collection: collectionToggle('Clear'),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="항목의 컬렉션 검증" %}

```ts
import {
  verifyCollectionV1,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata'

await verifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint }),
  collectionMint,
  authority: collectionDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="항목의 컬렉션 검증 해제" %}

```ts
import {
  unverifyCollectionV1,
  findMetadataPda,
} from '@metaplex-foundation/mpl-token-metadata'

await unverifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint }),
  collectionMint,
  authority: collectionDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Collection Item 위임자

- 위임자 권한은 자산의 하위 집합을 업데이트할 수 있습니다. Metadata 계정의 `collection` 속성을 설정할 수 있습니다.
- 자산이 컬렉션 NFT인 경우에도, Collection 위임자와 달리 Collection Item 위임자는 해당 컬렉션의 항목에 영향을 줄 수 없습니다.

{% dialect-switcher title="Collection Item 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateCollectionItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateCollectionItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: collectionItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeCollectionItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeCollectionItemV1(umi, {
  mint,
  authority: updateAuthority, // 또는 위임자 권한을 서명자로 전달하여 자기 취소.
  delegate: collectionItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 업데이트" %}

```ts
import { updateAsCollectionItemDelegateV2 } from '@metaplex-foundation/mpl-token-metadata'

await updateAsCollectionItemDelegateV2(umi, {
  mint,
  authority: collectionItemDelegate,
  collection: collectionToggle('Set', [
    { key: collectionMint, verified: false },
  ]),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Data 위임자

- 위임자 권한은 자산의 하위 집합을 업데이트할 수 있습니다. Metadata 계정의 전체 `data` 객체를 업데이트할 수 있지만 그 외에는 아무것도 할 수 없습니다. 이는 자산의 `creators`를 업데이트할 수 있다는 의미입니다.
- `data` 객체 내의 `creators` 배열을 업데이트할 때는 검증되지 않은 크리에이터만 추가 및/또는 제거할 수 있다는 점에 주목하세요.
- 컬렉션 NFT에 적용될 때, 위임자 권한은 해당 컬렉션 내의 항목에 대해 동일한 업데이트를 수행할 수 있습니다.

{% dialect-switcher title="Data 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateDataV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateDataV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: dataDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeDataV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeDataV1(umi, {
  mint,
  authority: updateAuthority, // 또는 위임자 권한을 서명자로 전달하여 자기 취소.
  delegate: dataDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 업데이트" %}

```ts
import {
  updateAsDataDelegateV2,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateAsDataDelegateV2(umi, {
  mint,
  authority: dataDelegate,
  data: { ...initialMetadata, name: 'Updated Name' },
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="항목의 위임된 업데이트" %}

```ts
import {
  updateAsDataDelegateV2,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateAsDataDelegateV2(umi, {
  mint,
  delegateMint: collectionMint,
  authority: dataDelegate,
  data: { ...initialMetadata, name: 'Updated Name' },
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Data Item 위임자

- 위임자 권한은 자산의 하위 집합을 업데이트할 수 있습니다. Metadata 계정의 전체 `data` 객체를 업데이트할 수 있지만 그 외에는 아무것도 할 수 없습니다. 이는 자산의 `creators`를 업데이트할 수 있다는 의미입니다.
- `data` 객체 내의 `creators` 배열을 업데이트할 때는 검증되지 않은 크리에이터만 추가 및/또는 제거할 수 있다는 점에 주목하세요.
- 자산이 컬렉션 NFT인 경우에도, Data 위임자와 달리 Data Item 위임자는 해당 컬렉션의 항목에 영향을 줄 수 없습니다.

{% dialect-switcher title="Data Item 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateDataItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateDataItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: dataItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeDataItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeDataItemV1(umi, {
  mint,
  authority: updateAuthority, // 또는 위임자 권한을 서명자로 전달하여 자기 취소.
  delegate: dataItemDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 업데이트" %}

```ts
import {
  updateAsDataItemDelegateV2,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateAsDataItemDelegateV2(umi, {
  mint,
  authority: dataItemDelegate,
  data: { ...initialMetadata, name: 'Updated Name' },
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Programmable Config 위임자

- Programmable Config 위임자는 [프로그래머블 대체 불가능한 토큰](/token-metadata/pnfts)에만 관련이 있습니다.
- 위임자 권한은 Metadata 계정의 `programmableConfigs` 속성을 업데이트할 수 있지만 그 외에는 아무것도 할 수 없습니다. 이는 PNFT의 `ruleSet`을 업데이트할 수 있다는 의미입니다.
- 컬렉션 NFT에 적용될 때, 위임자 권한은 해당 컬렉션 내의 항목에 대해 동일한 업데이트를 수행할 수 있습니다.

{% dialect-switcher title="Programmable Config 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateProgrammableConfigV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateProgrammableConfigV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: programmableConfigDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeProgrammableConfigV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeProgrammableConfigV1(umi, {
  mint,
  authority: updateAuthority, // 또는 위임자 권한을 서명자로 전달하여 자기 취소.
  delegate: programmableConfigDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 업데이트" %}

```ts
import {
  updateAsAuthorityItemDelegateV2,
  ruleSetToggle,
} from '@metaplex-foundation/mpl-token-metadata'
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox'

await updateAsProgrammableConfigDelegateV2(umi, {
  mint,
  token: findAssociatedTokenPda(umi, { mint, owner: assetOwner }),
  authority: programmableConfigDelegate,
  ruleSet: ruleSetToggle('Set', [ruleSet]),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="항목의 위임된 업데이트" %}

```ts
import {
  updateAsAuthorityItemDelegateV2,
  ruleSetToggle,
} from '@metaplex-foundation/mpl-token-metadata'
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox'

await updateAsProgrammableConfigDelegateV2(umi, {
  mint,
  token: findAssociatedTokenPda(umi, { mint, owner: assetOwner }),
  delegateMint: collectionMint,
  authority: programmableConfigDelegate,
  ruleSet: ruleSetToggle('Set', [ruleSet]),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Programmable Config Item 위임자

- Programmable Config 위임자는 [프로그래머블 대체 불가능한 토큰](/token-metadata/pnfts)에만 관련이 있습니다.
- 위임자 권한은 Metadata 계정의 `programmableConfigs` 속성을 업데이트할 수 있지만 그 외에는 아무것도 할 수 없습니다. 이는 PNFT의 `ruleSet`을 업데이트할 수 있다는 의미입니다.
- 자산이 컬렉션 NFT인 경우에도, Programmable Config 위임자와 달리 Programmable Config Item 위임자는 해당 컬렉션의 항목에 영향을 줄 수 없습니다.

{% dialect-switcher title="Programmable Config Item 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateProgrammableConfigItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateProgrammableConfigItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: programmableConfigItemDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeProgrammableConfigItemV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeProgrammableConfigItemV1(umi, {
  mint,
  authority: updateAuthority, // 또는 위임자 권한을 서명자로 전달하여 자기 취소.
  delegate: programmableConfigItemDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 업데이트" %}

```ts
import {
  updateAsProgrammableConfigItemDelegateV2,
  ruleSetToggle,
} from '@metaplex-foundation/mpl-token-metadata'
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox'

await updateAsProgrammableConfigItemDelegateV2(umi, {
  mint,
  token: findAssociatedTokenPda(umi, { mint, owner: assetOwner }),
  authority: programmableConfigItemDelegate,
  ruleSet: ruleSetToggle('Set', [ruleSet]),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 토큰 위임자

토큰 위임자는 토큰 수준에서 작동하는 위임자입니다. 이는 SPL Token 프로그램의 Token 계정에 직접 저장되는 spl-token 위임자를 의미합니다. 따라서 토큰 위임자는 위임자가 소유자를 대신하여 **토큰을 전송하고 소각**할 수 있게 해주지만 **토큰을 잠그고 잠금 해제**하여 소유자가 전송, 소각하거나 심지어 위임자를 취소하는 것을 방지할 수도 있습니다. 이러한 위임자는 에스크로 없는 마켓플레이스, 스테이킹, 자산 대출 등과 같은 애플리케이션에 중요합니다.

SPL Token 프로그램에서 제공하는 위임자 유형은 하나뿐이지만, [프로그래머블 NFT](/token-metadata/pnfts)(PNFT)는 Token Metadata 프로그램이 케이스별로 선택할 수 있는 더 세분화된 위임자를 제공할 수 있게 해주었습니다. 이는 PNFT가 SPL Token 프로그램에서 항상 동결되어 있어 그 위에 위임자 시스템을 구축할 수 있기 때문입니다.

우리는 **Token Record** PDA라고 하는 PNFT 전용 계정에 해당 위임자 시스템을 저장합니다 — 시드는 `["metadata", program id, mint id, "token_record", token account id]`입니다. SPL Token 프로그램에서도 위임된 권한을 동기화하지만 토큰은 항상 동결되어 있습니다. Token Record 계정이 자산이 실제로 잠겨 있는지 여부를 추적하는 것은 Token Record 계정의 책임입니다.

{% diagram height="h-64 md:h-[600px]" %}
{% node %}
{% node #wallet-1 label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-1" x=-10 y=-25 label="대체 불가능한 토큰 및 반-대체 가능한 토큰" theme="transparent" /%}

{% node x="200" parent="wallet-1" %}
{% node #token-1 label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% node label="Delegate Amount" theme="orange" z=1 /%}
{% /node %}

{% node x="200" parent="token-1" %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-1" y=150 %}
{% node #wallet-2 label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}

{% node parent="wallet-2" x=-10 y=-25 label="프로그래머블 대체 불가능한 토큰" theme="transparent" /%}

{% node #token-2-wrapper x="200" parent="wallet-2" %}
{% node #token-2 label="Token Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Delegate Authority" theme="orange" z=1 /%}
{% node label="Delegate Amount = 1" /%}
{% node label="Token State = Frozen" theme="orange" z=1 /%}
{% /node %}

{% node #mint-2-wrapper x="200" parent="token-2" %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}

{% node #token-record-pda parent="mint-2" x="-158" y="150" label="PDA" theme="crimson" /%}

{% node parent="token-record-pda" x="-240" %}
{% node #token-record label="Token Record Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Key = TokenRecord" /%}
{% node label="Bump" /%}
{% node label="State = Locked, Unlocked, Listed" theme="orange" z=1 /%}
{% node label="Rule Set Revision" /%}
{% node label="Delegate" theme="orange" z=1 /%}
{% node label="Delegate Role" theme="orange" z=1 /%}
{% node label="Locked Transfer" /%}
{% /node %}

{% edge from="wallet-1" to="token-1" /%}
{% edge from="mint-1" to="token-1" /%}

{% edge from="wallet-2" to="token-2" /%}
{% edge from="mint-2" to="token-2" /%}
{% edge from="token-2-wrapper" to="token-record-pda" fromPosition="bottom" path="straight" /%}
{% edge from="mint-2-wrapper" to="token-record-pda" fromPosition="bottom" /%}
{% edge from="token-record-pda" to="token-record" path="straight" /%}
{% /diagram %}

토큰 위임자의 주요 속성은 다음과 같습니다:

- 토큰 계정당 하나의 토큰 위임자만 가질 수 있습니다. 동일한 토큰 계정에 새로운 토큰 위임자를 설정하면 기존 위임자를 덮어씁니다.
- 토큰 위임자는 자산이 잠겨 있지 않은 한 자산의 소유자에 의해 취소될 수 있습니다.
- 토큰 위임자는 Token 프로그램에도 설정되어 있어 위임자가 스스로 취소할 수 없으므로 스스로 취소할 수 없습니다.
- 토큰 위임자는 전송 시 재설정됩니다. 대체 가능한 자산을 다룰 때, 위임된 모든 토큰이 전송되면 위임자 권한이 재설정됩니다.
- Standard 위임자는 프로그래머블 대체 불가능한 토큰을 제외한 모든 자산에서 사용할 수 있습니다. 다른 모든 토큰 위임자는 프로그래머블 대체 불가능한 토큰에서만 사용할 수 있습니다.
- 프로그래머블 대체 불가능한 토큰에서 사용할 수 있는 모든 토큰 위임자는 현재 위임자 권한, 그 역할 및 상태(잠김 또는 잠금 해제)를 PNFT의 Token Record 계정에 저장합니다.

서로 다른 행동 범위를 가진 6가지 다른 유형의 토큰 위임자가 존재합니다. 다음은 토큰 위임자의 다양한 유형을 요약한 표입니다:

| 위임자        | 잠금/잠금 해제 | 전송 | 소각 | 대상              | 참고                                                      |
| --------------- | ----------- | -------- | ---- | ---------------- | --------------------------------------------------------- |
| Standard        | ✅          | ✅       | ✅   | PNFT를 제외한 모든 것 |                                                           |
| Sale            | ❌          | ✅       | ❌   | PNFT만       | 소유자가 위임자를 취소할 때까지 전송/소각할 수 없음 |
| Transfer        | ❌          | ✅       | ❌   | PNFT만       | 위임자가 설정되어도 소유자가 전송/소각할 수 있음       |
| Locked Transfer | ✅          | ✅       | ❌   | PNFT만       |                                                           |
| Utility         | ✅          | ❌       | ✅   | PNFT만       |                                                           |
| Staking         | ✅          | ❌       | ❌   | PNFT만       |                                                           |

**Standard** 위임자는 spl-token 위임자에 단순히 위임해야 하므로 다른 PNFT 전용 위임자보다 훨씬 더 많은 권한을 가진다는 점에 주목하세요. 그러나 다른 위임자들은 더 세분화되어 더 구체적인 사용 사례에서 사용할 수 있습니다. 예를 들어, **Sale** 위임자는 위임자가 설정되어 있는 한 소유자가 소각하거나 전송하는 것을 금지하므로 마켓플레이스에서 자산을 상장하는 데 완벽합니다.

이러한 각 토큰 위임자에 대해 좀 더 자세히 살펴보고 승인, 취소 및 사용에 대한 코드 샘플을 제공해보겠습니다.

### Standard 위임자

위에서 언급했듯이, Standard 위임자는 spl-token 위임자를 감싸는 래퍼입니다. Token 프로그램에 직접 명령어를 보낼 수도 있지만, 이 위임자는 토큰 표준에 관계없이 Token Metadata에서 동일한 API를 제공하는 것을 목표로 합니다. 또한 Standard 위임자는 네이티브 spl-token 위임자로는 불가능한 자산을 잠그고 잠금 해제할 수 있습니다.

Standard 위임자의 주요 속성은 다음과 같습니다:

- 이 위임자는 프로그래머블 대체 불가능한 토큰과 작동하지 않습니다.
- 위임자 권한은 자산을 어떤 주소로든 전송할 수 있습니다. 그렇게 하면 위임자 권한이 취소됩니다.
- 위임자 권한은 자산을 소각할 수 있습니다.
- 위임자 권한은 자산을 잠글 수 있습니다 — Token 프로그램에서 자산을 "동결"하는 것으로도 알려져 있습니다. 위임자 권한이 자산을 잠금 해제(또는 "해동")할 때까지, 소유자는 자산을 전송하거나 소각하거나 위임자 권한을 취소할 수 없습니다. 이는 Standard 위임자에 특화된 것으로 네이티브 spl-token 위임자로는 할 수 없습니다.
- 대체 가능한 자산과 함께 사용할 때, 위임자 권한에 위임할 토큰 수를 지정하기 위해 1보다 큰 양을 제공할 수 있습니다.

{% dialect-switcher title="Standard 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateStandardV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateStandardV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeStandardV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeStandardV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 전송" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: standardDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 소각" %}

```ts
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata'

await burnV1(umi, {
  mint,
  authority: standardDelegate,
  tokenOwner: currentOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="잠금 (동결)" %}

```ts
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata'

await lockV1(umi, {
  mint,
  authority: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="잠금 해제 (해동)" %}

```ts
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata'

await unlockV1(umi, {
  mint,
  authority: standardDelegate,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Sale 위임자 (PNFT만)

- 이 위임자는 프로그래머블 대체 불가능한 토큰에서만 작동합니다.
- 위임자 권한은 PNFT를 어떤 주소로든 전송할 수 있습니다. 그렇게 하면 위임자 권한이 취소됩니다.
- PNFT에 Sale 위임자가 설정되어 있는 한, PNFT는 `Listed`라는 특별한 토큰 상태에 들어갑니다. `Listed` 토큰 상태는 `Locked` 토큰 상태의 더 부드러운 변형입니다. 그 시간 동안 소유자는 PNFT를 전송하거나 소각할 수 없습니다. 그러나 소유자는 언제든지 Sale 위임자를 취소할 수 있으며, 이는 `Listed` 토큰 상태를 제거하고 PNFT를 다시 전송 및 소각 가능하게 만듭니다.

{% dialect-switcher title="Sale 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateSaleV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateSaleV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: saleDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeSaleV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeSaleV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: saleDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 전송" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: saleDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Transfer 위임자 (PNFT만)

- 이 위임자는 프로그래머블 대체 불가능한 토큰에서만 작동합니다.
- 위임자 권한은 PNFT를 어떤 주소로든 전송할 수 있습니다. 그렇게 하면 위임자 권한이 취소됩니다.
- Sale 위임자와 달리, Transfer 위임자가 설정되어 있을 때도 소유자는 여전히 PNFT를 전송하고 소각할 수 있습니다.

{% dialect-switcher title="Transfer 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateTransferV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateTransferV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: transferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeTransferV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeTransferV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: transferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 전송" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: transferDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Locked Transfer 위임자 (PNFT만)

- 이 위임자는 프로그래머블 대체 불가능한 토큰에서만 작동합니다.
- 위임자 권한은 PNFT를 잠글 수 있습니다. 위임자 권한이 PNFT를 잠금 해제할 때까지, 소유자는 PNFT를 전송하거나 소각하거나 위임자 권한을 취소할 수 없습니다.
- 위임자 권한은 PNFT를 어떤 주소로든 전송할 수 있습니다. 그렇게 하면 위임자 권한이 취소되고 잠겨 있었다면 PNFT가 잠금 해제됩니다.

{% dialect-switcher title="Locked Transfer 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateLockedTransferV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateLockedTransferV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeLockedTransferV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeLockedTransferV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 전송" %}

```ts
import { transferV1 } from '@metaplex-foundation/mpl-token-metadata'

await transferV1(umi, {
  mint,
  authority: lockedTransferDelegate,
  tokenOwner: currentOwner,
  destinationOwner: newOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="잠금" %}

```ts
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata'

await lockV1(umi, {
  mint,
  authority: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="잠금 해제" %}

```ts
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata'

await unlockV1(umi, {
  mint,
  authority: lockedTransferDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Utility 위임자 (PNFT만)

- 이 위임자는 프로그래머블 대체 불가능한 토큰에서만 작동합니다.
- 위임자 권한은 PNFT를 잠글 수 있습니다. 위임자 권한이 PNFT를 잠금 해제할 때까지, 소유자는 PNFT를 전송하거나 소각하거나 위임자 권한을 취소할 수 없습니다.
- 위임자 권한은 PNFT를 소각할 수 있습니다.

{% dialect-switcher title="Utility 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateUtilityV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateUtilityV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: utilityDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeUtilityV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeUtilityV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: utilityDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="위임된 소각" %}

```ts
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata'

await burnV1(umi, {
  mint,
  authority: utilityDelegate,
  tokenOwner: currentOwner,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="잠금" %}

```ts
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata'

await lockV1(umi, {
  mint,
  authority: utilityDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="잠금 해제" %}

```ts
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata'

await unlockV1(umi, {
  mint,
  authority: utilityDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### Staking 위임자 (PNFT만)

- 이 위임자는 프로그래머블 대체 불가능한 토큰에서만 작동합니다.
- 위임자 권한은 PNFT를 잠글 수 있습니다. 위임자 권한이 PNFT를 잠금 해제할 때까지, 소유자는 PNFT를 전송하거나 소각하거나 위임자 권한을 취소할 수 없습니다.

{% dialect-switcher title="Staking 위임자 작업" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

{% totem-accordion title="승인" %}

```ts
import { delegateStakingV1 } from '@metaplex-foundation/mpl-token-metadata'

await delegateStakingV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: stakingDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="취소" %}

```ts
import { revokeStakingV1 } from '@metaplex-foundation/mpl-token-metadata'

await revokeStakingV1(umi, {
  mint,
  tokenOwner: owner.publicKey,
  authority: owner,
  delegate: stakingDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="잠금" %}

```ts
import { lockV1 } from '@metaplex-foundation/mpl-token-metadata'

await lockV1(umi, {
  mint,
  authority: stakingDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="잠금 해제" %}

```ts
import { unlockV1 } from '@metaplex-foundation/mpl-token-metadata'

await unlockV1(umi, {
  mint,
  authority: stakingDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 레거시 위임자

마지막으로, 이 위임자 시스템 이전에는 컬렉션 위임자가 특정 **Collection Authority Record** PDA에 저장되었다는 점에 주목할 가치가 있습니다. 해당 PDA는 **Metadata Delegate Record**와 유사하지만 하나의 역할만 지원합니다: **Collection**. 이 레거시 컬렉션 위임자는 이제 폐기되었으며 대신 새로운 위임자 시스템을 사용하는 것을 권장합니다.

그렇긴 하지만, Token Metadata 프로그램은 새로운 Collection 위임자가 예상되는 곳에서 이러한 레거시 컬렉션 위임자를 여전히 받아들입니다. 이는 여전히 이러한 레거시 위임자에 위임하고 있는 자산과의 하위 호환성을 보장하기 위해 수행됩니다.

[Token Metadata 프로그램](https://github.com/metaplex-foundation/mpl-token-metadata/blob/main/programs/token-metadata/program/src/instruction/collection.rs)에서 직접 이에 대해 더 자세히 알아볼 수 있습니다.