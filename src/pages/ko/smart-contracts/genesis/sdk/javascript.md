---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis
description: Solana에서 토큰 런칭을 위한 Genesis JavaScript SDK 설치 및 구성 방법을 알아보세요.
---

Metaplex는 Genesis 프로그램과 상호작용하기 위한 JavaScript 라이브러리를 제공합니다. [Umi Framework](/umi) 기반으로 제작되어 모든 JavaScript 또는 TypeScript 프로젝트에서 사용할 수 있는 경량 라이브러리입니다.

{% quick-links %}

{% quick-link title="API 레퍼런스" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="Genesis JavaScript SDK 자동 생성 API 문서." /%}

{% quick-link title="NPM 패키지" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="NPM의 Genesis JavaScript SDK." /%}

{% quick-link title="GitHub" target="_blank" icon="GitHub" href="https://github.com/metaplex-foundation/mpl-genesis" description="Genesis 프로그램 및 SDK 소스 코드." /%}

{% /quick-links %}

## 설치

Genesis SDK와 필요한 Metaplex 및 Solana 의존성을 설치합니다:

```bash
npm install \
  @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox \
  @metaplex-foundation/mpl-token-metadata
```

### 패키지 개요

| 패키지 | 목적 |
|---------|---------|
| `@metaplex-foundation/genesis` | 모든 인스트럭션과 헬퍼가 포함된 핵심 Genesis SDK |
| `@metaplex-foundation/umi` | 트랜잭션 빌드를 위한 Metaplex의 Solana 프레임워크 |
| `@metaplex-foundation/umi-bundle-defaults` | 기본 Umi 플러그인 및 구성 |
| `@metaplex-foundation/mpl-toolbox` | SPL 토큰 작업을 위한 유틸리티 |
| `@metaplex-foundation/mpl-token-metadata` | 토큰 메타데이터 프로그램 통합 |

## Umi 설정

Genesis SDK는 Metaplex의 Solana용 JavaScript 프레임워크인 [Umi](/umi) 위에 구축되었습니다. Umi를 아직 설정하지 않았다면 [Umi 시작하기](/umi/getting-started) 가이드를 확인하세요.

### 기본 구성

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// Umi 인스턴스 생성 및 구성
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

`genesis()` 플러그인은 모든 Genesis 인스트럭션과 계정 역직렬화기를 Umi에 등록합니다. Genesis는 메타데이터가 있는 토큰을 생성하므로 `mplTokenMetadata()` 플러그인이 필요합니다.

### 개발 vs 프로덕션

```typescript
// 개발: devnet 사용
const umi = createUmi('https://api.devnet.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());

// 프로덕션: 신뢰할 수 있는 RPC로 mainnet 사용
const umi = createUmi('https://your-rpc-provider.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

## 서명자 설정

Genesis 작업에는 트랜잭션 승인을 위한 서명자가 필요합니다. 백엔드 작업의 경우 일반적으로 환경 변수에서 로드된 키페어를 사용합니다.

### 비밀키에서 서명자 생성

```typescript
import {
  createSignerFromKeypair,
  signerIdentity,
  type Signer,
  type Umi,
} from '@metaplex-foundation/umi';

// JSON 인코딩된 비밀키에서 서명자를 생성하는 헬퍼
const createSignerFromSecretKeyString = (
  umi: Umi,
  secretKeyString: string
): Signer => {
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  return createSignerFromKeypair(umi, keypair);
};

// 환경에서 백엔드 서명자 로드
const backendSigner = createSignerFromSecretKeyString(
  umi,
  process.env.BACKEND_KEYPAIR!
);

// 트랜잭션의 기본 아이덴티티로 설정
umi.use(signerIdentity(backendSigner));
```

{% callout type="warning" %}
**보안 참고**: 키페어를 버전 관리에 커밋하지 마세요. 프로덕션 배포에는 환경 변수, AWS KMS, GCP Secret Manager 또는 하드웨어 지갑을 사용하세요.
{% /callout %}

### 전체 설정 예제

필요한 모든 import가 포함된 전체 설정입니다:

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
  publicKey,
  type Signer,
  type Umi,
} from '@metaplex-foundation/umi';
import {
  genesis,
  initializeV2,
  addLaunchPoolBucketV2,
  addUnlockedBucketV2,
  finalizeV2,
  findGenesisAccountV2Pda,
} from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// Umi 초기화
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());

// 백엔드 서명자 설정
const createSignerFromSecretKeyString = (umi: Umi, secretKeyString: string): Signer => {
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  return createSignerFromKeypair(umi, keypair);
};

const backendSigner = createSignerFromSecretKeyString(umi, process.env.BACKEND_KEYPAIR!);
umi.use(signerIdentity(backendSigner));

console.log('백엔드 서명자로 Umi 구성됨:', backendSigner.publicKey);
```

## 에러 처리

```typescript
try {
  await initializeV2(umi, { ... }).sendAndConfirm(umi);
  console.log('성공!');
} catch (error) {
  if (error.message.includes('insufficient funds')) {
    console.error('트랜잭션 수수료를 위한 SOL이 부족합니다');
  } else if (error.message.includes('already initialized')) {
    console.error('Genesis 계정이 이미 존재합니다');
  } else {
    console.error('트랜잭션 실패:', error);
  }
}
```

## 트랜잭션 확인

```typescript
// finalized 확인 대기 (가장 안전)
const result = await initializeV2(umi, { ... })
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' }
  });

console.log('트랜잭션 서명:', result.signature);
```

## 다음 단계

Genesis 프로그램으로 Umi 인스턴스가 구성되면 빌드를 시작할 준비가 됩니다. Genesis 기능을 살펴보세요:

- **[Launch Pool](/smart-contracts/genesis/launch-pool)** - 예치 기간이 있는 토큰 배포
- **[Priced Sale](/smart-contracts/genesis/priced-sale)** - 거래 전 사전 예치 수집
- **[Uniform Price Auction](/smart-contracts/genesis/uniform-price-auction)** - 균일 청산 가격의 시간 기반 경매
