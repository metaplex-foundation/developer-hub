---
title: 收据
metaTitle: 收据 | 拍卖行
description: 解释如何生成拍卖行收据。
---
## 简介

为了帮助市场上的交易/活动跟踪,拍卖行程序支持为列表、出价和销售生成收据。

除了打印收据外,拍卖行在取消相应指令(出价、列表或销售)时也会取消收据。

让我们看看如何打印收据。

## 打印收据

要生成这些收据,应在相应交易(`PrintListingReceipt`、`PrintBidReceipt` 和 `PrintPurchaseReceipt`)之后立即调用收据打印函数。

此外,在取消列表和出价的情况下,应调用 `CancelListingReceipt` 和 `CancelBidReceipt` 指令。调用这两个指令将填充 `ListingReceipt` 和 `BidReceipt` 账户的 `canceled_at` 字段。

> 虽然可以使用标准的 getProgramAccounts 数据流检索收据,但官方建议是使用 Solana 的 AccountsDB 插件来索引和跟踪生成的收据。

可以向上述每个函数引入两个字段以打印相应的收据:

1. `printReceipt`: 这是一个布尔字段,默认为 `true`。当此字段设置为 `true` 时,将为相应函数打印收据。

2. `bookkeeper`: 负责收据的簿记员钱包的地址。换句话说,簿记员是支付收据的钱包。目前它的唯一责任是跟踪收据的付款人,以便将来如果允许关闭账户,程序知道应该将租金退还给谁。此字段默认为 `metaplex.identity()`。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}
以下是为出价、列表和执行销售指令打印收据的示例。

```tsx
// 打印 ListReceipt
await metaplex
    .auctionHouse()
    .createListing({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })

// 打印 BidReceipt
await metaplex
    .auctionHouse()
    .createBid({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })

// 打印 PurchaseReceipt
await metaplex
    .auctionHouse()
    .executeSale({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })
```

{% /dialect %}
{% /dialect-switcher %}

## 结论

现在我们知道如何打印收据以便轻松跟踪交易,我们如何在实践中实际获取有关这些操作的详细信息?让我们在[下一页](/zh/legacy-documentation/auction-house/find)中探索查找拍卖行的出价、列表和销售的方法。
