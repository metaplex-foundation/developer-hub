---
title: Core DAS API拡張機能
metaTitle: メソッド | Core DAS API拡張機能
description: MPL Core用のDigital Asset Standard API拡張機能
---

一般的なDAS SDKに加えて、[MPL Core](/ja/smart-contracts/core)用の拡張機能が作成されており、MPL Core SDKでさらに使用するための正しいタイプを直接返します。また、コレクションから継承されたアセット内のプラグインを自動的に派生し、[DAS-to-Core型変換](/ja/dev-tools/das-api/core-extension/convert-das-asset-to-core)のための機能を提供します。

## 取得

Core DAS API拡張機能は以下のメソッドをサポートしています：

- [`getAsset`](/ja/dev-tools/das-api/core-extension/methods/get-asset): メタデータとオーナーを含む圧縮/標準アセットの情報を返します。
- [`getCollection`](/ja/dev-tools/das-api/core-extension/methods/get-collection): 圧縮アセットのマークルツリー証明情報を返します。
- [`getAssetsByAuthority`](/ja/dev-tools/das-api/core-extension/methods/get-assets-by-authority): オーソリティアドレスを指定してアセットのリストを返します。
- [`getAssetsByCollection`](/ja/dev-tools/das-api/core-extension/methods/get-assets-by-collection): グループ（キー、値）ペアを指定してアセットのリストを返します。例えば、これはコレクション内のすべてのアセットを取得するために使用できます。
- [`getAssetsByOwner`](/ja/dev-tools/das-api/core-extension/methods/get-assets-by-owner): オーナーアドレスを指定してアセットのリストを返します。
- [`searchAssets`](/ja/dev-tools/das-api/core-extension/methods/search-assets): 検索条件を指定してアセットのリストを返します。
- [`searchCollections`](/ja/dev-tools/das-api/core-extension/methods/search-collections): 検索条件を指定してコレクションのリストを返します。

## 型変換

さらに、通常のDAS AssetタイプをCore AssetsとCore Collectionsに変換する機能も提供します：

- [`dasAssetsToCoreAssets`](/ja/dev-tools/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): DAS AssetをCore Assetタイプに変換
- [`dasAssetsToCoreCollection`](/ja/dev-tools/das-api/core-extension/convert-das-asset-to-core#convert-to-asset-example): DAS AssetをCore Collectionタイプに変換

## プラグイン派生

このライブラリは、コレクションから継承されたアセット内のプラグインを自動的に派生します。一般的なプラグイン継承と優先順位について詳しくは、[Coreプラグインページ](/ja/smart-contracts/core/plugins)をご覧ください。

派生を無効化したり手動で実装したい場合は、[プラグイン派生ページ](/ja/dev-tools/das-api/core-extension/plugin-derivation)が役立つでしょう。
