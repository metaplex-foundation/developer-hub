// [IMPORTS]
// npm install @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/digital-asset-standard-api
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
// [/IMPORTS]

// [SETUP]
// Initialize Umi with a DAS-enabled RPC endpoint
const umi = createUmi('https://api.devnet.solana.com').use(dasApi())

// The address of the NFT you want to fetch
const assetAddress = publicKey('YOUR_NFT_ADDRESS')
// [/SETUP]

// [MAIN]
// Fetch the asset using DAS API
const asset = await umi.rpc.getAsset(assetAddress)
// [/MAIN]

// [OUTPUT]
console.log('Asset ID:', asset.id)
console.log('Name:', asset.content.metadata?.name)
console.log('Description:', asset.content.metadata?.description)
console.log('Image:', asset.content.links?.image)
console.log('Owner:', asset.ownership.owner)
console.log('Interface:', asset.interface)
// [/OUTPUT]
