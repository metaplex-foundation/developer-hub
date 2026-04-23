---
title: クリエイター報酬の請求
metaTitle: Genesis - クリエイター報酬の請求 | REST API | Metaplex
description: 1回のAPI呼び出しでウォレットのすべてのGenesisボンディングカーブとRaydiumバケットからクリエイター報酬を請求します。署名準備済みのSolanaトランザクションを返します。
method: POST
created: '04-23-2026'
updated: '04-23-2026'
keywords:
  - Genesis API
  - claim creator rewards
  - creator fees
  - claimCreatorRewards
  - v1/creator-rewards/claim
  - payer
about:
  - API endpoint
  - Creator rewards
  - Bonding curve fees
  - Raydium CPMM fees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Bash
---

ウォレットが対象とするすべてのGenesisボンディングカーブとRaydium CPMMバケットの蓄積したクリエイター報酬を、1回の呼び出しで請求します。エンドポイントは、ウォレット（または指定された`payer`）が署名して送信する必要があるbase64エンコードされたSolanaトランザクションのリストを返します。{% .lead %}

{% callout type="note" title="SDKラッパーが利用可能" %}
ほとんどのインテグレーターは、Genesis JavaScript SDKの[`claimCreatorRewards`](/smart-contracts/genesis/sdk/api-client#claim-creator-rewards)を使用するべきです — トランザクションのデシリアライズ、エラー解析を処理し、署名のために[Umi アイデンティティ](dev-tools/umi/getting-started#connecting-a-wallet)に直接プラグインします。SDKに依存できない場合のみ、このエンドポイントを直接呼び出してください。
{% /callout %}

## エンドポイント

```
POST /v1/creator-rewards/claim
```

| 環境 | ベースURL |
|-------------|----------|
| Devnet & Mainnet | `https://api.metaplex.com` |

## リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-------|------|----------|-------------|
| `wallet` | `string` | はい | 請求するクリエイター手数料ウォレットのbase58エンコードされた公開鍵。これはバケットで`creatorFeeWallet`として設定されたウォレット — オーバーライドが設定されていない場合はローンチウォレットです。 |
| `network` | `string` | いいえ | `'solana-mainnet'`（デフォルト）または`'solana-devnet'`。ベースURLのクラスタと一致する必要があります。 |
| `payer` | `string` | いいえ | 返されたトランザクションのトランザクション手数料とレントを負担するbase58エンコードされた公開鍵。省略時はデフォルトで`wallet`になります。 |

### `payer`を設定するタイミング

クリエイター手数料ウォレットがSOLを保持していない場合（例：エージェントPDAやコールドウォレット）に、`payer`を別のウォレットに設定します。`payer`は返されたトランザクションに署名する必要があるため、通常はクリエイターの代わりに請求を提出するウォレットです。クリエイター手数料の受取人は引き続き請求されたSOLを受け取ります — `payer`は手数料とレントのみを負担します。

## リクエスト例

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi,curl" defaultFramework="umi" /%}

## 成功レスポンス

```json
{
  "data": {
    "transactions": ["<base64 transaction>", "<base64 transaction>"],
    "blockhash": {
      "blockhash": "ERKYmtrmNSKaw3VpnFYAfK3jvWGnd15Nf9kJxZqJ7JHx",
      "lastValidBlockHeight": 445407640
    }
  }
}
```

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `data.transactions` | `string[]` | base64エンコードされたSolanaトランザクション。それぞれをデシリアライズし、payer（およびクリエイター手数料ウォレットが別の署名者である場合はそれ）が署名して、送信する必要があります。 |
| `data.blockhash.blockhash` | `string` | トランザクションが構築された最近のブロックハッシュ。`confirmTransaction`でこれを使用してください — 新たに取得したブロックハッシュに置き換えないでください。 |
| `data.blockhash.lastValidBlockHeight` | `number` | ブロックハッシュが期限切れになる以降のスロット高さ。 |

{% callout type="note" %}
APIは請求されるバケットごとに1つのトランザクションを返します — 多くの場合2つ（ボンディングカーブとRaydium）。順次送信してください。順序は重要ではありません。
{% /callout %}

## エラーレスポンス

エラーはHTTPステータス`400`で次の形式で返されます：

```json
{ "error": { "message": "No rewards available to claim" } }
```

### 既知のエラーメッセージ

| メッセージ | HTTP | 原因 |
|---------|------|-------|
| `No rewards available to claim` | `400` | ウォレットにはどのバケットにも未請求の蓄積クリエイター報酬がありません。これは空の`transactions`配列の代わりに返されるため、呼び出し元はこれを例外的でない結果として処理する必要があります。 |
| `✖ Invalid wallet address` | `400` | `wallet`が有効なbase58 Solana公開鍵ではありません。 |

{% callout type="warning" title="報酬なしは空配列ではなく400" %}
ウォレットに請求するものがないとき、エンドポイントはHTTP `400`とメッセージ`No rewards available to claim`を返します — `transactions: []`を含む`200`は返**されません**。呼び出し元はエラーをキャッチする（または`response.status`と`body.error.message`を確認する）必要があり、これを失敗ではなく「やることなし」のケースとして処理する必要があります。SDKはこれを型付きの`GenesisApiError`として表面化します。[エラー処理](/smart-contracts/genesis/creator-fees#報酬なしのケースの処理)を参照してください。
{% /callout %}

## 注意事項

- エンドポイントはバケットレベルで冪等です — 成功した請求の直後に再度呼び出すと、新しい手数料が蓄積されるまで`No rewards available to claim`が返されます。
- 返されたトランザクションは`data.blockhash`のブロックハッシュを使用します。確認に~60〜90秒以上かかると、ブロックハッシュは期限切れになり、新しい一連のトランザクションを取得するために呼び出しを繰り返す必要があります。
- クリエイター報酬はすべてのスワップ（ボンディングカーブ）とLP取引活動（Raydium CPMM）から蓄積されます — このエンドポイントは両方を集約します。基礎となる蓄積メカニクスとバケットごとのフェッチヘルパーについては、[Genesis ボンディングカーブのクリエイター手数料](/smart-contracts/genesis/creator-fees)を参照してください。
- クリエイター手数料ウォレットはバケット作成時に`creatorFeeWallet`を介して設定され、カーブがライブになった後は変更できません。

## 推奨：SDKを使用

このエンドポイントを直接呼び出す代わりに、`@metaplex-foundation/genesis`の[`claimCreatorRewards`](/smart-contracts/genesis/sdk/api-client#claim-creator-rewards)を使用してください：

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi" filename="claimCreatorRewards" /%}

完全なSDK表面については[API クライアント](/smart-contracts/genesis/sdk/api-client)ページ、エンドツーエンドの請求ガイドについては[クリエイター手数料](/smart-contracts/genesis/creator-fees)を参照してください。
