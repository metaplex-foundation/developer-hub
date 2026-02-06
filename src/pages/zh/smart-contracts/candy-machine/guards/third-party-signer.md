---
title: "Third Party Signer 守卫"
metaTitle: Third Party Signer 守卫 | Candy Machine
description: "Third Party Signer 守卫要求预定义的地址签署每个铸造交易。"
---

## 概述

**Third Party Signer** 守卫要求预定义的地址签署每个铸造交易。签名者需要在此守卫的铸造设置中传递。

这允许更集中的铸造，其中每个铸造交易都必须通过特定的签名者。

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
{% node label="Third Party Signer" /%}
{% node #guardSigner label="- Signer" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardSigner" #signer x="270" y="-19" %}
{% node  theme="indigo" %}
Signer {% .whitespace-nowrap %}
{% /node %}
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

{% node #nft parent="mint-candy-machine" y="140" x="72" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="guardSigner" to="signer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="signer" arrow="none" dashed=true  theme="pink" %}
如果此签名者账户不

签署铸造交易

铸造将失败
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 守卫设置

Third Party Signer 守卫包含以下设置：

- **Signer Key（签名者密钥）**：需要签署每个铸造交易的签名者地址。

{% dialect-switcher title="使用 Third Party Signer 守卫设置 Candy Machine" %}
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

API 参考：[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html)、[ThirdPartySigner](https://mpl-candy-machine.typedoc.metaplex.com/types/ThirdPartySigner.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

将此对象添加到您的 config.json 文件的 guard 部分：

```json
"thirdPartySigner" : {
    "signerKey": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Third Party Signer 守卫包含以下铸造设置：

- **Signer（签名者）**：所需的第三方签名者。此签名者的地址必须与守卫设置中的 Signer Key 匹配。

{% dialect-switcher title="使用 Third Party Signer 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

通过 Umi 库铸造时，只需通过 `signer` 属性提供第三方签名者，如下所示。

```ts
create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: myConfiguredSigner }),
  },
});
```

记得还要使用 myConfiguredSigner 密钥对签署交易。

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_一旦分配了守卫，您就无法使用 sugar 进行铸造——因此没有特定的铸造设置。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_Third Party Signer 守卫不支持 route 指令。_
