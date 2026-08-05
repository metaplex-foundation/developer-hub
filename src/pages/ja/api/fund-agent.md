---
title: エージェントへの資金供給
metaTitle: Metaplex API - エージェントウォレットへの資金供給 | REST API | Metaplex
description: 登録済みエージェントのウォレットに資金を供給する、オンチェーンメモ付きの SOL 送金トランザクションを構築します。
method: POST
created: '08-01-2026'
updated: '08-01-2026'
keywords:
  - Agent API
  - fund agent
  - agent wallet
  - SOL transfer
about:
  - API endpoint
  - Agent finance
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

送信者のウォレットからエージェントの署名者 PDA ウォレットへ、オンチェーンメモ付きで SOL を送金するトランザクションを構築します。誰でも任意のエージェントに資金を供給できます。 {% .lead %}

## Summary

- エージェントのウォレット PDA（エージェントアドレスからサーバー側で解決）に SOL を送金します
- 帰属を示すため、送信者が署名する必須のメモインストラクションを付加します
- 送信者が署名・送信するための未署名トランザクションを返します

## Quick Reference

| 項目 | 値 |
|------|-------|
| **メソッド** | `POST` |
| **パス** | `/agents/{address}/fund` |
| **認証** | 不要 |
| **レスポンス** | シリアライズ済みトランザクション |

## エンドポイント

```
POST /agents/{address}/fund
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|------|----------|-------------|
| `address` | `string` | はい | エージェントの Core アセットミントアドレス（base58）。 |

## リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `sender` | `string` | はい | SOL を送るウォレット（base58）。トランザクションに署名します。 |
| `amount` | `number` | はい | SOL 単位の金額。正の値である必要があります。 |
| `memo` | `string` | はい | オンチェーンに記録されるメモ（1〜256文字）。 |
| `network` | `string` | いいえ | `solana-mainnet`（デフォルト）または `solana-devnet`。 |

## リクエスト例

```bash
curl -X POST "https://api.metaplex.com/v1/agents/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN/fund" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "4Nd1mYvJ9jVexjIXG5oJhanoGWyF7Cz6XkY8dEc4RsyG",
    "amount": 0.5,
    "memo": "Operating budget for July"
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

送信者はトランザクションをデシリアライズし、署名して送信します — [署名と送信](/ja/api/mint-agent#signing-and-submitting)をご参照ください。

## エラー

| ステータス | ボディ | 意味 |
|--------|------|---------|
| `400` | `{ "success": false, "error": "Invalid input data" }` | ボディがバリデーションに失敗（不正な公開鍵、正でない金額、メモの欠落）。 |
| `404` | `{ "success": false, "error": "Agent not found" }` | 指定されたネットワークのこのアドレスに登録されたエージェントが存在しない。 |
| `500` | `{ "success": false, "error": "Failed to prepare fund transaction" }` | サーバーエラー。 |

## Notes

- 送金先は Core アセットアドレスではなく、エージェントの**ウォレット PDA** です — API が自動的に解決します。
- 資金を引き出すには、エージェントのオーナーが [Withdraw](/ja/api/withdraw-agent) を使用します。
- エージェントウォレットの背後にある概念については、[エージェントファイナンス](/agents/agent-finance)をご参照ください。
