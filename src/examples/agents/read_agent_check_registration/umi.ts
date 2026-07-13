// [IMPORTS]
import {
  safeFetchAgentIdentityV1,
  findAgentIdentityV1Pda,
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
const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey })
const identity = await safeFetchAgentIdentityV1(umi, pda)

console.log('Registered:', identity !== null)
// [/MAIN]

// [OUTPUT]
// Registered: true
// [/OUTPUT]
