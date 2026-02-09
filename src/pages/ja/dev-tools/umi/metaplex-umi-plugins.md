---
title: Metaplex Umiプラグイン
metaTitle: Metaplex Umiプラグイン | Umi
description: Metaplexが構築したUmiプラグインの概要。
---

MetaplexプログラムはKinobiを介して生成され、Umiを通してプラグインとして動作し実行されます。Metaplexライブラリの各プログラムは、Solanaエコシステム内で異なる用途と目的を持っています。Umiで使用できるより多くのプラグインを[インターフェース実装ページ](/ja/dev-tools/umi/implementations)で見つけることができます！

## [Bubblegum (cNFT)](/ja/smart-contracts/bubblegum)

BubblegumはSolanaブロックチェーン上でcNFT（圧縮NFT）の作成と管理を扱うMetaplexプログラムです。cNftsは、Token Metadataの従来のNFTやpNFTよりも作成とミントが安価です。

プログラム機能セットには以下が含まれます：

- ミンティング
- アップデート
- 転送
- バーン
- デリゲーション
- コレクション管理

## [Candy Machine](/ja/smart-contracts/candy-machine)

Candy Machineは「販売」NFTおよびpNFTドロップの設定を可能にするMetaplexプログラムです。ユーザーはあなたのcandy machineから購入し、内部にあるランダムなNFT/pNFTを入手できます。

プログラム機能セットには以下が含まれます：

- NFTのミンティング
- NFTの販売

## [Core](/ja/smart-contracts/core)

Coreは単一アカウント設計を使用する次世代Solana NFT標準で、代替手段と比較してミンティングコストを削減し、Solanaネットワークの負荷を改善します。また、開発者がアセットの動作と機能を変更できる柔軟なプラグインシステムも持っています。

プログラム機能セットには以下が含まれます：

- ミンティング
- アップデート
- 転送
- バーン
- デリゲーション
- 内部および外部プラグインの管理
- デシリアライゼーション
- コレクション管理

## [DAS API](/ja/dev-tools/das-api)

非圧縮NFTの状態データはすべてオンチェーンアカウントに格納されます。これは規模が大きくなると高額になります。圧縮NFTは、状態データをオンチェーンのMerkleツリーにエンコードすることで容量を節約します。詳細なアカウントデータはオンチェーンには格納されず、RPCプロバイダーが管理するデータストアに格納されます。Metaplex Digital Asset Standard（DAS）APIは、標準（Token Metadata）と圧縮（Bubblegum）アセットの両方をサポートし、Solana上のデジタルアセットとやり取りするための統一インターフェースを表します。

プログラム機能セットには以下が含まれます：

- 圧縮NFTを含む高速データ取得

## [Inscriptions](/ja/smart-contracts/inscription)

Metaplex Inscriptionプログラムは、ブロックチェーンをデータストレージの方法として使用し、Solanaに直接データを書き込むことを可能にします。Inscriptionプログラムは、このデータストレージをオプションでNFTにリンクすることも可能です。この概要では、このプログラムの動作方法と、さまざまな機能を高レベルで活用する方法について説明します。

プログラム機能セットには以下が含まれます：

- Solanaブロックチェーンへのデータの直接書き込み
- Solanaブロックチェーンからのinscriptionデータの読み取り

## [Token Metadata (NFT, pNFT)](/ja/smart-contracts/token-metadata)

Token MetadataはNFTとpNFTの作成と管理を扱うMetaplexプログラムです。Token Metadata NFTはSolana上の最初のnft標準であり、pNFTはロイヤリティ執行を含めるために後に作成されました。

プログラム機能セットには以下が含まれます：

- データ取得
- ミンティング
- アップデート
- 転送
- バーン
- デリゲーション
- コレクション管理

## [Toolbox](/ja/dev-tools/umi/toolbox)

Mpl Toolboxには、分散アプリケーションを立ち上げて実行するために必要なSolanaとMetaplexプログラムが多数含まれています。

- SOL転送
- SPLトークンの作成/管理
- LUT作成/管理（アドレスルックアップテーブル）
- コンピュートユニットと価格の設定/変更
