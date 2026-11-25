---
title: グループ別Coreアセットの取得
metaTitle: グループ別Coreアセットの取得 | DAS API Core 拡張機能
description: mpl-core GroupV1のメンバーを、Core型のアセット、コレクション、またはネストされたグループとして一覧表示します。
created: '07-22-2026'
updated: '11-04-2026'
keywords:
  - das getAssetsByGroup core
  - mpl-core-das getAssetsByGroup
  - core group members
  - groupKey group
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 概要

`das.getAssetsByGroup` は [mpl-core GroupV1](/ja/smart-contracts/core/groups) のメンバーを一覧表示し、Core型の結果を返します。

- `groupKey: "group"` を指定して基本のDASを呼び出します
- メンバーはアセット、コレクション、またはネストされたグループのいずれかです
- `skipDerivePlugins: true` を指定しない限り、アセットのコレクションプラグインを派生します
- 名前とサイズのみが必要な場合は、[`getGrouping`](/ja/dev-tools/das-api/core-extension/methods/get-grouping) を使用します

## コード例

`das.getAssetsByGroup` はUmiインスタンスと `GroupV1` アドレスを受け取り、グループのメンバーをCore型の結果として返します。

`<ENDPOINT>` をDAS RPCに、`<PublicKey>` をGroupV1アドレスに置き換えてください。

{% code-tabs-imported from="das-api/core-extension/get-assets-by-group" frameworks="umi" /%}

## パラメータ

このヘルパーは、Umiインスタンスに続けてオプションオブジェクトを受け取ります。

| 名前                 | 必須 | 説明 |
| -------------------- | :------: | ----------- |
| `group`              |    ✅    | mpl-core GroupV1の公開鍵。 |
| `sortBy`             |          | ソート条件 `{ sortBy, sortDirection }`。 |
| `limit`              |          | 取得するアイテムの最大数。 |
| `page`               |          | 取得するページのインデックス。 |
| `before` / `after`   |          | カーソル形式のページネーションID。 |
| `cursor`             |          | サポートされている場合のプロバイダーカーソル。 |
| `displayOptions`     |          | Coreでは `showCollectionMetadata` のみサポートされています。 |
| `skipDerivePlugins`  |          | アセットのコレクションプラグインの自動派生をスキップします。 |

## 注意事項

- これはGroupV1メンバーシップ用のCoreヘルパーです。基本のDAS経由のToken Metadata / コレクションのグルーピングについては、`groupKey: "collection"` を指定した [`getAssetsByGroup`](/ja/dev-tools/das-api/methods/get-assets-by-group) を参照してください。
- `@metaplex-foundation/digital-asset-standard-api` ≥ 2.1.1 と、CoreグループをインデックスするRPCが必要です。
