// [IMPORTS]
// npm install @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/digital-asset-standard-api
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com').use(dasApi())

const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')
const walletAddress = publicKey('WALLET_ADDRESS')
// [/SETUP]

// [MAIN]
// Use searchAssets to find the token with balance for a specific wallet
const result = await umi.rpc.searchAssets({
  owner: walletAddress,
  interface: 'FungibleToken',
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

// Find the specific token by mint address
const token = result.items.find(
  (asset) => asset.id === mintAddress
)
// [/MAIN]

// [OUTPUT]
if (token) {
  console.log('Token:', token.content.metadata?.name)
  console.log('Balance (raw):', token.token_info?.balance)
  console.log('Decimals:', token.token_info?.decimals)

  // Calculate human-readable balance
  const decimals = token.token_info?.decimals || 0
  const balance = Number(token.token_info?.balance) / Math.pow(10, decimals)
  console.log('Balance:', balance)
} else {
  console.log('Token not found in wallet')
}
// [/OUTPUT]
