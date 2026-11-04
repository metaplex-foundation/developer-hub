---
title: Coreグループの取得
metaTitle: Coreグループの取得 | DAS API Core 拡張機能
description: DAS経由で単一のmpl-core GroupV1アカウントを取得し、Core型のGroupResultとして返します。
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das getGroup
  - mpl-core-das getGroup
  - GroupV1
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 概要

`das.getGroup` は公開鍵を指定して1つの [mpl-core GroupV1](/ja/smart-contracts/core/groups) を取得し、[`GroupResult`](/ja/dev-tools/das-api/core-extension) を返します。

- MPL Core SDKで使用できるように型付けされています
- メンバーシップのベクトルは、インデクサーによっては空になる場合があります
- オンチェーンの正確な `collections` / `groups` / `assets` / `parentGroups` が必要な場合は、[`fetchGroupV1`](/ja/smart-contracts/core/groups) を優先してください

## コード例

`das.getGroup` はUmiインスタンスと `GroupV1` アドレスを受け取り、Core型のグループを1つ返します。

{% code-tabs-imported from="das-api/core-extension/get-group" frameworks="umi" /%}

## 注意事項

- インターフェースは `MplCoreGroup` である必要があります。そうでない場合、ヘルパーはエラーをスローします。
- グループのメンバーを一覧表示するには、[`getAssetsByGroup`](/ja/dev-tools/das-api/core-extension/methods/get-assets-by-group) を使用します。
