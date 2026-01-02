---
title: Display Options
metaTitle: Display Options | DAS API
description: Learn about the display options available in DAS API methods
---

The DAS API provides display options that allow you to control what additional information is included in the response. These options are available as an `options` object parameter in several API methods.

## Available Display Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `showCollectionMetadata` | boolean | When `true`, includes collection metadata in the response. This provides information about the collection the asset belongs to. | `false` |
| `showFungible` | boolean | When `true`, includes fungible token information in the response. This is useful for assets that represent fungible tokens or if you want to `getAssetsByOwner` and actually see all assets. | `false` |
| `showInscription` | boolean | When `true`, includes inscription data in the response. This provides information about any inscriptions associated with the included asset. | `false` |
| `showUnverifiedCollections` | boolean | When `true`, includes unverified collections in the response. By default, only verified collections are shown. | `false` |
| `showZeroBalance` | boolean | When `true`, includes token accounts with zero balance in the response. By default, only accounts with non-zero balances are shown. | `false` |

## Usage Examples

### Basic Usage

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Get an asset with collection metadata
const asset = await umi.rpc.getAsset({
  id: publicKey('your-asset-id'),
  displayOptions: {
    showCollectionMetadata: true
  }
})
```

### Multiple Options

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Get assets with multiple display options enabled
const assets = await umi.rpc.getAssetsByOwner({
  owner: publicKey('owner-address'),
  displayOptions: {
    showCollectionMetadata: true,
    showFungible: true,
    showInscription: true
  }
})
```

### All Options Enabled

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// Enable all display options
const assets = await umi.rpc.searchAssets({
  owner: publicKey('owner-address'),
  displayOptions: {
    showCollectionMetadata: true,
    showFungible: true,
    showInscription: true,
    showUnverifiedCollections: true,
    showZeroBalance: true
  }
})
```

## Methods That Support Display Options

The following DAS API methods support the `options` parameter with display options:

- [Get Asset](/dev-tools/das-api/methods/get-asset)
- [Get Assets](/dev-tools/das-api/methods/get-assets)
- [Get Assets By Owner](/dev-tools/das-api/methods/get-assets-by-owner)
- [Get Assets By Creator](/dev-tools/das-api/methods/get-assets-by-creator)
- [Get Assets By Authority](/dev-tools/das-api/methods/get-assets-by-authority)
- [Get Assets By Group](/dev-tools/das-api/methods/get-assets-by-group)
- [Search Assets](/dev-tools/das-api/methods/search-assets)

## Performance Considerations

Enabling display options may increase response size and processing time. Only enable the options you need for your specific use case to optimize performance. 
