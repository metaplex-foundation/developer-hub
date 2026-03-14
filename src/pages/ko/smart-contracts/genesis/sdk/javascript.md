---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis | Metaplex
description: Genesis JavaScript SDK의 API 레퍼런스. Solana에서 토큰 런칭을 위한 함수 시그니처, 매개변수 및 타입.
created: '01-15-2025'
updated: '03-10-2026'
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
  - q: 토큰의 런칭 타입을 어떻게 조회하나요?
    a: 토큰의 민트 주소를 사용하여 fetchGenesisAccountV2FromSeeds로 GenesisAccountV2 온체인 계정을 가져옵니다. launchType 필드는 0(미초기화), 1(프로젝트), 또는 2(밈)을 반환합니다. GPA 빌더를 사용하여 특정 타입의 모든 런칭을 조회할 수도 있습니다.
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
| [triggerBehaviorsV2()](#trigger-behaviors-v2) | 종료 동작 실행 |
| [revokeV2()](#revoke-v2) | 민트 및 동결 권한 영구 폐기 |

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

### triggerBehaviorsV2

```typescript
await triggerBehaviorsV2(umi, {
  genesisAccount,     // PublicKey
  primaryBucket,      // PublicKey
  baseMint,           // PublicKey
})
  .addRemainingAccounts([/* destination bucket + its quote token account */])
  .sendAndConfirm(umi);
```

### revokeV2

```typescript
await revokeV2(umi, {
  genesisAccount,           // PublicKey
  baseMint,                 // PublicKey
  revokeMintAuthority,      // boolean
  revokeFreezeAuthority,    // boolean
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

### Genesis 계정

Genesis 계정은 [런칭 타입](#launchtype)을 포함한 최상위 런칭 상태를 저장합니다. 백엔드 크랭크가 `setLaunchTypeV2` 인스트럭션을 통해 생성 후 온체인에서 `launchType` 필드를 설정하므로, 크랭크가 처리할 때까지 값이 `Uninitialized`(0)일 수 있습니다.

| 함수 | 반환값 |
|----------|---------|
| fetchGenesisAccountV2() | Genesis 계정 상태 (없으면 오류 발생) |
| safeFetchGenesisAccountV2() | Genesis 계정 상태 또는 `null` |
| fetchGenesisAccountV2FromSeeds() | PDA 시드(`baseMint`, `genesisIndex`)로 조회 |
| safeFetchGenesisAccountV2FromSeeds() | 위와 동일, 없으면 `null` 반환 |
| fetchAllGenesisAccountV2() | 여러 Genesis 계정 일괄 조회 |

```typescript
import {
  fetchGenesisAccountV2,
  fetchGenesisAccountV2FromSeeds,
  findGenesisAccountV2Pda,
  LaunchType,
} from '@metaplex-foundation/genesis';

// PDA 주소로 조회
const [genesisAccountPda] = findGenesisAccountV2Pda(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});
const account = await fetchGenesisAccountV2(umi, genesisAccountPda);
console.log(account.data.launchType); // 0 = Uninitialized, 1 = Project, 2 = Meme

// 시드에서 직접 조회
const account2 = await fetchGenesisAccountV2FromSeeds(umi, {
  baseMint: mintAddress,
  genesisIndex: 0,
});

// 런칭 타입 확인
if (account2.data.launchType === LaunchType.Meme) {
  console.log('This is a memecoin launch');
} else if (account2.data.launchType === LaunchType.Project) {
  console.log('This is a project launch');
}
```

**Genesis 계정 필드:** `authority`, `baseMint`, `quoteMint`, `totalSupplyBaseToken`, `totalAllocatedSupplyBaseToken`, `totalProceedsQuoteToken`, `fundingMode`, `launchType`, `bucketCount`, `finalized`

### GPA 빌더 — 런칭 타입으로 조회

`getGenesisAccountV2GpaBuilder()`를 사용하여 온체인 필드로 필터링된 모든 Genesis 계정을 조회합니다. Solana의 바이트 수준 필터를 사용한 `getProgramAccounts` RPC 메서드로 효율적인 검색을 수행합니다.

```typescript
import {
  getGenesisAccountV2GpaBuilder,
  LaunchType,
} from '@metaplex-foundation/genesis';

// 모든 밈코인 런칭 조회
const memecoins = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.Meme)
  .getDeserialized();

// 모든 프로젝트 런칭 조회
const projects = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.Project)
  .getDeserialized();

// 여러 필드로 필터링
const finalizedMemecoins = await getGenesisAccountV2GpaBuilder(umi)
  .whereField('launchType', LaunchType.Meme)
  .whereField('finalized', true)
  .getDeserialized();

for (const account of memecoins) {
  console.log(account.publicKey, account.data.baseMint, account.data.launchType);
}
```

{% callout type="note" %}
`launchType`은 런칭 생성 후 백엔드 크랭크에 의해 소급적으로 설정됩니다. 최근 생성된 런칭은 크랭크가 처리할 때까지 `LaunchType.Uninitialized`(0)을 표시할 수 있습니다.
{% /callout %}

### 버킷 및 예치

| 함수 | 반환값 |
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

### LaunchType

백엔드 크랭크가 `setLaunchTypeV2` 인스트럭션을 통해 소급적으로 설정하는 온체인 런칭 카테고리입니다.

```typescript
enum LaunchType {
  Uninitialized = 0, // 크랭크에 의해 아직 설정되지 않음
  Project = 1,       // 구조화된 프로젝트 토큰 런칭
  Meme = 2,          // 커뮤니티 밈코인 런칭
}
```

[Integration APIs](/smart-contracts/genesis/integration-apis)에서는 문자열(`'project'`, `'memecoin'`, `'custom'`)로 반환되지만, 온체인 SDK에서는 위의 숫자 열거형을 사용합니다.

### GenesisAccountV2

Genesis 런칭의 최상위 온체인 계정입니다. 토큰 민트당, 런칭 인덱스당 하나의 계정이 존재합니다.

```typescript
{
  key: Key;
  bump: number;
  index: number;                          // Genesis 인덱스 (보통 0)
  finalized: boolean;                     // finalizeV2() 후 true
  authority: PublicKey;                    // 런칭 생성자
  baseMint: PublicKey;                     // 런칭되는 토큰
  quoteMint: PublicKey;                    // 예치 토큰 (예: wSOL)
  totalSupplyBaseToken: bigint;            // 총 토큰 공급량
  totalAllocatedSupplyBaseToken: bigint;   // 버킷에 할당된 공급량
  totalProceedsQuoteToken: bigint;         // 수집된 총 예치금
  fundingMode: number;                     // 펀딩 모드 (0)
  launchType: number;                      // 0 = 미초기화, 1 = 프로젝트, 2 = 밈
  bucketCount: number;                     // 버킷 수
}
```

계정 크기: **136바이트**. PDA 시드: `["genesis_v2", baseMint, genesisIndex]`.

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

### 토큰의 런칭 타입을 어떻게 조회하나요?
토큰의 민트 주소를 사용하여 `fetchGenesisAccountV2FromSeeds()`로 `GenesisAccountV2` 계정을 조회합니다. `launchType` 필드는 `0`(미초기화), `1`(프로젝트), `2`(밈)을 반환합니다. 특정 타입의 모든 런칭을 조회하려면 [GPA 빌더](#gpa-빌더--런칭-타입으로-조회)를 사용하세요. 또는 [Integration APIs](/smart-contracts/genesis/integration-apis)가 REST 응답에서 문자열로 런칭 타입을 반환합니다.

### 트랜잭션 오류를 어떻게 처리하나요?
`sendAndConfirm` 호출을 try/catch 블록으로 감싸세요. 구체적인 실패 원인은 오류 메시지를 확인하세요.

---

## 다음 단계

전체 구현 튜토리얼:

- [시작하기](/smart-contracts/genesis/getting-started) - 설정 및 첫 런칭
- [Launch Pool](/smart-contracts/genesis/launch-pool) - 비례 배분
- [Presale](/smart-contracts/genesis/presale) - 고정가 판매
