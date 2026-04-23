---
title: Genesis ボンディングカーブのクリエイター手数料
metaTitle: Genesis ボンディングカーブのクリエイター手数料 — 設定と請求 | Metaplex
description: Genesis ボンディングカーブのローンチでクリエイター手数料を設定し、Metaplex API、Genesis SDK、または低レベルのオンチェーン命令を介して蓄積した手数料を請求する方法。
keywords:
  - creator fee
  - creator rewards
  - bonding curve
  - genesis
  - claimCreatorRewards
  - v1/creator-rewards/claim
  - claimBondingCurveCreatorFeeV2
  - claimRaydiumCreatorFeeV2
  - creatorFeeWallet
  - creatorFeeAccrued
  - payer
  - Raydium CPMM
  - token launch
  - Solana
about:
  - Creator Fees
  - Creator Rewards
  - Bonding Curve
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
  - Bash
proficiencyLevel: Intermediate
created: '04-09-2026'
updated: '04-23-2026'
howToSteps:
  - Set creatorFeeWallet in the launch object when calling createAndRegisterLaunch
  - After launch, monitor creatorFeeAccrued in the bucket account using fetchBondingCurveBucketV2
  - Call claimCreatorRewards (API or SDK) to claim across all buckets in a single call
  - Optionally fall back to claimBondingCurveCreatorFeeV2 or claimRaydiumCreatorFeeV2 for per-bucket on-chain control
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
  - Metaplex API
faqs:
  - q: creatorFeeWalletが設定されていない場合、デフォルトのクリエイター手数料ウォレットは何ですか？
    a: デフォルトはローンチウォレット — createLaunch呼び出しに署名したウォレットです。launchオブジェクトにcreatorFeeWalletを明示的に設定して、手数料を他のアドレスにリダイレクトします。
  - q: クリエイター手数料はスワップごとに転送されますか？
    a: いいえ。クリエイター手数料は各スワップでバケット（creatorFeeAccrued）に蓄積されますが、すぐには転送されません。APIまたはSDK経由でclaimCreatorRewardsを呼び出してすべてのバケットからまとめて回収するか、バケットごとの命令（アクティブなカーブ中はclaimBondingCurveCreatorFeeV2、グラデュエーション後はclaimRaydiumCreatorFeeV2）でオンチェーン制御を行います。
  - q: APIとオンチェーン請求命令のどちらを使用すべきですか？
    a: 通常の請求にはAPI（claimCreatorRewards）を使用します — ウォレットが対象とするすべてのボンディングカーブとRaydiumバケットを1回の呼び出しに集約し、署名準備済みのトランザクションを返します。特定のバケットを対象にする、トランザクションを自分で構築する、Metaplex APIへのネットワークアクセスなしで実行する場合は、バケットごとのオンチェーン命令（claimBondingCurveCreatorFeeV2、claimRaydiumCreatorFeeV2）を使用します。
  - q: 誰でもclaimBondingCurveCreatorFeeV2を呼び出せますか？
    a: はい。claimBondingCurveCreatorFeeV2とclaimRaydiumCreatorFeeV2はどちらもパーミッションレスです — どのウォレットでも請求をトリガーできますが、SOLは常に設定されたクリエイター手数料ウォレットに送られ、呼び出し元には送られません。
  - q: 請求できる報酬がない場合はどうなりますか？
    a: claimCreatorRewardsエンドポイントはHTTP 400と`{"error":{"message":"No rewards available to claim"}}`を返します。SDKはこれをGenesisApiErrorとして表面化します。これを例外的な結果ではなく — err.message（またはstatusCode === 400）をチェックしてエラーを伝播させずに分岐します。
  - q: オプションのpayerフィールドは何のためですか？
    a: payerは返された請求トランザクションのトランザクション手数料とレントを負担します。請求対象のウォレットがデフォルトです。クリエイター手数料ウォレットがSOLを保持していない場合（例：エージェントPDAやコールドウォレット）に別のアドレスに設定します。payerは返されたトランザクションに署名する必要がありますが、クリエイター手数料の受取人は引き続き請求されたSOLを受け取ります。
  - q: ファーストバイはクリエイター手数料を支払いますか？
    a: いいえ。ファーストバイが設定されている場合、プロトコルスワップ手数料とクリエイター手数料の両方が、その1回の初回購入に対して免除されます。その後のすべてのスワップは通常のクリエイター手数料を支払います。
  - q: 蓄積したクリエイター手数料を確認するにはどうすればよいですか？
    a: Genesis SDKのfetchBondingCurveBucketV2を使用して、バケットアカウントからcreatorFeeAccruedフィールドを読み取ります。
  - q: ローンチ後にクリエイター手数料ウォレットを変更できますか？
    a: いいえ。クリエイター手数料ウォレットはカーブ作成時に設定され、カーブがライブになった後は変更できません。
---

クリエイター手数料は[Genesis ボンディングカーブ](/smart-contracts/genesis/bonding-curve)のオプションのスワップごとの手数料で、毎回の購入と売却で設定されたウォレットに蓄積されます。 {% .lead %}

{% callout title="学習内容" %}
- ローンチ時にクリエイター手数料ウォレットを設定する
- 手数料を特定のウォレットまたはエージェントPDAにリダイレクトする
- バケットに蓄積した金額を確認する
- アクティブなカーブ中に蓄積した手数料を請求する
- Raydium CPMMプールからグラデュエーション後の手数料を請求する
{% /callout %}

## Summary

クリエイター手数料は、Genesis ボンディングカーブのオプションのスワップごとの手数料で、毎回の購入と売却のSOL側に適用されます。手数料はすぐには転送されず、バケットアカウント（`creatorFeeAccrued`）に蓄積されます — Metaplex API（推奨）で1回の呼び出しで請求するか、オンチェーン命令でバケットごとに請求します。

- **設定** — カーブ作成時に `launch` オブジェクトに `creatorFeeWallet` を設定する。省略するとデフォルトでローンチウォレットになる
- **蓄積** — `creatorFeeAccrued` はスワップごとに増加する。手数料はスワップごとに転送されない
- **推奨される請求パス** — `POST /v1/creator-rewards/claim`（またはSDKの `claimCreatorRewards`）はウォレットのすべてのボンディングカーブとRaydiumバケットを集約し、署名準備済みのトランザクションを返す
- **バケットごとの請求** — `claimBondingCurveCreatorFeeV2` でアクティブなカーブ中に回収。`claimRaydiumCreatorFeeV2` でグラデュエーション後にRaydium CPMMプールから回収

スワップ価格設定とプロトコルスワップ手数料とのクリエイター手数料の相互作用については、[動作理論 — 手数料構造](/smart-contracts/genesis/bonding-curve-theory#fee-structure)を参照してください。

## クイックスタート

**ジャンプ:** [ローンチ時の設定](#ローンチ時のクリエイター手数料の設定) · [ウォレットへのリダイレクト](#クリエイター手数料を特定のウォレットにリダイレクトする) · [エージェントPDA](#エージェントローンチ自動pda ルーティング) · [ファーストバイとの組み合わせ](#クリエイター手数料とファーストバイの組み合わせ) · [蓄積確認](#蓄積したクリエイター手数料の確認) · [API経由で請求](#metaplex-api経由で請求推奨) · [報酬なしのケース](#報酬なしのケースの処理) · [カーブ中の請求](#アクティブなカーブ中のクリエイター手数料の請求) · [グラデュエーション後の請求](#グラデュエーション後のクリエイター手数料の請求)

1. `createAndRegisterLaunch` を呼び出すときに `launch` オブジェクトに `creatorFeeWallet` を設定する
2. ローンチ後、`bucket.creatorFeeAccrued` を監視して蓄積手数料を追跡する
3. APIまたはSDK経由で `claimCreatorRewards` を呼び出して、すべてのバケットからまとめて1回の呼び出しで請求する
4. 必要に応じて、バケットごとのオンチェーン制御のために `claimBondingCurveCreatorFeeV2` / `claimRaydiumCreatorFeeV2` にフォールバックする

## 前提条件

- `@metaplex-foundation/genesis` SDKインストール済み
- キーペアIDで設定されたUmiインスタンス — [Metaplex APIを通じたボンディングカーブのローンチ](/smart-contracts/genesis/bonding-curve-launch#umiセットアップ)を参照
- トランザクション手数料のための入金済みSolanaウォレット

## ローンチ時のクリエイター手数料の設定

クリエイター手数料は `createAndRegisterLaunch`（または `createLaunch`）に渡す `launch` オブジェクトで設定します。`creatorFeeWallet` フィールドはオプションです — 省略した場合、デフォルトでローンチウォレットがすべての手数料を受け取ります。完全なローンチフローについては[Metaplex APIを通じたボンディングカーブのローンチ](/smart-contracts/genesis/bonding-curve-launch)を参照してください。

### クリエイター手数料を特定のウォレットにリダイレクトする

`creatorFeeWallet` を設定して、蓄積された手数料をローンチウォレット以外の任意のウォレットアドレスに向けます。

```typescript {% title="launch-with-creator-fee.ts" showLineNumbers=true %}
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis/api';

const result = await createAndRegisterLaunch(umi, {}, {
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
```

{% callout type="note" %}
クリエイター手数料ウォレットはカーブ作成時に設定され、カーブがライブになった後は変更できません。
{% /callout %}

### エージェントローンチ — 自動PDAルーティング

MetaplexエージェントのためにローンチするSolana場合、クリエイター手数料は `creatorFeeWallet` を手動設定せずにエージェントのPDAに自動的にルーティングされます。Coreエグゼキュートラッピングと `setToken` 関連付けを含む完全なエージェントローンチフローについては、[エージェントトークンの作成](/agents/create-agent-token)を参照してください。

### クリエイター手数料とファーストバイの組み合わせ

クリエイター手数料ウォレットとファーストバイを一緒に設定できます。ファーストバイは常に手数料無料です — その初回購入にはプロトコル手数料もクリエイター手数料もかかりません。その後のすべてのスワップは通常のクリエイター手数料を支払います。

```typescript {% title="launch-with-fee-and-first-buy.ts" %}
launch: {
  creatorFeeWallet: 'FeeRecipientWalletAddress...',
  firstBuyAmount: 0.5, // 0.5 SOL、最初の購入者に手数料無料
},
```

## 蓄積したクリエイター手数料の確認

`BondingCurveBucketV2` アカウントの `creatorFeeAccrued` フィールドは、最後の請求以降に蓄積した合計SOLを追跡します。`fetchBondingCurveBucketV2` を使用して読み取ります：

```typescript {% title="check-creator-fees.ts" showLineNumbers=true %}
import {
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');

const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
console.log('Creator fees accrued (lamports):', bucket.creatorFeeAccrued);
console.log('Creator fees claimed to date (lamports):', bucket.creatorFeeClaimed);

// バケット拡張機能から設定されたクリエイター手数料ウォレットを読み取る
const creatorFeeExt = bucket.extensions.creatorFee;
const creatorFeeWallet = isSome(creatorFeeExt) ? creatorFeeExt.value.wallet : null;
console.log('Creator fee wallet:', creatorFeeWallet?.toString() ?? 'none configured');
```

## Metaplex API経由で請求（推奨）

`POST /v1/creator-rewards/claim` は、ウォレットが対象とするすべての未請求のボンディングカーブとRaydium報酬を1回の呼び出しで請求します。エンドポイントは、ウォレット（または指定された `payer`）が署名して送信するbase64エンコードされたSolanaトランザクションを返します。JavaScript SDKは同じ呼び出しを `@metaplex-foundation/genesis` の `claimCreatorRewards` として公開します。

{% code-tabs-imported from="genesis/api_claim_creator_rewards" frameworks="umi,curl" defaultFramework="umi" /%}

| フィールド | 型 | 必須 | 備考 |
|-------|------|----------|-------|
| `wallet` | `PublicKey \| string` | はい | 請求するクリエイター手数料ウォレット。 |
| `network` | `SvmNetwork` | いいえ | `'solana-mainnet'`（デフォルト）または `'solana-devnet'`。 |
| `payer` | `PublicKey \| string` | いいえ | 返されたトランザクションの手数料とレントを負担するウォレット。デフォルトは `wallet`。クリエイター手数料ウォレットがSOLを保持していない場合（例：エージェントPDAやコールドウォレット）に使用します。 |

SDKは、デシリアライズされたUmi `Transaction` と、それらが構築されたブロックハッシュを返します。常に返されたブロックハッシュに対して各トランザクションを確認してください — 新たに取得したものに置き換えないでください。確認競合が発生します。完全なHTTPスキーマは[Claim Creator Rewards (API)](/smart-contracts/genesis/integration-apis/claim-creator-rewards)を参照してください。

### 報酬なしのケースの処理

ウォレットに請求するものがない場合、エンドポイントはHTTP `400` と `{ "error": { "message": "No rewards available to claim" } }` を返します — 空の `transactions` 配列を含む成功レスポンスは返**されません**。SDKはこれを `GenesisApiError` として表面化するため、呼び出し元はエラーをキャッチして `err.message`（または `err.statusCode === 400`）で分岐する必要があります。エラーをそのまま伝播させてはいけません。

{% code-tabs-imported from="genesis/api_claim_creator_rewards_errors" frameworks="umi" /%}

{% callout type="note" %}
上記のAPIパスは、すべての本番請求フローで推奨される統合です。下記のバケットごとのオンチェーン命令は、特定のバケットを対象とする、トランザクションを完全にクライアントサイドで構築する、Metaplex APIへのネットワークアクセスなしで実行するなど、高度なケースで引き続き利用できます。
{% /callout %}

## アクティブなカーブ中のクリエイター手数料の請求

`claimBondingCurveCreatorFeeV2` は、蓄積したすべてのクリエイター手数料をバケットから設定されたクリエイター手数料ウォレットに転送します。カーブがアクティブな間はいつでも呼び出せます。

```typescript {% title="claim-creator-fees.ts" showLineNumbers=true %}
import { claimBondingCurveCreatorFeeV2 } from '@metaplex-foundation/genesis';
import { isSome } from '@metaplex-foundation/umi';

// 請求前にバケット拡張機能からクリエイター手数料ウォレットを読み取る。
const creatorFeeExt = bucket.extensions.creatorFee;
if (!isSome(creatorFeeExt)) throw new Error('No creator fee configured on this bucket');
const creatorFeeWallet = creatorFeeExt.value.wallet;

const result = await claimBondingCurveCreatorFeeV2(umi, {
  genesisAccount,
  bucket: bucketPda,
  baseMint,
  creatorFeeWallet,
}).sendAndConfirm(umi);

console.log('Creator fees claimed:', result.signature);
```

{% callout type="note" %}
`claimBondingCurveCreatorFeeV2` はパーミッションレスです — どのウォレットでも呼び出せますが、SOLは常に設定されたクリエイター手数料ウォレットに送られ、呼び出し元には送られません。
{% /callout %}

## グラデュエーション後のクリエイター手数料の請求

ボンディングカーブが[グラデュエーション](/smart-contracts/genesis/bonding-curve-theory#phase-3-graduated)した後、流動性はRaydium CPMMプールに移行し、クリエイター手数料はLPの取引活動から引き続き蓄積されます。`RaydiumCpmmBucketV2` アカウントは、`BondingCurveBucketV2` と同様の `creatorFeeAccrued` と `creatorFeeClaimed` フィールドを公開します。グラデュエーション後の手数料は `claimRaydiumCreatorFeeV2` で回収します。

```typescript {% title="claim-raydium-creator-fees.ts" showLineNumbers=true %}
import { claimRaydiumCreatorFeeV2 } from '@metaplex-foundation/genesis';

const result = await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount,
  // ... Raydiumプールアカウント
}).sendAndConfirm(umi);
```

{% callout type="note" %}
ボンディングカーブの対応するインストラクションと同様に、`claimRaydiumCreatorFeeV2` もパーミッションレスです — どのウォレットでも請求をトリガーできますが、SOLは常に設定されたクリエイター手数料ウォレットに送られます。
{% /callout %}

## Notes

- クリエイター手数料は各スワップでバケット（`creatorFeeAccrued`）に蓄積されますが、すぐには転送されません — API/SDKまたはバケットごとのインストラクションで明示的に請求する必要があります。`creatorFeeClaimed` は累計の請求済み合計を追跡します
- `claimCreatorRewards`（API/SDK）は、ウォレットの対象となるすべてのボンディングカーブとRaydiumバケットを1回の呼び出しに集約します。請求するものがない場合、空のトランザクション配列ではなくHTTP `400` と `"No rewards available to claim"` を返します
- オンチェーン請求インストラクションはパーミッションレスです。どのウォレットでもトリガーできますが、SOLは常に設定されたクリエイター手数料ウォレットに送られ、呼び出し元には送られません
- `creatorFeeWallet` は設定されていない場合デフォルトでローンチウォレットになります。カーブ作成後は変更できません
- ファーストバイの仕組みは、指定された初回購入のみすべての手数料（プロトコルとクリエイター）を免除します。その後のすべてのスワップは通常のクリエイター手数料を支払います
- クリエイター手数料は方向（購入または売却）に関わらずすべてのスワップのSOL側に適用されます。プロトコルスワップ手数料とは複合しません
- 現在の手数料率については[Genesis プロトコル手数料](/smart-contracts/genesis)ページを参照してください
- バケット状態の読み取り、見積もりの計算、取引の実行については[ボンディングカーブスワップ統合](/smart-contracts/genesis/bonding-curve-swaps)を参照してください

## FAQ

### `creatorFeeWallet` が設定されていない場合、デフォルトのクリエイター手数料ウォレットは何ですか？

デフォルトのクリエイター手数料ウォレットはローンチウォレット — `createLaunch` 呼び出しに署名したウォレットです。`launch` オブジェクトに `creatorFeeWallet` を明示的に設定して、手数料を他のアドレスにリダイレクトします。

### クリエイター手数料はスワップごとに転送されますか？

いいえ。クリエイター手数料は各スワップでバケット（`creatorFeeAccrued`）に蓄積されますが、すぐには転送されません。[APIまたはSDK](#metaplex-api経由で請求推奨)経由で `claimCreatorRewards` を呼び出してすべてのバケットを1回で回収するか、より低レベルの制御のためにバケットごとのオンチェーン命令（アクティブなカーブ中は `claimBondingCurveCreatorFeeV2`、グラデュエーション後は `claimRaydiumCreatorFeeV2`）を使用します。

### APIとオンチェーン請求命令のどちらを使用すべきですか？

通常の請求にはAPI（`claimCreatorRewards`）を使用します — ウォレットが対象とするすべてのボンディングカーブとRaydiumバケットを1回の呼び出しに集約し、署名準備済みのトランザクションを返します。特定のバケットを対象にする、トランザクションを自分で構築する、Metaplex APIへのネットワークアクセスなしで実行する場合は、バケットごとのオンチェーン命令を使用します。

### 請求できる報酬がない場合はどうなりますか？

`claimCreatorRewards` エンドポイントはHTTP `400` と `{"error":{"message":"No rewards available to claim"}}` を返します。SDKはこれを `GenesisApiError` として表面化します。これを例外的な結果ではなく — `err.message`（または `err.statusCode === 400`）をチェックしてエラーを伝播させずに分岐します。[報酬なしのケースの処理](#報酬なしのケースの処理)を参照してください。

### オプションの `payer` フィールドは何のためですか？

`payer` は返された請求トランザクションのトランザクション手数料とレントを負担します。請求対象のウォレットがデフォルトです。クリエイター手数料ウォレットがSOLを保持していない場合（例：エージェントPDAやコールドウォレット）に別のアドレスに設定します。`payer` は返されたトランザクションに署名する必要がありますが、クリエイター手数料の受取人は引き続き請求されたSOLを受け取ります。

### 誰でも `claimBondingCurveCreatorFeeV2` を呼び出せますか？

はい。`claimBondingCurveCreatorFeeV2` と `claimRaydiumCreatorFeeV2` はどちらもパーミッションレスです — どのウォレットでも請求をトリガーできますが、SOLは常に設定されたクリエイター手数料ウォレットに送られ、呼び出し元には送られません。

### ファーストバイはクリエイター手数料を支払いますか？

いいえ。ファーストバイが設定されている場合、プロトコルスワップ手数料とクリエイター手数料の両方が、その1回の初回購入に対して免除されます。その後のすべてのスワップは通常のクリエイター手数料を支払います。

### 蓄積したクリエイター手数料を確認するにはどうすればよいですか？

`fetchBondingCurveBucketV2` を使用してバケットアカウントから `creatorFeeAccrued` フィールドを読み取ります。[蓄積したクリエイター手数料の確認](#蓄積したクリエイター手数料の確認)を参照してください。

### ローンチ後にクリエイター手数料ウォレットを変更できますか？

いいえ。クリエイター手数料ウォレットはカーブ作成時に設定され、カーブがライブになった後は変更できません。
