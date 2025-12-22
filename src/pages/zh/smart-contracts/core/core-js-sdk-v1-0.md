---
title: Core JS SDK v1.0
metaTitle: Core JS SDK v1.0 | Core
description: Metaplex Core JS SDK v1.0 有什么新功能？
---

## V1 里程碑！

**Core JS SDK v1.0** 的发布为使用 JS Mpl Core 包的开发者和最终用户带来了命名和功能方面的改进。

## 主要变更

### 插件构造函数

虽然代码库中仍然存在，但新的包装器允许在不使用构造函数的情况下定义插件。

**自动生成的 Kinobi 函数**

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

### 插件数据

插件数据被提升到顶层，而不是嵌套在插件对象的 data 字段下。

**自动生成的 Kinobi 函数**

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

### 生命周期包装器现在需要 Asset 对象

create/update/transfer/burn 现在需要完整的 asset/collection 对象，以便派生额外的账户（如外部插件适配器账户）（如果有的话）。

**自动生成的 Kinobi 函数**

```ts
const asset = publicKey('11111111111111111111111111111111')

await updateV1(umi, {
  asset, // 接受一个 publicKey
  newName: 'New Asset Name',
  newUri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

**JS SDK v1.0**

```ts
const asset = await fetchAssetV1(umi, asset)

await update(umi, {
  asset, // 接受整个 Asset 对象
  name: 'New Asset Name',
  uri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

add/removePlugin 和 add/removeCollectionPlugin 会根据是否为外部插件自动判断并路由到正确的指令。

### Oracle 外部插件

Oracle 外部插件支持现已上线。

## 新的改进帮助函数

**Core JS SDK v1.0** 附带了新的和改进的帮助方法，简化了处理 Core Assets/Collections 及其数据时的一些复杂性。

### 获取帮助函数

新的获取帮助函数允许您选择是否从每个帮助方法中派生插件。

#### fetchAsset()

获取单个 Asset。

```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByOwner()

获取给定所有者地址的所有 Assets。

```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByCollection()

获取给定 Collection 地址的所有 Assets。

```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByUpdateAuthority()

获取给定更新权限地址的所有 Assets。

```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```

### 权限帮助函数

权限帮助函数允许您传入一个 `publicKey` 来检查该地址是否对 Core 生态系统的某些方面（Assets、Collections 和 Plugins）具有权限。

#### hasPluginAddressAuthority()

`hasPluginAddressAuthority()` 返回一个 `boolean` 值，基于传入的插件权限是否设置为 `Address` 类型且 `pubkey` 匹配。

```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```

#### hasPluginOwnerAuthority()

`hasPluginOwnerAuthority()` 返回一个 `boolean` 值，基于传入的插件权限是否设置为 `Owner` 类型且 `pubkey` 匹配。

```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```

#### hasPluginUpdateAuthority()

`hasPluginUpdateAuthority()` 返回一个 `boolean` 值，基于传入的插件权限是否设置为 `UpdateAuthority` 类型且 `pubkey` 匹配。

```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```

#### hasAssetUpdateAuthority()

`hasAssetUpdateAuthority()` 返回一个 `boolean` 值，基于传入的 `pubkey` 是否对 Asset 持有更新权限。

```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```

#### hasCollectionUpdateAuthority()

`hasCollectionUpdateAuthority()` 返回一个 `boolean` 值，基于传入的 `pubkey` 是否对 Collection 持有更新权限。

```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```

### 生命周期帮助函数

**生命周期帮助函数**提供了一种快速高效的方式来检查地址是否可以执行某个生命周期事件。

#### validateTransfer()

返回一个 `boolean` 值，表示该 publicKey 是否有资格转移 Asset。

```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```

#### validateBurn()

返回一个 `boolean` 值，表示该 publicKey 是否可以销毁 Asset。

```ts
export async function validateBurn(umi, { authority, asset, collection })
```

#### validateUpdate()

返回一个 `boolean` 值，表示该 publicKey 是否有资格更新 Asset。

```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
)
```

### 插件帮助函数

#### assetPluginKeyFromType()

将插件类型转换为 asset 插件的键。

```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```

#### pluginTypeFromAssetPluginKey()

将插件键转换为类型。

```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```

#### checkPluginAuthorities()

检查 asset 上给定插件类型的权限。

```ts
export function checkPluginAuthorities({
  authority,
  pluginTypes,
  asset,
  collection,
})
```

### 状态帮助函数

#### collectionAddress()

如果给定的 asset 是集合的一部分，则查找其集合地址。
返回 `publicKey | undefined`

```ts
export function collectionAddress(asset: AssetV1)
```

#### deriveAssetPlugins()

从 asset 和 collection 派生 asset 插件。asset 上的插件优先于 collection 上的插件。

```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```

#### isFrozen()

返回一个 `boolean` 值，表示 Asset 是否被冻结。

```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```
