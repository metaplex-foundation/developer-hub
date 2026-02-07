---
title: 地址门控守卫
metaTitle: 地址门控守卫 | Core Candy Machine
description: "Core Candy Machine 的 'Address Gate' 守卫将铸造限制为提供的单个地址。"
---

## 概述

**Address Gate** 守卫将铸造限制为必须与铸造钱包地址匹配的单个地址。

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
{% node #addressGate label="AddressGate" /%}
{% node #address label="- Address" /%}
{% node label="..." /%}
{% /node %}

{% node parent="address" x="270" y="-9" %}
{% node #payer label="Payer" theme="indigo" /%}
{% node theme="dimmed" %}
Owner: Any Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-10" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="72" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="address" to="payer" arrow="none" dashed=true /%}
{% edge from="payer" to="mint-candy-guard" arrow="none" dashed=true%}
如果付款人与守卫上的地址不匹配

铸造将失败
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 守卫设置

Address Gate 守卫包含以下设置：

- **Address**：唯一允许从 Core Candy Machine 铸造的地址。

{% dialect-switcher title="使用 Address Gate 守卫设置 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    addressGate: some({ address: someWallet.publicKey }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[AddressGate](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AddressGate.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

将此对象添加到您的 config.json 文件的守卫部分：

```json
"addressGate" : {
    "address": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

现在，只有定义的公钥才能从这个 Core Candy Machine 铸造。

## 铸造设置

_Address Gate 守卫不需要铸造设置。_

## Route 指令

_Address Gate 守卫不支持或不需要 route 指令。_
