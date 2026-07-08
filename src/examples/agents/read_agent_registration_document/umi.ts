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

if (agentIdentity?.uri) {
  const response = await fetch(agentIdentity.uri)
  const registration = await response.json()

  console.log(registration.name)
  console.log(registration.description)
  console.log(registration.active)

  for (const service of registration.services) {
    console.log(service.name)
    console.log(service.endpoint)
    console.log(service.version)
  }
}
// [/MAIN]

// [OUTPUT]
// Plexpert
// An informational agent...
// true
// web
// https://metaplex.com/agent/<ASSET_PUBKEY>
// undefined
// [/OUTPUT]
