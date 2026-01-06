---
title: 查找出价、列表和销售
metaTitle: 查找出价、列表和销售 | Metaplex Auction House
description: "解释如何查找出价、列表和销售。"
---
## 简介

在上一页中,我们看到了如何为出价、列表和销售制作收据。这些收据使市场运营商更容易跟踪这些操作。但是如何获取这些出价、列表和销售呢?

提供了三种类型的函数来获取出价、列表和销售:

1. **在拍卖行中查找所有**: 使用这种类型的函数,可以为给定的拍卖行找到所有出价/列表/销售。

2. **按收据查找**: 使用这种类型的函数,可以找到单个出价/列表/销售,给定相应收据账户的地址。

3. **按交易状态查找**: 我们在[概述页面](/zh/legacy-documentation/auction-house)中讨论了交易状态。编码出价/列表/销售订单的交易状态 PDA 账户也可以用于查找相应的操作。

### 在拍卖行中查找所有

有多种标准可以在拍卖行中查找所有出价、列表和销售(或*购买*)。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下是按多个标准查找出价的代码片段。您可以使用任何密钥组合。

```tsx
// 在拍卖行中查找所有出价。
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse });

// 按买方和铸造查找出价。
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse, buyer, mint });

// 按元数据查找出价。
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse, metadata });
```

以下是按多个标准查找列表的代码片段。同样,您可以使用任何密钥组合。

```tsx
// 在拍卖行中查找所有列表。
const listings = await metaplex
  .auctionHouse()
  .findListings({ auctionHouse });

// 按卖方和铸造查找列表。
const listings = await metaplex
  .auctionHouse()
  .findListings({ auctionHouse, seller, mint });
```

以下是按多个标准查找购买的代码片段。它一次只支持 3 个标准,包括必需的 `auctionHouse` 属性。

```ts
// 在拍卖行中查找所有购买。
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse });

// 按买方和铸造查找购买。
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, buyer, mint });

// 按元数据查找购买。
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, metadata });

// 按卖方和买方查找购买。
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, seller, buyer });
```

{% /dialect %}
{% /dialect-switcher %}

### 按收据查找

以下是按相应收据账户地址查找出价、列表和销售的代码片段。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

```tsx
// 按收据查找出价
const nft = await metaplex
  .auctionHouse()
  .findBidByReceipt({ receiptAddress, auctionHouse };

// 按收据查找列表
const nft = await metaplex
  .auctionHouse()
  .findListingByReceipt({ receiptAddress, auctionHouse };

// 按收据查找销售/购买
const nft = await metaplex
  .auctionHouse()
  .findPurchaseByReceipt({ receiptAddress, auctionHouse };
```

{% /dialect %}
{% /dialect-switcher %}

### 按交易状态查找
以下是按相应交易状态 PDA 账户查找出价、列表和销售的代码片段。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

```tsx
// 按交易状态查找出价
const nft = await metaplex
  .auctionHouse()
  .findBidByTradeState({ tradeStateAddress, auctionHouse };

// 按交易状态查找列表
const nft = await metaplex
  .auctionHouse()
  .findListingByTradeState({ tradeStateAddress, auctionHouse };

// 按交易状态查找销售/购买
const nft = await metaplex
  .auctionHouse()
  .findPurchaseByTradeState({ sellerTradeState, buyerTradeState, auctionHouse };
```

{% /dialect %}
{% /dialect-switcher %}

## 结论

我们终于涵盖了管理市场交易的所有方面。到目前为止涵盖的所有内容都使用 JS SDK 的代码片段进行了解释。
