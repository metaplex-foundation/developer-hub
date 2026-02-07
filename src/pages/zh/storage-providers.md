---
title: 存储提供商
metaTitle: 存储提供商 | Developer Hub
description: Solana上可用的存储提供商列表。
---

NFT旨在永久存在，永久买卖、持有和欣赏。因此，记录资产的存储需要是_永久性_的。通过Metaplex创建的NFT默认写入可扩展、持久、永久且抗审查的存储，但也有其他选项可用。让我们来看看。

## 存储选项

### Arweave

[Arweave][]是一个去中心化、信任最小化、抗审查的数据存储网络，旨在永久保留数据，非常适合NFT。存储和挖矿费用在上传时支付，以支付永久存储媒体的成本，并分发给参与网络的存储提供商。

#### Arweave存储费用

存储费用基于您在NFT创建时上传到网络的文件总大小。每个NFT由三个文件组成：

1. 资产本身（图像、视频、音频等）
1. 附带的元数据文件（属性等）
1. 生成的[清单在文件之间创建逻辑分组][arweave path manifest]或关系

这些文件的累积大小（以字节为单位）发送到[Arweave存储成本估算服务][arweave price service]，该服务返回以[winstons][]定价的实时估算存储费用。然后将winstons转换为SOL进行支付。

### AWS S3

[Amazon Web Services S3][S3]是一个全球性的、价格合理但中心化的存储提供商。由于S3是中心化的，存储在那里的NFT不具有抗审查性。如果AWS受到法律威胁、决定不支持NFT、倒闭或停止付款，他们可以从服务中删除资产，使NFT持有者没有媒体。对于旨在抗审查和永久的NFT，我们不建议使用S3。但是，它是一个价格合理的选项，因此可能是您需要的。

#### S3存储费用

有关详细信息，请参阅[AWS S3 定价](https://aws.amazon.com/s3/pricing/)。

### IPFS

[InterPlanetary File System][IPFS]或IPFS是一个去中心化、信任最小化、抗审查的点对点超媒体协议，旨在通过创建可升级、有弹性和更开放的网络来保存和发展人类知识。其P2P设计允许文件去重和其他效率。IPFS不是默认的存储选项，因为它不是为永久存储文件而设计的。

#### IPFS存储费用

有关详细信息，请参阅[Infura IPFS 文档](https://infura.io/docs/ipfs)。

### NFT.Storage

[NFT.Storage旗舰产品](https://nft.storage/nft-storage-flagship-product)专注于以一次性低费用永久存储您的NFT。首先铸造您的NFT，然后将您想要存储的NFT数据发送到NFT.Storage进行基金资助的长期Filecoin存储。作为NFT.Storage用户，您可以选择Pinata和Lighthouse进行热存储，[使用NFT.Storage推荐链接](https://nft.storage/blog/announcing-our-new-partnerships-with-pinata-and-lighthouse)支持NFT.Storage的可持续性。您的NFT还将出现在NFT Token Checker中，这是一个工具，使区块浏览器、市场和钱包能够显示NFT合集、代币和CID由NFT.Storage存储的验证。

[NFT.Storage Classic](https://nft.storage/nft-storage-classic)是一个免费服务，通过IPFS提供快速检索，并在去中心化的Filecoin网络上提供热数据存储。截至2024年6月30日，NFT.Storage已正式弃用NFT.Storage Classic的上传，尽管现有数据的检索继续有效。对于已通过NFT.Storage Classic上传的NFT数据，NFT.Storage Gateway使数据可在区块浏览器、市场和dapp中检索。

### Shadow Drive

[GenesysGo Shadow Drive](https://shdw.genesysgo.com/shadow-infrastructure-overview/shadow-drive-overview)是一个去中心化存储网络，旨在与Solana并行运行并无缝集成。存储费用以SPL代币SHDW支付，并允许数据的不可变或可变存储。

[Arweave]: https://arweave.org
[arweave price service]: https://node1.bundlr.network/price/0
[repo]: https://github.com/metaplex-foundation/metaplex
[IPFS]: https://ipfs.io/
[winstons]: https://docs.arweave.org/developers/server/http-api#ar-and-winston
[S3]: https://aws.amazon.com/s3/
[arweave path manifest]: https://github.com/ArweaveTeam/arweave/wiki/Path-Manifests
[nft.storage metaplex doc]: https://nft.storage/docs/how-to/mint-solana
