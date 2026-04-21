---
title: Genesis ボンディングカーブのクリエイター手数料
metaTitle: Genesis ボンディングカーブのクリエイター手数料 — 設定と請求 | Metaplex
description: Genesis ボンディングカーブのローンチでクリエイター手数料を設定し、アクティブなカーブ中およびRaydium CPMMプールへのグラデュエーション後に蓄積した手数料を請求する方法。
keywords:
  - creator fee
  - bonding curve
  - genesis
  - claimBondingCurveCreatorFeeV2
  - claimRaydiumCreatorFeeV2
  - creatorFeeWallet
  - creatorFeeAccrued
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
updated: '04-09-2026'
howToSteps:
  - Set creatorFeeWallet in the launch object when calling createAndRegisterLaunch
  - After launch, monitor creatorFeeAccrued in the bucket account using fetchBondingCurveBucketV2
  - Call claimBondingCurveCreatorFeeV2 to collect accrued fees during the active curve
  - After graduation, call claimRaydiumCreatorFeeV2 to collect fees from the Raydium CPMM pool
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: creatorFeeWalletが設定されていない場合、デフォルトのクリエイター手数料ウォレットは何ですか？
    a: デフォルトはローンチウォレット — createLaunch呼び出しに署名したウォレットです。launchオブジェクトにcreatorFeeWalletを明示的に設定して、手数料を他のアドレスにリダイレクトします。
  - q: クリエイター手数料はスワップごとに転送されますか？
    a: いいえ。クリエイター手数料は各スワップでバケット（creatorFeeAccrued）に蓄積されますが、すぐには転送されません。アクティブなカーブ中はclaimBondingCurveCreatorFeeV2で、グラデュエーション後はclaimRaydiumCreatorFeeV2で請求します。
  - q: 誰でもclaimBondingCurveCreatorFeeV2を呼び出せますか？
    a: はい。3つのパーミッションレスな手数料インストラクションはアクティブカーブとグラデュエーション後の両方のフェーズにまたがります — collectRaydiumCpmmFeesWithCreatorFeeV2とclaimBondingCurveCreatorFeeV2（アクティブカーブ）、およびclaimRaydiumCreatorFeeV2（グラデュエーション後）。どのウォレットでもトリガーできますが、SOLは常に設定されたクリエイター手数料ウォレットに送られ、呼び出し元には送られません。
  - q: ファーストバイはクリエイター手数料を支払いますか？
    a: いいえ。ファーストバイが設定されている場合、プロトコルスワップ手数料とクリエイター手数料の両方が、その1回の初回購入に対して免除されます。その後のすべてのスワップは通常のクリエイター手数料を支払います。
  - q: 蓄積したクリエイター手数料を確認するにはどうすればよいですか？
    a: アクティブカーブ中はfetchBondingCurveBucketV2を使用してBondingCurveBucketV2からcreatorFeeAccruedフィールドを読み取ります。グラデュエーション後はfetchRaydiumCpmmBucketV2を使用してRaydiumCpmmBucketV2からcreatorFeeAccruedを読み取ります。蓄積したクリエイター手数料の確認セクションを参照してください。
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
- **グラデュエーション後の請求** — `claimRaydiumCreatorFeeV2` でカーブがグラデュエーションした後にRaydium CPMMプールから手数料を回収する

スワップ価格設定とプロトコルスワップ手数料とのクリエイター手数料の相互作用については、[動作理論 — 手数料構造](/smart-contracts/genesis/bonding-curve-theory#fee-structure)を参照してください。

## クイックスタート

このセクションでは、アクティブカーブとグラデュエーション後の両フェーズでクリエイター手数料を設定および請求するための最小限の手順を説明します。

### クイックリファレンス

| インストラクション | 使用タイミング | 必要なアカウント | 出力 / 効果 |
|---|---|---|---|
| `createAndRegisterLaunch`（`creatorFeeWallet` 設定） | カーブ作成時 | クリエイターウォレット、ローンチ署名者 | バケットに手数料ウォレットが設定される |
| `fetchBondingCurveBucketV2`（`creatorFeeAccrued` 読み取り） | アクティブカーブ中いつでも | バケットPDA | 現在の蓄積手数料残高（lamports） |
| `claimBondingCurveCreatorFeeV2` | アクティブカーブ — 蓄積手数料の回収 | Genesisアカウント、バケットPDA、ベースミント、クリエイター手数料ウォレット | 蓄積SOLがクリエイターウォレットに転送 |
| `collectRaydiumCpmmFeesWithCreatorFeeV2` | グラデュエーション後 — LP手数料のハーベスト | Genesisアカウント、RaydiumプールPDA、Raydiumバケット PDA | LP手数料がRaydiumプールからGenesisバケットに移動 |
| `claimRaydiumCreatorFeeV2` | グラデュエーション後 — バケット残高の請求 | Genesisアカウント、RaydiumバケットPDA、ベース/クォートミント、クリエイター手数料ウォレット | バケット残高がクリエイターウォレットに転送 |

**ジャンプ:** [ローンチ時の設定](#ローンチ時のクリエイター手数料の設定) · [ウォレットへのリダイレクト](#クリエイター手数料を特定のウォレットにリダイレクトする) · [エージェントPDA](#エージェントローンチ自動pda ルーティング) · [ファーストバイとの組み合わせ](#クリエイター手数料とファーストバイの組み合わせ) · [蓄積確認](#蓄積したクリエイター手数料の確認) · [カーブ中の請求](#アクティブなカーブ中のクリエイター手数料の請求) · [グラデュエーション後の請求](#グラデュエーション後のクリエイター手数料の請求)

1. `createAndRegisterLaunch` を呼び出すときに `launch` オブジェクトに `creatorFeeWallet` を設定する
2. ローンチ後、`bucket.creatorFeeAccrued` を監視して蓄積手数料を追跡する
3. `claimBondingCurveCreatorFeeV2` を呼び出してカーブがアクティブな間に手数料を回収する
4. グラデュエーション後、`claimRaydiumCreatorFeeV2` を呼び出してRaydium LP手数料を回収する

## 前提条件

Genesis SDK、設定済みのUmiインスタンス、および入金済みのSolanaウォレットが必要です。

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

以下の注意事項は、手数料のタイミング、パーミッションレスな請求、2ステップのグラデュエーション後フロー、およびファーストバイの手数料免除について説明します。

- クリエイター手数料は各スワップでバケット（`creatorFeeAccrued`）に蓄積されますが、すぐには転送されません — 受け取るには明示的に請求インストラクションを呼び出す必要があります。`creatorFeeClaimed` は累計の請求済み合計を追跡します
- 両方の請求インストラクションはパーミッションレスです。どのウォレットでもトリガーできますが、SOLは常に設定されたクリエイター手数料ウォレットに送られ、呼び出し元には送られません
- `creatorFeeWallet` は設定されていない場合デフォルトでローンチウォレットになります。カーブ作成後は変更できません
- ファーストバイの仕組みは、指定された初回購入のみすべての手数料（プロトコルとクリエイター）を免除します。その後のすべてのスワップは通常のクリエイター手数料を支払います
- クリエイター手数料は方向（購入または売却）に関わらずすべてのスワップのSOL側に適用されます。プロトコルスワップ手数料とは複合しません
- 現在の手数料率については[Genesis プロトコル手数料](/smart-contracts/genesis)ページを参照してください
- バケット状態の読み取り、見積もりの計算、取引の実行については[ボンディングカーブスワップ統合](/smart-contracts/genesis/bonding-curve-swaps)を参照してください

## FAQ

### `creatorFeeWallet` が設定されていない場合、デフォルトのクリエイター手数料ウォレットは何ですか？

デフォルトのクリエイター手数料ウォレットはローンチウォレット — `createLaunch` 呼び出しに署名したウォレットです。`launch` オブジェクトに `creatorFeeWallet` を明示的に設定して、手数料を他のアドレスにリダイレクトします。

### クリエイター手数料はスワップごとに転送されますか？

いいえ。クリエイター手数料は各スワップでバケット（`creatorFeeAccrued`）に蓄積されますが、すぐには転送されません。アクティブなカーブ中は `claimBondingCurveCreatorFeeV2` で、グラデュエーション後は `claimRaydiumCreatorFeeV2` で請求します。

### 誰でも `claimBondingCurveCreatorFeeV2` を呼び出せますか？

はい。3つのパーミッションレスな手数料インストラクションはアクティブカーブとグラデュエーション後の両方のフェーズにまたがります — `collectRaydiumCpmmFeesWithCreatorFeeV2` と `claimBondingCurveCreatorFeeV2`（アクティブカーブ）、および `claimRaydiumCreatorFeeV2`（グラデュエーション後）。どのウォレットでもトリガーできますが、SOLは常に設定されたクリエイター手数料ウォレットに送られ、呼び出し元には送られません。

### ファーストバイはクリエイター手数料を支払いますか？

いいえ。ファーストバイが設定されている場合、プロトコルスワップ手数料とクリエイター手数料の両方が、その1回の初回購入に対して免除されます。その後のすべてのスワップは通常のクリエイター手数料を支払います。

### 蓄積したクリエイター手数料を確認するにはどうすればよいですか？

アクティブカーブ中は `fetchBondingCurveBucketV2` を使用して `BondingCurveBucketV2` から `creatorFeeAccrued` フィールドを読み取ります。グラデュエーション後は `fetchRaydiumCpmmBucketV2` を使用して `RaydiumCpmmBucketV2` から `creatorFeeAccrued` を読み取ります。[蓄積したクリエイター手数料の確認](#蓄積したクリエイター手数料の確認)を参照してください。

### ローンチ後にクリエイター手数料ウォレットを変更できますか？

いいえ。クリエイター手数料ウォレットはカーブ作成時に設定され、カーブがライブになった後は変更できません。
