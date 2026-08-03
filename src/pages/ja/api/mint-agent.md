---
title: Mint Agent
metaTitle: Metaplex API - Mint Agent | REST API | Metaplex
description: エージェントの Core アセットをミントし、オンチェーンアイデンティティを登録する部分署名済みトランザクションを構築します。
method: POST
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - mint agent
  - agent registration
  - EIP-8004
about:
  - API endpoint
  - Agent minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

エージェント用の MPL Core アセットをミントし、そのアイデンティティを Agent Registry に登録する処理を1ステップで行うトランザクションを構築します。API はエージェントメタデータをオフチェーンに保存し、ウォレットが支払者として共同署名するための部分署名済みトランザクションを返します。 {% .lead %}

## Summary

これは[エージェントのミント](/agents/mint-agent)ガイドの背後にあるエンドポイントです。

- Core アセットの作成と `registerIdentity` の呼び出しを単一のトランザクションで実行
- アセットのキーペアはサーバー側で生成・事前署名されるため、レスポンスには最終的な `assetAddress` が含まれます
- EIP-8004 メタデータとホストされた [A2A AgentCard](/api/get-agent-card)（自作のもの、またはメタデータから合成されたもの）を保存
- 呼び出し元のウォレットが支払者として署名し、トランザクションを送信します

## Quick Reference

| 項目 | 値 |
|------|-------|
| **メソッド** | `POST` |
| **パス** | `/agents/mint` |
| **認証** | 不要 |
| **レスポンス** | シリアライズ済みトランザクション + `assetAddress` |

## エンドポイント

```
POST /agents/mint
```

## リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `wallet` | `string` | はい | エージェントの支払いとオーナーとなるウォレット（base58）。 |
| `network` | `string` | はい | `solana-mainnet` または `solana-devnet`。 |
| `name` | `string` | はい | Core アセットのエージェント名。 |
| `uri` | `string` | はい | アセットのオフチェーン JSON メタデータの URI。 |
| `agentMetadata` | `object` | はい | EIP-8004 エージェント登録 JSON（name、description、image、services、registrations、active、…）。 |
| `collectionAddress` | `string` | いいえ | エージェントをミントする Core コレクション。 |
| `a2aCard` | `object` | いいえ | 事前に構築した A2A AgentCard。省略した場合は `agentMetadata` から合成されます。 |

## リクエスト例

```bash
curl -X POST "https://api.metaplex.com/v1/agents/mint" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
    "network": "solana-devnet",
    "name": "Example Agent",
    "uri": "https://example.com/agent-metadata.json",
    "agentMetadata": {
      "name": "Example Agent",
      "description": "An autonomous trading agent.",
      "active": true,
      "services": [],
      "registrations": []
    }
  }'
```

## レスポンス

```json
{
  "success": true,
  "tx": "<base64-encoded partially signed transaction>",
  "blockhash": {
    "blockhash": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "lastValidBlockHeight": 123456789
  },
  "assetAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
}
```

## 署名と送信

返されたトランザクションにはアセットキーペアによる署名が既に付与されています。ウォレットが支払者として共同署名し、送信します：

```ts
import { base64 } from "@metaplex-foundation/umi/serializers";

const res = await fetch("https://api.metaplex.com/v1/agents/mint", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(input),
});
const result = await res.json();
if (!result.success) throw new Error(result.error);

const tx = umi.transactions.deserialize(base64.serialize(result.tx));
const signed = await umi.identity.signTransaction(tx);
await umi.rpc.sendTransaction(signed);
```

## エラー

| ステータス | ボディ | 意味 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data", "details": [...] }` | リクエストボディがバリデーションに失敗。`details` に問題点が列挙されます。 |
| `400` | `{ "success": false, "error": "<message>" }` | 構築の失敗（例：コレクションが見つからない）。 |
| `500` | `{ "success": false, "error": "Failed to prepare mint agent" }` | サーバーエラー。 |

## Notes

- Metaplex レジストリエントリ（`solana:101:metaplex`）は `agentMetadata.registrations` の先頭に自動的に追加されます。
- EIP-8004 のコンシューマーが [AgentCard エンドポイント](/api/get-agent-card)を発見できるよう、ホストされた A2A サービスエントリが `services[]` に挿入されます。既に自分で作成済みの場合は何も行われません。
- エージェントレコードはこのエンドポイントの呼び出し時に保存されますが、署名済みトランザクションが確認されインデックスされるまで [List Agents](/api/list-agents) には表示されません。
- SDK を使ったガイド付きのウォークスルーは[エージェントのミント](/agents/mint-agent)をご参照ください。
