// [IMPORTS]
import {
  fetchGenesisAccountV2,
  findGenesisAccountV2Pda,
  genesis,
  LaunchType,
  safeFetchGenesisAccountV2FromSeeds,
} from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())

const baseMint = publicKey('YOUR_PROJECT_TOKEN_MINT')
// [/SETUP]

// [MAIN]
// Fetch by PDA address (throws if the account does not exist)
const [genesisAccount] = findGenesisAccountV2Pda(umi, { baseMint, genesisIndex: 0 })
const account = await fetchGenesisAccountV2(umi, genesisAccount)

console.log('Authority:', account.authority)
console.log('Finalized:', account.finalized, 'Buckets:', account.bucketCount)
console.log('Supply:', account.totalSupplyBaseToken, 'Allocated:', account.totalAllocatedSupplyBaseToken)
console.log('Launch type:', account.launchType) // 0 = Uninitialized, 3 = LaunchPoolV1

// Or fetch straight from the seeds; safeFetch returns null if it does not exist
const sameAccount = await safeFetchGenesisAccountV2FromSeeds(umi, { baseMint, genesisIndex: 0 })
if (sameAccount?.launchType === LaunchType.LaunchPoolV1) {
  console.log('This is a launch pool')
}
// [/MAIN]

// [OUTPUT]
// Authority: <GENESIS_AUTHORITY>
// Finalized: true Buckets: 3
// Supply: 1000000000000000n Allocated: 1000000000000000n
// Launch type: 0
// [/OUTPUT]
