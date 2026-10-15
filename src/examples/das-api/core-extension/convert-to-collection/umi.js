// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { das } from '@metaplex-foundation/mpl-core-das'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('<ENDPOINT>').use(dasApi())
// [/SETUP]

// [MAIN]
const dasAssets = await umi.rpc.getAssetsByOwner({ owner: publicKey('<pubkey>') })

const dasCoreCollections = dasAssets.items.filter(
  (a) => a.interface === 'MplCoreCollection'
)

const coreCollections = dasCoreCollections.map((item) =>
  das.dasAssetToCoreCollection(item)
)
// [/MAIN]

// [OUTPUT]
console.log(coreCollections)
// [/OUTPUT]
