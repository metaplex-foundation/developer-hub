---
title: Solana에서 토큰 런칭하기
metaTitle: Solana에서 토큰 런칭하는 방법 | TGE & 페어 런칭 가이드 | Metaplex
description: Solana에서 토큰 생성 이벤트(TGE)를 런칭하는 완전 가이드. Genesis Launch Pools를 사용한 페어 토큰 런칭을 단계별 TypeScript 코드로 생성합니다.
---

[Genesis](/ko/smart-contracts/genesis) Launch Pools를 사용하여 토큰을 출시합니다. 사용자는 설정한 기간 동안 SOL을 예치하고, 총 예치금에서 자신의 지분 비율에 따라 토큰을 받습니다. {% .lead %}

## 개요

Launch Pool 토큰 출시에는 세 가지 단계가 있습니다:

1. **설정** (한 번 실행) - 토큰을 생성하고, 출시를 구성하고, 활성화합니다
2. **예치 기간** (사용자 참여) - 설정한 기간 동안 사용자가 SOL을 예치합니다
3. **출시 후** (당신 + 사용자) - 전환을 실행하고, 사용자가 토큰을 청구하고, 권한을 철회합니다

이 가이드에서는 서로 다른 단계에서 실행할 **4개의 별도 스크립트**를 만드는 방법을 안내합니다:

| 스크립트 | 실행 시점 | 목적 |
|--------|-------------|---------|
| `launch.ts` | 한 번, 시작 시 | 토큰을 생성하고 출시를 활성화 |
| `transition.ts` | 예치 종료 후 | 수집된 SOL을 잠금 해제 버킷으로 이동 |
| `claim.ts` | 전환 후 | 사용자가 토큰을 청구하기 위해 실행 |
| `revoke.ts` | 출시 완료 시 | 민트/동결 권한을 영구적으로 제거 |

## 사전 요구 사항

새 프로젝트를 만들고 종속성을 설치합니다:

```bash
mkdir my-token-launch
cd my-token-launch
npm init -y
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

## 전체 출시 스크립트

아래는 완전하고 실행 가능한 스크립트입니다. 각 섹션에는 설명하는 주석이 있습니다. 이 스크립트를 **한 번** 실행하여 출시를 설정합니다.

{% callout type="warning" title="키페어 필요" %}
트랜잭션에 서명하려면 머신에 Solana 키페어 파일이 필요합니다. 이것은 일반적으로 `~/.config/solana/id.json`에 있는 Solana CLI 지갑입니다. 스크립트의 `walletFile` 경로를 키페어 파일을 가리키도록 업데이트하세요. 이 지갑에 트랜잭션 수수료를 위한 SOL이 있는지 확인하세요.
{% /callout %}

`launch.ts`라는 파일을 만듭니다:

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
  // 설정: 연결 및 지갑 구성
  // ============================================

  const umi = createUmi('https://api.devnet.solana.com')
    .use(genesis());

  // 머신의 파일에서 지갑 키페어 로드
  // 이것은 일반적으로 ~/.config/solana/id.json에 있는 Solana CLI 지갑입니다
  // 또는 액세스할 수 있는 모든 키페어 파일 사용
  const walletFile = '/path/to/your/keypair.json'; // <-- 이 경로 업데이트
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // ============================================
  // 구성: 이 값들을 커스터마이즈
  // ============================================

  // 토큰 세부 정보
  const TOKEN_NAME = 'My Token';
  const TOKEN_SYMBOL = 'MTK';
  const TOKEN_URI = 'https://example.com/metadata.json'; // 메타데이터 JSON URL
  const TOTAL_SUPPLY = 1_000_000_000_000n; // 1조 토큰 (필요에 따라 조정)

  // 타이밍 (현재부터 초 단위)
  const DEPOSIT_DURATION = 24 * 60 * 60; // 24시간
  const CLAIM_DURATION = 7 * 24 * 60 * 60; // 7일

  // 타임스탬프 계산
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now;
  const depositEnd = now + BigInt(DEPOSIT_DURATION);
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + BigInt(CLAIM_DURATION);

  // ============================================
  // 1단계: 토큰 생성
  // ============================================
  console.log('1단계: 토큰 생성 중...');

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

  console.log('✓ 토큰 생성 완료!');
  console.log('  토큰 민트:', baseMint.publicKey);
  console.log('  Genesis 계정:', genesisAccount);

  // ============================================
  // 2단계: Launch Pool 버킷 추가
  // 사용자가 SOL을 예치하는 곳
  // ============================================
  console.log('\n2단계: Launch Pool 버킷 추가 중...');

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
        percentageBps: 10000, // 수집된 SOL의 100%가 잠금 해제 버킷으로
        processed: false,
      },
    ],
  }).sendAndConfirm(umi);

  console.log('✓ Launch Pool 버킷 추가 완료!');
  console.log('  버킷 주소:', launchPoolBucket);

  // ============================================
  // 3단계: 잠금 해제 버킷 추가
  // 수집된 SOL이 팀에게 전송되는 곳
  // ============================================
  console.log('\n3단계: 잠금 해제 버킷 추가 중...');

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

  console.log('✓ 잠금 해제 버킷 추가 완료!');
  console.log('  버킷 주소:', unlockedBucket);

  // ============================================
  // 4단계: 마무리 - 출시 활성화
  // 이후에는 더 이상 변경할 수 없음
  // ============================================
  console.log('\n4단계: 마무리 중...');

  await finalizeV2(umi, {
    baseMint: baseMint.publicKey,
    genesisAccount,
  }).sendAndConfirm(umi);

  console.log('✓ 출시가 활성화되었습니다!');

  // ============================================
  // 요약: 이 주소들을 저장하세요!
  // ============================================
  console.log('\n========================================');
  console.log('출시 완료 - 이 주소들을 저장하세요:');
  console.log('========================================');
  console.log('토큰 민트:', baseMint.publicKey);
  console.log('Genesis 계정:', genesisAccount);
  console.log('Launch Pool 버킷:', launchPoolBucket);
  console.log('잠금 해제 버킷:', unlockedBucket);
  console.log('');
  console.log('타이밍:');
  console.log('예치 시작:', new Date(Number(depositStart) * 1000).toISOString());
  console.log('예치 종료:', new Date(Number(depositEnd) * 1000).toISOString());
  console.log('청구 시작:', new Date(Number(claimStart) * 1000).toISOString());
  console.log('청구 종료:', new Date(Number(claimEnd) * 1000).toISOString());
}

main().catch(console.error);
```

스크립트 실행:

```bash
npx ts-node launch.ts
```

**출력된 주소를 저장하세요!** 다음 단계에서 필요합니다.

## 다음에 일어나는 일

출시 스크립트를 실행하면 출시가 라이브됩니다. 각 단계에서 일어나는 일은 다음과 같습니다:

### 예치 기간 동안

사용자는 프론트엔드 또는 SDK를 직접 사용하여 SOL을 예치합니다. 각 예치:
- 2% 수수료가 적용됩니다
- 예치 PDA에서 추적됩니다
- 부분적으로 또는 전체적으로 출금 가능 (2% 수수료 포함)

### 예치 종료 후

예치 기간이 끝나면 수집된 SOL을 잠금 해제 버킷으로 이동하기 위해 **전환**을 실행해야 합니다. `transition.ts`라는 파일을 만듭니다:

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

  // 지갑 키페어 로드 (출시에 사용한 것과 동일한 지갑)
  const walletFile = '/path/to/your/keypair.json'; // <-- 이 경로 업데이트
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // 출시 스크립트에서 출력된 주소를 입력
  const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT');
  const baseMint = publicKey('YOUR_TOKEN_MINT');
  const launchPoolBucket = publicKey('YOUR_LAUNCH_POOL_BUCKET');
  const unlockedBucket = publicKey('YOUR_UNLOCKED_BUCKET');

  const unlockedBucketQuoteTokenAccount = findAssociatedTokenPda(umi, {
    owner: unlockedBucket,
    mint: WRAPPED_SOL_MINT,
  });

  console.log('전환 실행 중...');

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

  console.log('✓ 전환 완료! SOL이 잠금 해제 버킷으로 이동했습니다.');
}

main().catch(console.error);
```

예치 기간 종료 후 실행:

```bash
npx ts-node transition.ts
```

### 사용자가 토큰 청구

전환 후 사용자는 토큰을 청구할 수 있습니다. 각 사용자는 총 예치금에서 자신의 지분 비율에 따라 토큰을 받습니다:

```
userTokens = (userDeposit / totalDeposits) * totalTokenSupply
```

사용자는 프론트엔드 또는 이 스크립트를 사용하여 청구할 수 있습니다 (`claim.ts` 생성):

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

  // 사용자의 지갑 키페어 로드 (SOL을 예치한 사람)
  const walletFile = '/path/to/your/keypair.json'; // <-- 이 경로 업데이트
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // 출시에서 가져온 주소 입력
  const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT');
  const baseMint = publicKey('YOUR_TOKEN_MINT');
  const launchPoolBucket = publicKey('YOUR_LAUNCH_POOL_BUCKET');

  console.log('토큰 청구 중...');

  await claimLaunchPoolV2(umi, {
    genesisAccount,
    bucket: launchPoolBucket,
    baseMint,
    recipient: umi.identity.publicKey,
  }).sendAndConfirm(umi);

  console.log('✓ 토큰 청구 완료!');
}

main().catch(console.error);
```

### 마무리: 권한 철회

출시가 완료되면 민트 및 동결 권한을 철회합니다. 이는 보유자에게 추가 토큰을 발행할 수 없음을 알립니다.

{% callout type="warning" %}
**이것은 되돌릴 수 없습니다.** 한 번 철회하면 추가 토큰을 발행하거나 계정을 동결할 수 없습니다. 출시가 완료되었다고 확신할 때만 이 작업을 수행하세요.
{% /callout %}

`revoke.ts` 생성:

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

  // 지갑 키페어 로드 (출시에 사용한 것과 동일한 지갑)
  const walletFile = '/path/to/your/keypair.json'; // <-- 이 경로 업데이트
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // 출시에서 가져온 토큰 민트 주소 입력
  const baseMint = publicKey('YOUR_TOKEN_MINT');

  console.log('민트 권한 철회 중...');
  await revokeMintAuthorityV2(umi, {
    baseMint,
  }).sendAndConfirm(umi);
  console.log('✓ 민트 권한 철회 완료');

  console.log('동결 권한 철회 중...');
  await revokeFreezeAuthorityV2(umi, {
    baseMint,
  }).sendAndConfirm(umi);
  console.log('✓ 동결 권한 철회 완료');

  console.log('\n✓ 출시 완료! 토큰이 완전히 탈중앙화되었습니다.');
}

main().catch(console.error);
```

## 다음 단계

- [Genesis 개요](/ko/smart-contracts/genesis) - Genesis 개념에 대해 더 알아보기
- [Launch Pool](/ko/smart-contracts/genesis/launch-pool) - 상세한 Launch Pool 문서
- [Aggregation API](/ko/smart-contracts/genesis/aggregation) - API를 통해 출시 데이터 쿼리
