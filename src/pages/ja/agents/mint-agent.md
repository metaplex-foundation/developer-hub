---
title: エージェントをミント
metaTitle: Solanaでエージェントをミント | Metaplex Agent API
description: Metaplex Agent APIを使用してエージェントをミント — MPL Coreアセットの作成とIDの登録を1回のAPI呼び出しで行います。
keywords:
  - mint agent
  - Agent API
  - mintAgent
  - mintAndSubmitAgent
  - MPL Core
  - agent registration
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Agent Minting
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-30-2026'
updated: '03-30-2026'
---

Metaplex Agent APIを使用してエージェントをミント — [MPL Core](/smart-contracts/core)アセットの作成とIDの登録を1回のAPI呼び出しで行います。{% .lead %}

## 概要

Metaplex Agent APIは、Coreアセットの作成とIDの登録を個別に行うことなく、エージェントをミントするための効率的な方法を提供します。1回のAPI呼び出しで、アセットの作成とオンチェーンIDの登録を行う未署名トランザクションが返されます。

- **1回のAPI呼び出し** — `mintAgent`は未署名トランザクションを返し、`mintAndSubmitAgent`は署名と送信を一度に行います
- 指定された名前とメタデータURIで**Coreアセットを作成**
- エージェントメタデータ（サービス、信頼メカニズム、登録）で**IDを登録**
- **マルチネットワーク** — Solana mainnet/devnet、Eclipse、Sonic、Fogoネットワークをサポート
- `@metaplex-foundation/mpl-agent-registry` SDKが**必要**

## クイックスタート

1. [SDKのインストール](#sdkのインストール) — エージェントレジストリパッケージを追加
2. [mintAndSubmitAgentでミント](#mintandsubmitagentでワンコールミント) — 登録済みエージェントへの最短パス
3. [mintAgentで個別署名](#mintagentで個別署名ステップ) — カスタム署名フローの場合
4. [エージェントメタデータ](#エージェントメタデータ) — オンチェーンメタデータペイロードの構造

## 学べること

このガイドでは、以下の方法を説明します：

- Metaplex APIを使用して1回の関数呼び出しでエージェントをミント
- サービスや信頼メカニズムを含むエージェントメタデータの設定
- APIからのエラーハンドリング
- 異なるSVMネットワークのターゲット指定

## SDKのインストール

```shell
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi-bundle-defaults
```

## mintAndSubmitAgentでワンコールミント

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

### パラメータ

| パラメータ | 必須 | 説明 |
|-----------|----------|-------------|
| `wallet` | はい | エージェントオーナーのウォレット公開鍵（トランザクションに署名） |
| `name` | はい | Coreアセットの表示名 |
| `uri` | はい | Coreアセットのメタデータ URI |
| `agentMetadata` | はい | オンチェーンエージェントメタデータ（[エージェントメタデータ](#エージェントメタデータ)参照） |
| `network` | いいえ | ターゲットネットワーク（デフォルトは`solana-mainnet`） |

### 戻り値

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `signature` | `Uint8Array` | トランザクション署名 |
| `assetAddress` | `string` | ミントされたエージェントのCoreアセットアドレス |

## mintAgentで個別署名ステップ

`mintAgent`関数はカスタム署名フロー用の未署名トランザクションを返します — 追加の署名者が必要な場合やハードウェアウォレットを使用する場合に便利です：

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

### mintAgentの戻り値

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `transaction` | `Transaction` | 署名可能なデシリアライズ済みUmiトランザクション |
| `blockhash` | `BlockhashWithExpiryBlockHeight` | トランザクション有効性のためのblockhash |
| `assetAddress` | `string` | Coreアセットアドレス |

## エージェントメタデータ

`agentMetadata`オブジェクトはエージェントの機能を記述し、オンチェーン登録の一部として保存されます：

```typescript
interface AgentMetadata {
  type: string;              // e.g., 'agent'
  name: string;              // Display name
  description: string;       // What the agent does
  services: AgentService[];  // Service endpoints
  registrations: AgentRegistration[];  // External registry links
  supportedTrust: string[];  // Trust mechanisms
}

interface AgentService {
  name: string;      // Service type: 'web', 'A2A', 'MCP', etc.
  endpoint: string;  // Service URL
}

interface AgentRegistration {
  agentId: string;       // Agent identifier
  agentRegistry: string; // Registry identifier
}
```

フィールドの完全なリファレンスについては、[エージェントを登録 — エージェント登録ドキュメント](/agents/register-agent#エージェント登録ドキュメント)をご覧ください。

## API設定

APIエンドポイントやfetch実装をカスタマイズするには、第2引数に`AgentApiConfig`オブジェクトを渡します：

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

## サポートされるネットワーク

`network`パラメータはエージェントがミントされるSVMネットワークを制御します：

| Network ID | 説明 |
|------------|-------------|
| `solana-mainnet` | Solana Mainnet（デフォルト） |
| `solana-devnet` | Solana Devnet |
| `localnet` | ローカルバリデーター |
| `eclipse-mainnet` | Eclipse Mainnet |
| `sonic-mainnet` | Sonic Mainnet |
| `sonic-devnet` | Sonic Devnet |
| `fogo-mainnet` | Fogo Mainnet |
| `fogo-testnet` | Fogo Testnet |

## エラーハンドリング

APIクライアントはキャッチして検査できる型付きエラーをスローします：

| エラー型 | 説明 |
|------------|-------------|
| `AgentApiError` | HTTPレスポンスエラー — `statusCode`と`responseBody`を含む |
| `AgentApiNetworkError` | ネットワーク接続の問題 — 根本的な`cause`を含む |
| `AgentValidationError` | クライアント側のバリデーション失敗 — 失敗した`field`を含む |

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

## 注意事項

- Metaplex APIはCoreアセットの作成とIDの登録を1つのトランザクションで行います。`registerIdentityV1`を個別に呼び出す必要はありません。
- `uri`パラメータはCoreアセットのメタデータ（名前、画像など）を指し、`agentMetadata`にはエージェント固有の登録データ（サービス、信頼メカニズム）が含まれます。
- `mintAgent`が返すトランザクションにはblockhashが含まれており、blockhashが期限切れになる前（約60～90秒）に署名して送信する必要があります。
- APIを使用しない手動登録については、[エージェントを登録](/agents/register-agent)をご覧ください。
