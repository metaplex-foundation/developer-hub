---
title: 概述
metaTitle: 拍卖行概述 | Metaplex Auction House
description: 提供拍卖行程序的概述
---


{% callout type="warning" %}

请注意,该程序已被标记为已弃用,不再由 Metaplex 基金会团队积极维护。不保证新功能、安全修复和向后兼容性。请谨慎使用。

{% /callout %}

## 简介

拍卖行是一个允许用户在 Solana 区块链内交换资产的程序。

在 Solana 上有许多交换资产的方式,那么为什么还需要另一个专注于解决这个问题的程序?让我们深入探讨一下。

该程序的理念是允许任何人创建和配置自己的市场,甚至提供他们自己的自定义逻辑来定义资产应该如何交换。拍卖行协议背后的动机是创建一个健康的市场生态系统,专注于不同的用例,更重要的是,每个市场都以自己的方式允许用户交易资产。

拍卖行程序最重要的方面是它为用户提供资产的所有权。

传统上,一旦用户在市场上列出资产,该资产就会从用户的钱包转移到一个被称为[托管](https://www.investopedia.com/terms/e/escrow.asp)钱包的钱包中,该钱包由市场所有,并保存或**托管**在那里,直到资产被下架或出售。这引发了一些担忧:

- 用户不能在多个市场上列出同一资产
- 用户必须依赖市场的托管合约来安全地保管他们的资产。

这就是拍卖行展现其力量的地方。它是一个交易协议,允许市场实施**无托管**的销售合约,从而为用户提供资产的所有权。

## 创建拍卖行

拍卖行程序可用于通过实例化新的**拍卖行**账户来创建新市场。拍卖行账户是一个[程序派生地址(PDA)](/zh/understanding-programs#program-derived-addresses-pda),它从给定的公钥派生,并可选地从用作货币的 SPL 代币派生(下文将详细介绍)。

   ![Properties.PNG](https://i.imgur.com/2HPpM9g.png#radius)


该账户可以按用户想要的任何方式配置。我们将[在专门的页面中详细讨论这些配置](/zh/legacy-documentation/auction-house/settings),但这里有一些有趣的可配置参数:

- `requireSignOff`: 这允许市场控制哪些资产可以被列出以及哪些出价可以被放置。在每个相关指令上,拍卖行[权限](https://docs.solana.com/staking/stake-accounts#understanding-account-authorities)需要签署交易。
- `canChangeSalePrice`: 此参数仅适用于 `requireSignOff` 设置为 `true` 的拍卖行。这允许拍卖行执行自定义订单匹配以为卖方找到最佳价格。
- `sellerFeeBasisPoints`: 这代表市场在所有交易中所占的份额。例如,如果设置为 `200`,即 2%,那么市场将从其平台上发生的每笔交易中获得 2%。

## 列表和出价

一旦我们有了一个活跃的拍卖行,用户就可以开始在市场上列出资产和对资产出价。

### 列表

当用户列出资产时,拍卖行做两件事:

1. 拍卖行创建一个**卖单**: 换句话说,创建一个名为 `SellerTradeState` 的 PDA,它代表资产的列表。交易状态是特殊的 PDA,与其他 PDA/账户相比非常便宜。这是因为这些 PDA 只存储 1 字节的数据,即 PDA 的 [bump](https://solanacookbook.com/core-concepts/pdas.html#generating-pdas)。所有与列表相关的其他信息,如列表价格、代币数量、铸造账户等,都被哈希到 PDA 的种子中,而不是存储在 PDA 本身内部,因此 PDA 充当该列表的"存在证明",同时非常经济高效。

![](https://i.imgur.com/ki27Ds8.png#radius)

2. 拍卖行还分配另一个 PDA: `programAsSigner` PDA 作为**委托**。委托是 Solana SPL-token 程序的一个功能,[这里](https://spl.solana.com/token#authority-delegation)有详细讨论。委托允许拍卖行在稍后销售完成时从代币账户中提取资产。这样,资产无需托管,可以留在用户的钱包中,直到销售完成。

![](https://i.imgur.com/aIRl7Hb.png#radius)

### 出价

与列表情况类似,当用户出价时,拍卖行创建一个**买单**。换句话说,它创建了 `BuyerTradeState` PDA,代表出价。出价金额(原生或 SPL 代币)需要由市场手动转移到 `BuyerEscrowAccount` PDA,该账户持有此金额直到销售完成。

> 示例:
>
> - Alice 将资产 A 列为 5 SOL。这样做时,拍卖行创建代表出价的 `SellerTradeState` PDA。拍卖行还分配 `programAsSigner` PDA 作为**委托**,从而赋予它在销售完成时从 Alice 的钱包中提取资产的**权限**。
> - Bob 对资产 A 出价 5 SOL。这样做时,市场将 5 SOL 从 Bob 的钱包提取到 `BuyerEscrowAccount` PDA。这笔金额将留在这里直到销售完成。

## 执行销售

一旦我们有了一个列表和至少一个对给定资产的出价,就可以通过调用 `executeSale` 指令来完成交易。

`executeSale` 指令是一个无需许可的曲柄: 换句话说,任何人都可以执行它,无需任何费用或奖励。在执行 `executeSale` 指令时,会发生两件事:

- 拍卖行提取存储在 `BuyerEscrowAccount` 中的出价金额,并将此金额转移给列表者(减去拍卖行费用)。
- 拍卖行分配为**委托**的 `programAsSigner` PDA 从列表者的钱包(更具体地说,从列表者钱包中的代币账户)中提取资产,并将资产转移到出价者的钱包中,从而完成交易。
  ![](https://i.imgur.com/gpAX63m.png#radius)

现在我们知道了 `executeSale` 指令是如何工作的,让我们讨论以不同方式执行 `executeSale` 指令的三种交易场景:

1. _以列表价格"购买"_: 这是用户对列出的资产出价时的情况,出价金额本身就是列出的金额。在这种情况下,`bid` 和 `executeSale` 指令在同一交易中执行,因此出价者实际上"购买"了资产。

> 示例:
>
> - Alice 将资产 A 列为 5 SOL。这为资产 A 创建了一个**卖单**。
> - Bob 注意到列表并对资产 A 出价 5 SOL。这为资产 A 创建了一个**买单**。
> - 这使市场能够在同一交易中对资产出价并执行销售,实际上允许 Bob "购买"资产 A。

2. _以出价价格"出售"_: 这是用户对未列出的资产感兴趣并对其出价的情况。如果资产所有者现在以出价金额列出资产,`list` 和 `executeSale` 指令将在同一指令中执行,因此列表者实际上以请求的价格"出售"了资产。

> 示例:
>
> - Bob 对未列出的资产 A 出价 5 SOL。这为资产 A 创建了一个**买单**。
> - Alice 注意到出价并将资产 A 列为 5 SOL。这为资产 A 创建了一个**卖单**。
> - 这使市场能够在同一交易中列出资产并执行销售,实际上允许 Alice "出售"资产 A。

3. _列表者同意出价_: 这是在给定资产存在**买单**和**卖单**后独立执行 `executeSale` 指令的情况。

> 示例:
>
> - Alice 将资产 A 列为 5 SOL。这为资产 A 创建了一个**卖单**。
> - Bob 对资产 A 出价 5 SOL,不知道 Alice 的列表。这为资产 A 创建了一个**买单**。
> - Alice 注意到匹配的出价并执行销售。

## 拍卖可替代资产

到目前为止,我们已经讨论了使用拍卖行账户交换资产,但我们还没有深入探讨可以以这种方式交换哪些类型的资产。可以在拍卖行中列出的最流行资产是[非同质化代币(NFT)](/zh/smart-contracts/token-metadata/token-standard#the-non-fungible-standard)。

然而,这些并不是唯一可以从拍卖行程序中受益的资产。实际上,资产可以是任何 SPL 代币,只要它的铸造账户附有元数据账户。如果您想了解更多关于 SPL 代币和元数据账户的信息,您可以[在我们的代币元数据程序概述中阅读更多相关内容](/zh/smart-contracts/token-metadata)。

## 使用自定义 SPL 代币购买资产

在上面展示的示例中,我们使用 SOL 作为交换货币来讨论拍卖行程序的工作原理。但 SOL 不是唯一可以配置用于交换资产的货币。拍卖行程序允许市场配置任何 SPL 代币作为其货币。

这可以通过将拍卖行账户中的 `treasuryMint` 参数设置为您喜欢的 SPL 代币的铸造账户来实现。

## 自定义订单匹配

当我们讨论交易状态时,交易状态图中显示了第三个交易状态: `FreeSellerTradeState`。这个交易状态的用途是什么?

在介绍拍卖行程序时,我们简要讨论了拍卖行如何被市场用来提供他们自己关于资产应该如何交换的自定义逻辑。这就是 `FreeSellerTradeState` 的用武之地。

当买家有意将其资产列为 0 SOL / SPL 代币的价格时,将生成 `FreeSellerTradeState`。拍卖行然后可以更改销售价格以匹配大于 0 的匹配出价。这允许拍卖行进行复杂的订单匹配以为卖方找到最佳价格,市场可以编写自己的自定义逻辑来进行此订单匹配。

## 拍卖人

到目前为止我们看到的所有拍卖都有一个共同点。它们被称为[**双重拍卖**](https://blogs.cornell.edu/info2040/2021/11/29/four-common-types-of-auctions/#:~:text=sealed%2Dbid%20auction.-,DOUBLE%20AUCTION,-Both%20buyers%20and)。也就是说,它们是不定时的拍卖,买家和卖家出价和列表,直到他们找到共同点。
然而,还有几种其他形式的拍卖,如英式拍卖和荷兰式拍卖,它们在 Solana 生态系统中变得流行。
拍卖行实现是有意设计为考虑即时销售的,并且不提供开箱即用的其他拍卖类型。

**拍卖人**是由用户编写的自定义合约类型,它使用拍卖行的可组合性模式来控制单个拍卖行账户。

要在拍卖行上启用拍卖人实例,必须首先明确委托它。然后,这个拍卖人实例将能够拦截大多数拍卖行指令,以便注入自己的自定义逻辑。Metaplex 还提供一些拍卖人实现,如定时拍卖。我们将在本文档的后续页面中更详细地讨论这一点。

![](https://i.imgur.com/RyZUfR9.png#radius)

## 下一步

在这个页面上,我们已经介绍了拍卖行协议的基础知识及其拥有的力量。拍卖行还能做更多的事情。

我们将首先列出可用于开始使用该程序的各种库:

- [入门](/zh/legacy-documentation/auction-house/getting-started)

我们将继续深入探讨拍卖行设置以及如何管理拍卖行实例:

- [拍卖行设置](/zh/legacy-documentation/auction-house/settings)
- [管理拍卖行](/zh/legacy-documentation/auction-house/manage)

一旦我们了解了拍卖行的基础知识,我们就可以开始学习如何在拍卖行支持的市场上交易资产:

- [在拍卖行上交易资产](/zh/legacy-documentation/auction-house/trading-assets)
- [管理买方账户](/zh/legacy-documentation/auction-house/buyer-escrow)

我们还将探讨如何跟踪拍卖行上的列表、出价和销售以及如何获取它们:

- [打印收据](/zh/legacy-documentation/auction-house/receipts)
- [查找出价、列表和购买](/zh/legacy-documentation/auction-house/find)

## 其他阅读材料

- [Jordan 的推特帖子](https://twitter.com/redacted_j/status/1453926144248623104)
- [Armani 的推特帖子](https://twitter.com/armaniferrante/status/1460760940454965248)
