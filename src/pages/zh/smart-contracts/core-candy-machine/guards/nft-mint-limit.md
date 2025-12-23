---
title: "NFT 铸造限制守卫"
metaTitle: "NFT 铸造限制守卫 | Core Candy Machine"
description: "Core Candy Machine 的 'NFT Mint Limit' 守卫将铸造限制为指定 NFT/pNFT collection 的持有者，并限制为提供的 NFT 可以铸造的资产数量。"
---

## 概述

NFT Mint Limit 守卫将铸造限制为指定 NFT collection 的持有者，并限制为提供的 Token Metadata NFT 可以执行的铸造数量。它可以被视为 [NFT Gate](/zh/smart-contracts/core-candy-machine/guards/nft-gate) 和 [Mint Limit](/zh/smart-contracts/core-candy-machine/guards/mint-limit) 守卫的组合，基于 NFT 地址而不是钱包。

限制是按 NFT Collection、每个 candy machine 和每个标识符设置的——在设置中提供——以允许在同一个 Core Candy Machine 中进行多个 NFT 铸造限制。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #mintLimit label="NftMintLimit" /%}
{% node #limit label="- Limit" /%}
{% node #id label="- ID" /%}
{% node label="- Required Collection" /%}
{% node label="..." /%}
{% /node %}

{% node parent="id" x="270" y="-9"  %}
{% node #nftMintCounterPda %}
NFT Mint Counter PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="id" to="nftMintCounterPda" /%}

{% node #nft parent="nftMintCounterPda" x="0" y="40"  label="Seeds: candyGuard, candyMachine, id, mint" theme="transparent"  /%}

{% edge from="mintLimit" to="mint-candy-guard" theme="indigo" dashed=true/%}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-30" %}
  {% node  theme="pink" %}
    Mint from

    _Core Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #asset parent="mint-candy-machine" y="140" x="90" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="asset" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 守卫设置

Mint Limit 守卫包含以下设置：

- **ID**：此守卫的唯一标识符。不同的标识符将使用不同的计数器来跟踪通过提供给定 NFT 铸造了多少物品。这在使用守卫组时特别有用，因为我们可能希望每个组都有不同的铸造限制。
- **Limit**：该标识符每个 NFT 允许的最大铸造数量。
- **Required Collection**：必需 NFT Collection 的铸造地址。我们铸造时提供作为证明的 NFT 必须属于此 collection。

{% dialect-switcher title="使用 NFT Mint Limit 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftMintLimit: some({
      id: 1,
      limit: 5,
      requiredCollection: requiredCollectionNft.publicKey,
    }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[MintLimit](https://mpl-core-candy-machine.typedoc.metaplex.com/types/NftMintLimit.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

NFT Mint Limit 守卫包含以下铸造设置：

- **ID**：此守卫的唯一标识符。
- **Mint**：用于证明付款人拥有来自必需 collection 的 NFT 的 NFT 铸造地址。

注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。详情请参阅 [Core Candy Guard 的程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#nftmintlimit)。

{% dialect-switcher title="使用 NFT Mint Limit 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Mint Limit 守卫的铸造设置，如下所示。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    nftMintLimit: some({ id: 1, mint: nftToVerify.publicKey }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_NFT Mint Limit 守卫不支持 route 指令。_

## NftMintLimit 账户
当使用 `NftMintLimit` 守卫时，会为每个 NFT、CandyMachine 和 `id` 组合创建一个 `NftMintCounter` 账户。出于验证目的，可以这样获取它：

```js
import {
  findNftMintCounterPda,
  fetchNftMintCounter
 } from "@metaplex-foundation/mpl-core-candy-machine";

const pda = findNftMintCounterPda(umi, {
  id: 1, // 您在守卫配置中设置的 nftMintLimit id
  mint: asset.publicKey, // 您用户拥有的 nft 地址
  candyMachine: candyMachine.publicKey,
  // 或者使用您的 CM 地址 candyMachine: publicKey("Address")
  candyGuard: candyMachine.mintAuthority
  // 或者使用您的 candyGuard 地址 candyGuard: publicKey("Address")
});

const nftMintCounter = fetchNftMintCounter(umi, pda)
```
