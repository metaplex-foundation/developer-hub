---
title: Genesis ボンディングカーブのクリエイター手数料
metaTitle: Genesis ボンディングカーブのクリエイター手数料 — 設定と請求 | Metaplex
description: Genesis ボンディングカーブのローンチでクリエイター手数料を設定し、アクティブなカーブ中に蓄積した手数料を請求し、Raydium CPMMプールからグラデュエーション後の手数料を収集・請求する方法。
keywords:
  - creator fee
  - bonding curve
  - genesis
  - claimBondingCurveCreatorFeeV2
  - claimRaydiumCreatorFeeV2
  - collectRaydiumCpmmFeesWithCreatorFeeV2
  - deriveRaydiumPDAsV2
  - findRaydiumCpmmBucketV2Pda
  - fetchRaydiumCpmmBucketV2
  - creatorFeeWallet
  - creatorFeeAccrued
  - RaydiumCpmmBucketV2
  - Raydium CPMM
  - token launch
  - Solana
about:
  - Creator Fees
  - Bonding Curve
  - Genesis
  - Solana
programmingLanguage:
  - JavaScript
  - TypeScript
proficiencyLevel: Intermediate
created: '04-09-2026'
updated: '04-13-2026'
howToSteps:
  - createAndRegisterLaunch の呼び出し時にローンチオブジェクトで creatorFeeWallet を設定します
  - ローンチ後、fetchBondingCurveBucketV2 を使用してバケットアカウントの creatorFeeAccrued を監視します
  - アクティブカーブ期間中に claimBondingCurveCreatorFeeV2 を呼び出して発生した手数料を請求します
  - 卒業後、collectRaydiumCpmmFeesWithCreatorFeeV2 を呼び出して Raydium プールの LP 手数料を Genesis バケットに収集します
  - claimRaydiumCreatorFeeV2 を呼び出してバケットの累積残高をクリエイターウォレットに転送します
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: creatorFeeWalletが設定されていない場合、デフォルトのクリエイター手数料ウォレットは何ですか？
    a: デフォルトはローンチウォレット — createLaunch呼び出しに署名したウォレットです。launchオブジェクトにcreatorFeeWalletを明示的に設定して、手数料を他のアドレスにリダイレクトします。
  - q: クリエイター手数料はスワップごとに転送されますか？
    a: いいえ。クリエイター手数料は各スワップでバケット（creatorFeeAccrued）に蓄積されますが、すぐには転送されません。アクティブなカーブ中はclaimBondingCurveCreatorFeeV2で請求します。グラデュエーション後はcollectRaydiumCpmmFeesWithCreatorFeeV2でRaydiumプールからLP手数料を収集し、その後claimRaydiumCreatorFeeV2でクリエイターウォレットに転送します。
  - q: 誰でもclaimBondingCurveCreatorFeeV2やclaimRaydiumCreatorFeeV2を呼び出せますか？
    a: はい。3つのパーミッションレスな手数料インストラクションはアクティブカーブとグラデュエーション後の両方のフェーズにまたがります — collectRaydiumCpmmFeesWithCreatorFeeV2とclaimBondingCurveCreatorFeeV2（アクティブカーブ）、およびclaimRaydiumCreatorFeeV2（グラデュエーション後）。どのウォレットでもトリガーできますが、SOLは常に設定されたクリエイター手数料ウォレットに送られ、呼び出し元には送られません。
  - q: collectRaydiumCpmmFeesWithCreatorFeeV2とclaimRaydiumCreatorFeeV2の違いは何ですか？
    a: collectRaydiumCpmmFeesWithCreatorFeeV2はRaydium CPMMプールから蓄積されたLP取引手数料をGenesisのRaydiumCpmmBucketV2バケットに収集します。claimRaydiumCreatorFeeV2はバケットにある残高をクリエイター手数料ウォレットに転送します。グラデュエーション後の手数料を完全に回収するには両方のステップが必要です。
  - q: ファーストバイはクリエイター手数料を支払いますか？
    a: いいえ。ファーストバイが設定されている場合、プロトコルスワップ手数料とクリエイター手数料の両方が、その1回の初回購入に対して免除されます。その後のすべてのスワップは通常のクリエイター手数料を支払います。
  - q: 蓄積したクリエイター手数料を確認するにはどうすればよいですか？
    a: アクティブカーブ中はfetchBondingCurveBucketV2を使用してBondingCurveBucketV2からcreatorFeeAccruedフィールドを読み取ります。グラデュエーション後はfetchRaydiumCpmmBucketV2を使用してRaydiumCpmmBucketV2からcreatorFeeAccruedを読み取ります。蓄積したクリエイター手数料の確認および蓄積したRaydiumクリエイター手数料の確認セクションを参照してください。
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

クリエイター手数料は、Genesis ボンディングカーブのオプションのスワップごとの手数料で、毎回の購入と売却のSOL側に適用されます。手数料はすぐには転送されず、バケットアカウント（`creatorFeeAccrued`）に蓄積されます。2つのパーミッションレスインストラクションで回収します。

- **設定** — カーブ作成時に `launch` オブジェクトに `creatorFeeWallet` を設定する。省略するとデフォルトでローンチウォレットになる
- **蓄積** — `creatorFeeAccrued` はスワップごとに増加する。手数料はスワップごとに転送されない
- **アクティブカーブ中の請求** — `claimBondingCurveCreatorFeeV2` でカーブがライブ中に蓄積した手数料を回収する
- **グラデュエーション後の請求** — 2ステップ: `collectRaydiumCpmmFeesWithCreatorFeeV2` でRaydiumプールからLP手数料をGenesisバケットに収集し、その後 `claimRaydiumCreatorFeeV2` でバケット残高をクリエイターウォレットに転送する

スワップ価格設定とプロトコルスワップ手数料とのクリエイター手数料の相互作用については、[動作理論 — 手数料構造](/smart-contracts/genesis/bonding-curve-theory#fee-structure)を参照してください。

## クイックスタート

このセクションでは、アクティブカーブとグラデュエーション後の両フェーズでクリエイター手数料を設定および請求するための最小限の手順を説明します。

### クイックリファレンス

この表は、各手数料インストラクションを呼び出すタイミング、必要なアカウント、およびクリエイター手数料ライフサイクルへの影響をまとめたものです。

| インストラクション | 使用タイミング | 必要なアカウント | 出力 / 効果 |
|---|---|---|---|
| `createAndRegisterLaunch`（`creatorFeeWallet` 設定） | カーブ作成時 | クリエイターウォレット、ローンチ署名者 | バケットに手数料ウォレットが設定される |
| `fetchBondingCurveBucketV2`（`creatorFeeAccrued` 読み取り） | アクティブカーブ中いつでも | バケットPDA | 現在の蓄積手数料残高（lamports） |
| `claimBondingCurveCreatorFeeV2` | アクティブカーブ — 蓄積手数料の回収 | Genesisアカウント、バケットPDA、ベースミント、クリエイター手数料ウォレット | 蓄積SOLがクリエイターウォレットに転送 |
| `collectRaydiumCpmmFeesWithCreatorFeeV2` | グラデュエーション後 — LP手数料のハーベスト | Genesisアカウント、RaydiumプールPDA、RaydiumバケットPDA | LP手数料がRaydiumプールからGenesisバケットに移動 |
| `claimRaydiumCreatorFeeV2` | グラデュエーション後 — バケット残高の請求 | Genesisアカウント、RaydiumバケットPDA、ベース/クォートミント、クリエイター手数料ウォレット | バケット残高がクリエイターウォレットに転送 |

**ジャンプ:** [ローンチ時の設定](#ローンチ時のクリエイター手数料の設定) · [ウォレットへのリダイレクト](#クリエイター手数料を特定のウォレットにリダイレクトする) · [エージェントPDA](#エージェントローンチ自動pdaルーティング) · [ファーストバイとの組み合わせ](#クリエイター手数料とファーストバイの組み合わせ) · [蓄積確認（カーブ）](#蓄積したクリエイター手数料の確認) · [カーブ中の請求](#アクティブなカーブ中のクリエイター手数料の請求) · [Raydium手数料の確認](#蓄積したraydiumクリエイター手数料の確認) · [Raydiumからの収集](#ステップ1--raydium-cpmmプールからの手数料収集) · [グラデュエーション後の請求](#ステップ2--クリエイターウォレットへの手数料請求)

1. `createAndRegisterLaunch` を呼び出すときに `launch` オブジェクトに `creatorFeeWallet` を設定する
2. ローンチ後、`bucket.creatorFeeAccrued` を監視して蓄積手数料を追跡する
3. `claimBondingCurveCreatorFeeV2` を呼び出してカーブがアクティブな間に手数料を回収する
4. グラデュエーション後、`collectRaydiumCpmmFeesWithCreatorFeeV2` を呼び出してRaydiumプールからLP手数料を収集する
5. `claimRaydiumCreatorFeeV2` を呼び出してバケット残高をクリエイターウォレットに転送する

## 前提条件

Genesis SDK、設定済みのUmiインスタンス、および入金済みのSolanaウォレットが必要です。

- `@metaplex-foundation/genesis` SDKインストール済み
- キーペアIDで設定されたUmiインスタンス — [Metaplex APIを通じたボンディングカーブのローンチ](/smart-contracts/genesis/bonding-curve-launch#umi-setup)を参照
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

Metaplexエージェントのためにローンチする場合、クリエイター手数料は `creatorFeeWallet` を手動設定せずにエージェントのPDAに自動的にルーティングされます。Coreエグゼキュートラッピングと `setToken` 関連付けを含む完全なエージェントローンチフローについては、[エージェントトークンの作成](/agents/create-agent-token)を参照してください。

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

ボンディングカーブが[グラデュエーション](/smart-contracts/genesis/bonding-curve-theory#phase-3-graduated)した後、流動性はRaydium CPMMプールに移行し、クリエイター手数料はLPの取引活動から引き続き蓄積されます。グラデュエーション後の手数料回収は**2ステップのプロセス**です：まずRaydiumプールから蓄積されたLP取引手数料をGenesisの `RaydiumCpmmBucketV2` バケットに収集し、次にバケット残高をクリエイターウォレットに請求します。

### 蓄積したRaydiumクリエイター手数料の確認

`RaydiumCpmmBucketV2` アカウントは `BondingCurveBucketV2` と同様の `creatorFeeAccrued` と `creatorFeeClaimed` フィールドを公開します。`findRaydiumCpmmBucketV2Pda` と `fetchRaydiumCpmmBucketV2` を使用してデリブおよびフェッチします。

```typescript {% title="check-raydium-fees.ts" showLineNumbers=true %}
import {
  findRaydiumCpmmBucketV2Pda,
  fetchRaydiumCpmmBucketV2,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey } from '@metaplex-foundation/umi';

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);
const claimable = raydiumBucket.creatorFeeAccrued - raydiumBucket.creatorFeeClaimed;
console.log('Claimable Raydium creator fees (lamports):', claimable);

const creatorFeeExt = raydiumBucket.extensions.creatorFee;
const creatorFeeWallet = isSome(creatorFeeExt) ? creatorFeeExt.value.wallet : null;
console.log('Creator fee wallet:', creatorFeeWallet?.toString() ?? 'none configured');
```

{% callout type="note" %}
`raydiumBucket.creatorFeeAccrued` はRaydiumプールからバケットに既に収集された手数料のみを反映します。Raydiumプール自体に未収集のLP手数料がある場合があります — 最終的な請求可能残高を読み取る前に `collectRaydiumCpmmFeesWithCreatorFeeV2` を実行してバケットに移動してください。
{% /callout %}

### ステップ1 — Raydium CPMMプールからの手数料収集

`collectRaydiumCpmmFeesWithCreatorFeeV2` はRaydium CPMMプールから蓄積されたLP取引手数料を収集し、`RaydiumCpmmBucketV2` バケット署名者のトークンアカウントにクレジットし、`creatorFeeAccrued` を更新します。請求前にこのステップを実行する必要があります — Raydiumから手数料が収集されるまで、請求するものはありません。

`deriveRaydiumPDAsV2` を使用して、ベースミントとバケットアドレスから必要なすべてのRaydiumプールアカウントを計算します。`creatorFee: true` を渡してクリエイター手数料AMMコンフィグを選択します。

```typescript {% title="collect-raydium-fees.ts" showLineNumbers=true %}
import {
  collectRaydiumCpmmFeesWithCreatorFeeV2,
  deriveRaydiumPDAsV2,
  findRaydiumCpmmBucketV2Pda,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112'); // wSOL

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const pdas = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucketPda, {
  quoteMint,
  env: 'mainnet', // or 'devnet'
  creatorFee: true,
});

await collectRaydiumCpmmFeesWithCreatorFeeV2(umi, {
  baseMint,
  quoteMint,
  genesisAccount,
  poolState: pdas.poolState,
  raydiumCpmmBucket: raydiumBucketPda,
  ammConfig: pdas.ammConfig,
  poolAuthority: pdas.poolAuthority,
  baseVault: pdas.baseVault,
  quoteVault: pdas.quoteVault,
  raydiumProgram: pdas.raydiumProgram,
}).sendAndConfirm(umi);

console.log('Raydium LP fees collected into Genesis bucket');
```

{% callout type="note" %}
`collectRaydiumCpmmFeesWithCreatorFeeV2` はパーミッションレスです — どのウォレットでも呼び出せます。収集された手数料はGenesisバケット署名者のトークンアカウントに流れ、次回のバケットフェッチで `creatorFeeAccrued` に反映されます。
{% /callout %}

### ステップ2 — クリエイターウォレットへの手数料請求

`claimRaydiumCreatorFeeV2` は `RaydiumCpmmBucketV2` バケットに蓄積された残高を設定されたクリエイター手数料ウォレットに転送します。収集後に実行するか、前回の収集からバケットに未請求残高がある場合はいつでも実行します。

```typescript {% title="claim-raydium-creator-fees.ts" showLineNumbers=true %}
import {
  claimRaydiumCreatorFeeV2,
  fetchRaydiumCpmmBucketV2,
  findRaydiumCpmmBucketV2Pda,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey } from '@metaplex-foundation/umi';

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// 収集後に再フェッチして更新されたcreatorFeeAccruedを取得する。
const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);

const creatorFeeExt = raydiumBucket.extensions.creatorFee;
if (!isSome(creatorFeeExt)) throw new Error('No creator fee configured on this Raydium bucket');
const creatorFeeWallet = creatorFeeExt.value.wallet;

await claimRaydiumCreatorFeeV2(umi, {
  genesisAccount: raydiumBucket.bucket.genesis,
  bucket: raydiumBucketPda,
  baseMint: raydiumBucket.bucket.baseMint,
  quoteMint: raydiumBucket.bucket.quoteMint,
  creatorFeeWallet,
}).sendAndConfirm(umi);

console.log('Raydium creator fees claimed to:', creatorFeeWallet.toString());
```

{% callout type="note" %}
`claimRaydiumCreatorFeeV2` はパーミッションレスです — どのウォレットでも請求をトリガーできますが、SOL（wSOLとして）は常に設定されたクリエイター手数料ウォレットに送られ、呼び出し元には送られません。
{% /callout %}

### 収集と請求の統合フロー

2つのビルダーをチェーンして1つのトランザクションで収集と請求を行います。プールに未収集手数料がなくバケット残高もゼロの場合、無操作トランザクションを避けるため両方のインストラクションをスキップします。

```typescript {% title="collect-and-claim-raydium.ts" showLineNumbers=true %}
import {
  collectRaydiumCpmmFeesWithCreatorFeeV2,
  claimRaydiumCreatorFeeV2,
  deriveRaydiumPDAsV2,
  fetchRaydiumCpmmBucketV2,
  findRaydiumCpmmBucketV2Pda,
} from '@metaplex-foundation/genesis';
import { isSome, publicKey, transactionBuilder } from '@metaplex-foundation/umi';

const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112');
const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);

const creatorFeeExt = raydiumBucket.extensions.creatorFee;
if (!isSome(creatorFeeExt)) throw new Error('No creator fee configured');
const creatorFeeWallet = creatorFeeExt.value.wallet;

const pdas = deriveRaydiumPDAsV2(umi, baseMint, raydiumBucketPda, {
  quoteMint,
  env: 'mainnet', // or 'devnet'
  creatorFee: true,
});

await transactionBuilder()
  .add(collectRaydiumCpmmFeesWithCreatorFeeV2(umi, {
    baseMint,
    quoteMint,
    genesisAccount,
    poolState: pdas.poolState,
    raydiumCpmmBucket: raydiumBucketPda,
    ammConfig: pdas.ammConfig,
    poolAuthority: pdas.poolAuthority,
    baseVault: pdas.baseVault,
    quoteVault: pdas.quoteVault,
    raydiumProgram: pdas.raydiumProgram,
  }))
  .add(claimRaydiumCreatorFeeV2(umi, {
    genesisAccount,
    bucket: raydiumBucketPda,
    baseMint,
    quoteMint,
    creatorFeeWallet,
  }))
  .sendAndConfirm(umi);

console.log('Raydium creator fees collected and claimed to:', creatorFeeWallet.toString());
```

## Notes

以下の注意事項は、手数料のタイミング、パーミッションレスな請求、2ステップのグラデュエーション後フロー、およびファーストバイの手数料免除について説明します。

- クリエイター手数料は各スワップでバケット（`creatorFeeAccrued`）に蓄積されますが、すぐには転送されません — 受け取るには明示的に請求インストラクションを呼び出す必要があります。`creatorFeeClaimed` は累計の請求済み合計を追跡します
- `claimBondingCurveCreatorFeeV2` と `claimRaydiumCreatorFeeV2` はともにパーミッションレスです。どのウォレットでもトリガーできますが、SOLは常に設定されたクリエイター手数料ウォレットに送られ、呼び出し元には送られません。`collectRaydiumCpmmFeesWithCreatorFeeV2` もパーミッションレスです
- グラデュエーション後の手数料には順序通り2つのステップが必要です：`collectRaydiumCpmmFeesWithCreatorFeeV2`（Raydiumプール → Genesisバケットへの収集）、次に `claimRaydiumCreatorFeeV2`（バケット → クリエイターウォレット）。両方を1つのトランザクションにまとめることができます
- `creatorFeeAccrued` と `creatorFeeClaimed` は `BondingCurveBucketV2`（アクティブカーブ）と `RaydiumCpmmBucketV2`（グラデュエーション後）の両方に存在します。それぞれ `fetchBondingCurveBucketV2` と `fetchRaydiumCpmmBucketV2` を使用します
- `creatorFeeWallet` は設定されていない場合デフォルトでローンチウォレットになります。カーブ作成後は変更できません
- ファーストバイの仕組みは、指定された初回購入のみすべての手数料（プロトコルとクリエイター）を免除します。その後のすべてのスワップは通常のクリエイター手数料を支払います
- クリエイター手数料は方向（購入または売却）に関わらずすべてのスワップのSOL側に適用されます。プロトコルスワップ手数料とは複合しません
- 現在の手数料率については[Genesis プロトコル手数料](/smart-contracts/genesis)ページを参照してください
- バケット状態の読み取り、見積もりの計算、取引の実行については[ボンディングカーブスワップ統合](/smart-contracts/genesis/bonding-curve-swaps)を参照してください

## FAQ

### `creatorFeeWallet` が設定されていない場合、デフォルトのクリエイター手数料ウォレットは何ですか？

デフォルトのクリエイター手数料ウォレットはローンチウォレット — `createLaunch` 呼び出しに署名したウォレットです。`launch` オブジェクトに `creatorFeeWallet` を明示的に設定して、手数料を他のアドレスにリダイレクトします。

### クリエイター手数料はスワップごとに転送されますか？

いいえ。クリエイター手数料は各スワップでバケット（`creatorFeeAccrued`）に蓄積されますが、すぐには転送されません。アクティブなカーブ中は `claimBondingCurveCreatorFeeV2` で請求します。グラデュエーション後は `collectRaydiumCpmmFeesWithCreatorFeeV2` でRaydiumプールからLP手数料を収集し、その後 `claimRaydiumCreatorFeeV2` でクリエイターウォレットに転送します。

### 誰でも `claimBondingCurveCreatorFeeV2` や `claimRaydiumCreatorFeeV2` を呼び出せますか？

はい。3つのパーミッションレスな手数料インストラクションはアクティブカーブとグラデュエーション後の両方のフェーズにまたがります — `collectRaydiumCpmmFeesWithCreatorFeeV2` と `claimBondingCurveCreatorFeeV2`（アクティブカーブ）、および `claimRaydiumCreatorFeeV2`（グラデュエーション後）。どのウォレットでもトリガーできますが、SOLは常に設定されたクリエイター手数料ウォレットに送られ、呼び出し元には送られません。

### `collectRaydiumCpmmFeesWithCreatorFeeV2` と `claimRaydiumCreatorFeeV2` の違いは何ですか？

`collectRaydiumCpmmFeesWithCreatorFeeV2` はRaydium CPMMプールから蓄積されたLP取引手数料をGenesisの `RaydiumCpmmBucketV2` バケットに収集します — これによりバケットの `creatorFeeAccrued` が更新されます。`claimRaydiumCreatorFeeV2` はそのバケット残高をクリエイター手数料ウォレットに転送します。収集を請求の前に実行する必要があります — 収集なしでは、請求するバケット残高がありません。

### Raydiumバケットの `creatorFeeAccrued` がプールがアクティブなのにゼロなのはなぜですか？

`RaydiumCpmmBucketV2` の `creatorFeeAccrued` は、`collectRaydiumCpmmFeesWithCreatorFeeV2` を通じてRaydiumからGenesisバケットに収集された手数料のみを反映します。LP取引手数料はまずRaydiumプールステート内に蓄積されます — 収集インストラクションを実行するまでGenesisバケットには表示されません。

### ファーストバイはクリエイター手数料を支払いますか？

いいえ。ファーストバイが設定されている場合、プロトコルスワップ手数料とクリエイター手数料の両方が、その1回の初回購入に対して免除されます。その後のすべてのスワップは通常のクリエイター手数料を支払います。

### 蓄積したクリエイター手数料を確認するにはどうすればよいですか？

アクティブカーブ中は `fetchBondingCurveBucketV2` を使用して `BondingCurveBucketV2` から `creatorFeeAccrued` フィールドを読み取ります。グラデュエーション後は `fetchRaydiumCpmmBucketV2` を使用して `RaydiumCpmmBucketV2` から `creatorFeeAccrued` を読み取ります。[蓄積したクリエイター手数料の確認](#蓄積したクリエイター手数料の確認)および[蓄積したRaydiumクリエイター手数料の確認](#蓄積したraydiumクリエイター手数料の確認)を参照してください。

### ローンチ後にクリエイター手数料ウォレットを変更できますか？

いいえ。クリエイター手数料ウォレットはカーブ作成時に設定され、カーブがライブになった後は変更できません。
