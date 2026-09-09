---
title: Metaplex x402 - リクエストごとに支払うAIとSolana RPC
metaTitle: Metaplex x402 - エージェント向けのリクエスト課金型AI推論とSolana RPC | Metaplex
description: Metaplex x402は、APIキーもアカウントも不要で、LLM推論、画像生成、Solana RPCをHTTP経由で提供します。すべてのリクエストが、ウォレット、Coreアセット、または委任されたエージェントからUSDCで自動的に支払われます。
keywords:
  - Metaplex x402
  - x402 payments
  - pay per request API
  - agent payments
  - OpenAI compatible API
  - Solana RPC
  - USDC micropayments
  - Mech agent
about:
  - Metaplex x402
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '09-08-2026'
updated: '09-08-2026'
faqs:
  - q: Metaplex x402とは何ですか？
    a: Metaplex x402は、LLM推論、画像生成、Solana RPCアクセスを販売するリクエスト課金型のHTTP APIです。APIキー、アカウント、サブスクリプションは不要で、各リクエストはx402プロトコルを使ってSolana上でUSDC決済されます。x402は、HTTPの402 Payment Requiredステータスを機械が支払い可能なフローに変えるプロトコルです。
  - q: Metaplex x402を使うのにAPIキーやアカウントは必要ですか？
    a: いいえ。支払いが認証そのものです。必要なのはUSDCを保有するSolanaウォレット、Coreアセット、または登録済みエージェントだけです。OpenAI SDKは空でないapiKey値を要求するため、例では文字列'x402'を渡していますが、ゲートウェイはこれを無視します。
  - q: Mechとは何ですか？
    a: Mechは、x402サービスを運用するオンチェーンのMetaplexエージェントです。支払いはMechのCoreウォレット — そのアセットシグナーPDA — にUSDCで決済されます。Mechはあなたのエージェントやウォレットにサービスを販売するエージェントであり、アドレスはMECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuFです。
  - q: Noriサービスエージェントのドキュメントはどうなりましたか？
    a: Noriのページは、一般公開されることなく現在は保守されていない初期プロトタイプを説明したものでした。それを置き換えて実際にリリースされたサービスがMetaplex x402です。現在Noriという名称は、metaplex.com/noriにあるMetaplex AIコパイロットを指しており、有料推論やRPCとは無関係の別プロダクトです。
  - q: Metaplex x402の課金はSOLですか、USDCですか？
    a: USDCです。支払いはクラシックなSPL Tokenの関連トークンアカウントから行われ、Token-2022の支払いミントはサポートされていません。Coreアセットおよびエージェントの支払いモードでは、Core executeのトランザクション手数料をまかなうために、アセットシグナーPDAに少額のSOL残高も必要です。
  - q: Metaplex x402のサーバーはオープンソースですか？
    a: クライアントはオープンソースです。TypeScriptクライアント、そのサンプル、プロトコル型はgithub.com/metaplex-foundation/x402にApache-2.0で公開されています。ホストされたサービスを動かすサーバーは現在公開されていません。
  - q: 1回のリクエストの費用はどれくらいですか？
    a: 推論の料金は上流プロバイダーのトークン単価に準拠し、1リクエストあたり$0.001の最低額が適用されます。RPC呼び出しは$0.00001からのリクエスト単位課金で、負荷の重いメソッドには高いレートが設定されています。GET /x402/pricingは最新のレートを返し、無料で呼び出せます。
---

Metaplex x402は、LLM推論、画像生成、Solana RPCのためのリクエスト課金型HTTP APIです — APIキーもアカウントもサブスクリプションもありません。USDCを保有するSolanaウォレット、[Coreアセット](/smart-contracts/core)、または[登録済みエージェント](/agents/register-agent)を用意すれば、すべてのリクエストがその都度USDCで自動的に支払われます。{% .lead %}

## 概要 {% #summary %}

Metaplex x402は、HTTPの`402 Payment Required`ステータスを機械が支払い可能なフローに変えます。アプリが通常どおりエンドポイントを呼び出すと、サーバーは支払い要件とともに`402`を返し、クライアントがUSDCの支払いに署名して再試行すると、サーバーがSolana上で決済してレスポンスを返します。このサービスはオンチェーンのMetaplexエージェントである[Mech](#mech-the-agent-that-operates-metaplex-x402)が運用しています。

- **3つのサービス** — OpenAI互換のチャット補完、OpenAI互換の画像生成、そして[DAS](/solana/rpcs-and-das)パススルー対応のSolana JSON-RPC
- **3つの支払いモード** — 標準ウォレット、Coreアセットまたはエージェントによる直接支払い、そしてリクエストごとの署名なしで支払う[委任エージェント](/agents/x402/payment-modes#pay-instantly-with-a-delegated-agent)
- **USDC決済** — 支払いはクラシックなSPL Tokenの関連トークンアカウントから行われ、Token-2022の支払いミントはサポートされていません
- **オープンソースのクライアント** — [`@metaplex-foundation/x402`](https://github.com/metaplex-foundation/x402)はApache-2.0で、12個の実行可能なサンプルが付属します。ホストされたサーバーは公開されていません

{% callout type="note" title="Metaplex x402とNoriという名称について" %}
Metaplex x402は、以前このセクションで「Nori」として説明されていた初期のサービスエージェントのプロトタイプを置き換えるものです。そのプロトタイプは一般公開されることなく、現在は保守されていません。SOL建ての課金、`/a2a`サーフェス、エージェントカードは、このサービスには存在しません。**[Nori](https://www.metaplex.com/nori)は現在Metaplex AIコパイロット**であり、有料推論やRPCとは無関係の別プロダクトです。
{% /callout %}

## Metaplex x402が提供するサービス {% #services-metaplex-x402-provides %}

Metaplex x402は、単一のベースURL`https://api.metaplex.com/x402`の下で、3つの有料サービスと2つの無料ディスカバリーエンドポイントを公開しています。

| サービス | エンドポイント | 支払い | 上流プロバイダー |
|---------|--------------|-------|---------------|
| チャット補完 | `POST /x402/chat/completions` | 有料 | AnthropicおよびOpenAIのモデル。`<provider>/<model>`形式で指定 |
| 画像生成 | `POST /x402/images/generations` | 有料 | OpenAI `gpt-image-1.5`および`gpt-image-2` |
| Solana RPCとDAS | `POST /x402/rpc` | 有料 | Solana JSON-RPC、HTTPのみ |
| モデル一覧 | `GET /x402/models` | 無料 | 利用可能なモデルID |
| 料金表 | `GET /x402/pricing` | 無料 | トークン単価、リクエスト最低額、RPCメソッド別価格 |

チャットと画像のエンドポイントは正規のOpenAIワイヤーフォーマットを話すため、OpenAI互換のクライアントであれば`baseURL`を変更して支払い対応の`fetch`を渡すだけで動作します。リクエストとレスポンスの詳細は[APIリファレンス](/agents/x402/api-reference)を参照してください。

## Mech: Metaplex x402を運用するエージェント {% #mech-the-agent-that-operates-metaplex-x402 %}

Mechは、x402サービスを販売するオンチェーンのMetaplexエージェントであり、USDCの支払いはMechのCoreウォレットに決済されます。Mech自身も[Asset Signer PDAウォレット](/smart-contracts/core/execute-asset-signing)を持つ[登録済みエージェント](/agents/what-is-an-agent)です — つまりエージェントがあなたのエージェントにサービスを販売しており、これは[エージェントコマース](/agents/agent-commerce)のモデルがエンドツーエンドで機能している姿です。

| 項目 | 値 |
|------|-----|
| エージェントアドレス | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| 公開ページ | [metaplex.com/agents/MECHjj…](https://www.metaplex.com/agents/MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF) |
| 決済アセット | USDC |

## クイックスタート {% #quick-start %}

クライアントをインストールし、支払い対応の`fetch`を使ってOpenAI SDKをMetaplex x402に向けます。この例は標準ウォレットから支払います。3つのモードすべては[支払いモードガイド](/agents/x402/payment-modes)で詳しく説明しています。

```sh {% title="クライアントとピア依存関係のインストール" %}
pnpm add @metaplex-foundation/x402 \
  @metaplex-foundation/umi \
  @solana/kit \
  @x402/core \
  @x402/fetch \
  @x402/svm \
  openai
```

```ts {% title="標準ウォレットからの有料チャット補完" %}
import { METAPLEX_X402_BASE_URL } from '@metaplex-foundation/x402';
import { createKeyPairSignerFromBytes, getBase58Encoder } from '@solana/kit';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';
import { ExactSvmScheme } from '@x402/svm/exact/client';
import OpenAI from 'openai';

// A Solana signer whose token account holds USDC.
const svmSigner = await createKeyPairSignerFromBytes(
  getBase58Encoder().encode(process.env.SVM_PRIVATE_KEY!),
);

const paymentClient = new x402Client();
paymentClient.register('solana:*', new ExactSvmScheme(svmSigner));

const openai = new OpenAI({
  // The OpenAI SDK requires a value, but this gateway authenticates by payment.
  apiKey: 'x402',
  baseURL: METAPLEX_X402_BASE_URL,
  fetch: wrapFetchWithPayment(fetch, paymentClient),
});

const completion = await openai.chat.completions.create({
  model: 'openai/gpt-5.4-mini',
  messages: [{ role: 'user', content: 'Say hi in one word.' }],
});
```

支払いはラップされた`fetch`の内部で行われ、あなたのコードには最終的なAPIレスポンスだけが見えます。

## 支払いモードの概要 {% #payment-modes-at-a-glance %}

Metaplex x402は3つの支払い方法をサポートしており、USDCの出所と所有者が署名する頻度が異なります。

| モード | 資金の出所 | 所有者の署名 | 適した用途 |
|-------|----------|------------|----------|
| **標準ウォレット** | 自分のウォレットのUSDCトークンアカウント | 支払いごと | アプリやスクリプトが自分自身として支払う場合 |
| **Coreアセットまたはエージェント（直接）** | アセットのシグナーPDAのトークンアカウント | 支払いごと | 所有者の監督下でアセットに独自の予算を持たせる場合 |
| **委任エージェント（即時）** | エージェントのシグナーPDAのトークンアカウント | 委任時に1回のみ | 監督なしで支払う自律エージェント |

委任はいつでも取り消せるオンチェーンの許可です。それぞれのセットアップ、コード、取り消し手順は[支払いモードガイド](/agents/x402/payment-modes)にあります。

## Metaplex x402のリクエスト課金の仕組み {% #how-metaplex-x402-prices-requests %}

Metaplex x402は推論を上流プロバイダーのトークン単価で、RPCをリクエスト単位で課金し、最新のレートカードを`GET /x402/pricing`で無料公開しています。

- **チャット補完** — 100万トークンあたりの単価で、入力・キャッシュ入力・出力それぞれに個別のレートがあり、1リクエストあたり`$0.001`の最低額が適用されます
- **画像生成** — 入力テキスト、入力画像、出力画像、出力テキストの4区分について100万トークンあたりで課金され、同じく`$0.001`の最低額が適用されます
- **Solana RPC** — デフォルトで1リクエストあたり`$0.00001`、`getSignaturesForAddress`のような重いメソッドは`$0.0001`など高いレートになります

{% callout type="note" title="実効的な価格表はライブエンドポイントです" %}
ドキュメントに掲載されたレートはスナップショットです。ライブサービスの`GET /x402/pricing`が実効的な価格表であり、支払いも署名も不要で、SDKでは`getPricing()`として公開されています。
{% /callout %}

## 注意事項 {% #notes %}

- 支払いはクラシックなSPL Tokenの関連トークンアカウントからUSDCで決済されます。Token-2022の支払いミントは現在サポートされていません。
- Coreアセットおよびエージェントの支払いモードでは、Core `execute`のトランザクション手数料をまかなうために、アセットシグナーPDAに少額のSOL残高が必要です。標準ウォレットの支払いにSOLは不要で、サービス側のフィーペイヤーがネットワーク手数料を負担します。
- x402のRPCエンドポイントはHTTPリクエストのみをサポートします。WebSocket接続とサブスクリプションはサポートされていません。
- ホストされたサーバーはオープンソースではありません。クライアント、そのサンプル、プロトコル型はApache-2.0で公開されています。
- 本サービスの利用は、[Metaplex.com利用規約](https://www.metaplex.com/terms-of-use)および[プライバシーポリシー](https://www.metaplex.com/privacy)への同意を意味します。

## クイックリファレンス {% #quick-reference %}

| 項目 | 値 |
|------|-----|
| APIベースURL | `https://api.metaplex.com/x402` |
| RPC URL | `https://api.metaplex.com/x402/rpc` |
| JSクライアント | `@metaplex-foundation/x402`（`0.1.0`） |
| ランタイム | Node.js 20.18+、ESM |
| 決済アセット | USDC（クラシックSPL Token） |
| 運用エージェント | `MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF` |
| ソース | [GitHub](https://github.com/metaplex-foundation/x402)（Apache-2.0） |

## FAQ {% #faq %}

Metaplex x402に関するよくある質問。

### Metaplex x402とは何ですか？ {% #what-is-metaplex-x402 %}
Metaplex x402は、LLM推論、画像生成、Solana RPCアクセスを販売するリクエスト課金型のHTTP APIです。APIキー、アカウント、サブスクリプションは不要で、各リクエストは[x402プロトコル](https://www.x402.org)を使ってSolana上でUSDC決済されます。x402は、HTTPの`402 Payment Required`ステータスを機械が支払い可能なフローに変えるプロトコルです。

### Metaplex x402を使うのにAPIキーやアカウントは必要ですか？ {% #do-i-need-an-api-key-or-an-account-to-use-metaplex-x402 %}
いいえ。支払いが認証そのものです。必要なのはUSDCを保有するSolanaウォレット、Coreアセット、または登録済みエージェントだけです。OpenAI SDKは空でない`apiKey`値を要求するため、例では文字列`'x402'`を渡していますが、ゲートウェイはこれを無視します。

### Mechとは何ですか？ {% #what-is-mech %}
Mechは、x402サービスを運用するオンチェーンのMetaplexエージェントです。支払いはMechのCoreウォレット — そのAsset Signer PDA — にUSDCで決済されます。Mechはあなたのエージェントやウォレットにサービスを販売するエージェントであり、アドレスは`MECHjj31U1hBapoVeJtZo5U5WGRd2293JEwRErvPTuF`です。

### Noriサービスエージェントのドキュメントはどうなりましたか？ {% #what-happened-to-the-nori-service-agent-documentation %}
Noriのページは、一般公開されることなく現在は保守されていない初期プロトタイプを説明したものでした。それを置き換えて実際にリリースされたサービスがMetaplex x402です。現在**Nori**という名称は[Metaplex AIコパイロット](https://www.metaplex.com/nori)を指しており、有料推論やRPCとは無関係の別プロダクトです。

### Metaplex x402の課金はSOLですか、USDCですか？ {% #does-metaplex-x402-charge-in-sol-or-usdc %}
USDCです。支払いはクラシックなSPL Tokenの関連トークンアカウントから行われ、Token-2022の支払いミントはサポートされていません。Coreアセットおよびエージェントの支払いモードでは、Core `execute`のトランザクション手数料をまかなうために、アセットシグナーPDAに少額のSOL残高も必要です。

### Metaplex x402のサーバーはオープンソースですか？ {% #is-the-metaplex-x402-server-open-source %}
クライアントはオープンソースです。TypeScriptクライアント、そのサンプル、プロトコル型は[github.com/metaplex-foundation/x402](https://github.com/metaplex-foundation/x402)にApache-2.0で公開されています。ホストされたサービスを動かすサーバーは現在公開されていません。

### 1回のリクエストの費用はどれくらいですか？ {% #how-much-does-a-request-cost %}
推論の料金は上流プロバイダーのトークン単価に準拠し、1リクエストあたり`$0.001`の最低額が適用されます。RPC呼び出しは`$0.00001`からのリクエスト単位課金で、負荷の重いメソッドには高いレートが設定されています。`GET /x402/pricing`は最新のレートを返し、無料で呼び出せます。

## 用語集 {% #glossary %}

Metaplex x402のドキュメント全体で使用される用語。

| 用語 | 定義 |
|------|------|
| **x402** | HTTPの`402 Payment Required`ステータスを利用して、ステーブルコインのマイクロペイメントをAPIのリクエスト/レスポンスサイクルの一部にするオープンプロトコル |
| **Metaplex x402** | 推論、画像生成、Solana RPCを販売する`https://api.metaplex.com/x402`のMetaplexホスト型x402サービス |
| **Mech** | Metaplex x402を運用し、USDCの支払いを受け取るオンチェーンのMetaplexエージェント |
| **Asset Signer PDA** | `["mpl-core-execute", asset]`から派生するMPL Core PDA。Coreアセットのオンチェーンウォレットであり、Coreの[Executeライフサイクルフック](/smart-contracts/core/execute-asset-signing)を通じて制御されます |
| **支払いモード** | どのアカウントが支払いを負担し、その所有者がどの頻度で署名するか — 標準ウォレット、Coreアセットまたはエージェントの直接支払い、委任エージェント |
| **実行委任** | リクエストごとの所有者署名なしに、Mechが登録済みエージェントのウォレットから支払いを承認できるようにする、取り消し可能なオンチェーン許可（`ExecutionDelegateRecordV1`） |
| **ファシリテーター** | リソースを返す前に、送信された支払いを検証してオンチェーンで決済するx402のコンポーネント |
| **DAS** | [Digital Asset Standard](/solana/rpcs-and-das)の読み取りAPI。x402のRPCエンドポイントからパススルーで利用できます |

---

Metaplex Foundationが管理。最終確認日: 2026-09-08。クライアントバージョン: `@metaplex-foundation/x402` `0.1.0`。[GitHubでソースを見る](https://github.com/metaplex-foundation/x402)。
