---
title: 압축 NFT 발행
metaTitle: 압축 NFT 발행 | Bubblegum
description: Bubblegum에서 압축 NFT를 발행하는 방법을 알아봅니다.
---
{% callout title="Bubblegum v2" type="note" %}
이 페이지는 Bubblegum v1에 특정합니다. 향상된 기능 세트를 위해 Bubblegum v2 사용을 권장합니다. Bubblegum v2로 작업하는 경우 자세한 내용은 [Bubblegum v2](/ko/smart-contracts/bubblegum-v2/mint-cnfts) 문서를 참조하세요.
{% /callout %}

[이전 페이지](/ko/smart-contracts/bubblegum/create-trees)에서 압축 NFT를 발행하려면 Bubblegum 트리가 필요하다는 것을 확인했고 트리를 생성하는 방법을 살펴봤습니다. 이제 주어진 Bubblegum 트리에서 압축 NFT를 발행하는 방법을 살펴보겠습니다. {% .lead %}

Bubblegum 프로그램은 두 가지 발행 명령을 제공합니다. 하나는 컬렉션과 연결하지 않고 NFT를 발행하고, 다른 하나는 주어진 컬렉션에 NFT를 발행합니다. 후자는 단순히 몇 가지 매개변수가 더 필요하므로 전자부터 살펴보겠습니다.

## 컬렉션 없이 발행

Bubblegum 프로그램은 Bubblegum 트리에서 압축 NFT를 발행할 수 있는 **Mint V1** 명령을 제공합니다. Bubblegum 트리가 공개인 경우 누구나 이 명령을 사용할 수 있습니다. 그렇지 않으면 트리 생성자 또는 트리 위임자만 사용할 수 있습니다.

Mint V1 명령의 주요 매개변수는 다음과 같습니다:

- **Merkle 트리**: 압축 NFT가 발행될 Merkle 트리 주소입니다.
- **트리 생성자 또는 위임자**: Bubblegum 트리에서 발행이 허용된 권한 - 트리 생성자 또는 위임자일 수 있습니다. 이 권한은 트랜잭션에 서명해야 합니다. 공개 트리의 경우 이 매개변수는 모든 권한이 될 수 있지만 여전히 서명자여야 합니다.
- **리프 소유자**: 발행될 압축 NFT의 소유자입니다.
- **리프 위임자**: 발행된 cNFT를 관리할 수 있는 위임 권한(있는 경우). 그렇지 않으면 리프 소유자로 설정됩니다.
- **메타데이터**: 발행될 압축 NFT의 메타데이터입니다. NFT의 **이름**, **URI**, **컬렉션**, **크리에이터** 등과 같은 정보가 포함됩니다.
  - 메타데이터 내에서 **컬렉션** 객체를 제공할 수 있지만 이 명령에서는 컬렉션 권한이 요청되지 않으므로 트랜잭션에 서명할 수 없기 때문에 **검증됨** 필드를 `false`로 설정해야 합니다.
  - 또한 발행 시 크리에이터가 cNFT에서 자신을 검증할 수 있습니다. 이를 작동시키려면 **크리에이터** 객체의 **검증됨** 필드를 `true`로 설정하고 남은 계정에 크리에이터를 서명자로 추가해야 합니다. 모든 크리에이터가 트랜잭션에 서명하고 남은 계정으로 추가되는 한 여러 크리에이터에 대해 이 작업을 수행할 수 있습니다.

{% dialect-switcher title="컬렉션 없이 압축 NFT 발행" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { none } from '@metaplex-foundation/umi'
import { mintV1 } from '@metaplex-foundation/mpl-bubblegum'

await mintV1(umi, {
  leafOwner,
  merkleTree,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-cnft.json',
    sellerFeeBasisPoints: 500, // 5%
    collection: none(),
    creators: [
      { address: umi.identity.publicKey, verified: false, share: 100 },
    ],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### 발행 트랜잭션에서 리프 스키마 및 자산 ID 가져오기 {% #get-leaf-schema-from-mint-transaction %}

`parseLeafFromMintV1Transaction` 헬퍼를 사용하여 `mintV1` 트랜잭션에서 리프를 검색하고 자산 ID를 결정할 수 있습니다. 이 함수는 트랜잭션을 파싱하므로 `parseLeafFromMintV1Transaction`을 호출하기 전에 트랜잭션이 확정되었는지 확인해야 합니다.

{% callout type="note" title="트랜잭션 확정" %}
`parseLeafFromMintV1Transaction`을 호출하기 전에 트랜잭션이 확정되었는지 확인하세요.
{% /callout %}

{% dialect-switcher title="발행 트랜잭션에서 리프 스키마 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
    findLeafAssetIdPda,
    mintV1,
    parseLeafFromMintV1Transaction
} from "@metaplex-foundation/mpl-bubblegum";

const { signature } = await mintV1(umi, {
  leafOwner,
  merkleTree,
  metadata,
}).sendAndConfirm(umi, { confirm: { commitment: "finalized" } });

const leaf: LeafSchema = await parseLeafFromMintV1Transaction(umi, signature);
const assetId = findLeafAssetIdPda(umi, { merkleTree, leafIndex: leaf.nonce });
// or const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션에 발행

압축 NFT가 발행된 _후_ 컬렉션을 설정하고 검증할 수 있지만, Bubblegum 프로그램은 압축 NFT를 주어진 컬렉션에 직접 발행하는 편리한 명령을 제공합니다. Bubblegum은 Metaplex Token Metadata 컬렉션 NFT를 사용하여 압축 NFT를 그룹화합니다. 이 명령은 **MintToCollectionV1**이라고 하며, 다음 매개변수를 추가로 사용하여 **MintV1** 명령과 동일한 매개변수를 사용합니다:

- **컬렉션 민트**: 압축 NFT가 속할 [Token Metadata 컬렉션 NFT](https://developers.metaplex.com/token-metadata/collections#creating-collection-nfts)의 민트 주소입니다.
- **컬렉션 권한**: 주어진 컬렉션 NFT를 관리할 수 있는 권한입니다. 컬렉션 NFT의 업데이트 권한 또는 위임된 컬렉션 권한이 될 수 있습니다. Bubblegum 트리가 공개인지 여부에 관계없이 이 권한은 트랜잭션에 서명해야 합니다.
- **컬렉션 권한 레코드 PDA**: 위임된 컬렉션 권한을 사용할 때 권한이 컬렉션 NFT를 관리할 수 있는지 확인하기 위해 위임자 레코드 PDA를 제공해야 합니다. 새로운 "메타데이터 위임자" PDA 또는 레거시 "컬렉션 권한 레코드" PDA를 사용할 수 있습니다.

또한 **메타데이터** 매개변수에는 다음과 같은 **컬렉션** 객체가 포함되어야 합니다:

- **주소** 필드는 **컬렉션 민트** 매개변수와 일치해야 합니다.
- **검증됨** 필드는 `true` 또는 `false`로 전달할 수 있습니다. `false`로 전달되면 트랜잭션 중에 `true`로 설정되고 cNFT는 **검증됨**이 `true`로 설정된 상태로 발행됩니다.

또한 **Mint V1** 명령과 마찬가지로 크리에이터는 트랜잭션에 서명하고 남은 계정으로 자신을 추가하여 자신을 검증할 수 있습니다.

{% dialect-switcher title="컬렉션에 압축 NFT 발행" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { none } from '@metaplex-foundation/umi'
import { mintToCollectionV1 } from '@metaplex-foundation/mpl-bubblegum'

await mintToCollectionV1(umi, {
  leafOwner,
  merkleTree,
  collectionMint,
  metadata: {
    name: 'My Compressed NFT',
    uri: 'https://example.com/my-cnft.json',
    sellerFeeBasisPoints: 500, // 5%
    collection: { key: collectionMint, verified: false },
    creators: [
      { address: umi.identity.publicKey, verified: false, share: 100 },
    ],
  },
}).sendAndConfirm(umi)
```

기본적으로 컬렉션 권한은 Umi identity로 설정되지만 아래 예제와 같이 사용자 정의할 수 있습니다.

```ts
const customCollectionAuthority = generateSigner(umi)
await mintToCollectionV1(umi, {
  // ...
  collectionAuthority: customCollectionAuthority,
})
```

{% totem-accordion title="컬렉션 NFT 생성" %}

아직 컬렉션 NFT가 없는 경우 `@metaplex-foundation/mpl-token-metadata` 라이브러리를 사용하여 생성할 수 있습니다.

```shell
npm install @metaplex-foundation/mpl-token-metadata
```

다음과 같이 컬렉션 NFT를 생성합니다:

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

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 컬렉션 발행 트랜잭션에서 리프 스키마 및 자산 ID 가져오기 {% #get-leaf-schema-from-mint-to-collection-transaction %}

다시 `parseLeafFromMintToCollectionV1Transaction` 헬퍼를 사용하여 `mintToCollectionV1` 트랜잭션에서 리프를 검색하고 자산 ID를 결정할 수 있습니다.

{% callout type="note" title="트랜잭션 확정" %}
`parseLeafFromMintToCollectionV1Transaction`을 호출하기 전에 트랜잭션이 확정되었는지 확인하세요.
{% /callout %}

{% dialect-switcher title="mintToCollectionV1 트랜잭션에서 리프 스키마 가져오기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
    findLeafAssetIdPda,
    mintV1,
    parseLeafFromMintToCollectionV1Transaction
} from "@metaplex-foundation/mpl-bubblegum";

const { signature } = await mintToCollectionV1(umi, {
  leafOwner,
  merkleTree,
  metadata,
  collectionMint: collectionMint.publicKey,
}).sendAndConfirm(umi);

const leaf: LeafSchema = await parseLeafFromMintToCollectionV1Transaction(umi, signature);
const assetId = findLeafAssetIdPda(umi, { merkleTree, leafIndex: leaf.nonce });
// or const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}
