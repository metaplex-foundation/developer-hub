---
title: "Token2022 Payment 守卫"
metaTitle: Token2022 Payment 守卫 | Candy Machine
description: "Token2022 Payment 守卫允许通过向付款人收取一些 Token2022 代币来铸造。"
---

## 概述

**Token2022 Payment** 守卫允许通过向付款人收取来自配置铸币账户的一些代币来铸造。可以配置代币数量和目标地址。

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
{% node label="Token 2022 Payment" /%}
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
Owner: Token 2022 Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #tokenAccount x="270" y="1" %}
{% node  theme="blue" %}
Token Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token 2022 Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="guardMint" #destinationWallet x="272" y="80" %}
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
从付款人转移

x 数量代币{% .whitespace-nowrap %}
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

{% callout %}

**Token2022 Payment** 守卫的工作方式与 **Token Payment** 守卫相同——唯一的区别是铸币账户和代币账户应该来自 [SPL Token-2022 程序](https://spl.solana.com/token-2022)。

{% /callout %}

## 守卫设置

Token Payment 守卫包含以下设置：

- **Amount（数量）**：向付款人收取的代币数量。
- **Mint（铸币账户）**：定义我们要用于支付的 SPL 代币的铸币账户地址。
- **Destination Associated Token Address（目标关联代币地址，ATA）**：要将代币发送到的关联代币账户地址。我们可以使用 **Token Mint** 属性和应该接收这些代币的任何钱包地址来查找关联代币地址 PDA 来获取此地址。

{% dialect-switcher title="使用 Token Payment 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

请注意，在此示例中，我们使用当前身份作为目标钱包。

```ts
import { findAssociatedTokenPda } from "@metaplex-foundation/mpl-toolbox";
create(umi, {
  // ...
  guards: {
    token2022Payment: some({
      amount: 300,
      mint: tokenMint.publicKey,
      destinationAta,
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
"token2022Payment" : {
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

- **Mint（铸币账户）**：定义我们要用于支付的 SPL 代币的铸币账户地址。
- **Destination Associated Token Address（目标关联代币地址，ATA）**：要将代币发送到的关联代币账户地址。

请注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要提供这些铸造设置以及更多作为指令参数和剩余账户的组合。有关更多详细信息，请参阅 [Candy Guard 程序文档](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#tokenpayment)。

{% dialect-switcher title="使用 NFT Burn 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Token Payment 守卫的铸造设置，如下所示。

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    token2022Payment: some({
      mint: tokenMint.publicKey,
      destinationAta,
    }),
  },
});
```

API 参考：[mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html)、[TokenPaymentMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/Token2022PaymentMintArgs.html)

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
