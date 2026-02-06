---
title: Get Fungible Assets by Owner
metaTitle: Get Fungible Assets | DAS API Guides
description: Learn how to retrieve all fungible tokens owned by a specific wallet
---

This guide shows you how to retrieve all fungible tokens (like SPL tokens, SOL, etc.) owned by a specific wallet address using the DAS API.

## Method 1: Using Search Assets with Interface Filter (Recommended)

The most effective way to get fungible assets is using `searchAssets` with the `FungibleToken` interface filter. It only returns fungible assets, so you don't need to filter for them.

While this method is the most effective, it's not supported by all DAS API Providers currently.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // Get all fungible assets owned by a wallet
  const fungibleTokens = await umi.rpc.searchAssets({
    owner: publicKey('WALLET_ADDRESS'),
    interface: 'FungibleToken',
    limit: 1000,
    displayOptions: {
      showFungible: true
    }
  })

  console.log(`Found ${fungibleTokens.items.length} fungible assets`)
  fungibleTokens.items.forEach(asset => {
    console.log(`Token: ${asset.id}`)
    console.log(`Supply: ${asset.supply}`)
    console.log(`Name: ${asset.content.metadata?.name || 'Unknown'}`)
    console.log(`Symbol: ${asset.content.metadata?.symbol || 'Unknown'}`)
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
        limit: 10000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const data = await response.json()
  console.log(`Found ${data.result.items.length} fungible assets`)
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
      "limit": 10000,
      "options": {
        "showFungible": true
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## Method 2: Using Get Assets By Owner with Filtering

You can also use `getAssetsByOwner` and filter the results client-side:

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi('<ENDPOINT>').use(dasApi())

  // Get all assets and filter for fungible ones
  const allAssets = await umi.rpc.getAssetsByOwner({
    owner: publicKey('WALLET_ADDRESS'),
    limit: 10000,
    displayOptions: {
      showFungible: true
    }
  })

  // Filter for fungible assets
  const fungibleTokens = allAssets.items.filter(
    (asset) => asset.interface === 'FungibleToken',
  )

  console.log(
    `Found ${fungibleTokens.length} fungible assets out of ${allAssets.items.length} total assets`,
  )
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
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: 'WALLET_ADDRESS',
        options: {
          showFungible: true
        }
      }
    })
  })

  const data = await response.json()
  const allAssets = data.result

  // Filter for fungible assets
  const FungibleTokens = allAssets.items.filter(asset => 
    asset.interface === 'FungibleToken'
  )

  console.log(`Found ${FungibleTokens.length} fungible assets out of ${allAssets.items.length} total assets`)
})();
```

{% /totem-accordion %}
{% /totem %}

## Method 3: Filtering by Token Properties

You can filter fungible tokens by various properties:

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Get tokens with specific supply range
const tokensBySupply = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleToken',
  supply: 1000000, // Tokens with supply >= 1M
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

// Get tokens by creator
const creatorTokens = await umi.rpc.searchAssets({
  owner: publicKey('WALLET_ADDRESS'),
  interface: 'FungibleToken',
  creatorAddress: 'CREATOR_ADDRESS',
  limit: 1000,
  displayOptions: {
    showFungible: true
  }
})

console.log(`Tokens by supply: ${tokensBySupply.items.length}`)
console.log(`Creator tokens: ${creatorTokens.items.length}`)
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  // Get tokens with specific supply range
  const tokensBySupplyResponse = await fetch('<ENDPOINT>', {
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
        supply: 1000000, // Tokens with supply >= 1M
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const tokensBySupplyData = await tokensBySupplyResponse.json()
  const tokensBySupply = tokensBySupplyData.result

  // Get tokens by creator
  const creatorResponse = await fetch('<ENDPOINT>', {
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
        creatorAddress: 'CREATOR_ADDRESS',
        limit: 1000,
        options: {
          showFungible: true
        }
      }
    })
  })

  const creatorData = await creatorResponse.json()
  const creatorTokens = creatorData.result

  console.log(`Tokens by supply: ${tokensBySupply.items.length}`)
  console.log(`Creator tokens: ${creatorTokens.items.length}`)
})();
```

{% /totem-accordion %}
{% /totem %}

## Tips and Best Practices

1. **Use Interface Filter**: see [Search Assets by Criteria](/dev-tools/das-api/guides/search-by-criteria) for more information.
2. **Enable Show Fungible**: Use `showFungible: true` in display options to get complete token information as shown in [Display Options](/dev-tools/das-api/display-options).
3. **Consider Decimals**: Check the `decimals` field to properly format token amounts.
4. **Cache Results**: Token balances change frequently, but token metadata is relatively stable.

## Related Guides

- [Get All Tokens in a Wallet](/dev-tools/das-api/guides/get-wallet-tokens)
- [Get NFTs by Owner](/dev-tools/das-api/guides/get-nfts-by-owner)
- [Search Assets by Multiple Criteria](/dev-tools/das-api/guides/search-by-criteria)
- [Analyze Collection Statistics](/dev-tools/das-api/guides/collection-statistics)
