---
title: "Program Gate 守卫"
metaTitle: Program Gate 守卫 | Candy Machine
description: "可配置的有效程序列表。"
---

## 概述

**Program Gate** 守卫限制可以出现在铸造交易中的程序。这对于防止机器人在与铸造相同的交易中添加来自任意程序的恶意指令很有用。

该守卫允许铸造所需的程序和配置中指定的任何其他程序。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #addressGate label="ProgramGate" /%}
{% node #additional label="- additional" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="595" %}
  {% node theme="pink" %}
    Mint from

    _Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="70" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="additional" to="mint-candy-guard" arrow="none" dashed=true %}
如果铸造交易包含来自

额外程序的指令

铸造将失败
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 守卫设置

Program Gate 守卫包含以下设置：

- **Additional（额外程序）**：允许在铸造交易中包含指令的额外程序地址列表（最多 5 个地址）。

{% dialect-switcher title="使用 Program Gate 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    programGate: some({ additional: [<PUBKEY 1>, <PUBKEY 2>, ..., <PUBKEY 5>] }),
  },
});
```

API 参考：[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html)、[ProgramGate](https://mpl-candy-machine.typedoc.metaplex.com/types/ProgramGate.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

将此对象添加到您的 config.json 文件的 guard 部分：

```json
"programGate" : {
    "additional": ["<PUBKEY 1>", "<PUBKEY 2>", ..., "<PUBKEY 5>"],
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

_Program Gate 守卫不需要铸造设置。_

## Route 指令

_Program Gate 守卫不支持 route 指令。_
