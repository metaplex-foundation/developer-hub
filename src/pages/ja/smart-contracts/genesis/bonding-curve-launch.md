---
title: Metaplex APIを通じたボンディングカーブのローンチ
metaTitle: Metaplex APIを通じたボンディングカーブトークンのローンチ | Genesis
description: Genesis SDKとMetaplex APIを使用して、ボンディングカーブのトークンローンチを作成、署名、送信、登録する方法 — クリエイター手数料、ファーストバイ、エージェントローンチ、エラーハンドリングを含む。
keywords:
  - bonding curve
  - bonding curve v2
  - genesis
  - token launch
  - createAndRegisterLaunch
  - createLaunch
  - registerLaunch
  - Metaplex API
  - creator fee
  - first buy
  - agent launch
  - Solana
  - Raydium CPMM
about:
  - Bonding Curve
  - Token Launch
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
  - Bash
cli: /dev-tools/cli/genesis/launch
proficiencyLevel: Intermediate
created: '04-07-2026'
updated: '04-09-2026'
howToSteps:
  - Install the Genesis SDK and configure a Umi instance
  - Call createLaunch with token metadata and launch options
  - Sign and submit the returned transactions with signAndSendLaunchTransactions
  - Register the confirmed launch with registerLaunch so it appears on metaplex.com
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
  - Metaplex API
faqs:
  - q: createAndRegisterLaunchと、createLaunchからregisterLaunchを個別に呼び出すことの違いは何ですか？
    a: createAndRegisterLaunchは、createLaunch、トランザクションの署名・送信、registerLaunchをシーケンスで呼び出すコンビニエンスラッパーです。デフォルトのUmi署名者と送信者で十分な場合に使用します。カスタム署名ロジック、Jitoバンドル、優先手数料、または作成ステップと登録ステップの間でリトライ処理が必要な場合は、createLaunch + registerLaunchを個別に使用します。
  - q: メインネットに行く前にdevnetでボンディングカーブのローンチをテストできますか？
    a: はい。ローンチ入力にnetwork "solana-devnet"を渡し、UmiインスタンスをdevnetのRPCエンドポイントに向けてください。APIはリクエストをdevnetインフラにルーティングします。トランザクションを送信する前に、ウォレットにdevnet SOLが入金されていることを確認してください。
  - q: setTokenをtrueに設定して後でトークンを変更したい場合どうなりますか？
    a: setTokenをtrueに設定すると、ローンチされたトークンがエージェントのプライマリトークンとして永続的に関連付けられます。この操作は取り消せず、再割り当てもできません。このトークンがエージェントの正しいトークンであることが確実な場合のみ、setTokenをtrueに設定してください。
  - q: クリエイター手数料ウォレットとファーストバイを組み合わせることはできますか？
    a: はい。launchオブジェクトにcreatorFeeWalletとfirstBuyAmountの両方を設定します。ファーストバイ自体は手数料無料です — その初回購入にはプロトコル手数料もクリエイター手数料もかかりません。その後のすべてのスワップは、設定されたウォレットへのクリエイター手数料が適用されます。
  - q: トークンメタデータに必要な画像フォーマットとホスティングは何ですか？
    a: imageフィールドはhttps://gateway.irys.xyz/<id>の形式のIrys URLである必要があります。まずIrysに画像をアップロードして、返されたゲートウェイURLを使用してください。他のホストや非Irys URLはAPIバリデーションで失敗します。
  - q: registerLaunchはトランザクションが確認された後に呼び出す必要があるのはなぜですか？
    a: registerLaunchはローンチをMetaplexデータベースに書き込み、metaplex.comに表示されるようにします。これはgenesisアカウントがオンチェーンに存在することを必要とします — 作成トランザクションが確認される前に呼び出すと、アカウントがまだ確認できないためAPIエラーで失敗します。
---

Genesis SDKとMetaplex APIを使用して、Solanaで[ボンディングカーブ](/smart-contracts/genesis/bonding-curve)トークンローンチを作成、署名、送信、登録します。 {% .lead %}

{% callout title="構築する内容" %}
このガイドでは以下をカバーします：
- `createAndRegisterLaunch` で1回の呼び出しでボンディングカーブトークンをローンチする
- クリエイター手数料を追加する — 特定のウォレットに、またはエージェントPDAに自動的に
- ローンチ時に手数料無料のファーストバイを設定する
- `createLaunch` + `registerLaunch` で手動でローンチに署名・登録する
- devnetでテストし、カスタムAPIベースURLまたはトランザクション送信者を使用する
- 型付きSDKエラーを処理する
{% /callout %}

## Summary

`createAndRegisterLaunch`（またはその低レベルの同等物）は `POST /v1/launches/create` を呼び出し、未署名のSolanaトランザクションを返し、署名・送信してから、トークンが[metaplex.com](https://www.metaplex.com)に表示されるようにローンチを登録します。

- **ワンライナーパス** — `createAndRegisterLaunch` は1回の待機呼び出しで完全なフローを処理
- **手動パス** — カスタム署名、バンドル、リトライロジックのための `createLaunch` + `signAndSendLaunchTransactions` + `registerLaunch`
- **クリエイター手数料** — ボンディングカーブと卒業後のRaydiumプールでのスワップごとのオプション手数料。ウォレットごとに設定可能、または[エージェントローンチ](/agents/create-agent-token)用に自動的に派生
- **ファーストバイ** — カーブ作成時にローンチウォレットまたはエージェントPDAのために予約された手数料無料の初回購入

## クイックスタート

**ジャンプ:** [インストール](#インストール) · [セットアップ](#umiセットアップ) · [ワンライナーローンチ](#ボンディングカーブのローンチワンライナーフロー) · [クリエイター手数料](/smart-contracts/genesis/creator-fees) · [ファーストバイ](#ファーストバイ) · [手動署名](#手動署名フロー) · [トークンメタデータ](#トークンメタデータ) · [Devnet](#devnetテスト) · [高度な設定](#高度な設定) · [エラー](#よくあるエラー) · [APIリファレンス](#apiリファレンス)

1. Genesis SDKをインストールし、キーペアIDでUmiインスタンスを設定する
2. `token` メタデータと `launch: {}` オブジェクトで `createAndRegisterLaunch` を呼び出す
3. レスポンスから `result.mintAddress` と `result.launch.link` を読み取る

カスタム署名やリトライロジックには[手動署名フロー](#手動署名フロー)を使用してください。

## 前提条件

- **Node.js 18+** — ネイティブ `BigInt` サポートに必要
- トランザクション手数料とオプションのファーストバイ金額のためにSOLが入金されたSolanaウォレットキーペア
- SolanaのRPCエンドポイント（mainnet-betaまたはdevnet）
- [Irys](https://irys.xyz)にアップロード済みの画像 — トークンメタデータの `image` フィールドはIrysゲートウェイURLである必要があります

## インストール

必要な3つのパッケージをインストールします。

```bash {% title="Terminal" %}
npm install @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults
```

## Umiセットアップ

Genesis API関数を呼び出す前に、キーペアIDでUmiインスタンスを設定します。

```typescript {% title="setup.ts" showLineNumbers=true %}
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';

const umi = createUmi('https://api.mainnet-beta.solana.com');

// キーペアを読み込む — 本番環境では適切なキー管理ソリューションを使用してください。
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
```

{% callout type="note" %}
Genesis API関数は `genesis()` プラグインを必要としません — インストラクションを直接送信するのではなく、ホスト型のMetaplex APIとHTTPで通信します。UmiインスタンスはSolana署名者IDとトランザクション送信機能のためだけに使用されます。
{% /callout %}

## ボンディングカーブのローンチ（ワンライナーフロー）

`createAndRegisterLaunch` は最もシンプルなパスです — 1回の待機呼び出しでローンチを作成し、すべてのトランザクションに署名して送信し、metaplex.comにトークンを登録します。

{% code-tabs-imported from="genesis/api_bonding_curve_launch" frameworks="umi,cli" defaultFramework="umi" /%}

`launch: {}` が空の場合、すべてのプロトコルパラメーター（供給分割、仮想リザーブ、資金フロー、ロックスケジュール）はプロトコルのデフォルト値に設定されます。以下のセクションでは、クリエイター手数料とファーストバイの追加方法を説明します。

## クリエイター手数料

オプションのスワップごとの手数料が、設定されたウォレットに毎回の購入と売却で蓄積されます。`launch` オブジェクトに `creatorFeeWallet` を設定して、手数料を特定のアドレスにリダイレクトします。デフォルトではローンチウォレットが使用されます。

```typescript {% title="launch-with-creator-fee.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
},
```

完全な設定オプション、蓄積残高の確認方法、請求インストラクション（`claimBondingCurveCreatorFeeV2` / `claimRaydiumCreatorFeeV2`）については、[クリエイター手数料](/smart-contracts/genesis/creator-fees)を参照してください。

## ファーストバイ

ファーストバイは、すべての手数料が免除された指定のSOL金額で、カーブの初回スワップをローンチウォレット用に予約します。

`firstBuyAmount` に手数料無料の初回購入のSOL金額を設定します。

{% code-tabs-imported from="genesis/api_bonding_curve_first_buy" frameworks="umi,cli" defaultFramework="umi" /%}

APIはローンチトランザクションフローの一部としてファーストバイを実行します — トランザクションが確認されると、カーブにはすでに初回購入が適用されています。購入者はデフォルトでローンチ `wallet` に、または `agent` が指定された場合はエージェントPDAになります。別の購入者を指定するには `firstBuyWallet`（`Signer`）でオーバーライドします。

`firstBuyAmount` が省略または `0` の場合、ファーストバイの制限は適用されず、どのウォレットでも最初のスワップが可能です。

クリエイター手数料ウォレットとファーストバイを組み合わせることができます：

```typescript {% title="launch-combined.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
  firstBuyAmount: 0.5,
},
```

## 手動署名フロー

トランザクションの署名と送信方法を制御する必要がある場合（例えば、Jitoバンドル、優先手数料、カスタムリトライロジックを使用する場合）は、`createLaunch` と `registerLaunch` を個別に使用してください。

```typescript {% title="manual-launch.ts" showLineNumbers=true %}
import {
  createLaunch,
  registerLaunch,
  signAndSendLaunchTransactions,
} from '@metaplex-foundation/genesis/api';

// ステップ1：APIを呼び出して未署名トランザクションを取得する。
const createResult = await createLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    creatorFeeWallet: 'FeeRecipientWalletAddress...',
  },
});

console.log('Mint address:', createResult.mintAddress);
console.log('Transactions to sign:', createResult.transactions.length);

// ステップ2：トランザクションに署名して送信する。
const signatures = await signAndSendLaunchTransactions(umi, createResult);

// ステップ3：すべてのトランザクションがオンチェーンで確認された後、ローンチを登録する。
const registered = await registerLaunch(umi, {}, {
  genesisAccount: createResult.genesisAccount,
  createLaunchInput: {
    wallet: umi.identity.publicKey,
    launchType: 'bondingCurve',
    token: {
      name: 'My Token',
      symbol: 'MTK',
      image: 'https://gateway.irys.xyz/your-image-id',
    },
    launch: {
      creatorFeeWallet: 'FeeRecipientWalletAddress...',
    },
  },
});

console.log('Launch live at:', registered.launch.link);
```

{% callout type="note" %}
`registerLaunch` は作成トランザクションがオンチェーンで確認された後にのみ呼び出してください。APIは登録前にgenesisアカウントが存在することを確認します — 早すぎると呼び出すとAPIエラーが返されます。
{% /callout %}

## トークンメタデータ

すべてのローンチには以下のフィールドを持つ `token` オブジェクトが必要です。

| フィールド | 必須 | 制約 |
|-------|----------|-------------|
| `name` | はい | 1〜32文字 |
| `symbol` | はい | 1〜10文字 |
| `image` | はい | IrysのURL（`https://gateway.irys.xyz/...`）である必要がある |
| `description` | いいえ | 最大250文字 |
| `externalLinks` | いいえ | オプションの `website`、`twitter`、`telegram` 値 |

```typescript {% title="token-metadata.ts" %}
token: {
  name: 'My Token',
  symbol: 'MTK',
  image: 'https://gateway.irys.xyz/your-image-id',
  description: 'A token launched on the bonding curve',
  externalLinks: {
    website: 'https://mytoken.com',
    twitter: '@mytoken',
    telegram: '@mytoken',
  },
},
```

## Devnetテスト

`network: 'solana-devnet'` を渡し、UmiインスタンスをdevnetのRPCエンドポイントに向けて、devnetインフラを通じてローンチをルーティングします。CLIの場合、ネットワークは設定されたRPCエンドポイントによって決まります。

{% code-tabs-imported from="genesis/api_bonding_curve_devnet" frameworks="umi,cli" defaultFramework="umi" /%}

## 高度な設定

### カスタムAPIベースURL

SDKはデフォルトで `https://api.metaplex.com` を使用します。設定オブジェクト（2番目の引数）に `baseUrl` を渡して、ステージングAPIなどの別の環境を対象にします。

```typescript {% title="custom-base-url.ts" showLineNumbers=true %}
const API_CONFIG = { baseUrl: 'https://your-api-base-url.example.com' };

const result = await createAndRegisterLaunch(umi, API_CONFIG, {
  wallet: umi.identity.publicKey,
  launchType: 'bondingCurve',
  token: {
    name: 'My Token',
    symbol: 'MTK',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {},
});
```

同じ `API_CONFIG` オブジェクトは、手動署名フローの `createLaunch` と `registerLaunch` でも受け入れられます。

### カスタムトランザクション送信者

オプション（4番目の引数）に `txSender` コールバックを渡して、独自の署名・送信インフラを使用します。

```typescript {% title="custom-sender.ts" showLineNumbers=true %}
const result = await createAndRegisterLaunch(
  umi,
  {},
  {
    wallet: umi.identity.publicKey,
    launchType: 'bondingCurve',
    token: {
      name: 'My Token',
      symbol: 'MTK',
      image: 'https://gateway.irys.xyz/your-image-id',
    },
    launch: {},
  },
  {
    txSender: async (txs) => {
      const signatures = [];
      for (const tx of txs) {
        const signed = await umi.identity.signTransaction(tx);
        signatures.push(await myCustomSend(signed));
      }
      return signatures;
    },
  }
);
```

## よくあるエラー

| エラー | 型チェック | 原因 | 対処法 |
|-------|-----------|-------|-----|
| `Validation error on "token.image"` | `isGenesisValidationError` | 画像URLがIrysゲートウェイURLではない | 画像をIrysにアップロードして `https://gateway.irys.xyz/...` URLを使用 |
| `Validation error on "token.name"` | `isGenesisValidationError` | 名前が32文字を超えているか空 | トークン名を1〜32文字に短縮 |
| `Network error` | `isGenesisApiNetworkError` | `https://api.metaplex.com` に到達できない | 接続を確認するか、アクセス可能なエンドポイントを指す `baseUrl` を提供 |
| `API error (4xx)` | `isGenesisApiError` | APIが無効な入力を拒否した | フィールドレベルのエラー詳細については `err.responseBody` を読む |
| `API error (5xx)` | `isGenesisApiError` | MetaplexのAPIが利用不可 | 指数バックオフでリトライ。すでに確認されたトランザクションは再送しない |
| `registerLaunch` APIエラー | `isGenesisApiError` | 作成トランザクションが確認される前に登録した | `registerLaunch` を呼び出す前に、すべてのシグネチャがオンチェーンで確認されるのを待つ |

これらのケースを区別するために型付きエラーガードを使用します：

```typescript {% title="error-handling.ts" showLineNumbers=true %}
import {
  createLaunch,
  isGenesisApiError,
  isGenesisApiNetworkError,
  isGenesisValidationError,
} from '@metaplex-foundation/genesis/api';

try {
  const result = await createLaunch(umi, {}, input);
} catch (err) {
  if (isGenesisValidationError(err)) {
    console.error(`Validation error on "${err.field}": ${err.message}`);
  } else if (isGenesisApiNetworkError(err)) {
    console.error('Network error:', err.message);
  } else if (isGenesisApiError(err)) {
    console.error(`API error (${err.statusCode}): ${err.message}`);
    console.error('Details:', err.responseBody);
  } else {
    throw err;
  }
}
```

## Notes

- `createAndRegisterLaunch` は呼び出し元からの観点でアトミックですが、内部的には2回のAPI呼び出しを行います — 作成トランザクションが確認された後で `registerLaunch` の前に失敗すると、トークンはオンチェーンに存在しますがmetaplex.comにはまだ表示されません。登録を完了するには `registerLaunch` を手動で呼び出してください
- MetaplexのAPIエンドポイント（`https://api.metaplex.com`）はホスト型インフラです — 未署名トランザクションを構築して返します。呼び出し元は常に署名の保持と制御を行います
- 仮想リザーブ、供給分割、ロックスケジュールは `launch: {}` が空の場合にプロトコルのデフォルト値によって設定されます。これらをローンチごとにオーバーライドするAPIはありません
- `agent.setToken` フラグは取り消し不可です — トークンがエージェントのプライマリトークンとして設定されると変更や再割り当てはできません。完全なエージェントローンチフローについては[エージェントトークンの作成](/agents/create-agent-token)を参照してください
- カーブがライブになったら、[ボンディングカーブスワップ統合](/smart-contracts/genesis/bonding-curve-swaps)ガイドを使用してスワップを統合してください
- ファーストバイはローンチ作成時に設定され、カーブがライブになった後には追加できません。`firstBuyAmount: 0` またはフィールドの省略で完全に無効化されます
- クリエイター手数料はバケットに蓄積され、スワップごとに転送されません。パーミッションレスの `claimBondingCurveCreatorFeeV2`（ボンディングカーブ）と `claimRaydiumCreatorFeeV2`（卒業後のRaydium）インストラクションで請求します

## APIリファレンス

### `createAndRegisterLaunch(umi, config, input, options?)`

完全なローンチフローを調整するコンビニエンス関数：作成、署名、送信、登録。

| パラメーター | 型 | 説明 |
|-----------|------|-------------|
| `umi` | `Umi` | IDとRPCが設定されたUmiインスタンス |
| `config` | `GenesisApiConfig \| null` | オプションのAPI設定（`baseUrl`、カスタム `fetch`） |
| `input` | `CreateBondingCurveLaunchInput` | ローンチ設定 |
| `options` | `SignAndSendOptions` | オプションの `txSender` オーバーライド |
| `registerOptions` | `RegisterOptions` | `registerLaunch` に転送されるオプションフィールド（例：`creatorWallet`、`twitterVerificationToken`） |

`Promise<CreateAndRegisterLaunchResult>` を返します：

| フィールド | 説明 |
|-------|-------------|
| `signatures` | トランザクションシグネチャ |
| `mintAddress` | 作成されたトークンミントアドレス |
| `genesisAccount` | GenesisアカウントPDA |
| `launch.link` | metaplex.comでトークンを表示するURL |

### `createLaunch(umi, config, input)`

`POST /v1/launches/create` を呼び出し、デシリアライズされたトランザクションを返します。

`Promise<CreateLaunchResponse>` を返します：

| フィールド | 説明 |
|-------|-------------|
| `transactions` | 署名して送信するUmi `Transaction` オブジェクトの配列 |
| `blockhash` | トランザクション有効性のためのブロックハッシュ |
| `mintAddress` | 作成されたトークンミントアドレス |
| `genesisAccount` | GenesisアカウントPDA |

### `registerLaunch(umi, config, input)`

確認済みのgenesisアカウントをmetaplex.comに登録します。すべての作成トランザクションがオンチェーンで確認された後に呼び出してください。

`Promise<RegisterLaunchResponse>` を返します：

| フィールド | 説明 |
|-------|-------------|
| `launch.id` | ローンチID |
| `launch.link` | トークンを表示するURL |
| `token.mintAddress` | 確認済みのミントアドレス |

### 型

```typescript {% title="types.ts" %}
interface CreateBondingCurveLaunchInput {
  wallet: PublicKey | string;
  launchType: 'bondingCurve';
  token: TokenMetadata;
  network?: 'solana-mainnet' | 'solana-devnet';
  quoteMint?: 'SOL';
  agent?: {
    mint: PublicKey | string;   // Coreアセット（NFT）アドレス
    setToken: boolean;          // ローンチされたトークンをエージェントのプライマリトークンとして設定
  };
  launch: BondingCurveLaunchInput;
}

interface BondingCurveLaunchInput {
  creatorFeeWallet?: PublicKey | string;
  firstBuyAmount?: number;   // SOL金額（例：0.1 = 0.1 SOL）
  firstBuyWallet?: Signer;
}

interface TokenMetadata {
  name: string;           // 最大32文字
  symbol: string;         // 最大10文字
  image: string;          // IrysのURLである必要がある: https://gateway.irys.xyz/...
  description?: string;   // 最大250文字
  externalLinks?: {
    website?: string;
    twitter?: string;
    telegram?: string;
  };
}

interface GenesisApiConfig {
  baseUrl?: string;
  fetch?: typeof fetch;
}
```

## FAQ

### `createAndRegisterLaunch` と `createLaunch` から `registerLaunch` を個別に呼び出すことの違いは何ですか？

`createAndRegisterLaunch` は完全なフローを1回の呼び出しで処理するコンビニエンスラッパーです。カスタム署名ロジック（例：Jitoバンドル、優先手数料）が必要な場合や、送信前に未署名トランザクションを検査・修正したい場合は、低レベル関数を個別に使用してください。[手動署名フロー](#手動署名フロー)を参照してください。

### メインネットに行く前にdevnetでボンディングカーブのローンチをテストできますか？

はい。入力に `network: 'solana-devnet'` を渡し、Umiインスタンスを `https://api.devnet.solana.com` に向けてください。APIはリクエストをdevnetインフラにルーティングします。トランザクションを送信する前に、ウォレットにdevnet SOLが入金されていることを確認してください。[Devnetテスト](#devnetテスト)を参照してください。

### 誤って `agent.setToken: true` を設定した場合どうなりますか？

`setToken: true` を設定するとローンチされたトークンがエージェントのプライマリトークンとして永続的に関連付けられます — これは取り消せず、再割り当てもできません。不確かな場合は `agent` フィールドを省略するか `setToken: false` を設定し、トークンの関連付けは別途処理してください。

### クリエイター手数料ウォレットとファーストバイを組み合わせることはできますか？

はい。`launch` オブジェクトに `creatorFeeWallet` と `firstBuyAmount` の両方を設定します。ファーストバイ自体は手数料無料です — その初回購入にはプロトコル手数料もクリエイター手数料もかかりません。クリエイター手数料はその後のすべてのスワップに通常通り適用されます。[ファーストバイ](#ファーストバイ)を参照してください。

### トークンメタデータに必要な画像フォーマットとホスティングは何ですか？

`image` フィールドはIrysのURL — `https://gateway.irys.xyz/<id>` である必要があります。まずIrysに画像をアップロードして、返されたゲートウェイURLを使用してください。他のホストはAPIバリデーションで失敗します。SDKはこれを `token.image` フィールドの `isGenesisValidationError` として表示します。

### `registerLaunch` はトランザクションがオンチェーンで確認された後に呼び出す必要があるのはなぜですか？

`registerLaunch` はMetaplexのデータベースにローンチレコードを書き込み、登録前にgenesisアカウントがオンチェーンに存在することを確認します。作成トランザクションが確認される前に呼び出すと、アカウントがまだ表示されないためAPIエラーが返されます。`createAndRegisterLaunch` では、このシーケンシングが自動的に処理されます。
