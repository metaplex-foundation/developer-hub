// [IMPORTS]
import {
  mintAgent,
  signAndSendAgentTransaction,
  mplAgentIdentity,
} from '@metaplex-foundation/mpl-agent-registry'
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
// Step 1: Call the API — returns the unsigned transaction and the pre-computed asset address
const mintResult = await mintAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous trading agent',
    services: [
      { name: 'trading', endpoint: 'https://myagent.ai/trade' },
      { name: 'analysis', endpoint: 'https://myagent.ai/analyze' },
    ],
    registrations: [
      { agentId: 'agent-123', agentRegistry: 'my-registry' },
    ],
    supportedTrust: ['tee'],
  },
})

console.log('Asset address:', mintResult.assetAddress)

// Step 2: Sign and send using the SDK helper
const signature = await signAndSendAgentTransaction(umi, mintResult)
console.log('Confirmed signature:', signature)
// [/MAIN]

// [OUTPUT]
// Asset address: <base58 address>
// Confirmed signature: <base58 signature>
// [/OUTPUT]
