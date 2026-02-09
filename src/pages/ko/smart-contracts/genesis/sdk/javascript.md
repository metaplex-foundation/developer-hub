---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis | Metaplex
description: Genesis JavaScript SDK의 API 레퍼런스. Solana에서 토큰 런칭을 위한 함수 시그니처, 매개변수 및 타입.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis SDK
  - JavaScript SDK
  - TypeScript SDK
  - token launch SDK
  - Umi framework
  - Genesis API reference
about:
  - SDK installation
  - API reference
  - Genesis instructions
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Umi란 무엇이며 왜 필요한가요?
    a: Umi는 Solana를 위한 Metaplex의 JavaScript 프레임워크입니다. 트랜잭션 구축, 서명자 관리, Metaplex 프로그램과의 상호작용을 위한 일관된 인터페이스를 제공합니다.
  - q: 브라우저에서 Genesis SDK를 사용할 수 있나요?
    a: 네. SDK는 Node.js와 브라우저 환경 모두에서 작동합니다. 브라우저에서는 키페어 파일 대신 지갑 어댑터를 사용하세요.
  - q: fetch와 safeFetch의 차이점은 무엇인가요?
    a: fetch는 계정이 존재하지 않으면 오류를 던집니다. safeFetch는 대신 null을 반환하며, 오류 처리 없이 계정 존재 여부를 확인하는 데 유용합니다.
  - q: 트랜잭션 오류를 어떻게 처리하나요?
    a: sendAndConfirm 호출을 try/catch 블록으로 감싸세요. 일반적인 오류에는 잔액 부족, 이미 초기화된 계정, 시간 조건 위반이 포함됩니다.
---

Genesis JavaScript SDK의 API 레퍼런스. 전체 튜토리얼은 [Launch Pool](/smart-contracts/genesis/launch-pool) 또는 [Presale](/smart-contracts/genesis/presale)을 참조하세요. {% .lead %}

{% quick-links %}

{% quick-link title="NPM 패키지" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="@metaplex-foundation/genesis" /%}

{% quick-link title="TypeDoc" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="자동 생성된 API 문서" /%}

{% /quick-links %}

## 설치

```bash
npm install @metaplex-foundation/genesis @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox \
  @metaplex-foundation/mpl-token-metadata
```

## 설정

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

전체 구현 예제는 [Launch Pool](/smart-contracts/genesis/launch-pool) 또는 [Presale](/smart-contracts/genesis/presale)을 참조하세요.

---

## 명령어 레퍼런스

### 코어

| Function | Description |
|----------|-------------|
| [initializeV2()](#initialize-v2) | Genesis 계정 생성 및 토큰 발행 |
| [finalizeV2()](#finalize-v2) | 설정 잠금, 런칭 활성화 |

### 버킷

| Function | Description |
|----------|-------------|
| [addLaunchPoolBucketV2()](#add-launch-pool-bucket-v2) | 비례 배분 버킷 추가 |
| [addPresaleBucketV2()](#add-presale-bucket-v2) | 고정가 판매 버킷 추가 |
| [addUnlockedBucketV2()](#add-unlocked-bucket-v2) | 트레저리/수신자 버킷 추가 |

### Launch Pool 운영

| Function | Description |
|----------|-------------|
| [depositLaunchPoolV2()](#deposit-launch-pool-v2) | Launch Pool에 SOL 예치 |
| [withdrawLaunchPoolV2()](#withdraw-launch-pool-v2) | SOL 출금 (예치 기간 중) |
| [claimLaunchPoolV2()](#claim-launch-pool-v2) | 토큰 청구 (예치 기간 후) |

### Presale 운영

| Function | Description |
|----------|-------------|
| [depositPresaleV2()](#deposit-presale-v2) | Presale에 SOL 예치 |
| [claimPresaleV2()](#claim-presale-v2) | 토큰 청구 (예치 기간 후) |

### 관리자

| Function | Description |
|----------|-------------|
| [transitionV2()](#transition-v2) | 종료 동작 실행 |
| [revokeMintAuthorityV2()](#revoke-mint-authority-v2) | 민트 권한 영구 폐기 |
| [revokeFreezeAuthorityV2()](#revoke-freeze-authority-v2) | 동결 권한 영구 폐기 |

---

## 함수 시그니처

### initializeV2

```typescript
await initializeV2(umi, {
  baseMint,           // Signer - new token keypair
  quoteMint,          // PublicKey - deposit token (wSOL)
  fundingMode,        // number - use 0
  totalSupplyBaseToken, // bigint - supply with decimals
  name,               // string - token name
  symbol,             // string - token symbol
  uri,                // string - metadata URI
}).sendAndConfirm(umi);
```

### finalizeV2

```typescript
await finalizeV2(umi, {
  baseMint,           // PublicKey
  genesisAccount,     // PublicKey
}).sendAndConfirm(umi);
```

### addLaunchPoolBucketV2

```typescript
await addLaunchPoolBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint - tokens for this bucket
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // bigint | null
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

### addPresaleBucketV2

```typescript
await addPresaleBucketV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  baseTokenAllocation,      // bigint
  allocationQuoteTokenCap,  // bigint - SOL cap (sets price)
  depositStartCondition,    // TimeCondition
  depositEndCondition,      // TimeCondition
  claimStartCondition,      // TimeCondition
  claimEndCondition,        // TimeCondition
  minimumDepositAmount,     // bigint | null
  depositLimit,             // bigint | null - max per user
  endBehaviors,             // EndBehavior[]
}).sendAndConfirm(umi);
```

### addUnlockedBucketV2

```typescript
await addUnlockedBucketV2(umi, {
  genesisAccount,       // PublicKey
  baseMint,             // PublicKey
  baseTokenAllocation,  // bigint - usually 0n
  recipient,            // PublicKey - who can claim
  claimStartCondition,  // TimeCondition
  claimEndCondition,    // TimeCondition
  backendSigner,        // null
}).sendAndConfirm(umi);
```

### depositLaunchPoolV2

```typescript
await depositLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### depositPresaleV2

```typescript
await depositPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### withdrawLaunchPoolV2

```typescript
await withdrawLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  amountQuoteToken,   // bigint - lamports
}).sendAndConfirm(umi);
```

### claimLaunchPoolV2

```typescript
await claimLaunchPoolV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### claimPresaleV2

```typescript
await claimPresaleV2(umi, {
  genesisAccount,     // PublicKey
  bucket,             // PublicKey
  baseMint,           // PublicKey
  recipient,          // PublicKey
}).sendAndConfirm(umi);
```

### transitionV2

```typescript
await transitionV2(umi, {
  genesisAccount,     // PublicKey
  primaryBucket,      // PublicKey
  baseMint,           // PublicKey
})
  .addRemainingAccounts([/* destination accounts */])
  .sendAndConfirm(umi);
```

### revokeMintAuthorityV2

```typescript
await revokeMintAuthorityV2(umi, {
  baseMint,           // PublicKey
}).sendAndConfirm(umi);
```

### revokeFreezeAuthorityV2

```typescript
await revokeFreezeAuthorityV2(umi, {
  baseMint,           // PublicKey
}).sendAndConfirm(umi);
```

---

## PDA 헬퍼

| Function | Seeds |
|----------|-------|
| findGenesisAccountV2Pda() | `baseMint`, `genesisIndex` |
| findLaunchPoolBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findPresaleBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findUnlockedBucketV2Pda() | `genesisAccount`, `bucketIndex` |
| findLaunchPoolDepositV2Pda() | `bucket`, `recipient` |
| findPresaleDepositV2Pda() | `bucket`, `recipient` |

```typescript
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, { baseMint: mint.publicKey, genesisIndex: 0 });
const [bucketPda] = findLaunchPoolBucketV2Pda(umi, { genesisAccount: genesisAccountPda, bucketIndex: 0 });
const [depositPda] = findLaunchPoolDepositV2Pda(umi, { bucket: bucketPda, recipient: wallet });
```

---

## 조회 함수

| Function | Returns |
|----------|---------|
| fetchLaunchPoolBucketV2() | 버킷 상태 (없으면 오류 발생) |
| safeFetchLaunchPoolBucketV2() | 버킷 상태 또는 `null` |
| fetchPresaleBucketV2() | 버킷 상태 (없으면 오류 발생) |
| safeFetchPresaleBucketV2() | 버킷 상태 또는 `null` |
| fetchLaunchPoolDepositV2() | 예치 상태 (없으면 오류 발생) |
| safeFetchLaunchPoolDepositV2() | 예치 상태 또는 `null` |
| fetchPresaleDepositV2() | 예치 상태 (없으면 오류 발생) |
| safeFetchPresaleDepositV2() | 예치 상태 또는 `null` |

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, bucketPda);
const deposit = await safeFetchLaunchPoolDepositV2(umi, depositPda); // 찾지 못하면 null
```

**버킷 상태 필드:** `quoteTokenDepositTotal`, `depositCount`, `claimCount`, `bucket.baseTokenAllocation`

**예치 상태 필드:** `amountQuoteToken`, `claimed`

---

## 타입

### TimeCondition

```typescript
{
  __kind: 'TimeAbsolute',
  padding: Array(47).fill(0),
  time: bigint,                    // Unix timestamp (seconds)
  triggeredTimestamp: null,
}
```

### EndBehavior

```typescript
{
  __kind: 'SendQuoteTokenPercentage',
  padding: Array(4).fill(0),
  destinationBucket: PublicKey,
  percentageBps: number,           // 10000 = 100%
  processed: false,
}
```

---

## 상수

| Constant | Value |
|----------|-------|
| `WRAPPED_SOL_MINT` | `So11111111111111111111111111111111111111112` |

---

## 일반 오류

| Error | Cause |
|-------|-------|
| `insufficient funds` | 수수료를 위한 SOL 부족 |
| `already initialized` | Genesis 계정이 이미 존재 |
| `already finalized` | 확정 후 수정 불가 |
| `deposit period not active` | 예치 기간 외 |
| `claim period not active` | 청구 기간 외 |

---

## FAQ

### Umi란 무엇이며 왜 필요한가요?
Umi는 Solana를 위한 Metaplex의 JavaScript 프레임워크입니다. 트랜잭션 구축, 서명자 관리, Metaplex 프로그램과의 상호작용을 위한 일관된 인터페이스를 제공합니다.

### 브라우저에서 Genesis SDK를 사용할 수 있나요?
네. SDK는 Node.js와 브라우저 환경 모두에서 작동합니다. 브라우저에서는 키페어 파일 대신 지갑 어댑터를 사용하세요.

### fetch와 safeFetch의 차이점은 무엇인가요?
`fetch`는 계정이 존재하지 않으면 오류를 던집니다. `safeFetch`는 대신 `null`을 반환하며, 계정 존재 여부를 확인하는 데 유용합니다.

### 트랜잭션 오류를 어떻게 처리하나요?
`sendAndConfirm` 호출을 try/catch 블록으로 감싸세요. 구체적인 실패 원인은 오류 메시지를 확인하세요.

---

## 다음 단계

전체 구현 튜토리얼:

- [시작하기](/smart-contracts/genesis/getting-started) - 설정 및 첫 런칭
- [Launch Pool](/smart-contracts/genesis/launch-pool) - 비례 배분
- [Presale](/smart-contracts/genesis/presale) - 고정가 판매
