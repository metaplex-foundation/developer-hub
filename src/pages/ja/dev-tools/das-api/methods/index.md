---
title: メソッド
metaTitle: メソッド | DAS API
description: Metaplex DAS APIクライアントの呼び出し可能なAPIメソッド。
---

DAS APIは以下のメソッドをサポートしています：

- [`getAsset`](/ja/das-api/methods/get-asset): メタデータとオーナーを含む圧縮/標準アセットの情報を返します。
- [`getAssets`](/ja/das-api/methods/get-assets): メタデータとオーナーを含む複数の圧縮/標準アセットの情報を返します。
- [`getAssetProof`](/ja/das-api/methods/get-asset-proof): 圧縮アセットのマークルツリー証明情報を返します。
- [`getAssetProofs`](/ja/das-api/methods/get-asset-proofs): 複数の圧縮アセットのマークルツリー証明情報を返します。
- [`getAssetSignatures`](/ja/das-api/methods/get-asset-signatures): 圧縮アセットのトランザクション署名を返します。
- [`getAssetsByAuthority`](/ja/das-api/methods/get-assets-by-authority): オーソリティアドレスを指定してアセットのリストを返します。
- [`getAssetsByCreator`](/ja/das-api/methods/get-assets-by-creator): クリエイターアドレスを指定してアセットのリストを返します。
- [`getAssetsByGroup`](/ja/das-api/methods/get-assets-by-group): グループ（キー、値）ペアを指定してアセットのリストを返します。例えば、コレクション内のすべてのアセットを取得するために使用できます。
- [`getAssetsByOwner`](/ja/das-api/methods/get-assets-by-owner): オーナーアドレスを指定してアセットのリストを返します。
- [`searchAssets`](/ja/das-api/methods/search-assets): 検索条件を指定してアセットのリストを返します。