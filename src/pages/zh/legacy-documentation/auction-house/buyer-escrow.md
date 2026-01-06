---
title: 管理买方托管账户
metaTitle: 管理买方托管账户 | 拍卖行
description: "解释如何管理买方托管账户。"
---
## 简介

在上一页中,我们讨论了如何进行出价和列表,以及执行资产销售。当我们讨论销售执行时,我们简要提到了**买方托管账户**。这个账户的用途是什么,为什么我们需要讨论它?

此账户是一个程序派生地址(PDA),充当托管,临时持有出价者的资金(SOL 或 SPL 代币)。这些资金等于出价价格,并存储在此 PDA 中,直到销售完成。当执行销售时,拍卖行将这些资金从买方托管账户 PDA 转移到卖方的钱包。

现在的问题是: 这些资金是否在出价时自动从出价者的钱包转移到买方托管账户?

答案是否定的。这就是我们需要讨论管理买方托管账户及其中资金的原因。这些资金由拍卖行权限管理。让我们看看权限如何管理此账户。

## 获取余额

在上一节的讨论中,拍卖行有责任确保买方托管账户中有足够的资金,以便销售完成。

为此,首先拍卖行应该知道买方托管账户中目前有多少资金。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下是一个代码片段,它获取给定拍卖行的买方托管账户余额。

```tsx
import { Keypair } from "@solana/web3.js";

const buyerBalance = await metaplex
    .auctionHouse()
    .getBuyerBalance({
        auctionHouse,
        buyerAddress: Keypair.generate() // 买方地址
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 存入资金

此时,拍卖行知道与用户对应的买方托管账户中目前有多少资金。

现在,如果此用户对资产出价,拍卖行可以决定在资金不足的情况下从用户的钱包转移资金到买方托管账户。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

让我们看看如何将资金从买方钱包转移到拍卖行的买方托管账户。

```tsx
import { Keypair } from "@solana/web3.js";

const depositResponse = await metaplex
    .auctionHouse()
    .depositToBuyerAccount({
        auctionHouse,              // 托管买方存入资金的拍卖行。
                                   // 我们只需要 `AuctionHouse` 模型的一个子集,
                                   // 但我们需要关于其设置的足够信息
                                   // 以知道如何存入资金。
        buyer: metaplex.identity() // 存入资金的买方。这需要一个签名者
        amount: 10                 // 存入的资金金额。这可以是 SOL
                                   // 或拍卖行使用的 SPL 代币作为货币。
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 提取资金

拍卖行还应该能够将资金从买方托管钱包提取回买方的钱包,以防用户想要取回他们的资金和/或已取消他们的出价。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

让我们看看如何将资金从买方托管钱包提取到给定拍卖行的买方钱包。

```tsx
import { Keypair } from "@solana/web3.js";

const withdrawResponse = await metaplex
    .auctionHouse()
    .withdrawFromBuyerAccount({
        auctionHouse,              // 托管买方提取资金的拍卖行
        buyer: metaplex.identity() // 提取资金的买方
        amount: 10                 // 提取的资金金额。这可以是 SOL
                                   // 或拍卖行使用的 SPL 代币作为货币。
    });
```

{% /dialect %}
{% /dialect-switcher %}

## 结论

现在我们还讨论了如何管理买方托管账户中的资金,我们已经非常接近能够完全启动和控制我们自己的市场。

目前缺少的一个重要信息: 市场如何跟踪列表、出价和销售?拍卖行程序有一些东西可以做到这一点,即[收据](/zh/legacy-documentation/auction-house/receipts)。
