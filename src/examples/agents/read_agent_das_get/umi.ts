// [IMPORTS]
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('<DAS_ENDPOINT>').use(dasApi())
// [/SETUP]

// [MAIN]
const asset = await umi.rpc.getAsset(publicKey('AGENT_CORE_ASSET_ADDRESS'))

if (asset.is_agent) {
  console.log('Agent wallet (asset_signer):', asset.asset_signer)
  console.log('Canonical token mint:', asset.agent_token ?? 'not set')
} else {
  console.log('Core asset is not a registered agent')
}
// [/MAIN]

// [OUTPUT]
// Agent wallet (asset_signer): 6ttUwc5VVmHeVKTddB6XM5vQgBMfw62DThuoiVEufVZq
// Canonical token mint: not set
// [/OUTPUT]
