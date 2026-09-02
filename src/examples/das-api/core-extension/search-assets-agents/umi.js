// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { das } from '@metaplex-foundation/mpl-core-das'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('<ENDPOINT>').use(dasApi())
// [/SETUP]

// [MAIN]
const agents = await das.searchAssets(umi, {
  isAgent: true,
  // agentToken: publicKey('<GenesisMint>'),
  // assetSigner: publicKey('<AssetSignerPda>'),
  skipDerivePlugins: true,
})
// [/MAIN]

// [OUTPUT]
// When indexed: agents[i].is_agent, .agent_token, .asset_signer
console.log(agents)
// [/OUTPUT]
