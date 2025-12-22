---
title: 如何创建 Solana 代币
metaTitle: 如何创建 Solana 代币 | 指南
description: 了解如何使用 Metaplex 包在 Solana 区块链上创建 SPL 代币/meme 币。
# remember to update dates also in /components/guides/index.js
created: '04-19-2024'
updated: '04-19-2025'
---

本分步指南将帮助您在 Solana 区块链上创建 Solana 代币（SPL 代币）。您可以使用 Metaplex Umi 客户端包装器和 Mpl Toolbox 包与 Javascript。这使您能够创建可在脚本以及前端和后端框架中使用的函数。

## 先决条件

- 您选择的代码编辑器（推荐 Visual Studio Code）
- Node 18.x.x 或更高版本。

## 初始设置

首先使用包管理器（如 npm、yarn、pnpm 或 bun）创建一个新项目（可选）。在询问时填写必要的信息。

```js
npm init
```

### 所需包

安装本指南所需的包。

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

```js
npm i @metaplex-foundation/umi-uploader-irys
```

```js
npm i @metaplex-foundation/mpl-toolbox
```

### 导入和包装函数

在本指南中，我们将列出所有必要的导入并为我们的代码创建一个包装函数来运行。

```ts
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  getSplAssociatedTokenProgramId,
  mintTokensTo,
} from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  percentAmount,
  createGenericFile,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

// Create the wrapper function
const createAndMintTokens = async () => {
  ///
  ///
  ///  all our code will go in here
  ///
  ///
}

// run the wrapper function
createAndMintTokens()
```

## 设置 Umi

此示例将演示如何使用 `generatedSigner()` 设置 Umi。如果您希望以不同的方式设置钱包或签名者，可以查看 [**连接到 Umi**](/zh/umi/connecting-to-umi) 指南。

您可以将 umi 变量和代码块放在 `createAndMintTokens()` 函数内部或外部。重要的是您的 `umi` 变量可以从 `createAndMintTokens()` 函数本身访问。

### 生成新钱包

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplCore())
  .use(irysUploader())

// Generate a new keypair signer.
const signer = generateSigner(umi)

// Tell umi to use the new signer.
umi.use(signerIdentity(signer))

// Airdrop 1 SOL to the identity
// if you end up with a 429 too many requests error, you may have to use
// the a different rpc other than the free default one supplied.
await umi.rpc.airdrop(umi.identity.publicKey)
```

### 使用本地存储的现有钱包

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplTokenMetadata())
  .use(mplToolbox())
  .use(irysUploader())

// You will need to us fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync('./keypair.json', {encoding: "utf-8"})

// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(JSON.parse(walletFile)));

// Load the keypair into umi.
umi.use(keypairIdentity(umiSigner));
```

## 创建代币

### 上传图像

我们需要做的第一件事是上传一个代表代币并使其可识别的图像。这可以是 jpeg、png 或 gif 的形式。

Umi 有用于在 Arweave 和 AWS 上存储文件的插件。您可以下载这些插件来上传文件。在本指南开始时，我们安装了 irysUploader() 插件，该插件将内容存储在 Arweave 区块链上，因此我们将坚持使用它。

{% callout title="本地脚本/Node.js" %}
此示例使用本地脚本/node.js 方法使用 Irys 上传到 Arweave。如果您希望将文件上传到不同的存储提供商或从浏览器上传，则需要采取不同的方法。在浏览器场景中导入和使用 `fs` 不起作用。
{% /callout %}

```ts
// use `fs` to read file via a string path.

const imageFile = fs.readFileSync('./image.jpg')

// Use `createGenericFile` to transform the file into a `GenericFile` type
// that Umi can understand. Make sure you set the mimetag type correctly
// otherwise Arweave will not know how to display your image.

const umiImageFile = createGenericFile(imageFile, 'image.jpeg', {
  tags: [{ name: 'contentType', value: 'image/jpeg' }],
})

// Here we upload the image to Arweave via Irys and we get returned a uri
// address where the file is located. You can log this out but as the
// uploader can takes an array of files it also returns an array of uris.
// To get the uri we want we can call index [0] in the array.

const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})

console.log(imageUri[0])
```

### 上传元数据

一旦我们有了有效且可用的图像 URI，我们就可以开始为我们的 SPL 代币处理元数据。

可替代代币的链外元数据标准如下

```json
{
  "name": "TOKEN_NAME",
  "symbol": "TOKEN_SYMBOL",
  "description": "TOKEN_DESC",
  "image": "TOKEN_IMAGE_URL"
}
```

这里的字段包括

#### name

您的代币名称。

#### symbol

您的代币的简写。Solana 的简写是 SOL。

#### description

您的代币的描述。

#### image

这将设置为我们之前上传的 imageUri（或图像的任何在线位置）。

```js
// Example metadata
const metadata = {
  name: 'The Kitten Coin',
  symbol: 'KITTEN',
  description: 'The Kitten Coin is a token created on the Solana blockchain',
  image: imageUri, // Either use variable or paste in string of the uri.
}

// Call upon Umi's `uploadJson` function to upload our metadata to Arweave via Irys.

const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

如果一切按计划进行，metadataUri 变量应存储上传的 JSON 文件的 URI。

### 创建代币

在 Solana 区块链上创建新代币时，我们需要创建几个账户来容纳新数据。

#### 创建铸造账户和代币元数据

虽然铸造账户存储铸造的初始铸造详细信息，例如小数位数、总供应量以及铸造和冻结权限，但代币元数据账户保存代币的属性，例如 `name`、链外元数据 `uri`、代币的 `description` 和代币的 `symbol`。这些账户一起提供 Solana 上 SPL 代币的所有信息。

下面的 `createFungible()` 函数创建铸造账户和代币元数据账户供使用。

我们需要向函数提供一个密钥对，它将成为铸造地址。我们还需要从 JSON 文件提供额外的元数据。此元数据包括代币的名称和元数据 URI 地址。

```ts
const mintSigner = generateSigner(umi)

const createMintIx = await createFungible(umi, {
  mint: mintSigner,
  name: 'The Kitten Coin',
  uri: metadataUri, // we use the `metadataUri` variable we created earlier that is storing our uri.
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 9, // set the amount of decimals you want your token to have.
})
```

### 铸造代币

#### 代币账户

如果我们立即铸造代币，那么我们需要一个地方来存储某人钱包中的代币。为此，我们根据钱包和铸造地址以数学方式生成一个地址，称为关联代币账户（ATA），有时也简称为代币账户。此代币账户（ATA）属于钱包并为我们存储代币。

#### 生成代币账户。

我们需要做的第一件事是弄清楚代币账户地址应该是什么。MPL-Toolbox 有一个我们可以导入的辅助函数，它可以做到这一点，同时还可以在代币账户不存在时创建它。

```ts
const createTokenIx = createTokenIfMissing(umi, {
  mint: mintSigner.publicKey,
  owner: umi.identity.publicKey,
  ataProgram: getSplAssociatedTokenProgramId(umi),
})
```

#### 铸造代币交易

现在我们有了创建代币账户的指令，我们可以使用 `mintTokenTo()` 指令将代币铸造到该账户。

```ts
const mintTokensIx = mintTokensTo(umi, {
  mint: mintSigner.publicKey,
  token: findAssociatedTokenPda(umi, {
    mint: mintSigner.publicKey,
    owner: umi.identity.publicKey,
  }),
  amount: BigInt(1000),
})
```

### 发送交易

您可以以多种方式发送和安排交易，但在此示例中，我们将把指令链接到一个原子交易中并一次发送所有内容。如果这里的任何指令失败，则整个交易失败。

```ts
// chain the instructions together with .add() then send with .sendAndConfirm()

const tx = await createFungibleIx
  .add(createTokenIx)
  .add(createTokenAccountIfMissing)
  .add(mintTokensIx)
  .sendAndConfirm(umi)

// finally we can deserialize the signature that we can check on chain.
// import { base58 } from "@metaplex-foundation/umi/serializers";

console.log(base58.deserialize(tx.signature)[0])
```

现在您知道如何在 Solana 上制作代币，一些基本的项目想法可能包括：

- Solana 代币创建器
- meme 币生成器

您现在还可以考虑创建流动性池，以在 Jupiter 和 Orca 等去中心化交易所上列出您的代币。

## 完整代码示例

```ts
import {
  createFungible,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  createTokenIfMissing,
  findAssociatedTokenPda,
  getSplAssociatedTokenProgramId,
  mintTokensTo,
} from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  percentAmount,
  createGenericFile,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createAndMintTokens = async () => {
  const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
    .use(mplTokenMetadata())
    .use(irysUploader())

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

// Airdrop 1 SOL to the identity
  // if you end up with a 429 too many requests error, you may have to use
  // the filesystem wallet method or change rpcs.
  console.log("AirDrop 1 SOL to the umi identity");
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));

  // use `fs` to read file via a string path.

  const imageFile = fs.readFileSync("./image.jpg");

  // Use `createGenericFile` to transform the file into a `GenericFile` type
  // that umi can understand. Make sure you set the mimetag type correctly
  // otherwise Arweave will not know how to display your image.

  const umiImageFile = createGenericFile(imageFile, "image.png", {
    tags: [{ name: "Content-Type", value: "image/png" }],
  });

  // Here we upload the image to Arweave via Irys and we get returned a uri
  // address where the file is located. You can log this out but as the
  // uploader can takes an array of files it also returns an array of uris.
  // To get the uri we want we can call index [0] in the array.

  console.log("Uploading image to Arweave via Irys");
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err);
  });

  console.log(imageUri[0]);

  // Uploading the tokens metadata to Arweave via Irys

  const metadata = {
    name: "The Kitten Coin",
    symbol: "KITTEN",
    description: "The Kitten Coin is a token created on the Solana blockchain",
    image: imageUri, // Either use variable or paste in string of the uri.
  };

  // Call upon umi's uploadJson function to upload our metadata to Arweave via Irys.

  console.log("Uploading metadata to Arweave via Irys");
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err);
  });

  // Creating the mintIx

  const mintSigner = generateSigner(umi);

  const createFungibleIx = createFungible(umi, {
    mint: mintSigner,
    name: "The Kitten Coin",
    uri: metadataUri, // we use the `metadataUri` variable we created earlier that is storing our uri.
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 0, // set the amount of decimals you want your token to have.
  });

  // This instruction will create a new Token Account if required, if one is found then it skips.

  const createTokenIx = createTokenIfMissing(umi, {
    mint: mintSigner.publicKey,
    owner: umi.identity.publicKey,
    ataProgram: getSplAssociatedTokenProgramId(umi),
  });

  // The final instruction (if required) is to mint the tokens to the token account in the previous ix.

  const mintTokensIx = mintTokensTo(umi, {
    mint: mintSigner.publicKey,
    token: findAssociatedTokenPda(umi, {
      mint: mintSigner.publicKey,
      owner: umi.identity.publicKey,
    }),
    amount: BigInt(1000),
  });

  // The last step is to send the ix's off in a transaction to the chain.
  // Ix's here can be omitted and added as needed during the transaction chain.
  // If for example you just want to create the Token without minting
  // any tokens then you may only want to submit the `createToken` ix.

  console.log("Sending transaction")
  const tx = await createFungibleIx
    .add(createTokenIx)
    .add(mintTokensIx)
    .sendAndConfirm(umi);

  // finally we can deserialize the signature that we can check on chain.
  const signature = base58.deserialize(tx.signature)[0];

  // Log out the signature and the links to the transaction and the NFT.
  // Explorer links are for the devnet chain, you can change the clusters to mainnet.
  console.log('\nTransaction Complete')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('View Token on Solana Explorer')
  console.log(`https://explorer.solana.com/address/${mintSigner.publicKey}?cluster=devnet`)
};

createAndMintTokens()
```
