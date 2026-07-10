---
title: Get Asset
metaTitle: Get Asset | DAS API
description: 圧縮/標準アセットの情報を返します
tableOfContents: false
---

メタデータとオーナーを含む圧縮/標準アセットの情報を返します。

## パラメーター

| 名前            | 必須 | 説明                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | アセットのID。                       |
| `options`       |          | 表示オプションオブジェクト。詳細は[表示オプション](/ja/dev-tools/das-api/display-options)を参照してください。 |

## エージェントフィールド（`MplCoreAsset`） {#agent-fields-mplcoreasset}

`MplCoreAsset`レスポンスには、[エージェントレジストリ](/ja/smart-contracts/mpl-agent)からインデックス化されたエージェント固有のフィールドが含まれる場合があります。これらのフィールドはCore以外のインターフェースでは省略されます。コレクションやグループには`is_agent: false`が含まれる場合がありますが、個々のCoreアセットのみがエージェントになれます。

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `is_agent` | `boolean` | アセットに`AgentIdentity`外部プラグインがある場合`true` |
| `asset_signer` | `string` | Core Asset Signer PDA — すべての`MplCoreAsset`で返される。`is_agent`が`true`の場合、エージェントウォレットとして機能する |
| `agent_token` | `string` | `AgentIdentityV2` PDAからの正規トークンミント。[`setAgentTokenV1`](/ja/dev-tools/cli/agents/set-agent-token)が呼び出されるまで省略される |

例およびインデックス化の動作については、[エージェントデータの読み取り](/ja/agents/read-agent-data#read-agent-data-via-das-api)を参照してください。

## Playground

{% apiRenderer method="getAsset" /%}
