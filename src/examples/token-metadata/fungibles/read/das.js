// [IMPORTS]
// npm install @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/digital-asset-standard-api
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
// [/IMPORTS]

// [SETUP]
// Initialize Umi with a DAS-enabled RPC endpoint
const umi = createUmi('https://api.devnet.solana.com').use(dasApi())

// The mint address of the token you want to fetch
const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')
// [/SETUP]

// [MAIN]
// Fetch the asset using DAS API
const asset = await umi.rpc.getAsset(mintAddress, {
  displayOptions: {
    showFungible: true
  }
})
// [/MAIN]

// [OUTPUT]
console.log('Token ID:', asset.id)
console.log('Name:', asset.content.metadata?.name)
console.log('Symbol:', asset.content.metadata?.symbol)
console.log('Interface:', asset.interface)