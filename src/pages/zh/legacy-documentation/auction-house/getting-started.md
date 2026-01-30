---
title: 入门
metaTitle: 拍卖行入门指南 | Metaplex Auction House
description: 列出您可以用来管理拍卖行的各种库和 SDK。
---

拍卖行是一个在主网测试版和开发网上运行的 Solana 程序。虽然您可以像与任何其他 Solana 程序一样通过向 Solana 节点发送交易来与其交互,但 Metaplex 已经构建了一些工具使使用它变得更加容易。我们有一个 **CLI** 工具,可以让您管理您的拍卖行,还有一个 **JS SDK** 来帮助您启动用户界面。

## SDK

### JavaScript SDK
**JS SDK** 为 Web 开发人员提供了一个易于使用的 API,用于创建和配置自己的拍卖行。该 SDK 还允许开发人员执行复杂的程序,如出价、列表、从拍卖行金库和费用账户中提取资金等等。

与拍卖行程序交互的主要模块是[拍卖行模块](https://github.com/metaplex-foundation/js/tree/main/packages/js/src/plugins/auctionHouseModule)。该模块包含几种使创建市场变得轻松的方法。您可以通过 `Metaplex` 实例的 `auctionHouse()` 方法访问此客户端。
```ts
const auctionHouseClient = metaplex.auctionHouse();
```

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下是 SDK 提供的一些有用方法:

```ts
// 创建和更新拍卖行
metaplex.auctionHouse().create();
metaplex.auctionHouse().update();

// 在拍卖行上交易
metaplex.auctionHouse().bid();
metaplex.auctionHouse().list();
metaplex.auctionHouse().executeSale();

// 取消出价或列表
metaplex.auctionHouse().cancelBid();
metaplex.auctionHouse().cancelListing();

// 查找出价、列表和购买
metaplex.auctionHouse().findBidBy();
metaplex.auctionHouse().findBidByTradeState();
metaplex.auctionHouse().findListingsBy();
metaplex.auctionHouse().findListingByTradeState();
metaplex.auctionHouse().findPurchasesBy();
```

{% /dialect %}
{% /dialect-switcher %}


拍卖行模块中还存在其他方法,未来将添加更多方法。拍卖行模块的 *README* 将很快更新,包含所有这些方法的详细文档。

**有用的链接:**
* [Github 仓库](https://github.com/metaplex-foundation/js/tree/main/packages/js/src/plugins/auctionHouseModule)
* [NPM 包](https://www.npmjs.com/package/@metaplex-foundation/js)

## 程序库
程序库是使用 Solita 从程序的 IDL 自动生成的。虽然它们要求您了解 Solana 程序并自己编写指令,但它们的优势在于当 SDK 可能需要更长时间来实现新功能时,可以立即使用最新功能。

### JavaScript 程序库
这是一个较低级别的自动生成的 JavaScript 库,每当拍卖行程序(用 Rust 编写)更新时就会生成。

因此,此库适用于希望通过准备指令和直接发送交易来与程序交互的高级开发人员。

**有用的链接:**
* [Github 仓库](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/auction-house/js)
* [NPM 包](https://www.npmjs.com/package/@metaplex-foundation/mpl-auction-house)

## Rust Crate
如果您在 Rust 中开发,您也可以使用 Rust crate 与 Metaplex 的程序交互。由于我们的程序是用 Rust 编写的,这些 crate 应该包含您解析账户和构建指令所需的一切。

这在开发 Rust 客户端时很有帮助,在您自己的程序中对 Metaplex 程序进行 CPI 调用时也很有帮助。

**有用的链接:**
* [Github 仓库](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/auction-house/program)
* [Crate 页面](https://crates.io/crates/mpl-auction-house)
* [API 参考](https://docs.rs/mpl-auction-house/latest/mpl_auction_house/)
