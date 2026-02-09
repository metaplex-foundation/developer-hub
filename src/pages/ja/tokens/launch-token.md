---
title: Solanaでトークンをローンチする
metaTitle: Solanaでトークンをローンチする方法 | TGE・フェアローンチガイド | Metaplex
description: Solanaでトークン生成イベント（TGE）をローンチする完全ガイド。Genesis Launch Poolsを使用したフェアトークンローンチをステップバイステップのTypeScriptコードで作成。
---

[Genesis](/ja/smart-contracts/genesis) Launch Poolsを使用してトークンをローンチします。ユーザーは設定した期間中にSOLを預け入れ、総預入額に対する自分のシェアに比例してトークンを受け取ります。 {% .lead %}

## 概要

Launch Poolトークンローンチには3つのフェーズがあります：

1. **セットアップ**（1回実行） - トークンを作成し、ローンチを設定して有効化
2. **預入期間**（ユーザーが参加） - 設定した期間中にユーザーがSOLを預け入れ
3. **ローンチ後**（あなた＋ユーザー） - トランジションを実行し、ユーザーがトークンを請求、権限を取り消し

このガイドでは、異なるステージで実行する**4つの別々のスクリプト**の作成方法を説明します：

| スクリプト | 実行タイミング | 目的 |
|--------|-------------|---------|
| `launch.ts` | 1回、開始時 | トークンを作成しローンチを有効化 |
| `transition.ts` | 預入終了後 | 収集したSOLをアンロックバケットに移動 |
| `claim.ts` | トランジション後 | ユーザーがトークンを請求するために実行 |
| `revoke.ts` | ローンチ完了時 | ミント/フリーズ権限を永久に削除 |

## 前提条件

新しいプロジェクトを作成し、依存関係をインストールします：

```bash
mkdir my-token-launch
cd my-token-launch
npm init -y
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

## 完全なローンチスクリプト

以下は完全な実行可能スクリプトです。各セクションには説明のコメントが付いています。このスクリプトを**1回**実行してローンチをセットアップします。

{% callout type="warning" title="キーペアが必要です" %}
トランザクションに署名するには、マシン上にSolanaキーペアファイルが必要です。これは通常、`~/.config/solana/id.json`にあるSolana CLIウォレットです。スクリプト内の`walletFile`パスをキーペアファイルを指すように更新してください。このウォレットにトランザクション手数料用のSOLがあることを確認してください。
{% /callout %}

`launch.ts`というファイルを作成します：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  genesis,
  initializeV2,
  findGenesisAccountV2Pda,
  findLaunchPoolBucketV2Pda,
  findUnlockedBucketV2Pda,
  addLaunchPoolBucketV2,
  addUnlockedBucketV2,
  finalizeV2,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  // ============================================
  // セットアップ: 接続とウォレットを設定
  // ============================================

  const umi = createUmi('https://api.devnet.solana.com')
    .use(genesis());

  // マシン上のファイルからウォレットキーペアを読み込み
  // これは通常、~/.config/solana/id.jsonにあるSolana CLIウォレットです
  // または、アクセス可能な任意のキーペアファイルを使用
  const walletFile = '/path/to/your/keypair.json'; // <-- このパスを更新
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // ============================================
  // 設定: これらの値をカスタマイズ
  // ============================================

  // トークンの詳細
  const TOKEN_NAME = 'My Token';
  const TOKEN_SYMBOL = 'MTK';
  const TOKEN_URI = 'https://example.com/metadata.json'; // メタデータJSON URL
  const TOTAL_SUPPLY = 1_000_000_000_000n; // 1兆トークン（必要に応じて調整）

  // タイミング（現在からの秒数）
  const DEPOSIT_DURATION = 24 * 60 * 60; // 24時間
  const CLAIM_DURATION = 7 * 24 * 60 * 60; // 7日

  // タイムスタンプを計算
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now;
  const depositEnd = now + BigInt(DEPOSIT_DURATION);
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + BigInt(CLAIM_DURATION);

  // ============================================
  // ステップ1: トークンを作成
  // ============================================
  console.log('ステップ1: トークンを作成中...');

  const baseMint = generateSigner(umi);

  const [genesisAccount] = findGenesisAccountV2Pda(umi, {
    baseMint: baseMint.publicKey,
    genesisIndex: 0,
  });

  await initializeV2(umi, {
    baseMint,
    fundingMode: 0,
    totalSupplyBaseToken: TOTAL_SUPPLY,
    name: TOKEN_NAME,
    uri: TOKEN_URI,
    symbol: TOKEN_SYMBOL,
  }).sendAndConfirm(umi);

  console.log('✓ トークン作成完了！');
  console.log('  トークンミント:', baseMint.publicKey);
  console.log('  Genesisアカウント:', genesisAccount);

  // ============================================
  // ステップ2: Launch Poolバケットを追加
  // ここにユーザーがSOLを預け入れます
  // ============================================
  console.log('\nステップ2: Launch Poolバケットを追加中...');

  const [launchPoolBucket] = findLaunchPoolBucketV2Pda(umi, {
    genesisAccount,
    bucketIndex: 0,
  });

  const [unlockedBucket] = findUnlockedBucketV2Pda(umi, {
    genesisAccount,
    bucketIndex: 0,
  });

  await addLaunchPoolBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: TOTAL_SUPPLY,
    depositStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositStart,
      triggeredTimestamp: null,
    },
    depositEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: depositEnd,
      triggeredTimestamp: null,
    },
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: null,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: null,
    },
    minimumDepositAmount: null,
    endBehaviors: [
      {
        __kind: 'SendQuoteTokenPercentage',
        padding: Array(4).fill(0),
        destinationBucket: publicKey(unlockedBucket),
        percentageBps: 10000, // 収集したSOLの100%がアンロックバケットへ
        processed: false,
      },
    ],
  }).sendAndConfirm(umi);

  console.log('✓ Launch Poolバケット追加完了！');
  console.log('  バケットアドレス:', launchPoolBucket);

  // ============================================
  // ステップ3: アンロックバケットを追加
  // ここに収集したSOLがチームに送られます
  // ============================================
  console.log('\nステップ3: アンロックバケットを追加中...');

  await addUnlockedBucketV2(umi, {
    genesisAccount,
    baseMint: baseMint.publicKey,
    baseTokenAllocation: 0n,
    recipient: umi.identity.publicKey,
    claimStartCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimStart,
      triggeredTimestamp: null,
    },
    claimEndCondition: {
      __kind: 'TimeAbsolute',
      padding: Array(47).fill(0),
      time: claimEnd,
      triggeredTimestamp: null,
    },
    backendSigner: null,
  }).sendAndConfirm(umi);

  console.log('✓ アンロックバケット追加完了！');
  console.log('  バケットアドレス:', unlockedBucket);

  // ============================================
  // ステップ4: ファイナライズ - ローンチを有効化
  // この後は変更できません
  // ============================================
  console.log('\nステップ4: ファイナライズ中...');

  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('✓ ローンチが有効になりました！');

  // ============================================
  // サマリー: これらのアドレスを保存！
  // ============================================
  console.log('\n========================================');
  console.log('ローンチ完了 - これらのアドレスを保存：');
  console.log('========================================');
  console.log('トークンミント:', baseMint.publicKey);
  console.log('Genesisアカウント:', genesisAccount);
  console.log('Launch Poolバケット:', launchPoolBucket);
  console.log('アンロックバケット:', unlockedBucket);
  console.log('');
  console.log('タイミング:');
  console.log('預入開始:', new Date(Number(depositStart) * 1000).toISOString());
  console.log('預入終了:', new Date(Number(depositEnd) * 1000).toISOString());
  console.log('請求開始:', new Date(Number(claimStart) * 1000).toISOString());
  console.log('請求終了:', new Date(Number(claimEnd) * 1000).toISOString());
}

main().catch(console.error);
```

スクリプトを実行：

```bash
npx ts-node launch.ts
```

**表示されたアドレスを保存してください！** 次のステップで必要になります。

## 次に何が起こるか

ローンチスクリプトを実行すると、ローンチがライブになります。各フェーズで何が起こるかを説明します：

### 預入期間中

ユーザーはフロントエンドまたはSDKを直接使用してSOLを預け入れます。各預入：
- 2%の手数料が適用されます
- 預入PDAで追跡されます
- 一部または全額を引き出し可能（2%の手数料あり）

### 預入終了後

預入期間が終了したら、収集したSOLをアンロックバケットに移動するために**トランジション**を実行する必要があります。`transition.ts`というファイルを作成します：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  genesis,
  transitionV2,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(genesis());

  // ウォレットキーペアを読み込み（ローンチで使用したのと同じウォレット）
  const walletFile = '/path/to/your/keypair.json'; // <-- このパスを更新
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // ローンチスクリプトで表示されたアドレスを入力
  const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT');
  const baseMint = publicKey('YOUR_TOKEN_MINT');
  const launchPoolBucket = publicKey('YOUR_LAUNCH_POOL_BUCKET');
  const unlockedBucket = publicKey('YOUR_UNLOCKED_BUCKET');

  const unlockedBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
    owner: unlockedBucket,
    mint: WRAPPED_SOL_MINT,
  });

  console.log('トランジションを実行中...');

  await transitionV2(umi, {
    genesisAccount,
    primaryBucket: launchPoolBucket,
    baseMint,
  })
    .addRemainingAccounts([
      {
        pubkey: unlockedBucket,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: publicKey(unlockedBucketQuoteTokenAccount),
        isSigner: false,
        isWritable: true,
      },
    ])
    .sendAndConfirm(umi);

  console.log('✓ トランジション完了！SOLがアンロックバケットに移動しました。');
}

main().catch(console.error);
```

預入期間終了後に実行：

```bash
npx ts-node transition.ts
```

### ユーザーがトークンを請求

トランジション後、ユーザーはトークンを請求できます。各ユーザーは総預入額に対する自分のシェアに比例してトークンを受け取ります：

```
userTokens = (userDeposit / totalDeposits) * totalTokenSupply
```

ユーザーはフロントエンドまたはこのスクリプトを使用して請求できます（`claim.ts`を作成）：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  genesis,
  claimLaunchPoolV2,
} from '@metaplex-foundation/genesis';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(genesis());

  // ユーザーのウォレットキーペアを読み込み（SOLを預け入れた人）
  const walletFile = '/path/to/your/keypair.json'; // <-- このパスを更新
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // ローンチからのアドレスを入力
  const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT');
  const baseMint = publicKey('YOUR_TOKEN_MINT');
  const launchPoolBucket = publicKey('YOUR_LAUNCH_POOL_BUCKET');

  console.log('トークンを請求中...');

  await claimLaunchPoolV2(umi, {
    genesisAccount,
    bucket: launchPoolBucket,
    baseMint,
    recipient: umi.identity.publicKey,
  }).sendAndConfirm(umi);

  console.log('✓ トークン請求完了！');
}

main().catch(console.error);
```

### 最終化: 権限を取り消し

ローンチが完了したら、ミントとフリーズの権限を取り消します。これにより、追加のトークンを発行できないことをホルダーに示します。

{% callout type="warning" %}
**これは元に戻せません。** 一度取り消すと、追加のトークンを発行したりアカウントをフリーズしたりすることはできません。ローンチが完了したことが確実な場合のみ実行してください。
{% /callout %}

`revoke.ts`を作成：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  genesis,
  revokeMintAuthorityV2,
  revokeFreezeAuthorityV2,
} from '@metaplex-foundation/genesis';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(genesis());

  // ウォレットキーペアを読み込み（ローンチで使用したのと同じウォレット）
  const walletFile = '/path/to/your/keypair.json'; // <-- このパスを更新
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // ローンチからのトークンミントアドレスを入力
  const baseMint = publicKey('YOUR_TOKEN_MINT');

  console.log('ミント権限を取り消し中...');
  await revokeMintAuthorityV2(umi, {
    baseMint,
  }).sendAndConfirm(umi);
  console.log('✓ ミント権限取り消し完了');

  console.log('フリーズ権限を取り消し中...');
  await revokeFreezeAuthorityV2(umi, {
    baseMint,
  }).sendAndConfirm(umi);
  console.log('✓ フリーズ権限取り消し完了');

  console.log('\n✓ ローンチ完了！トークンは完全に分散化されました。');
}

main().catch(console.error);
```

## 次のステップ

- [Genesis概要](/ja/smart-contracts/genesis) - Genesisのコンセプトについて詳しく学ぶ
- [Launch Pool](/ja/smart-contracts/genesis/launch-pool) - Launch Poolの詳細ドキュメント
- [Aggregation API](/ja/smart-contracts/genesis/aggregation) - APIでローンチデータをクエリ
