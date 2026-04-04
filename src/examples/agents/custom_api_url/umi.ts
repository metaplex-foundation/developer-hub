// [IMPORTS]
import { mintAgent, mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity())

const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes)
umi.use(keypairIdentity(keypair))
// [/SETUP]

// [MAIN]
const result = await mintAgent(
  umi,
  { baseUrl: 'https://staging-api.metaplex.com' },
  {
    wallet: umi.identity.publicKey,
    name: 'My Agent',
    uri: 'https://example.com/metadata.json',
    agentMetadata: {
      type: 'agent',
      name: 'My Agent',
      description: 'Agent targeting staging API',
      services: [],
      registrations: [],
      supportedTrust: [],
    },
  }
)

console.log('Asset address:', result.assetAddress)
// [/MAIN]

// [OUTPUT]
// Asset address: <base58 address>
// [/OUTPUT]
