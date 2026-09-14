// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionsToGroup } from '@metaplex-foundation/mpl-core'
// [/IMPORTS]

// [SETUP]
const group = publicKey('GroupAddress...')
const collection = publicKey('CollectionAddress...')
// [/SETUP]

// [MAIN]
await addCollectionsToGroup(umi, {
  group,
  authority: umi.identity,
})
  .addRemainingAccounts([
    { pubkey: collection, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Collection added to group')
// [/OUTPUT]
