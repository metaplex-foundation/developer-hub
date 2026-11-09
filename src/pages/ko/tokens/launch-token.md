---
title: Solana에서 토큰 런치하기
metaTitle: Solana에서 토큰 런치하기 — Genesis 공정 런치 가이드 | Metaplex
description: Genesis Launch Pool을 사용해 Solana에서 SPL 토큰을 런치하는 TypeScript 단계별 가이드. 투명한 가격 발견을 통한 공정한 온체인 토큰 배포.
cli: /dev-tools/cli/genesis/launch
---

[Genesis](/ko/smart-contracts/genesis) Launch Pool을 사용해 Solana에서 SPL 토큰을 런치합니다. 이 가이드에서는 사용자가 일정 기간 동안 SOL을 예치하고 총 예치금에서 차지하는 비율에 비례해 토큰을 받는 공정 런치를 처음부터 끝까지 안내합니다. 모든 과정은 온체인에서 투명하게 처리됩니다. {% .lead %}

{% callout type="note" title="노코드 옵션" %}
코드를 작성하고 싶지 않으신가요? [Metaplex 토큰 런치패드](https://www.metaplex.com)를 사용하면 코딩 없이 토큰을 런치할 수 있습니다. 이 가이드는 자체 토큰 런치 경험을 구축하거나 Genesis SDK로 자신의 웹사이트에서 토큰 세일을 진행하려는 개발자를 위한 것입니다.
{% /callout %}

{% callout type="note" title="다른 런치 방식" %}
이 가이드는 **Launch Pool** 공정 런치 방식을 다루지만, Genesis는 고정 가격으로 토큰을 판매하는 **[프리세일](/ko/smart-contracts/genesis/presale)** 토큰 세일도 지원합니다. [Genesis 개요](/ko/smart-contracts/genesis)에서 방식을 비교하고 프로젝트에 가장 적합한 방법을 선택하세요.
{% /callout %}

## 개요

Genesis는 공정한 온체인 토큰 런치 메커니즘을 제공하는 Solana 토큰 런치패드입니다. 고정 가격으로 토큰을 판매하는 중앙화된 토큰 세일 플랫폼과 달리, Launch Pool은 시장이 토큰 배포를 결정합니다. 모든 참여자가 예치금에 비례해 토큰을 받으므로 공정하고 투명한 토큰 생성 이벤트(TGE)가 보장됩니다. SPL 토큰 생성, 자금 모금, 배포는 모두 중개자 없이 온체인에서 이루어집니다.

Launch Pool 토큰 런치는 세 단계로 이루어집니다:

1. **설정** (한 번만 실행) - 토큰 생성, 런치 구성, 활성화
2. **예치 기간** (사용자 참여) - 설정한 기간 동안 사용자가 SOL을 예치
3. **런치 이후** (사용자와 함께) - 상태 머신 진행(crank), 사용자의 토큰 청구, 권한 취소

이 가이드에서는 단계별로 실행할 **네 개의 별도 스크립트**를 작성합니다:

| 스크립트 | 실행 시점 | 목적 |
|--------|-------------|---------|
| `launch.ts` | 시작 시 한 번 | 토큰을 생성하고 런치를 활성화합니다 |
| `crank.ts` | 예치 종료 후 | 조건과 동작을 트리거하여 SOL을 잠금 해제 버킷으로 이동합니다 |
| `claim.ts` | crank 이후 | 사용자가 토큰을 청구하기 위해 실행합니다 |
| `revoke.ts` | 런치 완료 시 | 민트/프리즈 권한을 영구적으로 제거합니다 |

## 사전 요구 사항

새 프로젝트를 만들고 의존성을 설치합니다:

```bash
mkdir my-token-launch
cd my-token-launch
npm init -y
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

## 전체 런치 스크립트

아래는 바로 실행할 수 있는 전체 스크립트입니다. 각 섹션에는 동작을 설명하는 주석이 달려 있습니다. 이 스크립트는 런치를 설정하기 위해 **한 번만** 실행합니다.

{% callout type="warning" title="키페어 필요" %}
트랜잭션에 서명하려면 컴퓨터에 Solana 키페어 파일이 필요합니다. 일반적으로 `~/.config/solana/id.json`에 있는 Solana CLI 지갑입니다. 스크립트의 `walletFile` 경로를 키페어 파일 경로로 수정하세요. 이 지갑에 트랜잭션 수수료를 낼 SOL이 있는지 확인하세요.
{% /callout %}

`launch.ts`라는 파일을 만듭니다:

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

스크립트를 실행합니다:

```bash
npx ts-node launch.ts
```

**출력된 주소를 저장하세요!** 다음 단계에서 필요합니다.

## 다음에 일어나는 일

런치 스크립트를 실행하면 런치가 시작됩니다. 각 단계에서 일어나는 일은 다음과 같습니다:

### 예치 기간 중

사용자는 프런트엔드 또는 SDK를 직접 사용해 SOL을 예치합니다. 각 예치는 다음과 같습니다:
- 수수료가 적용됩니다
- 예치 PDA에서 추적됩니다
- 일부 또는 전체를 인출할 수 있습니다(수수료 있음)

### 예치 종료 후

예치 기간이 끝나면 `triggerBehaviorsV2`를 실행해 버킷에 구성된 종료 동작(이 경우 모인 SOL을 잠금 해제 버킷으로 이동)을 실행합니다. `crank.ts`라는 파일을 만듭니다:

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

예치 기간이 끝난 후 실행합니다:

```bash
npx ts-node crank.ts
```

### 사용자 토큰 청구

crank 이후 사용자는 토큰을 청구할 수 있습니다. 각 사용자는 총 예치금에서 차지하는 비율에 비례해 토큰을 받습니다:

```
userTokens = (userDeposit / totalDeposits) * totalTokenSupply
```

사용자는 프런트엔드를 통해 또는 이 스크립트(`claim.ts` 생성)로 청구할 수 있습니다:

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

### 마무리: 권한 취소

런치가 완료되면 민트 및 프리즈 권한을 취소합니다. 이는 추가 토큰이 발행되지 않는다는 신호를 홀더에게 줍니다.

{% callout type="warning" %}
**이 작업은 되돌릴 수 없습니다.** 한 번 취소하면 추가 토큰을 발행하거나 계정을 동결할 수 없습니다. 런치가 완료되었다고 확신할 때만 실행하세요.
{% /callout %}

`revoke.ts`를 만듭니다:

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

## 다음 단계

- [Genesis 개요](/ko/smart-contracts/genesis) - Solana 토큰 런치패드에 대해 자세히 알아보기
- [Launch Pool](/ko/smart-contracts/genesis/launch-pool) - 공정 런치 상세 문서
- [프리세일](/ko/smart-contracts/genesis/presale) - 고정 가격으로 토큰 프리세일 진행
- [Metaplex API](/ko/api) - API로 런치 및 토큰 세일 데이터 조회
