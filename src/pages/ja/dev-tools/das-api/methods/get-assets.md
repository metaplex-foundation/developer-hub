---
title: アセットの取得
metaTitle: アセットの取得 | DAS API
description: 複数の圧縮/標準アセットの情報を返します
tableOfContents: false
---

メタデータと所有者を含む、複数の圧縮/標準アセットの情報を返します。

## パラメータ

| 名前  | 必須 | 説明            |
| ----- | :------: | ---------------------- |
| `ids` |    ✅    | アセットIDの配列。 |
| `options` |          | 表示オプションオブジェクト。詳細は[表示オプション](/ja/dev-tools/das-api/display-options)を参照してください。 |

## エージェントフィールド（`MplCoreAsset`）

レスポンス配列の各アイテムは、[`getAsset`](/ja/dev-tools/das-api/methods/get-asset#agent-fields-mplcoreasset)と同じアセット形状を使用します。`MplCoreAsset`行には`is_agent`、`asset_signer`、`agent_token`が含まれる場合があります。

フィールド定義および使用例については、[エージェントデータの読み取り](/ja/agents/read-agent-data#read-agent-data-via-das-api)を参照してください。

## プレイグラウンド

{% apiRenderer method="getAssets" /%}
