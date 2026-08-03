---
title: List Agents
metaTitle: Metaplex API - List Agents | REST API | Metaplex
description: 登録済み AI エージェントの閲覧と検索。メタデータ、フィルタ、ソート付きのページネーションされたエージェントレコードを返します。
method: GET
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - agent registry
  - agent search
  - agent listings
about:
  - API endpoint
  - Agent listings
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---

エージェントレジストリを閲覧・検索します。インデックス済みデータベースからページネーションされたエージェントレコードを返します。デフォルトでは登録が新しい順にソートされます。 {% .lead %}

## Summary

オプションの全文検索、フィルタ、ソートを使って登録済みエージェントを一覧表示します。結果は常にページネーションされます。

- `query` で名前検索
- `activeOnly`、`hasAgentToken`、`hasServices`、`spotlight` でフィルタリング
- 登録時刻で `latest`（デフォルト）または `oldest` のソート
- デフォルトは1ページ目、1ページあたり24件（`pageSize` の最大は100）

## Quick Reference

| 項目 | 値 |
|------|-------|
| **メソッド** | `GET` |
| **パス** | `/agents` |
| **認証** | 不要 |
| **レスポンス** | ページネーションされた `AgentRecord[]` |
| **ページネーション** | `page` / `pageSize` |

## エンドポイント

```
GET /agents
```

## クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `network` | `string` | いいえ | クエリするネットワーク。デフォルト：`solana-mainnet`。devnet の場合は `solana-devnet` を使用。 |
| `page` | `number` | いいえ | ページ番号（`1` から開始）。デフォルト：`1`。 |
| `pageSize` | `number` | いいえ | 1ページあたりの件数（`1`〜`100`）。デフォルト：`24`。 |
| `query` | `string` | いいえ | エージェント名に対するフリーテキスト検索。 |
| `sort` | `string` | いいえ | 登録時刻順の `latest`（デフォルト）または `oldest`。 |
| `activeOnly` | `boolean` | いいえ | EIP-8004 メタデータでアクティブとマークされたエージェントのみ。 |
| `hasAgentToken` | `boolean` | いいえ | プライマリエージェントトークンが設定されたエージェントのみ。 |
| `hasServices` | `boolean` | いいえ | サービスエンドポイントを公開しているエージェントのみ。 |
| `spotlight` | `boolean` | いいえ | 発見ページでスポットライトされたエージェントのみ。 |

## リクエスト例

```bash
curl "https://api.metaplex.com/v1/agents?pageSize=10&sort=latest&activeOnly=true"
```

## レスポンス

```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "mintAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN",
        "network": "solana-mainnet",
        "name": "Example Agent",
        "description": "An autonomous trading agent.",
        "image": "https://example.com/agent.png",
        "walletAddress": "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        "authority": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
        "agentToken": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "agentMetadataUri": "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json",
        "metadata": { "…": "EIP-8004 registration JSON" },
        "a2aCard": { "…": "A2A AgentCard (spec §4.4)" },
        "isActive": true,
        "registrationSignature": "5J8…",
        "indexedAt": "2026-07-01T12:00:00.000Z",
        "spotlightedAt": null,
        "verifiedAt": null,
        "createdAt": "2026-07-01T11:59:58.000Z",
        "updatedAt": "2026-07-15T09:30:00.000Z"
      }
    ],
    "total": 132,
    "page": 1,
    "pageSize": 10,
    "totalPages": 14
  }
}
```

## レスポンス型

### TypeScript

```ts
interface PaginatedAgentsResponse {
  success: true;
  data: {
    agents: AgentRecord[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

interface AgentRecord {
  /** Core asset mint address (the NFT representing this agent) */
  mintAddress: string;
  network: string;
  name: string;
  description: string;
  image: string | null;
  /** The agent's signer PDA wallet, derived from the Core asset */
  walletAddress: string;
  /** Update authority of the Core asset */
  authority: string | null;
  /** Primary token mint, set via the setAgentToken instruction */
  agentToken: string | null;
  agentMetadataUri: string | null;
  /** EIP-8004 agent registration JSON */
  metadata: Record<string, unknown> | null;
  /** Hosted A2A AgentCard (spec §4.4) */
  a2aCard: Record<string, unknown> | null;
  isActive: boolean;
  registrationSignature: string | null;
  indexedAt: string | null;
  spotlightedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## 使用例

### TypeScript

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/agents?pageSize=10&activeOnly=true"
);
const result: PaginatedAgentsResponse = await response.json();
if (result.success) {
  const { agents, total, totalPages } = result.data;
  console.log(`${agents.length} of ${total} agents (${totalPages} pages)`);
}
```

### Rust

```rust
let response = reqwest::get(
    "https://api.metaplex.com/v1/agents?pageSize=10&activeOnly=true"
)
.await?
.json::<serde_json::Value>()
.await?;

let agents = &response["data"]["agents"];
println!("{} agents on this page", agents.as_array().unwrap().len());
```

## Notes

- 結果はライブのオンチェーンスキャンではなく、インデックス済みデータベースから取得されます。新しくミントされたエージェントは、登録トランザクションがインデックスされた後に表示されます。
- ブール型フィルタは `true`/`false` の文字列値を受け付けます。
- レスポンスは `success` エンベロープを使用します。詳細は [Agent API 概要](/api)をご参照ください。
