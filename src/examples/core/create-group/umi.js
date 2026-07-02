// [IMPORTS]
import { generateSigner } from '@metaplex-foundation/umi'
import { createGroup } from '@metaplex-foundation/mpl-core'
// [/IMPORTS]

// [SETUP]
const group = generateSigner(umi)
// [/SETUP]

// [MAIN]
await createGroup(umi, {
  group,
  name: 'My Brand Directory',
  uri: 'https://example.com/my-brand.json',
  relationships: [],
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Group created:', group.publicKey)
// [/OUTPUT]
