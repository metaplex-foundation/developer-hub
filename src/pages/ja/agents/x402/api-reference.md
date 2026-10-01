---
title: Metaplex x402 APIリファレンス
metaTitle: Metaplex x402 APIリファレンス - エンドポイント、料金、クライアントエクスポート | Metaplex
description: Metaplex x402 APIの完全なリファレンス。ベースURL、チャット補完・画像生成・Solana RPCの各エンドポイント、無料のディスカバリーエンドポイント、委任ルート、支払いチャレンジのフィールド、最新の料金、クライアントが公開するヘルパーとオプションを解説します。
keywords:
  - Metaplex x402 API
  - x402 endpoints
  - x402 pricing
  - OpenAI compatible endpoint
  - Solana RPC endpoint
  - MetaplexSvmExactScheme
  - payment required header
about:
  - Metaplex x402
  - API Reference
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
created: '09-08-2026'
updated: '09-08-2026'
---

Metaplex x402 APIは`https://api.metaplex.com/x402`で提供され、3つの有料サービス、2つの無料ディスカバリーエンドポイント、4つのエージェント委任ルートを公開しています。このページはエンドポイント、料金、クライアントエクスポートのリファレンスです。有料エンドポイントに必要な支払い対応`fetch`の構築方法は[支払いモードガイド](/ja/agents/x402/payment-modes)で説明しています。{% .lead %}

## 概要 {% #summary %}

すべての有料エンドポイントは、未払いのリクエストに対してHTTP `402`と、何をいくら支払えばよいかを正確に記述した`PAYMENT-REQUIRED`ヘッダーを返し、クライアントは支払い証明と共に再試行します。標準ウォレットモードと、Coreアセットまたはエージェントが直接支払うモードでは、支払いごとにローカルで署名します。委任されたエージェントの場合は、メッセージ署名で一度認証を行い、サービスがエージェントのウォレットから支払いを構築します。ディスカバリーエンドポイントには支払いも署名者も不要です。

- **ベースURL** — APIは`https://api.metaplex.com/x402`、Solana JSON-RPCは`https://api.metaplex.com/x402/rpc`
- **ワイヤーフォーマット** — チャットと画像は正規のOpenAIリクエスト/レスポンスボディ、RPCは標準のSolana JSON-RPC
- **決済** — Solanaメインネット上のUSDC、x402プロトコルバージョン2、`exact`スキーム
- **クライアントバージョン** — `@metaplex-foundation/x402` `0.1.0`、Node.js 20.18+、ESMのみ

## ベースURLと定数 {% #base-urls-and-constants %}

クライアントは両方のベースURLをエクスポートしているため、アプリケーション側でハードコードする必要はありません。

| 定数 | 値 |
|------|-----|
| `METAPLEX_X402_BASE_URL` | `https://api.metaplex.com/x402` |
| `METAPLEX_X402_RPC_URL` | `https://api.metaplex.com/x402/rpc` |

## エンドポイント {% #endpoints %}

有料エンドポイントには支払い対応の`fetch`が必要で、無料エンドポイントには不要です。

| メソッド | パス | 支払い | 説明 |
|---------|------|-------|------|
| `GET` | `/x402/models` | 無料 | 利用可能なモデルID |
| `GET` | `/x402/pricing` | 無料 | モデル単価、リクエスト最低額、RPCメソッド別価格、法務URL |
| `POST` | `/x402/chat/completions` | 有料 | OpenAI互換のチャット補完 |
| `POST` | `/x402/images/generations` | 有料 | OpenAI互換の画像生成 |
| `POST` | `/x402/rpc` | 有料 | Solana JSON-RPCと[DAS](/ja/solana/rpcs-and-das)、HTTPのみ |
| `GET` | `/x402/core-execute-delegate/status` | 無料 | Coreアセットの委任ステータス |
| `POST` | `/x402/core-execute-delegate/approve` | 無料 | 実行委任の承認 |
| `POST` | `/x402/core-execute-delegate/revoke` | 無料 | 実行委任の取り消し |
| `POST` | `/x402/core-execute-delegate/auth` | 無料 | Sign-In-With-X署名を24時間有効なベアラートークンと交換 |

委任ルートは[クライアントエクスポート](#client-exports)に挙げたSDKヘルパーでラップされています。ルートを直接呼ばず、これらのヘルパーを使ってください。

## ディスカバリーエンドポイント {% #discovery-endpoints %}

ディスカバリーエンドポイントは無料で呼び出せ、クライアントのヘルパー経由で型付きデータを返します。

```ts {% title="支払いなしでモデルと料金を取得する" %}
import { getModels, getPricing } from '@metaplex-foundation/x402';

// Available model IDs, e.g. 'openai/gpt-5.4-mini'.
const models = await getModels();

// Per-model token rates, request minimums, RPC method prices, and legal URLs.
const pricing = await getPricing();
```

`GET /x402/models`はOpenAI形式のモデル一覧を返します。

```json {% title="GET /x402/models のレスポンス（抜粋）" %}
{
  "object": "list",
  "data": [
    { "id": "anthropic/claude-opus-4.8", "object": "model", "created": 0, "owned_by": "anthropic" },
    { "id": "openai/gpt-5.4-mini", "object": "model", "created": 0, "owned_by": "openai" }
  ]
}
```

## チャット補完エンドポイント {% #chat-completions-endpoint %}

`POST /x402/chat/completions`は正規のOpenAIチャット補完ボディを受け取って返し、モデルは`<provider>/<model>`形式で指定します。

```ts {% title="OpenAI SDKによるチャット補完" %}
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import OpenAI from 'openai';

const openai = new OpenAI({
  // The OpenAI SDK requires a value, but this gateway authenticates by payment.
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: fetchWithPayment,
});

const completion = await openai.chat.completions.create({
  model: 'openai/gpt-5.4-mini',
  messages: [{ role: 'user', content: 'Say hi in one word.' }],
});
```

Vercel AI SDKは、OpenAI互換プロバイダーを介して同じエンドポイントに到達します。

```ts {% title="Vercel AI SDKによるチャット補完" %}
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import { generateText } from 'ai';

const metaplex = createOpenAICompatible({
  name: 'metaplex-x402',
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: fetchWithPayment,
});

const { text } = await generateText({
  model: metaplex.chatModel('openai/gpt-5.4-mini'),
  prompt: 'Say hi in one word.',
});
```

## 画像生成エンドポイント {% #image-generation-endpoint %}

`POST /x402/images/generations`は正規のOpenAI画像生成ボディを受け取ります。

```ts {% title="OpenAI SDKによる画像生成" %}
const image = await openai.images.generate({
  model: 'openai/gpt-image-1.5',
  prompt: 'A yellow square.',
  size: '1024x1024',
});
```

```ts {% title="Vercel AI SDKによる画像生成" %}
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: metaplex.imageModel('openai/gpt-image-1.5'),
  prompt: 'A yellow square.',
  size: '1024x1024',
});
```

## Solana RPCエンドポイント {% #solana-rpc-endpoint %}

`POST /x402/rpc`は標準のSolana JSON-RPCリクエストを受け付け、[DAS](/ja/solana/rpcs-and-das)メソッドをパススルーし、リクエストごとに個別に課金・決済します。

```ts {% title="Solana KitによるSolana RPC" %}
import { createSolanaRpcFromTransport, type RpcTransport } from '@solana/kit';
import { METAPLEX_X402_RPC_URL } from '@metaplex-foundation/x402';

const rpcTransport: RpcTransport = async ({ payload, signal }) => {
  const response = await fetchWithPayment(METAPLEX_X402_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: signal ?? null,
  });

  return response.json();
};

const rpc = createSolanaRpcFromTransport(rpcTransport);
const slot = await rpc.getSlot().send();
```

```ts {% title="web3.jsによるSolana RPC" %}
import { METAPLEX_X402_RPC_URL } from '@metaplex-foundation/x402';
import { Connection } from '@solana/web3.js';

const connection = new Connection(METAPLEX_X402_RPC_URL, {
  fetch: fetchWithPayment,
});
const slot = await connection.getSlot();
```

{% callout type="warning" title="x402のRPCエンドポイントはHTTP専用です" %}
WebSocket接続とサブスクリプションはサポートされていません。`accountSubscribe`や`logsSubscribe`などのサブスクリプションメソッドには従来のRPCプロバイダーを使ってください。
{% /callout %}

## 支払いチャレンジのフィールド {% #payment-challenge-fields %}

有料エンドポイントへの未払いリクエストは、base64エンコードされた`PAYMENT-REQUIRED`ヘッダーとともにHTTP `402`を返します。`@metaplex-foundation/x402`で構築したクライアントはこれを自動的に解析します。以下のフィールドは、デバッグ用途およびJavaScript以外のクライアント向けのドキュメントです。

| フィールド | 値の例 | 意味 |
|-----------|-------|------|
| `x402Version` | `2` | プロトコルバージョン |
| `accepts[].scheme` | `exact` | 支払いスキーム |
| `accepts[].network` | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` | SolanaメインネットのCAIP-2ネットワーク識別子 |
| `accepts[].asset` | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | USDCのミント |
| `accepts[].amount` | `1000` | アセットの最小単位での金額 — `1000`は`$0.001` |
| `accepts[].payTo` | `9AYgwvWMhZuir6rZoto13jrU1oZA1XxRDhqPznxyomHv` | 受取アカウント |
| `accepts[].maxTimeoutSeconds` | `300` | 支払いを送信しなければならない時間枠 |
| `accepts[].extra.quoteId` | UUID | 支払い対象の見積もりを識別 |
| `accepts[].extra.usage` | OpenAIのusageオブジェクト | 見積もりの算出根拠となった実測トークン使用量 |
| `accepts[].extra.memo` | `metaplex:x402:chat.completions` | 決済とともに書き込まれるMemo |
| `accepts[].extra.feePayer` | 公開鍵 | 支払いトランザクションのネットワーク手数料を負担するアカウント |
| `extensions["metaplex-core-execute-delegate"]` | オブジェクト | 委任認証の詳細 — `sign-in-with-x`、ベアラートークン、トークンエンドポイント、支払い元アセットを指定する`X-METAPLEX-CORE-ASSET`ヘッダー |

{% callout type="note" title="見積もりは実測使用量から算出されます" %}
推論リクエストの`402`チャレンジには`quoteId`と値の入った`usage`オブジェクトが含まれるため、金額は見積もりではなくリクエストが実際に消費したトークンを反映します。レスポンスヘッダーの`PAYMENT-REQUIRED`と`PAYMENT-RESPONSE`はどちらもCORSで公開されています。
{% /callout %}

## チャット補完の料金 {% #chat-completion-pricing %}

チャットモデルは100万トークンあたりの単価で、入力・キャッシュ入力・出力それぞれに個別のレートがあり、1リクエストあたり`$0.001`の最低額が適用されます。以下のレートは2026-09-08に`GET /x402/pricing`から取得したものです。

| モデル | 入力 | キャッシュ入力 | 出力 |
|-------|------|-------------|------|
| `anthropic/claude-opus-4.8` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.7` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.6` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-opus-4.5` | $5.00 | $0.50 | $25.00 |
| `anthropic/claude-sonnet-4.6` | $3.00 | $0.30 | $15.00 |
| `anthropic/claude-sonnet-4.5` | $3.00 | $0.30 | $15.00 |
| `anthropic/claude-haiku-4.5` | $1.00 | $0.10 | $5.00 |
| `openai/gpt-5.5` | $5.00 | $0.50 | $30.00 |
| `openai/gpt-5.4` | $2.50 | $0.25 | $15.00 |
| `openai/gpt-5.4-mini` | $0.75 | $0.075 | $4.50 |
| `openai/gpt-5.4-nano` | $0.20 | $0.02 | $1.25 |

`openai/gpt-5.5`と`openai/gpt-5.4`は、入力272,000トークンを超えるとロングコンテキストの高いレートが適用されます — `gpt-5.5`は入力$10.00・出力$45.00、`gpt-5.4`は入力$5.00・出力$22.50です。

## 画像生成の料金 {% #image-generation-pricing %}

画像モデルは4区分について100万トークンあたりで課金され、同じく1リクエストあたり`$0.001`の最低額が適用されます。

| モデル | 入力テキスト | 入力画像 | 出力画像 | 出力テキスト |
|-------|------------|---------|---------|------------|
| `openai/gpt-image-1.5` | $5.00 | $8.00 | $32.00 | $10.00 |
| `openai/gpt-image-2` | $5.00 | $8.00 | $30.00 | $10.00 |

## Solana RPCの料金 {% #solana-rpc-pricing %}

RPC呼び出しはデフォルトで1リクエストあたり`$0.00001`、負荷の重いメソッドには高いレートが設定されています。

| メソッド | 1リクエストあたりの価格 |
|---------|---------------------|
| デフォルト（一覧にないすべてのメソッド） | $0.00001 |
| `getBlockTime` | $0.00001 |
| `getTransaction` | $0.00002 |
| `getBlocks` | $0.00002 |
| `getBlocksWithLimit` | $0.00002 |
| `getConfirmedTransaction` | $0.00002 |
| `getBlock` | $0.00005 |
| `getConfirmedBlock` | $0.00005 |
| `getSignaturesForAddress` | $0.00010 |

## `MetaplexSvmExactScheme`のオプション {% #metaplexsvmexactscheme-options %}

`MetaplexSvmExactScheme`は、Coreアセットおよびエージェントの支払いに使う支払いスキームです。

| オプション | 必須 | 説明 |
|-----------|------|------|
| `rpcUrl` | はい | 支払いトランザクションの構築に使うRPCエンドポイント |
| `coreExecute.asset` | Coreアセット支払いの場合 | 支払いの資金元となるシグナーPDAを持つCoreアセットまたはエージェント |
| `coreExecute.collection` | アセットがコレクションに属する場合 | そのアセットのCoreコレクション |
| `coreExecute.executionDelegateRecord` | いいえ | 上級者向け: 実行デリゲートレコードを上書きします |
| `commitment` | いいえ | ブロックハッシュ取得時のコミットメント。既定は`confirmed` |
| `computeUnitLimit` | いいえ | Core `execute`支払いでは既定200,000、それ以外では20,000 |

このスキームはUmiの署名者とSolana Kitのパーシャルトランザクション署名者を受け付けますが、sign-and-send署名者は受け付けません。Kitの署名者は内部で変換されます。

## クライアントエクスポート {% #client-exports %}

`@metaplex-foundation/x402`は、公開APIをパッケージルートに集約しています。

| カテゴリ | エクスポート |
|---------|-------------|
| 支払い | `MetaplexSvmExactScheme`、`MetaplexSvmSigner`、`kitPartialTransactionSignerToUmiSigner` |
| エージェント委任 | `fetchMetaplexCoreExecuteDelegateStatus`、`approveMetaplexCoreExecuteDelegate`、`revokeMetaplexCoreExecuteDelegate`、`authorizeMetaplexCoreExecuteDelegate` |
| エージェント支払いトランスポート | `createMetaplexCoreExecuteDelegateClientExtension`、`wrapFetchWithMetaplexCoreExecuteDelegate`、各トークンストア実装 |
| ディスカバリー | `getModels`、`getPricing`、`METAPLEX_X402_BASE_URL`、`METAPLEX_X402_RPC_URL` |

オプション型と結果型、プロトコル定数、委任ルートのスキーマもパッケージルートからエクスポートされています。

## 環境変数 {% #environment-variables %}

[x402リポジトリ](https://github.com/metaplex-foundation/x402/tree/main/examples)の実行可能なサンプルは、以下の変数を読み込みます。

| 変数 | 必須 | 説明 |
|------|------|------|
| `SVM_PRIVATE_KEY` | はい | Base58エンコードされた64バイトの開発用キーペア |
| `CORE_ASSET_ADDRESS` | Coreアセット・エージェントのサンプル | そのキーペアが所有するMetaplex Coreアセット |
| `SVM_RPC_URL` | いいえ | x402のSVMスキームが使うカスタムSolana RPC URL |
| `METAPLEX_X402_BASE_URL` | いいえ | APIベースURL。既定は`https://api.metaplex.com/x402` |
| `METAPLEX_X402_RPC_URL` | いいえ | RPC URL。既定は`https://api.metaplex.com/x402/rpc` |
| `METAPLEX_API_BASE_URL` | いいえ | ローカル開発用のAPIルート上書き。例: `http://localhost:3000/api` |

## 注意事項 {% #notes %}

- このリファレンスの価格は2026-09-08に取得したスナップショットです。実効的な価格表はライブサービスの`GET /x402/pricing`であり、無料で呼び出せます。
- 支払いはクラシックなSPL Tokenの関連トークンアカウントからUSDCで決済されます。Token-2022の支払いミントは現在サポートされていません。
- Coreアセットおよびエージェントの支払いモードでは、Core `execute`手数料のためにアセットシグナーPDAにSOLが必要です。標準ウォレットの支払いには不要です。
- ホストされたサーバーはオープンソースではありません。クライアント、そのサンプル、プロトコル型はApache-2.0で公開されています。
- 本APIの利用は、[Metaplex.com利用規約](https://www.metaplex.com/terms-of-use)および[プライバシーポリシー](https://www.metaplex.com/privacy)への同意を意味します。

## クイックリファレンス {% #quick-reference %}

| 項目 | 値 |
|------|-----|
| APIベースURL | `https://api.metaplex.com/x402` |
| RPC URL | `https://api.metaplex.com/x402/rpc` |
| JSクライアント | `@metaplex-foundation/x402`（`0.1.0`） |
| ランタイム | Node.js 20.18+、ESM |
| プロトコル | x402バージョン2、`exact`スキーム |
| ネットワーク | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`（Solanaメインネット） |
| 支払いミント | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`（USDC） |
| 運用エージェント | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| ソース | [GitHub](https://github.com/metaplex-foundation/x402)（Apache-2.0） |

---

Metaplex Foundationが管理。最終確認日: 2026-09-08。クライアントバージョン: `@metaplex-foundation/x402` `0.1.0`。[GitHubでソースを見る](https://github.com/metaplex-foundation/x402)。
