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

const dasCoreAssets = dasAssets.items.filter((a) => a.interface === 'MplCoreAsset')

const coreAssets = await das.dasAssetsToCoreAssets(umi, dasCoreAssets)
// [/MAIN]

// [OUTPUT]
console.log(coreAssets)
// [/OUTPUT]
