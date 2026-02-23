---
title: Solanaで100万個のNFTを作成する
metaTitle: Solanaで100万個のNFTを作成する | Bubblegum
description: Metaplex Bubblegumプログラムを使用してSolanaで100万個のcNFTの圧縮NFTコレクションを作成する方法。
---

## 前提条件

- お好みのコードエディタ（Visual Studio Codeを推奨）。
- Node 18.x.x以上。
- JavaScriptとスクリプトの実行に関する基本的な知識。

## 初期設定

このガイドでは、単一ファイルスクリプトに基づいたJavaScriptでの圧縮NFT（cNFT）アセットの作成について説明します。ニーズに合わせて関数を修正・移動する必要があるかもしれません。

### 初期化

選択したパッケージマネージャー（npm、yarn、pnpm、bun）で新しいプロジェクトを初期化し（任意）、プロンプトが表示されたら必要な詳細を入力します。

```bash
npm init
```

### 必要なパッケージ

このガイドに必要なパッケージをインストールします。

{% packagesUsed packages=["umi", "umiDefaults", "bubblegum", "tokenMetadata", "@metaplex-foundation/umi-uploader-irys"] type="npm" /%}

```bash
npm i @metaplex-foundation/umi
```

```bash
npm i @metaplex-foundation/umi-bundle-defaults
```

```bash
npm i @metaplex-foundation/mpl-bubblegum
```

```bash
npm i @metaplex-foundation/mpl-token-metadata
```

```bash
npm i @metaplex-foundation/umi-uploader-irys
```

### インポートとラッパー関数

ここでは、この特定のガイドに必要なすべてのインポートを定義し、すべてのコードが実行されるラッパー関数を作成します。

```ts
import {
  createTree,
  findLeafAssetIdPda,
  getAssetWithProof,
  mintV1,
  mplBubblegum,
  parseLeafFromMintV1Transaction,
} from '@metaplex-foundation/mpl-bubblegum'
import {
  createNft,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  publicKey,
  sol,
} from '@metaplex-foundation/umi'
import { Network, Wallet, umiInstance } from '../scripts/umi'

import fs from 'fs'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

// ラッパー関数を作成
const createCnft = async () => {
  ///
  ///
  ///  すべてのコードはここに記述されます
  ///
  ///
}

// ラッパー関数を実行
createCnft()
```

## Umiのセットアップ

この例では`generatedSigner()`を使用してUmiをセットアップします。この例をReactで試したい場合は、`React - Umi w/ Wallet Adapter`ガイドを通してUmiをセットアップする必要があります。ウォレットのセットアップ以外は、このガイドはfileStorageキーとwallet adapterを使用します。

### 新しいウォレットの生成

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnetアドレス: "https://node1.irys.xyz"
      // devnetアドレス: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// これはテスト用にdevnetでのみSOLをエアドロップします。
console.log('Airdropping 1 SOL to identity')
await umi.rpc.airdrop(umi.identity.publickey, sol(5))
```

### 既存のウォレットをローカルで使用

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnetアドレス: "https://node1.irys.xyz"
      // devnetアドレス: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

// 新しいkeypair signerを生成。
const signer = generateSigner(umi)

// fsを使用して相対パスでファイルシステムをナビゲートし、
// 使用したいウォレットをロードする必要があります。
const walletFile = fs.readFileSync('./keypair.json')

// walletFileをkeypairに変換。
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

// keypairをumiにロード。
umi.use(keypairIdentity(keypair))
```

## cNFTの作成

Solanaでの cNFT の作成は非常に簡単で、実際にミントおよび読み取り操作を実行する前にいくつかの項目を準備する必要があります。

- cNFTデータを保存するMerkle tree。
- データ作成時にデータを保存しているインデクサからデータを読み取ることができるDAS対応RPC。

#### Merkle Tree

Merkle Treeは、ほとんどの場合、cNFTデータの「データベース」と考えることができます。Merkle Treeが作成され、cNFTが満杯になるまで追加できます。

#### DAS RPC

Merkle Tree cNFTデータの性質により、データはSolanaアカウントに保存されず、代わりにレジャー状態に保存されます。データを効果的に読み戻すために、データが作成/変更されるときにすべてのcNFTデータをインデックスするインデクサを使用する必要があります。DAS対応RPCは、DASインデクササービスを実行しているRPCであり、オンデマンドでこのデータをRPCプロバイダに照会することを可能にします。

DASをサポートするRPCプロバイダの完全なリストについては、[RPCプロバイダページ](/ja/solana/rpcs-and-das#rp-cs-with-das-support)をご覧ください。

これらのプロバイダのいずれかから無料のアカウントを取得して、このガイドを実行できます。サインアップしたら、以前の`umi`作成中にRPCインスタンスを置き換える必要があります。

```ts
// 以下にあるアドレスを置き換えます。
const umi = createUmi('https://rpcAddress.com')
```

### Treeの作成

{% callout title="Treeコスト" type="warning" %}
このガイドでは100万個のcNFTを保持するMerkle Treeを作成しており、これには約7.7 SOLのコストが必要です。準備ができるまで、このサンプルはdevnetでのみ試してください。Merkle Treeは閉じることも払い戻すこともできないためです。このコードを実行するには少なくとも7.7 devnet SOLが必要です。これには複数のエアドロップが必要な場合があります。
{% /callout %}

Solanaブロックチェーンに圧縮NFT（cNFT）を保存するには、データを保存する**Merkle Tree**を作成する必要があります。Merkle Treeのサイズとコストは、Merkle Treeの作成者によって決定され、すべてのcNFTオンチェーンストレージは事前に支払われます。これは通常、支払者がSolanaブロックチェーンでNFT自体をミントする時点で必要なストレージスペースとアカウント作成を支払うToken Metadataの**遅延ミント**アプローチとは異なり、bubblegumでは必要なすべてのデータスペースがtree作成時にtree作成者によって決定され、支払われます。

Token Metadataと比較した**Merkle Tree**に関するいくつかのユニークな機能があり、人々が活用できます：

- 1つのMerkle Tree内の複数のコレクションにcNFTをミントできます。

Merkle Treeはコレクションではありません！

Merkle Treeは多くのコレクションからのcNFTを収容でき、将来的に拡張された成長があることを知っているプロジェクトにとって信じられないほど強力です。Merkle Treeが100万個のcNFTを保持し、そのMerkle Treeに1万個のプロジェクトをリリースしてミントすることを決定した場合、将来的に追加のcNFTを書き込んでリリースするために、treeにはまだ99万個のスペースがあります。

```ts
//
// ** Merkle Treeの作成 **
//

const merkleTree = generateSigner(umi)

console.log(
  'Merkle Tree Public Key:',
  merkleTree.publicKey,
  '\nStore this address as you will need it later.'
)

//   以下のパラメータでtreeを作成します。
//   このtreeは約7.7 SOLのコストで作成され、最大
//   100万個のリーフ/nftを収容できます。このスクリプトを実行する前に
//   umi identityアカウントにいくつかのSOLをエアドロップする必要があるかもしれません。

const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 20,
  maxBufferSize: 64,
  canopyDepth: 14,
})

await createTreeTx.sendAndConfirm(umi)
```

### コレクションNFTの作成

cNFTのコレクションは、Token Metadataと元のToken MetadataからミントされたコレクションNFTによって維持および管理されています。cNFTのコレクションを作成し、それにミントしたい場合は、Token MetadataコレクションNFTを作成する必要があります。

```ts
//
// ** Token MetadataコレクションNFTの作成 **
//

//
// NFTをコレクションにミントしたい場合は、まずコレクションNFTを作成する必要があります。
// このステップは任意で、NFTをコレクションにミントしたくない場合や
// 以前にコレクションNFTを作成したことがある場合はスキップできます。
//

const collectionSigner = generateSigner(umi)

// 画像ファイルへのパス
const collectionImageFile = fs.readFileSync('./collection.png')

const genericCollectionImageFile = createGenericFile(
  collectionImageFile,
  'collection.png'
)

const collectionImageUri = await umi.uploader.upload([
  genericCollectionImageFile,
])

const collectionMetadata = {
  name: 'My cNFT Collection',
  image: collectionImageUri[0],
  externalUrl: 'https://www.example.com',
  properties: {
    files: [
      {
        uri: collectionImageUri[0],
        type: 'image/png',
      },
    ],
  },
}

const collectionMetadataUri = await umi.uploader.uploadJson(collectionMetadata)

await createNft(umi, {
  mint: collectionSigner.publicKey,
  name: 'My cNFT Collection',
  uri: 'https://www.example.com/collection.json',
  isCollection: true,
  sellerFeeBasisPoints: percentAmount(0),
}).sendAndConfirm(umi)
```

### cNFT用画像とメタデータのアップロード（任意）

cNFTにはデータと画像が必要です。このコードブロックでは、画像をアップロードし、その画像を`metadata`オブジェクトに追加し、最終的にそのオブジェクトをcNFTで使用するためにIrys経由でArweaveにjsonファイルとしてアップロードする方法を示しています。

```ts
//
//   ** NFTに使用する画像とメタデータのアップロード（任意） **
//

//   すでに画像とメタデータファイルがアップロードされている場合は、このステップを
//   スキップし、mintV1呼び出しでアップロードされたファイルのuriを使用できます。

//   画像ファイルへのパス
const nftImageFile = fs.readFileSync('./nft.png')

const genericNftImageFile = createGenericFile(nftImageFile, 'nft.png')

const nftImageUri = await umi.uploader.upload([genericNftImageFile])

const nftMetadata = {
  name: 'My cNFT',
  image: nftImageUri[0],
  externalUrl: 'https://www.example.com',
  attributes: [
    {
      trait_type: 'trait1',
      value: 'value1',
    },
    {
      trait_type: 'trait2',
      value: 'value2',
    },
  ],
  properties: {
    files: [
      {
        uri: nftImageUri[0],
        type: 'image/png',
      },
    ],
  },
}

const nftMetadataUri = await umi.uploader.uploadJson(nftMetadata)
```

### Merkle TreeにcNFTをミント

treeにcNFTをミントすることは、Solanaブロックチェーン上での追加のアカウント/ストレージコストはかかりません。treeはすでにすべてのcNFTデータを保存するのに十分な部屋で作成されているためです（実際に100万個のcNFT）。ここでの唯一の追加コストは、基本的なSolanaトランザクション手数料のみであり、cNFTを大量にミントすることを信じられないほど効率的にします。

```ts
//
// ** Merkle Treeに圧縮NFTをミント **
//

//
// NFTをコレクションにミントしたくない場合は、collection
// フィールドを`none()`に設定できます。
//

// ミントされるcNFTの所有者。
const newOwner = publicKey('111111111111111111111111111111')

console.log('Minting Compressed NFT to Merkle Tree...')

const { signature } = await mintToCollectionV1(umi, {
  leafOwner: newOwner,
  merkleTree: merkleTree.publicKey,
  collectionMint: collectionSigner.publicKey,
  metadata: {
    name: 'My cNFT',
    uri: nftMetadataUri, // `nftMetadataUri`または以前にアップロードされたuriのいずれかを使用します。
    sellerFeeBasisPoints: 500, // 5%
    collection: { key: collectionSigner.publicKey, verified: false },
    creators: [
      {
        address: umi.identity.publicKey,
        verified: true,
        share: 100,
      },
    ],
  },
}).sendAndConfirm(umi, { send: { commitment: 'finalized' } })
```

### 新しくミントされたcNFTの取得

```ts
//
// ** アセットの取得 **
//

//
// ここでは、ミントトランザクションのリーフインデックスを使用して圧縮NFTのアセットIDを見つけ、
// アセット情報をログに記録します。
//

console.log('Finding Asset ID...')
const leaf = await parseLeafFromMintV1Transaction(umi, signature)
const assetId = findLeafAssetIdPda(umi, {
  merkleTree: merkleTree.publicKey,
  leafIndex: leaf.nonce,
})

console.log('Compressed NFT Asset ID:', assetId.toString())

// DAS付きumiRpcを使用してアセットを取得します。
const asset = await umi.rpc.getAsset(assetId[0])

console.log({ asset })
```

### 100万個のcNFTのミント

100万個のcNFTを保持するMerkle Treeを作成し、そのtreeにNFTをミントする方法を理解したので、前のすべてのステップを取り、必要なデータをArweaveにアップロードし、cNFTをtreeにミントするループを作成するようにコードを調整し始めることができます。

Merkle Treeには100万個のcNFTのスペースがあるため、自由にループしてプロジェクトのニーズに応じてtreeを埋めることができます。

以下は、ループインデックスに基づいてcNFTに保存されたデータをインクリメントするアドレス配列にcNFTをミントする例です。これは粗雑で簡単な例/概念であり、本番環境での使用には修正が必要です。

```ts
  const addresses = [
    "11111111111111111111111111111111",
    "22222222222222222222222222222222",
    "33333333333333333333333333333333",
    ...
  ];

  let index = 0;

  for await (const address in addresses) {
    const newOwner = publicKey(address);

    console.log("Minting Compressed NFT to Merkle Tree...");

    const { signature } = await mintV1(umi, {
      leafOwner: newOwner,
      merkleTree: merkleTree.publicKey,
      metadata: {
        name: `My Compressed NFT #${index}`,
        uri: `https://example.com/${index}.json`, //metadataUriまたはアップロードされたメタデータファイルのuriを使用します
        sellerFeeBasisPoints: 500, // 5%
        collection: { key: collectionSigner.publicKey, verified: false },
        creators: [
          { address: umi.identity.publicKey, verified: true, share: 100 },
        ],
      },
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

    index++;
  }
```

## 完全なコード例

```ts
import {
  createTree,
  findLeafAssetIdPda,
  mintToCollectionV1,
  mplBubblegum,
  parseLeafFromMintV1Transaction
} from '@metaplex-foundation/mpl-bubblegum'
import {
  createNft,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import fs from 'fs'

// ラッパー関数を作成
const createCnft = async () => {
  //
  // ** Umiのセットアップ **
  //

  // この例では、ローカルに保存されたウォレットを使用しています。これは
  // 必要に応じて「新しいウォレットの生成」からのコードに置き換えることができますが、
  // 新しいウォレットに少なくとも7.7 SOLをエアドロップ/送信するようにしてください。

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplBubblegum())
    .use(mplTokenMetadata())
    .use(
      irysUploader({
        // mainnetアドレス: "https://node1.irys.xyz"
        // devnetアドレス: "https://devnet.irys.xyz"
        address: 'https://devnet.irys.xyz',
      })
    )

  // 新しいkeypair signerを生成。
  const signer = generateSigner(umi)

  // fsを使用して相対パスでファイルシステムをナビゲートし、
  // 使用したいウォレットをロードする必要があります。
  const walletFile = fs.readFileSync('./keypair.json')

  // walletFileをkeypairに変換。
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

  // keypairをumiにロード。
  umi.use(keypairIdentity(keypair))

  //
  // ** Merkle Treeの作成 **
  //

  const merkleTree = generateSigner(umi)

  console.log(
    'Merkle Tree Public Key:',
    merkleTree.publicKey,
    '\nStore this address as you will need it later.'
  )

  //   以下のパラメータでtreeを作成します。
  //   このtreeは約7.7 SOLのコストで作成され、最大
  //   100万個のリーフ/nftを収容できます。このスクリプトを実行する前に
  //   umi identityアカウントにいくつかのSOLをエアドロップする必要があるかもしれません。

  console.log('Creating Merkle Tree...')
  const createTreeTx = await createTree(umi, {
    merkleTree,
    maxDepth: 20,
    maxBufferSize: 64,
    canopyDepth: 14,
  })

  await createTreeTx.sendAndConfirm(umi)

  //
  // ** Token Metadataコレクション NFTの作成（任意） **
  //

  //
  // NFTをコレクションにミントしたい場合は、まずコレクションNFTを作成する必要があります。
  // このステップは任意で、NFTをコレクションにミントしたくない場合や
  // 以前にコレクションNFTを作成したことがある場合はスキップできます。
  //

  const collectionSigner = generateSigner(umi)

  // 画像ファイルへのパス
  const collectionImageFile = fs.readFileSync('./collection.png')

  const genericCollectionImageFile = createGenericFile(
    collectionImageFile,
    'collection.png'
  )

  const collectionImageUri = await umi.uploader.upload([
    genericCollectionImageFile,
  ])

  const collectionMetadata = {
    name: 'My cNFT Collection',
    image: collectionImageUri[0],
    externalUrl: 'https://www.example.com',
    properties: {
      files: [
        {
          uri: collectionImageUri[0],
          type: 'image/png',
        },
      ],
    },
  }

  console.log('Uploading Collection Metadata...')
  const collectionMetadataUri = await umi.uploader.uploadJson(
    collectionMetadata
  )

  console.log('Creating Collection NFT...')
  await createNft(umi, {
    mint: collectionSigner,
    name: 'My cNFT Collection',
    uri: 'https://www.example.com/collection.json',
    isCollection: true,
    sellerFeeBasisPoints: percentAmount(0),
  }).sendAndConfirm(umi)

  //
  //   ** NFTに使用する画像とメタデータのアップロード（任意） **
  //

  //   すでに画像とメタデータファイルがアップロードされている場合は、このステップを
  //   スキップし、mintV1呼び出しでアップロードされたファイルのuriを使用できます。

  //   画像ファイルへのパス
  const nftImageFile = fs.readFileSync('./nft.png')

  const genericNftImageFile = createGenericFile(nftImageFile, 'nft.png')

  const nftImageUri = await umi.uploader.upload([genericNftImageFile])

  const nftMetadata = {
    name: 'My cNFT',
    image: nftImageUri[0],
    externalUrl: 'https://www.example.com',
    attributes: [
      {
        trait_type: 'trait1',
        value: 'value1',
      },
      {
        trait_type: 'trait2',
        value: 'value2',
      },
    ],
    properties: {
      files: [
        {
          uri: nftImageUri[0],
          type: 'image/png',
        },
      ],
    },
  }

  console.log('Uploading cNFT metadata...')
  const nftMetadataUri = await umi.uploader.uploadJson(nftMetadata)

  //
  // ** Merkle Treeに圧縮NFTをミント **
  //

  //
  // NFTをコレクションにミントしたくない場合は、collection
  // フィールドを`none()`に設定できます。
  //

  // ミントされるcNFTの所有者。
  const newOwner = publicKey('111111111111111111111111111111')

  console.log('Minting Compressed NFT to Merkle Tree...')

const { signature } = await mintToCollectionV1(umi, {
  leafOwner: newOwner,
  merkleTree: merkleTree.publicKey,
  collectionMint: collectionSigner.publicKey,
  metadata: {
    name: 'My cNFT',
    uri: nftMetadataUri, // `nftMetadataUri`または以前にアップロードされたuriのいずれかを使用します。
    sellerFeeBasisPoints: 500, // 5%
    collection: { key: collectionSigner.publicKey, verified: false },
    creators: [
      {
        address: umi.identity.publicKey,
        verified: true,
        share: 100,
      },
    ],
  },
}).sendAndConfirm(umi, { send: { commitment: 'finalized' } })

  //
  // ** アセットの取得 **
  //

  //
  // ここでは、ミントトランザクションのリーフインデックスを使用して圧縮NFTのアセットIDを見つけ、
  // アセット情報をログに記録します。
  //

  console.log('Finding Asset ID...')
  const leaf = await parseLeafFromMintV1Transaction(umi, signature)
  const assetId = findLeafAssetIdPda(umi, {
    merkleTree: merkleTree.publicKey,
    leafIndex: leaf.nonce,
  })

  console.log('Compressed NFT Asset ID:', assetId.toString())

  // DAS付きumiRpcを使用してアセットを取得します。
  const asset = await umi.rpc.getAsset(assetId[0])

  console.log({ asset })
};

// ラッパー関数を実行
createCnft();
```
