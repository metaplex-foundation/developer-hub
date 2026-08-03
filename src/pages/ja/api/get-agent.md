---
title: Get Agent
metaTitle: Metaplex API - Get Agent | REST API | Metaplex
description: Core アセットアドレスで登録済みエージェントを1件取得します。EIP-8004 登録データ、作成したトークン、プライマリエージェントトークンを含みます。
method: GET
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - agent detail
  - EIP-8004
  - agent registry
about:
  - API endpoint
  - Agent data
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

Core アセットアドレスで登録済みエージェントを1件取得します。エージェントのアイデンティティ、EIP-8004 登録メタデータ、作成したトークン、プライマリエージェントトークンを返します。 {% .lead %}

## Summary

オンチェーンのアイデンティティとインデックス済みメタデータを組み合わせて、1つのエージェントの詳細情報をすべて取得します。

- エージェントのアイデンティティ：名前、説明、画像、オーナー、オーソリティ、署名者 PDA ウォレット
- EIP-8004 登録 JSON のフィールドがレスポンスにマージされます
- `tokens` — エージェントがローンチしたすべてのトークン（`BaseToken` オブジェクト）
- `agentTokenInfo` — ローンチまたはオンチェーンメタデータから解決されたエージェントのプライマリトークン

## Quick Reference

| 項目 | 値 |
|------|-------|
| **メソッド** | `GET` |
| **パス** | `/agents/{address}` |
| **認証** | 不要 |
| **レスポンス** | エージェント詳細オブジェクト |
| **ページネーション** | なし |

## エンドポイント

```
GET /agents/{address}
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `address` | `string` | はい | エージェントの Core アセットミントアドレス（base58）。 |

## クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `network` | `string` | いいえ | クエリするネットワーク。デフォルト：`solana-mainnet`。devnet の場合は `solana-devnet` を使用。 |

## リクエスト例

```bash
curl "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
```

## レスポンス

```json
{
  "success": true,
  "address": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
  "name": "Example Agent",
  "description": "An autonomous trading agent.",
  "image": "https://example.com/agent.png",
  "walletAddress": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
  "owner": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
  "authority": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
  "agentMetadataUri": "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json",
  "agentToken": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "a2aCard": { "…": "A2A AgentCard (spec §4.4), when hosted" },
  "verifiedAt": null,
  "tokens": [
    {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "name": "Agent Token",
      "symbol": "AGT",
      "image": "https://example.com/token.png",
      "description": "The agent's primary token."
    }
  ],
  "agentTokenInfo": {
    "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "name": "Agent Token",
    "symbol": "AGT",
    "image": "https://example.com/token.png",
    "description": "The agent's primary token."
  }
}
```

## レスポンス型

### TypeScript

```ts
interface AgentResponse {
  success: true;
  /** Core asset address (the NFT representing this agent) */
  address: string;
  name: string;
  description: string;
  image?: string;
  /** The agent's signer PDA wallet (derived from the Core asset) */
  walletAddress: string;
  /** Owner of the Core asset */
  owner: string;
  /** Update authority of the Core asset */
  authority?: string;
  agentMetadataUri?: string;
  /** Primary token mint from on-chain agent identity */
  agentToken?: string;
  /** Hosted A2A AgentCard (spec §4.4) — only when hosted by Metaplex */
  a2aCard?: Record<string, unknown> | null;
  /** When an admin verified this agent */
  verifiedAt?: string | null;
  /** Tokens the agent has launched */
  tokens: BaseToken[];
  /** The agent's primary token, when set */
  agentTokenInfo?: BaseToken;
  // …plus any additional EIP-8004 registration fields
}

interface BaseToken {
  address: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
}
```

## 使用例

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const agent: AgentResponse = await response.json();
if (agent.success) {
  console.log(agent.name, agent.walletAddress);
  console.log(`${agent.tokens.length} tokens launched`);
}
```

### Rust

```rust
let agent = reqwest::get(
    "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
)
.await?
.json::<serde_json::Value>()
.await?;

println!("{} — wallet {}", agent["name"], agent["walletAddress"]);
```

## エラー

| ステータス | ボディ | 意味 |
|--------|------|---------|
| `404` | `{ "success": false, "error": "Agent not found" }` | 指定されたネットワークのこのアドレスに登録されたエージェントが存在しない。 |
| `500` | `{ "success": false, "error": "Failed to fetch agent" }` | サーバーエラー。 |

## Notes

- レスポンスはオンチェーンのエージェントアイデンティティとエージェントの EIP-8004 登録 JSON をマージしているため、文書化されたフィールドに加えて追加のメタデータフィールドが含まれる場合があります。
- エージェントトークンがエージェント自身のローンチに含まれない場合、`agentTokenInfo` はオンチェーンのトークンメタデータにフォールバックします。
- レスポンスはキャッシュされます。直近のオンチェーンの変更が反映されるまで、短い遅延を見込んでください。
