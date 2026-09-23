---
title: Get Asset
metaTitle: Get Asset | DAS API
description: 圧縮/標準アセットの情報を返します
tableOfContents: false
---

メタデータとオーナーを含む圧縮/標準アセットの情報を返します。

MPL-Coreコレクションから販売者手数料を継承するBubblegum V2 cNFTでは、コレクションから解決された表示値は `royalty.basis_points` / `creators` にあり、リーフ値は `royalty.basis_points_raw` / `creators_raw` にあります（`royalty.inherited: true`）。[継承ロイヤリティの読み取り](/ja/smart-contracts/bubblegum-v2/reading-inherited-royalties)を参照してください。

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
