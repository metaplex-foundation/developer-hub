---
title: Get All Tokens in a Wallet
metaTitle: Get Wallet Tokens | DAS API Guides
description: Learn how to retrieve all tokens owned by a specific wallet
---

This guide shows you how to retrieve all tokens (NFTs, fungible tokens, and other digital assets) owned by a specific wallet address using the DAS API.

## Method 1: Using Get Assets By Owner (Recommended)

The `getAssetsByOwner` method is the most direct way to get all tokens owned by a wallet.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // Get all tokens owned by a wallet
  const walletTokens = await umi.rpc.getAssetsByOwner({
    owner: publicKey("WALLET_ADDRESS"),
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: true,
    },
  });

  console.log(`Found ${walletTokens.items.length} tokens`);
  walletTokens.items.forEach((token) => {
    console.log(`Token: ${token.id}`);
    console.log(`Interface: ${token.interface}`);
    console.log(`Name: ${token.content.metadata?.name || "Unknown"}`);
  });
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  const response = await fetch("<ENDPOINT>", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getAssetsByOwner",
      params: {
        ownerAddress: "WALLET_ADDRESS",
        options: {
          showCollectionMetadata: true,
          showFungible: true,
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`Found ${data.result.items.length} tokens`);
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
    "method": "getAssetsByOwner",
    "params": {
      "ownerAddress": "WALLET_ADDRESS",
      "options": {
        "showCollectionMetadata": true,
        "showFungible": true
      }
    }
  }'
```

{% /totem-accordion %}
{% /totem %}

## Method 2: Using Search Assets with Owner Filter

You can also use `searchAssets` with an owner filter for more specific queries. This method is not supported by all DAS API Providers.

{% totem %}
{% totem-accordion title="UMI Example" %}

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

(async () => {
  const umi = createUmi(
    "<ENDPOINT>"
  ).use(dasApi());

  // Search for all assets owned by a specific wallet
  const walletAssets = await umi.rpc.searchAssets({
    owner: publicKey("WALLET_ADDRESS"),
    limit: 1000,
    displayOptions: {
      showCollectionMetadata: true,
      showFungible: true,
    },
  });

  console.log(`Found ${walletAssets.items.length} assets`);
})();
```

{% /totem-accordion %}
{% totem-accordion title="JavaScript Example" %}

```javascript
(async () => {
  const response = await fetch("<ENDPOINT>", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "searchAssets",
      params: {
        ownerAddress: "WALLET_ADDRESS",
        limit: 1000,
        options: {
          showCollectionMetadata: true,
          showFungible: true,
        },
      },
    }),
  });

  const data = await response.json();
  console.log(`Found ${data.result.items.length} assets`);
})();
```

{% /totem-accordion %}
{% /totem %}

## Tips and Best Practices

1. **Use [Display Options](/das-api/guides/display-options)**: Enable `showCollectionMetadata` and `showFungible` or other options like `showInscription` to get complete token information.

2. **Handle [Pagination](/das-api/guides/pagination)**: For wallets with many tokens, always implement pagination.

3. **Filter by Interface**: Use the `interface` parameter to get specific token types.

4. **Cache Results**: Wallet contents don't change frequently, so consider caching for better performance.

5. **Rate Limiting**: Be mindful of API rate limits when making multiple requests.

## Related Guides

- [Get Fungible Assets by Owner](/das-api/guides/get-fungible-assets)
- [Get NFTs by Owner](/das-api/guides/get-nfts-by-owner)
- [Get Assets by Owner and Collection](/das-api/guides/owner-and-collection)
- [Analyze Collection Statistics](/das-api/guides/collection-statistics) 