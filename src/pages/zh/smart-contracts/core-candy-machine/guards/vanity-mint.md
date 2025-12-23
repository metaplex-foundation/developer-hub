---
title: "Core Candy Machine - 自定义铸币守卫"
metaTitle: "Core Candy Machine - 守卫 - 自定义铸币"
description: "Core Candy Machine '自定义铸币' 守卫要求铸造者提供符合特定格式的铸币地址作为资产地址"
---

## 概述

**自定义铸币** 守卫允许在指定的铸币地址匹配特定格式时进行铸造。此守卫基本上允许添加工作量证明 (POW) 要求，用户需要寻找匹配模式的公钥。

如果铸造者未使用匹配的铸币地址，铸造将失败。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Candy Machine Core 程序 {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Candy Guard 程序 {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="守卫" theme="mint" z=1/%}
{% node #vanityMint label="vanityMint" /%}
{% node #regEx label="- 正则表达式" /%}
{% node label="..." /%}
{% /node %}

{% node parent="regEx" x="270" y="-9"  %}
{% node #nftMint theme="blue" %}
铸币 {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="regEx" to="nftMint" /%}


{% edge from="nftMint" to="mint-candy-guard" theme="indigo" dashed=true %}
检查铸币地址

是否匹配正则表达式
{% /edge %}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    从以下铸造

    _Candy Guard 程序_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    从以下铸造

    _Candy Machine 程序_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="69" theme="blue" %}
  资产
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

自定义铸币守卫包含以下设置：

- **正则表达式**：铸币地址必须匹配的正则表达式。例如，如果您希望所有铸币以字符串 `mplx` 开头，可以将其用作 `regex` 参数。

可用于正则表达式的示例：
- 以特定模式开头：`^mplx`
- 以特定模式结尾：`mplx$`
- 以特定模式开头和结尾：`^mplx*mplx$`
- 完全匹配特定模式：`^mplx1111111111111111111111111111111111111mplx$`
字符串 `mplx` 需要替换为预期的字符。

{% dialect-switcher title="设置 Candy Machine 使用自定义铸币守卫，铸币以 `mplx` 开头和结尾" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    vanityMint: some({
      regex: "^mplx*mplx$",
    }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [VanityMint](https://mpl-core-candy-machine.typedoc.metaplex.com/types/VanityMint.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

_自定义铸币守卫不需要铸造设置。它期望铸币地址匹配。_

## 路由指令

_自定义铸币守卫不支持路由指令。_
