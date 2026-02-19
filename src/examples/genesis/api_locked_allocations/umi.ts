// [IMPORTS]
import {
  createAndRegisterLaunch,
  CreateLaunchInput,
} from '@metaplex-foundation/genesis'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { genesis } from '@metaplex-foundation/genesis'
import { keypairIdentity } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())

// umi.use(keypairIdentity(myKeypair));
// [/SETUP]

// [MAIN]
const input: CreateLaunchInput = {
  wallet: umi.identity.publicKey,
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/...',
    description: 'A project token with locked allocations.',
    externalLinks: {
      website: 'https://example.com',
      twitter: '@mytoken',
    },
  },
  launchType: 'project',
  launch: {
    launchpool: {
      tokenAllocation: 500_000_000,
      depositStartTime: new Date('2026-04-01T00:00:00Z'),
      raiseGoal: 200,
      raydiumLiquidityBps: 5000,
      fundsRecipient: 'FundsRecipientWallet...',
    },
    lockedAllocations: [
      {
        name: 'Team',
        recipient: 'TeamWallet...',
        tokenAmount: 100_000_000,
        vestingStartTime: new Date('2026-04-05T00:00:00Z'),
        vestingDuration: { value: 1, unit: 'YEAR' },
        unlockSchedule: 'MONTH',
        cliff: {
          duration: { value: 3, unit: 'MONTH' },
          unlockAmount: 10_000_000,
        },
      },
    ],
  },
}

const result = await createAndRegisterLaunch(umi, input)
console.log(`Launch live at: ${result.launch.link}`)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
