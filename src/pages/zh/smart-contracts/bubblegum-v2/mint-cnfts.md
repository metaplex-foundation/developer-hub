---
title: 铸造压缩NFT
metaTitle: 铸造压缩NFT | Bubblegum V2
description: 了解如何在Bubblegum V2上铸造压缩NFT。
---

在[上一页](/zh/bubblegum-v2/create-trees)中，我们看到需要一个Bubblegum树来铸造压缩NFT，以及如何创建一个。现在，让我们看看如何从给定的Bubblegum树铸造压缩NFT。{% .lead %}

Bubblegum程序为不同的叶子模式版本提供多个铸造指令。Bubblegum V2引入了一个新的铸造指令，名为**mintV2**，用于将压缩NFT铸造到给定的集合或不带集合。

## 不带集合铸造

Bubblegum程序提供**mintV2**指令，使我们能够从Bubblegum树铸造压缩NFT。如果Bubblegum树是公开的，任何人都可以使用此指令。否则，只有树创建者或树委托人才能这样做。

**mintV2**指令的主要参数是：

- **默克尔树**：将从中铸造压缩NFT的默克尔树地址。
- **树创建者或委托人**：允许从Bubblegum树铸造的权限——这可以是树的创建者或委托人。此权限必须签署交易。对于公开树，此参数可以是任何权限，但仍然必须是签名者。
- **叶子所有者**：将被铸造的压缩NFT的所有者。默认为交易的付款人。
- **叶子委托人**：允许管理铸造的cNFT的委托权限（如果有）。否则，设置为叶子所有者。
- **集合权限**：允许管理给定集合的权限。
- **Core集合**：压缩NFT将添加到的MPL-Core集合NFT。
- **元数据**：将被铸造的压缩NFT的元数据。它包含诸如NFT的**名称**、其**URI**、其**集合**、其**创作者**等信息。在Bubblegum V2中，元数据使用`MetadataArgsV2`，它排除了不需要的字段，如`uses`和集合的`verified`标志。

{% dialect-switcher title="不带集合铸造压缩NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { none } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550,
    collection: none(),
    creators: [],
  },
}).sendAndConfirm(umi);
```

{% /dialect %}
{% /dialect-switcher %}

## 铸造到集合

虽然可以在铸造压缩NFT_之后_为其设置和验证集合，但Bubblegum V2允许您直接将压缩NFT铸造到给定的集合。Bubblegum V2使用MPL-Core集合对压缩NFT进行分组。为此使用相同的**mintV2**指令。除了上述参数外，您还需要传入核心集合并作为集合权限或委托人签名：

- **Core集合**：传递给`coreCollection`参数的铸造地址，指向MPL-Core集合NFT…
- **集合权限**：允许管理给定集合NFT的权限。这可以是集合NFT的更新权限或委托的集合权限。无论Bubblegum树是否公开，此权限必须签署交易。

请注意，**元数据**参数必须包含**集合**公钥。

{% dialect-switcher title="将压缩NFT铸造到集合" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { some } from '@metaplex-foundation/umi';
import { mintV2 } from '@metaplex-foundation/mpl-bubblegum';

await mintV2(umi, {
  collectionAuthority: umi.identity,
  leafOwner: umi.identity.publicKey,
  merkleTree: merkleTree.publicKey,
  coreCollection: collectionSigner.publicKey,
  metadata: {
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
    sellerFeeBasisPoints: 550, // 5.5%
    collection: some(collectionSigner.publicKey),
    creators: [],
  },
}).sendAndConfirm(umi);
```

{% totem-accordion title="创建MPL-Core集合" %}

如果您还没有集合，可以使用[`@metaplex-foundation/mpl-core`库](https://developers.metaplex.com/core/collections#creating-a-collection-with-plugins)创建一个。请记住，您还需要将`BubblegumV2`插件添加到集合中。
npm install @metaplex-foundation/mpl-core
然后像这样创建集合：

```ts
import { generateSigner } from '@metaplex-foundation/umi';
import { createCollection } from '@metaplex-foundation/mpl-core';

const collectionSigner = generateSigner(umi);
await createCollection(umi, {
    collection: collectionSigner,
    name: "My Collection",
    uri: "https://example.com/my-nft.json",
    plugins: [
      {
        type: "BubblegumV2",
      },
    ],
  }).sendAndConfirm(umi);
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 从铸造交易获取资产ID和叶子模式 {% #get-leaf-schema-from-mint-transaction %}

您可以使用`parseLeafFromMintV2Transaction`辅助函数从`mintV2`交易中检索叶子并确定资产ID。此函数解析交易，因此您必须确保在调用`parseLeafFromMintV2Transaction`之前交易已完成。

{% callout type="note" title="交易完成" %}
请确保在调用`parseLeafFromMintV2Transaction`之前交易已完成。
{% /callout %}

{% dialect-switcher title="从铸造交易获取叶子模式" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  mintV2,
  parseLeafFromMintV2Transaction,
} from '@metaplex-foundation/mpl-bubblegum';

const { signature } = await mintV2(umi, {
  // ... 详见上文
}).sendAndConfirm(umi);

const leaf = await parseLeafFromMintV2Transaction(umi, signature);
const assetId = leaf.id;
```

{% /dialect %}
{% /dialect-switcher %}
