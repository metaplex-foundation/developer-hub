---
title: 他のSVMでcNFTとやりとりする方法
metaTitle: 他のSVMでcNFTとやりとりする方法 | Bubblegum
description: Solanaのdevnetおよびmainnet-beta以外のSolana Virtual Machine（SVM）環境で、Metaplex Bubblegumプログラムを使用して圧縮NFTとやりとりする方法。
---

## 概要

このガイドでは、Solanaのdevnetおよびmainnet-beta以外のSolana Virtual Machine（SVM）環境でJavaScriptを使用して圧縮NFT（cNFT）アセットとやりとりするための特定の要件について詳しく説明します。cNFTの作成のより包括的な概要については、[BubblegumでSolanaで100万個のNFTを作成する](/ja/bubblegum/guides/javascript/how-to-create-1000000-nfts-on-solana)ガイドを参照してください。

### 必要なパッケージ

このガイドでは、`@metaplex-foundation/mpl-bubblegum`の特定のベータnpmパッケージを使用します。以下を使用してインストールしてください：

```bash
npm -i @metaplex-foundation/mpl-bubblegum@4.3.1-beta.0
```

### SVMへの接続

SVMのエンドポイントを使用してumiインスタンスを作成する必要があることに注意してください。

```ts
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const umi = createUmi('<SVM用のRPCエンドポイント>')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  ...
```

### Treeの作成

{% callout title="Treeコスト" type="warning" %}
Treeサイズと使用している特定のSVMによって異なる実際の前払いSOLコストを持つMerkle Treeを作成しています。準備ができるまで、このサンプルはdevnetでのみ試してください。Merkle Treeは閉じることも払い戻すこともできないためです。
{% /callout %}

treeの作成は、Solana devnet/mainnet-betaで使用されるのと同じ`createTree`関数を使用して行うことができます。ただし、デフォルトの`logWrapper`と`compressionProgram`の値をオーバーライドする必要があります。これは次のように簡単に実現できます：

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

// SVM用の正しい`logWrapper`と
// `compressionProgram`を指定してMerkle Treeを作成します。
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

ただし、これらのプログラムIDを自動的に解決するヘルパー関数が提供されており、SolanaのdevnetやmainnetやBubblegumがデプロイされた他のSVMでも動作するため、これが推奨されるアプローチです：

```ts
import {
  getCompressionPrograms,
  createTree,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  generateSigner,
  publicKey,
} from '@metaplex-foundation/umi';

// `getCompressionPrograms`ヘルパー関数を使用してMerkle Treeを作成します。
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

### cNFTのミントと転送

他のSVMでMerkle Treeを作成する場合と同様に、`mintV1`や`transfer`などの他のSDK関数も圧縮プログラムを指定する必要があります。再び`getCompressionPrograms`ヘルパーを使用します。

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

// ミント前にリーフインデックスを取得します。
const leafIndex = Number(
  (await fetchMerkleTree(umi, merkleTree.publicKey)).tree.activeIndex
);

// メタデータを定義します。
const metadata: MetadataArgsArgs = {
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 500, // 5%
  collection: none(),
  creators: [],
};

// cNFTをミントします。
const originalOwner = generateSigner(umi);
const mintTxn = await mintV1(umi, {
  leafOwner: originalOwner.publicKey,
  merkleTree: merkleTree.publicKey,
  metadata,
  ...(await getCompressionPrograms(umi)),
}).sendAndConfirm(umi);

// cNFTを新しい所有者に転送します。
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