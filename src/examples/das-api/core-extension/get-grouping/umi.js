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
const grouping = await das.getGrouping(umi, {
  groupKey: 'group',
  groupValue: publicKey('<GroupPublicKey>'),
})
// [/MAIN]

// [OUTPUT]
console.log(grouping.group_name, grouping.group_size)
// [/OUTPUT]
