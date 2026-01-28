// [IMPORTS]
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { create, fetchCollection } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
// Initialize UMI
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

const collectionAddress = publicKey('YOUR_COLLECTION_ADDRESS')
// [/SETUP]

// [MAIN]
// Fetch the existing collection
const collection = await fetchCollection(umi, collectionAddress)

// Generate a new keypair for the asset
const assetSigner = generateSigner(umi)

// Create asset in the collection
await create(umi, {
  asset: assetSigner,
  collection,
  name: 'Collection Item #1',
  uri: 'https://example.com/item1.json',
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset created in collection:', assetSigner.publicKey)
// [/OUTPUT]
