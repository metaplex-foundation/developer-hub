---
title: 解压压缩NFT
metaTitle: 解压压缩NFT | Bubblegum
description: 了解如何在Bubblegum上赎回和解压压缩NFT。
---

{% callout type="note" title="v1功能" %}

解压为Token Metadata NFT仅在Bubblegum v1中可用。

{% /callout %}

压缩NFT的所有者可以将其解压为常规NFT。{% .lead %}

这意味着将为NFT创建链上账户，如铸造账户、元数据账户和主版本账户。这使NFT能够执行压缩NFT无法完成的某些操作，与不支持压缩NFT的平台交互，并总体上提高与NFT生态系统的互操作性。

## 解压过程

解压压缩NFT是由NFT所有者发起的两步过程。

1. 首先，所有者必须**赎回**压缩NFT以获得凭证。这将从Bubblegum树中移除叶子，并创建一个凭证账户作为叶子曾经存在于树上的证明。

2. 然后，所有者必须将凭证**解压**为常规NFT。此时，将使用与压缩NFT相同的数据创建常规NFT的所有账户。或者，所有者可以使用**取消赎回**指令恢复该过程，这将在Bubblegum树上恢复叶子并关闭凭证账户。请注意，一旦cNFT完全解压，**取消赎回**指令将不再可用，因此该过程将无法恢复。

{% diagram %}

{% node #merkle-tree-wrapper %}
{% node #merkle-tree label="默克尔树账户" theme="blue" /%}
{% node label="所有者：账户压缩程序" theme="dimmed" /%}
{% /node %}

{% node #tree-config-pda parent="merkle-tree" x="87" y="-60" label="PDA" theme="crimson" /%}

{% node #tree-config parent="tree-config-pda" x="-63" y="-80" %}
{% node label="树配置账户" theme="crimson" /%}
{% node label="所有者：Bubblegum程序" theme="dimmed" /%}
{% /node %}

{% node #voucher-wrapper parent="merkle-tree" x="350" %}
{% node #voucher label="凭证账户" theme="crimson" /%}
{% node label="所有者：Bubblegum程序" theme="dimmed" /%}
{% /node %}

{% node parent="voucher" x="320" %}
{% node #mint label="铸造账户" theme="blue" /%}
{% node label="所有者：代币程序" theme="dimmed" /%}
{% /node %}

{% node #edition-pda parent="mint" x="80" y="-100" label="PDA" theme="crimson" /%}
{% node #metadata-pda parent="mint" x="80" y="-200" label="PDA" theme="crimson" /%}

{% node parent="edition-pda" x="-250" %}
{% node #edition label="主版本账户" theme="crimson" /%}
{% node label="所有者：Token Metadata程序" theme="dimmed" /%}
{% /node %}

{% node parent="metadata-pda" x="-250" %}
{% node #metadata label="元数据账户" theme="crimson" /%}
{% node label="所有者：Token Metadata程序" theme="dimmed" /%}
{% /node %}

{% edge from="merkle-tree" to="tree-config-pda" path="straight" /%}
{% edge from="tree-config-pda" to="tree-config" path="straight" /%}
{% edge from="merkle-tree" to="voucher" animated=true label="1️⃣  赎回" theme="mint" /%}
{% edge from="voucher" to="mint" animated=true label="2️⃣  解压" theme="mint" /%}
{% edge from="voucher-wrapper" to="merkle-tree-wrapper" animated=true label="2️⃣  取消赎回" fromPosition="bottom" toPosition="bottom" theme="red" labelX=175 /%}
{% edge from="mint" to="edition-pda" fromPosition="right" toPosition="right" /%}
{% edge from="mint" to="metadata-pda" fromPosition="right" toPosition="right" /%}
{% edge from="edition-pda" to="edition" path="straight" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}

{% /diagram %}

## 赎回压缩NFT

要启动解压过程的第一步，压缩NFT的所有者必须发送**Redeem**指令并签署交易。这将为cNFT创建一个凭证账户，用于解压过程的下一步。

请注意，此指令会从Bubblegum树中移除叶子。因此，必须提供额外的参数来验证要移除的压缩NFT的完整性。由于这些参数对所有更改叶子的指令是通用的，它们在[以下FAQ](/zh/smart-contracts/bubblegum/faq#replace-leaf-instruction-arguments)中有记录。幸运的是，我们可以使用辅助方法，它将使用Metaplex DAS API自动为我们获取这些参数。

{% dialect-switcher title="赎回压缩NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, redeem } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await redeem(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 解压已赎回的NFT

要完成解压过程，cNFT的所有者必须发送**Decompress**指令，该指令将把已赎回的凭证账户转换为常规NFT。必须提供以下参数：

- **铸造**：要创建的NFT的铸造地址。这必须是压缩NFT的**资产ID**，即从默克尔树地址和叶子索引派生的PDA。
- **凭证**：在上一步中创建的凭证账户的地址。此地址也是从默克尔树地址和叶子索引派生的。
- **元数据**：包含cNFT所有数据的元数据对象。此属性必须与压缩NFT的数据完全匹配，否则哈希将不匹配，解压将失败。

在这里，我们的SDK提供的辅助函数也可用于从Metaplex DAS API获取和解析大多数这些属性。

{% dialect-switcher title="解压已赎回的压缩NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  decompressV1,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await decompressV1(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  mint: assetId,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 取消已赎回的NFT

如果所有者改变了解压cNFT的想法，他们可以通过发送**Cancel Redeem**指令取消解压过程。这将把叶子重新添加到树中并关闭凭证账户。与**Decompress**指令类似，必须提供**凭证**地址以及可以使用Metaplex DAS API检索的其他属性。

{% dialect-switcher title="取消已赎回压缩NFT的解压" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  findVoucherPda,
  cancelRedeem,
} from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId)
await cancelRedeem(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
  voucher: findVoucherPda(umi, assetWithProof),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
