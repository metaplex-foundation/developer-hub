---
title: 表示オプション
metaTitle: 表示オプション | DAS API
description: DAS APIメソッドで利用可能な表示オプションについて学習します
---

DAS APIは、レスポンスに含まれる追加情報を制御できる表示オプションを提供します。これらのオプションは、複数のAPIメソッドで`options`オブジェクトパラメータとして利用できます。

## 利用可能な表示オプション

| オプション | 型 | 説明 | デフォルト |
|--------|------|-------------|---------|
| `showCollectionMetadata` | boolean | `true`の場合、レスポンスにコレクションメタデータを含めます。これによりアセットが属するコレクションに関する情報が提供されます。 | `false` |
| `showFungible` | boolean | `true`の場合、レスポンスにファンジブルトークン情報を含めます。ファンジブルトークンを表すアセットや、`getAssetsByOwner`を使用して実際にすべてのアセットを表示したい場合に有用です。 | `false` |
| `showInscription` | boolean | `true`の場合、レスポンスにインスクリプションデータを含めます。これにより含まれるアセットに関連するインスクリプション情報が提供されます。 | `false` |
| `showUnverifiedCollections` | boolean | `true`の場合、レスポンスに未検証のコレクションを含めます。デフォルトでは、検証済みのコレクションのみが表示されます。 | `false` |
| `showZeroBalance` | boolean | `true`の場合、レスポンスに残高がゼロのトークンアカウントを含めます。デフォルトでは、残高が非ゼロのアカウントのみが表示されます。 | `false` |

## 使用例

### 基本的な使用法

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// コレクションメタデータ付きでアセットを取得
const asset = await umi.rpc.getAsset({
  id: publicKey('your-asset-id'),
  displayOptions: {
    showCollectionMetadata: true
  }
})
```

### 複数のオプション

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// 複数の表示オプションを有効にしてアセットを取得
const assets = await umi.rpc.getAssetsByOwner({
  owner: publicKey('owner-address'),
  displayOptions: {
    showCollectionMetadata: true,
    showFungible: true,
    showInscription: true
  }
})
```

### すべてのオプションを有効化

```typescript
import { publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

const umi = createUmi('<ENDPOINT>').use(dasApi())

// すべての表示オプションを有効化
const assets = await umi.rpc.searchAssets({
  owner: publicKey('owner-address'),
  displayOptions: {
    showCollectionMetadata: true,
    showFungible: true,
    showInscription: true,
    showUnverifiedCollections: true,
    showZeroBalance: true
  }
})
```

## 表示オプションをサポートするメソッド

以下のDAS APIメソッドは表示オプション付きの`options`パラメータをサポートします：

- [Get Asset](/ja/dev-tools/das-api/methods/get-asset)
- [Get Assets](/ja/dev-tools/das-api/methods/get-assets)
- [Get Assets By Owner](/ja/dev-tools/das-api/methods/get-assets-by-owner)
- [Get Assets By Creator](/ja/dev-tools/das-api/methods/get-assets-by-creator)
- [Get Assets By Authority](/ja/dev-tools/das-api/methods/get-assets-by-authority)
- [Get Assets By Group](/ja/dev-tools/das-api/methods/get-assets-by-group)
- [Search Assets](/ja/dev-tools/das-api/methods/search-assets)

## パフォーマンスに関する考慮事項

表示オプションを有効にすると、レスポンスサイズと処理時間が増加する場合があります。パフォーマンスを最適化するために、特定の使用ケースに必要なオプションのみを有効にしてください。
