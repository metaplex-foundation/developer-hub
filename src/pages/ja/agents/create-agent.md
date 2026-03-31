---
title: エージェントの作成
metaTitle: Solanaでエージェントを作成 | Metaplex Agent Registry
description: Solanaでエージェントを作成・登録します。Metaplex Agent APIによるシングルコールフロー、または既存のMPL Coreアセットを手動で登録する方法を解説します。
keywords:
  - create agent
  - mint agent
  - register agent
  - Agent API
  - agent identity
  - MPL Core
  - AgentIdentity plugin
  - ERC-8004
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Creation
  - Agent Registration
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-30-2026'
updated: '03-30-2026'
---

Solanaでエージェントを作成・登録します。Metaplex Agent APIによるシングルコールフロー、または既存の[MPL Core](/smart-contracts/core)アセットを`registerIdentityV1`で手動登録する方法があります。{% .lead %}

## 概要

エージェントの作成とは、MPL Coreアセットをミントし、オンチェーンのアイデンティティレコードを紐付けることを意味します。Metaplex Agent APIは両方を1つのトランザクションで実行します。すでにCoreアセットを持っている場合は、オンチェーン命令で直接アイデンティティを登録できます。

- **APIパス（推奨）** — `mintAndSubmitAgent`がアセットの作成とアイデンティティの登録を1回のコールで実行
- **手動パス** — `registerIdentityV1`が既存のCoreアセットにアイデンティティを紐付け
- **アイデンティティレコード** — アセットの公開鍵から派生したPDAで、`AgentIdentity`プラグインとライフサイクルフックを持つ
- **登録ドキュメント** — [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004)に準拠したオフチェーンJSONで、エージェントのサービスとメタデータを記述
- `@metaplex-foundation/mpl-agent-registry` SDKが**必要**

## クイックスタート

1. [SDKのインストール](#sdkのインストール) — Agent Registryパッケージを追加
2. [APIでミント](#apiでエージェントをミント) — 登録済みエージェントへの最速パス（推奨）
3. [既存アセットの登録](#既存アセットの登録) — すでにMPL Coreアセットを持っているユーザー向け
4. [エージェント登録ドキュメント](#エージェント登録ドキュメント) — オフチェーンメタデータの構造
5. [登録の確認](#登録の確認) — アイデンティティが付与されたことを確認

## SDKのインストール

```shell
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi-bundle-defaults
```

## APIでエージェントをミント

Metaplex Agent APIはMPL Coreアセットを作成し、そのアイデンティティを1つのトランザクションで登録します。新しいエージェントにはこのパスを推奨します。

### ミントと送信を1回のコールで

`mintAndSubmitAgent`関数はAPIを呼び出し、返されたトランザクションに署名し、ネットワークに送信します：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mintAndSubmitAgent } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com');

const result = await mintAndSubmitAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous agent that executes DeFi strategies on Solana.',
    services: [
      { name: 'web', endpoint: 'https://myagent.ai' },
      { name: 'A2A', endpoint: 'https://myagent.ai/agent-card.json' },
    ],
    registrations: [],
    supportedTrust: ['reputation'],
  },
});

console.log('Agent minted! Asset:', result.assetAddress);
console.log('Signature:', result.signature);
```

#### mintAndSubmitAgentパラメータ

| パラメータ | 必須 | 説明 |
|-----------|----------|-------------|
| `wallet` | Yes | エージェントオーナーのウォレット公開鍵（トランザクションに署名） |
| `name` | Yes | Coreアセットの表示名 |
| `uri` | Yes | CoreアセットのメタデータURI |
| `agentMetadata` | Yes | オンチェーンのエージェントメタデータ（[エージェント登録ドキュメント](#エージェント登録ドキュメント)を参照） |
| `network` | No | ターゲットネットワーク（デフォルトは`solana-mainnet`） |

#### mintAndSubmitAgent戻り値

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `signature` | `Uint8Array` | トランザクション署名 |
| `assetAddress` | `string` | ミントされたエージェントのCoreアセットアドレス |

### 署名ステップを分離してミント

`mintAgent`関数はカスタム署名フロー用の未署名トランザクションを返します。追加の署名者やハードウェアウォレットが必要な場合に便利です：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mintAgent, signAndSendAgentTransaction } from '@metaplex-foundation/mpl-agent-registry';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// Step 1: Get the unsigned transaction from the API
const mintResult = await mintAgent(umi, {}, {
  wallet: umi.identity.publicKey,
  name: 'My AI Agent',
  uri: 'https://example.com/agent-metadata.json',
  agentMetadata: {
    type: 'agent',
    name: 'My AI Agent',
    description: 'An autonomous agent.',
    services: [],
    registrations: [],
    supportedTrust: [],
  },
});

console.log('Asset address:', mintResult.assetAddress);

// Step 2: Sign and send
const signature = await signAndSendAgentTransaction(umi, mintResult);
```

#### mintAgent戻り値

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `transaction` | `Transaction` | 署名可能なデシリアライズ済みUmiトランザクション |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | トランザクション有効性のためのblockhash |
| `assetAddress` | `string` | Coreアセットアドレス |

### API設定

`AgentApiConfig`オブジェクトを第2引数に渡して、APIエンドポイントやfetch実装をカスタマイズできます：

| オプション | デフォルト | 説明 |
|--------|---------|-------------|
| `baseUrl` | `https://api.metaplex.com` | Metaplex APIのベースURL |
| `fetch` | `globalThis.fetch` | カスタムfetch実装（Node.jsやテストに便利） |

```typescript
const result = await mintAndSubmitAgent(
  umi,
  { baseUrl: 'https://api.metaplex.com' },
  input
);
```

### サポートされるネットワーク

`network`パラメータはエージェントがミントされるSVMネットワークを制御します：

| Network ID | 説明 |
|------------|-------------|
| `solana-mainnet` | Solana Mainnet（デフォルト） |
| `solana-devnet` | Solana Devnet |
| `localnet` | ローカルバリデータ |
| `eclipse-mainnet` | Eclipse Mainnet |
| `sonic-mainnet` | Sonic Mainnet |
| `sonic-devnet` | Sonic Devnet |
| `fogo-mainnet` | Fogo Mainnet |
| `fogo-testnet` | Fogo Testnet |

### APIエラーハンドリング

APIクライアントは型付きエラーをスローし、キャッチして検査できます：

| エラータイプ | 説明 |
|------------|-------------|
| `AgentApiError` | HTTPレスポンスエラー — `statusCode`と`responseBody`を含む |
| `AgentApiNetworkError` | ネットワーク接続の問題 — 根本原因の`cause`を含む |
| `AgentValidationError` | クライアント側のバリデーションエラー — 失敗した`field`を含む |

```typescript
import {
  isAgentApiError,
  isAgentApiNetworkError,
} from '@metaplex-foundation/mpl-agent-registry';

try {
  const result = await mintAndSubmitAgent(umi, {}, input);
} catch (err) {
  if (isAgentApiError(err)) {
    console.error('API error:', err.statusCode, err.responseBody);
  } else if (isAgentApiNetworkError(err)) {
    console.error('Network error:', err.cause.message);
  }
}
```

## 既存アセットの登録

すでにMPL Coreアセットを持っている場合は、`registerIdentityV1`命令を使用してAPIなしで直接アイデンティティレコードを紐付けます。

{% callout type="note" %}
アセットをまだ持っていない場合は、代わりに[上記のAPIパス](#apiでエージェントをミント)を使用してください。1つのトランザクションでアセットの作成とアイデンティティの登録を行います。
{% /callout %}

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

### registerIdentityV1パラメータ

| パラメータ | 説明 |
|-----------|-------------|
| `asset` | 登録するMPL Coreアセット |
| `collection` | アセットのコレクション（オプション） |
| `agentRegistrationUri` | オフチェーンのエージェント登録メタデータを指すURI |
| `payer` | レントと手数料を支払う（デフォルトは`umi.payer`） |
| `authority` | コレクションオーソリティ（デフォルトは`payer`） |

### 完全な手動例

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

## エージェント登録ドキュメント

`agentRegistrationUri`（手動パス）または`agentMetadata`（APIパス）は、エージェントのアイデンティティ、サービス、メタデータを記述します。フォーマットはSolana向けに適応された[ERC-8004](https://eips.ethereum.org/EIPS/eip-8004)に準拠しています。JSONと関連画像はArweaveなどの永続ストレージプロバイダーにアップロードし、公開アクセス可能にしてください。

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
| `type` | Yes | スキーマ識別子。`https://eips.ethereum.org/EIPS/eip-8004#registration-v1`を使用。 |
| `name` | Yes | 人間が読めるエージェント名 |
| `description` | Yes | エージェントの自然言語による説明 — 何をするか、どう動くか、どう対話するか |
| `image` | Yes | アバターまたはロゴのURI |
| `services` | No | エージェントが公開するサービスエンドポイントの配列（下記参照） |
| `active` | No | エージェントが現在アクティブかどうか（`true`/`false`） |
| `registrations` | No | このエージェントのアイデンティティにリンクするオンチェーン登録の配列 |
| `supportedTrust` | No | エージェントがサポートする信頼モデル（例：`reputation`、`crypto-economic`、`tee-attestation`） |

### サービス

各サービスエントリはエージェントとのやり取り方法を記述します：

| フィールド | 必須 | 説明 |
|-------|----------|-------------|
| `name` | Yes | サービスタイプ — 例：`web`、`A2A`、`MCP`、`OASF`、`DID`、`email` |
| `endpoint` | Yes | サービスに到達できるURLまたは識別子 |
| `version` | No | プロトコルバージョン |
| `skills` | No | エージェントがこのサービスを通じて公開するスキルの配列 |
| `domains` | No | エージェントが活動するドメインの配列 |

### 登録

各登録エントリはオンチェーンのアイデンティティレコードにリンクします：

| フィールド | 必須 | 説明 |
|-------|----------|-------------|
| `agentId` | Yes | エージェントのミントアドレス |
| `agentRegistry` | Yes | 定数レジストリ識別子 — `solana:101:metaplex`を使用 |

## 登録の確認

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

## Genesisトークンのリンク

アイデンティティ登録後、オプションで`setAgentTokenV1`を使用して[Genesis](/smart-contracts/genesis)トークンをエージェントにリンクできます。これによりトークンローンチがエージェントのオンチェーンアイデンティティに関連付けられます。Genesisアカウントは`Mint`ファンディングモードを使用する必要があります。

```typescript
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry';

await setAgentTokenV1(umi, {
  asset: asset.publicKey,
  genesisAccount: genesisAccountPublicKey,
}).sendAndConfirm(umi);
```

{% callout type="note" %}
エージェントトークンはアイデンティティごとに1回のみ設定できます。この命令の`authority`はアセットの[Asset Signer](/smart-contracts/core/execute-asset-signing) PDAである必要があります。完全なアカウント詳細については[Agent Identity](/smart-contracts/mpl-agent/identity#instruction-setagenttokenv1)リファレンスを参照してください。
{% /callout %}

## 注意事項

- Metaplex APIはCoreアセットの作成とアイデンティティの登録を1つのトランザクションで行います。APIを使用する場合、`registerIdentityV1`を別途呼び出す必要はありません。
- `uri`パラメータ（APIパス）はCoreアセットのメタデータ（名前、画像など）を指し、`agentMetadata`にはエージェント固有の登録データ（サービス、信頼メカニズム）が含まれます。
- `mintAgent`が返すトランザクションにはblockhashが含まれ、blockhashの有効期限（約60〜90秒）内に署名・送信する必要があります。
- `registerIdentityV1`による登録はアセットごとに1回限りのオペレーションです。すでに登録済みのアセットに対して呼び出すと失敗します。
- `agentRegistrationUri`は永続的にホストされたJSON（例：Arweave）を指す必要があります。URIが到達不能になった場合、オンチェーンのアイデンティティは存在し続けますが、クライアントはエージェントのメタデータを取得できなくなります。
- `collection`パラメータはオプションですが推奨されます。登録時のコレクションレベルのオーソリティチェックを有効にします。
- Transfer、Update、Executeのライフサイクルフックは自動的にアタッチされます。これらのフックにより、アイデンティティプラグインがアセットに対するオペレーションの承認または拒否に参加できます。
- `setAgentTokenV1`によるGenesisトークンのリンクはオプションであり、登録後いつでも実行できます。

*[Metaplex](https://github.com/metaplex-foundation)により管理 · 最終確認 2026年3月*
