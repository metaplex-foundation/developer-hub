---
title: 시작하기
metaTitle: Genesis - 시작하기
description: Genesis를 사용하여 Solana에서 토큰을 런칭하는 기본 사항을 알아보세요.
---

이 가이드에서는 Genesis로 토큰을 런칭하기 위한 핵심 개념과 워크플로우를 소개합니다. Genesis 계정을 초기화하고, 버킷 시스템을 이해하고, 런칭 구성을 확정하는 방법을 배웁니다.

## 사전 요구사항

시작하기 전에 다음을 준비하세요:
- Node.js 16+ 설치
- 트랜잭션 수수료를 위한 SOL이 있는 Solana 지갑
- Genesis SDK 설치 및 구성 완료 ([JavaScript SDK](/ko/smart-contracts/genesis/sdk/javascript) 참조)

## Genesis 런칭 흐름

모든 Genesis 토큰 런칭은 동일한 기본 흐름을 따릅니다:

```
1. Genesis 계정 초기화
   └── 토큰과 마스터 조정 계정 생성

2. 버킷 추가
   └── 토큰 배포 방식 구성 (런칭 유형)

3. 확정
   └── 구성 잠금 및 런칭 활성화

4. 활성 기간
   └── 버킷 구성에 따라 사용자 참여

5. 전환
   └── 종료 동작 실행 (예: 유출 버킷으로 자금 전송)
```

## 1단계: Genesis 계정 초기화

Genesis 계정은 토큰 런칭의 기반입니다. 초기화 시 다음이 생성됩니다:
- 메타데이터가 포함된 새 SPL 토큰
- 모든 배포 버킷을 조정하는 마스터 계정
- 에스크로에 보관된 총 토큰 공급량

```typescript
import {
  findGenesisAccountV2Pda,
  initializeV2,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';

// 토큰용 새 민트 키페어 생성
const baseMint = generateSigner(umi);

// wSOL이 표준 기준 토큰
const WSOL_MINT = publicKey('So11111111111111111111111111111111111111112');

// Genesis 계정 PDA 유도
const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint: baseMint.publicKey,
  genesisIndex: 0,  // 첫 번째 캠페인에는 0 사용
});

// Genesis 계정 초기화
await initializeV2(umi, {
  baseMint,
  quoteMint: WSOL_MINT,
  fundingMode: 0,
  totalSupplyBaseToken: 1_000_000_000_000_000n,  // 100만 토큰 (9 데시멀)
  name: 'My Token',
  symbol: 'MTK',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi);

console.log('Genesis 계정 생성됨:', genesisAccount);
console.log('토큰 민트:', baseMint.publicKey);
```

### 토큰 공급량 이해하기

`totalSupplyBaseToken`을 지정할 때 데시멀을 고려하세요. SPL 토큰은 일반적으로 9 데시멀을 사용합니다:

```typescript
const ONE_TOKEN = 1_000_000_000n;           // 1 토큰
const ONE_MILLION = 1_000_000_000_000_000n; // 1,000,000 토큰
const ONE_BILLION = 1_000_000_000_000_000_000n; // 1,000,000,000 토큰
```

{% callout type="note" %}
`totalSupplyBaseToken`은 모든 버킷 할당량의 합과 같아야 합니다. 초기화 전에 버킷 전체에 걸친 토큰 배포를 계획하세요.
{% /callout %}

## 2단계: 버킷 추가

버킷은 런칭 중 토큰 흐름을 정의하는 모듈식 구성요소입니다. 두 가지 카테고리가 있습니다:

### 유입 버킷
사용자로부터 기준 토큰(SOL)을 수집합니다:

| 버킷 유형 | 사용 사례 |
|-------------|----------|
| **Launch Pool** | 비례 배분이 있는 예치 기간 |
| **Presale** | 고정 가격 토큰 판매 |

### 유출 버킷
종료 동작을 통해 토큰 또는 기준 토큰을 받습니다:

| 버킷 유형 | 사용 사례 |
|-------------|----------|
| **Unlocked Bucket** | 팀/재무 청구를 위한 자금 수령 |

### 런칭 유형 선택

{% callout type="note" %}
**[Launch Pool](/ko/smart-contracts/genesis/launch-pool)** - 사용자가 기간 동안 예치하고 총 예치금 대비 비율에 따라 토큰을 받습니다.
{% /callout %}

{% callout type="note" %}
**[Presale](/ko/smart-contracts/genesis/presale)** - 고정 가격 토큰 판매. 사용자가 SOL을 예치하고 미리 정해진 비율로 토큰을 받습니다.
{% /callout %}

## 3단계: 확정

모든 버킷이 구성되면 Genesis 계정을 확정하여 구성을 잠급니다:

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
}).sendAndConfirm(umi);

console.log('Genesis 계정 확정됨!');
```

### 확정의 의미

확정 후:
- 더 이상 버킷을 추가할 수 없음
- 버킷 구성이 잠김
- 시간 조건에 따라 런칭이 활성화됨
- 사용자가 참여를 시작할 수 있음

{% callout type="warning" %}
**확정은 되돌릴 수 없습니다.** 확정하기 전에 모든 버킷 구성, 시간 조건, 토큰 할당량을 다시 확인하세요.
{% /callout %}

## 다음 단계

런칭 유형을 선택하고 상세 가이드를 따르세요:

1. **[Launch Pool](/ko/smart-contracts/genesis/launch-pool)** - 예치 기간이 있는 토큰 배포
2. **[Presale](/ko/smart-contracts/genesis/presale)** - 고정 가격 토큰 판매
3. **[Uniform Price Auction](/ko/smart-contracts/genesis/uniform-price-auction)** - 균일 청산 가격의 시간 기반 경매

각 가이드에는 완전한 설정 코드, 사용자 작업 및 구성이 포함되어 있습니다.
