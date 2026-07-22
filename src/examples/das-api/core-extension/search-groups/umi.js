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
const groups = await das.searchGroups(umi, {
  authority: publicKey('<UpdateAuthority>'),
  limit: 50,
})
// [/MAIN]

// [OUTPUT]
console.log(groups)
// [/OUTPUT]
