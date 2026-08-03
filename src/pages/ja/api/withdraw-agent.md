---
title: Withdraw from Agent
metaTitle: Metaplex API - Withdraw from Agent Wallet | REST API | Metaplex
description: エージェントのウォレットからオーナーに SOL を引き出すトランザクションを構築します。オーナー限定。
method: POST
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - withdraw
  - agent wallet
  - execute
about:
  - API endpoint
  - Agent finance
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

エージェントの署名者 PDA ウォレットからエージェントのオーナーに SOL を送金するトランザクションを構築します。引き出しができるのは、エージェントの Core アセットの現在のオーナーのみです。 {% .lead %}

## Summary

- エージェントのウォレット PDA が署名できるよう、SOL 送金を `execute` インストラクションでラップします
- トランザクション構築前に、Core アセットに対してサーバー側で所有権を検証します
- オーナーが署名・送信するための未署名トランザクションを返します

## Quick Reference

| 項目 | 値 |
|------|-------|
| **メソッド** | `POST` |
| **パス** | `/agents/{address}/withdraw` |
| **認証** | 不要（所有権はオンチェーンおよび構築時に強制） |
| **レスポンス** | シリアライズ済みトランザクション |

## エンドポイント

```
POST /agents/{address}/withdraw
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `address` | `string` | はい | エージェントの Core アセットミントアドレス（base58）。 |

## リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `sender` | `string` | はい | エージェントオーナーのウォレット（base58）。SOL を受け取り、トランザクションに署名します。 |
| `amount` | `number` | はい | SOL 単位の金額。正の値である必要があります。 |
| `network` | `string` | いいえ | `solana-mainnet`（デフォルト）または `solana-devnet`。 |

## リクエスト例

```bash
curl -X POST "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/withdraw" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
    "amount": 0.25
  }'
```

## レスポンス

```json
{
  "success": true,
  "tx": "<base64-encoded transaction>",
  "blockhash": {
    "blockhash": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "lastValidBlockHeight": 123456789
  }
}
```

オーナーはトランザクションをデシリアライズし、署名して送信します — [署名と送信](/api/mint-agent#signing-and-submitting)をご参照ください。

## エラー

| ステータス | ボディ | 意味 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data" }` | ボディまたはアドレスがバリデーションに失敗。 |
| `403` | `{ "success": false, "error": "Only the agent owner can withdraw funds" }` | `sender` がエージェントの Core アセットを所有していない。 |
| `404` | `{ "success": false, "error": "Agent not found" }` | 指定されたネットワークのこのアドレスに Core アセットが存在しない。 |
| `500` | `{ "success": false, "error": "Failed to prepare withdraw transaction" }` | サーバーエラー。 |

## Notes

- 構築時の所有権チェックは利便性のためのものです。`execute` インストラクションはいずれにせよオンチェーンで所有権を強制するため、偽造されたリクエストで資金を移動させることはできません。
- 引き出し先は常に `sender`（オーナー）です — 資金を第三者にリダイレクトすることはできません。
- 資金を追加するには [Fund Agent](/api/fund-agent) をご参照ください。
