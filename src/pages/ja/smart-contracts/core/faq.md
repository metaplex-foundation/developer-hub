---
title: FAQ
metaTitle: FAQ | Core
description: Metaplex Coreプロトコルに関するよくある質問。
---

## Core AssetとCollectionアカウントにオンチェーンとオフチェーンの両方のデータがあるのはなぜですか？

Core AssetとCollectionアカウントの両方にはオンチェーンデータが含まれていますが、両方とも追加データを提供するオフチェーンJSONファイルを指す`URI`属性も含んでいます。なぜでしょうか？すべてをオンチェーンに保存することはできないのでしょうか？実は、データをオンチェーンに保存することにはいくつかの問題があります：

- オンチェーンでのデータ保存にはレント支払いが必要です。AssetまたはCollectionアカウント内にすべてを保存しなければならない場合、アセットの説明などの長いテキストが含まれる可能性があり、より多くのバイト数が必要となり、アセットの作成が突然高価になります。より多くのバイトを保存することは、より多くのレントを支払わなければならないことを意味するからです
- オンチェーンデータは柔軟性に欠けます。特定のバイト構造を使用してアカウント状態が作成されると、逆シリアル化の問題を引き起こす可能性なしに簡単に変更することはできません。したがって、すべてをオンチェーンに保存しなければならない場合、標準はエコシステムの需要に合わせて進化させることがはるかに困難になります。

したがって、データをオンチェーンとオフチェーンのデータに分割することで、ユーザーは両方の世界の最良の部分を得ることができます。オンチェーンデータはプログラムによって**ユーザーに対する保証と期待を作成する**ために使用でき、オフチェーンデータは**標準化された柔軟な情報を提供する**ために使用できます。しかし、心配する必要はありません。データを完全にオンチェーンに置きたい場合、Metaplexはこの目的のために[Inscriptions](/ja/inscription)も提供しています。

## Coreの使用にコストはかかりますか？

Coreは現在、アセットミントあたり呼び出し者に0.0015 SOLの非常に小さな手数料を請求しています。詳細については、[プロトコル手数料](/ja/protocol-fees)ページで確認できます。

## ソウルバウンドアセットを作成するには？

Core標準では、ソウルバウンドアセットを作成できます。これを実現するには、[Permanent Freeze Delegate](/ja/smart-contracts/core/plugins/permanent-freeze-delegate)プラグインまたは[Oracle Plugin](/ja/smart-contracts/core/external-plugins/oracle)のいずれかを使用できます。

詳しくは[ソウルバウンドアセットガイド](/ja/smart-contracts/core/guides/create-soulbound-nft-asset)をご覧ください！

## アセットを不変に設定するには？

Coreには複数レベルの「不変性」があります。詳細情報と実装方法については、[このガイド](/ja/smart-contracts/core/guides/immutability)で確認できます。

## Metaplex Token MetadataとCoreの違いは何ですか？

CoreはNFT専用に設計された完全に新しい標準であるため、いくつかの注目すべき違いがあります。例えば、Coreはより安価で、より少ないコンピュートユニットが必要で、開発者の視点からより扱いやすいはずです。詳細については[違い](/ja/smart-contracts/core/tm-differences)ページをご覧ください。

## Coreはエディションをサポートしていますか？
はい！[Edition](/ja/smart-contracts/core/plugins/edition)と[Master Edition](/ja/smart-contracts/core/plugins/master-edition)プラグインを使用します。詳細については、[「エディションの印刷方法」ガイド](/ja/smart-contracts/core/guides/print-editions)で確認できます。