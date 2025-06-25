---
title: Get Fungible Assets by Owner
metaTitle: Get Fungible Assets | DAS API Guides
description: Learn how to retrieve all fungible tokens owned by a specific wallet
---

# Get Fungible Assets by Owner

This guide shows you how to retrieve all fungible tokens (like SPL tokens, SOL, etc.) owned by a specific wallet address using the DAS API.

## Method 1: Using Search Assets with Interface Filter (Recommended)

The most effective way to get fungible assets is using `searchAssets` with the `FungibleAsset` interface filter.

### UMI Example

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Get all fungible assets owned by a wallet
const fungibleAssets = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleAsset',
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

console.log(`Found ${fungibleAssets.items.length} fungible assets`)
fungibleAssets.items.forEach(asset => {
  console.log(`Token: ${asset.id}`)
  console.log(`Supply: ${asset.supply}`)
  console.log(`Name: ${asset.content.metadata?.name || 'Unknown'}`)
  console.log(`Symbol: ${asset.content.metadata?.symbol || 'Unknown'}`)
})
```

### JavaScript Example

```javascript
const response = await fetch('https://api.mainnet-beta.solana.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'searchAssets',
    params: {
      ownerAddress: 'WALLET_ADDRESS',
      interface: 'FungibleAsset',
      limit: 1000,
      options: {
        showFungible: true
      }
    }
  })
})

const data = await response.json()
console.log(`Found ${data.result.items.length} fungible assets`)
```

### cURL Example

```bash
curl -X POST https://api.mainnet-beta.solana.com \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "interface": "FungibleAsset",
      "limit": 1000,
      "options": {
        "showFungible": true
      }
    }
  }'
```

## Method 2: Using Get Assets By Owner with Filtering

You can also use `getAssetsByOwner` and filter the results client-side:

### UMI Example

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Get all assets and filter for fungible ones
const allAssets = await umi.rpc.getAssetsByOwner({
  owner: publicKey('WALLET_ADDRESS'),
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

// Filter for fungible assets
const fungibleAssets = allAssets.items.filter(asset => 
  asset.interface === 'FungibleAsset'
)

console.log(`Found ${fungibleAssets.length} fungible assets out of ${allAssets.items.length} total assets`)
```

## Method 3: Getting Specific Token Types

You can filter for specific fungible token types or mints:

### UMI Example

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Get USDC tokens
const usdcTokens = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleAsset',
  supplyMint: publicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC mint
  displayOptions: {
    showFungible: true
  }
})

// Get SOL (wrapped SOL)
const solTokens = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleAsset',
  supplyMint: publicKey('So11111111111111111111111111111111111111112'), // Wrapped SOL
  displayOptions: {
    showFungible: true
  }
})

console.log(`USDC tokens: ${usdcTokens.items.length}`)
console.log(`SOL tokens: ${solTokens.items.length}`)
```

## Method 4: Analyzing Token Balances

Here's how to analyze token balances in a wallet:

### UMI Example

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

async function analyzeFungibleBalances(walletAddress: string) {
  const fungibleAssets = await umi.rpc.searchAssets({
    owner: publicKey(walletAddress),
    interface: 'FungibleAsset',
    limit: 1000,
    displayOptions: {
      showFungible: true
    }
  })

  const balanceAnalysis = fungibleAssets.items.map(asset => ({
    id: asset.id,
    name: asset.content.metadata?.name || 'Unknown',
    symbol: asset.content.metadata?.symbol || 'Unknown',
    supply: asset.supply,
    supplyMint: asset.supplyMint,
    decimals: asset.content.metadata?.decimals || 0
  }))

  console.log('Fungible Token Balances:')
  balanceAnalysis.forEach(token => {
    console.log(`${token.symbol}: ${token.supply} (${token.name})`)
  })

  return balanceAnalysis
}

// Usage
const balances = await analyzeFungibleBalances('WALLET_ADDRESS')
```

## Method 5: Pagination for Large Token Holdings

For wallets with many fungible tokens, implement pagination:

### UMI Example

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

async function getAllFungibleAssets(walletAddress: string) {
  const allFungibleAssets = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await umi.rpc.searchAssets({
      owner: publicKey(walletAddress),
      interface: 'FungibleAsset',
      limit: 1000,
      page: page,
      displayOptions: {
        showFungible: true
      }
    })

    allFungibleAssets.push(...response.items)

    // Check if there are more pages
    hasMore = response.items.length === 1000
    page++
  }

  return allFungibleAssets
}

// Usage
const fungibleAssets = await getAllFungibleAssets('WALLET_ADDRESS')
console.log(`Total fungible assets: ${fungibleAssets.length}`)
```

## Method 6: Filtering by Token Properties

You can filter fungible tokens by various properties:

### UMI Example

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Get tokens with specific supply range
const highValueTokens = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleAsset',
  supply: 1000000, // Tokens with supply >= 1M
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

// Get tokens by creator
const creatorTokens = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleAsset',
  creatorAddress: 'CREATOR_ADDRESS',
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

console.log(`High value tokens: ${highValueTokens.items.length}`)
console.log(`Creator tokens: ${creatorTokens.items.length}`)
```

## Tips and Best Practices

1. **Use Interface Filter**: Always use `interface: 'FungibleAsset'` to get only fungible tokens.

2. **Enable Show Fungible**: Use `showFungible: true` in display options to get complete token information.

3. **Handle Supply Data**: Fungible tokens include `supply` and `supplyMint` fields for balance information.

4. **Consider Decimals**: Check the `decimals` field to properly format token amounts.

5. **Filter by Mint**: Use `supplyMint` to find specific token types (USDC, SOL, etc.).

6. **Cache Results**: Token balances change frequently, but token metadata is relatively stable.

## Related Guides

- [Get All Tokens in a Wallet](/das-api/guides/get-wallet-tokens)
- [Get NFTs by Owner](/das-api/guides/get-nfts-by-owner)
- [Search Assets by Multiple Criteria](/das-api/guides/search-by-criteria)
- [Analyze Collection Statistics](/das-api/guides/collection-statistics) 