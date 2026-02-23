---
title: 铸造压缩NFT
metaTitle: 铸造压缩NFT | Bubblegum
description: 了解如何在Bubblegum上铸造压缩NFT。
---
{% callout title="Bubblegum v2" type="note" %}
本页面特定于Bubblegum v1。如需增强的功能集，我们建议使用Bubblegum v2。如果您正在使用Bubblegum v2，请查阅[Bubblegum v2](/zh/smart-contracts/bubblegum-v2/mint-cnfts)文档以获取更多详细信息。
{% /callout %}

在[上一页](/zh/smart-contracts/bubblegum/create-trees)中，我们看到需要Bubblegum树来铸造压缩NFT，并且我们看到了如何创建一个。现在，让我们看看如何从给定的Bubblegum树铸造压缩NFT。{% .lead %}

Bubblegum程序提供两个铸造指令。一个在不关联集合的情况下铸造NFT，另一个将NFT铸造到给定集合。让我们先看前者，因为后者只需要几个额外的参数。

## 不关联集合的铸造

Bubblegum程序提供了**Mint V1**指令，使我们能够从Bubblegum树铸造压缩NFT。如果Bubblegum树是公开的，任何人都可以使用此指令。否则，只有树创建者或树委托才能这样做。

Mint V1指令的主要参数是：

- **默克尔树**：将从中铸造压缩NFT的默克尔树地址。
- **树创建者或委托**：允许从Bubblegum树铸造的权限——可以是树的创建者或委托。此权限必须签署交易。对于公开树，此参数可以是任何权限，但仍必须是签名者。
- **叶子所有者**：将被铸造的压缩NFT的所有者。
- **叶子委托**：允许管理铸造的cNFT的委托权限（如果有）。否则，设置为叶子所有者。
- **元数据**：将被铸造的压缩NFT的元数据。它包含NFT的**名称**、**URI**、**集合**、**创作者**等信息。
  - 请注意，可以在元数据中提供**集合**对象，但其**已验证**字段必须设置为`false`，因为此指令不需要集合权限，因此无法签署交易。
  - 还要注意，创作者可以在铸造时验证自己的cNFT。为此，我们需要将**创作者**对象的**已验证**字段设置为`true`，并将创作者作为签名者添加到剩余账户中。只要所有创作者都签署交易并添加为剩余账户，这可以对多个创作者执行。

{% dialect-switcher title="铸造不关联集合的压缩NFT" %}
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

### 从铸造交易获取叶子模式和资产ID {% #get-leaf-schema-from-mint-transaction %}

您可以使用`parseLeafFromMintV1Transaction`辅助函数从`mintV1`交易中检索叶子并确定资产ID。此函数解析交易，因此您必须确保在调用`parseLeafFromMintV1Transaction`之前交易已完成。

{% callout type="note" title="交易完成" %}
请确保交易已完成后再调用`parseLeafFromMintV1Transaction`。
{% /callout %}

{% dialect-switcher title="从铸造交易获取叶子模式" %}
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
// 或 const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}

## 铸造到集合

虽然可以在铸造后为压缩NFT设置和验证集合，但Bubblegum程序提供了一个便捷的指令，可以直接将压缩NFT铸造到给定集合。Bubblegum使用Metaplex Token Metadata集合NFT来分组压缩NFT。此指令称为**MintToCollectionV1**，它使用与**MintV1**指令相同的参数，并添加以下参数：

- **集合铸造**：压缩NFT将归属的[Token Metadata集合NFT](/zh/smart-contracts/token-metadata/collections#creating-collection-nfts)的铸造地址。
- **集合权限**：允许管理给定集合NFT的权限。这可以是集合NFT的更新权限或委托的集合权限。无论Bubblegum树是否公开，此权限都必须签署交易。
- **集合权限记录PDA**：使用委托的集合权限时，必须提供委托记录PDA以确保该权限被允许管理集合NFT。这可以使用新的"元数据委托"PDA或旧的"集合权限记录"PDA。

此外，请注意**元数据**参数必须包含**集合**对象，使得：

- 其**地址**字段与**集合铸造**参数匹配。
- 其**已验证**字段可以传入为`true`或`false`。如果传入为`false`，它将在交易期间设置为`true`，cNFT将以**已验证**设置为`true`铸造。

另请注意，与**Mint V1**指令一样，创作者可以通过签署交易并将自己添加为剩余账户来验证自己。

{% dialect-switcher title="铸造压缩NFT到集合" %}
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

默认情况下，集合权限设置为Umi身份，但可以自定义，如下例所示。

```ts
const customCollectionAuthority = generateSigner(umi)
await mintToCollectionV1(umi, {
  // ...
  collectionAuthority: customCollectionAuthority,
})
```

{% totem-accordion title="创建集合NFT" %}

如果您还没有集合NFT，可以使用`@metaplex-foundation/mpl-token-metadata`库创建一个。

```shell
npm install @metaplex-foundation/mpl-token-metadata
```

然后像这样创建集合NFT：

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

### 从铸造到集合交易获取叶子模式和资产ID {% #get-leaf-schema-from-mint-to-collection-transaction %}

同样，您可以使用`parseLeafFromMintToCollectionV1Transaction`辅助函数从`mintToCollectionV1`交易中检索叶子并确定资产ID。

{% callout type="note" title="交易完成" %}
请确保交易已完成后再调用`parseLeafFromMintToCollectionV1Transaction`。
{% /callout %}

{% dialect-switcher title="从mintToCollectionV1交易获取叶子模式" %}
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
// 或 const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}
