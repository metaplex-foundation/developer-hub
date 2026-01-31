---
title: Core JS SDK v1.0
metaTitle: Core JS SDK v1.0 | Core
description: Whats new in the Metaplex Core JS SDK v1.0?
updated: '01-31-2026'
---
## The V1 Milestone!
Launching the **Core JS SDK v1.0** welcomes new improvements to both naming and functionality for devs and end users working with the JS Mpl Core package.
## Major Changes
### Plugin Constructor Functions
Though while still present in the code base, the new wrappers allow for plugins to be defined without constructor functions.
**Auto Generated Kinobi Functions**
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
**JS SDK v1.0**
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
**Auto Generated Kinobi Functions**
```ts
await addPluginV1(umi, {
  asset: asset.publicKey,
  plugin: createPlugin({ type: 'FreezeDelegate', data: { frozen: true } }),
  initAuthority: addressPluginAuthority(delegate),
}).sendAndConfirm(umi)
```
**JS SDK v1.0**
```ts
await addPlugin(umi, {
  asset: assetId,
  plugin: {
    type: 'Attributes',
    attributeList: [{ key: 'key', value: 'value' }],
  },
}).sendAndConfirm(umi)
```
### Lifecycle Wrapper now Requires Asset Objects
The create/update/transfer/burn now require the full asset/collection objects in order to derive extra accounts (such as external plugin adapter accounts) if any.
**Auto Generated Kinobi Functions**
```ts
const asset = publicKey('11111111111111111111111111111111')
await updateV1(umi, {
  asset, // Takes a publicKey
  newName: 'New Asset Name',
  newUri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```
**JS SDK v1.0**
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
The **Core JS SDK v1.0** comes with new and improved helper methods that strip away some of the complexity when dealing with Core Assets/Collections and their data.
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
The `hasPluginAddressAuthority()` returns a `boolean` value based on whether the plugin passed in its authority set to an `Address` type and the `pubkey` matches.
```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```
#### hasPluginOwnerAuthority()
The `hasPluginOwnerAuthority()` returns a `boolean` value based on whether the plugin passed in its authority set to an `Owner` type and the `pubkey` matches.
```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```
#### hasPluginUpdateAuthority()
The `hasPluginUpdateAuthority()` returns a `boolean` value based on whether the plugin passed in its authority set to an `UpdateAuthority` type and the `pubkey` matches.
```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```
#### hasAssetUpdateAuthority()
The `hasAssetUpdateAuthority()` returns a `boolean` value based on whether the passed in `pubkey` holds update authority over the Asset.
```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```
#### hasCollectionUpdateAuthority()
The `hasCollectionUpdateAuthority()` returns a `boolean` value based on whether the passed in `pubkey` holds update authority over the Collection.
```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```
### Lifecycle Helpers
The **Lifecycle Helpers** provide a quick and efficient way to check whether an address can perform a certain lifecycle event.
#### validateTransfer()
Returns a `boolean` value on whether the publicKey is eligible to transfer the Asset.
```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```
#### validateBurn()
Returns a `boolean` value on whether the publicKey can burn the Asset.
```ts
export async function validateBurn(umi, { authority, asset, collection })
```
#### validateUpdate()
Returns a `boolean` value on whether the publicKey is eligible to update Asset.
```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
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
