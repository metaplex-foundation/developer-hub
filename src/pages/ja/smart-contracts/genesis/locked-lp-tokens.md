---
title: Locked LP Tokens
metaTitle: グラデュエーション時のLPトークンロック | Genesis Bonding Curve | Metaplex
description: Genesis のボンディングカーブがグラデュエーションすると、Raydium CPMM プールの LP トークンは Genesis バケットにプログラムロックされ、ベスティングは「Never」に設定されます。オンチェーンでロックを検証する方法を学びます。
created: '04-22-2026'
updated: '04-22-2026'
keywords:
  - locked LP tokens
  - LP token lock
  - graduation
  - bonding curve graduation
  - Raydium CPMM
  - program locked
  - program locked liquidity
  - Genesis
  - LP burn
  - liquidity lock
about:
  - LP token locking
  - Bonding curve graduation
  - Raydium CPMM liquidity
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: グラデュエーション時に LP トークンはバーンされますか、それともロックされますか？
    a: LP トークンはバーンされず、プログラムロックされます。Genesis バケット署名者 PDA が所有する関連トークンアカウントに転送されます。バケットの lpLockSchedule は startCondition と cliffCondition の両方が Never に設定されており、どのウォレットも請求できません。
  - q: ロックされた LP トークンを引き出すことは誰かにできますか？
    a: いいえ。RaydiumCpmmBucketV2 アカウントの lpLockSchedule は startCondition と cliffCondition の両方が Never に設定されています。これらをリリースできる命令や権限は存在しません。
  - q: LP トークンがオンチェーンでロックされていることをどのように検証できますか？
    a: Genesis SDK を使用して RaydiumCpmmBucketV2 アカウントを取得し、extensions.lpLockSchedule の startCondition.__kind と cliffCondition.__kind の両方が Never に設定されていることを確認してください。lpTokenBalance フィールドには保有されている LP トークンの正確な数が表示されます。
  - q: LP トークンをバーンすることとプログラムロックすることの違いは何ですか？
    a: バーンは SPL token burn 命令を介してトークンを破棄し、流通から永続的に削除します。プログラムロックはベスティングを「Never」に設定した PDA にトークンを転送します。トークンはオンチェーンに残り検証可能ですが、どのウォレットも引き出すことはできません。どちらのアプローチでも流動性は永続的になります。
---

[ボンディングカーブのグラデュエーション](/ja/smart-contracts/genesis/bonding-curve#lifecycle)中に作成された LP トークンは、Genesis が所有するバケットにプログラムロックされます。どのウォレットも引き出すことはできません。 {% .lead %}

## 概要

Genesis のボンディングカーブが完売して [Raydium CPMM](/ja/smart-contracts/genesis/bonding-curve-theory#phase-3-graduated) プールにグラデュエーションすると、得られた LP トークンは Genesis プログラムが所有する PDA に転送されます。このバケットのベスティングスケジュールは `Never` に設定されており、トークンへのアクセスができなくなります。

- **LP トークンはバーンされません** — ベスティングが never に設定された Genesis バケット署名者 PDA に転送されます
- **プログラムロック** — `lpLockSchedule.startCondition` と `cliffCondition` は両方とも `Never` であり、どの命令や権限もリリースできません
- **オンチェーンで検証可能** — `RaydiumCpmmBucketV2` アカウントを取得してロックスケジュールとトークン残高を確認できます
- **自動的に発生** — ロックはグラデュエーションプロセスの一部として実行され、手動操作は不要です

## LP トークンロックの仕組み

グラデュエーション中、LP トークンは**バケット署名者 PDA**（秘密鍵を持たないプログラム派生アドレス）が所有する ATA にデポジットされます。`RaydiumCpmmBucketV2` アカウントは、`lpLockSchedule.startCondition` と `cliffCondition` の両方を `{ __kind: 'Never' }` に設定することでロックし、引き出しを防止します。

{% callout type="note" %}
一部のプラットフォームではこれを LP トークンの「バーン」と呼びます。Genesis では LP トークンはバーンアドレスに送信されません。検証可能なオンチェーンアカウントに残ります。**プログラムロック**という用語の方が正確です。トークンは存在し監査可能ですが、どのウォレットもアクセスできないからです。
{% /callout %}

### グラデュエーションフロー

1. ボンディングカーブが完売する（`baseTokenBalance` がゼロに達する）
2. グラデュエーションが自動的に発火する — 蓄積された SOL とトークンが Raydium CPMM プールに移行する
3. Raydium が LP トークンを Genesis プログラムに返す
4. LP トークンはバケット署名者の ATA にデポジットされる
5. `lpLockSchedule.startCondition` と `cliffCondition` が `Never` に設定される — LP トークンがプログラムロックされる

## LP トークンロックの検証

`RaydiumCpmmBucketV2` アカウントを取得し、`lpLockSchedule` 拡張を検査して LP トークンがロックされていることを確認します。

### アカウントの導出

LP トークンロックを構成する 3 つのアカウント：

| アカウント | 説明 | 導出方法 |
|---------|-------------|---------------|
| **Raydium Bucket PDA** | グラデュエーション状態とロック設定を保存する `RaydiumCpmmBucketV2` アカウント | `findRaydiumCpmmBucketV2Pda(umi, { genesisAccount, bucketIndex })` |
| **Bucket Signer PDA** | LP トークン ATA を所有する PDA — 秘密鍵を持たない | `findRaydiumBucketSignerPda(umi, { bucket })` |
| **Bucket Signer ATA** | ロックされた LP トークンを保持する関連トークンアカウント | バケット署名者 + LP ミントを使用した標準的な ATA 導出 |

### ロックの取得と確認

```typescript {% title="verify-lp-lock.ts" showLineNumbers=true %}
import {
  genesis,
  findRaydiumCpmmBucketV2Pda,
  fetchRaydiumCpmmBucketV2,
  findRaydiumBucketSignerPda,
  findLpMintPda,
  RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';

const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis());

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

// 1. Derive the Raydium bucket PDA
const [raydiumBucketPda] = findRaydiumCpmmBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

// 2. Fetch the bucket account
const raydiumBucket = await fetchRaydiumCpmmBucketV2(umi, raydiumBucketPda);

// 3. Check the LP lock schedule
const lpLockSchedule = raydiumBucket.extensions.lpLockSchedule;

if (lpLockSchedule.__option === 'Some') {
  const schedule = lpLockSchedule.value;
  console.log('LP lock start condition:', schedule.startCondition.__kind);
  console.log('LP lock cliff condition:', schedule.cliffCondition.__kind);
  // Expected output: both "Never"
}

console.log('LP token balance:', raydiumBucket.lpTokenBalance);

// 4. Derive the bucket signer PDA
const [bucketSignerPda] = findRaydiumBucketSignerPda(umi, {
  bucket: raydiumBucketPda,
});

console.log('Bucket signer (LP token owner):', bucketSignerPda);

// 5. Derive the LP mint from the pool state
const [lpMint] = findLpMintPda(umi, RAYDIUM_CP_SWAP_PROGRAM_ID_MAINNET, raydiumBucket.poolState);

// 6. Derive the bucket signer's ATA for the LP mint
const [bucketSignerAta] = findAssociatedTokenPda(umi, {
  mint: lpMint,
  owner: bucketSignerPda,
});

console.log('LP mint:', lpMint);
console.log('Bucket signer ATA (holds LP tokens):', bucketSignerAta);
```

### 期待される出力

LP トークンがプログラムロックされている場合、出力は以下を確認します：

```
LP lock start condition: Never
LP lock cliff condition: Never
LP token balance: 123456789
Bucket signer (LP token owner): <PDA address>
LP mint: <LP mint address>
Bucket signer ATA (holds LP tokens): <ATA address>
```

`startCondition.__kind` の値が `Never` であることはベスティングが開始されないことを確認し、`cliffCondition` の `Never` はクリフリリースがないことを確認します。これらを合わせて、LP トークンが引き出せないことを証明します。

## RaydiumCpmmBucketV2 アカウントフィールド

LP トークンロックに関連する `RaydiumCpmmBucketV2` アカウントの主要フィールド：

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `lpTokenBalance` | `bigint` | バケット署名者の ATA に保持されている LP トークンの数 |
| `lpClaimAuthority` | `Option<PublicKey>` | LP トークンを請求できる権限 — 権限が設定されていない場合は `None` |
| `lpTokensClaimed` | `bigint` | 累計請求済み LP トークン（完全にロックされている場合はゼロ） |
| `bucketSigner` | `PublicKey` | LP トークンを保持する ATA を所有する PDA |
| `extensions.lpLockSchedule` | `Option<ClaimSchedule>` | LP トークンのベスティングスケジュール — `startCondition` は `Never` に設定 |
| `poolState` | `PublicKey` | Raydium CPMM プール状態アカウントのアドレス（LP ミントではない — LP ミントを取得するにはプール状態を読み取ります） |

### ClaimSchedule フィールド

`lpLockSchedule` 拡張は以下のフィールドを持つ `ClaimSchedule` です：

| フィールド | 型 | 説明 |
|-------|------|-------------|
| `startCondition` | `Condition` | 請求が開始できるタイミング — プログラムロックの場合は `{ __kind: 'Never' }` |
| `duration` | `bigint` | ベスティング期間（秒）（開始が `Never` の場合は無関係） |
| `period` | `bigint` | ベスティング期間の間隔（開始が `Never` の場合は無関係） |
| `cliffCondition` | `Condition` | ベスティングのクリフ条件 — LP ロックの場合も `{ __kind: 'Never' }` |
| `cliffAmountBps` | `number` | クリフアンロックパーセンテージ（ベーシスポイント）（開始が `Never` の場合は無関係） |

{% callout type="note" %}
`duration`、`period`、`cliffAmountBps` フィールドは `ClaimSchedule` 構造体に存在しますが、`startCondition` と `cliffCondition` の両方が `Never` の場合、機能的には無関係です。ベスティングもクリフリリースも開始できません。
{% /callout %}


## FAQ

### グラデュエーション時に LP トークンはバーンされますか、それともロックされますか？

LP トークンはバーンされず、プログラムロックされます。Genesis バケット署名者 PDA が所有する[関連トークンアカウント](/ja/solana/understanding-solana-accounts#associated-token-accounts-atas)に転送されます。バケットの `lpLockSchedule` は `startCondition` と `cliffCondition` の両方が `Never` に設定されており、どのウォレットも請求できません。

### ロックされた LP トークンを引き出すことは誰かにできますか？

いいえ。`RaydiumCpmmBucketV2` アカウントの `lpLockSchedule` は `startCondition` と `cliffCondition` の両方が `Never` に設定されています。これらをリリースできる命令や権限は存在しません。

### LP トークンがオンチェーンでロックされていることをどのように検証できますか？

Genesis SDK を使用して `RaydiumCpmmBucketV2` アカウントを取得し、`extensions.lpLockSchedule` の `startCondition.__kind` と `cliffCondition.__kind` の両方が `Never` に設定されていることを確認してください。`lpTokenBalance` フィールドには保有されている LP トークンの正確な数が表示されます。完全なコード例については [LP トークンロックの検証](#lp-トークンロックの検証) を参照してください。

### LP トークンをバーンすることとプログラムロックすることの違いは何ですか？

バーンは SPL token burn 命令を介してトークンを破棄し、流通から永続的に削除します。プログラムロックはベスティングを `Never` に設定した PDA にトークンを転送します — トークンはオンチェーンに残り検証可能ですが、どのウォレットも引き出すことはできません。どちらのアプローチでも流動性は永続的になります。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Graduation** | ボンディングカーブが完売したときにトリガーされる自動プロセス — 蓄積された SOL とトークンを Raydium CPMM プールに移行 |
| **LP Token** | Raydium CPMM プールのシェアを表す流動性プロバイダートークン |
| **Program-Locked** | 引き出し経路のない PDA 所有アカウントに保持されたトークン — アクセス不可だがオンチェーンで検証可能 |
| **Bucket Signer PDA** | LP トークンを保持する ATA を所有するプログラム派生アドレス；秘密鍵を持たない |
| **ClaimSchedule** | 開始条件、期間、間隔、クリフを持つベスティング設定 — Raydium バケットで LP トークンのリリースルールを定義するために使用 |
| **Condition: Never** | 決して満たされない条件バリアント — `lpLockSchedule` の `startCondition` と `cliffCondition` の両方として使用され、LP トークンの請求を防止 |
| **RaydiumCpmmBucketV2** | Raydium プール参照、LP トークン残高、ロックスケジュールを含むグラデュエーション後の状態を保存する Genesis アカウント |
