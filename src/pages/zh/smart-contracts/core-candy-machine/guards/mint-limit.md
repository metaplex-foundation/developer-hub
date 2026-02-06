---
title: 铸造限制守卫
metaTitle: "铸造限制守卫 | Core Candy Machine"
description: "Core Candy Machine 的 'Mint Limit' 守卫允许指定每个钱包可以铸造的资产数量限制。"
---

## 概述

**Mint Limit** 守卫允许指定每个钱包可以铸造的资产数量限制。

限制是按钱包、每个 candy machine 和每个标识符设置的——在设置中提供——以允许在同一个 Core Candy Machine 中进行多个铸造限制。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #mintLimit label="MintLimit" /%}
{% node #limit label="- Limit" /%}
{% node #id label="- ID" /%}
{% node label="..." /%}
{% /node %}

{% node parent="id" x="270" y="-9"  %}
{% node #mintCounterPda %}
Mint Counter PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="payer" to="mintCounterPda" path="straight" /%}
{% edge from="id" to="mintCounterPda" /%}

{% node parent="mintCounterPda" x="18" y="100" %}
{% node #payer label="Payer" theme="indigo" /%}
{% node label="Owner: Any Program" theme="dimmed" /%}
{% /node %}

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

{% node #nft parent="mint-candy-machine" y="140" x="90" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 守卫设置

Mint Limit 守卫包含以下设置：

- **ID**：此守卫的唯一标识符。不同的标识符将使用不同的计数器来跟踪给定钱包铸造了多少物品。这在使用守卫组时特别有用，因为我们可能希望每个组都有不同的铸造限制。
- **Limit**：该标识符每个钱包允许的最大铸造数量。

{% dialect-switcher title="使用 Mint Limit 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    mintLimit: some({ id: 1, limit: 5 }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[MintLimit](https://mpl-core-candy-machine.typedoc.metaplex.com/types/MintLimit.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Mint Limit 守卫包含以下铸造设置：

- **ID**：此守卫的唯一标识符。

注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。详情请参阅 [Core Candy Guard 的程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#mintlimit)。

{% dialect-switcher title="使用 Mint Limit 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Mint Limit 守卫的铸造设置，如下所示。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    mintLimit: some({ id: 1 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_Mint Limit 守卫不支持 route 指令。_

## MintLimit 账户

当使用 `MintLimit` 守卫时，会为每个钱包、CandyMachine 和 `id` 组合创建一个 `MintCounter` 账户。出于验证目的，可以这样获取它：

```js
import { safeFetchMintCounterFromSeeds } from "@metaplex-foundation/mpl-core-candy-machine";
import { umi } from "@metaplex-foundation/mpl-core-candy-machine";

const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
  id: 1, // 您在守卫配置中设置的 mintLimit id
  user: umi.identity.publicKey,
  candyMachine: candyMachine.publicKey,
  // 或者使用您的 CM 地址 candyMachine: publicKey("Address")
  candyGuard: candyMachine.mintAuthority,
  // 或者使用您的 candyGuard 地址 candyGuard: publicKey("Address")
});

// 已铸造数量
console.log(mintCounter.count)
```
