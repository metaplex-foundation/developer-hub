---
title: 可编程 NFT
metaTitle: 可编程 NFT | Candy Machine
description: 解释如何从 candy machine 铸造可编程 NFT。
---

Token Metadata 的版本 `1.7` 引入了[一种称为可编程 NFT 的新资产类别](/zh/smart-contracts/token-metadata/pnfts)，允许创作者在二级销售中强制执行版税等功能。

从 Candy Machine Core 的版本 `1.0` 和 Candy Guard 的版本 `1.0` 开始，现在可以**从 candy machine 铸造可编程 NFT**，甚至可以更新现有 candy machine 的代币标准。

## 对于新的 candy machine

Candy Machine Core 程序添加了一个名为 `initializeV2` 的新指令。此指令类似于 `initialize` 指令，但它允许您指定要用于 candy machine 的代币标准。此指令将把新创建的 Candy Machine 标记为 `V2`，以将其与不存储代币标准的 `V1` Candy Machine 区分开来。这些新字段使用 Candy Machine 账户数据中的现有填充，以避免 Candy Machine 序列化逻辑中的破坏性更改。

`initializeV2` 指令也可用于创建铸造常规 NFT 的 Candy Machine，因此 `initialize` 指令现在已弃用。请注意，Candy Guard 程序在这里不需要更改，因为它在铸造 NFT 时委托给 Candy Machine Core。

另外，请注意，根据您选择的代币标准，可能需要一些可选账户。例如，可以提供 `ruleSet` 账户以将特定规则集分配给所有铸造的可编程 NFT。如果未提供 `ruleSet` 账户，它将使用 Collection NFT 的规则集（如果有）。否则，铸造的可编程 NFT 将不会分配任何规则集。另一方面，在铸造常规 NFT 时，`ruleSet` 账户将被忽略。

此外，`collectionDelegateRecord` 账户现在应该引用 Token Metadata 中的新 [Metadata Delegate Record](https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/accounts/struct.MetadataDelegateRecord.html)。

您可能想阅读本文档的"[创建 Candy Machine](/zh/smart-contracts/candy-machine/manage#create-candy-machines)"部分以获取更多详细信息，但以下是如何使用我们的 SDK 创建铸造可编程 NFT 的新 Candy Machine 的一些示例。

{% dialect-switcher title="创建新的 PNFT Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { create } from '@metaplex-foundation/mpl-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

API 参考：[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html)

{% /dialect %}
{% /dialect-switcher %}

## 对于现有的 candy machine

可以通过新的 `setTokenStandard` 指令更新现有 Candy Machine 的代币标准。在 Candy Machine `V1` 上调用此指令时，它还将把 Candy Machine 升级到 `V2` 并将代币标准存储在账户数据中。

您可能想阅读本文档的"[更新代币标准](/zh/smart-contracts/candy-machine/manage#update-token-standard)"部分以获取更多详细信息，但以下是如何使用我们的 SDK 将现有 Candy Machine 的代币标准更新为可编程 NFT 的一些示例。

{% dialect-switcher title="更改 Candy Machine 的代币标准" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { setTokenStandard } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

API 参考：[setTokenStandard](https://mpl-candy-machine.typedoc.metaplex.com/functions/setTokenStandard.html)

{% /dialect %}
{% /dialect-switcher %}

此外，添加了一个新的 `setCollectionV2` 指令以支持设置与可编程 NFT 兼容的集合。此指令也适用于常规 NFT，并弃用 `setCollection` 指令。

这里也是一样，您可以在本文档的"[更新集合](/zh/smart-contracts/candy-machine/manage#update-collection)"部分阅读更多信息。

{% dialect-switcher title="更新 Candy Machine 的集合" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { setCollectionV2 } from '@metaplex-foundation/mpl-candy-machine'

await setCollectionV2(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority: collectionUpdateAuthority.publicKey,
  newCollectionMint: newCollectionMint.publicKey,
  newCollectionUpdateAuthority,
}).sendAndConfirm(umi)
```

API 参考：[setCollectionV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCollectionV2.html)

{% /dialect %}
{% /dialect-switcher %}

## 新的铸造指令

Candy Machine Core 和 Candy Guard 程序的 `mint` 指令已更新以支持铸造可编程 NFT。这个新指令称为 `mintV2`，它类似于 `mint` 指令，但需要传入额外的账户。这里也是一样，新的 `mintV2` 指令可用于铸造常规 NFT，因此它们弃用了现有的 `mint` 指令。

整个"[铸造](/zh/smart-contracts/candy-machine/mint)"页面已更新为使用新的 `mintV2` 指令，但以下是如何将它们与可编程 NFT 一起使用的快速示例。

{% dialect-switcher title="从您的 Candy Machine 铸造" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```

API 参考：[mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html)

{% /dialect %}
{% /dialect-switcher %}

请注意，Candy Guard 程序提供的一些守卫也已更新以支持可编程 NFT。虽然这些更新在铸造常规 NFT 时不会引入破坏性更改，但根据代币标准，它们可能需要更多的剩余账户。

受这些更改影响的守卫是：

- `nftBurn` 和 `nftPayment` 守卫现在允许燃烧/发送的 NFT 是可编程 NFT。
- `FreezeSolPayment` 和 `FreezeTokenPayment` 守卫。由于可编程 NFT 定义上始终是冻结的，因此在通过 Utility 委托铸造时它们是锁定的，在满足解冻条件时解锁。

## 额外阅读

您可能会发现以下关于可编程 NFT 和 Candy Machine 的资源很有用：

- [可编程 NFT 指南](/zh/smart-contracts/token-metadata/pnfts)
- [Candy Machine Core 程序](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core)
- [Candy Guard 程序](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard)
