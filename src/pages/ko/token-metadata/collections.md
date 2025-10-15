---
title: 검증된 컬렉션
metaTitle: 검증된 컬렉션 | Token Metadata
description: Token Metadata에서 자산을 컬렉션으로 안전하게 그룹화하는 방법을 알아보세요
---

인증된 컬렉션은 NFT와 일반적인 토큰들이 **함께 그룹화**되고 그 정보가 **온체인에서 검증**될 수 있게 해줍니다. 또한 온체인에서 데이터를 할당하여 이러한 컬렉션을 더 쉽게 관리할 수 있게 해줍니다. {% .lead %}

이 기능은 다음과 같은 장점을 제공합니다:

- 추가적인 온체인 호출 없이 주어진 NFT가 어느 컬렉션에 속하는지 쉽게 식별할 수 있습니다.
- 주어진 컬렉션에 속하는 모든 NFT를 찾을 수 있습니다 ([방법을 보려면 가이드를 확인하세요](/token-metadata/guides/get-by-collection)).
- 컬렉션의 이름, 설명, 이미지와 같은 컬렉션 메타데이터를 쉽게 관리할 수 있습니다.

## 컬렉션은 NFT입니다

NFT나 다른 토큰들을 함께 그룹화하기 위해서는 먼저 해당 컬렉션과 관련된 메타데이터를 저장할 목적의 컬렉션 NFT를 생성해야 합니다. 맞습니다, **NFT의 컬렉션 자체가 NFT입니다**. 온체인에서 다른 NFT와 동일한 데이터 레이아웃을 가집니다.

컬렉션 NFT와 일반 NFT의 차이점은 전자가 제공하는 정보는 포함하는 NFT 그룹을 정의하는 데 사용되는 반면, 후자는 NFT 자체를 정의하는 데 사용된다는 것입니다.

## NFT를 컬렉션 NFT에 연결하기

컬렉션 NFT와 일반 NFT는 **Metadata 계정의 "소속" 관계를 사용하여 함께 연결됩니다**. 이를 위해 Metadata 계정의 선택적 `Collection` 필드가 생성되었습니다.

- `Collection` 필드가 `None`으로 설정되면, NFT가 컬렉션의 일부가 아니라는 의미입니다.
- `Collection` 필드가 설정되면, NFT가 해당 필드에 지정된 컬렉션의 일부라는 의미입니다.

따라서 `Collection` 필드는 두 개의 중첩된 필드를 포함합니다:

- `Key`: 이 필드는 NFT가 속한 컬렉션 NFT를 가리킵니다. 더 정확히 말하면, **컬렉션 NFT의 Mint 계정의 공개 키**를 가리킵니다. 이 Mint 계정은 SPL Token 프로그램이 소유해야 합니다.
- `Verified`: 이 부울값은 NFT가 가리키는 컬렉션의 진정한 일부인지 확인하는 데 사용되므로 매우 중요합니다. 자세한 내용은 아래를 참조하세요.

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-180 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-1" x=-10 y=-25 theme="transparent" %}
컬렉션 NFT {% .font-bold %}
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-180 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% /node %}
{% node parent="metadata-2" x=-10 y=-40 theme="transparent" %}
일반 NFT {% .font-bold %}

컬렉션에 첨부됨
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-180 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-40 theme="transparent" %}
일반 NFT {% .font-bold %}

컬렉션 없음
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="orange" /%}

{% /diagram %}

## NFT와 컬렉션 NFT 구분하기

`Collection` 필드만으로는 NFT와 컬렉션을 함께 연결할 수 있지만 주어진 NFT가 일반 NFT인지 컬렉션 NFT인지 식별하는 데는 도움이 되지 않습니다. 이것이 바로 `CollectionDetails` 필드가 생성된 이유입니다. 이는 컬렉션 NFT에 대한 추가 컨텍스트를 제공하고 일반 NFT와 구분해줍니다.

- `CollectionDetails` 필드가 `None`으로 설정되면, NFT가 **일반 NFT**라는 의미입니다.
- `CollectionDetails` 필드가 설정되면, NFT가 **컬렉션 NFT**라는 의미이며 이 필드 내에서 추가 속성을 찾을 수 있습니다.

`CollectionDetails`는 현재 `V1` 옵션만 포함하는 선택적 열거형입니다. 이 옵션은 다음 필드를 포함하는 구조체입니다:

- `Size`: 컬렉션의 크기, 즉 이 컬렉션 NFT에 직접 연결된 NFT의 수입니다. 이 숫자는 Token Metadata 프로그램에 의해 자동으로 계산되지만 마이그레이션 프로세스를 용이하게 하기 위해 수동으로 설정할 수도 있습니다. 현재 [이 `Size` 속성을 폐기하는 MIP가 진행 중](https://github.com/metaplex-foundation/mip/blob/main/mip-3.md)이라는 점에 주목하세요.

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-230 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node theme="orange" z=1 %}
CollectionDetails = **Some**
{% /node %}
{% /node %}
{% node parent="metadata-1" x=-10 y=-25 theme="transparent" %}
컬렉션 NFT {% .font-bold %}
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-230 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-2" x=-10 y=-40 theme="transparent" %}
일반 NFT {% .font-bold %}

컬렉션에 첨부됨
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-230 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-40 theme="transparent" %}
일반 NFT {% .font-bold %}

컬렉션 없음
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="orange" /%}

{% /diagram %}

## 컬렉션 NFT 생성하기

컬렉션 NFT 생성은 일반 NFT 생성과 매우 유사합니다. 유일한 차이점은 이전 섹션에서 본 것처럼 `CollectionDetails` 필드를 설정해야 한다는 것입니다. 일부 SDK는 NFT를 생성할 때 `isCollection` 속성을 요청하여 이를 캡슐화합니다.

{% dialect-switcher title="컬렉션 NFT 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
  isCollection: true,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 중첩된 컬렉션 NFT

컬렉션과 NFT가 "소속" 관계를 통해 연결되기 때문에, 설계상 중첩된 컬렉션을 정의하는 것이 가능합니다. 이 시나리오에서 `Collection`과 `CollectionDetails` 필드를 함께 사용하여 루트 컬렉션 NFT와 중첩된 컬렉션 NFT를 구분할 수 있습니다.

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-230 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node label="CollectionDetails = Some" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-1" x=-10 y=-40 theme="transparent" %}
컬렉션 NFT {% .font-bold %}

루트 컬렉션
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-230 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = Some" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-2" x=-10 y=-40 theme="transparent" %}
컬렉션 NFT {% .font-bold %}

중첩된 컬렉션
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-230 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-3-collection theme="orange" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-40 theme="transparent" %}
일반 NFT {% .font-bold %}

컬렉션에 첨부됨
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="orange" /%}
{% edge from="metadata-3-collection" to="mint-2" theme="orange" /%}

{% /diagram %}

## 컬렉션 NFT 검증하기

위에서 언급했듯이, `Collection` 필드에는 **NFT가 가리키는 컬렉션의 진정한 일부인지 확인하는 데 사용되는** `Verified` 부울값이 포함되어 있습니다. 이 필드 없이는 누구나 자신의 NFT가 어떤 컬렉션의 일부인 것처럼 가장할 수 있습니다.

{% diagram %}

{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-1" y=-230 %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node label="Collection = None" theme="orange" z=1 /%}
{% node label="Use" /%}
{% node theme="orange" z=1 %}
CollectionDetails = **Some**
{% /node %}
{% /node %}
{% node parent="metadata-1" x=-10 y=-25 theme="transparent" %}
컬렉션 NFT {% .font-bold %}
{% /node %}
{% node #metadata-pda-1 parent="metadata-1" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-1" x=360 %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-2" y=-230 %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-2-collection theme="mint" z=1 %}
Collection

\- Key \
\- Verified = **True**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-2" x=-10 y=-55 theme="transparent" %}
검증된 NFT {% .font-bold .text-emerald-600 %}

컬렉션 NFT가 이 NFT를 검증했으므로 \
확실히 그 일부임을 알 수 있습니다.
{% /node %}
{% node #metadata-pda-2 parent="metadata-2" x="-100" label="PDA" theme="crimson" /%}

{% node parent="mint-2" x=360 %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% /node %}
{% node parent="mint-3" y=-230 %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="..." /%}
{% node label="Token Standard" /%}
{% node #metadata-3-collection theme="red" z=1 %}
Collection

\- Key \
\- Verified = **False**

{% /node %}
{% node label="Use" /%}
{% node label="CollectionDetails = None" theme="orange" z=1 /%}
{% /node %}
{% node parent="metadata-3" x=-10 y=-55 theme="transparent" %}
검증되지 않은 NFT {% .font-bold .text-red-500 %}

이는 이 컬렉션의 일부인 것처럼 \
가장하는 누군가의 NFT일 수 있습니다.
{% /node %}
{% node #metadata-pda-3 parent="metadata-3" x="-100" label="PDA" theme="crimson" /%}

{% edge from="mint-1" to="metadata-pda-1" theme="dimmed" /%}
{% edge from="metadata-pda-1" to="metadata-1" path="straight" theme="dimmed" /%}
{% edge from="mint-2" to="metadata-pda-2" theme="dimmed" /%}
{% edge from="metadata-pda-2" to="metadata-2" path="straight" theme="dimmed" /%}
{% edge from="mint-3" to="metadata-pda-3" theme="dimmed" /%}
{% edge from="metadata-pda-3" to="metadata-3" path="straight" theme="dimmed" /%}
{% edge from="metadata-2-collection" to="mint-1" theme="mint" /%}
{% edge from="metadata-3-collection" to="mint-1" theme="red" path="straight" /%}

{% /diagram %}

그 `Verified` 부울값을 `True`로 바꾸려면, 컬렉션 NFT의 권한이 NFT에 서명하여 컬렉션의 일부가 될 수 있음을 증명해야 합니다.

{% callout title="매우 중요" type="warning" %}

탐색기, 지갑, 마켓플레이스는 **반드시 확인해야 합니다** `Verified`가 `true`인지. Verified는 컬렉션 NFT의 권한이 NFT에 대해 Token Metadata `Verify` 명령어 중 하나를 실행한 경우에만 true로 설정될 수 있습니다.

이는 `Verified`가 NFT를 검증하기 위해 true여야 하는 `Creators` 필드와 동일한 패턴입니다.

NFT에서 컬렉션이 유효한지 확인하려면, 다음을 가진 컬렉션 구조체가 **반드시** 설정되어 있어야 합니다:

- 적절한 컬렉션 부모의 민트 주소와 일치하는 `key` 필드.
- `true`로 설정된 `verified` 필드.

이 두 단계를 따르지 않으면 실제 컬렉션에서 사기성 NFT를 노출할 수 있습니다.
{% /callout %}

### 검증

NFT에 `Collection` 속성이 설정되면, 컬렉션 NFT의 권한은 Token Metadata에 **Verify** 명령어를 보내 해당 `verify` 속성을 `false`에서 `true`로 바꿀 수 있습니다. 이 명령어는 다음 속성을 받습니다:

- **Metadata**: NFT의 Metadata 계정 주소. 이는 컬렉션 내에서 검증하고자 하는 NFT입니다.
- **Collection Mint**: 컬렉션 NFT의 Mint 계정 주소. 이는 NFT의 Metadata 계정에 이미 설정되어 있지만 아직 검증되지 않은 컬렉션 NFT입니다.
- **Authority**: 서명자로서의 컬렉션 NFT의 권한. 이는 컬렉션 NFT의 업데이트 권한이거나 적절한 역할을 가진 승인된 위임자일 수 있습니다 ("[위임된 권한](/token-metadata/delegates)" 페이지 참조).

다음은 Token Metadata에서 컬렉션 NFT를 검증하기 위해 우리의 SDK를 사용하는 방법입니다.

{% dialect-switcher title="컬렉션 NFT 검증" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from "@metaplex-foundation/umi";
import { verifyCollectionV1, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

// 먼저 나중에 사용할 메타데이터 PDA 찾기
const metadata = findMetadataPda(umi, {
  mint: publicKey("...")
});

await verifyCollectionV1(umi, {
  metadata,
  collectionMint,
  authority: collectionAuthority,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### 검증 해제

상호적으로, 컬렉션 NFT의 권한은 자신의 컬렉션에 속한 모든 NFT의 검증을 해제할 수 있습니다. 이는 **Verify** 명령어와 동일한 속성을 가진 **Unverify** 명령어를 Token Metadata 프로그램에 보내는 것으로 수행됩니다.

{% dialect-switcher title="컬렉션 NFT 검증 해제" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from "@metaplex-foundation/umi";
import { unverifyCollectionV1, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

// 먼저 나중에 사용할 메타데이터 PDA 찾기
const metadata = findMetadataPda(umi, {
  mint: publicKey("...")
});

await unverifyCollectionV1(umi, {
  metadata,
  collectionMint,
  authority: collectionAuthority,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}