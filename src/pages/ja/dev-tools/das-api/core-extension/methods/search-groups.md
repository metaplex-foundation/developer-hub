---
title: Coreグループの検索
metaTitle: Coreグループの検索 | DAS API Core 拡張機能
description: DAS経由でmpl-core GroupV1アカウントを検索し、Core型のGroupResult値を返します。
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das searchGroups
  - mpl-core-das searchGroups
  - GroupV1 search
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 概要

`das.searchGroups` はDASで [`MplCoreGroup`](/ja/smart-contracts/core/groups) インターフェースを検索し、[`GroupResult`](/ja/dev-tools/das-api/core-extension) 値を返します。

- Coreグループのみにフィルタリングします
- 該当する場合、Coreアセット検索と同じ検索フィルター（例えばauthority）を受け付けます
- アドレスで単一のグループを取得する場合は、[`getGroup`](/ja/dev-tools/das-api/core-extension/methods/get-group) を優先してください
- 更新権限別に一覧表示するには、[`getGroupsByUpdateAuthority`](#by-update-authority) を使用します

## コード例

`das.searchGroups` はUmiインスタンスとフィルターオブジェクトを受け取り、一致するCore型のグループを返します。

{% code-tabs-imported from="das-api/core-extension/search-groups" frameworks="umi" /%}

## 更新権限別 {% #by-update-authority %}

`das.getGroupsByUpdateAuthority` は、指定した更新権限のCoreグループを一覧表示し、`GroupResult` 値を返します。[`getAssetsByGroup`](/ja/dev-tools/das-api/core-extension/methods/get-assets-by-group) と組み合わせると、各グループのメンバーを一覧表示できます。

{% code-tabs-imported from="das-api/core-extension/get-groups-by-update-authority" frameworks="umi" /%}

## 注意事項

- `MplCoreGroup` のインデックスに対応したDASクライアント ≥ 2.1.0 が必要です。
- 結果のメンバーシップのベクトルは空の場合があります。オンチェーンの完全なメンバーシップには [`fetchGroupV1`](/ja/smart-contracts/core/groups) を使用してください。
