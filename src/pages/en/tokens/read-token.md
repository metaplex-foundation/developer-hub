---
title: Read Token Data
metaTitle: Read Token Data | Tokens
description: Learn how to fetch fungible token data from the Solana blockchain and using DAS API
created: '11-28-2025'
updated: '11-28-2025'
---

Fetch fungible token information directly from the Solana blockchain or through the DAS API for optimized queries. {% .lead %}

## What You'll Learn

This guide covers two approaches to reading token data:

- **Direct blockchain queries** - Fetch token data using RPC calls
- **DAS API queries** - Use indexed data for faster, more flexible searches

## Fetching Token Data Directly

### Get Token Metadata by Mint Address

To fetch a token's metadata directly from the blockchain, you need the mint address. This approach reads data directly from on-chain accounts.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  fetchDigitalAsset,
  mplTokenMetadata
} from '@metaplex-foundation/mpl-token-metadata'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(mplTokenMetadata())

  const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')

  // Fetch the token's metadata
  const asset = await fetchDigitalAsset(umi, mintAddress)

  console.log('Token Name:', asset.metadata.name)
  console.log('Token Symbol:', asset.metadata.symbol)
  console.log('Token URI:', asset.metadata.uri)
  console.log('Decimals:', asset.mint.decimals)
  console.log('Supply:', asset.mint.supply)
})();
```
{% /totem-accordion %}
{% /totem %}

### Get Token Balance for a Wallet

Fetch the token balance a specific wallet holds for a given token mint.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  findAssociatedTokenPda,
  fetchToken
} from '@metaplex-foundation/mpl-toolbox'

(async () => {
  const umi = createUmi('<ENDPOINT>')

  const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')
  const walletAddress = publicKey('WALLET_ADDRESS')

  // Find the Associated Token Account
  const tokenAccount = findAssociatedTokenPda(umi, {
    mint: mintAddress,
    owner: walletAddress,
  })

  // Fetch the token account data
  const tokenData = await fetchToken(umi, tokenAccount)

  console.log('Token Balance:', tokenData.amount)
  console.log('Mint:', tokenData.mint)
  console.log('Owner:', tokenData.owner)
})();
```
{% /totem-accordion %}
{% /totem %}

### Get All Token Accounts for a Wallet

Retrieve all token accounts owned by a specific wallet to see all their token holdings.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { SPL_TOKEN_PROGRAM_ID } from '@metaplex-foundation/mpl-toolbox'

(async () => {
  const umi = createUmi('<ENDPOINT>')

  const walletAddress = publicKey('WALLET_ADDRESS')

  // Get all token accounts using getProgramAccounts
  const tokenAccounts = await umi.rpc.getProgramAccounts(SPL_TOKEN_PROGRAM_ID, {
    filters: [
      { dataSize: 165 }, // Token account size
      {
        memcmp: {
          offset: 32, // Owner offset in token account
          bytes: walletAddress,
        },
      },
    ],
  })

  console.log(`Found ${tokenAccounts.length} token accounts`)

  tokenAccounts.forEach((account) => {
    console.log('Token Account:', account.publicKey)
  })
})();
```
{% /totem-accordion %}
{% /totem %}

## Fetching Token Data with DAS API

The [Digital Asset Standard (DAS) API](/das-api) provides indexed access to token data, enabling faster queries and advanced filtering capabilities. This is the recommended approach for applications that need to query multiple tokens or search by various criteria.

### Get Token by Mint Address

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  const mintAddress = publicKey('YOUR_TOKEN_MINT_ADDRESS')

  // Fetch the asset using DAS
  const asset = await umi.rpc.getAsset(mintAddress, {
    displayOptions: {
      showFungible: true
    }
  })

  console.log('Token ID:', asset.id)
  console.log('Name:', asset.content.metadata?.name)
  console.log('Symbol:', asset.content.metadata?.symbol)
  console.log('Interface:', asset.interface)
  console.log('Supply:', asset.supply)
  console.log('Decimals:', asset.token_info?.decimals)
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  const response = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAsset',
      params: {
        id: 'YOUR_TOKEN_MINT_ADDRESS',
        displayOptions: {
          showFungible: true
        }
      }
    })
  })

  const { result: asset } = await response.json()

  console.log('Token ID:', asset.id)
  console.log('Name:', asset.content.metadata?.name)
  console.log('Symbol:', asset.content.metadata?.symbol)
  console.log('Interface:', asset.interface)
})();
```
{% /totem-accordion %}
{% totem-accordion title="cURL Example" %}

```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getAsset",
    "params": {
      "id": "YOUR_TOKEN_MINT_ADDRESS",
      "displayOptions": {
        "showFungible": true
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

### Get All Fungible Tokens by Owner

Retrieve all fungible tokens owned by a wallet address. Use the `FungibleToken` interface filter for efficient querying.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  const walletAddress = publicKey('WALLET_ADDRESS')

  // Search for all fungible tokens owned by the wallet
  const fungibleTokens = await umi.rpc.searchAssets({
    owner: walletAddress,
    interface: 'FungibleToken',
    limit: 1000,
    displayOptions: {
      showFungible: true
    }
  })

  console.log(`Found ${fungibleTokens.items.length} fungible tokens`)

  fungibleTokens.items.forEach(token => {
    console.log(`\nToken: ${token.id}`)
    console.log(`Name: ${token.content.metadata?.name || 'Unknown'}`)
    console.log(`Symbol: ${token.content.metadata?.symbol || 'Unknown'}`)
    console.log(`Balance: ${token.token_info?.balance}`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  const response = await fetch('<ENDPOINT>', {
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
        interface: 'FungibleToken',
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const { result } = await response.json()

  console.log(`Found ${result.items.length} fungible tokens`)

  result.items.forEach(token => {
    console.log(`Token: ${token.id}`)
    console.log(`Name: ${token.content.metadata?.name || 'Unknown'}`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="cURL Example" %}

```bash
curl -X POST <ENDPOINT> \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "searchAssets",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "interface": "FungibleToken",
      "limit": 1000,
      "options": {
        "showFungible": true
      }
    }
  }'
```
{% /totem-accordion %}
{% /totem %}

### Search Tokens by Creator

Find all fungible tokens created by a specific address.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  const creatorAddress = publicKey('CREATOR_ADDRESS')

  // Search for tokens by creator
  const tokens = await umi.rpc.searchAssets({
    creatorAddress: creatorAddress,
    interface: 'FungibleToken',
    limit: 1000,
    displayOptions: {
      showFungible: true
    }
  })

  console.log(`Found ${tokens.items.length} tokens by creator`)

  tokens.items.forEach(token => {
    console.log(`Token: ${token.content.metadata?.name} (${token.id})`)
  })
})();
```
{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  const response = await fetch('<ENDPOINT>', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'searchAssets',
      params: {
        creatorAddress: 'CREATOR_ADDRESS',
        interface: 'FungibleToken',
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const { result } = await response.json()
  console.log(`Found ${result.items.length} tokens by creator`)
})();
```
{% /totem-accordion %}
{% /totem %}

## Comparing Approaches

| Feature | Direct RPC | DAS API |
|---------|-----------|---------|
| Speed | Slower for bulk queries | Optimized for bulk queries |
| Data freshness | Real-time | Near real-time (indexed) |
| Search capabilities | Limited | Advanced filtering |
| Rate limits | Standard RPC limits | Provider-dependent |
| Use case | Single token lookups | Portfolio views, searches |

## Tips and Best Practices

1. **Use DAS for portfolio views** - When displaying all tokens a user owns, DAS API is significantly faster than multiple RPC calls.

2. **Enable showFungible** - Always set `showFungible: true` in display options to get complete token information including balances and decimals.

3. **Handle decimals correctly** - Token amounts are returned as raw integers. Divide by `10^decimals` to get the human-readable amount.

4. **Cache metadata** - Token metadata rarely changes. Cache it to reduce API calls and improve performance.

5. **Paginate large results** - When fetching many tokens, use pagination to handle large result sets efficiently. See the [DAS pagination guide](/das-api/guides/pagination) for details.

## Related Guides

- [Create a Token](/tokens/create-a-token)
- [DAS API Overview](/das-api)
- [Get Fungible Assets by Owner](/das-api/guides/get-fungible-assets)
- [Search Assets by Criteria](/das-api/guides/search-by-criteria)
