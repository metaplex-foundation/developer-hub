---
title: Token Payment 守卫
metaTitle: Token Payment 守卫 | Candy Machine
description: "Token Payment 守卫允许通过向付款人收取一些代币来铸造。"
---

## 概述

**Token Payment** 守卫允许通过从配置的铸币账户向付款人收取一些代币来铸造。代币数量和目标地址也可以配置。

如果付款人没有所需数量的代币来支付，铸造将失败。

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
{% node label="Token Payment" /%}
{% node #guardAmount label="- Amount" /%}
{% node #guardMint label="- Token Mint" /%}
{% node #guardDestinationAta label="- Destination ATA" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardMint" #mint x="270" y="-80" %}
{% node  theme="blue" %}
Mint Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #tokenAccount x="270" y="1" %}
{% node  theme="blue" %}
Token Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #destinationWallet x="258" y="80" %}
{% node  theme="indigo" %}
Destination Wallet {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% edge from="mint" to="tokenAccount" arrow="none" /%}
{% edge from="tokenAccount" to="destinationWallet" arrow="none" /%}

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
{% edge from="guardMint" to="mint" arrow="none" dashed=true /%}
{% edge from="guardDestinationAta" to="tokenAccount" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="tokenAccount" theme="pink" %}
从付款人处转移

x 数量的代币{% .whitespace-nowrap %}
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 守卫设置

Token Payment 守卫包含以下设置：

- **Amount（数量）**：向付款人收取的代币数量。
- **Mint（铸币账户）**：定义我们要支付的 SPL 代币的铸币账户地址。
- **Destination Associated Token Address (ATA)（目标关联代币地址）**：要发送代币到的关联代币账户地址。我们可以使用 **Token Mint** 属性和应接收这些代币的任何钱包地址找到关联代币地址 PDA 来获取此地址。

{% dialect-switcher title="使用 Token Payment 守卫设置 Candy Machine" %}
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
      }),
    }),
  },
});
```

API 参考：[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html)、[TokenPayment](https://mpl-candy-machine.typedoc.metaplex.com/types/TokenPaymentArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

将此对象添加到您的 config.json 文件的 guard 部分：

```json
"tokenPayment" : {
    "amount": number in basis points (e.g. 1000 for 1 Token that has 3 decimals),
    "mint": "<PUBKEY>",
    "destinationAta": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Token Payment 守卫包含以下铸造设置：

- **Mint（铸币账户）**：定义我们要支付的 SPL 代币的铸币账户地址。
- **Destination Associated Token Address (ATA)（目标关联代币地址）**：要发送代币到的关联代币账户地址。

请注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要提供这些铸造设置以及更多作为指令参数和剩余账户的组合。有关更多详细信息，请参阅 [Candy Guard 程序文档](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#tokenpayment)。

{% dialect-switcher title="使用 Token Payment 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Token Payment 守卫的铸造设置，如下所示。

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    tokenPayment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```

API 参考：[mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html)、[TokenPaymentMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/TokenPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_一旦分配了守卫，您就无法使用 sugar 进行铸造——因此没有特定的铸造设置。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_Token Payment 守卫不支持 route 指令。_
