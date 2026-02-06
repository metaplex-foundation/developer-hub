---
title: 初始化Inscriptions
metaTitle: 初始化Inscriptions | Inscription
description: 学习如何创建Metaplex Inscriptions
---

`initialize`指令为您创建inscription账户，数据将存储在其中。有三种类型的初始化：

1. `initializeFromMint` - 用于附加到NFT的Inscriptions - **您可能需要这个**
2. `initialize` - 用于作为存储提供商的Inscriptions
3. `initializeAssociatedInscription` - 额外数据账户

初始化完成后，您可以[写入数据](write)到inscriptions。

初始化时，您可以选择用于编号的`shard`。确保使用随机分片以最小化锁。在[分片](sharding)阅读更多内容。

## `initializeFromMint`

{% callout type="note" %}

这些inscriptions可以像NFT一样交易。如果您不确定，您可能需要使用这个。

{% /callout %}

如果您想要可交易的inscription，您应该使用这种inscription。它是从您的NFT派生的。使用此函数时，您必须是NFT的更新权限持有者。

可以这样完成：

{% dialect-switcher title="初始化Mint Inscription" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  findInscriptionShardPda,
  initializeFromMint,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionShardAccount = await findInscriptionShardPda(umi, {
  shardNumber: 0, //0到31之间的随机数
})
await initializeFromMint(umi, {
  mintAccount: mint.publicKey,
  inscriptionShardAccount,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## `Initialize`

{% callout type="warning" %}

这种inscriptions**不可交易**。我们仅推荐用于高级用例，如游戏。

{% /callout %}

在写入数据之前必须初始化Inscription。可以这样完成：

{% dialect-switcher title="初始化Inscription" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  findInscriptionMetadataPda,
  findInscriptionShardPda,
  initialize,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionAccount = generateSigner(umi)

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})
const inscriptionShardAccount = await findInscriptionShardPda(umi, {
  shardNumber: 0, //0到31之间的随机数
})

await initialize(umi, {
  inscriptionAccount,
  inscriptionShardAccount,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## `initializeAssociatedInscription`

一个Inscription账户可以有多个关联Inscription账户。它们基于`associationTag`派生。例如，标签可以是文件的数据类型，如`image/png`。

关联inscriptions的指针存储在`inscriptionMetadata`账户的`associatedInscriptions`字段中的数组中。

要初始化新的关联Inscription，您可以使用以下函数：

{% dialect-switcher title="初始化关联Inscription" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  findInscriptionMetadataPda,
  initializeAssociatedInscription,
} from '@metaplex-foundation/mpl-inscription'

const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount.publicKey,
})

await initializeAssociatedInscription(umi, {
  inscriptionMetadataAccount,
  associationTag: 'image/png',
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
