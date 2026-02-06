---
title: 개요
metaTitle: 개요 | Inscription
description: Metaplex Inscriptions 표준의 고수준 개요를 제공합니다.
---

Metaplex Inscription 프로그램을 사용하면 블록체인을 데이터 저장 방법으로 활용하여 데이터를 Solana에 직접 작성할 수 있습니다. Inscription 프로그램은 또한 이러한 데이터 저장소를 NFT에 선택적으로 연결할 수 있게 해줍니다. 이 개요에서는 이 프로그램이 어떻게 작동하며 다양한 기능을 고수준에서 어떻게 활용할 수 있는지 설명합니다. {% .lead %}

{% quick-links %}

{% quick-link title="시작하기" icon="InboxArrowDown" href="/inscription/getting-started" description="원하는 언어나 라이브러리를 선택하고 Solana에서 디지털 자산을 시작하세요." /%}

{% quick-link title="API 레퍼런스" icon="CodeBracketSquare" href="<https://mpl-inscription.typedoc.metaplex.com/>" target="_blank" description="특정한 내용을 찾고 계신가요? API 레퍼런스를 확인하고 답을 찾아보세요." /%}

{% /quick-links %}

## 소개

NFT JSON 데이터와 이미지는 역사적으로 Arweave나 IPFS와 같은 탈중앙화된 저장소 제공자에 저장되어 왔습니다. Inscription 프로그램은 NFT 데이터 저장을 위한 또 다른 옵션으로 Solana를 도입하여 해당 데이터를 체인에 직접 작성할 수 있게 합니다. Metaplex Inscription 프로그램은 NFT의 모든 관련 데이터가 이제 Solana에 저장되는 새로운 사용 사례를 도입합니다. 이를 통해 특성 기반 입찰이 가능한 Solana 프로그램, 프로그램을 통해 업데이트되는 동적 이미지, 또는 심지어 온체인 RPG 게임 상태와 같은 많은 새로운 사용 사례가 가능해집니다.

두 가지 다른 종류의 Inscription이 있습니다:

1. **[NFT 민트에 첨부된](#inscriptions-attached-to-nft-mints)** Inscription - NFT 데이터가 오프체인 저장소 대신 또는 추가로 체인에 작성됩니다
2. **[저장소 제공자로서의](#inscriptions-as-storage-provider)** Inscription - 임의의 데이터를 체인에 작성합니다

### NFT 민트에 첨부된 Inscription

Inscription은 메타데이터 JSON과 미디어가 저장되는 Arweave와 같은 오프체인 저장소에 추가로 사용하거나, [Inscription Gateway](#inscription-gateway)를 사용하여 해당 오프체인 저장소를 완전히 대체할 수 있습니다.

두 경우 모두 inscription을 생성하는 동일한 프로세스가 사용됩니다. 게이트웨이를 사용할 때 유일한 차이점은 온체인 메타데이터에 사용되는 URI입니다. 이에 대한 자세한 내용은 [Gateway 섹션](#inscription-gateway)에서 읽어보세요.

NFT 메타데이터를 온체인에 저장할 때 세 개의 inscription 계정이 사용됩니다:

1. JSON 메타데이터를 저장하는 `inscriptionAccount`
2. inscription의 메타데이터를 저장하는 `inscriptionMetadata`
3. 미디어/이미지를 저장하는 `associatedInscriptionAccount`

{% diagram height="h-64 md:h-[500px]" %}

{% node %}
{% node #mint label="민트 계정" theme="blue" /%}
{% node theme="dimmed" %}
소유자: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="mint" x="-17" y="180" %}
{% node #inscriptionAccount theme="crimson" %}
Inscription 계정 {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
소유자: Inscription Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="inscriptionAccount" x="-40" y="160" %}
{% node #inscriptionMetadata theme="crimson" %}
Inscription 메타데이터 계정 {% .whitespace-nowrap %}
{% /node %}
{% node label="소유자: Inscription Program" theme="dimmed" /%}
{% /node %}

{% node parent="inscriptionMetadata" x="500" y="0" %}
{% node #associatedInscription theme="crimson" %}
연관된 Inscription 계정 {% .whitespace-nowrap %}
{% /node %}
{% node label="소유자: Inscription Program" theme="dimmed" /%}
{% /node %}

{% edge from="mint" to="metadata" path="straight" /%}
{% edge from="mint" to="inscriptionAccount" path="straight" %}
Seeds:

"Inscription"

programId

mintAddress
{% /edge %}
{% edge from="inscriptionAccount" to="inscriptionMetadata" path="straight" %}
Seeds:

"Inscription"

programId

inscriptionAccount
{% /edge %}

{% edge from="inscriptionMetadata" to="associatedInscription" path="straight" %}
Seeds:

"Inscription"

"Association"

associationTag

inscriptionMetadataAccount

{% /edge %}

{% /diagram %}

아래 스크립트는 이 두 계정을 모두 생성하고 새로 민팅된 NFT를 Metaplex 게이트웨이로 연결합니다. 이렇게 하면 NFT가 완전히 온체인이 됩니다.

{% dialect-switcher title="게이트웨이를 사용하여 새 NFT에 데이터 새기기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
const umi = await createUmi()
umi.use(mplTokenMetadata())
umi.use(mplInscription())

// 새겨질 NFT를 생성하고 민팅합니다.
const mint = generateSigner(umi)
const inscriptionAccount = await findMintInscriptionPda(umi, {
  mint: mint.publicKey,
})
await createV1(umi, {
  mint,
  name: 'My NFT',
  uri: `https://igw.metaplex.com/devnet/${inscriptionAccount[0]}`,
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)

await mintV1(umi, {
  mint: mint.publicKey,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount[0],
})

let builder = new TransactionBuilder()

// Inscription을 초기화하고 JSON이 저장될 계정을 생성합니다.
builder = builder.add(
  initializeFromMint(umi, {
    mintAccount: mint.publicKey,
  })
)

// 그런 다음 NFT의 JSON 데이터를 Inscription 계정에 작성합니다.
builder = builder.add(
  writeData(umi, {
    inscriptionAccount: inscriptionAccount[0],
    inscriptionMetadataAccount,
    value: Buffer.from(
      '{"description": "A bread! But onchain!", "external_url": "https://breadheads.io"}'
    ),
    associatedTag: null,
    offset: 0,
  })
)

// 그런 다음 이미지를 포함할 연관된 Inscription을 생성합니다.
const associatedInscriptionAccount = findAssociatedInscriptionPda(umi, {
  associated_tag: 'image',
  inscriptionMetadataAccount,
})

builder = builder.add(
  initializeAssociatedInscription(umi, {
    inscriptionMetadataAccount,
    associatedInscriptionAccount,
    associationTag: 'image',
  })
)

await builder.sendAndConfirm(umi, { confirm: { commitment: 'finalized' } })

// 이미지 파일을 열어 원본 바이트를 가져옵니다.
const imageBytes: Buffer = await fs.promises.readFile('bread.png')

// 그리고 이미지를 작성합니다.
const chunkSize = 800
for (let i = 0; i < imageBytes.length; i += chunkSize) {
  const chunk = imageBytes.slice(i, i + chunkSize)
  await writeData(umi, {
    inscriptionAccount: associatedInscriptionAccount,
    inscriptionMetadataAccount,
    value: chunk,
    associatedTag: 'image',
    offset: i,
  }).sendAndConfirm(umi)
}
```

{% /totem %}
{% /dialect %}

{% dialect title="Bash" id="bash" %}
{% totem %}

```bash
pnpm cli inscribe -r <RPC_ENDPOINT> -k <KEYPAIR_FILE> -m <NFT_ADDRESS>

```

{% /totem %}
{% /dialect %}

{% /dialect-switcher %}

### 저장소 제공자로서의 Inscription

NFT 민트와의 사용 외에도 Inscription은 최대 10MB의 임의 데이터를 온체인에 저장하는 데도 사용할 수 있습니다. 무제한 수의 [연관된 Inscription](#associated-inscription-accounts)을 생성할 수 있습니다.

이는 JSON 데이터를 저장해야 하는 온체인 게임을 작성할 때, 텍스트를 온체인에 저장할 때, 또는 NFT가 아닌 프로그램 관련 데이터를 저장할 때 유용할 수 있습니다.

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #inscriptionAccount1 theme="crimson" %}
Inscription 계정 {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
소유자: Inscription Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="inscriptionAccount1" x="-40" y="160" %}
{% node #inscriptionMetadata1 theme="crimson" %}
Inscription 메타데이터 계정 {% .whitespace-nowrap %}
{% /node %}
{% node label="소유자: Inscription Program" theme="dimmed" /%}
{% /node %}

{% node parent="inscriptionMetadata1" x="500" y="0" %}
{% node #associatedInscription1 theme="crimson" %}
연관된 Inscription 계정 {% .whitespace-nowrap %}
{% /node %}
{% node label="소유자: Inscription Program" theme="dimmed" /%}
{% /node %}

{% edge from="mint" to="inscriptionAccount1" path="straight" %}
Seeds:

"Inscription"

programId

mintAddress
{% /edge %}
{% edge from="inscriptionAccount1" to="inscriptionMetadata1" path="straight" %}
Seeds:

"Inscription"

programId

inscriptionAccount
{% /edge %}

{% edge from="inscriptionMetadata1" to="associatedInscription1" path="straight" %}
Seeds:

"Inscription"

"Association"

associationTag

inscriptionMetadataAccount

{% /edge %}

{% /diagram %}

다음 예제는 1280 바이트 트랜잭션 크기 제한을 피하기 위해 세 개의 다른 트랜잭션으로 NFT JSON 데이터를 Inscription에 작성하는 방법을 보여줍니다.

{% dialect-switcher title="특정 NFT inscription의 순위 찾기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
const inscriptionAccount = generateSigner(umi)

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

let builder = new TransactionBuilder()

builder = builder.add(
  initialize(umi, {
    inscriptionAccount,
  })
)

builder = builder.add(
  writeData(umi, {
    inscriptionAccount: inscriptionAccount.publicKey,
    inscriptionMetadataAccount,
    value: Buffer.from('{"description": "A bread! But onchain!"'),
    associatedTag: null,
    offset: 0,
  })
)

builder = builder.add(
  writeData(umi, {
    inscriptionAccount: inscriptionAccount.publicKey,
    inscriptionMetadataAccount,
    value: Buffer.from(', "external_url":'),
    associatedTag: null,
    offset: '{"description": "A bread! But onchain!"'.length,
  })
)

builder = builder.add(
  writeData(umi, {
    inscriptionAccount: inscriptionAccount.publicKey,
    inscriptionMetadataAccount,
    value: Buffer.from(' "https://breadheads.io"}'),
    associatedTag: null,
    offset: '{"description": "A bread! But onchain!", "external_url":'.length,
  })
)

await builder.sendAndConfirm(umi, { confirm: { commitment: 'finalized' } })
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 연관된 Inscription 계정

[Metaplex JSON 표준](/token-metadata/token-standard)은 JSON 스키마의 files 속성을 통해 토큰에 연관된 파일을 연결하는 옵션을 포함합니다. Inscription 프로그램은 PDA의 힘을 사용하여 추가 데이터를 연관시키는 새로운 방법을 도입합니다! PDA는 Inscription과 **연관 태그**에서 파생되어, 비싼 JSON 역직렬화 및 파싱을 요구하지 않고 추가 새겨진 데이터를 프로그래밍 방식으로 파생할 수 있는 방법을 제공합니다.

## Inscription Gateway

[Inscription Gateway](https://github.com/metaplex-foundation/inscription-gateway)와 함께 일반적인 Token Metadata 표준을 사용하고 URI를 게이트웨이로 연결하면, 지갑과 탐색기와 같은 모든 도구가 데이터를 다르게 읽을 필요 없이 NFT가 일반적으로 읽히는 것과 동일하게 체인에서 직접 데이터를 읽을 수 있습니다.

다음 URL 구조를 사용하여 Metaplex에서 호스팅하는 게이트웨이를 사용할 수 있습니다: `https://igw.metaplex.com/<network>/<account>`, 예: [https://igw.metaplex.com/devnet/Fgf4Wn3wjVcLWp5XnMQ4t4Gpaaq2iRbc2cmtXjrQd5hF](https://igw.metaplex.com/devnet/Fgf4Wn3wjVcLWp5XnMQ4t4Gpaaq2iRbc2cmtXjrQd5hF) 또는 사용자 정의 URL로 게이트웨이를 직접 호스팅할 수 있습니다.

## Inscription 순위

Inscription 순위는 각 inscription의 고유 번호입니다. 이 번호는 생성 시점의 총 Inscription 수를 기반으로 존재하는 모든 Metaplex Inscription의 순차적, 글로벌 순위를 나타냅니다. Inscription 순위는 [Inscription Sharding](/inscription/sharding)에서 자세히 설명되는 병렬화된 카운터를 통해 관리됩니다.

Inscription의 `inscriptionRank`를 찾으려면 `inscriptionMetadata` 계정을 가져와서 `inscriptionRank` `bigint`를 읽어야 합니다:

{% dialect-switcher title="특정 NFT inscription의 순위 찾기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
const inscriptionAccount = await findMintInscriptionPda(umi, {
  mint: mint.publicKey,
})
const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount,
})

const { inscriptionRank } = await fetchInscriptionMetadata(
  umi,
  inscriptionMetadataAccount
)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

inscription을 생성할 때는 항상 임의의 샤드를 사용하여 쓰기 잠금을 피해야 합니다. 다음과 같이 임의의 숫자를 계산할 수 있습니다:

{% dialect-switcher title="임의 샤드 찾기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
const randomShard = Math.floor(Math.random() * 32)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

Solana의 총 Metaplex Inscription 수는 다음과 같이 계산할 수 있습니다:

{% dialect-switcher title="총 Inscription 수 가져오기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  fetchAllInscriptionShard,
  findInscriptionShardPda,
} from '@metaplex-foundation/mpl-inscription'

const shardKeys = []
for (let shardNumber = 0; shardNumber < 32; shardNumber += 1) {
  k.push(findInscriptionShardPda(umi, { shardNumber }))
}

const shards = await fetchAllInscriptionShard(umi, shardKeys)
let numInscriptions = 0
shards.forEach((shard) => {
  const rank = 32 * Number(shard.count) + shard.shardNumber
  numInscriptions = Math.max(numInscriptions, rank)
})
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 그리고 더 많은 것들

이것은 Inscription 프로그램과 그것이 제공하는 것에 대한 좋은 개요를 제공하지만, 여전히 할 수 있는 것이 훨씬 더 많습니다.

이 문서의 다른 페이지들은 이를 더 자세히 문서화하고 중요한 기능들을 개별 페이지에서 설명하는 것을 목표로 합니다.

- [초기화](/inscription/initialize)
- [작성](/inscription/write)
- [가져오기](/inscription/fetch)
- [지우기](/inscription/clear)
- [닫기](/inscription/close)
- [권한](/inscription/authority)
- [Inscription Gateway](https://github.com/metaplex-foundation/inscription-gateway)
