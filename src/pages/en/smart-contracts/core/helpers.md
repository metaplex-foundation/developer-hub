---
title: Helpers
metaTitle: Helpers | Core
description: Learn about the Core helper functions such as validation helpers, fetch helpers, plugin helpers, and more.
---


{% callout type="note" title="JS Helper Functions" %}

The following helper functions are for the JS client.

{% /callout %}

## Fetch Helpers

The new fetch helpers allows you the option to derive the plugins or not from each helper method.

### fetchAsset()

Fetches a single Asset.

```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByOwner()

Fetches all the Assets of a given owners Address.

```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByCollection()

Fetches all the Assets of a given Collection Address.

```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByUpdateAuthority()

Fetches all the Assets of a given Collection Address.

```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```

## Authority Helpers

The Authority helpers allow you to pass in a `publicKey` to check with that the address has the authority over certain aspects of the Core ecosystem (Assets, Collections, and Plugins).

### hasPluginAddressAuthority()

The `hasPluginAddressAuthority()` returns a `boolean` value based on wether the plugin passed in its authority set to an `Address` type and the `pubkey` matches.

```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```

### hasPluginOwnerAuthority()

The `hasPluginOwnerAuthority()` returns a `boolean` value based on wether the plugin passed in its authority set to an `Owner` type and the `pubkey` matches.

```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```

### hasPluginUpdateAuthority()

The `hasPluginUpdateAuthority()` returns a `boolean` value based on wether the plugin passed in its authority set to an `UpdateAuthority` type and the `pubkey` matches.

```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```

### hasAssetUpdateAuthority()

The `hasAssetUpdateAuthority()` returns a `boolean` value based on wether the passed in `pubkey` holds update authority over the Asset.

```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```

### hasCollectionUpdateAuthority()

The `hasCollectionUpdateAuthority()` returns a `boolean` value based on wether the passed in `pubkey` holds update authority over the Collection.

```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```

## Lifecycle Helpers

The **Lifecycle Helpers** provide a quick and efficient way to check whether an address can perform a certain lifecycle event.

### validateTransfer()

Returns a `boolean` value on whether the publicKey is eligible to transfer the Asset.

```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```

### validateBurn

Returns a `boolean` value on whether the publicKey can burn the Asset.

```ts
export async function validateBurn(umi, { authority, asset, collection })
```

### canUpdate()

Returns a `boolean` value on whether the publicKey is eligible to update Asset.

```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
)
```

### Plugin Helpers

### assetPluginKeyFromType()

Convert a plugin type to a key for the asset plugins.

```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```

### pluginTypeFromAssetPluginKey()

Convert a plugin key to a type.

```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```

### checkPluginAuthorities()

Check the authority for the given plugin types on an asset.

```ts
export function checkPluginAuthorities({
  authority,
  pluginTypes,
  asset,
  collection,
})
```

## State Helpers

### collectionAddress()

Find the collection address for the given asset if it is part of a collection.
Returns either a `publicKey | undefined`

```ts
export function collectionAddress(asset: AssetV1)
```

### deriveAssetPlugins()

Derive the asset plugins from the asset and collection. Plugins on the asset take precedence over plugins on the collection.

```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```

### isFrozen()

Returns a `boolean` on whether the Asset is frozen.

```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```
