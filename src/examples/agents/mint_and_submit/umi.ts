// [IMPORTS]
import { mintAndSubmitAgent } from '@metaplex-foundation/mpl-agent-registry'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity } from '@metaplex-foundation/umi'
import { mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity())

const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes)
umi.use(keypairIdentity(keypair))
// [/SETUP]

// [MAIN]
const result = await mintAndSubmitAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',  // Core asset NFT metadata URI
  agentMetadata: {                                  // Stored off-chain by the Metaplex API
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous trading agent',
    services: [
      { name: 'trading', endpoint: 'https://myagent.ai/trade' },
    ],
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
