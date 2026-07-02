// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi'
import { getGroupV1GpaBuilder, Key } from '@metaplex-foundation/mpl-core'
// [/IMPORTS]

// [SETUP]
const updateAuthority = publicKey('UpdateAuthorityAddress...')
// [/SETUP]

// [MAIN]
const groups = await getGroupV1GpaBuilder(umi)
  .whereField('updateAuthority', updateAuthority)
  .whereField('key', Key.GroupV1)
  .getDeserialized()
// [/MAIN]

// [OUTPUT]
for (const group of groups) {
  console.log(group.publicKey, group.name)
}
// [/OUTPUT]
