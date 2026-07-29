---
title: Noriに委任する
metaTitle: Noriに委任する - デリゲートペイ課金への1回限りのオンボーディング | Metaplex
description: NoriをMetaplexエージェントの実行デリゲートとして登録し、すべてのLLM・画像・RPC呼び出しがエージェントのPDAウォレットから自動的に決済されるようにします。オンボーディングは無料 — 手数料用のSOLもRPCも不要です。
keywords:
  - delegate to Nori
  - execution delegation
  - delegate-pay
  - agent onboarding
  - delegateExecutionV1
  - Nori bearer token
  - Metaplex agent billing
about:
  - Nori
  - Execution Delegation
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-08-2026'
programmingLanguage:
  - TypeScript
howToSteps:
  - Noriのエージェントカードを取得し、serviceExecutiveAddressを読み取ります。
  - Noriのエグゼクティブプロファイルを指す単一のdelegateExecutionV1命令を含むトランザクションを、Noriをフィーペイヤーとして構築します。
  - エージェントのエグゼクティブキーペアで署名し、Noriの無料の/v1/delegate/submitエンドポイントにトランザクションを送信します。
  - /auth/handshakeで署名済みチャレンジをベアラートークンと交換します。
  - ベアラートークンを付けて有料呼び出しを行います — 課金はエージェントのPDAウォレットから自動的に決済されます。
howToTools:
  - '@metaplex-foundation/mpl-agent-registry'
  - '@metaplex-foundation/umi'
faqs:
  - q: Noriへの委任に費用はかかりますか？
    a: いいえ。Noriが委任トランザクションのネットワーク手数料を支払い（フィーペイヤーとして連署します）、オンボーディングエンドポイントは無料かつ認証不要です。ただし、その後はエージェントのPDAウォレットに運用に必要なSOL残高が必要になります。呼び出しごとの課金の引き落とし元となるアカウントだからです。
  - q: 委任はNoriにどのような権限を与えますか？
    a: 委任はNoriのエグゼクティブプロファイルをエージェントアセットの実行デリゲートとして登録し、NoriがエージェントのPDAウォレットからSOLを移動するMPL Core Executeトランザクションに署名できるようにします。Noriはこれを使って呼び出しごとの課金を決済し、それぞれにオンチェーンのMemoレシートが付きます。PDAには運用に必要な残高だけを置き、レシートを監査してください。
  - q: Noriによるエージェントへの課金を止めるにはどうすればいいですか？
    a: エージェントアセット上の実行委任を取り消します。次の課金試行はオンチェーンで失敗し、Noriのキャッシュ済みデリゲートステータスは無効化され、デリゲートペイのレールはハードストップします — 以降の呼び出しは自動課金される代わりにHTTP 402のx402チャレンジを受け取ります。
  - q: 委任したのに呼び出しがHTTP 402を返すのはなぜですか？
    a: 402は、その呼び出しでデリゲートペイのレールが利用できなかったことを意味します — ベアラートークンが欠落または期限切れ（トークンの有効期間は15分）、委任が取り消された、または課金自体が失敗した（通常はPDAウォレットが空）のいずれかです。ハンドシェイクを再実行し、委任レコードが存在することを確認し、PDA残高をチェックしてください。
  - q: 委任せずにNoriを使うことはできますか？
    a: はい。委任していない呼び出し元はx402フォールバックレールを使います — 最初のリクエストは支払い要件と共にHTTP 402を返し、SOLまたはUSDCで支払ってから再試行します。費用は同じですが、すべての呼び出しに支払いの往復が追加されます。一方、デリゲートペイはインラインで決済されます。
---

Noriへの委任は、Noriをエージェントのアセット上の[実行デリゲート](/smart-contracts/mpl-agent/tools)として登録する1回限りのオンチェーンセットアップです。その後は、エージェントがNoriに対して行うすべてのLLM・画像・RPC呼び出しがエージェントのPDAウォレットから自動的に決済されます — 支払いの往復も、ウォレットプロンプトも、プロバイダーAPIキーも不要です。オンボーディングは無料です: Noriがトランザクション手数料を支払い、ブロックハッシュも提供するため、エージェントはキーペアにSOLを持つ必要も、自前のRPCを持つ必要もありません。{% .lead %}

## 概要

Noriに実行委任を付与すると、エージェントは2往復の[x402フォールバック](/agents/nori/#noriの決済の仕組み)からインラインのデリゲートペイレールに切り替わります。

- **1回限りのセットアップ** — Noriのエグゼクティブプロファイルを指す単一の`delegateExecutionV1`命令。Noriが無料で連署・送信します
- **呼び出しごとの決済** — NoriはMemoレシート付きのMPL Core Executeトランザクションを通じてエージェントの[Asset Signer PDA](/agents/what-is-an-agent)に課金し、[成功した呼び出し](/agents/nori/pricing-and-billing#成功時課金の会計処理)のみが対象です
- **ベアラートークン認証** — 署名済みチャレンジ/ハンドシェイクで15分間有効なベアラートークンを発行し、呼び出しをデリゲートペイのレールにルーティングします
- **いつでも取り消し可能** — アセットオーナーは委任を取り消すことができ、自動課金は即座に[ハードストップ](#noriへの委任の取り消し)します

{% callout type="warning" title="委任は課金権限を付与します" %}
実行デリゲートは、エージェントのPDAウォレットからの送金に署名できます。PDAは支出用アカウントとして扱ってください: トレジャリーではなく運用に必要な残高を置き、すべての課金に付随するMemoレシートを監査しましょう。Noriをエージェントの唯一のサービスプロバイダーにする前に、[単一障害点に関する注意](/agents/nori/#単一障害点としてのnori)を参照してください。
{% /callout %}

## クイックスタート

1. [Noriのエージェントカードを取得](#ステップ1-noriのエグゼクティブアドレスを取得)して`serviceExecutiveAddress`を読み取ります
2. エグゼクティブキーペアを権限、Noriをフィーペイヤーとして[委任トランザクションを構築](#ステップ2-委任トランザクションの構築と送信)し、`POST /v1/delegate/submit`に送信します
3. [エージェントのPDAウォレットに入金](#エージェントpdaウォレットへの入金)して運用に必要なSOL残高を用意します
4. `/auth/challenge` + `/auth/handshake`で[ベアラートークンを発行](#ステップ3-ベアラートークンで認証)します
5. `Authorization: Bearer <token>`を付けて[有料呼び出しを実行](#ステップ4-有料呼び出しを実行)します

## 前提条件

委任には既存のオンチェーンエージェントIDが必要です。委任トランザクションはアセットとそのID PDAを参照します。

- [登録済みエージェント](/agents/register-agent) — `AgentIdentity`レコードを持つMPL Coreアセット
- エージェントの**エグゼクティブキーペア**（エージェントの実行に使うキーペア。[エージェントを実行](/agents/run-an-agent)でセットアップ）— 権限として委任に署名します
- `@metaplex-foundation/mpl-agent-registry`と`@metaplex-foundation/umi`のインストール
- 委任自体にはSOLもRPCエンドポイントも不要です — Noriが両方を提供します

## ステップ1: Noriのエグゼクティブアドレスを取得

Noriのエージェントカードには、委任先のアドレスが宣伝されています。`/.well-known/agent-card.json`を取得し、2つのフィールドを読み取ります:

- `serviceExecutiveAddress` — Noriのエグゼクティブキーペアの公開鍵。そのエグゼクティブプロファイルPDAが、アセットにデリゲートとして登録する対象です。
- `serviceAssetAddress` — Nori自身のエージェントアセット。そのPDAが課金の支払い先であり、すべての課金をオンチェーンで検証できます。

```typescript {% title="fetch-nori-card.ts" %}
const NORI_URL = process.env.NORI_URL; // Nori's base URL

const card = await fetch(`${NORI_URL}/.well-known/agent-card.json`).then((r) =>
  r.json(),
);

const noriExecutive = card.serviceExecutiveAddress; // delegate to this
const noriServiceAsset = card.serviceAssetAddress; // charges are paid here
```

## ステップ2: 委任トランザクションの構築と送信

委任トランザクションには、ちょうど1つの`delegateExecutionV1`命令が含まれます: エグゼクティブキーペアが権限として署名し、Noriのエグゼクティブプロファイルがデリゲート、Noriのキーペアがフィーペイヤーです。オフラインで構築・署名し（Noriの無料の`GET /v1/solana/blockhash`エンドポイントがブロックハッシュを提供します）、部分署名済みトランザクションを`POST /v1/delegate/submit`にPOSTします。Noriはこれを検証し、フィーペイヤーとして連署して送信します。

```typescript {% title="delegate-to-nori.ts" %}
import { createNoopSigner, publicKey } from '@metaplex-foundation/umi';
import {
  delegateExecutionV1,
  findAgentIdentityV1Pda,
  findExecutiveProfileV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

// `umi` is configured with your agent's executive keypair as identity.
const agentAsset = publicKey(process.env.AGENT_ASSET_ADDRESS);

// Nori's executive profile PDA, derived from the agent card address.
const noriProfile = findExecutiveProfileV1Pda(umi, {
  authority: publicKey(noriExecutive),
});
const agentIdentity = findAgentIdentityV1Pda(umi, { asset: agentAsset });

// Free blockhash — no RPC of your own needed.
const { blockhash } = await fetch(`${NORI_URL}/v1/solana/blockhash`).then((r) =>
  r.json(),
);

// Build with Nori as fee payer (a noop signer — Nori co-signs server-side),
// sign with your executive keypair.
const tx = await delegateExecutionV1(umi, {
  agentAsset,
  agentIdentity,
  executiveProfile: noriProfile,
})
  .setFeePayer(createNoopSigner(publicKey(noriExecutive)))
  .setBlockhash(blockhash)
  .buildAndSign(umi);

// Nori validates, co-signs, and submits — free of charge.
const result = await fetch(`${NORI_URL}/v1/delegate/submit`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transaction: Buffer.from(umi.transactions.serialize(tx)).toString('base64'),
  }),
}).then((r) => r.json());

console.log(result);
// { success: true, signature: '...', agentAsset: '...', authority: '...' }
```

{% callout type="note" title="厳格なトランザクション検証" %}
`POST /v1/delegate/submit`は、Nori自身のエグゼクティブプロファイルを指し、Noriをフィーペイヤーとする、ちょうど1つの`delegateExecutionV1`命令（`mpl-agent-tools`プログラムのディスクリミネーター1）以外のものをすべて拒否します。この厳格な形状により、無料エンドポイントがトランザクション送信サービスとして悪用されることを防ぎます。
{% /callout %}

Metaplexエージェントテンプレートからエージェントを構築する場合、このステップ全体は`delegate-to-nori`ツールとしてパッケージ化されています — 1回の呼び出しで、手動のトランザクション構築は不要です。

## ステップ3: ベアラートークンで認証

有料呼び出しは、Sign-In-With-Solanaスタイルのハンドシェイクで発行されたベアラートークンを携えている場合にデリゲートペイのレールにルーティングされます。トークンは、エージェントアセットに登録されたデリゲートであるエグゼクティブキーペアを制御していることを証明します。有効期間は15分なので、期限切れ時にはハンドシェイクを再実行してください。

```typescript {% title="nori-handshake.ts" %}
import { base58 } from '@metaplex-foundation/umi/serializers';

// 1. Get a fresh nonce.
const { nonce } = await fetch(`${NORI_URL}/auth/challenge`).then((r) => r.json());

// 2. Sign the handshake envelope with your executive keypair.
const now = Date.now();
const handshake = {
  pubkey: umi.identity.publicKey.toString(),
  agentAsset: agentAsset.toString(),
  audience: NORI_URL,
  nonce,
  issuedAt: new Date(now).toISOString(),
  expiresAt: new Date(now + 60_000).toISOString(),
};
const signature = base58.deserialize(
  await umi.identity.signMessage(
    new TextEncoder().encode(JSON.stringify(handshake)),
  ),
)[0];

// 3. Exchange for a bearer token (valid 15 minutes).
const { token } = await fetch(`${NORI_URL}/auth/handshake`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ handshake, signature }),
}).then((r) => r.json());
```

## ステップ4: 有料呼び出しを実行

ベアラートークンを添付すると、Noriはアップストリームの呼び出しを実行してから、1つのExecuteトランザクションでエージェントのPDAに課金します — レスポンスは402チャレンジなしの1往復で返ってきます。同じヘッダーがすべての`/v1/*`エンドポイントと`/a2a`で機能します。

```typescript {% title="paid-call.ts" %}
const completion = await fetch(`${NORI_URL}/v1/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    model: 'anthropic/claude-sonnet-4-6',
    messages: [{ role: 'user', content: 'Hello from a delegated agent.' }],
  }),
}).then((r) => r.json());
```

アセットに対する最初の有料呼び出しの際、Noriは自分がまだ登録済みデリゲートであることをオンチェーンで確認します。結果は5分間キャッシュされるため、以降の呼び出しではチェーンの参照はスキップされます。各サービスを利用する完全なエージェント（OpenAI互換SDKクライアントをNoriに向ける例を含む）については、[サンプルエージェント](/agents/nori/example-agents)を参照してください。

## エージェントPDAウォレットへの入金

課金はエージェントのAsset Signer PDAから引き落とされるため、最初の有料呼び出しの前にSOL残高が必要です。PDAはシステムのレント免除最低額（0バイトアカウントで890,880ラマポート）を上回っている必要もあります — Metaplexエージェントテンプレートは、レント未満の小さな課金が失敗しないよう、委任時に0.002 SOLをシードします。任意のウォレットからPDAにSOLを送金してください。残高が尽きると、補充するまで呼び出しはHTTP 402チャレンジにフォールバックします（[ハードストップのセマンティクス](/agents/nori/pricing-and-billing#ハードストップのセマンティクス)を参照）。

## Noriへの委任の取り消し

実行委任の取り消しはキルスイッチであり、ハードストップとして効力を発揮します。アセットオーナーがNoriのエグゼクティブプロファイルに対する`ExecutionDelegateRecordV1`を取り消すと、次の課金試行はオンチェーンで失敗し、Noriはそのアセットのキャッシュ済みデリゲートステータスを無効化し、デリゲートペイのレールは停止します — それ以降、呼び出しは自動課金される代わりにx402の支払いチャレンジを受け取ります。5分間のデリゲートステータスキャッシュのため、取り消し直後の呼び出しはデリゲート課金を試行して（そして失敗して）しまう可能性がありますが、チェーンが拒否するため取り消し後に課金が成立することはありません。

取り消してもエージェントの登録が解除されたり、PDA残高に影響したりすることはありません — Noriの課金権限が取り除かれるだけです。[ステップ2](#ステップ2-委任トランザクションの構築と送信)を繰り返すことで、後から再委任できます。

## よくあるエラー

| エラー | 原因 | 対処 |
|-------|-------|-----|
| `expected { transaction: <base64> }`（400） | `/v1/delegate/submit`のボディフィールドが間違っている | `{ "transaction": "<base64-encoded signed tx>" }`を送信する |
| 委任の送信が`errorReason`付きで拒否される | トランザクションの形状が厳格な検証に失敗 — 余分な命令、間違ったプログラム、間違ったエグゼクティブプロファイル、または間違ったフィーペイヤー | Noriのエグゼクティブプロファイルを指し、Noriをフィーペイヤーとする、ちょうど1つの`delegateExecutionV1`命令を構築する |
| 有料呼び出しで`401` | ベアラートークンの欠落または期限切れ（有効期間15分） | チャレンジ/ハンドシェイクフローを再実行する |
| 委任済みなのに有料呼び出しで`402` | 委任が取り消された、または課金が失敗した（通常はPDAウォレットが空） | 委任レコードが存在し、PDA残高が呼び出しをまかなえることを確認する |
| `Neither the asset or any plugins have approved this operation` | 委任の取り消し後に課金が試行された | 想定どおりのハードストップ動作 — デリゲートペイを再開するには再委任する |
| 課金時に`insufficient funds for rent` | PDA残高がレント免除最低額を下回っている | PDAを補充する（890,880ラマポート + 運用に必要な残高を上回る状態を維持する） |

## 注意事項

- オンボーディングエンドポイント（`GET /v1/solana/blockhash`、`POST /v1/delegate/submit`）は無料かつ認証不要です。それ以外の実作業を行うものはすべて有料です
- ベアラートークンはエグゼクティブキーペア + エージェントアセットのペアごとに発行され、15分で期限切れになります — クライアントに再ハンドシェイクを組み込んでください
- デリゲートステータスのキャッシュにより、委任状態の変更（付与または取り消し）が決済レールに反映されるまで最大5分かかることがあります。オンチェーンの強制は即時です
- 委任はアセットごとです: 複数のエージェントを運用するオペレーターは、各アセットを個別に委任します
- `mpl-agent-tools`の実行委任（`ExecutionDelegateRecordV1`）、プログラム`TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`に適用されます

Metaplex Foundationが管理。最終確認日: 2026-07-08。[GitHubでソースを見る](https://github.com/metaplex-foundation/agent-plumber)。

## FAQ

Noriへの委任に関するよくある質問。

### Noriへの委任に費用はかかりますか？
いいえ。Noriが委任トランザクションのネットワーク手数料を支払い（フィーペイヤーとして連署します）、オンボーディングエンドポイントは無料かつ認証不要です。ただし、その後はエージェントのPDAウォレットに運用に必要なSOL残高が必要になります。呼び出しごとの課金の引き落とし元となるアカウントだからです。

### 委任はNoriにどのような権限を与えますか？
委任はNoriのエグゼクティブプロファイルをエージェントアセットの実行デリゲートとして登録し、NoriがエージェントのPDAウォレットからSOLを移動する[MPL Core Execute](/smart-contracts/core/execute-asset-signing)トランザクションに署名できるようにします。Noriはこれを使って呼び出しごとの課金を決済し、それぞれにオンチェーンのMemoレシートが付きます。PDAには運用に必要な残高だけを置き、レシートを監査してください。

### Noriによるエージェントへの課金を止めるにはどうすればいいですか？
エージェントアセット上の実行委任を取り消します。次の課金試行はオンチェーンで失敗し、Noriのキャッシュ済みデリゲートステータスは無効化され、デリゲートペイのレールはハードストップします — 以降の呼び出しは自動課金される代わりにHTTP 402のx402チャレンジを受け取ります。

### 委任したのに呼び出しがHTTP 402を返すのはなぜですか？
402は、その呼び出しでデリゲートペイのレールが利用できなかったことを意味します — ベアラートークンが欠落または期限切れ（トークンの有効期間は15分）、委任が取り消された、または課金自体が失敗した（通常はPDAウォレットが空）のいずれかです。ハンドシェイクを再実行し、委任レコードが存在することを確認し、PDA残高をチェックしてください。

### 委任せずにNoriを使うことはできますか？
はい。委任していない呼び出し元はx402フォールバックレールを使います — 最初のリクエストは支払い要件と共にHTTP 402を返し、SOLまたはUSDCで支払ってから再試行します。費用は同じですが、すべての呼び出しに支払いの往復が追加されます。一方、デリゲートペイはインラインで決済されます。
