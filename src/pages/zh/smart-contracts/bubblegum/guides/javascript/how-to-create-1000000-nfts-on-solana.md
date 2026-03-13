---
title: 在Solana上创建100万个NFT
metaTitle: 在Solana上创建100万个NFT | Bubblegum
description: 如何使用Metaplex Bubblegum程序在Solana上创建100万个cNFT的压缩NFT集合。
---

## 先决条件

- 您选择的代码编辑器（推荐Visual Studio Code）。
- Node 18.x.x或更高版本。
- 基本的Javascript知识和运行脚本的能力。

## 初始设置

本指南将介绍基于单文件脚本使用Javascript创建压缩NFT（cNFT）资产。您可能需要修改和移动函数以适应您的需求。

### 初始化

首先使用您选择的包管理器（npm、yarn、pnpm、bun）初始化一个新项目（可选），并在提示时填写所需的详细信息。

```bash
npm init
```

### 所需包

安装本指南所需的包。

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

### 导入和包装函数

在这里，我们将定义本指南所需的所有导入，并创建一个包装函数，所有代码都将在其中执行。

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

// 创建包装函数
const createCnft = async () => {
  ///
  ///
  ///  所有代码都将放在这里
  ///
  ///
}

// 运行包装函数
createCnft()
```

## 设置Umi

此示例将介绍使用`generatedSigner()`设置Umi。如果您希望在React中尝试此示例，您需要通过`React - Umi w/ Wallet Adapter`指南设置Umi。除了钱包设置外，本指南将使用fileStorage密钥和钱包适配器。

### 生成新钱包

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // 主网地址："https://node1.irys.xyz"
      // devnet地址："https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// 这将仅在devnet上空投SOL用于测试。
console.log('Airdropping 1 SOL to identity')
await umi.rpc.airdrop(umi.identity.publickey, sol(5))
```

### 使用现有本地钱包

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // 主网地址："https://node1.irys.xyz"
      // devnet地址："https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

// 生成新的密钥对签名者。
const signer = generateSigner(umi)

// 您需要使用fs并导航文件系统
// 通过相对路径加载您希望使用的钱包。
const walletFile = fs.readFileSync('./keypair.json')

// 将您的walletFile转换为密钥对。
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

// 将密钥对加载到umi。
umi.use(keypairIdentity(keypair))
```

## 创建cNFT

在Solana上创建cNFT相当简单，需要准备一些项目才能实际执行铸造和读取操作。

- 一个默克尔树来存储我们的cNFT数据。
- 一个DAS就绪的RPC，能够从索引器读取数据，该索引器在创建期间存储我们的数据。

#### 默克尔树

默克尔树在大多数情况下可以被视为cNFT数据的"数据库"。创建默克尔树后，可以向其添加cNFT直到填满。

#### DAS RPC

由于默克尔树的性质，cNFT数据不存储在Solana账户中，而是存储在账本状态中。为了能够有效地读取数据，我们需要使用索引器，该索引器在创建/变更cNFT数据时对其进行索引。启用DAS的RPC是运行DAS索引器服务的RPC，允许我们按需向RPC提供商查询此数据。

有关支持DAS的RPC提供商的完整列表，您可以访问[RPC提供商页面](/zh/solana/rpcs-and-das#rp-cs-with-das-support)

您可以从这些提供商中的任何一个获取免费账户来运行本指南。注册后，您需要在之前的`umi`创建期间替换您的RPC实例。

```ts
// 替换下面的地址。
const umi = createUmi('https://rpcAddress.com')
```

### 创建树

{% callout title="树成本" type="warning" %}
我们在本指南中创建了一个容纳1,000,000个cNFT的默克尔树，大约需要7.7 SOL的成本。在准备好之前，请仅在devnet上尝试此示例，因为默克尔树无法关闭或退款。您需要至少7.7个devnet SOL才能运行此代码。这可能需要多次空投。
{% /callout %}

要在Solana区块链上存储压缩NFT（cNFT），您需要创建一个**默克尔树**来存储数据。默克尔树的大小和成本由默克尔树创建者决定，所有cNFT的链上存储都是预先支付的，这与Token Metadata的**懒惰铸造**方法不同，在后者中，付款人通常会在铸造NFT本身时支付Solana区块链上必要的存储空间和账户创建费用，而使用bubblegum时，所有所需的数据空间在树创建时由树创建者确定并支付。

与Token Metadata相比，**默克尔树**有一些独特的功能可以利用：

- 您可以将cNFT铸造到默克尔树中的多个集合。

默克尔树**不是**集合！

默克尔树可以容纳来自多个集合的cNFT，这对于知道未来将有扩展增长的项目来说非常强大。如果您的默克尔树容纳1,000,000个cNFT，并且您决定发布并铸造一个10k项目到该默克尔树，您仍然有990,000个空间来写入和发布未来的额外cNFT。

```ts
//
// ** 创建默克尔树 **
//

const merkleTree = generateSigner(umi)

console.log(
  'Merkle Tree Public Key:',
  merkleTree.publicKey,
  '\nStore this address as you will need it later.'
)

//   使用以下参数创建树。
//   此树的创建成本约为7.7 SOL，最大
//   容量为1,000,000个叶子/nft。您可能需要先向umi身份账户
//   空投一些SOL才能运行此脚本。

const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 20,
  maxBufferSize: 64,
  canopyDepth: 14,
})

await createTreeTx.sendAndConfirm(umi)
```

### 创建集合NFT

cNFT的集合仍由Token Metadata和从Token Metadata铸造的原始集合NFT维护和管理。如果您希望为您的cNFT创建集合并将它们铸造到其中，您需要创建一个Token Metadata集合NFT。

```ts
//
// ** 创建Token Metadata集合NFT **
//

//
// 如果您希望将NFT铸造到集合中，您必须首先创建集合NFT。
// 如果您不希望将NFT铸造到集合中
// 或之前已创建集合NFT，此步骤是可选的，可以跳过。
//

const collectionSigner = generateSigner(umi)

// 图像文件路径
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

### 上传cNFT的图像和元数据（可选）

我们的cNFT需要数据和图像。此代码块向我们展示如何上传图像，然后将该图像添加到`metadata`对象，最后将该对象作为json文件上传到Arweave via Irys，供我们的cNFT使用。

```ts
//
//   ** 上传用于NFT的图像和元数据（可选） **
//

//   如果您已经上传了图像和元数据文件，可以跳过此步骤
//   并在mintV1调用中使用已上传文件的uri。

//   图像文件路径
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

### 将cNFT铸造到默克尔树

将cNFT铸造到树上不会产生任何额外的账户/存储成本，因为树已经创建并有足够的空间存储我们所有的cNFT数据（实际上是1,000,000个cNFT）。这里唯一的额外成本只是基本的Solana交易费用，使cNFT大规模铸造非常高效。

```ts
//
// ** 将压缩NFT铸造到默克尔树 **
//

//
// 如果您不希望将NFT铸造到集合中，可以将collection
// 字段设置为`none()`。
//

// 正在铸造的cNFT的所有者。
const newOwner = publicKey('111111111111111111111111111111')

console.log('Minting Compressed NFT to Merkle Tree...')

const { signature } = await mintToCollectionV1(umi, {
  leafOwner: newOwner,
  merkleTree: merkleTree.publicKey,
  collectionMint: collectionSigner.publicKey,
  metadata: {
    name: 'My cNFT',
    uri: nftMetadataUri, // 使用`nftMetadataUri`或之前上传的uri。
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

### 获取新铸造的cNFT

```ts
//
// ** 获取资产 **
//

//
// 在这里，我们使用铸造交易的叶子索引找到压缩NFT的资产ID
// 然后记录资产信息。
//

console.log('Finding Asset ID...')
const leaf = await parseLeafFromMintV1Transaction(umi, signature)
const assetId = findLeafAssetIdPda(umi, {
  merkleTree: merkleTree.publicKey,
  leafIndex: leaf.nonce,
})

console.log('Compressed NFT Asset ID:', assetId.toString())

// 使用DAS通过umi rpc获取资产。
const asset = await umi.rpc.getAsset(assetId[0])

console.log({ asset })
```

### 铸造1,000,000个cNFT

现在我们了解了如何创建容纳1,000,000个cNFT的默克尔树，并可以将NFT铸造到该树，您现在可以采取所有前面的步骤，并开始调整代码以创建一些循环来上传所需数据到Arweave，然后将cNFT铸造到树。

由于默克尔树有1,000,000个cNFT的空间，您可以根据项目需求自由循环填充树。

以下是一个示例，根据循环索引递增存储在cNFT上的数据，将cNFT铸造到地址数组。这是一个粗略的简单示例/概念，需要修改后才能用于生产。

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
        uri: `https://example.com/${index}.json`, //使用metadataUri或已上传元数据文件的uri
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

## 完整代码示例

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

// 创建包装函数
const createCnft = async () => {
  //
  // ** 设置Umi **
  //

  // 在此实例中，我们使用本地存储的钱包。如果需要，
  // 可以用'生成新钱包'中的代码替换，但请确保
  // 向新钱包空投/发送至少7.7 SOL。

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplBubblegum())
    .use(mplTokenMetadata())
    .use(
      irysUploader({
        // 主网地址："https://node1.irys.xyz"
        // devnet地址："https://devnet.irys.xyz"
        address: 'https://devnet.irys.xyz',
      })
    )

  // 生成新的密钥对签名者。
  const signer = generateSigner(umi)

  // 您需要使用fs并导航文件系统
  // 通过相对路径加载您希望使用的钱包。
  const walletFile = fs.readFileSync('./keypair.json')

  // 将您的walletFile转换为密钥对。
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

  // 将密钥对加载到umi。
  umi.use(keypairIdentity(keypair))

  //
  // ** 创建默克尔树 **
  //

  const merkleTree = generateSigner(umi)

  console.log(
    'Merkle Tree Public Key:',
    merkleTree.publicKey,
    '\nStore this address as you will need it later.'
  )

  //   使用以下参数创建树。
  //   此树的创建成本约为7.7 SOL，最大
  //   容量为1,000,000个叶子/nft。您可能需要先向umi身份账户
  //   空投一些SOL才能运行此脚本。

  console.log('Creating Merkle Tree...')
  const createTreeTx = await createTree(umi, {
    merkleTree,
    maxDepth: 20,
    maxBufferSize: 64,
    canopyDepth: 14,
  })

  await createTreeTx.sendAndConfirm(umi)

  //
  // ** 创建Token Metadata集合NFT（可选） **
  //

  //
  // 如果您希望将NFT铸造到集合中，您必须首先创建集合NFT。
  // 如果您不希望将NFT铸造到集合中
  // 或之前已创建集合NFT，此步骤是可选的，可以跳过。
  //

  const collectionSigner = generateSigner(umi)

  // 图像文件路径
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
  //   ** 上传用于NFT的图像和元数据（可选） **
  //

  //   如果您已经上传了图像和元数据文件，可以跳过此步骤
  //   并在mintV1调用中使用已上传文件的uri。

  //   图像文件路径
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
  // ** 将压缩NFT铸造到默克尔树 **
  //

  //
  // 如果您不希望将NFT铸造到集合中，可以将collection
  // 字段设置为`none()`。
  //

  // 正在铸造的cNFT的所有者。
  const newOwner = publicKey('111111111111111111111111111111')

  console.log('Minting Compressed NFT to Merkle Tree...')

const { signature } = await mintToCollectionV1(umi, {
  leafOwner: newOwner,
  merkleTree: merkleTree.publicKey,
  collectionMint: collectionSigner.publicKey,
  metadata: {
    name: 'My cNFT',
    uri: nftMetadataUri, // 使用`nftMetadataUri`或之前上传的uri。
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
  // ** 获取资产 **
  //

  //
  // 在这里，我们使用铸造交易的叶子索引找到压缩NFT的资产ID
  // 然后记录资产信息。
  //

  console.log('Finding Asset ID...')
  const leaf = await parseLeafFromMintV1Transaction(umi, signature)
  const assetId = findLeafAssetIdPda(umi, {
    merkleTree: merkleTree.publicKey,
    leafIndex: leaf.nonce,
  })

  console.log('Compressed NFT Asset ID:', assetId.toString())

  // 使用DAS通过umi rpc获取资产。
  const asset = await umi.rpc.getAsset(assetId[0])

  console.log({ asset })
};

// 运行包装函数
createCnft();
```
