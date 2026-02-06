---
title: 设置
metaTitle: 拍卖行设置详解 | Metaplex Auction House
description: 详细解释拍卖行设置。
---

## 简介

在这个页面上,我们将讨论拍卖行上可用的设置。这些设置包括一些定义拍卖行如何运作的常规设置、支持拍卖行运作的一些账户(PDA)的定义以及一些为拍卖行程序提供进一步可配置性的更具体设置。

## 权限

权限是控制账户使用的钱包,在这种情况下是拍卖行实例。创建拍卖行时可以提到权限地址。如果未提到,用于创建拍卖行的钱包默认为权限。

权限也可以在创建拍卖行后转移到另一个钱包,从而转移拍卖行的控制权。应谨慎执行此操作。

权限钱包还扮演着保护哪些资产可以在市场上列出和出售的重要角色。当我们讨论 [`requireSignOff`](#requiresignoff) 时,我们将更多地讨论权限的这一功能

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

使用 JS SDK 时,拍卖行的权限将始终默认为用于创建拍卖行的钱包。您可以通过向 authority 属性提供有效的签名者来显式设置此权限。

```tsx
import { Keypair } from "@solana/web3.js";

const myCustomAuthority = Keypair.generate();
const auctionHouseSettings = {
  authority: myCustomAuthority,
};
```

{% /dialect %}
{% /dialect-switcher %}

## 交易设置

这些是可以在拍卖行上设置的特定于交易的设置。这些设置有助于定义用户如何与市场交互:

1. `treasuryMint`: 这定义了要用作市场中交换货币的 SPL 代币的铸造账户。Solana 上的大多数市场通常使用 SOL 作为交换货币和交易资产。使用此设置,拍卖行的权限可以将任何 SPL 代币设置为在给定市场上用于买卖资产。

2. `sellerFeeBasisPoints`: 这定义了市场在给定市场上每个资产的每次销售中获得的二次销售版税。`250` 表示 `2.5%` 版税份额。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

在此代码片段中,我们正在创建一个 spl 代币并将其设置为拍卖行的 `treasuryMint`。我们还使用 `sellerFeeBasisPoints` 设置市场版税。

```tsx
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const myKeypair = Keypair.generate();
const connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed',
);
const myCustomToken = splToken.Token.createMint(connection, myKeypair, myKeypair.publicKey, null, 9, splToken.TOKEN_PROGRAM_ID)
const auctionHouseSettings = {
    treasuryMint: myCustomToken,
    sellerFeeBasisPoints: 150
};
```

{% /dialect %}
{% /dialect-switcher %}

## 辅助账户

拍卖行正常运作需要几个账户。一旦由拍卖行设置,权限可以根据自己的喜好重置和配置这些账户。

有一些由拍卖行程序创建和控制的账户。这些账户是程序派生地址(PDA),您可以在[这里](https://solanacookbook.com/core-concepts/pdas.html)阅读更多相关内容。这些是可用于设置这些账户的两个设置:

1. `auctionHouseFeeAccount`: 存储用于代表用户支付拍卖行相关交易的资金的费用账户的公钥。

2. `auctionHouseTreasury`: 存储每次销售时作为市场版税获得的资金的金库账户的公钥。

还有其他不是由拍卖行程序创建的账户,但对于从拍卖行提取不同类型的资金回到权限至关重要:

1. `feeWithdrawalDestination`: 可以从费用账户提取资金的账户的公钥。

2. `treasuryWithdrawalDestination`: 可以从金库账户提取资金的账户的公钥。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下代码片段构建了四个不同的密钥对,对应于上述讨论的四个账户并设置它们。

```tsx
import { Keypair } from "@solana/web3.js";

const feeAccount = Keypair.generate();
const treasuryAccount = Keypair.generate();
const feeWithdrawalDestination = Keypair.generate();
const treasuryWithdrawalDestination = Keypair.generate();
const auctionHouseSettings = {
    auctionHouseFeeAccount: feeAccount,
    auctionHouseTreasury: treasuryAccount,
    feeWithdrawalDestination: feeWithdrawalDestination,
    treasuryWithdrawalDestination: treasuryWithdrawalDestination,
};
```

{% /dialect %}
{% /dialect-switcher %}

## 需要签署

此设置允许市场控制资产列表和销售。如权限部分所述,拍卖行权限在资产控制中发挥作用。只有在 `requireSignOff = true` 时,才能进行这种审查或集中控制。

当发生这种情况时,市场上的每笔交易: 列表、出价和销售执行都需要由拍卖行权限签名。完全去中心化的市场可以选择将 `requireSignOff` 设置保持为 `false` 以避免该市场上操作的审查或集中控制。

将 `requireSignOff = true` 设置也具有其他权力: 它允许市场实施自己的自定义订单匹配算法。我们将在下一节中更多地讨论这一点。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下代码片段将 `requireSignOff` 设置为 `true`。

```tsx
const auctionHouseSettings = {
    requireSignOff: true
};
```

{% /dialect %}
{% /dialect-switcher %}

## 可以更改销售价格

`canChangeSalePrice` 允许市场更改资产的销售价格,当用户有意免费列出资产或以 0 SOL(或任何其他 SPL 代币)列出时。通过以 0 SOL 列出资产,用户允许市场应用自定义匹配算法,以便为"免费"列出的资产找到最佳价格匹配。

这里要注意的一个重要点是,只有在 `requireSignOff` 也设置为 `true` 时,才能将 `canChangeSalePrice` 设置为 `true`。这是因为在无需许可的列表和出价的情况下,自定义匹配是不可能的。拍卖行应该能够"签署"匹配的出价并执行资产的销售。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下代码片段将 `canChangeSalePrice` 设置为 `true`,同时还确保 `requireSignOff` 也是 `true`

```tsx
const auctionHouseSettings = {
    requireSignOff: true,
    canChangeSalePrice: true
};
```

{% /dialect %}
{% /dialect-switcher %}

## 拍卖人设置

`Auctioneer` 账户是一个 PDA,它使用拍卖行程序的可组合性模式来控制拍卖行实例。

拍卖人有能力使用 `DelegateAuctioneer` 指令给予控制权或对拍卖行实例的委托,我们将在拍卖人指南中讨论(*即将推出*)。

有三个与拍卖人相关的设置可以在拍卖行中配置:

1. `hasAuctioneer`: 如果给定拍卖行实例存在 `Auctioneer` 实例,则为 True。
2. `auctioneerAuthority`: 拍卖人权限密钥。当拍卖行将启用拍卖人时,这是必需的。
3. `auctioneerScopes`: 拍卖人中用户可用的范围列表,例如: 出价、列表、执行销售。只有在拍卖行启用拍卖人时才会生效。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下代码片段将 `hasAuctioneer` 设置为 `true`。它还将 `auctioneerAuthority` 指向生成的公钥,并设置 `auctioneerScopes` 以允许拍卖人代表拍卖行买卖和执行销售。

```tsx
import { Keypair } from "@solana/web3.js";
import { AuthorityScope } from '@metaplex-foundation/mpl-auction-house';

const newAuthority = Keypair.generate();
const auctionHouseSettings = {
    hasAuctioneer: true,
    auctioneerAuthority: newAuthority,
    auctioneerScopes: [
        AuthorityScope.Buy,
        AuthorityScope.Sell,
        AuthorityScope.ExecuteSale,
    ]
};
```

{% /dialect %}
{% /dialect-switcher %}

## 结论

现在我们了解了拍卖行设置,在[下一页](/zh/legacy-documentation/auction-house/manage)上,我们将看到如何使用它们来创建和更新我们自己的拍卖行。
