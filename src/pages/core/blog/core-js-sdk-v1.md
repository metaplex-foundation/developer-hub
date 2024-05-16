---
title: Core JS SDK V1
metaTitle: Core JS SDK V1
description: Whats new in the Core JS SDK V1?
---

## The V1 Milestone!

Launching the **Core JS SDK V1** welcomes new improvements to both naming and functionality for devs and end users working with the JS Mpl Core package.

## Major Changes

### No More Constructor Functions

When using the the helper wrapper methods you no longer need to pass in the cumbersome umi constructor functions.
e.g. createPlugin() and pluginAuthoirtyPair() are no longer required

**Before**

```ts
await createV1(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      plugin: createPluginV2({
        type: 'Attributes',
        attributeList: [{ key: 'key', value: 'value' }],
      }),
      authority: pluginAuthority('UpdateAuthority'),
    },
  ],
}).sendAndConfirm(umi)
```

**After**

```ts
await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    { type: 'Attributes', attributeList: [{ key: 'key', value: 'value' }] },
  ],
}).sendAndConfirm(umi)
```

### Plugin Data

Plugin data is elevated to the top level instead of nested under the data field in a plugin object.

**Before**

```ts
await addPluginV1(umi, {
  asset: asset.publicKey,
  plugin: createPlugin({ type: 'FreezeDelegate', data: { frozen: true } }),
  initAuthority: addressPluginAuthority(delegate),
}).sendAndConfirm(umi)
```

**After**

```ts
await addPlugin(umi, {
    asset: assetId,
    plugin: {
      type: "Attributes",
      attributeList: [{ key: "key", value: "value" }],
    },
  }).sendAndConfirm(umi);
```

### Lifecycle Wrapper now Requires Asset Objects

The create/update/transfer/burn now require the full asset/collection objects in order to derive extra accounts if any.

**Before**

```ts
const asset = publicKey('11111111111111111111111111111111')

await updateV1(umi, {
  asset, // Takes a publicKey
  newName: 'New Asset Name',
  newUri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

**After**

```ts
const asset = await fetchAssetV1(umi, asset)

await update(umi, {
  asset, // Takes the entire Asset object.
  name: 'New Asset Name',
  uri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

add/removePlugin and add/removeCollectionPlugin automatically figures out and routes to the right ix based on whether external plugin

### The Oracle External Plugin

Support for the Oracle External Plugin is live.

## New Improved Helpers

The **Core JS SDK V1** comes with new and improved helper methods that strip away some of the complexity when dealing with Core Assets/Collections and their data.

### Fetch Helpers

The new fetch helpers allows you the option to derive the plugins or not from each helper method.

#### fetchAsset()

Fetches a single Asset.

```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByOwner()

Fetches all the Assets of a given owners Address.

```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByCollection()

Fetches all the Assets of a given Collection Address.

```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByUpdateAuthority()

Fetches all the Assets of a given Collection Address.

```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```

### Authority Helpers

The Authority helpers allow you to pass in a `publicKey` to check with that the address has the authority over certain aspects of the Core ecosystem (Assets, Collections, and Plugins).

#### hasPluginAddressAuthority()

The `hasPluginAddressAuthority()` returns a `boolean` value based on wether the plugin passed in its authority set to an `Address` type and the `pubkey` matches.

```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```

#### hasPluginOwnerAuthority()

The `hasPluginOwnerAuthority()` returns a `boolean` value based on wether the plugin passed in its authority set to an `Owner` type and the `pubkey` matches.

```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```

#### hasPluginUpdateAuthority()

The `hasPluginUpdateAuthority()` returns a `boolean` value based on wether the plugin passed in its authority set to an `UpdateAuthority` type and the `pubkey` matches.

```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```

#### hasAssetUpdateAuthority()

The `hasAssetUpdateAuthority()` returns a `boolean` value based on wether the passed in `pubkey` holds update authority over the Asset.

```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```

#### hasCollectionUpdateAuthority()

The `hasCollectionUpdateAuthority()` returns a `boolean` value based on wether the passed in `pubkey` holds update authority over the Collection.

```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```

### Lifecycle Helpers

The **Lifecycle Helpers** provide a quick and efficient way to check whether an address can perform a certain lifecycle event.

#### canTransfer()

Returns a `boolean` value on whether the publicKey is eligible to transfer the Asset.

```ts
export function canTransfer(
  authority: PublicKey | string,
  asset: AssetV1,
  collection?: CollectionV1
)
```

[Link](https://github.com/metaplex-foundation/mpl-core/blob/e2b10c507b7510d4465a1b5650bc72e1be8efac2/clients/js/src/helpers/lifecycle.ts#L15)

#### canBurn

Returns a `boolean` value on whether the publicKey can burn the Asset.

```ts
export function canBurn(
  authority: PublicKey | string,
  asset: AssetV1,
  collection?: CollectionV1
)
```

#### canUpdate()

Returns a `boolean` value on whether the publicKey is eligible to update Asset.

```ts
export function canUpdate(
  authority: PublicKey | string,
  asset: AssetV1,
  collection?: CollectionV1
)
```

### Plugin Helpers

#### assetPluginKeyFromType()

Convert a plugin type to a key for the asset plugins.

```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```

#### pluginTypeFromAssetPluginKey()

Convert a plugin key to a type.

```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```

#### checkPluginAuthorities()

Check the authority for the given plugin types on an asset.

```ts
export function checkPluginAuthorities({
  authority,
  pluginTypes,
  asset,
  collection,
})
```

### State Helpers

#### collectionAddress()

Find the collection address for the given asset if it is part of a collection.
Returns either a `publicKey | undefined`

```ts
export function collectionAddress(asset: AssetV1)
```

#### deriveAssetPlugins()

Derive the asset plugins from the asset and collection. Plugins on the asset take precedence over plugins on the collection.

```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```

#### isFrozen()

Returns a `boolean` on whether the Asset is frozen.

```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```
