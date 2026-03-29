// [IMPORTS]
import {
  mintAgent,
  isAgentApiError,
  isAgentApiNetworkError,
  isAgentValidationError,
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
const input = {
  wallet: umi.identity.publicKey,
  name: 'My Agent',
  uri: 'https://example.com/metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My Agent',
    description: 'An autonomous agent',
    services: [],
    registrations: [],
    supportedTrust: [],
  },
}

try {
  const result = await mintAgent(umi, {}, input)
} catch (err) {
  if (isAgentValidationError(err)) {
    // Client-side validation failed before the API was called
    console.error(`Validation error on field "${err.field}": ${err.message}`)
  } else if (isAgentApiNetworkError(err)) {
    // Could not reach the API endpoint
    console.error('Network error:', err.message, err.cause)
  } else if (isAgentApiError(err)) {
    // API responded with a non-2xx status
    console.error(`API error (${err.statusCode}): ${err.message}`)
    console.error('Response body:', err.responseBody)
  } else {
    throw err
  }
}
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
