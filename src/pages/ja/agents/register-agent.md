---
title: エージェントを登録
metaTitle: Solanaでエージェントを登録 | Metaplex 014 Agent Registry
description: MPL CoreアセットにIDレコードを紐付けて、Metaplex 014エージェントレジストリにエージェントIDを登録します。
keywords:
  - register agent
  - agent identity
  - MPL Core
  - AgentIdentity plugin
  - ERC-8004
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Registration
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '02-25-2026'
updated: '03-30-2026'
---

MPL CoreアセットにIDレコードを紐付けて、Metaplex 014エージェントレジストリにエージェントを登録します。{% .lead %}

## 概要

`registerIdentityV1`命令は、オンチェーンIDレコードをMPL Coreアセットに紐付け、検出可能なPDAを作成し、Transfer、Update、Executeのライフサイクルフックをアタッチします。

- アセットの公開鍵から派生したPDAを**作成**し、オンチェーンでの検出を可能にします
- `AgentIdentity`プラグインとライフサイクルフックをCoreアセットに**アタッチ**します
- エージェントメタデータのために[ERC-8004](https://eips.ethereum.org/EIPS/eip-8004)に準拠したオフチェーン登録ドキュメントに**リンク**します
- 既存のMPL Coreアセットと`@metaplex-foundation/mpl-agent-registry` SDKが**必要**です

## クイックスタート

1. [前提条件](#前提条件) — MPL Coreアセットを取得し、SDKをインストール
2. [エージェントを登録](#エージェントを登録-1) — `registerIdentityV1`を呼び出してIDを紐付け
3. [エージェント登録ドキュメント](#エージェント登録ドキュメント) — オフチェーンメタデータJSONを作成
4. [登録を確認](#登録を確認) — IDがアタッチされたことを確認
5. [完全な例](#完全な例) — エンドツーエンドのコードサンプル

## 学べること
このガイドでは、以下を含むエージェントの登録方法を説明します：

- MPL CoreアセットにリンクされたIDレコード
- エージェントをオンチェーンで検出可能にするPDA（Program Derived Address）
- Transfer、Update、Executeのライフサイクルフックを持つAgentIdentityプラグイン

## 前提条件

登録前にMPL Coreアセットが必要です。まだお持ちでない場合は、[NFTを作成](/nfts/create-nft)をご覧ください。IDプログラム自体の詳細については、[MPL Agent Registry](/smart-contracts/mpl-agent)ドキュメントをご覧ください。

## エージェントを登録

登録により、アセットの公開鍵から派生したPDAが作成され、Transfer、Update、Executeのライフサイクルフックを持つ`AgentIdentity`プラグインがアタッチされます。PDAによりエージェントが検出可能になります。誰でもアセットアドレスからPDAを派生させ、登録済みIDがあるかどうかを確認できます。

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry';
import { registerIdentityV1 } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity());

await registerIdentityV1(umi, {
  asset: assetPublicKey,
  collection: collectionPublicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);
```

## パラメータ

| パラメータ | 説明 |
|-----------|-------------|
| `asset` | 登録するMPL Coreアセット |
| `collection` | アセットのコレクション（オプション） |
| `agentRegistrationUri` | オフチェーンのエージェント登録メタデータを指すURI |
| `payer` | レントと手数料を支払う（デフォルトは`umi.payer`） |
| `authority` | コレクション権限（デフォルトは`payer`） |

## エージェント登録ドキュメント

`agentRegistrationUri`は、エージェントのID、サービス、メタデータを記述するJSONドキュメントを指します。フォーマットはSolana向けに適応された[ERC-8004](https://eips.ethereum.org/EIPS/eip-8004)に準拠しています。JSONファイル（および関連画像）をArweaveなどの永続ストレージプロバイダーにアップロードして公開アクセス可能にしてください。プログラムによるアップロードについては、この[ガイド](/smart-contracts/mpl-hybrid/guides/create-deterministic-metadata-with-turbo)をご覧ください。

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "Plexpert",
  "description": "An informational agent providing help related to Metaplex protocols and tools.",
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
    },
    {
      "name": "MCP",
      "endpoint": "https://metaplex.com/agent/<ASSET_PUBKEY>/mcp",
      "version": "2025-06-18"
    }
  ],
  "active": true,
  "registrations": [
    {
      "agentId": "<MINT_ADDRESS>",
      "agentRegistry": "solana:101:metaplex"
    }
  ],
  "supportedTrust": [
    "reputation",
    "crypto-economic"
  ]
}
```

### フィールド

| フィールド | 必須 | 説明 |
|-------|----------|-------------|
| `type` | はい | スキーマ識別子。`https://eips.ethereum.org/EIPS/eip-8004#registration-v1`を使用。 |
| `name` | はい | 人が読めるエージェント名 |
| `description` | はい | エージェントの自然言語による説明 — 何をするか、どう動くか、どう操作するか |
| `image` | はい | アバターまたはロゴのURI |
| `services` | いいえ | エージェントが公開するサービスエンドポイントの配列（以下参照） |
| `active` | いいえ | エージェントが現在アクティブかどうか（`true`/`false`） |
| `registrations` | いいえ | エージェントのIDにリンクバックするオンチェーン登録の配列 |
| `supportedTrust` | いいえ | エージェントがサポートする信頼モデル（例：`reputation`、`crypto-economic`、`tee-attestation`） |

### サービス

各サービスエントリは、エージェントとのやり取り方法を記述します：

| フィールド | 必須 | 説明 |
|-------|----------|-------------|
| `name` | はい | サービスタイプ — 例：`web`、`A2A`、`MCP`、`OASF`、`DID`、`email` |
| `endpoint` | はい | サービスに到達できるURLまたは識別子 |
| `version` | いいえ | プロトコルバージョン |
| `skills` | いいえ | このサービスを通じてエージェントが公開するスキルの配列 |
| `domains` | いいえ | エージェントが動作するドメインの配列 |

### 登録

各登録エントリは、オンチェーンIDレコードにリンクバックします：

| フィールド | 必須 | 説明 |
|-------|----------|-------------|
| `agentId` | はい | エージェントのミントアドレス |
| `agentRegistry` | はい | 固定のレジストリ識別子 — `solana:101:metaplex`を使用 |

## 登録を確認

```typescript
import { fetchAsset } from '@metaplex-foundation/mpl-core';

const assetData = await fetchAsset(umi, assetPublicKey);

// Check the AgentIdentity plugin
const agentIdentity = assetData.agentIdentities?.[0];
console.log(agentIdentity?.uri);               // your registration URI
console.log(agentIdentity?.lifecycleChecks?.transfer);  // truthy
console.log(agentIdentity?.lifecycleChecks?.update);    // truthy
console.log(agentIdentity?.lifecycleChecks?.execute);   // truthy
```

## 完全な例

```typescript
import { generateSigner } from '@metaplex-foundation/umi';
import { create, createCollection } from '@metaplex-foundation/mpl-core';
import { registerIdentityV1 } from '@metaplex-foundation/mpl-agent-registry';

// 1. Create a collection
const collection = generateSigner(umi);
await createCollection(umi, {
  collection,
  name: 'Agent Collection',
  uri: 'https://example.com/collection.json',
}).sendAndConfirm(umi);

// 2. Create an asset
const asset = generateSigner(umi);
await create(umi, {
  asset,
  name: 'My Agent',
  uri: 'https://example.com/agent.json',
  collection,
}).sendAndConfirm(umi);

// 3. Register identity
await registerIdentityV1(umi, {
  asset: asset.publicKey,
  collection: collection.publicKey,
  agentRegistrationUri: 'https://example.com/agent-registration.json',
}).sendAndConfirm(umi);
```

## Genesisトークンをリンク

IDを登録した後、オプションで`setAgentTokenV1`を使用して[Genesis](/smart-contracts/genesis)トークンをエージェントにリンクできます。これにより、トークンローンチがエージェントのオンチェーンIDに関連付けられます。Genesisアカウントは`Mint`ファンディングモードを使用する必要があります。

```typescript
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry';

await setAgentTokenV1(umi, {
  asset: asset.publicKey,
  genesisAccount: genesisAccountPublicKey,
}).sendAndConfirm(umi);
```

{% callout type="note" %}
エージェントトークンはIDごとに1回のみ設定できます。この命令の`authority`はアセットの[Asset Signer](/smart-contracts/core/execute-asset-signing) PDAである必要があります。完全なアカウント詳細については、[Agent Identity](/smart-contracts/mpl-agent/identity#instruction-setagenttokenv1)リファレンスをご覧ください。
{% /callout %}

## 注意事項

- 登録はアセットごとに1回限りの操作です。すでに登録済みのアセットに対して`registerIdentityV1`を呼び出すと失敗します。
- `agentRegistrationUri`は永続的にホストされたJSON（例：Arweave）を指す必要があります。URIにアクセスできなくなっても、オンチェーンIDは存在し続けますが、クライアントはエージェントのメタデータを取得できなくなります。
- `collection`パラメータはオプションですが推奨されます。登録時のコレクションレベルの権限チェックを有効にします。
- Transfer、Update、Executeのライフサイクルフックは自動的にアタッチされます。これらのフックにより、IDプラグインがアセットに対する操作の承認または拒否に参加できます。
- `setAgentTokenV1`によるGenesisトークンのリンクはオプションであり、登録後いつでも行えます。
