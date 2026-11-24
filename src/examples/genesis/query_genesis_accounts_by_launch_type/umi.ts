// [IMPORTS]
import { genesis, getGenesisAccountV2GpaBuilder, LaunchType } from '@metaplex-foundation/genesis'
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
// getProgramAccounts scans every Genesis account, so use an RPC that allows it.
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplToolbox())
  .use(genesis())
// [/SETUP]

// [MAIN]
// Every finalized Genesis account whose launch type is Launch Pool
const launchPools = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.LaunchPoolV1)
  .whereField('finalized', true)
  .getDeserialized()

console.log('Finalized launch pools:', launchPools.length)
for (const account of launchPools.slice(0, 5)) {
  console.log(account.publicKey, account.baseMint)
}
// [/MAIN]

// [OUTPUT]
// Finalized launch pools: 42
// <GENESIS_ACCOUNT> <BASE_MINT>
// [/OUTPUT]
