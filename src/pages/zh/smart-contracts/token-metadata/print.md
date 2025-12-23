---
title: 打印版本
metaTitle: 打印版本 | Token Metadata
description: 了解如何在 Token Metadata 上打印 NFT 版本
---

当 NFT 的 **Master Edition** 账户配置正确时，每个 NFT 都有可能被打印为多个版本。在本页面，我们将学习如何创建可打印的 NFT 以及如何从中打印版本。

## 可打印的 NFTs

可打印 NFT 的所有者可以从中打印任意数量的版本，只要其最大供应量尚未达到。

每个非同质化资产 — 即 `NonFungible` 和 `ProgrammableNonFungible` 代币标准 — 在创建时都可以成为可打印的 NFT。这是通过配置资产 Master Edition 账户的 **Max Supply** 属性来完成的。此属性是可选的，可以有以下值之一：

- `None`：NFT 没有固定供应量。换句话说，**NFT 是可打印的，并且具有无限供应量**。
- `Some(x)`：NFT 有固定的 `x` 个版本供应量。
  - 当 `x = 0` 时，这意味着 **NFT 不可打印**。
  - 当 `x > 0` 时，这意味着 **NFT 是可打印的，并且有 `x` 个版本的固定供应量**。

每当从可打印 NFT 创建新的打印版本时，会发生以下几件事：

- 创建一个全新的版本 NFT，其数据与原始 NFT 匹配。唯一的区别是打印版本使用与原始 NFT 不同的代币标准。
  - 对于 `NonFungible` 资产，打印版本使用 `NonFungibleEdition` 代币标准。
  - 对于 `ProgrammableNonFungible` 资产，打印版本使用 `ProgrammableNonFungibleEdition` 代币标准。
- 新版本 NFT 不使用 **Master Edition** 账户，而是使用 **Edition** 账户，该账户通过存储其父级 **Master Edition** 账户的地址来跟踪其版本号和父 NFT。
- Master edition 账户的 **Supply** 属性增加 1。当 **Supply** 属性达到 **Max Supply** 属性时，NFT 将不再可打印。

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #wallet label="钱包账户" theme="indigo" /%}
{% node label="所有者: System Program" theme="dimmed" /%}
{% /node %}

{% node x="200" parent="wallet" %}
{% node #token label="Token 账户" theme="blue" /%}
{% node label="所有者: Token Program" theme="dimmed" /%}
{% node label="Amount = 1" /%}
{% /node %}

{% node x="200" parent="token" %}
{% node #mint label="Mint 账户" theme="blue" /%}
{% node label="所有者: Token Program" theme="dimmed" /%}
{% node #mint-authority label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node #freeze-authority label="Freeze Authority = Edition" /%}
{% /node %}

{% node #metadata-pda parent="mint" x="-10" y="-80" label="PDA" theme="crimson" /%}

{% node parent="metadata-pda" x="-280" %}
{% node #metadata label="Metadata 账户" theme="crimson" /%}
{% node label="所有者: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node #master-edition-pda parent="mint" x="-10" y="-220" label="PDA" theme="crimson" /%}

{% node parent="master-edition-pda" x="-280" %}
{% node #master-edition label="Master Edition 账户" theme="crimson" /%}
{% node label="所有者: Token edition Program" theme="dimmed" /%}
{% node label="Key = MasterEditionV2" /%}
{% node label="Supply" /%}
{% node label="Max Supply" theme="orange" z=1 /%}
{% /node %}

{% node parent="master-edition" y="-140" %}
{% node #edition label="Edition 账户" theme="crimson" /%}
{% node label="所有者: Token edition Program" theme="dimmed" /%}
{% node label="Key = EditionV1" /%}
{% node #edition-parent label="Parent" /%}
{% node label="Edition" /%}
{% /node %}

{% edge from="wallet" to="token" /%}
{% edge from="mint" to="token" /%}
{% edge from="mint" to="metadata-pda" /%}
{% edge from="mint" to="master-edition-pda" /%}
{% edge from="metadata-pda" to="metadata" path="straight" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" fromPosition="left" label="或" /%}
{% edge from="mint-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="freeze-authority" to="master-edition-pda" dashed=true arrow="none" fromPosition="right" toPosition="right" /%}
{% edge from="edition-parent" to="master-edition" dashed=true arrow="none" fromPosition="left" toPosition="left" /%}
{% /diagram %}

## 设置 Master Edition NFT

要创建可打印的 NFT，我们需要配置 Token Metadata 程序 [**Create** 指令](/token-metadata/mint#creating-accounts)的 **Print Supply** 属性。这将如上一节所示配置 **Master Edition** 账户的 **Max Supply** 属性。此属性可以是：

- `Zero`：NFT 不可打印。
- `Limited(x)`：NFT 是可打印的，并且有 `x` 个版本的固定供应量。
- `Unlimited`：NFT 是可打印的，并且具有无限供应量。

以下是如何使用我们的 SDK 创建可打印 NFT。

{% dialect-switcher title="创建 Master Edition NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createNft, printSupply } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createNft(umi, {
  mint,
  name: 'My Master Edition NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  printSupply: printSupply('Limited', [100]), // 或 printSupply('Unlimited')
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 从 Master Edition NFT 打印版本

一旦我们有了尚未达到其 **Max Supply** 的可打印 NFT，我们就可以从中打印新版本。这是通过调用 Token Metadata 程序的 **Print** 指令来完成的。此指令接受以下属性：

- **Master Edition Mint**：可打印 NFT 的 Mint 账户地址。
- **Edition Mint**：新版本 NFT 的 Mint 账户地址。这通常是一个新生成的 Signer，因为如果账户不存在，指令将创建它。
- **Master Token Account Owner**：可打印 NFT 的所有者作为签名者。只有可打印 NFT 的所有者才能从中打印新版本。
- **Edition Token Account Owner**：新版本 NFT 所有者的地址。
- **Edition Number**：要打印的新版本 NFT 的版本号。这通常是 **Master Edition** 账户当前的 **Supply** 加 1。
- **Token Standard**：可打印 NFT 的代币标准。可以是 `NonFungible` 或 `ProgrammableNonFungible`。

以下是如何使用我们的 SDK 从可打印 NFT 打印新版本。

{% dialect-switcher title="创建 Master Edition NFT" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import {
  printV1,
  fetchMasterEditionFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

// （可选）获取 master edition 账户以铸造下一个版本号。
const masterEdition = await fetchMasterEditionFromSeeds(umi, {
  mint: masterEditionMint,
})

const editionMint = generateSigner(umi)
await printV1(umi, {
  masterTokenAccountOwner: originalOwner,
  masterEditionMint,
  editionMint,
  editionTokenAccountOwner: ownerOfThePrintedEdition,
  editionNumber: masterEdition.supply + 1n,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
