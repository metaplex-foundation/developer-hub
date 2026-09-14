// [IMPORTS]
import { fetchAsset, mplCore } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com').use(mplCore())
const assetPublicKey = publicKey('AGENT_CORE_ASSET_ADDRESS')
// [/SETUP]

// [MAIN]
const assetData = await fetchAsset(umi, assetPublicKey)
const agentIdentity = assetData.agentIdentities?.[0]

console.log(agentIdentity?.uri)
console.log(agentIdentity?.lifecycleChecks?.transfer)
console.log(agentIdentity?.lifecycleChecks?.update)
console.log(agentIdentity?.lifecycleChecks?.execute)
// [/MAIN]

// [OUTPUT]
// https://example.com/agent-registration.json
// { __kind: 'Listen' }
// { __kind: 'Listen' }
// { __kind: 'Listen' }
// [/OUTPUT]
