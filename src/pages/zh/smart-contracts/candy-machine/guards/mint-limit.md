---
title: "Mint Limit 守卫"
metaTitle: Mint Limit 守卫 | Candy Machine
description: "Mint Limit 守卫允许指定每个钱包可以铸造的 NFT 数量限制。"
---

## 概述

**Mint Limit** 守卫允许指定每个钱包可以铸造的 NFT 数量限制。

该限制按钱包、每个 candy machine 和每个标识符设置——在设置中提供——以允许在同一 Candy Machine 内进行多个铸造限制。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
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
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node  theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="71" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 守卫设置

Mint Limit 守卫包含以下设置：

- **ID**：此守卫的唯一标识符。不同的标识符将使用不同的计数器来跟踪给定钱包铸造了多少项目。这在使用守卫组时特别有用，因为我们可能希望每个组都有不同的铸造限制。
- **Limit（限制）**：该标识符每个钱包允许的最大铸造数量。

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

API 参考：[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html)、[MintLimit](https://mpl-candy-machine.typedoc.metaplex.com/types/MintLimit.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

将此对象添加到您的 config.json 文件的 guard 部分：

```json
"mintLimit" : {
    "id": number,
    "limit": number
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Mint Limit 守卫包含以下铸造设置：

- **ID**：此守卫的唯一标识符。

请注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要提供这些铸造设置以及更多作为指令参数和剩余账户的组合。有关更多详细信息，请参阅 [Candy Guard 程序文档](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#mintlimit)。

{% dialect-switcher title="使用 Mint Limit 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Mint Limit 守卫的铸造设置，如下所示。

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    mintLimit: some({ id: 1 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_一旦分配了守卫，您就无法使用 sugar 进行铸造——因此没有特定的铸造设置。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_Mint Limit 守卫不支持 route 指令。_
