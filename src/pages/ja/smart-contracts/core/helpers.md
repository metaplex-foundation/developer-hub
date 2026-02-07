---
title: ヘルパー
metaTitle: ヘルパー | Core
description: バリデーションヘルパー、フェッチヘルパー、プラグインヘルパーなど、Coreヘルパー関数について学びましょう。
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
{% callout type="note" title="JSヘルパー関数" %}
以下のヘルパー関数はJSクライアント用です。
{% /callout %}
## フェッチヘルパー
新しいフェッチヘルパーでは、各ヘルパーメソッドからプラグインを継承するかどうかのオプションを選択できます。
### fetchAsset()
単一のAssetを取得します。
```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```
### fetchAssetsByOwner()
指定された所有者アドレスのすべてのAssetを取得します。
```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```
### fetchAssetsByCollection()
指定されたCollectionアドレスのすべてのAssetを取得します。
```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```
### fetchAssetsByUpdateAuthority()
指定されたCollectionアドレスのすべてのAssetを取得します。
```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```
## Authorityヘルパー
Authorityヘルパーでは、`publicKey`を渡して、そのアドレスがCoreエコシステムの特定の側面（Asset、Collection、プラグイン）に対する権限を持っているかどうかを確認できます。
### hasPluginAddressAuthority()
`hasPluginAddressAuthority()`は、渡されたプラグインの権限が`Address`タイプに設定されており、`pubkey`が一致するかどうかに基づいて`boolean`値を返します。
```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```
### hasPluginOwnerAuthority()
`hasPluginOwnerAuthority()`は、渡されたプラグインの権限が`Owner`タイプに設定されており、`pubkey`が一致するかどうかに基づいて`boolean`値を返します。
```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```
### hasPluginUpdateAuthority()
`hasPluginUpdateAuthority()`は、渡されたプラグインの権限が`UpdateAuthority`タイプに設定されており、`pubkey`が一致するかどうかに基づいて`boolean`値を返します。
```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```
### hasAssetUpdateAuthority()
`hasAssetUpdateAuthority()`は、渡された`pubkey`がAssetに対するUpdate Authorityを持っているかどうかに基づいて`boolean`値を返します。
```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```
### hasCollectionUpdateAuthority()
`hasCollectionUpdateAuthority()`は、渡された`pubkey`がCollectionに対するUpdate Authorityを持っているかどうかに基づいて`boolean`値を返します。
```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```
## ライフサイクルヘルパー
**ライフサイクルヘルパー**は、アドレスが特定のライフサイクルイベントを実行できるかどうかを素早く効率的に確認する方法を提供します。
### validateTransfer()
publicKeyがAssetを転送する資格があるかどうかについて`boolean`値を返します。
```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```
### validateBurn
publicKeyがAssetをバーンできるかどうかについて`boolean`値を返します。
```ts
export async function validateBurn(umi, { authority, asset, collection })
```
### canUpdate()
publicKeyがAssetを更新する資格があるかどうかについて`boolean`値を返します。
```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
)
```
### プラグインヘルパー
### assetPluginKeyFromType()
プラグインタイプをAssetプラグイン用のキーに変換します。
```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```
### pluginTypeFromAssetPluginKey()
プラグインキーをタイプに変換します。
```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```
### checkPluginAuthorities()
Asset上の指定されたプラグインタイプの権限を確認します。
```ts
export function checkPluginAuthorities({
  authority,
  pluginTypes,
  asset,
  collection,
})
```
## ステートヘルパー
### collectionAddress()
AssetがCollectionの一部である場合、そのCollectionアドレスを検索します。
`publicKey | undefined`を返します。
```ts
export function collectionAddress(asset: AssetV1)
```
### deriveAssetPlugins()
AssetとCollectionからAssetプラグインを継承します。Asset上のプラグインはCollection上のプラグインより優先されます。
```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```
### isFrozen()
Assetがフリーズされているかどうかについて`boolean`を返します。
```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```
