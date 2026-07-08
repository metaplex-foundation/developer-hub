// [IMPORTS]
import {
  fetchAgentIdentityV1FromSeeds,
  mplAgentIdentity,
} from '@metaplex-foundation/mpl-agent-registry'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com').use(mplAgentIdentity())
const assetPublicKey = publicKey('AGENT_CORE_ASSET_ADDRESS')
// [/SETUP]

// [MAIN]
const identity = await fetchAgentIdentityV1FromSeeds(umi, {
  asset: assetPublicKey,
})

console.log('Identity:', identity)
// [/MAIN]

// [OUTPUT]
// Identity: { ... }
// [/OUTPUT]
