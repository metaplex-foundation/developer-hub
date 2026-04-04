---
title: エージェントのミント
metaTitle: エージェントのミント | Metaplex
description: Metaplex APIとmpl-agent-registry SDKを使用して、単一のトランザクションでオンチェーンAIエージェントを作成します。ホスト型APIがエージェントメタデータを保存し、署名して送信する未署名のトランザクションを返します。
keywords:
  - mint agent
  - agent registration
  - Metaplex API
  - mpl-agent-registry
  - mintAgent
  - mintAndSubmitAgent
  - Core asset
  - agent identity
  - Solana
about:
  - Agent Registration
  - Metaplex API
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Beginner
created: '03-27-2026'
updated: '03-27-2026'
howToSteps:
  - mpl-agent-registryをインストールし、Umiインスタンスを設定する
  - ウォレット、エージェント名、メタデータURI、agentMetadataを指定してmintAndSubmitAgentを呼び出す
  - Metaplex APIがメタデータを保存し、未署名のSolanaトランザクションを返す
  - トランザクションに署名して送信し、CoreアセットとエージェントIDをオンチェーンに登録する
howToTools:
  - Node.js
  - Umi framework
  - mpl-agent-registry SDK v0.2.0+
faqs:
  - q: mintAndSubmitAgentとmintAgentの違いは何ですか？
    a: mintAndSubmitAgentは、mintAgentを呼び出した後、1ステップでトランザクションに署名して送信するラッパーです。手動の署名制御、カスタムトランザクション送信者、または送信前にトランザクションを検査する必要がある場合は、mintAgentを直接使用してください。
  - q: Metaplex APIを経由したミントとregisterIdentityV1を直接使用することの違いは何ですか？
    a: Metaplex APIのフロー（mintAgent / mintAndSubmitAgent）は、単一のトランザクションでCoreアセットとエージェントIDの両方を作成します。既存のアセットは必要ありません。registerIdentityV1のアプローチは、既に所有しているCoreアセットにIDプラグインをアタッチします。
  - q: mintAndSubmitAgentを呼び出す前にCoreアセットを作成する必要がありますか？
    a: いいえ。APIは1つのトランザクションでCoreアセットの作成とエージェントIDの登録を同時に行います。必要なのはウォレットアドレス、エージェント名、メタデータURI、agentMetadataオブジェクトだけです。
  - q: uriフィールドとagentMetadataの違いは何ですか？
    a: uriはCoreアセットのオンチェーンメタデータに直接保存されます。通常のNFTと同様に、公開ホストされたJSONファイルを指す必要があります。agentMetadataオブジェクトはMetaplex APIに送信され、エージェントレコードとともにオフチェーンに保存されます。どちらもミント時に設定されます。
  - q: メインネットに移行する前にdevnetでテストできますか？
    a: はい。入力にnetwork "solana-devnet"を渡し、UmiインスタンスをSolana devnet RPCエンドポイントに向けてください。
  - q: APIがトランザクションを返したが、送信がオンチェーンで失敗した場合はどうなりますか？
    a: オンチェーンのトランザクション失敗は、CoreアセットとエージェントIDが登録されていないことを意味します。mintAgentを再度呼び出して新しいブロックハッシュで新しいトランザクションを取得し、再試行してください。
  - q: Metaplex APIはどのネットワークをサポートしていますか？
    a: Solanaメインネット、Solana Devnet、Localnet、Eclipseメインネット、Sonicメインネット、Sonic Devnet、Fogoメインネット、Fogoテストネットをサポートしています。
  - q: エージェントのミントにはいくらかかりますか？
    a: ミントには標準のSolanaトランザクション手数料に加え、CoreアセットアカウントとAgent Identity PDAのレント代がかかります。Metaplex APIによるミントに追加のプロトコル手数料はありません。
---

Metaplex APIと`mpl-agent-registry` SDKを使用して、単一の呼び出しでオンチェーンにAIエージェントを登録します。 {% .lead %}

## Summary

Metaplex APIは、エージェントメタデータを保存し、未署名のSolanaトランザクションを返すホスト型エンドポイントを提供します。そのトランザクションに署名して送信することで、エージェントを表す[MPL Core](/core)アセットが作成され、単一のアトミック操作で[Agent Identity](/smart-contracts/mpl-agent/identity) PDAが登録されます。

- **作成** — MPL CoreアセットとAgent Identity PDAを1つのトランザクションで同時に作成。既存のアセットは不要
- **ホスト型API** — `https://api.metaplex.com` がメタデータの保存を担当。ミント前の個別アップロード不要
- **2つのSDK関数** — ワンコールフローには `mintAndSubmitAgent`、手動署名制御には `mintAgent`
- **マルチネットワーク** — Solanaメインネット・devnet、Eclipse、Sonic、Fogoをサポート
- **必要要件** — `@metaplex-foundation/mpl-agent-registry` v0.2.0+

{% callout title="作成するもの" %}
Metaplex APIと`mpl-agent-registry` SDKを使用して作成した、Agent Identity PDAにリンクされたMPL CoreアセットであるオンチェーンAIエージェント。
{% /callout %}

## クイックスタート

1. [フローの理解](#how-it-works)
2. [SDKのインストール](#installation)
3. [Umiインスタンスの設定](#umi-setup)
4. [ワンコールでのミントと登録](#mint-and-submit-an-agent)
5. [結果の確認](#verify-the-result)

## How It Works

Metaplex APIを通じたエージェントのミントは、SDKによって調整される3ステップのフローです。

1. **APIコール** — SDKがエージェントの詳細を `https://api.metaplex.com` の `POST /v1/agents/mint` に送信します。APIは `agentMetadata` をオフチェーンに保存し、未署名のSolanaトランザクションを構築します。
2. **未署名トランザクションの返却** — APIはトランザクションに署名せずに返します。秘密鍵は環境外に出ることはありません。APIは命令セットを構築するだけです。
3. **署名と送信** — あなた（または `mintAndSubmitAgent` が自動的に）キーペアでトランザクションに署名してネットワークに送信します。オンチェーンでは、これにより単一のアトミック操作でCoreアセットが作成されAgent Identity PDAが登録されます。

### 2つのフィールド、2つの保存先

`mintAndSubmitAgent` または `mintAgent` を呼び出す際に、2つの異なるメタデータを提供します。

| フィールド | 保存先 | 目的 |
|----------|--------|------|
| `uri` | オンチェーン（Coreアセットのメタデータ内） | 公開ホストされたJSONファイルを指します。標準的なCoreアセットのURIと同様に機能します。 |
| `agentMetadata` | オフチェーン（Metaplex APIが保存） | エージェントの機能、サービス、信頼モデルを記述します。レジストリによって検索用にインデックスされます。 |

どちらもミント時に設定され、エージェントを更新せずに独立して変更することはできません。

{% callout type="note" %}
このガイドでは、新しいCoreアセットの作成とエージェントIDの登録を1つのトランザクションで行います。既にCoreアセットをお持ちで、IDをアタッチするだけの場合は、代わりに[`registerIdentityV1`](/agents/register-agent)を使用してください。
{% /callout %}

## Prerequisites

ミントの前に以下が必要です。

- Node.js 18以降
- 資金のあるSolanaウォレットキーペア（このウォレットがトランザクション費用を支払い、エージェントのオーナーになります）
- CoreアセットのNFTメタデータJSON用の公開アクセス可能な `uri`

## Installation

3つの必要なパッケージをインストールします：Agent Registry SDK、コアUmiフレームワーク、RPCクライアントとトランザクション送信者を提供するデフォルトUmiバンドル。

```bash {% title="Terminal" %}
npm install @metaplex-foundation/mpl-agent-registry @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

## Umi Setup

[Umi](/umi)はSolanaプログラムとのやり取りに使用するMetaplexのJavaScriptフレームワークです。SDK関数を呼び出す前に、RPCエンドポイントとキーペアで設定してください。

`mplAgentIdentity()` プラグインは、Agent Identityプログラムの命令ビルダーとアカウントデシリアライザーをUmiインスタンスに登録します。これがないと、UmiはAgent Identityプログラムの命令を構築または読み取ることができません。

```typescript {% title="setup.ts" %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';
import { mplAgentIdentity } from '@metaplex-foundation/mpl-agent-registry';

// 優先するRPCにUmiを向ける
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplAgentIdentity());

// キーペアを読み込む（このウォレットがトランザクション費用を支払い、エージェントのオーナーになる）
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

上記の例では `keypairIdentity` を使用しています（生の秘密鍵をUmiに直接読み込む方法）。これはサーバーサイドスクリプトやバックエンド統合の標準的なアプローチです。Umiは環境に応じて他の2つのIDパターンもサポートしています。

| アプローチ | 方法 | 最適な用途 |
|-----------|------|-----------|
| **生のキーペア**（この例） | `keypairIdentity` + `createKeypairFromSecretKey` | サーバーサイドスクリプト、バックエンド |
| **ファイルシステムウォレット** | `createSignerFromKeypair` + `signerIdentity`（JSONキーファイル使用） | ローカル開発とCLIツール |
| **ブラウザウォレットアダプター** | `umi-signer-wallet-adapters` の `walletAdapterIdentity` | Phantom、BackpackなどのウェブdApp |

各アプローチの完全なコード例（ファイルシステムキーペアの読み込み方法やウォレットアダプターの接続方法を含む）については、Umiドキュメントの[ウォレットの接続](/dev-tools/umi/getting-started#connecting-a-wallet)を参照してください。

## Mint and Submit an Agent

`mintAndSubmitAgent` はMetaplex APIを呼び出し、返されたトランザクションに署名し、1ステップでネットワークに送信します。ほとんどの統合にはこれを使用してください。

{% code-tabs-imported from="agents/mint_and_submit" frameworks="umi" filename="mintAndSubmitAgent" /%}

## Mint an Agent with Manual Signing

`mintAgent` はトランザクションを送信せずに未署名のまま返します。優先手数料の追加、ハードウェアウォレットの使用、カスタムリトライロジックの統合が必要な場合に使用してください。

{% code-tabs-imported from="agents/mint_manual" frameworks="umi" filename="mintAgent" /%}

## Verify the Result

ミント後、CoreアセットをフェッチしてAgentIdentityプラグインを確認することで、エージェントIDが登録されたことを確認します。登録が成功すると、Transfer、Update、Executeのライフサイクルフックがアタッチされます。これらが確認すべきシグナルです。

{% code-tabs-imported from="agents/verify" frameworks="umi" filename="verifyRegistration" /%}

`agentIdentities` が undefined または空の場合、IDは登録されていません。トランザクションがサイレントに失敗したか、確認されなかった可能性があります。再試行する前に、オンチェーンでトランザクション署名を確認してください。

## Agent Metadata Fields

`agentMetadata` オブジェクトはMetaplex APIに送信され、エージェントレコードとともにオフチェーンに保存されます。Coreアセットの `uri`（NFTメタデータファイル）とは別物です。詳細は[How It Works](#how-it-works)を参照してください。

| フィールド | 型 | 必須 | 説明 |
|----------|-----|------|------|
| `type` | `string` | はい | スキーマ識別子。`'agent'` を使用してください。 |
| `name` | `string` | はい | エージェントの表示名 |
| `description` | `string` | はい | エージェントの機能と操作方法 |
| `services` | `AgentService[]` | いいえ | エージェントが公開するサービスエンドポイント |
| `registrations` | `AgentRegistration[]` | いいえ | 外部レジストリエントリへのリンク |
| `supportedTrust` | `string[]` | いいえ | サポートする信頼メカニズム（例：`'tee'`、`'reputation'`） |

### Agent Service フィールド

`services` の各エントリはエージェントとのやり取りの1つの方法を説明します。

| フィールド | 型 | 必須 | 説明 |
|----------|-----|------|------|
| `name` | `string` | はい | サービスタイプ（例：`'trading'`、`'chat'`、`'MCP'`、`'A2A'`） |
| `endpoint` | `string` | はい | サービスにアクセスできるURL |

## Supported Networks

入力オブジェクトで `network` の値を渡します。省略した場合は `'solana-mainnet'` がデフォルトになります。選択したネットワークにUmiのRPCエンドポイントが一致していることを確認してください。

| ネットワーク | `network` の値 |
|------------|----------------|
| Solanaメインネット | `solana-mainnet`（デフォルト） |
| Solana Devnet | `solana-devnet` |
| Localnet | `localnet` |
| Eclipseメインネット | `eclipse-mainnet` |
| Sonicメインネット | `sonic-mainnet` |
| Sonic Devnet | `sonic-devnet` |
| Fogoメインネット | `fogo-mainnet` |
| Fogoテストネット | `fogo-testnet` |

## Devnet Testing

メインネットに移行する前にSolana devnetで統合をテストします。UmiインスタンスをdevnetのRPCに向け、`network: 'solana-devnet'` を渡すことで、APIがdevnetクラスターにエージェントを登録します。devnetでミントされたエージェントはメインネットとは別のアセットアドレスを持ち、メインネットのエクスプローラーには表示されません。

{% code-tabs-imported from="agents/devnet" frameworks="umi" filename="devnetTest" /%}

## Custom API Base URL

設定引数（`mintAgent` または `mintAndSubmitAgent` の2番目のパラメーター）に `baseUrl` を渡すことで、ステージングまたはセルフホスト型APIをターゲットにできます。非本番環境に統合する場合に使用してください。

{% code-tabs-imported from="agents/custom_api_url" frameworks="umi" filename="customApiUrl" /%}

## Custom Transaction Sender

`mintAndSubmitAgent` の4番目の引数として `txSender` 関数を渡すことで、独自の署名・送信インフラを使用できます。Jitoバンドルチップ、優先手数料、カスタム確認ポーリングを追加する場合に適しています。

{% code-tabs-imported from="agents/custom_sender" frameworks="umi" filename="customSender" /%}

## Error Handling

SDKは型付きエラーガードをエクスポートしており、汎用エラーをキャッチするのではなく、各障害モードを明示的に処理できます。

{% code-tabs-imported from="agents/error_handling" frameworks="umi" filename="errorHandling" /%}

## Common Errors

最も頻繁な障害モードとその解決方法です。

| エラー | 原因 | 対処法 |
|--------|------|--------|
| `isAgentValidationError` | 必須の入力フィールドが欠落または不正な形式 | `err.field` を確認し、必須の `agentMetadata` フィールドがすべて提供されていることを確認してください |
| `isAgentApiNetworkError` | APIエンドポイントに到達できない | ネットワーク接続を確認し、`err.cause` で根本的なエラーを調べてください |
| `isAgentApiError` | APIが2xx以外のステータスを返した | `err.statusCode` と `err.responseBody` を確認し、`uri` が公開アクセス可能であることを確認してください |
| ブロックハッシュ期限切れ | ブロックハッシュが期限切れになる前にトランザクションが送信されなかった | `mintAgent` を再度呼び出して新しいトランザクションを取得し、送信を再試行してください |
| ミント後に `agentIdentities` が空 | トランザクション確認済みだがIDプラグインがアタッチされていない | トランザクションレシートを確認し、成功したか確認してください。サイレントに失敗した場合は、ミント全体を再試行してください |

## Full Example

設定、ミント、確認を含む完全なエンドツーエンドのスニペットです。コピーしてすぐに実行できます。

{% code-tabs-imported from="agents/full_example" frameworks="umi" filename="fullExample" /%}

## Notes

- `mintAndSubmitAgent` は呼び出しのたびに新しいCoreアセットを作成します。重複排除はありません。同じ入力で2回呼び出すと、2つの別々のエージェントが2つの異なるアセットアドレスに作成されます。
- `uri` フィールドはCoreアセットのオンチェーンメタデータに保存され、公開アクセス可能なJSONドキュメントを指す必要があります。ホスト済みのメタデータURIがない場合は、まずファイルをArweaveや他の永続ストレージプロバイダーにアップロードしてください。
- 新しいCoreアセットを作成せずに既存のCoreアセットにエージェントIDをアタッチするには、代わりに[`registerIdentityV1`](/agents/register-agent)を使用してください。
- Metaplex APIのベースURLはデフォルトで `https://api.metaplex.com` です。APIキーは不要です。
- ミントには標準のSolanaトランザクション手数料とCoreアセットアカウントおよびAgent Identity PDAのレント代がかかります。
- `@metaplex-foundation/mpl-agent-registry` v0.2.0+が必要です。

## FAQ

### `mintAndSubmitAgent` と `mintAgent` の違いは何ですか？
`mintAndSubmitAgent` は `mintAgent` を呼び出した後、1ステップでトランザクションに署名して送信するラッパーです。手動の署名制御、カスタムトランザクション送信者、または送信前にトランザクションを検査する必要がある場合は、`mintAgent` を直接使用してください。

### Metaplex APIを経由したミントと `registerIdentityV1` を直接使用することの違いは何ですか？
Metaplex APIのフロー（`mintAgent` / `mintAndSubmitAgent`）は、単一のトランザクションでCoreアセット**と**エージェントIDの両方を作成します。既存のCoreアセットは不要です。[`registerIdentityV1`](/agents/register-agent)のアプローチは、既に所有しているMPL CoreアセットにIDプラグインをアタッチします。

### `uri` フィールドと `agentMetadata` の違いは何ですか？
`uri` はCoreアセットのオンチェーンメタデータに直接保存されます。通常のNFTと同様に、公開ホストされたJSONファイルを指す必要があります。`agentMetadata` オブジェクトはMetaplex APIに送信され、エージェントレコードとともにオフチェーンに保存されます。どちらもミント時に設定されます。詳細は[How It Works](#how-it-works)を参照してください。

### `mintAndSubmitAgent` を呼び出す前にCoreアセットを作成する必要がありますか？
いいえ。APIはCoreアセットの作成とエージェントIDの登録を同時に行います。必要なのはウォレットアドレス、エージェント名、メタデータURI、`agentMetadata` オブジェクトだけです。

### メインネットに移行する前にdevnetでテストできますか？
はい。入力に `network: 'solana-devnet'` を渡し、Umiインスタンスを `https://api.devnet.solana.com` に向けてください。

### APIがトランザクションを返したが、送信がオンチェーンで失敗した場合はどうなりますか？
オンチェーンのトランザクション失敗は、CoreアセットとエージェントIDが登録されていないことを意味します。`mintAgent` を再度呼び出して新しいブロックハッシュで新しいトランザクションを取得し、再試行してください。

### Metaplex APIはどのネットワークをサポートしていますか？
Solanaメインネット、Solana Devnet、Localnet、Eclipseメインネット、Sonicメインネット、Sonic Devnet、Fogoメインネット、Fogoテストネット。渡す正確な値については[Supported Networks](#supported-networks)を参照してください。

### エージェントのミントにはいくらかかりますか？
ミントには標準のSolanaトランザクション手数料とCoreアセットアカウントおよびAgent Identity PDAのレント代がかかります。Metaplex APIによるミントに追加のプロトコル手数料はありません。
