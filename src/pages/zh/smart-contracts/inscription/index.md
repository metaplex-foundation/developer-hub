---
title: 概述
metaTitle: 概述 | Inscription
description: 提供Metaplex Inscriptions标准的高级概述。
---

Metaplex Inscription程序允许您将数据直接写入Solana，使用区块链作为数据存储方式。Inscription程序还允许此数据存储可选地链接到NFT。在本概述中，我们解释此程序的工作原理以及如何在高级别利用其各种功能。 {% .lead %}

{% quick-links %}

{% quick-link title="快速开始" icon="InboxArrowDown" href="/zh/smart-contracts/inscription/getting-started" description="找到您选择的语言或库，开始在Solana上使用数字资产。" /%}

{% quick-link title="API参考" icon="CodeBracketSquare" href="<https://mpl-inscription.typedoc.metaplex.com/>" target="_blank" description="寻找特定内容？查看我们的API参考并找到您的答案。" /%}

{% /quick-links %}

## 介绍

NFT JSON数据和图像历史上一直存储在Arweave或IPFS等去中心化存储提供商上。Inscription程序引入Solana作为NFT数据存储的另一个选项，允许您将该数据直接写入链上。Metaplex Inscription程序引入了NFT的所有关联数据现在都存储在Solana上的新用例。这启用了许多新用例，如基于特征的Solana程序出价、通过程序更新的动态图像，甚至链上RPG游戏状态。

有两种不同类型的Inscriptions：

1. **[附加到NFT Mint的Inscriptions](#附加到nft-mint的inscriptions)** - NFT数据写入链上而不是或除了链下存储
2. **[作为存储提供商的Inscriptions](#作为存储提供商的inscriptions)** - 将任意数据写入链上

### 附加到NFT Mint的Inscriptions

Inscriptions可以与Arweave等链下存储结合使用，其中存储元数据JSON和媒体，或者可以使用[Inscription网关](#inscription网关)完全替代那些链下存储。

在两种情况下，创建inscription的过程相同。使用网关时唯一的区别是链上元数据中使用的URI。在[网关部分](#inscription网关)阅读更多内容。

在链上存储NFT元数据时使用三个inscription账户：

1. `inscriptionAccount` 存储JSON元数据。
2. `inscriptionMetadata` 存储inscription的元数据
3. `associatedInscriptionAccount` 存储媒体/图像。

{% diagram height="h-64 md:h-[500px]" %}

{% node %}
{% node #mint label="Mint账户" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="mint" x="-17" y="180" %}
{% node #inscriptionAccount theme="crimson" %}
Inscription账户 {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Inscription Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="inscriptionAccount" x="-40" y="160" %}
{% node #inscriptionMetadata theme="crimson" %}
Inscription元数据账户 {% .whitespace-nowrap %}
{% /node %}
{% node label="Owner: Inscription Program" theme="dimmed" /%}
{% /node %}

{% node parent="inscriptionMetadata" x="500" y="0" %}
{% node #associatedInscription theme="crimson" %}
关联Inscription账户 {% .whitespace-nowrap %}
{% /node %}
{% node label="Owner: Inscription Program" theme="dimmed" /%}
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

下面的脚本为您创建这两个账户，并将新铸造的NFT指向Metaplex网关。这样您的NFT就完全在链上了。

{% dialect-switcher title="使用网关为新NFT铭刻数据" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
const umi = await createUmi()
umi.use(mplTokenMetadata())
umi.use(mplInscription())

// 创建并铸造要铭刻的NFT。
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

// 我们初始化Inscription并创建存储JSON的账户。
builder = builder.add(
  initializeFromMint(umi, {
    mintAccount: mint.publicKey,
  })
)

// 然后将NFT的JSON数据写入Inscription账户。
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

// 然后我们创建将包含图像的关联Inscription。
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

// 打开图像文件以获取原始字节。
const imageBytes: Buffer = await fs.promises.readFile('bread.png')

// 并写入图像。
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

### 作为存储提供商的Inscriptions

除了与NFT Mint一起使用外，Inscriptions还可用于在链上存储最多10 MB的任意数据。可以创建无限数量的[关联Inscriptions](#关联inscription账户)。

当编写需要存储JSON数据的链上游戏、在链上存储文本或存储任何与程序相关的非NFT数据时，这很有用。

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #inscriptionAccount1 theme="crimson" %}
Inscription账户 {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Inscription Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="inscriptionAccount1" x="-40" y="160" %}
{% node #inscriptionMetadata1 theme="crimson" %}
Inscription元数据账户 {% .whitespace-nowrap %}
{% /node %}
{% node label="Owner: Inscription Program" theme="dimmed" /%}
{% /node %}

{% node parent="inscriptionMetadata1" x="500" y="0" %}
{% node #associatedInscription1 theme="crimson" %}
关联Inscription账户 {% .whitespace-nowrap %}
{% /node %}
{% node label="Owner: Inscription Program" theme="dimmed" /%}
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

以下示例展示如何在三个不同的交易中将NFT JSON数据写入Inscription，以避免1280字节的交易大小限制。

{% dialect-switcher title="查找特定NFT inscription的排名" %}
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

## 关联Inscription账户

[Metaplex JSON标准](/zh/smart-contracts/token-metadata/token-standard)包括通过JSON模式中的files属性将关联文件链接到代币的选项。Inscription程序引入了一种使用PDA功能关联额外数据的新方法！PDA从Inscription和**关联标签**派生，从而产生一种以编程方式派生额外铭刻数据的方法，而不需要昂贵的JSON反序列化和解析。

## Inscription网关

结合[Inscription网关](https://github.com/metaplex-foundation/inscription-gateway)，您可以使用正常的Token Metadata标准，只需将URI指向网关，网关再直接从链上读取您的数据，而无需所有工具（如钱包和浏览器）以不同于通常读取NFT的方式读取数据。

您可以使用Metaplex托管的网关，URL结构如下：`https://igw.metaplex.com/<network>/<account>`，例如[https://igw.metaplex.com/devnet/Fgf4Wn3wjVcLWp5XnMQ4t4Gpaaq2iRbc2cmtXjrQd5hF](https://igw.metaplex.com/devnet/Fgf4Wn3wjVcLWp5XnMQ4t4Gpaaq2iRbc2cmtXjrQd5hF)，或者使用自定义URL自行托管网关。

## Inscription排名

Inscription排名是每个inscription的唯一编号。此编号代表基于创建时总Inscription数量的所有Metaplex Inscriptions的顺序全局排名。Inscription排名通过并行化计数器管理，在[Inscription分片](/zh/smart-contracts/inscription/sharding)中有进一步解释。

要找到您的Inscription的`inscriptionRank`，您需要获取`inscriptionMetadata`账户并读取`inscriptionRank` `bigint`：

{% dialect-switcher title="查找特定NFT inscription的排名" %}
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

创建inscriptions时，您应该始终使用随机分片以避免写锁。您可以这样计算随机数：

{% dialect-switcher title="查找随机分片" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
const randomShard = Math.floor(Math.random() * 32)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

Solana上Metaplex Inscriptions的总数量可以这样计算：

{% dialect-switcher title="获取Inscription总数" %}
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

## 还有更多

虽然这提供了Inscription程序及其功能的良好概述，但它还有很多其他功能。

本文档的其他页面旨在进一步记录并在各自的页面中解释重要功能。

- [初始化](/zh/smart-contracts/inscription/initialize)
- [写入](/zh/smart-contracts/inscription/write)
- [获取](/zh/smart-contracts/inscription/fetch)
- [清除](/zh/smart-contracts/inscription/clear)
- [关闭](/zh/smart-contracts/inscription/close)
- [权限](/zh/smart-contracts/inscription/authority)
- [Inscription网关](https://github.com/metaplex-foundation/inscription-gateway)
