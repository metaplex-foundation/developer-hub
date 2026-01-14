---
title: 帮助函数
metaTitle: 帮助函数 | Core
description: 了解 Core 帮助函数，如验证帮助函数、获取帮助函数、插件帮助函数等。
---


{% callout type="note" title="JS 帮助函数" %}

以下帮助函数适用于 JS 客户端。

{% /callout %}

## 获取帮助函数

新的获取帮助函数允许您选择是否从每个帮助方法中派生插件。

### fetchAsset()

获取单个 Asset。

```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByOwner()

获取给定所有者地址的所有 Assets。

```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByCollection()

获取给定 Collection 地址的所有 Assets。

```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByUpdateAuthority()

获取给定更新权限地址的所有 Assets。

```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```

## 权限帮助函数

权限帮助函数允许您传入一个 `publicKey` 来检查该地址是否对 Core 生态系统的某些方面（Assets、Collections 和 Plugins）具有权限。

### hasPluginAddressAuthority()

`hasPluginAddressAuthority()` 返回一个 `boolean` 值，基于传入的插件权限是否设置为 `Address` 类型且 `pubkey` 匹配。

```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```

### hasPluginOwnerAuthority()

`hasPluginOwnerAuthority()` 返回一个 `boolean` 值，基于传入的插件权限是否设置为 `Owner` 类型且 `pubkey` 匹配。

```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```

### hasPluginUpdateAuthority()

`hasPluginUpdateAuthority()` 返回一个 `boolean` 值，基于传入的插件权限是否设置为 `UpdateAuthority` 类型且 `pubkey` 匹配。

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

## 生命周期帮助函数

**生命周期帮助函数**提供了一种快速高效的方式来检查地址是否可以执行某个生命周期事件。

### validateTransfer()

返回一个 `boolean` 值，表示该 publicKey 是否有资格转移 Asset。

```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```

### validateBurn

返回一个 `boolean` 值，表示该 publicKey 是否可以销毁 Asset。

```ts
export async function validateBurn(umi, { authority, asset, collection })
```

### canUpdate()

返回一个 `boolean` 值，表示该 publicKey 是否有资格更新 Asset。

```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
)
```

### 插件帮助函数

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

## 状态帮助函数

### collectionAddress()

如果给定的 asset 是集合的一部分，则查找其集合地址。
返回 `publicKey | undefined`

```ts
export function collectionAddress(asset: AssetV1)
```

### deriveAssetPlugins()

从 asset 和 collection 派生 asset 插件。asset 上的插件优先于 collection 上的插件。

```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```

### isFrozen()

返回一个 `boolean` 值，表示 Asset 是否被冻结。

```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```
