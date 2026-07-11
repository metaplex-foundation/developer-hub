// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi'
import { fetchGroupV1 } from '@metaplex-foundation/mpl-core'
// [/IMPORTS]

// [SETUP]
const groupAddress = publicKey('GroupAddress...')
// [/SETUP]

// [MAIN]
const group = await fetchGroupV1(umi, groupAddress)
// [/MAIN]

// [OUTPUT]
console.log(group.name)
console.log(group.collections)
console.log(group.groups)
console.log(group.assets)
// [/OUTPUT]
