// [IMPORTS]
import {
  mintAndSubmitAgent,
  mplAgentIdentity,
} from '@metaplex-foundation/mpl-agent-registry'
import { fetchAsset } from '@metaplex-foundation/mpl-core'
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
// 1. Mint the agent
const result = await mintAndSubmitAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
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
console.log('Tx signature:', result.signature)

// 2. Verify the agent identity was registered
const assetData = await fetchAsset(umi, result.assetAddress)
const agentIdentity = assetData.agentIdentities?.[0]

console.log('Registered:', agentIdentity !== undefined)
console.log('Registration URI:', agentIdentity?.uri)
// [/MAIN]

// [OUTPUT]
// Asset address: <base58 address>
// Tx signature: <base58 signature>
// Registered: true
// Registration URI: https://example.com/agent-metadata.json
// [/OUTPUT]
