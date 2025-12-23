---
title: "程序门控守卫"
metaTitle: "程序门控守卫 | Core Candy Machine"
description: "Core Candy Machine 的 'Program Gate' 守卫限制可以在铸造交易中使用的程序。"
---

## 概述

**Program Gate** 守卫限制可以在铸造交易中使用的程序。这对于防止机器人在铸造交易中添加来自任意程序的恶意指令很有用。

该守卫允许铸造所需的程序以及配置中指定的任何其他程序。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #addressGate label="ProgramGate" /%}
{% node #additional label="- additional" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="595" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-10" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="93" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="additional" to="mint-candy-guard" arrow="none" dashed=true %}
如果铸造交易包含

来自额外程序的指令

铸造将失败
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

Program Gate 守卫包含以下设置：

- **Additional**：允许在铸造交易中包含指令的额外程序地址列表（最多 5 个地址）。

{% dialect-switcher title="使用 Program Gate 守卫设置 Core Candy Machine" %}
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

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[ProgramGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/ProgramGate.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

_Program Gate 守卫不需要铸造设置。_

## Route 指令

_Program Gate 守卫不支持 route 指令。_
