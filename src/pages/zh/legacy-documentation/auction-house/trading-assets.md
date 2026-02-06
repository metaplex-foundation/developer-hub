---
title: 交易资产
metaTitle: 拍卖行资产交易指南 | Metaplex Auction House
description: 解释如何管理拍卖行上的资产交易。
---
## 简介

在之前的页面中,我们讨论了拍卖行以及如何创建和管理它们。一旦创建了拍卖行,就可以在其上交易资产。市场上的简单交易通常包括三个操作:

1. 卖方列出资产
2. 买方对资产出价
3. 一旦找到列表的匹配出价,就执行销售

在这个页面上,我们将讨论这三个操作,并查看代码示例以轻松执行这些操作。我们还将看到与上述简单交易场景不同的交易场景,并通过代码示例来执行每个场景。最后,我们还将探讨如何取消创建的列表和出价。

让我们从在拍卖行上列出资产开始。

## 列出资产

我们在[概述页面](/zh/legacy-documentation/auction-house)中介绍了列出资产的过程。此操作也称为创建**卖单**。当使用拍卖行创建卖单时,列出的资产保留在卖方的钱包中。这是拍卖行的一个非常重要的功能,因为它允许用户以无托管方式列出资产,因此用户在资产列出时仍保持对资产的保管。

资产卖方可以根据列出资产的价格创建两种类型的列表:

1. **以大于 0 的价格列出**: 当用户以大于 0 SOL(或任何其他 SPL 代币)的价格列出资产时。在这种情况下,卖方的钱包需要是签名者,因此此钱包应该

2. **以 0 的价格列出**: 当用户以 0 SOL(或任何其他 SPL 代币)列出资产时。在这种情况下,如果在[拍卖行设置页面](/zh/legacy-documentation/auction-house/settings)中讨论的 `canChangeSalePrice` 选项设置为 `true`,权限可以代表卖方签名。当发生这种情况时,拍卖行代表卖方找到非 0 的匹配出价。只有在卖方作为签名者时,资产才能以 0 的价格列出和出售。必须有且只有一个签名者;权限或卖方必须签名。

根据列出的代币类型,创建卖单时也可以指定要列出的代币数量:

1. 对于**非同质化代币(NFT)**: 由于每个代币的非同质性和唯一性,只能列出 1 个代币。

2. 对于**可替代资产**: 卖方可以在每个列表中列出超过 1 个代币。例如: 如果 Alice 拥有 5 个 DUST 代币,他们可以在同一卖单中列出 1 个或更多(但小于或等于 5 个)这些 DUST 代币。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

让我们看一个在拍卖行上进行列表或卖单的示例。

在以下代码片段中,我们正在为 3 个 DUST 代币(可替代代币)创建总价为 5 SOL 的卖单。这里要注意的重要一点是,如果我们为 NFT 创建卖单,我们不必指定要列出的代币数量,因为它将默认为 1 个代币。指定任何其他金额将导致错误。

```tsx
await metaplex
    .auctionHouse()
    .createListing({
        auctionHouse,                              // 与此列表相关的拍卖行模型
        seller: Keypair.generate(),                // 列表的创建者
        authority: Keypair.generate(),             // 拍卖行权限
        mintAccount: new PublicKey("DUST...23df"), // 要为其创建列表的铸造账户,用于查找元数据
        tokenAccount: new PublicKey("soC...87g4"), // 与创建列表的资产关联的代币账户地址
        price: 5,                                  // 列表价格
        tokens: 3                                  // 要列出的代币数量,对于 NFT 列表必须是 1 个代币
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 对资产出价

希望购买资产的用户可以对该资产出价或**买单**。

根据资产是否列出,可以有两种类型的买单:

1. **私人出价**: 这是最常见的出价类型。用户对拍卖行上列出的资产感兴趣,对给定资产创建私人出价。此出价与特定拍卖相关,而不是资产本身。这意味着当拍卖关闭时(出价被拒绝且列表被取消,或出价被接受且资产被出售),出价也会关闭。

2. **公开出价**: 用户可以通过跳过 seller 和 tokenAccount 属性对未列出的 NFT 发布公开出价。公开出价特定于代币本身,而不是任何特定的拍卖。这意味着出价可以在拍卖结束后保持活跃,如果它满足该代币后续拍卖的标准,则可以解决。

与卖单的情况一样,买单也可以根据列出的资产类型指定要出价的代币数量:

1. **部分买单**: 我们讨论了列出可替代资产时列出超过 1 个代币的情况。当存在这样的卖单时,用户可以出价只购买列出代币的一部分,或进行部分买单。例如: 如果 Alice 以 `5 SOL` 的价格列出了 `3 DUST` 代币,Alice 可以出价以 `2 SOL` 购买 `2 DUST` 代币。换句话说,用户可以创建小于卖单的 `token_size` 的所述资产的买单。

2. **完整买单**: 这是买方创建出价以购买卖单中列出的所有代币的情况。在非同质化资产(NFT)的情况下,每个卖单只能列出 1 个代币,因此创建完整买单。在可替代代币的情况下也可以创建完整买单。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

让我们看一个在拍卖行上进行出价或买单的示例。

在以下代码片段中,我们正在为 3 个 DUST 代币(可替代代币)创建总价为 5 SOL 的买单。这里要注意的重要一点是,如果我们为 NFT 创建卖单,我们不必指定要列出的代币数量,因为它将默认为 1 个代币。指定任何其他金额将导致错误。

这是私人出价的示例,因为我们正在指定卖方账户和代币账户。如果在创建出价时未指定其中任何一个,出价将是公开的。

```tsx
await metaplex
    .auctionHouse()
    .createBid({
        auctionHouse,                              // 与此列表相关的拍卖行模型
        buyer: Keypair.generate(),                 // 出价的创建者
        seller: Keypair,generate(),                // 持有为其创建出价的资产的账户地址,如果未提供此项或 tokenAccount,则出价将是公开的。
        authority: Keypair.generate(),             // 拍卖行权限
        mintAccount: new PublicKey("DUST...23df"), // 要为其创建出价的铸造账户
        tokenAccount: new PublicKey("soC...87g4"), // 与创建出价的资产关联的代币账户地址,如果未提供此项或 seller,则出价将是公开的。
        price: 5,                                  // 买方价格
        tokens: 3                                  // 要出价的代币数量,对于 NFT 出价必须是 1 个代币
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 执行资产销售

现在我们知道如何创建列表(卖单)和出价(买单),我们可以学习如何执行资产销售。当执行资产销售时:

1. 拍卖行将出价金额从买方托管账户转移到卖方的钱包。我们将更多地讨论买方托管账户以及市场权限如何管理该账户中的资金。

2. 拍卖行将资产从卖方的钱包转移到买方的钱包。

现在我们知道了销售执行的含义,让我们探讨使用拍卖行出售资产的不同交易场景。我们已经在[概述页面]中详细讨论了它们,但这里除了每个场景的代码片段外,还有一个简要说明:

1. **直接购买**,或*以列表价格"购买"*: 这是当用户对列出的资产出价时执行销售的情况。换句话说,直接购买操作在给定资产上创建出价,然后在创建的出价和列表上执行销售。

    在大多数情况下,当买方以资产的列出价格出价时,将发生此场景。但可能存在市场具有基于阈值工作的自定义订单匹配算法的情况。例如: 市场可能有一个规则,一旦有一个出价在列出价格的 +-20% 范围内,就执行给定资产的销售。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下是对列出资产感兴趣的用户直接购买资产的示例。

```tsx
const listing = await metaplex
    .auctionHouse()
    .findListingByReceipt({...}) // 我们将在接下来的页面中看到如何获取列表

const directBuyResponse = await metaplex
    .auctionHouse()
    .buy({
        auctionHouse,                   // 在其中创建出价并执行销售的拍卖行
        buyer: Keypair.generate(),      // 出价的创建者,不应与创建列表的卖方相同
        authority: Keypair.generate(),  // 拍卖行权限,如果这是签名者,
                                        // 交易费用将从拍卖行费用账户支付
        listing: listing,               // 销售中使用的列表,我们只需要
                                        // `Listing` 模型的一个子集,但我们需要足够的信息
                                        // 关于其设置以知道如何执行销售。
        price: 5,                       // 买方价格
    });
```

{% /dialect %}
{% /dialect-switcher %}

1. **直接出售**,或*以出价价格"出售"*: 与直接购买的情况相对应,这是用户对未列出的资产感兴趣并对其出价的情况。如果资产所有者现在以出价金额列出资产,则可以执行销售,从而直接出售资产。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下是对资产出价感兴趣的用户直接出售资产的示例。

```tsx
const bid = await metaplex
    .auctionHouse()
    .findBidByReceipt({...}) // 我们将在接下来的页面中看到如何获取出价

const directSellResponse = await metaplex
    .auctionHouse()
    .sell({
        auctionHouse,                              // 在其中创建列表并执行销售的拍卖行
        seller: Keypair.generate(),                // 列表的创建者,必须有且只有一个签名者;权限或卖方必须签名。
        authority: Keypair.generate(),             // 拍卖行权限,如果这是签名者,
                                                   // 交易费用将从拍卖行费用账户支付
        bid: bid,                                  // 销售中使用的公开出价,我们只需要
                                                   // `Bid` 模型的一个子集,但我们需要足够的信息
                                                   // 关于其设置以知道如何执行销售。
        sellerToken: new PublicKey("DUST...23df")  // 要出售的资产的代币账户,公开出价不
                                                   // 包含代币,因此必须通过此参数从外部提供
    });
```

{% /dialect %}
{% /dialect-switcher %}

1. **独立销售执行**,或*列表者同意出价*: 这是在给定资产存在**买单**(出价)和**卖单**(列表)后独立执行销售的情况。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下是独立销售执行的示例。

```tsx
const listing = await metaplex
    .auctionHouse()
    .findListingByReceipt({...}) // 我们将在接下来的页面中看到如何获取列表

const bid = await metaplex
    .auctionHouse()
    .findBidByReceipt({...})     // 我们将在接下来的页面中看到如何获取出价

const executeSaleResponse = await metaplex
    .auctionHouse()
    .executeSale({
        auctionHouse,                   // 在其中创建出价并执行销售的拍卖行
        authority: Keypair.generate(),  // 拍卖行权限,如果这是签名者,
                                        // 交易费用将从拍卖行费用账户支付
        listing: listing,               // 销售中使用的列表,我们只需要
                                        // `Listing` 模型的一个子集,但我们需要足够的信息
                                        // 关于其设置以知道如何执行销售。
        bid: bid,                       // 销售中使用的公开出价,我们只需要
                                        // `Bid` 模型的一个子集,但我们需要足够的信息
                                        // 关于其设置以知道如何执行销售。
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 取消列表和出价

到目前为止,我们已经看到了如何创建出价和列表,以及如何在拍卖行中执行资产销售。在拍卖行中创建列表和出价后,可以通过权限取消它们。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下是使用 JS SDK 取消出价和列表的示例。

```tsx
const listing = await metaplex
    .auctionHouse()
    .findListingByReceipt({...}) // 我们将在接下来的页面中看到如何获取列表

const bid = await metaplex
    .auctionHouse()
    .findBidByReceipt({...})     // 我们将在接下来的页面中看到如何获取出价

// 取消出价
const cancelBidResponse = await metaplex
    .auctionHouse()
    .cancelBid({
        auctionHouse,            // 在其中取消出价的拍卖行
        bid: bid,                // 要取消的出价
    });

// 取消列表
const cancelListingResponse = await metaplex
    .auctionHouse()
    .cancelListing({
        auctionHouse,            // 在其中取消列表的拍卖行
        listing: listing,        // 要取消的列表
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 结论

在这个页面中,我们涵盖了管理市场上资产交易的所有组件。

我们还没有讨论的一个关键点是买方托管账户,当买方对资产出价时需要托管或临时持有买方的资金。这些资金如何在此账户中管理以及谁负责跟踪这些资金?让我们在[下一页](/zh/legacy-documentation/auction-house/buyer-escrow)中找出答案。
