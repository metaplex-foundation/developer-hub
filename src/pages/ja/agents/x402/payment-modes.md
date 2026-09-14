---
title: Metaplex x402の支払いモード
metaTitle: Metaplex x402の支払いモード - ウォレット、Coreアセット、委任エージェント | Metaplex
description: Metaplex x402の3つの支払いモード（標準Solanaウォレット、Coreアセットまたはエージェントによる直接支払い、リクエストごとの署名なしで支払う委任エージェント）を設定します。委任の承認、取り消し、よくあるエラーも解説します。
keywords:
  - x402 payment modes
  - delegated agent payments
  - Core asset payments
  - execution delegation
  - x402 client setup
  - agent wallet USDC
about:
  - Metaplex x402
  - Agent Commerce
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
programmingLanguage:
  - TypeScript
created: '09-08-2026'
updated: '09-08-2026'
howToTools:
  - "@metaplex-foundation/x402"
  - Node.js 20.18+
  - USDCを保有するSolanaウォレット、Coreアセット、または登録済みエージェント
howToSteps:
  - x402クライアントと、選択したSolanaツールキット向けのピアパッケージをインストールします。
  - 支払い元アカウントにUSDCを入金します。Coreアセットおよびエージェントのモードではシグナー PDAにSOLも必要です。
  - 選択したモードに対応する支払いスキームを登録して、支払い対応のfetchを構築します。
  - 委任エージェントの場合は、approveMetaplexCoreExecuteDelegateでオンチェーンの実行委任を1回だけ承認します。
  - 支払い対応のfetchを任意のHTTPクライアントに渡して、有料リクエストを実行します。
faqs:
  - q: Metaplex x402ではどの支払いモードを使うべきですか？
    a: アプリが自分自身として支払う場合は標準ウォレット、所有者の監督下でアセットに独自の予算を持たせたい場合はCoreアセットまたはエージェントの直接支払い、自律エージェントが人間の署名なしにリクエストごとに支払う必要がある場合は委任エージェントを使います。
  - q: Metaplex x402のリクエストを支払うのにSOLは必要ですか？
    a: 必要なのはCoreアセットおよびエージェントの支払いモードだけで、その場合はCore executeのトランザクション手数料をまかなうためにアセットシグナー PDAにSOLが必要です。標準ウォレットの支払いにSOLは不要で、支払いトランザクションのネットワーク手数料はサービス側のフィーペイヤーが負担します。
  - q: 委任エージェントの認証トークンの有効期間はどれくらいですか？
    a: 認可JWTは24時間で失効します。失効したトークンは破棄され自動的に置き換えられます。置き換えに必要なのはメッセージ署名だけで、オンチェーンの委任承認を再度行う必要はありません。
  - q: リアクティブ拡張とプロアクティブなfetchラッパーは併用できますか？
    a: いいえ。両者は代替関係にあり、組み合わせるとフローが壊れます。すでにx402Clientを運用している場合や直接支払いへのフォールバックを任意で使いたい場合はリアクティブなクライアント拡張を、Metaplexのエンドポイントのみを対象に最もシンプルに配線したい場合はプロアクティブなfetchラッパーを使ってください。
  - q: 委任エージェントによる支払いを止めるにはどうすればいいですか？
    a: 承認時と同じ署名者、アセット、RPCオプションでrevokeMetaplexCoreExecuteDelegateを呼び出します。委任はオンチェーンの許可なので、取り消しはオンチェーンで有効になり、サーバーはエージェントのウォレットから支払いを構築できなくなります。
  - q: Token-2022のUSDCや他のステーブルコインで支払えますか？
    a: いいえ。支払い元は常にクラシックなSPL Tokenの関連トークンアカウントであり、Token-2022の支払いミントは現在サポートされていません。
---

Metaplex x402は3つの支払いモード — 標準Solanaウォレット、[Coreアセット](/ja/smart-contracts/core)または[エージェント](/ja/agents/what-is-an-agent)による直接支払い、リクエストごとの署名なしで支払う委任エージェント — をサポートします。どのモードでも生成されるものは同じで、すでに使っているHTTPクライアントに渡せる支払い対応の`fetch`です。{% .lead %}

## 概要 {% #summary %}

支払いモードを選ぶということは、どのアカウントのUSDCでリクエストを支払い、その所有者がどの頻度で署名するかを決めることです。最初の2つのモードは登録する支払いスキームが違うだけですが、委任されたエージェントではさらに認証トークンストアと、クライアント拡張またはfetchラッパーのいずれかが必要です。`fetchWithPayment`さえ用意できれば、その後のリクエストコードは3つのモードすべてで同一です。

- **標準ウォレット** — `ExactSvmScheme`を使う素のx402。所有者が支払いごとに署名し、SOLは不要です
- **Coreアセットまたはエージェント（直接）** — `coreExecute`ターゲットを指定した`MetaplexSvmExactScheme`。資金はアセットのシグナーPDAから出ますが、所有者は引き続き支払いごとに署名します
- **委任エージェント（即時）** — 1回限りのオンチェーン許可により、Mechがエージェントのウォレットから支払いを承認できるようになります。クライアントはメッセージ署名で認証します
- **いつでも取り消し可能** — 委任はオンチェーンの許可なので、取り消しはポリシーではなくオンチェーンで支払いを停止します

{% callout type="note" title="このガイドで構築するもの" %}
このガイドを終えると、各リクエストの支払いを透過的に処理する`fetchWithPayment`関数が、支出させたいアカウントに紐づけられた状態で手に入ります。このページのすべてのレシピが、同じこの関数を生成します。
{% /callout %}

## 前提条件 {% #prerequisites %}

Metaplex x402には、資金を入れたSolanaアカウントと、支払いトランザクションを構築できる署名者が必要です。

- Node.js 20.18+ とESMプロジェクト
- Solanaの署名者 — [Solana Kit](https://github.com/anza-xyz/kit)のキーペア署名者または[Umi](/ja/dev-tools/umi)の署名者
- 支払い元アカウントのクラシックなSPL Token関連トークンアカウントにあるUSDC
- Coreアセットおよびエージェントのモードでは、その署名者が所有するCoreアセットと、そのシグナーPDA内のSOL
- 委任エージェントのモードでは、[登録済みのエージェントアイデンティティ](/ja/agents/register-agent) — [新しいエージェントをミント](/ja/agents/mint-agent)するか、既存のCoreアセットを登録します

{% callout type="warning" title="ブラウザのコードに秘密鍵を埋め込まないでください" %}
以下の例は開発用キーペアを環境変数から読み込みます。ブラウザではウォレットアダプターの署名者を使ってください — クライアントに配信された秘密鍵は、公開された秘密鍵と同じです。
{% /callout %}

## クイックスタート {% #quick-start %}

クライアントをインストールし、支払い元アカウントに入金してから、選択したモードのスキームを登録します。

```sh {% title="クライアントとピア依存関係のインストール" %}
pnpm add @metaplex-foundation/x402 \
  @metaplex-foundation/umi \
  @solana/kit \
  @x402/core \
  @x402/fetch \
  @x402/svm
```

続いて、使用するクライアントを追加します。

| クライアント | インストール |
|------------|------------|
| OpenAI SDK | `pnpm add openai` |
| Vercel AI SDK | `pnpm add ai @ai-sdk/openai-compatible` |
| Solana web3.js | `pnpm add @solana/web3.js` |

各モードへ移動: [標準ウォレット](#pay-with-a-standard-solana-wallet) · [Coreアセットまたはエージェント](#pay-directly-with-a-core-asset-or-agent) · [委任エージェント](#pay-instantly-with-a-delegated-agent)。

## 支払いモード別の資金要件 {% #funding-requirements-by-payment-mode %}

各モードは異なるアカウントからUSDCを引き出し、SOLが必要なのはCore `execute`を使うモードだけです。

| 支払いモード | USDCの出所 | SOLの要否 |
|------------|----------|----------|
| 標準ウォレット | そのウォレットのUSDCトークンアカウント | 不要 — ネットワーク手数料はサービス側のフィーペイヤーが負担 |
| Coreアセットまたはエージェント（直接・委任） | アセットシグナーPDAのUSDCトークンアカウント | Core `execute`手数料のためシグナーPDAに必要 |

支払い元は常にクラシックなSPL Tokenの関連トークンアカウントです。Token-2022の支払いミントは現在サポートされていません。

## 標準Solanaウォレットで支払う {% #pay-with-a-standard-solana-wallet %}

自分が直接管理するウォレットから支払うには、`@x402/svm`の`ExactSvmScheme`を登録します。これは素のx402であり、Metaplexのクライアントが加えているのはエンドポイント定数とディスカバリーヘルパーだけです。

```ts {% title="標準ウォレットでの支払い" %}
import { createKeyPairSignerFromBytes, getBase58Encoder } from '@solana/kit';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';
import { ExactSvmScheme } from '@x402/svm/exact/client';

const svmSigner = await createKeyPairSignerFromBytes(
  getBase58Encoder().encode(process.env.SVM_PRIVATE_KEY!),
);

const paymentClient = new x402Client();
paymentClient.register('solana:*', new ExactSvmScheme(svmSigner));

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

## Coreアセットまたはエージェントで直接支払う {% #pay-directly-with-a-core-asset-or-agent %}

所有者が引き続き支払いごとに署名しつつ、Coreアセット自身のウォレットから資金を出すには、`coreExecute`ターゲットを指定した`MetaplexSvmExactScheme`を登録します。すべてのCoreアセットは組み込みのウォレット — [Asset Signer PDA](/ja/smart-contracts/core/execute-asset-signing) — を持っているため、そのウォレットに入金すればメインウォレットと支出を分離でき、所有権が移転すれば予算もアセットとともに移動します。

```ts {% title="Coreアセットまたはエージェントによる直接支払い" %}
import { MetaplexSvmExactScheme } from '@metaplex-foundation/x402';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';

const paymentClient = new x402Client();
paymentClient.register(
  'solana:*',
  new MetaplexSvmExactScheme(svmSigner, {
    rpcUrl: svmRpcUrl,
    coreExecute: {
      asset: coreAssetAddress,
    },
  }),
);

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

`svmSigner`はアセットを管理する署名者、`svmRpcUrl`は支払いトランザクションの構築に使うSolana RPCエンドポイント、`coreAssetAddress`はCoreアセットまたはエージェントのアドレスです。

{% callout type="note" title="コレクションに属するアセットにはコレクションアドレスが必要です" %}
アセットがCoreコレクションに属している場合は`coreExecute.collection`を渡してください。すべてのオプションは[スキームオプションの表](/ja/agents/x402/api-reference#metaplexsvmexactscheme-options)にあります。
{% /callout %}

## 委任エージェントで即時に支払う {% #pay-instantly-with-a-delegated-agent %}

エージェントをMechに1回委任しておけば、サーバーはリクエストごとの所有者署名なしにエージェントのウォレットから支払いを承認できます。自律エージェントや高頻度のワークロードに適したモードです。

エージェントは、承認する署名者が所有する[登録済みのエージェントアイデンティティ](/ja/agents/register-agent)である必要があります。委任後、クライアントはSign-In-With-Xのメッセージ署名で認証して24時間有効なベアラートークンを受け取り、サーバーがエージェントのウォレットから支払いを構築します。この委任はいつでも取り消せるオンチェーンの許可です。

### 委任を1回だけ承認する {% #approve-the-delegation-once %}

繰り返し実行してもトランザクションを再送しないよう、承認前に現在のステータスを確認します。

```ts {% title="1回限りの委任承認" %}
import {
  approveMetaplexCoreExecuteDelegate,
  fetchMetaplexCoreExecuteDelegateStatus,
} from '@metaplex-foundation/x402';

const status = await fetchMetaplexCoreExecuteDelegateStatus(coreAssetAddress);

if (!status.isDelegated) {
  await approveMetaplexCoreExecuteDelegate(svmSigner, coreAssetAddress, {
    rpcUrl: svmRpcUrl,
  });
}
```

### リアクティブとプロアクティブの統合スタイルを選ぶ {% #choose-a-reactive-or-proactive-integration-style %}

リアクティブとプロアクティブの統合は代替関係にあります — どちらか一方だけを使い、併用しないでください。

| スタイル | 認証の方法 | 選ぶ基準 |
|---------|----------|---------|
| **リアクティブ** | クライアント拡張。最初の`402`レスポンスが認証を駆動し、サーバーの動的な支払い要件を保持します | すでに他の有料サービスと並行して`x402Client`を運用している場合、または直接支払いへのフォールバックを任意で使いたい場合 |
| **プロアクティブ** | リソースリクエストの前に認証する`fetch`ラッパー。`402`の往復は表に出ません | Metaplexのエンドポイントのみを対象に、最もシンプルに配線したい場合 |

以下のどちらのスニペットでも、`solanaSigner`は認証に使うメッセージ署名可能なSolana署名者です。Solana Kitのキーペア署名者が使えます。

```ts {% title="リアクティブな委任エージェントの支払い" %}
import {
  createMetaplexCoreExecuteDelegateClientExtension,
  InMemoryMetaplexCoreExecuteDelegateAuthTokenStore,
  MetaplexSvmExactScheme,
} from '@metaplex-foundation/x402';
import { x402Client } from '@x402/core/client';
import { wrapFetchWithPayment } from '@x402/fetch';

const authTokenStore = new InMemoryMetaplexCoreExecuteDelegateAuthTokenStore();
const paymentClient = new x402Client();

paymentClient.register(
  'solana:*',
  new MetaplexSvmExactScheme(svmSigner, { rpcUrl: svmRpcUrl }),
);
paymentClient.registerExtension(
  createMetaplexCoreExecuteDelegateClientExtension({
    signer: solanaSigner,
    asset: coreAssetAddress,
    authTokenStore,
  }),
);

const fetchWithPayment = wrapFetchWithPayment(fetch, paymentClient);
```

```ts {% title="プロアクティブな委任エージェントの支払い" %}
import {
  InMemoryMetaplexCoreExecuteDelegateAuthTokenStore,
  wrapFetchWithMetaplexCoreExecuteDelegate,
} from '@metaplex-foundation/x402';

const authTokenStore = new InMemoryMetaplexCoreExecuteDelegateAuthTokenStore();

const fetchWithPayment = wrapFetchWithMetaplexCoreExecuteDelegate(fetch, {
  signer: solanaSigner,
  asset: coreAssetAddress,
  authTokenStore,
});
```

プロアクティブなスタイルでも委任の承認は必要で、他のオリジンへのリクエストはそのまま素通りします。

### 認証トークンの保存と失効の扱い {% #store-auth-tokens-and-handle-expiry %}

認可JWTは24時間で失効し、クライアントはオンチェーンの再承認ではなくメッセージ署名によって自動的に置き換えます。

- Node.jsでは`InMemoryMetaplexCoreExecuteDelegateAuthTokenStore`を、ブラウザ専用のコードでは`LocalStorageMetaplexCoreExecuteDelegateAuthTokenStore`を使ってください
- それ以外のストレージバックエンドを使う場合は`MetaplexCoreExecuteDelegateAuthTokenStore`インターフェースを実装します
- リアクティブな直接支払いフォールバックは既定で無効です。登録済みの支払いスキームに委任失敗を処理させたい場合にのみ`fallback: true`を設定してください
- 認証、キャッシュ、フォールバックの挙動を観察するには`onEvent`を渡します

{% callout type="warning" title="認可トークンはベアラー資格情報です" %}
`LocalStorageMetaplexCoreExecuteDelegateAuthTokenStore`はJWTをブラウザから読み取れるストレージに保持するため、オリジンでXSSが発生すると、トークンが失効するか委任が取り消されるまで、攻撃者がそれを読み取って委任を使って支払える状態になります。トークンがページの再読み込みをまたいで残る必要が本当にない限り`InMemoryMetaplexCoreExecuteDelegateAuthTokenStore`を使い、エージェントのウォレットには必要な分だけを入れ、委任が不要になったらすぐに`revokeMetaplexCoreExecuteDelegate`を呼び出してください。
{% /callout %}

### 委任を取り消す {% #revoke-the-delegation %}

承認時と同じ署名者、アセット、RPCオプションで`revokeMetaplexCoreExecuteDelegate`を呼び出します。

```ts {% title="委任の取り消し" %}
import { revokeMetaplexCoreExecuteDelegate } from '@metaplex-foundation/x402';

await revokeMetaplexCoreExecuteDelegate(svmSigner, coreAssetAddress, {
  rpcUrl: svmRpcUrl,
});
```

この許可はオンチェーンに存在するため、取り消すとサーバーはエージェントのウォレットから支払いを構築できなくなります — サービス側が善意で従うポリシーではありません。

## よくあるエラー {% #common-errors %}

支払いの構築に失敗する原因は、ほぼ必ず資金、ネットワークの不一致、委任の状態のいずれかに行き着きます。

| 症状 | 原因 | 対処 |
|------|------|------|
| 支払いの構築に失敗する | 支払い元アカウントに支払いミントのUSDCがない | ウォレット、Coreアセット、またはエージェントのシグナーPDAにUSDCを入金する |
| Core `execute`の支払いが失敗する | アセットシグナーPDAにトランザクション手数料用のSOLがない | アセットシグナーPDAにSOLを送る |
| 支払いがネットワーク違いとして拒否される | `SVM_RPC_URL`が`402`レスポンスの宣言するネットワークと異なる | `402`レスポンスが宣言するネットワークにRPC URLを合わせる |
| Coreアセットの署名が拒否される | そのアセットは渡した署名者が管理していない | Coreアセットを所有する署名者を渡す |
| 委任支払いがフォールバックまたは失敗する | アセットが登録済みエージェントアイデンティティでない、または委任が未承認 | `fetchMetaplexCoreExecuteDelegateStatus()`が`isDelegated: true`を返すことを確認する |
| 認証がループする、二重払いが起きる | リアクティブ拡張とプロアクティブラッパーを併用している | 統合スタイルはどちらか一方のみを使う |

## 検証済みの構成 {% #tested-configuration %}

| パッケージ | バージョン |
|-----------|----------|
| `@metaplex-foundation/x402` | `0.1.0` |
| Node.js | 20.18+（ESM） |
| 支払いミント | USDC（クラシックSPL Token） |

## 注意事項 {% #notes %}

- `MetaplexSvmExactScheme`はUmiの署名者とSolana Kitのパーシャルトランザクション署名者を受け付けますが、sign-and-send署名者は受け付けません。Kitの署名者は内部で変換されます。
- サービス・クライアント・支払いモードのすべての組み合わせについて、実行可能なサンプルが[x402リポジトリ](https://github.com/metaplex-foundation/x402/tree/main/examples)にあり、`pnpm example:<name>`で実行できます。
- 委任エージェントのサンプルは、初回実行時に承認トランザクションを送信する場合があります。
- 委任は、リクエストの支払いのためにエージェントのウォレットからUSDCを動かす権限をMechに与えます。シグナーPDAには運用に必要な残高だけを置き、エージェントを使わないときは取り消してください。

## クイックリファレンス {% #quick-reference %}

| 項目 | 値 |
|------|-----|
| 標準ウォレットのスキーム | `ExactSvmScheme`（`@x402/svm`） |
| Coreアセット・エージェントのスキーム | `MetaplexSvmExactScheme` |
| 委任ヘルパー | `fetchMetaplexCoreExecuteDelegateStatus`、`approveMetaplexCoreExecuteDelegate`、`revokeMetaplexCoreExecuteDelegate` |
| 委任トランスポート | `createMetaplexCoreExecuteDelegateClientExtension`、`wrapFetchWithMetaplexCoreExecuteDelegate` |
| 認証トークンの有効期間 | 24時間 |
| 委任エンドポイント | `/x402/core-execute-delegate/{status,approve,revoke,auth}` |

## FAQ {% #faq %}

Metaplex x402の支払いモードに関するよくある質問。

### Metaplex x402ではどの支払いモードを使うべきですか？ {% #which-metaplex-x402-payment-mode-should-i-use %}
アプリが自分自身として支払う場合は標準ウォレット、所有者の監督下でアセットに独自の予算を持たせたい場合はCoreアセットまたはエージェントの直接支払い、自律エージェントが人間の署名なしにリクエストごとに支払う必要がある場合は委任エージェントを使います。

### Metaplex x402のリクエストを支払うのにSOLは必要ですか？ {% #do-i-need-sol-to-pay-for-metaplex-x402-requests %}
必要なのはCoreアセットおよびエージェントの支払いモードだけで、その場合はCore `execute`のトランザクション手数料をまかなうためにアセットシグナーPDAにSOLが必要です。標準ウォレットの支払いにSOLは不要で、支払いトランザクションのネットワーク手数料はサービス側のフィーペイヤーが負担します。

### 委任エージェントの認証トークンの有効期間はどれくらいですか？ {% #how-long-does-a-delegated-agent-auth-token-last %}
認可JWTは24時間で失効します。失効したトークンは破棄され自動的に置き換えられます。置き換えに必要なのはメッセージ署名だけで、オンチェーンの委任承認を再度行う必要はありません。

### リアクティブ拡張とプロアクティブなfetchラッパーは併用できますか？ {% #can-i-use-the-reactive-extension-and-the-proactive-fetch-wrapper-together %}
いいえ。両者は代替関係にあり、組み合わせるとフローが壊れます。すでに`x402Client`を運用している場合や直接支払いへのフォールバックを任意で使いたい場合はリアクティブなクライアント拡張を、Metaplexのエンドポイントのみを対象に最もシンプルに配線したい場合はプロアクティブな`fetch`ラッパーを使ってください。

### 委任エージェントによる支払いを止めるにはどうすればいいですか？ {% #how-do-i-stop-a-delegated-agent-from-paying %}
承認時と同じ署名者、アセット、RPCオプションで`revokeMetaplexCoreExecuteDelegate`を呼び出します。委任はオンチェーンの許可なので、取り消しはオンチェーンで有効になり、サーバーはエージェントのウォレットから支払いを構築できなくなります。

### Token-2022のUSDCや他のステーブルコインで支払えますか？ {% #can-i-pay-with-token-2022-usdc-or-another-stablecoin %}
いいえ。支払い元は常にクラシックなSPL Tokenの関連トークンアカウントであり、Token-2022の支払いミントは現在サポートされていません。

---

Metaplex Foundationが管理。最終確認日: 2026-09-08。クライアントバージョン: `@metaplex-foundation/x402` `0.1.0`。[GitHubでソースを見る](https://github.com/metaplex-foundation/x402)。
