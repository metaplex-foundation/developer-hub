---
title: 概要
metaTitle: 概要 | Inscription
description: Metaplex Inscriptions標準の高レベル概要を提供します。
---

Metaplex Inscription Programを使用すると、ブロックチェーンをデータストレージの方法として使用して、Solanaに直接データを書き込むことができます。Inscription programはまた、このデータストレージをオプションでNFTにリンクさせることも可能です。この概要では、このプログラムがどのように動作するかと、そのさまざまな機能を高レベルでどのように活用できるかを説明します。 {% .lead %}

{% quick-links %}

{% quick-link title="はじめに" icon="InboxArrowDown" href="/ja/smart-contracts/inscription/getting-started" description="お好みの言語やライブラリを選択して、SolanaでデジタルアセットのOSセットを開始しましょう。" /%}

{% quick-link title="APIリファレンス" icon="CodeBracketSquare" href="https://mpl-inscription.typedoc.metaplex.com/" target="_blank" description="何か特定のものを探していますか？APIリファレンスをご覧いただき、答えを見つけてください。" /%}

{% /quick-links %}

## はじめに

NFTのJSONデータと画像は、従来ArweaveやIPFSなどの分散ストレージプロバイダーに保存されてきました。Inscription programは、そのデータをチェーンに直接書き込むことを可能にし、NFTデータストレージのためのもう一つの選択肢としてSolanaを導入します。Metaplex Inscription programは、NFTの関連データがすべてSolana上に保存されるという新しい使用例を導入します。これにより、特性ベースの入札を持つSolanaプログラム、プログラムによって更新される動的画像、さらにはオンチェーンのRPGゲーム状態など、多くの新しい使用例が可能になります。

Inscriptionには2つの異なる種類があります：

1. **[NFTミントに添付された](#nftミントに添付されたinscription)** Inscription - NFTデータがオフチェーンストレージの代わりに、または追加でチェーンに書き込まれる
2. **[ストレージプロバイダーとしての](#ストレージプロバイダーとしてのinscription)** Inscription - 任意のデータをチェーンに書き込む

### NFTミントに添付されたInscription

Inscriptionは、メタデータJSONとメディアが保存されるArweaveのようなオフチェーンストレージに加えて使用することができ、または[Inscription Gateway](#inscription-gateway)を使用してそれらのオフチェーンストレージを完全に置き換えることもできます。

どちらの場合でも、inscriptionを作成するために同じプロセスが使用されます。ゲートウェイを使用する場合の唯一の違いは、オンチェーンメタデータで使用されるURIです。これについては、[Gatewayセクション](#inscription-gateway)で詳しく説明します。

NFTメタデータをオンチェーンに保存する際、3つのinscriptionアカウントが使用されます：

1. JSONメタデータを保存する`inscriptionAccount`
2. inscriptionのメタデータを保存する`inscriptionMetadata`  
3. メディア/画像を保存する`associatedInscriptionAccount`

{% diagram height="h-64 md:h-[500px]" %}

{% node %}
{% node #mint label="ミントアカウント" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="mint" x="-17" y="180" %}
{% node #inscriptionAccount theme="crimson" %}
Inscriptionアカウント {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
所有者: Inscription Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="inscriptionAccount" x="-40" y="160" %}
{% node #inscriptionMetadata theme="crimson" %}
Inscriptionメタデータアカウント {% .whitespace-nowrap %}
{% /node %}
{% node label="所有者: Inscription Program" theme="dimmed" /%}
{% /node %}

{% node parent="inscriptionMetadata" x="500" y="0" %}
{% node #associatedInscription theme="crimson" %}
関連Inscriptionアカウント {% .whitespace-nowrap %}
{% /node %}
{% node label="所有者: Inscription Program" theme="dimmed" /%}
{% /node %}

{% edge from="mint" to="metadata" path="straight" /%}
{% edge from="mint" to="inscriptionAccount" path="straight" %}
シード:

"Inscription"

programId

mintAddress
{% /edge %}
{% edge from="inscriptionAccount" to="inscriptionMetadata" path="straight" %}
シード:

"Inscription"

programId

inscriptionAccount
{% /edge %}

{% edge from="inscriptionMetadata" to="associatedInscription" path="straight" %}
シード:

"Inscription"

"Association"

associationTag

inscriptionMetadataAccount

{% /edge %}

{% /diagram %}

以下のスクリプトは、これらのアカウントを両方作成し、新しくミントされたNFTをMetaplexゲートウェイに向けます。これにより、あなたのNFTは完全にオンチェーンになります。

{% dialect-switcher title="Gatewayを使用した新しいNFTのデータの刻印" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
const umi = await createUmi()
umi.use(mplTokenMetadata())
umi.use(mplInscription())

// 刻印するNFTを作成してミントします。
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

// Inscriptionを初期化し、JSONが保存されるアカウントを作成します。
builder = builder.add(
  initializeFromMint(umi, {
    mintAccount: mint.publicKey,
  })
)

// そして、NFTのJSONデータをInscriptionアカウントに書き込みます。
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

// 次に、画像を含む関連Inscriptionを作成します。
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

// 画像ファイルを開いて、生バイトを取得します。
const imageBytes: Buffer = await fs.promises.readFile('bread.png')

// そして画像を書き込みます。
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

### ストレージプロバイダーとしてのInscription

NFTミントでの使用に加えて、Inscriptionは最大10MBの任意のデータをオンチェーンに保存するためにも使用できます。無制限の数の[関連Inscription](#関連inscriptionアカウント)を作成することができます。

これは、JSONデータを保存する必要があるオンチェーンゲーム、テキストをオンチェーンに保存、またはNFTではないプログラム関連データを保存する際に有用です。

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #inscriptionAccount1 theme="crimson" %}
Inscriptionアカウント {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
所有者: Inscription Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="inscriptionAccount1" x="-40" y="160" %}
{% node #inscriptionMetadata1 theme="crimson" %}
Inscriptionメタデータアカウント {% .whitespace-nowrap %}
{% /node %}
{% node label="所有者: Inscription Program" theme="dimmed" /%}
{% /node %}

{% node parent="inscriptionMetadata1" x="500" y="0" %}
{% node #associatedInscription1 theme="crimson" %}
関連Inscriptionアカウント {% .whitespace-nowrap %}
{% /node %}
{% node label="所有者: Inscription Program" theme="dimmed" /%}
{% /node %}

{% edge from="mint" to="inscriptionAccount1" path="straight" %}
シード:

"Inscription"

programId

mintAddress
{% /edge %}
{% edge from="inscriptionAccount1" to="inscriptionMetadata1" path="straight" %}
シード:

"Inscription"

programId

inscriptionAccount
{% /edge %}

{% edge from="inscriptionMetadata1" to="associatedInscription1" path="straight" %}
シード:

"Inscription"

"Association"

associationTag

inscriptionMetadataAccount

{% /edge %}

{% /diagram %}

以下の例は、1280バイトのトランザクションサイズ制限を回避するために、3つの異なるトランザクションでNFT JSONデータをInscriptionに書き込む方法を示しています。

{% dialect-switcher title="特定のNFT inscriptionのランクを見つける" %}
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

## 関連Inscriptionアカウント

[Metaplex JSON標準](/ja/smart-contracts/token-metadata/token-standard)には、JSONスキーマのfilesプロパティを介してトークンに関連ファイルをリンクするオプションが含まれています。Inscription programは、PDAの力を使用して追加データを関連付ける新しい方法を導入します！PDAはInscriptionと**アソシエーションタグ**から派生されており、高価なJSON逆シリアル化と解析を必要とせず、追加の刻印されたデータをプログラムで導出する方法になります。

## Inscription Gateway

[Inscription Gateway](https://github.com/metaplex-foundation/inscription-gateway)と一緒に、通常のToken Metadata Standardを使用し、URIをゲートウェイに向けるだけで、ウォレットやエクスプローラーなどのすべてのツールがデータを通常NFTが読まれるのと違う方法でデータを読む必要なく、直接チェーンからデータを読み取ることができます。

Metaplexがホストする以下のURL構造のゲートウェイを使用できます：`https://igw.metaplex.com/<network>/<account>`（例：[https://igw.metaplex.com/devnet/Fgf4Wn3wjVcLWp5XnMQ4t4Gpaaq2iRbc2cmtXjrQd5hF](https://igw.metaplex.com/devnet/Fgf4Wn3wjVcLWp5XnMQ4t4Gpaaq2iRbc2cmtXjrQd5hF)）、またはカスタムURLでゲートウェイを自分でホストすることができます。

## Inscriptionランク

Inscriptionランクは、各inscriptionの一意の番号です。この番号は、作成時の総Inscription数に基づく、存在するすべてのMetaplex Inscriptionの連続的でグローバルなランキングを表します。Inscriptionランクは、[Inscription Sharding](/ja/smart-contracts/inscription/sharding)でさらに説明されている並列化されたカウンターを通じて管理されます。

あなたのInscriptionの`inscriptionRank`を見つけるには、`inscriptionMetadata`アカウントを取得し、`inscriptionRank` `bigint`を読み取る必要があります：

{% dialect-switcher title="特定のNFT inscriptionのランクを見つける" %}
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

inscriptionを作成する際は、書き込みロックを避けるために常にランダムシャードを使用する必要があります。以下のように乱数を計算できます：

{% dialect-switcher title="ランダムシャードを見つける" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
const randomShard = Math.floor(Math.random() * 32)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

Solana上のMetaplex Inscriptionの総数は、以下のように計算できます：

{% dialect-switcher title="総Inscription数を取得" %}
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

## その他にも多くの機能

これはInscription programとその提供機能の良い概要を提供しますが、まだそれで実行できることはたくさんあります。

このドキュメントの他のページでは、さらに詳しく文書化し、重要な機能を個別のページで説明することを目的としています。

- [Initialize](/ja/smart-contracts/inscription/initialize)
- [Write](/ja/smart-contracts/inscription/write)
- [Fetch](/ja/smart-contracts/inscription/fetch)
- [Clear](/ja/smart-contracts/inscription/clear)
- [close](/ja/smart-contracts/inscription/close)
- [Authorities](/ja/smart-contracts/inscription/authority)
- [Inscription Gateway](https://github.com/metaplex-foundation/inscription-gateway)
