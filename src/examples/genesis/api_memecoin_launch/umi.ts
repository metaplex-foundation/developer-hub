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
    name: 'My Memecoin',
    symbol: 'MEME',
    image: 'https://gateway.irys.xyz/...',
  },
  launchType: 'memecoin',
  launch: {
    depositStartTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  },
}

const result = await createAndRegisterLaunch(umi, {}, input)
console.log(`Launch live at: ${result.launch.link}`)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
