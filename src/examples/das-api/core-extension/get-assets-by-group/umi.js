// [IMPORTS]
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { das } from '@metaplex-foundation/mpl-core-das'
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('<ENDPOINT>').use(dasApi())
const group = publicKey('<PublicKey>')
// [/SETUP]

// [MAIN]
const members = await das.getAssetsByGroup(umi, {
  group,
  skipDerivePlugins: true,
})
// [/MAIN]

// [OUTPUT]
console.log(members)
// [/OUTPUT]
