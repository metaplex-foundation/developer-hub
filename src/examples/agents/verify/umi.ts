// [IMPORTS]
import { fetchAsset } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity())
// [/SETUP]

// [MAIN]
const assetData = await fetchAsset(umi, result.assetAddress)
const agentIdentity = assetData.agentIdentities?.[0]

console.log('Registration URI:', agentIdentity?.uri)
console.log('Transfer hook active:', agentIdentity?.lifecycleChecks?.transfer)
console.log('Update hook active:', agentIdentity?.lifecycleChecks?.update)
console.log('Execute hook active:', agentIdentity?.lifecycleChecks?.execute)
// [/MAIN]

// [OUTPUT]
// Registration URI: https://example.com/agent-metadata.json
// Transfer hook active: { __kind: 'Listen' }
// Update hook active: { __kind: 'Listen' }
// Execute hook active: { __kind: 'Listen' }
// [/OUTPUT]
