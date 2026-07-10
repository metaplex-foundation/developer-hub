---
title: エージェントデータの読み取り
metaTitle: Solanaでエージェントデータを読み取る | Metaplex Agent Registry
description: エージェントの登録を確認し、オンチェーンでIDと登録ドキュメントを読み取るか、DAS API経由でインデックス済みのエージェントフィールドを読み取ります。
keywords:
  - read agent data
  - agent identity
  - AgentIdentity plugin
  - Asset Signer
  - agent wallet
  - DAS API
  - isAgent
  - agentToken
  - assetSigner
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Data
  - DAS API
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '07-08-2026'
faqs:
  - q: agentTokenはいつDASレスポンスに含まれますか？
    a: agentTokenフィールドは、エージェントのAgentIdentityV2 PDAにsetAgentTokenV1でトークンミントが設定されている場合にのみ含まれます。トークンがリンクされていない登録済みエージェントはこのフィールドを省略します。AgentIdentityV1 PDAにはトークンミントがなく、agentTokenは決して設定されません。
  - q: assetSignerはエージェントのウォレットと同じですか？
    a: はい。assetSignerはCore Asset Signer PDAであり、SDKのfindAssetSignerPdaが返すのと同じアドレスです。DASはMplCoreAsset行にasset_signerを返します。エージェントはこのPDAをオンチェーンウォレットとして使用します。
  - q: isAgentで非Coreアセットをフィルタできますか？
    a: いいえ。isAgent、agentToken、assetSignerはMplCoreAsset行にのみ適用されます。Token Metadata NFTやその他のインターフェースは、DASレスポンスからこれらのフィールドを完全に省略します。
  - q: すべてのDASプロバイダーがエージェントトークンフィールドをサポートしていますか？
    a: エージェントトークンのインデックス作成はMetaplex DASインデクサー（digital-asset-rpc-infrastructure）に含まれています。サードパーティのDASプロバイダーは、これらのフィールドがレスポンスに表示される前に、エージェントレジストリトランスフォーマーとデータベースマイグレーションを含む互換性のあるインデクサーバージョンを実行する必要があります。
---

[登録](/agents/register-agent)後にエージェントIDを読み取り、確認します — SDKでオンチェーンから直接、またはインデックス済みの[DAS API](/dev-tools/das-api)経由で行います。{% .lead %}

## サマリー

直接オンチェーンで読み取る場合はAgent Registry SDKを使用します（ID PDA、登録ドキュメント、ウォレットPDA）。インデクサーがすでにエージェントフィールドを解析済みの場合はDAS APIを使用します。

- **オンチェーン（SDK）** — 登録の確認、`AgentIdentity`プラグインの検査、ERC-8004ドキュメントの取得、Asset Signer PDAの派生
- **インデックス済み（DAS）** — [`getAsset`](/dev-tools/das-api/methods/get-asset)から`is_agent`、`asset_signer`、`agent_token`を読み取る。[`searchAssets`](/dev-tools/das-api/methods/search-assets)でエージェントを検出
- **同じウォレットアドレス** — `findAssetSignerPda`とDASの`asset_signer`は同じPDAを返す

## クイックスタート

**ジャンプ先：** [登録を確認](#check-registration) · [登録ドキュメント](#read-the-registration-document) · [エージェントのウォレット](#fetch-the-agents-wallet) · [DAS経由で読み取り](#read-agent-data-via-das-api)

1. **1件のエージェント、詳細情報** — `safeFetchAgentIdentityV1`と`fetchAsset`を使用（下記のSDKセクション）
2. **1件のエージェント、インデックス済みフィールド** — Coreアセットアドレスを指定して`getAsset`を呼び出す（下記のDASセクション）
3. **エージェントの検出** — `isAgent: true`を指定して`searchAssets`を呼び出す、または`agentToken` / `assetSigner`でフィルタ

## 登録を確認 {#check-registration}

安全取得メソッドはIDが存在しない場合にスローする代わりに`null`を返すため、アセットが登録されているかどうかのチェックに便利です：

{% code-tabs-imported from="agents/read_agent_check_registration" frameworks="umi" defaultFramework="umi" /%}

## シードから取得

PDAを手動で派生せずに、アセットの公開鍵から直接IDを取得することもできます：

{% code-tabs-imported from="agents/read_agent_fetch_from_seeds" frameworks="umi" defaultFramework="umi" /%}

## AgentIdentityプラグインの確認

登録により`AgentIdentity`プラグインがCoreアセットにアタッチされます。取得したアセットから直接読み取って、登録URIとライフサイクルフックを検査できます：

{% code-tabs-imported from="agents/read_agent_verify_plugin" frameworks="umi" defaultFramework="umi" /%}

## 登録ドキュメントの読み取り {#read-the-registration-document}

`AgentIdentity`プラグインの`uri`は、エージェントの完全なプロファイル（名前、説明、サービスエンドポイントなど）を含むオフチェーンJSONドキュメントを指します。他のURIと同様に取得します：

{% code-tabs-imported from="agents/read_agent_registration_document" frameworks="umi" defaultFramework="umi" /%}

このドキュメントは[ERC-8004](https://eips.ethereum.org/EIPS/eip-8004)エージェント登録標準に準拠しています。典型的な例は以下の通りです：

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "An informational agent providing help related to Metaplex protocols and tools.",
  "description": "An autonomous agent that executes DeFi strategies on Solana.",
  "image": "https://arweave.net/agent-avatar-tx-hash",
  "services": [
    {
      "name": "web",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>"
    },
    {
      "name": "A2A",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/agent-card.json",
      "version": "0.3.0"
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": ["reputation", "crypto-economic"]
}
```

フィールドの完全なリファレンスについては、[エージェントを登録](/agents/register-agent#agent-registration-document)をご覧ください。

## エージェントのウォレットを取得 {#fetch-the-agents-wallet}

すべてのCoreアセットには**Asset Signer**と呼ばれる内蔵ウォレットがあります。アセットの公開鍵から派生したPDAです。秘密鍵は存在しないため、盗まれることはありません。ウォレットはSOL、トークン、その他のアセットを保持できます。`findAssetSignerPda`でアドレスを派生します：

{% code-tabs-imported from="agents/read_agent_fetch_asset_signer" frameworks="umi" defaultFramework="umi" /%}

アドレスは決定論的なので、誰でもアセットの公開鍵からアドレスを派生して資金を送信したり残高を確認したりできます。このウォレットに対して署名できるのは、委任された[エグゼクティブ](/agents/run-an-agent)を通じたCoreの[Execute](/smart-contracts/core/execute-asset-signing)命令によるアセット自身のみです。

アカウントレイアウト、PDA派生の詳細、エラーコードについては、[MPL Agent Registry](/smart-contracts/mpl-agent)スマートコントラクトドキュメントをご覧ください。

## DAS API経由でエージェントデータを読み取る {#read-agent-data-via-das-api}

[DAS API](/dev-tools/das-api)はMPL Coreアセット上のエージェントフィールド（登録状態、ウォレットPDA、正規トークンミント）をインデックス化するため、Coreアカウントを自分で解析せずに読み取れます。

**前提条件：** [DAS対応RPCエンドポイント](/solana/rpcs-and-das)と、[Umi](/umi)インスタンス上の`@metaplex-foundation/digital-asset-standard-api`。

### DASエージェント応答フィールド

DASは2つのオンチェーンソースからエージェントメタデータを導出し、トップレベルの応答フィールドとして公開します。

| フィールド | 型 | 含まれる対象 | ソース |
|-------|------|------------|--------|
| `is_agent` | `boolean` | `MplCoreAsset` | アセットに`AgentIdentity`外部プラグインがある場合に`true` |
| `asset_signer` | `string` (pubkey) | `MplCoreAsset`のみ | 上記の[`findAssetSignerPda`](#fetch-the-agents-wallet)と同じPDA |
| `agent_token` | `string` (pubkey) | 設定時の`MplCoreAsset` | [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)で書き込まれる`AgentIdentityV2` PDAミント |

{% callout type="note" %}
エージェントになり得るのは**`MplCoreAsset`**行のみです（`is_agent: true`）。コレクションやグループはDASレスポンスに`is_agent: false`を含む場合がありますが、エージェント登録は個別のCoreアセットにのみ適用されます。非Coreアセット（Token Metadata NFT、圧縮NFT、代替可能トークン）は3つのフィールドすべてを省略します。
{% /callout %}

トークンがリンクされていない登録済みエージェントは`is_agent: true`と`asset_signer`を返しますが、`agent_token`は省略します：

```json {% title="getAsset response (registered, no token)" %}
{
  "interface": "MplCoreAsset",
  "id": "84jw9dw7hMRJXFvzJXrBzVQpmVWaGUtYT7R6QhNU9qt3",
  "is_agent": true,
  "asset_signer": "6ttUwc5VVmHeVKTddB6XM5vQgBMfw62DThuoiVEufVZq",
  "external_plugins": [
    {
      "type": "AgentIdentity",
      "adapter_config": { "uri": "https://example.com/agent-registration.json" }
    }
  ]
}
```

[`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)の後、DASは`agent_token`を含めます：

```json {% title="getAsset response (registered with token)" %}
{
  "interface": "MplCoreAsset",
  "id": "84jw9dw7hMRJXFvzJXrBzVQpmVWaGUtYT7R6QhNU9qt3",
  "is_agent": true,
  "agent_token": "FakeToken11111111111111111111111111111111111",
  "asset_signer": "6ttUwc5VVmHeVKTddB6XM5vQgBMfw62DThuoiVEufVZq"
}
```

JSON-RPCレスポンスはsnake_case（`is_agent`、`agent_token`、`asset_signer`）を使用します。`searchAssets`のリクエストパラメータはcamelCase（`isAgent`、`agentToken`、`assetSigner`）を使用します。snake_caseのエイリアスも受け付けます。

### DASで1件のエージェントを取得

Coreアセットアドレスが分かっている場合は[`getAsset`](/dev-tools/das-api/methods/get-asset)を使用します。

{% code-tabs-imported from="agents/read_agent_das_get" frameworks="umi,curl" defaultFramework="umi" /%}

### 登録済みエージェントを検索

`isAgent: true`を指定して[`searchAssets`](/dev-tools/das-api/methods/search-assets)を使用し、登録済みエージェントを一覧表示します。`interface: "MplCoreAsset"`と組み合わせてコレクションとグループを除外します。

{% code-tabs-imported from="agents/read_agent_das_search" frameworks="umi,curl" defaultFramework="umi" /%}

### トークンミントでエージェントを検索

エージェントが正規トークンをリンクした後、`agentToken`でフィルタしてミントアドレスからエージェントのCoreアセットを解決します。各エージェントは最大1つのトークンを持てます — バインディングは永久的です。

{% code-tabs-imported from="agents/read_agent_das_lookup_token" frameworks="curl" defaultFramework="curl" /%}

### Asset Signerでエージェントを検索

`assetSigner`フィルタは、指定されたアドレスと一致するexecute PDAを持つCoreアセットを見つけます。エージェントのウォレットは分かっているがアセットの公開鍵が分からない場合に使用します。

{% code-tabs-imported from="agents/read_agent_das_lookup_signer" frameworks="curl" defaultFramework="curl" /%}

### DASインデックスの仕組み

DASは取り込み中に2つのオンチェーンソースからエージェントフィールドを設定します。**MPL Coreアセット**アカウントの更新は`is_agent`（`AgentIdentity`プラグインが存在する場合）を設定し、`MplCoreAsset`行の`asset_signer`を派生します。**Agent Registry** PDAの更新は、`AgentIdentityV2`ミントが存在する場合、既存の`MplCoreAsset`行に`agent_token`を設定します。

| イベント | 更新されるフィールド | 備考 |
|-------|---------------|-------|
| Coreアセットの作成または更新 | `is_agent`、`asset_signer` | `MplCoreAsset`行にのみ適用。`is_agent`は`AgentIdentity`外部プラグインを反映。`asset_signer`はインデックス化されたすべてのCoreアセットに対して派生 |
| `AgentIdentityV2` PDAの更新 | `agent_token` | Agent Registryトランスフォーマーが書き込み。既存の未バーン`MplCoreAsset`行のみを更新 |
| アセットのバーン | — | 以降のAgent Registry更新は無視される |
| 古いスロットのPDAリプレイ | — | `slot_updated_agent_registry`より低いスロットの更新はスキップされる |

## 注意事項

- Asset SignerはPDAです — 秘密鍵は存在しません。任意のソースから資金を受け取れますが、発信トランザクションに署名できるのはCoreの[Execute](/smart-contracts/core/execute-asset-signing)命令を通じたアセット自身のみです。
- `safeFetchAgentIdentityV1`は未登録アセットに対してスローする代わりに`null`を返すため、try/catchなしでの存在チェックに安全です。
- `findAssetSignerPda`とDASの`asset_signer`は、すべてのネットワークで同じ決定論的なアドレスを返します。
- `agent_token`は[`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)で設定すると**永久的**です — クリアや再割り当ての命令はありません。
- DASの`asset_signer`は登録済みエージェントだけでなく、**`MplCoreAsset`**行に返されます。エージェントと通常のCore NFTを区別するには`is_agent`を使用してください。
- トークンがリンクされていない登録済みエージェントは`agent_token`を省略します — [`createAndRegisterLaunch`](/agents/create-agent-token)または手動の`setAgentTokenV1`の前は想定される動作です。
- Agent Registryの更新は新しいアセット行を作成しません。Coreアセットが先にインデックス化されている必要があります。
- プロバイダーのサポートは異なります — [DASプロバイダー](/solana/rpcs-and-das)がエージェントレジストリサポート付きのインデクサーを実行していることを確認してください。

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| Agent Registryプログラム | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| MPL Coreプログラム | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Asset Signerシード | `['mpl-core-execute', <core_asset_pubkey>]` |
| DAS `isAgent`フィルタ | `searchAssets`パラメータ `isAgent: true \| false` |
| DAS `agentToken`フィルタ | `searchAssets`パラメータ `agentToken: <mint_pubkey>` |
| DAS `assetSigner`フィルタ | `searchAssets`パラメータ `assetSigner: <pda_pubkey>` |
| DAS応答メソッド | `getAsset`、`getAssets`、`searchAssets` |

## FAQ

### `agentToken`はいつDASレスポンスに含まれますか？

`agent_token`は、エージェントの`AgentIdentityV2` PDAに[`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)でトークンミントが設定されている場合にのみ含まれます。トークンがリンクされていない登録済みエージェントはこのフィールドを省略します。`AgentIdentityV1` PDAにはトークンミントがなく、`agent_token`は決して設定されません。

### `assetSigner`はエージェントのウォレットと同じですか？

はい。DASの`asset_signer`はCore [Asset Signer](/smart-contracts/core/execute-asset-signing) PDAであり、[`findAssetSignerPda`](#fetch-the-agents-wallet)と同じアドレスです。`MplCoreAsset`行に返されます。登録済みエージェントではオンチェーンウォレットとして機能します。

### `isAgent`で非Coreアセットをフィルタできますか？

いいえ。`is_agent`、`agent_token`、`asset_signer`は**`MplCoreAsset`**にのみ適用されます。Token Metadata NFTやその他のアセットタイプはこれらのフィールドを省略します。

### すべてのDASプロバイダーがエージェントトークンフィールドをサポートしていますか？

エージェントトークンのインデックス作成は[Metaplex DASインデクサー](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)に含まれています。サードパーティのプロバイダーは、エージェントレジストリトランスフォーマーとデータベースマイグレーションを含む互換性のあるインデクサーバージョンを実行する必要があります。

## 用語集

| 用語 | 定義 |
|------|------------|
| **`AgentIdentity`プラグイン** | [登録](/agents/register-agent)時にCoreアセットに設定される外部プラグイン。オフチェーン登録URIを保持する |
| **`is_agent`** | Coreアセットに`AgentIdentity`外部プラグインがあることを示すDASのブール値 |
| **`agent_token`** | `AgentIdentityV2` PDAからインデックス化された正規トークンミントの公開鍵。[`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)で一度だけ設定される |
| **`asset_signer`** | エージェントのオンチェーンウォレットとして機能するCore execute PDA。`['mpl-core-execute', <asset>]`から派生 |
| **`AgentIdentityV2`** | リンクされたトークンミントを格納するAgent Registry PDA。Coreアセットアカウントとは独立して更新される |
| **`Agent Registry transformer`** | Agent Registry PDAの更新から`agent_token`を既存のCoreアセット行に書き込むDAS取り込みハンドラー |
