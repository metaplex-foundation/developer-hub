---
title: 代币支付守卫
metaTitle: 代币支付守卫 | Core Candy Machine
description: "Core Candy Machine '代币支付' 守卫通过向付款人收取设定数量的 SPL 代币来允许铸造。"
---

## 概述

**代币支付** 守卫通过从配置的铸币账户向付款人收取一些代币来允许铸造。代币数量和目标地址也可以配置。

如果付款人没有足够数量的代币来支付，铸造将失败。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Core Candy Machine Core 程序 {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
所有者: Core Candy Guard 程序 {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="守卫" theme="mint" z=1/%}
{% node label="代币支付" /%}
{% node #guardAmount label="- 数量" /%}
{% node #guardMint label="- 代币铸币" /%}
{% node #guardDestinationAta label="- 目标 ATA" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardMint" #mint x="270" y="-80" %}
{% node  theme="blue" %}
铸币账户 {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
所有者: 代币程序 {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #tokenAccount x="270" y="1" %}
{% node  theme="blue" %}
代币账户 {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
所有者: 代币程序 {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #destinationWallet x="258" y="80" %}
{% node  theme="indigo" %}
目标钱包 {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
所有者: 系统程序 {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% edge from="mint" to="tokenAccount" arrow="none" /%}
{% edge from="tokenAccount" to="destinationWallet" arrow="none" /%}

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
{% edge from="guardMint" to="mint" arrow="none" dashed=true /%}
{% edge from="guardDestinationAta" to="tokenAccount" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="tokenAccount" theme="pink" %}
从付款人转移

x 数量代币{% .whitespace-nowrap %}
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

代币支付守卫包含以下设置：

- **数量**：向付款人收取的代币数量。
- **铸币**：定义我们要支付的 SPL 代币的铸币账户地址。
- **目标关联代币地址 (ATA)**：将代币发送到的关联代币账户地址。我们可以使用 **代币铸币** 属性和任何应该接收这些代币的钱包地址来查找关联代币地址 PDA 获取此地址。

{% dialect-switcher title="使用代币支付守卫设置 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

请注意，在此示例中，我们使用当前身份作为目标钱包。

```ts
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
create(umi, {
  // ...
  guards: {
    tokenPayment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta: findAssociatedTokenPda(umi, {
        mint: tokenMint.publicKey,
        owner: umi.identity.publicKey,
      })[0],
    }),
  },
});
```

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenPayment](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenPaymentArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

代币支付守卫包含以下铸造设置：

- **铸币**：定义我们要支付的 SPL 代币的铸币账户地址。
- **目标关联代币地址 (ATA)**：将代币发送到的关联代币账户地址。

请注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。有关更多详细信息，请参阅 [Core Candy Guard 程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#tokenpayment)。

{% dialect-switcher title="使用 NFT 销毁守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递代币支付守卫的铸造设置，如下所示。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    tokenPayment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```

API 参考：[mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [TokenPaymentMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 路由指令

_代币支付守卫不支持路由指令。_
