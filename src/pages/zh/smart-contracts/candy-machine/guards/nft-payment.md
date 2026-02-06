---
title: "NFT Payment 守卫"
metaTitle: NFT Payment 守卫 | Candy Machine
description: "NFT Payment 守卫允许通过向付款人收取指定 NFT 集合中的一个 NFT 来铸造。NFT 将被转移到预定义的目标地址。"
---

## 概述

**NFT Payment** 守卫允许通过向付款人收取指定 NFT 集合中的一个 NFT 来铸造。NFT 将被转移到预定义的目标地址。

如果付款人没有来自所需集合的 NFT，铸造将失败。

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
{% node label="nftGate" /%}
{% node #guardRequiredCollection label="- Required Collection" /%}
{% node #guardDestinationWallet label="- Destination Wallet" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardRequiredCollection" #collectionNftMint x="270" y="-100"  %}
{% node theme="blue" %}
Collection NFT {% .whitespace-nowrap %}

Mint Account
{% /node %}
{% node theme="dimmed" %}
Owner: Token Metadata Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="guardRequiredCollection" to="collectionNftMint" /%}

{% node parent="guardDestinationWallet" #destinationWallet x="300"  %}
{% node theme="blue" %}
Destination Wallet {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: System Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="guardDestinationWallet" to="destinationWallet" /%}

{% edge from="collectionNftMint" to="mint-candy-guard" theme="indigo" dashed=true arrow="none" %}
从此集合中转移

1 个 NFT
{% /edge %}

{% edge from="mint-candy-guard" to="destinationWallet" theme="indigo" %}
{% /edge %}
{% node parent="candy-machine" #mint-candy-guard x="600" %}
  {% node theme="pink" %}
    Mint from

    _Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_{% .whitespace-nowrap %}
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

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## 守卫设置

NFT Payment 守卫包含以下设置：

- **Required Collection（所需集合）**：所需 NFT 集合的铸币地址。我们用于支付的 NFT 必须属于此集合。
- **Destination（目标地址）**：将接收所有 NFT 的钱包地址。

{% dialect-switcher title="使用 NFT Payment 守卫设置 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    nftPayment: some({
      requiredCollection: requiredCollectionNft.publicKey,
      destination: umi.identity.publicKey,
    }),
  },
});
```

API 参考：[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html)、[NftPayment](https://mpl-candy-machine.typedoc.metaplex.com/types/NftPayment.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}
将此对象添加到您的 config.json 文件的 guard 部分：

```json
"nftPayment" : {
    "requiredCollection": "<PUBKEY>",
    "destination": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

NFT Payment 守卫包含以下铸造设置：

- **Destination（目标地址）**：将接收所有 NFT 的钱包地址。
- **Mint（铸币账户）**：用于支付的 NFT 的铸币地址。这必须属于所需集合并且必须属于铸造者。
- **Token Standard（代币标准）**：用于支付的 NFT 的代币标准。
- **Token Account（代币账户）**（可选）：您可以选择显式提供将 NFT 与其所有者链接的代币账户。默认情况下，将使用付款人的关联代币账户。
- **Rule Set（规则集）**（可选）：如果我们使用具有规则集的可编程 NFT 支付，则为用于支付的 NFT 的规则集。

请注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要提供这些铸造设置以及更多作为指令参数和剩余账户的组合。有关更多详细信息，请参阅 [Candy Guard 程序文档](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#nftpayment)。

{% dialect-switcher title="使用 NFT Payment 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 NFT Payment 守卫的铸造设置，如下所示。

```ts
import { TokenStandard } from "@metaplex-foundation/mpl-token-metadata";

mintV2(umi, {
  // ...
  mintArgs: {
    nftPayment: some({
      destination,
      mint: nftToPayWith.publicKey,
      tokenStandard: TokenStandard.NonFungible,
    }),
  },
});
```

API 参考：[mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html)、[NftPaymentMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/NftPaymentMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_一旦分配了守卫，您就无法使用 sugar 进行铸造——因此没有特定的铸造设置。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

_NFT Payment 守卫不支持 route 指令。_
