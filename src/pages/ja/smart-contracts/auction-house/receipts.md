---
title: レシート
metaTitle: レシート | Auction House
description: Auction Houseレシートの生成方法について説明します。
---
## はじめに

マーケットプレイスでのトランザクション/アクティビティ追跡を支援するために、Auction Houseプログラムはリスティング、ビッド、販売のレシート生成をサポートしています。

レシートの印刷に加えて、Auction Houseは対応する命令（ビッド、リスティング、または販売）がキャンセルされたときにレシートをキャンセルします。

レシートがどのように印刷されるかを見てみましょう。

## レシートの印刷

これらのレシートを生成するには、対応するトランザクション（`PrintListingReceipt`、`PrintBidReceipt`、および`PrintPurchaseReceipt`）の直後にレシート印刷関数を呼び出す必要があります。

さらに、キャンセルされたリスティングとビッドの場合、`CancelListingReceipt`と`CancelBidReceipt`命令を呼び出す必要があります。これら2つの命令を呼び出すと、`ListingReceipt`と`BidReceipt`アカウントの`canceled_at`フィールドが埋められます。

> レシートは標準のgetProgramAccountsデータフローを使用して取得できますが、公式の推奨事項は、SolanaのAccountsDBプラグインを使用して生成されたレシートをインデックス化および追跡することです。

上記の各関数にレシートを印刷するために導入できる2つのフィールドがあります：

1. `printReceipt`: これはデフォルトで`true`になるブールフィールドです。このフィールドが`true`に設定されている場合、対応する関数のレシートが印刷されます。

2. `bookkeeper`: レシートを担当するブックキーパーウォレットのアドレス。つまり、ブックキーパーはレシートの支払いを行ったウォレットです。現時点でのその唯一の責任は、将来アカウントを閉じることが許可された場合にプログラムが家賃の払い戻しを受けるべき人を知ることができるように、レシートの支払者を追跡することです。このフィールドはデフォルトで`metaplex.identity()`になります。

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}
以下は、ビッド、リスト、販売実行命令のレシートを印刷する例です。

```tsx
// ListReceiptを印刷
await metaplex
    .auctionHouse()
    .createListing({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })

// BidReceiptを印刷
await metaplex
    .auctionHouse()
    .createBid({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })

// PurchaseReceiptを印刷
await metaplex
    .auctionHouse()
    .executeSale({
        printReceipt: true,
        bookkeeper: metaplex.identity()
    })
```

{% /dialect %}
{% /dialect-switcher %}

## まとめ

簡単なトランザクション追跡のためにレシートを印刷する方法がわかったので、実際にこれらのアクションに関する詳細をどのように取得するのでしょうか？Auction Houseのビッド、リスティング、販売を検索する方法を[次のページ](find)で探ってみましょう。
