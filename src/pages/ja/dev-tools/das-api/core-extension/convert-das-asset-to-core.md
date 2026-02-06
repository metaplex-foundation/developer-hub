---
title: 標準DAS AssetからCore AssetまたはCollectionタイプへの変換
metaTitle: 標準DASからCoreタイプへの変換 | DAS API Core拡張機能
description: DAS AssetsをCore AssetまたはCollectionに変換します
---

Core アセットだけでなく、Token Metadataなどの他のアセットも扱う場合、`@metaplex-foundation/digital-asset-standard-api`を使用して取得する際に、他のDASアセットタイプと並んで変換ヘルパーに直接アクセスすることが有用かもしれません。

## Assetへの変換例

次の例では以下を示します：
1. 標準DAS APIパッケージでDAS Assetsを取得する方法
2. AssetsをフィルターしてCore Assetsのみにする方法
3. すべての標準AssetsをCore Assetsにキャストする方法

```js
// ... @metaplex-foundation/digital-asset-standard-apiの標準セットアップ

const dasAssets = await umi.rpc.getAssetsByOwner({ owner: publicKey('<pubkey>') });

// coreアセットのみをフィルターアウト
const dasCoreAssets = assets.items.filter((a) => a.interface === 'MplCoreAsset')

// それらをAssetV1タイプに変換（実際にはDASからcontentフィールドも入力されるAssetResultタイプ）
const coreAssets = await das.dasAssetsToCoreAssets(umi, dasCoreAssets)
```

## Collectionへの変換例

次の例では以下を示します：
1. 標準DAS APIパッケージでDAS Collectionsを取得する方法
2. AssetsをフィルターしてCore Assetsのみにする方法
3. すべての標準AssetsをCore Assetsにキャストする方法

```js
// ... @metaplex-foundation/digital-asset-standard-apiの標準セットアップ

const dasAssets = await umi.rpc.getAssetsByOwner({ owner: publicKey('<pubkey>') });

// coreアセットのみをフィルターアウト
const dasCoreAssets = assets.items.filter((a) => a.interface === 'MplCoreCollection')

// それらをAssetV1タイプに変換（実際にはDASからcontentフィールドも入力されるAssetResultタイプ）
const coreAssets = await das.dasAssetsToCoreAssets(umi, dasCoreAssets)
```
