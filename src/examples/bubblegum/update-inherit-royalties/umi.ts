// [IMPORTS]
import {
  getAssetWithProof,
  updateMetadataV2,
  UpdateArgsArgs,
  mplBubblegum,
} from '@metaplex-foundation/mpl-bubblegum'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { keypairIdentity, publicKey, some } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { readFileSync } from 'fs'
// [/IMPORTS]

// [SETUP]
// getAssetWithProof calls getAsset and getAssetProof, so this needs a
// DAS-capable RPC. The public Solana endpoints do not serve DAS methods.
const umi = createUmi('YOUR_DAS_ENABLED_RPC_URL')
  .use(mplBubblegum())
  .use(dasApi())

// The leaf owner or an authorised delegate must sign the update.
const keypair = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(JSON.parse(readFileSync('./keypair.json', 'utf8')))
)
umi.use(keypairIdentity(keypair))

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

// Spread includes currentMetadata (leaf-canonical). Do not pass metadata here.
await updateMetadataV2(umi, {
  ...assetWithProof,
  updateArgs,
  coreCollection: collectionPublicKey,
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
// Leaf seller fee updated from inherit sentinel (65535) to 550 basis points
// [/OUTPUT]
