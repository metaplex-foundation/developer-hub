// [IMPORTS]
import { deriveAssetPlugins } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { das } from '@metaplex-foundation/mpl-core-das'
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('<ENDPOINT>').use(dasApi())
const collectionId = publicKey('<PublicKey>')
// [/SETUP]

// [MAIN]
const collection = await das.getCollection(umi, collectionId)
const assetsByCollection = await das.getAssetsByCollection(umi, {
  collection: collection.publicKey,
  skipDerivePlugins: true,
})

const derivedAssets = assetsByCollection.map((asset) =>
  deriveAssetPlugins(asset, collection)
)
// [/MAIN]

// [OUTPUT]
console.log(derivedAssets)
// [/OUTPUT]
