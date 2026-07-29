---
title: 概要
metaTitle: 概要 | Fixed Price Sale
description: Master Edition NFTからプリントを販売
---

{% callout type="warning" %}

このプログラムは非推奨としてマークされており、Metaplex Foundationチームによって積極的にメンテナンスされていないことにご注意ください。新機能、セキュリティ修正、および後方互換性は保証されません。注意してご使用ください。

{% /callout %}

# はじめに

MetaplexのFixed-Price Saleプログラムは、ブランドが大規模なオーディエンスに配布できるメンバーシップNFTを作成するためのSolanaプログラムです。このNFTは、将来の日付で特定のもの(ゲーム、イベント、ローンチなど)へのアクセスをゲートするために使用できます。
その名前が示すように、プログラムからのすべてのNFTは、単一のマスターエディションNFTから[プリントエディション](/ja/smart-contracts/token-metadata/print)をミントすることで固定価格で販売されます。その結果、すべてのNFTは同じメタデータを持ちます(エディション番号を除く)。

Fixed-Price Saleプログラムは、コレクションによるゲーティングもサポートしています。したがって、クリエイターはコレクションNFTによって販売をゲートできます。つまり、オンチェーンコレクションの保有者のみがNFTを購入できます。販売の複数のステージを持つこともできます：ゲートされたものとゲートされていないもの。例えば、合計5時間の期間を持つマーケットを作成し、最初の3時間をゲートすることで、保有者のみがNFTを購入できます。

🔗 **役立つリンク:**

- [GitHubリポジトリ](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/fixed-price-sale)
- [自動生成API](https://www.npmjs.com/package/@metaplex-foundation/mpl-fixed-price-sale)
- [Rustクレート](https://crates.io/crates/mpl-fixed-price-sale)
