---
title: AgentCard の取得
metaTitle: Metaplex API - A2A AgentCard の取得 | REST API | Metaplex
description: 登録済みエージェントのホストされた A2A AgentCard を取得します。ETag キャッシュ付きの標準準拠 AgentCard JSON です。
method: GET
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - A2A
  - AgentCard
  - agent discovery
about:
  - API endpoint
  - A2A protocol
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

登録済みエージェントのホストされた A2A AgentCard を取得します。A2A クライアントが直接利用できるよう、生の AgentCard JSON（A2A 仕様 §4.4）を返します。 {% .lead %}

## Summary

Metaplex は、アプリを通じて登録されたエージェント向けに A2A AgentCard をホストしています。EIP-8004 のコンシューマーは、エージェントの `services[]` エントリからこのエンドポイントを発見します。

- 保存されたままの AgentCard を返します — レスポンスエンベロープなし
- `ETag` / `If-None-Match` による条件付きリクエストをサポート（`304 Not Modified`）
- エージェントにホストされたカードがない場合は `404` を返します

## Quick Reference

| 項目 | 値 |
|------|-------|
| **メソッド** | `GET` |
| **パス** | `/agents/{address}/agent-card.json` |
| **認証** | 不要 |
| **レスポンス** | A2A AgentCard JSON |
| **キャッシュ** | `max-age=60, stale-while-revalidate=600`、ETag |

## エンドポイント

```
GET /agents/{address}/agent-card.json
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
curl "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/agent-card.json"
```

## レスポンス

[A2A AgentCard](https://a2a-protocol.org/latest/specification/#44-agentcard) オブジェクト：

```json
{
  "name": "Example Agent",
  "description": "An autonomous trading agent.",
  "url": "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json",
  "version": "1.0.0",
  "capabilities": { "streaming": false },
  "skills": [
    {
      "id": "trade",
      "name": "Trade tokens",
      "description": "Executes token swaps on Solana.",
      "tags": ["solana", "trading"]
    }
  ],
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["text/plain"]
}
```

## 条件付きリクエスト

レスポンスには `ETag` ヘッダーが含まれます。これを `If-None-Match` として送り返すと、カードに変更がない場合は `304 Not Modified` が返されます：

```bash
curl -H 'If-None-Match: "m3k9x1"' \
  "https://api.metaplex.com/v1/agents/7nE9.../agent-card.json"
```

## エラー

| ステータス | 意味 |
|--------|---------|
| `304` | 指定した ETag 以降、カードに変更なし。 |
| `404` | エージェントが見つからない、またはエージェントにホストされた AgentCard がない。 |

## Notes

- このエンドポイントは意図的に `success` エンベロープを**持ちません** — A2A のディスカバリー規約に従い、ボディは AgentCard そのものです。
- カードは、ミント時にエージェント作成者が作成したもの、またはエージェントの登録メタデータから合成されたもののいずれかです。
