---
title: 第三方签名者守卫
metaTitle: 第三方签名者守卫 | Core Candy Machine
description: "Core Candy Machine '第三方签名者' 守卫要求预定义的地址签署每笔铸造交易，否则交易将失败。"
---

## 概述

**第三方签名者** 守卫要求预定义的地址签署每笔铸造交易。签名者需要在此守卫的铸造设置中传递。

这允许更中心化的铸造，其中每笔铸造交易都必须通过特定的签名者。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Core Candy Machine Core 程序 {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Core Candy Guard 程序 {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="守卫" theme="mint" z=1/%}
{% node label="第三方签名者" /%}
{% node #guardSigner label="- 签名者" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardSigner" #signer x="270" y="-19" %}
{% node  theme="indigo" %}
签名者 {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
所有者: 任意程序 {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    从以下铸造

    _Core Candy Guard 程序_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    从以下铸造

    _Core Candy Machine 程序_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="93" theme="blue" %}
  资产
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="guardSigner" to="signer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="signer" arrow="none" dashed=true  theme="pink" %}
如果此签名者账户未

签署铸造交易

铸造将失败
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}
## 守卫设置

第三方签名者守卫包含以下设置：

- **签名者密钥**：需要签署每笔铸造交易的签名者地址。

{% dialect-switcher title="使用第三方签名者守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const myConfiguredSigner = generateSigner(umi);

create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signerKey: myConfiguredSigner.publicKey }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [ThirdPartySigner](https://mpl-core-candy-machine.typedoc.metaplex.com/types/ThirdPartySigner.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

第三方签名者守卫包含以下铸造设置：

- **签名者**：所需的第三方签名者。此签名者的地址必须与守卫设置中的签名者密钥匹配。

{% dialect-switcher title="使用第三方签名者守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

使用 Umi 库铸造时，只需通过 `signer` 属性提供第三方签名者即可。

```ts
create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: myConfiguredSigner }),
  },
});
```

请记住还要用 myConfiguredSigner 密钥对签署交易。

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 路由指令

_第三方签名者守卫不支持路由指令。_
