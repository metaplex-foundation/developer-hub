// [IMPORTS]
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { das } from '@metaplex-foundation/mpl-core-das'
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('<ENDPOINT>').use(dasApi())
// [/SETUP]

// [MAIN]
const assets = await das.getAssetsByAuthority(umi, {
  authority: publicKey('<PublicKey>'),
})
// [/MAIN]

// [OUTPUT]
console.log(assets)
// [/OUTPUT]
