---
title: 如何在其他SVM上与cNFT交互
metaTitle: 如何在其他SVM上与cNFT交互 | Bubblegum
description: 如何在Solana devnet和mainnet-beta以外的Solana虚拟机(SVM)环境中使用Metaplex Bubblegum程序与压缩NFT交互。
---

## 概述

本指南详细介绍了在Solana devnet和mainnet-beta以外的Solana虚拟机（SVM）环境中使用JavaScript与压缩NFT（cNFT）资产交互的具体要求。有关创建cNFT的更全面概述，请参阅[使用Bubblegum在Solana上创建1,000,000个NFT](/zh/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana)指南。

### 所需包

本指南使用`@metaplex-foundation/mpl-bubblegum`的特定beta npm包。使用以下命令安装：

```bash
npm -i @metaplex-foundation/mpl-bubblegum@4.3.1-beta.0
```

### 连接到SVM

请注意，您需要使用SVM的端点创建umi实例。

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const umi = createUmi('<SVM的RPC端点>')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  ...
```

### 创建树

{% callout title="树成本" type="warning" %}
我们正在创建一个默克尔树，其真实的前期SOL成本会根据树的大小和您使用的特定SVM而有所不同。在准备好之前，请仅在devnet上尝试此示例，因为默克尔树无法关闭或退款。
{% /callout %}

在另一个SVM上创建树可以使用与Solana devnet/mainnet-beta上相同的`createTree`函数。但是，我们必须覆盖默认的`logWrapper`和`compressionProgram`值。这可以简单地实现为：

```ts
import {
  createTree,
  MPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  MPL_NOOP_PROGRAM_ID,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  publicKey,
} from '@metaplex-foundation/umi';

// 创建默克尔树，指定SVM的正确`logWrapper`和
// `compressionProgram`。
const merkleTree = generateSigner(umi);
const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 3,
  maxBufferSize: 8,
  canopyDepth: 0,
  logWrapper: MPL_NOOP_PROGRAM_ID,
  compressionProgram: MPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
});

await createTreeTx.sendAndConfirm(umi);
```

但是，已提供了一个辅助函数来自动解析这些程序ID，这是推荐的方法，因为它将在Solana devnet/mainnet-beta以及部署了Bubblegum的其他SVM上工作：

```ts
import {
  getCompressionPrograms,
  createTree,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  publicKey,
} from '@metaplex-foundation/umi';

// 使用`getCompressionPrograms`辅助函数创建默克尔树。
const merkleTree = generateSigner(umi);
const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 3,
  maxBufferSize: 8,
  canopyDepth: 0,
  ...(await getCompressionPrograms(umi)),
});

await createTreeTx.sendAndConfirm(umi);
```

### 铸造和转移cNFT

与在另一个SVM上创建默克尔树类似，其他SDK函数如`mintV1`和`transfer`也需要指定压缩程序。同样使用`getCompressionPrograms`辅助函数。

```ts
import {
  fetchMerkleTree,
  getCurrentRoot,
  hashMetadataCreators,
  hashMetadataData,
  transfer,
  getCompressionPrograms,
  createTree,
  MetadataArgsArgs,
  mintV1,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  none,
} from '@metaplex-foundation/umi';

// 在铸造前获取叶子索引。
const leafIndex = Number(
  (await fetchMerkleTree(umi, merkleTree.publicKey)).tree.activeIndex
);

// 定义元数据。
const metadata: MetadataArgsArgs = {
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 500, // 5%
  collection: none(),
  creators: [],
};

// 铸造cNFT。
const originalOwner = generateSigner(umi);
const mintTxn = await mintV1(umi, {
  leafOwner: originalOwner.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata,
  ...(await getCompressionPrograms(umi)),
}).sendAndConfirm(umi);

// 将cNFT转移给新所有者。
const newOwner = generateSigner(umi);
const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree.publicKey);
const transferTxn = await transfer(umi, {
  leafOwner: originalOwner,
  newLeafOwner: newOwner.publicKey,
  merkleTree: merkleTree.publicKey,
  root: getCurrentRoot(merkleTreeAccount.tree),
  dataHash: hashMetadataData(metadata),
  creatorHash: hashMetadataCreators(metadata.creators),
  nonce: leafIndex,
  index: leafIndex,
  proof: [],
  ...(await getCompressionPrograms(umi)),
}).sendAndConfirm(umi);
```
