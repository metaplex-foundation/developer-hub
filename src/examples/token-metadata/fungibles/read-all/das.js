// [IMPORTS]
// npm install @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/digital-asset-standard-api
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com').use(dasApi())

const walletAddress = publicKey('WALLET_ADDRESS')
// [/SETUP]

// [MAIN]
// Get all fungible assets owned by the wallet using searchAssets
// Using interface: 'FungibleToken' filters server-side (more efficient)
const result = await umi.rpc.searchAssets({
  owner: walletAddress,
  interface: 'FungibleToken',
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

const fungibleTokens = result.items
// [/MAIN]

// [OUTPUT]
console.log(`Found ${fungibleTokens.length} fungible tokens\n`)

fungibleTokens.forEach(token => {
  const decimals = token.token_info?.decimals || 0
  const rawBalance = token.token_info?.balance || 0
  const balance = Number(rawBalance) / Math.pow(10, decimals)

  console.log(`${token.content.metadata?.name} (${token.content.metadata?.symbol})`)
  console.log(`  Mint: ${token.id}`)
  console.log(`  Balance: ${balance.toLocaleString()}`)
})
// [/OUTPUT]
