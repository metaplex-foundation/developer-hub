// [IMPORTS]
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createCollection } from '@metaplex-foundation/mpl-core'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { generateSigner } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
// Initialize UMI
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())
// [/SETUP]

// [MAIN]
// Generate a new keypair for the collection
const collectionSigner = generateSigner(umi)

// Create a new Collection
await createCollection(umi, {
  collection: collectionSigner,
  name: 'My Collection',
  uri: 'https://example.com/collection.json',
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Collection created:', collectionSigner.publicKey)
// [/OUTPUT]
