// [IMPORTS]
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('<DAS_ENDPOINT>').use(dasApi())
// [/SETUP]

// [MAIN]
const results = await umi.rpc.searchAssets({
  isAgent: true,
  interface: 'MplCoreAsset',
  limit: 100,
})

for (const agent of results.items) {
  console.log(agent.id, agent.asset_signer, agent.agent_token ?? 'no token')
}
// [/MAIN]

// [OUTPUT]
// 1RUC5FMQherGNoLF9wDBxa1oznbq1mTieWLZ8gU8S31 DwgDrVVwcuXGU2MjHcZEcNtG2cGF6cLXCS35gPiUsU6p no token
// [/OUTPUT]
