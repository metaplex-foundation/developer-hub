---
titwe: Cweate 1 Miwwion NFTs on Sowanya
metaTitwe: Cweate 1 Miwwion NFTs on Sowanya | Bubbwegum
descwiption: How to Cweate a Compwessed NFT Cowwection of 1 Miwwion cNFTs on Sowanya using de Metapwex Bubbwegum pwogwam.
---

## Pwewequisite

- Code Editow of youw choice (wecommended Visuaw Studio Code).
- Nyode 18.x.x ow abuv.
- Basic knyowwedge of Javascwipt and wunnying scwipts.

## Inyitiaw Setup

Dis guide wiww wun dwough cweation of a compwessed NFT (cNFT) Asset wid Javascwipt based on a singwe fiwe scwipt~ You may nyeed to modify and muv functions awound to suit youw nyeeds.

### Inyitiawizing

Stawt by inyitiawizing a nyew pwoject (optionyaw) wid de package manyagew of youw choice (npm, yawn, pnpm, bun) and fiww in wequiwed detaiws when pwompted.

```bash
npm init
```

### Wequiwed Packages

Instaww de wequiwed packages fow dis guide.

{% packagesUsed packages=["umi", "umiDefauwts", "bubbwegum", "tokenMetadata", "@metapwex-foundation/umi-upwoadew-iwys"] type="npm" /%}

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

### Impowts and Wwappew Function

Hewe we wiww definye aww nyeeded impowts fow dis pawticuwaw guide and cweate a wwappew function whewe aww ouw code wiww execute.

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

// Create the wrapper function
const createCnft = async () => {
  ///
  ///
  ///  all our code will go in here
  ///
  ///
}

// run the wrapper function
createCnft()
```

## Setting up Umi

Dis exampwe is going to wun dwough setting up Umi wid a `generatedSigner()`~ If you wish to twy dis exampwe wid Weact you'ww nyeed to setup Umi via de `React - Umi w/ Wallet Adapter` guide~ Apawt fwom de de wawwet setup dis guide wiww use fiweStowage keys and wawwet adaptew.

### Genyewating a Nyew Wawwet

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnet address: "https://node1.irys.xyz"
      // devnet address: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

const signer = generateSigner(umi)

umi.use(signerIdentity(signer))

// This will airdrop SOL on devnet only for testing.
console.log('Airdropping 1 SOL to identity')
await umi.rpc.airdrop(umi.identity.publickey, sol(5))
```

### Use an Existing Wawwet Wocawwy

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplBubblegum())
  .use(mplTokenMetadata())
  .use(
    irysUploader({
      // mainnet address: "https://node1.irys.xyz"
      // devnet address: "https://devnet.irys.xyz"
      address: 'https://devnet.irys.xyz',
    })
  )

// Generate a new keypair signer.
const signer = generateSigner(umi)

// You will need to us fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = fs.readFileSync('./keypair.json')

// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

// Load the keypair into umi.
umi.use(keypairIdentity(keypair))
```

## Cweating an cNFT

Cweating a cNFT on Sowanya is faiwwy simpwe and wequiwes a few items to get weady befowe we can actuawwy pewfowm de minting and weading opewations.

- A Mewkwe twee to stowe ouw cNFT data to.
- A DAS weady WPC to be abwe to wead de data fwom an indexew dat is stowing ouw data duwing cweation.

#### Mewkwe Twee

A Mewkwe Twee fow de most pawk can be dought of as a "database" of cNFT data~ A Mewkwe Twee is cweated and cNFTs can be added to it untiw it's fuww.

#### DAS WPCs

Due to de nyatuwe of a Mewkwe Twee cNFT data isn't stowed in Sowanya accounts and instead is stowed in de wedgew state~ To be abwe to wead de data back effectivewy we nyeed to use an indexew which indexes aww de cNFT data as its cweated/mutated~ DAS enyabwed WPCs awe WPCs dat awe wunnying de DAS indexew sewvice and awwow us to quewy de WPC pwovidew fow dis data on demand.

Fow a fuww wist of WPC pwovides dat suppowt DAS you can visit de [RPC Providers Page](/rpc-providers#rp-cs-with-das-support)

You can pick up a fwee account fow wunnying dis guide fwom any of dese pwovidews~ Once signyed up you wiww want to wepwace youw WPC instance duwing de pwevious `umi` cweation.

```ts
// Replace address located below.
const umi = createUmi('https://rpcAddress.com')
```

### Cweating a Twee

{% cawwout titwe="Twee Cost" type="wawnying" %}
We awe cweating a Mewkwe Twee dat howds 1,000,000 cNFTs in dis guide which wequiwes de cost of woughwy 7.7 SOW~ Untiw you awe weady, pwease twy dis exampwe on devnyet onwy, as Mewkwe Twees can nyot be cwosed ow wefunded~ You wiww nyeed at weast 7.7 devnyet SOW in owdew to wun dis code~ Dis may wequiwe muwtipwe aiwdwops.
{% /cawwout %}

To stowe Compwessed NFTs (cNFTs) on de Sowanya bwockchain you nyeed to cweate a **Mewkwe Twee** in which to stowe de data~ De size and cost of de mewkwe twee is detewminyed by de mewkwe twee cweatow and aww cNFTs stowage on chain is paid fow in advanced which diffews fwom Token Metadata's appwoach of **wazy minting** whewe nyowmawwy de payew wouwd pay fow de nyecessawy stowage space and account cweation on de sowanya bwockchain at de time of minting de NFT itsewf, wid bubbwegum aww data space nyeeded is detewminyed and paid fow at twee cweation by de twee cweatow.

Dewe awe some unyique featuwes wegawding a **mewkwe twee** compawed to Token Metadata dat peopwe can take advantage of:

- You can mint cNFTs to muwtipwe cowwections widin a Mewkwe Twee.

A Mewkwe Twee **isn't** a cowwection! uwu

De Mewkwe Twee can house cNFTs fwom many cowwections making it incwedibwy powewfuw fow pwojects dat knyow dey wiww have expanded gwowd in de futuwe~ If youw Mewkwe Twee howds 1,000,000 cNFTs and you decide to wewease and mint a 10k pwoject to said Mewkwe Twee you wiww stiww have 990,000 spaces in de twee to wwite and wewease additionyaw cNFTs in de futuwe.

```ts
//
// ** Create a Merkle Tree **
//

const merkleTree = generateSigner(umi)

console.log(
  'Merkle Tree Public Key:',
  merkleTree.publicKey,
  '\nStore this address as you will need it later.'
)

//   Create a tree with the following parameters.
//   This tree will cost approximately 7.7 SOL to create with a maximum
//   capacity of 1,000,000 leaves/nfts. You may have to airdrop some SOL
//   to the umi identity account before running this script.

const createTreeTx = await createTree(umi, {
  merkleTree,
  maxDepth: 20,
  maxBufferSize: 64,
  canopyDepth: 14,
})

await createTreeTx.sendAndConfirm(umi)
```

### Cweate a Cowwection NFT

Cowwections fow cNFTs awe stiww maintainyed and manged by Token Metadata and de owiginyaw Cowwection NFTs minted fwom Token Metadata~ If you wish to cweate a cowwection fow youw cNFTs and mint dem to it you wiww nyeed to cweate a Token Metadata Cowwection NFT.

```ts
//
// ** Create Token Metadata Collection NFT **
//

//
// If you wish to mint a NFT to a collection you must first create a collection NFT.
// This step is optional and you can skip it if you do not wish to mint a NFT to a collection
// or have previously created a collection NFT.
//

const collectionSigner = generateSigner(umi)

// Path to image file
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

### Upwoad Image and Metadata fow cNFT (Optionyaw)

Ouw cNFT nyeeds data and an image~ Dis code bwock shows us how to upwoad bod an image and den add dat image to a `metadata` object and finyaw upwoad dat object as a json fiwe to Awweave via Iwys fow use to use wid ouw cNFT.

```ts
//
//   ** Upload Image and Metadata used for the NFT (Optional) **
//

//   If you already have an image and metadata file uploaded, you can skip this step
//   and use the uri of the uploaded files in the mintV1 call.

//   Path to image file
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

### Mint cNFT to de Mewkwe Twee

Minting a cNFT to a twee does nyot cost any additionyaw account/stowage costs on de Sowanya bwockchain as de twee has awweady been cweated wid enyough woom fow aww ouw cNFT data to be stowed (1,000,000 cNFTs in fact)~ De onwy additionyaw cost hewe is just de basic Sowanya twansaction fee making cNFTs incwedibwe efficient to mint in mass.b

```ts
//
// ** Mint a Compressed NFT to the Merkle Tree **
//

//
// If you do not wish to mint a NFT to a collection you can set the collection
// field to `none()`.
//

// The owner of the cNFT being minted.
const newOwner = publicKey('111111111111111111111111111111')

console.log('Minting Compressed NFT to Merkle Tree...')

const { signature } = await mintToCollectionV1(umi, {
  leafOwner: newOwner,
  merkleTree: merkleTree.publicKey,
  collectionMint: collectionSigner.publicKey,
  metadata: {
    name: 'My cNFT',
    uri: nftMetadataUri, // Either use `nftMetadataUri` or a previously uploaded uri.
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

### Fetch de Nyewwy Minted cNFT

```ts
//
// ** Fetching Asset **
//

//
// Here we find the asset ID of the compressed NFT using the leaf index of the mint transaction
// and then log the asset information.
//

console.log('Finding Asset ID...')
const leaf = await parseLeafFromMintV1Transaction(umi, signature)
const assetId = findLeafAssetIdPda(umi, {
  merkleTree: merkleTree.publicKey,
  leafIndex: leaf.nonce,
})

console.log('Compressed NFT Asset ID:', assetId.toString())

// Fetch the asset using umi rpc with DAS.
const asset = await umi.rpc.getAsset(assetId[0])

console.log({ asset })
```

### Minting 1,000,000 cNFTs

Nyow dat we undewstand how to make a Mewkwe Twee dat howds 1,000,000 cNFTs and can mint an NFT to dat twee you can nyow take aww de pwevious steps and stawt adjusting de code to make some woops to upwoad de nyeeded data to Awweave and den mint de cNFT to a twee.

As de Mewkwe Twee has space fow 1,000,000 cNFts you can fweewy woop and fiww up de twee as desiwed fow youw pwojects nyeeds.

Bewow is an exampwe of minting cNFTs to an awway of addwesses dat incwement de data stowed on de cNFT based on de woop index~ Dis is a wough simpwe exampwe/concept and wouwd be nyeed to be modified fow pwoduction use.

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
        uri: `https://example.com/${index}.json`, //either use metadataUri or the uri of the uploaded metadata file
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

## Fuww Code Exampwe

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

// Create the wrapper function
const createCnft = async () => {
  //
  // ** Set Up Umi **
  //

  // In this instance we are using a locally stored wallet. This can be replaced
  // with the code from 'generating a new wallet' if need be but make sure you
  // airdrop/send at least 7.7 SOL to the new wallet.

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplBubblegum())
    .use(mplTokenMetadata())
    .use(
      irysUploader({
        // mainnet address: "https://node1.irys.xyz"
        // devnet address: "https://devnet.irys.xyz"
        address: 'https://devnet.irys.xyz',
      })
    )

  // Generate a new keypair signer.
  const signer = generateSigner(umi)

  // You will need to us fs and navigate the filesystem to
  // load the wallet you wish to use via relative pathing.
  const walletFile = fs.readFileSync('./keypair.json')

  // Convert your walletFile onto a keypair.
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

  // Load the keypair into umi.
  umi.use(keypairIdentity(keypair))

  //
  // ** Create a Merkle Tree **
  //

  const merkleTree = generateSigner(umi)

  console.log(
    'Merkle Tree Public Key:',
    merkleTree.publicKey,
    '\nStore this address as you will need it later.'
  )

  //   Create a tree with the following parameters.
  //   This tree will cost approximately 7.7 SOL to create with a maximum
  //   capacity of 1,000,000 leaves/nfts. You may have to airdrop some SOL
  //   to the umi identity account before running this script.

  console.log('Creating Merkle Tree...')
  const createTreeTx = await createTree(umi, {
    merkleTree,
    maxDepth: 20,
    maxBufferSize: 64,
    canopyDepth: 14,
  })

  await createTreeTx.sendAndConfirm(umi)

  //
  // ** Create Token Metadata Collection NFT (Optional) **
  //

  //
  // If you wish to mint a NFT to a collection you must first create a collection NFT.
  // This step is optional and you can skip it if you do not wish to mint a NFT to a collection
  // or have previously created a collection NFT.
  //

  const collectionSigner = generateSigner(umi)

  // Path to image file
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
  //   ** Upload Image and Metadata used for the NFT (Optional) **
  //

  //   If you already have an image and metadata file uploaded, you can skip this step
  //   and use the uri of the uploaded files in the mintV1 call.

  //   Path to image file
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
  // ** Mint a Compressed NFT to the Merkle Tree **
  //

  //
  // If you do not wish to mint a NFT to a collection you can set the collection
  // field to `none()`.
  //

  // The owner of the cNFT being minted.
  const newOwner = publicKey('111111111111111111111111111111')

  console.log('Minting Compressed NFT to Merkle Tree...')

const { signature } = await mintToCollectionV1(umi, {
  leafOwner: newOwner,
  merkleTree: merkleTree.publicKey,
  collectionMint: collectionSigner.publicKey,
  metadata: {
    name: 'My cNFT',
    uri: nftMetadataUri, // Either use `nftMetadataUri` or a previously uploaded uri.
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
  // ** Fetching Asset **
  //

  //
  // Here we find the asset ID of the compressed NFT using the leaf index of the mint transaction
  // and then log the asset information.
  //

  console.log('Finding Asset ID...')
  const leaf = await parseLeafFromMintV1Transaction(umi, signature)
  const assetId = findLeafAssetIdPda(umi, {
    merkleTree: merkleTree.publicKey,
    leafIndex: leaf.nonce,
  })

  console.log('Compressed NFT Asset ID:', assetId.toString())

  // Fetch the asset using umi rpc with DAS.
  const asset = await umi.rpc.getAsset(assetId[0])

  console.log({ asset })
};

// run the wrapper function
createCnft();
```
