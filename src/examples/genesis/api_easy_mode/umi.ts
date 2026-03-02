// [IMPORTS]
import {
  createAndRegisterLaunch,
  CreateLaunchInput,
  genesis,
} from '@metaplex-foundation/genesis'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())

// Use keypairIdentity to set a wallet when running server-side:
// umi.use(keypairIdentity(myKeypair))
// [/SETUP]

// [MAIN]
const input: CreateLaunchInput = {
  wallet: umi.identity.publicKey,
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/...',
  },
  launchType: 'project',
  launch: {
    launchpool: {
      tokenAllocation: 500_000_000,
      depositStartTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
      raiseGoal: 200,
      raydiumLiquidityBps: 5000,
      fundsRecipient: umi.identity.publicKey,
    },
  },
}

const result = await createAndRegisterLaunch(umi, {}, input)
console.log(`Launch live at: ${result.launch.link}`)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
