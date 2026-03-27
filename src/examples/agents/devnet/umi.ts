// [IMPORTS]
import { mintAndSubmitAgent, mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplAgentIdentity())

const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes)
umi.use(keypairIdentity(keypair))
// [/SETUP]

// [MAIN]
const result = await mintAndSubmitAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  network: 'solana-devnet',
  name: 'Test Agent',
  uri: 'https://example.com/test-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'Test Agent',
    description: 'A test agent on devnet',
    services: [],
    registrations: [],
    supportedTrust: [],
  },
})

console.log('Asset address:', result.assetAddress)
console.log('Transaction signature:', result.signature)
// [/MAIN]

// [OUTPUT]
// Asset address: <base58 address>
// Transaction signature: <base58 signature>
// [/OUTPUT]
