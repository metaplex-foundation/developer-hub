---
title: Aggregation API
metaTitle: Genesis - Aggregation API | Launch Data | Metaplex
description: Genesis 주소 또는 토큰 민트로 Genesis 런칭 데이터를 조회하기 위한 공개 API. 온체인 상태 조회 포함.
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - Genesis API
  - aggregation API
  - launch data
  - token queries
  - on-chain state
about:
  - API integration
  - Data aggregation
  - Launch information
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: API와 온체인 조회의 차이점은 무엇인가요?
    a: API는 집계된 메타데이터(소셜, 이미지)를 반환합니다. SDK를 통한 온체인 조회는 예치 총액 및 시간 조건과 같은 실시간 상태를 반환합니다.
  - q: 실시간 예치 총액을 어떻게 가져오나요?
    a: Genesis SDK의 fetchLaunchPoolBucketV2 또는 fetchPresaleBucketV2를 사용하여 현재 온체인 상태를 읽으세요.
  - q: 버킷의 시간 조건을 조회할 수 있나요?
    a: 예. 버킷 계정을 조회하여 depositStartCondition, depositEndCondition, claimStartCondition, claimEndCondition에 접근하세요.
  - q: 사용자가 예치했는지 어떻게 확인하나요?
    a: 예치 PDA와 함께 safeFetchLaunchPoolDepositV2 또는 safeFetchPresaleDepositV2를 사용하세요. 예치가 없으면 null을 반환합니다.
---

Genesis API를 사용하면 애그리게이터와 애플리케이션이 Genesis 토큰 런칭에서 런칭 데이터를 조회할 수 있습니다. 이 엔드포인트를 사용하여 애플리케이션에 런칭 정보, 토큰 메타데이터 및 소셜 링크를 표시하세요. {% .lead %}

{% callout title="배우게 될 내용" %}
이 레퍼런스에서 다루는 내용:
- 런칭 메타데이터용 HTTP API 엔드포인트
- JavaScript SDK를 사용한 온체인 상태 조회
- TypeScript 및 Rust 타입 정의
- 실시간 버킷 및 예치 상태
{% /callout %}

## 요약

메타데이터는 HTTP API를, 실시간 온체인 상태는 SDK를 통해 Genesis 데이터에 접근하세요.

- HTTP API는 런칭 정보, 토큰 메타데이터, 소셜을 반환합니다
- SDK는 실시간 상태를 제공합니다: 예치, 수량, 시간 조건
- HTTP API에는 인증이 필요하지 않습니다
- 온체인 조회에는 Umi와 Genesis SDK가 필요합니다

{% callout type="note" %}
API는 속도 제한이 있는 공개 API입니다. 인증은 필요하지 않습니다.
{% /callout %}

## 기본 URL

```
https://api.metaplex.com/v1
```

## 네트워크 선택

기본적으로 API는 Solana 메인넷의 데이터를 반환합니다. 대신 데브넷 런칭을 조회하려면 `network` 쿼리 파라미터를 추가하세요:

```
?network=solana-devnet
```

**예시:**

```bash
# Mainnet (default)
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN

# Devnet
curl "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN?network=solana-devnet"
```

## 사용 사례

- **`/launches/{genesis_pubkey}`** - 온체인 이벤트나 트랜잭션 로그에서 가져온 genesis 주소가 있을 때 사용합니다.
- **`/tokens/{mint}`** - 토큰 민트 주소만 알고 있을 때 사용합니다. 해당 토큰과 관련된 모든 런칭을 반환합니다(하나의 토큰에 여러 런칭 캠페인이 있을 수 있습니다).

## 엔드포인트

### Genesis 주소로 런칭 조회

```
GET /launches/{genesis_pubkey}
```

**요청 예시:**

```bash
curl https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN
```

**응답:**

```json
{
  "data": {
    "launch": {
      "launchPage": "https://example.com/launch/mytoken",
      "type": "launchpool",
      "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
    },
    "baseToken": {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://example.com/token-image.png",
      "description": "A community-driven token for the example ecosystem."
    },
    "website": "https://example.com",
    "socials": {
      "x": "https://x.com/mytoken",
      "telegram": "https://t.me/mytoken",
      "discord": "https://discord.gg/mytoken"
    }
  }
}
```

### 토큰 민트로 런칭 조회

```
GET /tokens/{mint}
```

토큰의 모든 런칭을 반환합니다. 응답은 `launches`가 배열이라는 점을 제외하면 동일합니다.

**요청 예시:**

```bash
curl https://api.metaplex.com/v1/tokens/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

**응답:**

```json
{
  "data": {
    "launches": [
      {
        "launchPage": "https://example.com/launch/mytoken",
        "type": "launchpool",
        "genesisAddress": "7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
      }
    ],
    "baseToken": {
      "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "name": "My Token",
      "symbol": "MTK",
      "image": "https://example.com/token-image.png",
      "description": "A community-driven token for the example ecosystem."
    },
    "website": "https://example.com",
    "socials": {
      "x": "https://x.com/mytoken",
      "telegram": "https://t.me/mytoken",
      "discord": "https://discord.gg/mytoken"
    }
  }
}
```

{% callout type="note" %}
genesis 공개 키를 찾으려면 인덱싱 또는 `getProgramAccounts`가 필요합니다. 토큰 민트만 있는 경우 `/tokens` 엔드포인트를 대신 사용하세요.
{% /callout %}

## 오류

```json
{
  "error": {
    "message": "Launch not found"
  }
}
```

| 코드 | 설명 |
| --- | --- |
| `400` | 잘못된 요청 - 유효하지 않은 파라미터 |
| `404` | 런칭 또는 토큰을 찾을 수 없음 |
| `429` | 속도 제한 초과 |
| `500` | 내부 서버 오류 |

## 타입 및 예제

### TypeScript

```ts
interface Launch {
  launchPage: string;
  type: string;
  genesisAddress: string;
}

interface BaseToken {
  address: string;
  name: string;
  symbol: string;
  image: string;
  description: string;
}

interface Socials {
  x?: string;
  telegram?: string;
  discord?: string;
}

interface LaunchResponse {
  data: {
    launch: Launch;
    baseToken: BaseToken;
    website: string;
    socials: Socials;
  };
}

interface TokenResponse {
  data: {
    launches: Launch[];
    baseToken: BaseToken;
    website: string;
    socials: Socials;
  };
}

interface ErrorResponse {
  error: {
    message: string;
  };
}
```

**예시:**

```ts
const response = await fetch(
  "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
);
const { data }: LaunchResponse = await response.json();
console.log(data.baseToken.name); // "My Token"
```

### Rust

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Launch {
    pub launch_page: String,
    #[serde(rename = "type")]
    pub launch_type: String,
    pub genesis_address: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BaseToken {
    pub address: String,
    pub name: String,
    pub symbol: String,
    pub image: String,
    pub description: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Socials {
    pub x: Option<String>,
    pub telegram: Option<String>,
    pub discord: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LaunchData {
    pub launch: Launch,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenData {
    pub launches: Vec<Launch>,
    pub base_token: BaseToken,
    pub website: String,
    pub socials: Socials,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LaunchResponse {
    pub data: LaunchData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenResponse {
    pub data: TokenData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiError {
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: ApiError,
}
```

**예시:**

```rust
let response: LaunchResponse = reqwest::get(
    "https://api.metaplex.com/v1/launches/7nE9GvcwsqzYcPUYfm5gxzCKfmPqi68FM7gPaSfG6EQN"
)
.await?
.json()
.await?;

println!("{}", response.data.base_token.name); // "My Token"
```

{% callout type="note" %}
`Cargo.toml`에 다음 의존성을 추가하세요:
```toml
[dependencies]
reqwest = { version = "0.11", features = ["json"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
```
{% /callout %}

## 온체인 상태 조회 (JavaScript SDK)

HTTP API 외에도 Genesis JavaScript SDK를 사용하여 블록체인에서 직접 런칭 상태를 조회할 수 있습니다. 이는 예치 총액이나 시간 조건과 같은 실시간 데이터를 가져올 때 유용합니다.

### 버킷 상태

```typescript
import { fetchLaunchPoolBucketV2 } from '@metaplex-foundation/genesis';

const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

console.log('Total deposits:', bucket.quoteTokenDepositTotal);
console.log('Deposit count:', bucket.depositCount);
console.log('Claim count:', bucket.claimCount);
console.log('Token allocation:', bucket.bucket.baseTokenAllocation);
```

### 시간 조건

각 버킷에는 런칭 단계를 제어하는 네 가지 시간 조건이 있습니다:

```typescript
const bucket = await fetchLaunchPoolBucketV2(umi, launchPoolBucket);

// Deposit window
const depositStart = bucket.depositStartCondition.time;
const depositEnd = bucket.depositEndCondition.time;

// Claim window
const claimStart = bucket.claimStartCondition.time;
const claimEnd = bucket.claimEndCondition.time;

console.log('Deposit starts:', new Date(Number(depositStart) * 1000));
console.log('Deposit ends:', new Date(Number(depositEnd) * 1000));
console.log('Claims start:', new Date(Number(claimStart) * 1000));
console.log('Claims end:', new Date(Number(claimEnd) * 1000));
```

### 예치 상태

```typescript
import {
  fetchLaunchPoolDepositV2,
  safeFetchLaunchPoolDepositV2,
} from '@metaplex-foundation/genesis';

// Throws if not found
const deposit = await fetchLaunchPoolDepositV2(umi, depositPda);

// Returns null if not found
const maybeDeposit = await safeFetchLaunchPoolDepositV2(umi, depositPda);

if (deposit) {
  console.log('Amount:', deposit.amountQuoteToken);
  console.log('Claimed:', deposit.claimed);
}
```

## FAQ

### API와 온체인 조회의 차이점은 무엇인가요?
API는 집계된 메타데이터(소셜, 이미지)를 반환합니다. SDK를 통한 온체인 조회는 예치 총액 및 시간 조건과 같은 실시간 상태를 반환합니다.

### 실시간 예치 총액을 어떻게 가져오나요?
Genesis SDK의 `fetchLaunchPoolBucketV2` 또는 `fetchPresaleBucketV2`를 사용하여 현재 온체인 상태를 읽으세요.

### 버킷의 시간 조건을 조회할 수 있나요?
예. 버킷 계정을 조회하여 `depositStartCondition`, `depositEndCondition`, `claimStartCondition`, `claimEndCondition`에 접근하세요.

### 사용자가 예치했는지 어떻게 확인하나요?
예치 PDA와 함께 `safeFetchLaunchPoolDepositV2` 또는 `safeFetchPresaleDepositV2`를 사용하세요. 예치가 없으면 null을 반환합니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **Aggregation** | 여러 소스에서 데이터를 수집하고 정규화하는 것 |
| **Bucket State** | 예치 총액 및 수량을 포함한 현재 온체인 데이터 |
| **Time Condition** | 단계의 시작 또는 종료를 제어하는 Unix 타임스탬프 |
| **Deposit PDA** | 사용자의 예치 기록을 저장하는 프로그램 파생 주소 |
| **safeFetch** | 누락된 계정에 대해 예외를 발생시키는 대신 null을 반환하는 조회 변형 |

## 다음 단계

- [JavaScript SDK](/smart-contracts/genesis/sdk/javascript) - 전체 SDK 설정 및 구성
- [API 레퍼런스](/smart-contracts/genesis/api) - HTTP API 엔드포인트 상세 정보
- [Launch Pool](/smart-contracts/genesis/launch-pool) - 비례 분배 설정
