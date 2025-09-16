---
title: ヘルパー
metaTitle: ヘルパー | Core
description: 検証ヘルパー、フェッチヘルパー、プラグインヘルパーなど、Coreヘルパー関数について学びます。
---


{% callout type="note" title="JSヘルパー関数" %}

以下のヘルパー関数はJSクライアント用です。

{% /callout %}

## フェッチヘルパー

新しいフェッチヘルパーにより、各ヘルパーメソッドからプラグインを派生させるかどうかのオプションが提供されます。

### fetchAsset()

単一アセットを取得します。

```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByOwner()

指定された所有者アドレスのすべてのアセットを取得します。

```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByCollection()

指定されたコレクションアドレスのすべてのアセットを取得します。

```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByUpdateAuthority()

指定されたコレクションアドレスのすべてのアセットを取得します。

```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```

## 権限ヘルパー

権限ヘルパーを使用すると、`publicKey`を渡して、そのアドレスがCoreエコシステム（アセット、コレクション、プラグイン）の特定の側面に対する権限を持っているかを確認できます。

### hasPluginAddressAuthority()

`hasPluginAddressAuthority()`は、渡されたプラグインの権限が`Address`タイプに設定され、`pubkey`が一致するかどうかに基づいて`boolean`値を返します。

```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```

### hasPluginOwnerAuthority()

`hasPluginOwnerAuthority()`は、渡されたプラグインの権限が`Owner`タイプに設定され、`pubkey`が一致するかどうかに基づいて`boolean`値を返します。

```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```

### hasPluginUpdateAuthority()

`hasPluginUpdateAuthority()`は、渡されたプラグインの権限が`UpdateAuthority`タイプに設定され、`pubkey`が一致するかどうかに基づいて`boolean`値を返します。

```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```

### hasAssetUpdateAuthority()

`hasAssetUpdateAuthority()`は、渡された`pubkey`がアセットに対する更新権限を持っているかどうかに基づいて`boolean`値を返します。

```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```

### hasCollectionUpdateAuthority()

`hasCollectionUpdateAuthority()`は、渡された`pubkey`がコレクションに対する更新権限を持っているかどうかに基づいて`boolean`値を返します。

```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```

## ライフサイクルヘルパー

**ライフサイクルヘルパー**は、アドレスが特定のライフサイクルイベントを実行できるかどうかを迅速かつ効率的にチェックする方法を提供します。

### validateTransfer()

publicKeyがアセットを転送する資格があるかどうかについて`boolean`値を返します。

```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```

### validateBurn

publicKeyがアセットをバーンできるかどうかについて`boolean`値を返します。

```ts
export async function validateBurn(umi, { authority, asset, collection })
```

### canUpdate()

publicKeyがアセットを更新する資格があるかどうかについて`boolean`値を返します。

```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
)
```

### プラグインヘルパー

### assetPluginKeyFromType()

プラグインタイプをアセットプラグインのキーに変換します。

```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```

### pluginTypeFromAssetPluginKey()

プラグインキーをタイプに変換します。

```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```

### checkPluginAuthorities()

アセットの指定されたプラグインタイプの権限をチェックします。

```ts
export function checkPluginAuthorities({
  authority,
  pluginTypes,
  asset,
  collection,
})
```

## 状態ヘルパー

### collectionAddress()

アセットがコレクションの一部である場合、指定されたアセットのコレクションアドレスを見つけます。
`publicKey | undefined`を返します

```ts
export function collectionAddress(asset: AssetV1)
```

### deriveAssetPlugins()

アセットとコレクションからアセットプラグインを派生させます。アセットのプラグインはコレクションのプラグインよりも優先されます。

```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```

### isFrozen()

アセットが凍結されているかどうかについて`boolean`を返します。

```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```