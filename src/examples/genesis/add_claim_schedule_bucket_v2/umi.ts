// [IMPORTS]
import {
  addClaimScheduleBucketV2,
  createClaimSchedule,
  createTimeAbsoluteCondition,
  findClaimScheduleBucketV2Pda,
  genesis,
} from '@metaplex-foundation/genesis'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis())

// umi.use(keypairIdentity(yourKeypair))

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT')
const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
const recipient = publicKey('VESTING_RECIPIENT')
const bucketIndex = 0
// [/SETUP]

// [MAIN]
const [vestingBucket] = findClaimScheduleBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex,
})

const DAY = 86_400n
const vestingStart = BigInt(Math.floor(Date.now() / 1000)) + 7n * DAY
const vestingEnd = vestingStart + 365n * DAY

await addClaimScheduleBucketV2(umi, {
  genesisAccount,
  baseMint,
  authority: umi.identity,
  recipient,
  bucketIndex,
  baseTokenAllocation: 100_000_000_000_000n, // 100,000 tokens at 9 decimals
  claimStartCondition: createTimeAbsoluteCondition(vestingStart),
  claimSchedule: createClaimSchedule({
    startTime: vestingStart,
    endTime: vestingEnd,
    period: 30n * DAY,
    cliffTime: vestingStart,
    cliffAmountBps: 1_000, // 10%
  }),
  pausable: true,
  cancelable: true,
  cancelableByRecipient: false,
  transferable: true,
  transferableByRecipient: false,
  backendSigner: null,
  endBehaviors: [],
}).sendAndConfirm(umi)
// [/MAIN]

// [OUTPUT]
console.log('ClaimScheduleBucketV2:', vestingBucket)
// [/OUTPUT]
