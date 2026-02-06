---
title: ビッド、リスティング、販売を検索
metaTitle: 検索 | Auction House
description: "ビッド、リスティング、販売を検索する方法について説明します。"
---
## はじめに

前のページでは、ビッド、リスティング、販売のレシートを作成する方法を見ました。これらのレシートにより、マーケットプレイス運営者がこれらのアクションを追跡しやすくなります。しかし、これらのビッド、リスティング、販売をどのように取得するのでしょうか？

ビッド、リスティング、販売を取得するために、3つのタイプの関数が提供されています：

1. **オークションハウス内のすべてを検索**: このタイプの関数を使用すると、特定のオークションハウスのすべてのビッド / リスティング / 販売を検索できます。

2. **レシートで検索**: このタイプの関数を使用すると、対応するレシートアカウントのアドレスを指定して、単一のビッド / リスティング / 販売を検索できます。

3. **トレードステートで検索**: [概要ページでトレードステートについて説明しました](/legacy-documentation/auction-house)。ビッド / リスティング / 販売注文をエンコードするトレードステートPDAアカウントも、対応するアクションを検索するために使用できます。

### オークションハウス内のすべてを検索

オークションハウス内のすべてのビッド、リスティング、販売（または*購入*）を検索するための複数の基準があります。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下は、複数の基準でビッドを検索するためのスニペットです。任意のキーの組み合わせを使用できます。

```tsx
// オークションハウス内のすべてのビッドを検索
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse });

// 購入者とミントでビッドを検索
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse, buyer, mint });

// メタデータでビッドを検索
const bids = await metaplex
  .auctionHouse()
  .findBids({ auctionHouse, metadata });
```

以下は、複数の基準でリスティングを検索するためのスニペットです。これも、任意のキーの組み合わせを使用できます。

```tsx
// オークションハウス内のすべてのリスティングを検索
const listings = await metaplex
  .auctionHouse()
  .findListings({ auctionHouse });

// 出品者とミントでリスティングを検索
const listings = await metaplex
  .auctionHouse()
  .findListings({ auctionHouse, seller, mint });
```

以下は、複数の基準で購入を検索するためのスニペットです。必須の`auctionHouse`属性を含めて、同時に3つの基準のみをサポートします。

```ts
// オークションハウス内のすべての購入を検索
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse });

// 購入者とミントで購入を検索
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, buyer, mint });

// メタデータで購入を検索
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, metadata });

// 出品者と購入者で購入を検索
const purchases = await metaplex
  .auctionHouse()
  .findPurchases({ auctionHouse, seller, buyer });
```

{% /dialect %}
{% /dialect-switcher %}

### レシートで検索

以下は、対応するレシートアカウントアドレスでビッド、リスティング、販売を検索するためのスニペットです。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

```tsx
// レシートでビッドを検索
const nft = await metaplex
  .auctionHouse()
  .findBidByReceipt({ receiptAddress, auctionHouse };

// レシートでリスティングを検索
const nft = await metaplex
  .auctionHouse()
  .findListingByReceipt({ receiptAddress, auctionHouse };

// レシートで販売 / 購入を検索
const nft = await metaplex
  .auctionHouse()
  .findPurchaseByReceipt({ receiptAddress, auctionHouse };
```

{% /dialect %}
{% /dialect-switcher %}

### トレードステートで検索

以下は、対応するトレードステートPDAアカウントでビッド、リスティング、販売を検索するためのスニペットです。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

```tsx
// トレードステートでビッドを検索
const nft = await metaplex
  .auctionHouse()
  .findBidByTradeState({ tradeStateAddress, auctionHouse };

// トレードステートでリスティングを検索
const nft = await metaplex
  .auctionHouse()
  .findListingByTradeState({ tradeStateAddress, auctionHouse };

// トレードステートで販売 / 購入を検索
const nft = await metaplex
  .auctionHouse()
  .findPurchaseByTradeState({ sellerTradeState, buyerTradeState, auctionHouse };
```

{% /dialect %}
{% /dialect-switcher %}

## まとめ

マーケットプレイスでの取引管理に関するすべての側面をカバーしました。ここまで説明したすべては、JS SDKを使用したコードスニペットで説明されました。
