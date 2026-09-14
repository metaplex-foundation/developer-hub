// [IMPORTS]
import {
  fetchClaimScheduleBucketV2,
  findClaimScheduleBucketV2Pda,
  genesis,
} from '@metaplex-foundation/genesis'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis())

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const [vestingBucket] = findClaimScheduleBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
})
// [/SETUP]

// [MAIN]
const account = await fetchClaimScheduleBucketV2(umi, vestingBucket)
// [/MAIN]

// [OUTPUT]
console.log('Recipient:', account.recipient)
console.log('Allocation:', account.bucket.baseTokenAllocation)
console.log('Remaining balance:', account.bucket.baseTokenBalance)
console.log('Claimed:', account.amountClaimed)
console.log('Paused:', account.paused)
console.log('Total seconds paused:', account.totalSecondsPaused)
// [/OUTPUT]
