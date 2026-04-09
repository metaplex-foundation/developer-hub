// [IMPORTS]
import { mintAndSubmitAgent, mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry'
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
const result = await mintAndSubmitAgent(
  umi,
  {},
  {
    wallet: umi.identity.publicKey,
    name: 'My Agent',
    uri: 'https://example.com/metadata.json',
    agentMetadata: {
      type: 'agent',
      name: 'My Agent',
      description: 'Agent with custom transaction sender',
      services: [],
      registrations: [],
      supportedTrust: [],
    },
  },
  {
    txSender: async (tx) => {
      const signed = await umi.identity.signTransaction(tx)
      return myCustomSend(signed)
    },
  }
)

console.log('Asset address:', result.assetAddress)
console.log('Transaction signature:', result.signature)
// [/MAIN]

// [OUTPUT]
// Asset address: <base58 address>
// Transaction signature: <base58 signature>
// [/OUTPUT]
