---
title: Solanaでトークンをローンチする
metaTitle: Solanaでトークンをローンチする — Genesis フェアローンチガイド | Metaplex
description: Genesis Launch Pool を使って Solana 上で SPL トークンをローンチする TypeScript ステップバイステップガイド。透明な価格発見を伴う、公平なオンチェーントークン配布。
cli: /dev-tools/cli/genesis/launch
---

[Genesis](/ja/smart-contracts/genesis) Launch Pool を使用して Solana 上で SPL トークンをローンチします。このガイドでは、ユーザーが一定期間中に SOL を預け入れ、総預入額に対するシェアに比例してトークンを受け取るフェアローンチを、すべてオンチェーンで透明に行う手順を説明します。 {% .lead %}

{% callout type="note" title="ノーコードオプション" %}
コードを書きたくない場合は、[Metaplex トークンローンチパッド](https://www.metaplex.com)を使えば、コーディング不要でトークンをローンチできます。このガイドは、独自のトークンローンチ体験を構築したい開発者、または Genesis SDK を使って自社ウェブサイトでトークンセールを開催したい開発者向けです。
{% /callout %}

{% callout type="note" title="その他のローンチ方式" %}
このガイドでは **Launch Pool** 方式のフェアローンチを説明しますが、Genesis は固定価格でトークンを販売する **[プレセール](/ja/smart-contracts/genesis/presale)** もサポートしています。[Genesis 概要](/ja/smart-contracts/genesis)で各方式を比較し、プロジェクトに最適な方法を選択してください。
{% /callout %}

## 概要

Genesis は、公平なオンチェーンのトークンローンチ機構を提供する Solana のトークンローンチパッドです。固定価格でトークンを販売する中央集権型のトークンセールプラットフォームとは異なり、Launch Pool では市場がトークン配布を決定します。すべての参加者は預入額に比例してトークンを受け取るため、公平で透明なトークン生成イベント（TGE）が保証されます。SPL トークンの作成、資金調達、配布はすべて仲介者なしでオンチェーンで行われます。

Launch Pool によるトークンローンチには3つのフェーズがあります：

1. **セットアップ**（1回だけ実行）- トークンの作成、ローンチの設定、アクティベート
2. **入金期間**（ユーザーが操作）- 設定した期間中にユーザーが SOL を預け入れる
3. **ローンチ後**（あなたとユーザー）- ステートマシンを進行（crank）し、ユーザーがトークンを請求し、あなたが権限を取り消す

このガイドでは、段階ごとに実行する**4つの独立したスクリプト**を作成します：

| スクリプト | 実行タイミング | 目的 |
|--------|-------------|---------|
| `launch.ts` | 開始時に1回 | トークンを作成し、ローンチをアクティベートします |
| `crank.ts` | 入金終了後 | 条件とビヘイビアをトリガーして、SOL をアンロック済みバケットに移動します |
| `claim.ts` | crank 後 | ユーザーがトークンを請求するために実行します |
| `revoke.ts` | ローンチ完了時 | ミント/フリーズ権限を永久に削除します |

## 前提条件

新しいプロジェクトを作成し、依存関係をインストールします：

```bash
mkdir my-token-launch
cd my-token-launch
npm init -y
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

## 完全なローンチスクリプト

以下は、完全で実行可能なスクリプトです。各セクションには動作を説明するコメントが付いています。このスクリプトは、ローンチのセットアップのために**1回だけ**実行します。

{% callout type="warning" title="キーペアが必要です" %}
トランザクションに署名するには、マシン上に Solana キーペアファイルが必要です。通常は `~/.config/solana/id.json` にある Solana CLI ウォレットです。スクリプト内の `walletFile` パスをキーペアファイルのパスに更新してください。このウォレットにトランザクション手数料用の SOL があることを確認してください。
{% /callout %}

`launch.ts` というファイルを作成します：

```typescript
import { readFileSync } from 'fs';
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
  // SETUP: Configure your connection and wallet
  // ============================================

  const umi = createUmi('https://api.devnet.solana.com')
    .use(genesis());

  // Load your wallet keypair from a file on your machine
  // This is typically your Solana CLI wallet at ~/.config/solana/id.json
  // Or use any keypair file you have access to
  const walletFile = '/path/to/your/keypair.json'; // <-- UPDATE THIS PATH
  const secretKey = JSON.parse(readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // ============================================
  // CONFIGURATION: Customize these values
  // ============================================

  // Token details
  const TOKEN_NAME = 'My Token';
  const TOKEN_SYMBOL = 'MTK';
  const TOKEN_URI = 'https://example.com/metadata.json'; // Your metadata JSON URL
  const TOTAL_SUPPLY = 1_000_000_000_000n; // 1 trillion tokens (adjust as needed)

  // Timing (in seconds from now)
  const DEPOSIT_DURATION = 24 * 60 * 60; // 24 hours
  const CLAIM_DURATION = 7 * 24 * 60 * 60; // 7 days

  // Calculate timestamps
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now;
  const depositEnd = now + BigInt(DEPOSIT_DURATION);
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + BigInt(CLAIM_DURATION);

  // ============================================
  // STEP 1: Create your token
  // ============================================
  console.log('Step 1: Creating token...');

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

  console.log('✓ Token created!');
  console.log('  Token mint:', baseMint.publicKey);
  console.log('  Genesis account:', genesisAccount);

  // ============================================
  // STEP 2: Add Launch Pool bucket
  // This is where users will deposit SOL
  // ============================================
  console.log('\nStep 2: Adding Launch Pool bucket...');

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
    softCap: null, // required since genesis 0.42.0; pass null for no soft cap
    endBehaviors: [
      {
        __kind: 'SendQuoteTokenPercentage',
        padding: Array(4).fill(0),
        destinationBucket: publicKey(unlockedBucket),
        percentageBps: 10000, // 100% of collected SOL goes to unlocked bucket
        processed: false,
      },
    ],
  }).sendAndConfirm(umi);

  console.log('✓ Launch Pool bucket added!');
  console.log('  Bucket address:', launchPoolBucket);

  // ============================================
  // STEP 3: Add Unlocked bucket
  // This receives the collected SOL for your team
  // ============================================
  console.log('\nStep 3: Adding Unlocked bucket...');

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

  console.log('✓ Unlocked bucket added!');
  console.log('  Bucket address:', unlockedBucket);

  // ============================================
  // STEP 4: Finalize - activates the launch
  // After this, no more changes can be made
  // ============================================
  console.log('\nStep 4: Finalizing...');

  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('✓ Launch is now ACTIVE!');

  // ============================================
  // SUMMARY: Save these addresses!
  // ============================================
  console.log('\n========================================');
  console.log('LAUNCH COMPLETE - SAVE THESE ADDRESSES:');
  console.log('========================================');
  console.log('Token mint:', baseMint.publicKey);
  console.log('Genesis account:', genesisAccount);
  console.log('Launch Pool bucket:', launchPoolBucket);
  console.log('Unlocked bucket:', unlockedBucket);
  console.log('');
  console.log('TIMING:');
  console.log('Deposits open:', new Date(Number(depositStart) * 1000).toISOString());
  console.log('Deposits close:', new Date(Number(depositEnd) * 1000).toISOString());
  console.log('Claims open:', new Date(Number(claimStart) * 1000).toISOString());
  console.log('Claims close:', new Date(Number(claimEnd) * 1000).toISOString());
}

main().catch(console.error);
```

スクリプトを実行します：

```bash
npx ts-node launch.ts
```

**出力されたアドレスを保存してください！** 次のステップで必要になります。

## 次に何が起こるか

ローンチスクリプトを実行すると、ローンチが開始されます。各フェーズで起こることは次のとおりです：

### 入金期間中

ユーザーはフロントエンドまたは SDK を直接使って SOL を預け入れます。各入金には次の特徴があります：
- 手数料が適用されます
- 入金 PDA で追跡されます
- 一部または全額を引き出すことができます（手数料あり）

### 入金終了後

入金期間が終了したら、`triggerBehaviorsV2` を実行して、バケットに設定された終了時のビヘイビア（この場合は集まった SOL をアンロック済みバケットへ移動）を実行します。`crank.ts` というファイルを作成します：

```typescript
import { readFileSync } from 'fs';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  genesis,
  triggerBehaviorsV2,
  WRAPPED_SOL_MINT,
} from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda, mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplToolbox())
    .use(genesis());

  // Load your wallet keypair (same wallet used for launch)
  const walletFile = '/path/to/your/keypair.json'; // <-- UPDATE THIS PATH
  const secretKey = JSON.parse(readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // Fill in the addresses printed by your launch script
  const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT');
  const baseMint = publicKey('YOUR_TOKEN_MINT');
  const launchPoolBucket = publicKey('YOUR_LAUNCH_POOL_BUCKET');
  const unlockedBucket = publicKey('YOUR_UNLOCKED_BUCKET');

  const unlockedBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
    owner: unlockedBucket,
    mint: WRAPPED_SOL_MINT,
  });

  console.log('Cranking state...');

  await triggerBehaviorsV2(umi, {
    genesisAccount,
    primaryBucket: launchPoolBucket,
    baseMint,
  })
    .addRemainingAccounts([
      { pubkey: publicKey(unlockedBucket), isSigner: false, isWritable: true },
      { pubkey: publicKey(unlockedBucketQuoteTokenAccount), isSigner: false, isWritable: true },
    ])
    .sendAndConfirm(umi);

  console.log('✓ Crank complete! SOL moved to unlocked bucket.');
}

main().catch(console.error);
```

入金期間の終了後に実行します：

```bash
npx ts-node crank.ts
```

### ユーザーがトークンを請求

crank の後、ユーザーはトークンを請求できます。各ユーザーは、総預入額に対するシェアに比例してトークンを受け取ります：

```
userTokens = (userDeposit / totalDeposits) * totalTokenSupply
```

ユーザーはフロントエンド経由、またはこのスクリプト（`claim.ts` を作成）で請求できます：

```typescript
import { readFileSync } from 'fs';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  genesis,
  claimLaunchPoolV2,
} from '@metaplex-foundation/genesis';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(genesis());

  // Load the user's wallet keypair (whoever deposited SOL)
  const walletFile = '/path/to/your/keypair.json'; // <-- UPDATE THIS PATH
  const secretKey = JSON.parse(readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // Fill in the addresses from the launch
  const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT');
  const baseMint = publicKey('YOUR_TOKEN_MINT');
  const launchPoolBucket = publicKey('YOUR_LAUNCH_POOL_BUCKET');

  console.log('Claiming tokens...');

  await claimLaunchPoolV2(umi, {
    genesisAccount,
    bucket: launchPoolBucket,
    baseMint,
    recipient: umi.identity.publicKey,
  }).sendAndConfirm(umi);

  console.log('✓ Tokens claimed!');
}

main().catch(console.error);
```

### 最終化: 権限を取り消し

ローンチが完了したら、ミント権限とフリーズ権限を取り消します。これにより、追加のトークンが発行されることはないとホルダーに示せます。

{% callout type="warning" %}
**この操作は元に戻せません。** 一度取り消すと、追加のトークンのミントやアカウントのフリーズは二度とできません。ローンチが完了したと確信できる場合にのみ実行してください。
{% /callout %}

`revoke.ts` を作成します：

```typescript
import { readFileSync } from 'fs';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  genesis,
  revokeV2,
} from '@metaplex-foundation/genesis';
import { SPL_TOKEN_PROGRAM_ID } from '@metaplex-foundation/mpl-toolbox';
import { publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  const umi = createUmi('https://api.devnet.solana.com')
    .use(genesis());

  // Load your wallet keypair (same wallet used for launch)
  const walletFile = '/path/to/your/keypair.json'; // <-- UPDATE THIS PATH
  const secretKey = JSON.parse(readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // Fill in these addresses from the launch
  const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT');
  const baseMint = publicKey('YOUR_TOKEN_MINT');

  console.log('Revoking mint and freeze authorities...');
  await revokeV2(umi, {
    genesisAccount,
    baseMint,
    baseTokenProgram: SPL_TOKEN_PROGRAM_ID,
    revokeMintAuthority: true,
    revokeFreezeAuthority: true,
    padding: Array(5).fill(0),
  }).sendAndConfirm(umi);

  console.log('\n✓ Launch complete! Token is fully decentralized.');
}

main().catch(console.error);
```

## 次のステップ

- [Genesis 概要](/ja/smart-contracts/genesis) - Solana トークンローンチパッドについて詳しく学ぶ
- [Launch Pool](/ja/smart-contracts/genesis/launch-pool) - フェアローンチの詳細ドキュメント
- [プレセール](/ja/smart-contracts/genesis/presale) - 固定価格でのトークンプレセールを実行
- [Metaplex API](/ja/api) - API でローンチおよびトークンセールのデータを照会
