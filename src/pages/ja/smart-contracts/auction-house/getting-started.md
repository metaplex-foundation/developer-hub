---
title: 始めに
metaTitle: 始めに | Auction House
description: Auction Houseの管理に使用できるさまざまなライブラリとSDKをリストします。
---

Auction HouseはMainnet BetaとDevnet上で実行されているSolanaプログラムです。他のSolanaプログラムと同様に、Solanaノードにトランザクションを送信することで対話できますが、Metaplexは作業をはるかに簡単にするツールをいくつか構築しています。オークションハウスを管理できる**CLI**ツールと、ユーザーインターフェースのキックスタートに役立つ**JS SDK**があります。

## SDK

### JavaScript SDK
**JS SDK**は、Web開発者に独自のオークションハウスを作成・設定するための使いやすいAPIを提供します。SDKにより、開発者は入札、リスティング、オークションハウスの財務およびフィーアカウントからの資金の引き出しなど、複雑な手順を実行できます。

Auction Houseプログラムと対話するメインモジュールは[Auction Houseモジュール](https://github.com/metaplex-foundation/js/tree/main/packages/js/src/plugins/auctionHouseModule)です。このモジュールには、マーケットプレイスの作成プロセスを簡単にするいくつかのメソッドが含まれています。このクライアントには、`Metaplex`インスタンスの`auctionHouse()`メソッドを介してアクセスできます。
```ts
const auctionHouseClient = metaplex.auctionHouse();
```

{% dialect-switcher title="JS SDK" %}
{% dialect title="JavaScript" id="js" %}

以下は、SDKが提供する便利なメソッドの一部です：

```ts
// オークションハウスの作成と更新
metaplex.auctionHouse().create();
metaplex.auctionHouse().update();

// オークションハウスでの取引
metaplex.auctionHouse().bid();
metaplex.auctionHouse().list();
metaplex.auctionHouse().executeSale();

// ビッドまたはリスティングのキャンセル
metaplex.auctionHouse().cancelBid();
metaplex.auctionHouse().cancelListing();

// ビッド、リスティング、購入の検索
metaplex.auctionHouse().findBidBy();
metaplex.auctionHouse().findBidByTradeState();
metaplex.auctionHouse().findListingsBy();
metaplex.auctionHouse().findListingByTradeState();
metaplex.auctionHouse().findPurchasesBy();
```

{% /dialect %}
{% /dialect-switcher %}

Auction Houseモジュールには、すでに存在する他のメソッドもあり、将来的にはさらに多くのメソッドが追加される予定です。Auction Houseモジュールの*README*は、これらすべてのメソッドの詳細なドキュメントで間もなく更新されます。

**役立つリンク:**
* [Githubリポジトリ](https://github.com/metaplex-foundation/js/tree/main/packages/js/src/plugins/auctionHouseModule)
* [NPMパッケージ](https://www.npmjs.com/package/@metaplex-foundation/js)

## プログラムライブラリ
プログラムライブラリは、Solitaを使用してプログラムのIDLから自動生成されます。独自の命令を接続してSolanaプログラムを理解する必要がありますが、SDKが実装に少し時間がかかる場合でも、最新の機能をすぐに使用できるという利点があります。

### JavaScriptプログラムライブラリ
これは、Auction Houseプログラム（Rustで記述）が更新されるたびに生成される、より低レベルの自動生成JavaScriptライブラリです。

したがって、このライブラリは、命令を準備してトランザクションを直接送信することでプログラムと対話したい上級開発者を対象としています。

**役立つリンク:**
* [Githubリポジトリ](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/auction-house/js)
* [NPMパッケージ](https://www.npmjs.com/package/@metaplex-foundation/mpl-auction-house)

## Rust Crate
Rustで開発している場合は、Rust crateを使用してMetaplexのプログラムと対話することもできます。プログラムはRustで記述されているため、これらのcrateにはアカウントを解析して命令を構築するために必要なすべてが含まれているはずです。

これは、Rustクライアントを開発する際に役立ちますが、独自のプログラム内でMetaplexプログラムへのCPI呼び出しを行う場合にも役立ちます。

**役立つリンク:**
* [Githubリポジトリ](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/auction-house/program)
* [Crateページ](https://crates.io/crates/mpl-auction-house)
* [APIリファレンス](https://docs.rs/mpl-auction-house/latest/mpl_auction_house/)
