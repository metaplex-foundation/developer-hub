// [IMPORTS]
import { addGroupsToGroup } from '@metaplex-foundation/mpl-core'
// [/IMPORTS]

// [SETUP]
// parentGroup and childGroup are existing GroupV1 accounts
// [/SETUP]

// [MAIN]
await addGroupsToGroup(umi, {
  parentGroup: parentGroup.publicKey,
  groups: [childGroup.publicKey],
  authority: umi.identity,
})
  .addRemainingAccounts([
    { pubkey: childGroup.publicKey, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Child group nested under parent')
// [/OUTPUT]
