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
const dasGroup = await umi.rpc.getAsset(publicKey('<groupPubkey>'))

const coreGroup = das.dasAssetToCoreGroup(dasGroup)
// [/MAIN]

// [OUTPUT]
console.log(coreGroup)
// [/OUTPUT]
