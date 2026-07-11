// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi'
import { addAssetsToGroup } from '@metaplex-foundation/mpl-core'
// [/IMPORTS]

// [SETUP]
const group = publicKey('GroupAddress...')
const asset = publicKey('AssetAddress...')
// [/SETUP]

// [MAIN]
await addAssetsToGroup(umi, {
  group,
  authority: umi.identity,
})
  .addRemainingAccounts([
    { pubkey: asset, isSigner: false, isWritable: true },
  ])
  .sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('Asset added to group')
// [/OUTPUT]
