// [IMPORTS]
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
// [/MAIN]

// [OUTPUT]
console.log(collection)
// [/OUTPUT]
