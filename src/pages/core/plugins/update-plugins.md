---
title: Updating Plugins
metaTitle: Updating Plugins | Core
description: Learn how to update existing plugins on MPL Core Assets and Collections using the updatePlugin function.
---

Many plugins on MPL Core Assets and Collections can be updated after they've been added. The `updatePlugin` function allows you to modify plugin data, such as changing attributes, updating royalties, or modifying freeze states.

{% totem %}
{% totem-accordion title="Technical Instruction Details" %}

**Instruction Accounts List**

| Account       | Description                                     |
| ------------- | ----------------------------------------------- |
| asset         | The address of the MPL Core Asset.              |
| collection    | The collection to which the Core Asset belongs. |
| payer         | The account paying for the storage fees.        |
| authority     | The owner or delegate with update permissions.  |
| systemProgram | The System Program account.                     |
| logWrapper    | The SPL Noop Program.                           |

**Instruction Arguments**

| Args   | Description                            |
| ------ | -------------------------------------- |
| plugin | The plugin data and type to update to. |

Some of the accounts/args may be abstracted out and/or optional in our SDKs for ease of use.
For detailed TypeDoc documentation, visit [MPL Core TypeDoc](https://mpl-core.typedoc.metaplex.com/functions/updatePlugin.html).

{% /totem-accordion %}
{% /totem %}

## Updating Plugins on Assets

### Basic Plugin Update Example

Here's how to update a plugin on an MPL Core Asset using the Attributes plugin as an example:

{% dialect-switcher title="Update Plugin on Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // Fetch the current asset to see existing plugin data
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // Update the Attributes plugin with new data
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Attributes',
      attributeList: [
        { key: 'level', value: '5' },        // Updated value
        { key: 'rarity', value: 'legendary' }, // New attribute
        { key: 'power', value: '150' },      // New attribute
      ],
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### Updating Royalties Plugin

{% dialect-switcher title="Update Royalties Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, ruleSet } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  const creator1 = publicKey('22222222222222222222222222222222')
  const creator2 = publicKey('33333333333333333333333333333333')

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Royalties',
      basisPoints: 750, // Updated from 500 to 750 (7.5%)
      creators: [
        { address: creator1, percentage: 70 }, // Updated distribution
        { address: creator2, percentage: 30 },
      ],
      ruleSet: ruleSet('ProgramAllowList', [
        [
          publicKey('44444444444444444444444444444444'),
          publicKey('55555555555555555555555555555555'),
        ],
      ]),
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### Updating State-Based Plugins

Some plugins store simple state that can be toggled, like the Freeze Delegate plugin:

{% dialect-switcher title="Update Freeze State" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // Freeze the asset
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'FreezeDelegate',
      frozen: true, // Set to true to freeze, false to unfreeze
    },
  }).sendAndConfirm(umi)

  // Later, unfreeze the asset
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'FreezeDelegate',
      frozen: false, // Unfreeze the asset
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## Updating Plugins on Collections

Collection plugins work similarly to asset plugins, but use the `updateCollectionPlugin` function:

{% dialect-switcher title="Update Plugin on Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

(async () => {
  const collectionAddress = publicKey('11111111111111111111111111111111')
  const creator1 = publicKey('22222222222222222222222222222222')
  const creator2 = publicKey('33333333333333333333333333333333')

  // Update collection-wide royalties
  await updateCollectionPlugin(umi, {
    collection: collectionAddress,
    plugin: {
      type: 'Royalties',
      basisPoints: 600, // 6% royalty for the collection
      creators: [
        { address: creator1, percentage: 80 },
        { address: creator2, percentage: 20 },
      ],
      ruleSet: ruleSet('None'),
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## Working with Complex Plugin Data

### Managing Lists in Plugins

Some plugins like Autograph and Verified Creators maintain lists of data. When updating these plugins, you need to pass the complete list you want to maintain:

{% dialect-switcher title="Update List-Based Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // First, fetch the current asset to see existing autographs
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // Add a new autograph while keeping existing ones
  const newAutograph = {
    address: umi.identity.publicKey,
    message: "Amazing NFT! Signed by collector."
  }

  // Include all existing autographs plus the new one
  const updatedAutographs = [...asset.autograph.signatures, newAutograph]

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Autograph',
      signatures: updatedAutographs, // Complete list including new addition
    },
    authority: umi.identity,
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### Removing Items from Lists

{% dialect-switcher title="Remove Items from Plugin Lists" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  const autographToRemove = publicKey('44444444444444444444444444444444')

  // Fetch current asset data
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // Filter out the autograph we want to remove
  const filteredAutographs = asset.autograph.signatures.filter(
    (autograph) => autograph.address !== autographToRemove
  )

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Autograph',
      signatures: filteredAutographs, // List without the removed item
    },
    authority: umi.identity,
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## Authority Requirements

Different plugins require different authorities to update:

- **Authority Managed Plugins** (Royalties, Attributes, Update Delegate): Require the **authority** of the asset or collection
- **Owner Managed Plugins** (Autograph, Freeze Delegate): Require the **owner** of the asset or the plugin's specific authority
- **Verified Creators Plugin**: Requires the **update authority** to add/remove creators, but individual **creators can verify themselves**

## Error Handling

Common errors when updating plugins:

- **Authority mismatch**: Ensure you're signing with the correct authority for the plugin type
- **Plugin not found**: The plugin must exist on the asset/collection before it can be updated
- **Invalid data**: Plugin data must conform to the expected structure and constraints
- **Collection mismatch**: If the asset is part of a collection, you may need to include the collection in the update

## Best Practices

1. **Fetch before updating**: Always fetch the current asset/collection state to see existing plugin data
2. **Preserve existing data**: When updating list-based plugins, include existing data you want to keep
3. **Use proper authorities**: Ensure you're using the correct signing authority for each plugin type
4. **Batch updates**: If updating multiple plugins, consider batching operations for efficiency
5. **Validate data**: Ensure your update data meets the plugin's requirements (e.g., creator percentages sum to 100%)

## Next Steps

- Learn about specific plugin updates in individual plugin documentation
- Explore [Plugin Overview](/core/plugins) for all available plugins
- Check out [Adding Plugins](/core/plugins/adding-plugins) and [Removing Plugins](/core/plugins/removing-plugins)
- Visit the [MPL Core TypeDoc](https://mpl-core.typedoc.metaplex.com) for detailed API documentation