---
title: ストレージプロバイダー
metaTitle: ストレージプロバイダー | Developer Hub
description: Solanaで利用可能なストレージプロバイダーのリスト。
---

NFTは永続的に存在し、永続的に売買、保有、楽しまれることを意図しています。そのため、資産が記録されているストレージは_永続的_である必要があります。Metaplexを通じて作成されたNFTは、デフォルトでスケーラブルで耐久性があり、永続的で検閲耐性のあるストレージに書き込まれますが、他のオプションも利用できます。見てみましょう。

## ストレージオプション

### Arweave

[Arweave][]は、データを永続的に保持するように設計された分散型で信頼最小化された検閲耐性のあるデータストレージネットワークであり、NFTに最適です。メディアを永続的に保存するコストをカバーするために、ストレージと採掘手数料はアップロード時に支払われ、ネットワークに参加しているストレージプロバイダーに配布されます。

#### Arweaveストレージ手数料

ストレージ手数料は、NFT作成時にネットワークにアップロードするファイルの総サイズに基づいています。各NFTは3つのファイルで構成されています：

1. アセット自体（画像、ビデオ、オーディオなど）
1. 付随するメタデータファイル（属性など）
1. 生成された[マニフェストはファイル間の論理的なグループ化][arweave path manifest]または関係を作成します

これらのファイルの累積サイズ（バイト単位）は、リアルタイムでの推定ストレージ料金を返す[Arweaveストレージコスト推定サービス][arweave price service]に送信され、[winstons][]で価格設定されます。その後、winstonsをSOLに変換して支払いを行います。

### AWS S3

[Amazon Web Services S3][S3]は、グローバルで手頃ですが中央集権的なストレージプロバイダーです。S3は中央集権的であるため、そこに保存されたNFTは検閲耐性がありません。AWSが法的脅威を受けたり、NFTをサポートしないことを決定したり、倒産したり、支払いを停止したりすると、彼らはサービスから資産を削除でき、NFTの保有者がメディアなしに残される可能性があります。検閲耐性があり永続的であることを意図したNFTには、S3の使用をお勧めしません。ただし、手頃なオプションなので、ニーズに応じて必要なものかもしれません。

#### S3ストレージ手数料

詳細については、[https://aws.amazon.com/s3/pricing/](https://aws.amazon.com/s3/pricing/)をご覧ください。

### IPFS

[InterPlanetary File System][IPFS]またはIPFSは、アップグレード可能で回復力があり、よりオープンなWebを作ることで人類の知識を保存・成長させるように設計された分散型で信頼最小化された検閲耐性のあるピアツーピアハイパーメディアプロトコルです。そのP2P設計によりファイルの重複除去やその他の効率性が可能になります。IPFSはファイルを永続的に保存するように設計されていないため、デフォルトのストレージオプションではありません。

#### IPFSストレージ手数料

詳細については、[https://infura.io/docs/ipfs](https://infura.io/docs/ipfs)をご覧ください。

### NFT.Storage

[NFT.Storage旗艦プロダクト](https://nft.storage/nft-storage-flagship-product)は、1回限りの低料金でNFTの永続的な保存に焦点を当てています。まずNFTをミントしてから、基金支援による長期Filecoinストレージで保存するNFTデータをNFT.Storageに送信します。NFT.Storageユーザーとして、ホットストレージのためにPinataとLighthouseを選択し、[こちらのNFT.Storage紹介リンクを使用](https://nft.storage/blog/announcing-our-new-partnerships-with-pinata-and-lighthouse)することで、NFT.Storageの持続をサポートすることで、プラットフォームをサポートします。あなたのNFTは、ブロックエクスプローラー、マーケットプレイス、ウォレットがNFTコレクション、トークン、CIDがNFT.Storageによって保存されていることの検証を表示するツールであるNFTトークンチェッカーにも含まれます。

[NFT.Storage Classic](https://nft.storage/nft-storage-classic)は、IPFSを通じた高速な取得と分散されたFilecoinネットワーク上でホットデータストレージを提供する無料サービスです。2024年6月30日現在、NFT.StorageはNFT.Storage Classicのアップロードを正式に廃止しましたが、既存データの取得は引き続き動作しています。NFT.Storage Classicを通じてすでにアップロードされたNFTデータについては、NFT.Storage Gatewayが、ブロックエクスプローラー、マーケットプレイス、dappでデータを取得可能にします。

### Shadow Drive

[GenesysGo Shadow Drive](https://shdw.genesysgo.com/shadow-infrastructure-overview/shadow-drive-overview)は、Solanaと並行して実行し、シームレスに統合するように設計された分散ストレージネットワークです。ストレージ手数料はSPLトークンSHDWで支払われ、データの不変または可変ストレージが可能です。

[Arweave]: https://arweave.org
[arweave price service]: https://node1.bundlr.network/price/0
[repo]: https://github.com/metaplex-foundation/metaplex
[IPFS]: https://ipfs.io/
[winstons]: https://docs.arweave.org/developers/server/http-api#ar-and-winston
[S3]: https://aws.amazon.com/s3/
[arweave path manifest]: https://github.com/ArweaveTeam/arweave/wiki/Path-Manifests
[nft.storage metaplex doc]: https://nft.storage/docs/how-to/mint-solana