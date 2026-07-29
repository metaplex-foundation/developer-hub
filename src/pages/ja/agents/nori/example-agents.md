---
title: Noriサンプルエージェント
metaTitle: Noriサンプルエージェント - 推論・画像生成・RPCコンシューマー | Metaplex
description: Noriの各サービスを利用するエージェントの実動例 - chat.completionを使うOpenAI互換の推論エージェント、image.generationを使うアートワークエージェント、solana.rpcとDASを使うポートフォリオアナライザー、そして生のA2A JSON-RPC呼び出し。
keywords:
  - Nori examples
  - example agents
  - OpenAI-compatible agent
  - chat.completion
  - image.generation
  - solana.rpc
  - DAS API
  - A2A message/send
  - agent template
about:
  - Nori
  - Autonomous Agents
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
programmingLanguage:
  - TypeScript
faqs:
  - q: Noriの推論サービスで使えるSDKはどれですか？
    a: OpenAI互換クライアントならどれでも動作します — createOpenAICompatibleを使うVercel AI SDK、カスタムbaseURLを設定した公式OpenAI SDK、あるいはOpenAI互換プロバイダーを受け入れるMastraのようなエージェントフレームワークです。クライアントをNORI_URL/v1に向け、ベアラートークンをAuthorizationヘッダーとして添付してください。
  - q: エージェントはNori経由でgetAssetsByOwnerのようなDASメソッドを使えますか？
    a: はい。solana.rpcサービスはDAS対応のアップストリームプロバイダーへの透過的なJSON-RPCパススルーなので、DASメソッド（getAsset、getAssetsByOwnerなど）は標準のSolana RPCメソッドとまったく同じように動作します — 同じエンドポイント、同じ呼び出しあたり価格です。
  - q: これらの例は委任なしでも動作しますか？
    a: はい、x402フォールバックレール経由で動作します — 各最初の呼び出しは、直接実行される代わりに支払い要件と共にHTTP 402を返します。例では支払いの往復を取り除けるため委任を前提としています。1回限りのセットアップについてはNoriに委任するを参照してください。
  - q: chat.completionではどのモデルをリクエストできますか？
    a: レートカードに掲載されている任意のモデルを<provider>/<model>形式で指定できます — たとえばanthropic/claude-sonnet-4-6、openai/gpt-5.4、google/gemini-2.5-flashです。GET /v1/modelsがライブのディレクトリを列挙し、GET /rate-cardにトークンあたりの価格が掲載されています。
---

これらの例は、コンシューマーエージェントがNoriの3つのサービス — LLM推論、画像生成、Solana RPC — をそれぞれ使う方法と、エージェント間呼び出し元向けの生のA2Aエンベロープを示します。各例は、1回限りの[委任セットアップ](/agents/nori/delegate-to-nori)が完了しベアラー`token`が手元にあることを前提とします。同じリクエストは委任なしでもx402フォールバック経由で動作しますが、支払いの往復が追加されます。{% .lead %}

## 概要

すべての例は完結した有料のNori呼び出しです — プロバイダーAPIキーはどこにも登場しません。

- **推論エージェント** — OpenAI互換クライアントを`NORI_URL/v1`に向け、ツール呼び出し付きで`chat.completion`を実行
- **アートワークエージェント** — `image.generation`（gpt-image-1）で画像を生成
- **ポートフォリオアナライザー** — `solana.rpc`で残高とトークン保有を読み取り（DASメソッドを含む）
- **A2A呼び出し元** — エージェント間統合向けにJSON-RPCの`message/send`で同じスキルを呼び出し

## chat.completionを使う推論エージェント

OpenAI互換クライアントを`NORI_URL/v1`に向けるだけで、エージェントのLLM頭脳を完全にNori上で動かせます。モデルは`<provider>/<model>`形式で指定され、Anthropic、OpenAI、Googleのアップストリームにルーティングされます。ツール呼び出し（`tools`、`tool_choice`、`tool_calls`）は3プロバイダーすべてでサポートされているため、完全なエージェントループが変更なしで動作します。

```typescript {% title="inference-agent.ts" %}
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const nori = createOpenAICompatible({
  name: 'nori',
  baseURL: `${NORI_URL}/v1`,
  headers: { Authorization: `Bearer ${token}` }, // from /auth/handshake
});

const { text } = await generateText({
  model: nori('anthropic/claude-sonnet-4-6'),
  tools: {
    getSolPrice: tool({
      description: 'Get the current SOL price in USD',
      inputSchema: z.object({}),
      execute: async () => fetchSolPrice(),
    }),
  },
  prompt: 'Is SOL above $200 right now? Answer in one sentence.',
});
```

各`generateText`呼び出しは1回の従量制`chat.completion`です — 選択したモデルの[レートカード](/agents/nori/pricing-and-billing)価格に基づき、実際の入出力トークン数で課金され、エージェントのPDAから決済されます。ワイヤーフォーマットが正規のOpenAIなので、モデルの切り替え（あるいは[障害時](/agents/nori/#単一障害点としてのnori)のNori以外のプロバイダーへのフォールバック）は1行の変更で済みます。

## image.generationを使うアートワークエージェント

アートワーク — NFT画像、アバター、ユーザー向けの生成コンテンツ — を必要とするエージェントは、標準のOpenAI画像リクエスト形式で`POST /v1/images/generations`を呼び出します。Noriはアップストリームのgpt-image-1にルーティングし、画像1枚あたりの固定価格で課金します。

```typescript {% title="artwork-agent.ts" %}
const response = await fetch(`${NORI_URL}/v1/images/generations`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    model: 'openai/gpt-image-1',
    prompt: 'Pixel-art portrait of a sea-otter plumber holding a wrench',
    n: 1,
    size: '1024x1024',
  }),
}).then((r) => r.json());

const imageB64 = response.data[0].b64_json;
```

よくある後続処理は、画像をアップロードして[MPL Core](/smart-contracts/core)アセットとしてミントすることです — 生成ステップとミントステップは独立しており、Noriの課金対象は生成のみです。

## solana.rpcを使うポートフォリオアナライザー

オンチェーンデータを扱うエージェントは、同じ課金パイプを通じてRPCとDASにアクセスできます。`POST /v1/solana/rpc`はDAS対応アップストリームへの透過的なJSON-RPCパススルーであり、標準メソッド（`getBalance`）とDASメソッド（`getAsset`、`getAssetsByOwner`）が1つのエンドポイントと1つの呼び出しあたり価格を共有します。このポートフォリオアナライザーは、収集 → 拡充 → 要約というワークフローの収集ステップを実装しています:

```typescript {% title="portfolio-analyzer.ts" %}
async function noriRpc(method: string, params: unknown[]) {
  const res = await fetch(`${NORI_URL}/v1/solana/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  }).then((r) => r.json());
  return res.result;
}

// Gather: SOL balance + all token holdings for a wallet.
const owner = '11111111111111111111111111111112'; // wallet under analysis
const balance = await noriRpc('getBalance', [owner]);

// DAS method — same endpoint, same per-call price.
const assets = await noriRpc('getAssetsByOwner', [
  { ownerAddress: owner, page: 1, limit: 100 },
]);

// Enrich/summarize: feed the holdings to the inference agent above
// for a natural-language portfolio breakdown.
```

各呼び出しは個別に従量計測される（呼び出しあたりの固定価格）ため、ループ型のエージェント — 一定間隔でポーリングする価格ウォッチャーや、ページネーションされた保有をたどるアナライザー — は呼び出し回数を意図的に予算化すべきです: PDA残高が支出上限であり、ウォレットが空になるとサービスは[ハードストップ](/agents/nori/pricing-and-billing#ハードストップのセマンティクス)します。

## A2A message/sendを使うエージェント間呼び出し

（OpenAI SDKではなく）プロトコルレベルで統合するエージェントは、[エージェントカード](/agents/nori/#noriが提供するサービス)から発見される`POST /a2a`で、JSON-RPC 2.0を介して同じスキルを呼び出します。スキルの入力はHTTPサーフェスとバイト単位で同一です — OpenAIリクエストボディが、DataPartとして`message/send`エンベロープの中を移動するだけです:

```typescript {% title="a2a-caller.ts" %}
const task = await fetch(`${NORI_URL}/a2a`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'message/send',
    params: {
      requestId: crypto.randomUUID(),
      message: {
        parts: [
          {
            kind: 'data',
            data: {
              skill: 'chat.completion',
              input: {
                model: 'anthropic/claude-sonnet-4-6',
                messages: [{ role: 'user', content: 'Hello from another agent.' }],
              },
            },
          },
        ],
      },
    },
  }),
}).then((r) => r.json());
```

`message/send`は完了したタスクを同期的に返します。`tasks/get`は過去のタスクをIDで取得します。`skill`に`image.generation`や`solana.rpc`を指定すれば、HTTP版と同じ入力形式で使えます。

{% callout type="note" title="ストリーミングはv1では利用できません" %}
`message/sendStream`はエージェントカードで宣言されていますが、v1では501を返し、`/v1/chat/completions`は非ストリーミングです。完全なレスポンスを前提にエージェントループを設計してください。
{% /callout %}

## クイックリファレンス

| 例 | サービス | エンドポイント | 課金単位 |
|---------|---------|----------|-----------|
| 推論エージェント | `chat.completion` | `POST /v1/chat/completions` | モデルごとの入出力トークンあたり |
| アートワークエージェント | `image.generation` | `POST /v1/images/generations` | 画像あたり |
| ポートフォリオアナライザー | `solana.rpc` | `POST /v1/solana/rpc` | 呼び出しあたり（DASメソッドを含む） |
| A2A呼び出し元 | 任意のスキル | `POST /a2a`（`message/send`） | 基となるスキルと同じ |

## 注意事項

- すべての例は`NORI_URL`（NoriのベースURL）と`token`（[ハンドシェイクフロー](/agents/nori/delegate-to-nori#ステップ3-ベアラートークンで認証)によるベアラー）を前提とします。トークンは15分で期限切れになるため、長時間稼働するエージェントは再ハンドシェイクします
- ベアラートークンなしでも同じリクエストはx402レール経由で動作します: 最初の呼び出しで支払い要件付きのHTTP 402を受け取り、支払ってから再試行します
- 稼働中のエージェントから始めたい場合、Metaplexエージェントテンプレートはこれらのパターンを既製のMastraツール（`chat-completion`、`generate-image`、`solana-rpc-call`、`delegate-to-nori`）としてパッケージ化しています
- 成功時課金はすべての例に適用されます: 失敗したアップストリーム呼び出しには何の費用もかかりません — [価格と課金](/agents/nori/pricing-and-billing#成功時課金の会計処理)を参照してください

Metaplex Foundationが管理。最終確認日: 2026-07-08。[GitHubでソースを見る](https://github.com/metaplex-foundation/agent-plumber)。

## FAQ

Noriのサービスに対する構築に関するよくある質問。

### Noriの推論サービスで使えるSDKはどれですか？
OpenAI互換クライアントならどれでも動作します — `createOpenAICompatible`を使うVercel AI SDK、カスタム`baseURL`を設定した公式OpenAI SDK、あるいはOpenAI互換プロバイダーを受け入れるMastraのようなエージェントフレームワークです。クライアントを`NORI_URL/v1`に向け、ベアラートークンを`Authorization`ヘッダーとして添付してください。

### エージェントはNori経由でgetAssetsByOwnerのようなDASメソッドを使えますか？
はい。`solana.rpc`サービスはDAS対応のアップストリームプロバイダーへの透過的なJSON-RPCパススルーなので、DASメソッド（`getAsset`、`getAssetsByOwner`など）は標準のSolana RPCメソッドとまったく同じように動作します — 同じエンドポイント、同じ呼び出しあたり価格です。

### これらの例は委任なしでも動作しますか？
はい、x402フォールバックレール経由で動作します — 各最初の呼び出しは、直接実行される代わりに支払い要件と共にHTTP 402を返します。例では支払いの往復を取り除けるため委任を前提としています。1回限りのセットアップについては[Noriに委任する](/agents/nori/delegate-to-nori)を参照してください。

### chat.completionではどのモデルをリクエストできますか？
レートカードに掲載されている任意のモデルを`<provider>/<model>`形式で指定できます — たとえば`anthropic/claude-sonnet-4-6`、`openai/gpt-5.4`、`google/gemini-2.5-flash`です。`GET /v1/models`がライブのディレクトリを列挙し、[`GET /rate-card`](/agents/nori/pricing-and-billing)にトークンあたりの価格が掲載されています。
