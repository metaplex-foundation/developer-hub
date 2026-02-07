---
title: 辅助函数
metaTitle: 辅助函数 | Core
description: 了解 Core 辅助函数，如验证辅助函数、获取辅助函数、插件辅助函数等。
updated: '01-31-2026'
keywords:
  - Core helpers
  - fetch helpers
  - plugin helpers
  - validation helpers
  - mpl-core utilities
about:
  - Helper functions
  - SDK utilities
  - Validation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---
{% callout type="note" title="JS 辅助函数" %}
以下辅助函数适用于 JS 客户端。
{% /callout %}
## 获取辅助函数
新的获取辅助函数允许您选择是否从每个辅助方法派生插件。
### fetchAsset()
获取单个 Asset。
```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```
### fetchAssetsByOwner()
获取给定所有者地址的所有 Asset。
```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```
### fetchAssetsByCollection()
获取给定 Collection 地址的所有 Asset。
```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```
### fetchAssetsByUpdateAuthority()
获取给定 Collection 地址的所有 Asset。
```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```
## 权限辅助函数
权限辅助函数允许您传入一个 `publicKey` 来检查该地址是否对 Core 生态系统的某些方面（Asset、Collection 和插件）具有权限。
### hasPluginAddressAuthority()
`hasPluginAddressAuthority()` 返回一个 `boolean` 值，基于传入的插件的权限是否设置为 `Address` 类型且 `pubkey` 匹配。
```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```
### hasPluginOwnerAuthority()
`hasPluginOwnerAuthority()` 返回一个 `boolean` 值，基于传入的插件的权限是否设置为 `Owner` 类型且 `pubkey` 匹配。
```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```
### hasPluginUpdateAuthority()
`hasPluginUpdateAuthority()` 返回一个 `boolean` 值，基于传入的插件的权限是否设置为 `UpdateAuthority` 类型且 `pubkey` 匹配。
```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```
### hasAssetUpdateAuthority()
`hasAssetUpdateAuthority()` 返回一个 `boolean` 值，基于传入的 `pubkey` 是否对 Asset 持有更新权限。
```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```
### hasCollectionUpdateAuthority()
`hasCollectionUpdateAuthority()` 返回一个 `boolean` 值，基于传入的 `pubkey` 是否对 Collection 持有更新权限。
```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```
## 生命周期辅助函数
**生命周期辅助函数**提供了一种快速有效的方式来检查某个地址是否可以执行某个生命周期事件。
### validateTransfer()
返回一个 `boolean` 值，表示 publicKey 是否有资格转移 Asset。
```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```
### validateBurn
返回一个 `boolean` 值，表示 publicKey 是否可以销毁 Asset。
```ts
export async function validateBurn(umi, { authority, asset, collection })
```
### canUpdate()
返回一个 `boolean` 值，表示 publicKey 是否有资格更新 Asset。
```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
)
```
### 插件辅助函数
### assetPluginKeyFromType()
将插件类型转换为 asset 插件的键。
```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```
### pluginTypeFromAssetPluginKey()
将插件键转换为类型。
```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```
### checkPluginAuthorities()
检查 asset 上给定插件类型的权限。
```ts
export function checkPluginAuthorities({
  authority,
  pluginTypes,
  asset,
  collection,
})
```
## 状态辅助函数
### collectionAddress()
如果 asset 属于某个 collection，则查找该 asset 的 collection 地址。
返回 `publicKey | undefined`
```ts
export function collectionAddress(asset: AssetV1)
```
### deriveAssetPlugins()
从 asset 和 collection 派生 asset 插件。Asset 上的插件优先于 collection 上的插件。
```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```
### isFrozen()
返回一个 `boolean` 值，表示 Asset 是否被冻结。
```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```
