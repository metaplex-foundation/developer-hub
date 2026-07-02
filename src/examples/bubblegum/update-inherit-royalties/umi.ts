// [IMPORTS]
import {
  getAssetWithProof,
  updateMetadataV2,
  UpdateArgsArgs,
  mplBubblegum,
} from '@metaplex-foundation/mpl-bubblegum'
import { publicKey, some } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com').use(mplBubblegum())

const assetId = publicKey('YOUR_ASSET_ID')
const collectionPublicKey = publicKey('YOUR_COLLECTION_ADDRESS')
// [/SETUP]

// [MAIN]
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// Switch from inherited royalties to an explicit seller fee before removing
// the cNFT from its collection.
const updateArgs: UpdateArgsArgs = {
  sellerFeeBasisPoints: some(550), // explicit 5.5%
}

await updateMetadataV2(umi, {
  ...assetWithProof,
  currentMetadata: assetWithProof.currentMetadata!,
  updateArgs,
  coreCollection: collectionPublicKey,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Leaf seller fee updated from inherit sentinel (65535) to 550 basis points
// [/OUTPUT]
