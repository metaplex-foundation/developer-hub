---
title: Launch (API)
metaTitle: Launch 명령어 | Metaplex CLI
description: Metaplex CLI(mplx)를 사용하여 Genesis API를 통해 토큰 출시를 생성하고 등록합니다.
keywords:
  - Genesis launch
  - token launch CLI
  - mplx genesis launch
  - Genesis API
  - Metaplex CLI
about:
  - Genesis API token launches
  - one-command token launch
  - launch registration
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
faqs:
  - q: genesis launch create와 수동 흐름의 차이점은 무엇인가요?
    a: genesis launch create 명령어는 Genesis API를 호출하여 트랜잭션을 빌드하고, 서명 및 전송하며, Metaplex 플랫폼에 출시를 등록하는 올인원 흐름입니다 — 모두 단일 명령어로 수행됩니다. 수동 흐름은 별도의 create, bucket, finalize, register 단계가 필요합니다.
  - q: genesis launch register는 언제 사용해야 하나요?
    a: 이미 저수준 CLI 명령어(genesis create, bucket add-launch-pool 등)를 사용하여 genesis 계정을 생성했고, 공개 출시 페이지를 위해 Metaplex 플랫폼에 등록하려는 경우 genesis launch register를 사용합니다.
  - q: launch 명령어는 어떤 네트워크를 사용하나요?
    a: 네트워크는 구성된 RPC 엔드포인트에서 자동 감지됩니다. --network 플래그(solana-mainnet 또는 solana-devnet)로 재정의할 수 있습니다.
---

{% callout title="수행할 작업" %}
Genesis API를 사용하여 단일 명령어로 토큰 출시를 생성하고 등록합니다:
- `genesis launch create`로 완전한 토큰 출시 생성
- `genesis launch register`로 기존 genesis 계정 등록
{% /callout %}

## 요약

`genesis launch` 명령어는 Genesis API를 사용하여 token을 출시하는 간소화된 방법을 제공합니다. genesis 계정을 수동으로 생성하고, bucket을 추가하고, finalize하고, 별도로 등록하는 대신 API가 전체 흐름을 처리합니다.

- **`genesis launch create`**: 올인원 명령어 — API를 통해 트랜잭션을 빌드하고, 서명 및 전송하며, 출시를 등록
- **`genesis launch register`**: 기존 genesis 계정을 Metaplex 플랫폼에 등록하여 공개 출시 페이지 생성
- **metaplex.com 호환**: API를 통해 생성 또는 등록된 출시는 [metaplex.com](https://metaplex.com)에 공개 출시 페이지와 함께 표시
- **총 공급량**: 현재 1,000,000,000 token으로 고정
- **입금 기간**: 현재 48시간

## 범위 외

수동 genesis 계정 생성, 개별 bucket 구성, Presale 설정, 프론트엔드 개발.

**바로가기:** [Launch Create](#launch-create) · [Launch Register](#launch-register) · [잠금 할당](#잠금-할당) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq)

## Launch Create

`mplx genesis launch create` 명령어는 Genesis API를 통해 새 토큰 출시를 생성합니다. 전체 흐름을 처리합니다:

1. Genesis API를 호출하여 온체인 트랜잭션 빌드
2. 서명하여 네트워크에 전송
3. Metaplex 플랫폼에 출시 등록

```bash {% title="토큰 출시 생성" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

### 필수 플래그

| 플래그 | 설명 |
|--------|------|
| `--name <string>` | token 이름 (1~32자) |
| `--symbol <string>` | token 심볼 (1~10자) |
| `--image <string>` | token 이미지 URL (현재 `https://gateway.irys.xyz/`로 시작해야 함) |
| `--tokenAllocation <integer>` | Launch Pool token 할당량 (10억 총 공급량의 일부) |
| `--depositStartTime <string>` | 입금 시작 시간 (ISO 날짜 문자열 또는 Unix 타임스탬프) |
| `--raiseGoal <integer>` | 모금 목표 (정수 단위, 예: 200 SOL의 경우 200) |
| `--raydiumLiquidityBps <integer>` | Raydium 유동성 (basis point, 2000~10000, 즉 20%~100%) |
| `--fundsRecipient <string>` | 자금 수령인 지갑 주소 |

### 선택적 플래그

| 플래그 | 설명 | 기본값 |
|--------|------|--------|
| `--description <string>` | token 설명 (최대 250자) | — |
| `--website <string>` | 프로젝트 웹사이트 URL | — |
| `--twitter <string>` | 프로젝트 Twitter URL | — |
| `--telegram <string>` | 프로젝트 Telegram URL | — |
| `--lockedAllocations <path>` | 잠금 할당 구성 JSON 파일 경로 | — |
| `--quoteMint <string>` | quote mint (현재 `SOL` 또는 `USDC` 지원) | `SOL` |
| `--network <string>` | 네트워크 재정의: `solana-mainnet` 또는 `solana-devnet` | 자동 감지 |
| `--apiUrl <string>` | Genesis API 기본 URL | `https://api.metaplex.com` |

### 예제

1. SOL을 사용한 기본 출시:
```bash {% title="기본 출시" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

2. USDC를 quote mint로 사용:
```bash {% title="USDC로 출시" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 1709251200 \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --quoteMint USDC
```

3. 메타데이터 및 잠금 할당 포함:
```bash {% title="메타데이터 및 할당 포함 전체 출시" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --description "A community token for builders" \
  --website "https://example.com" \
  --twitter "https://x.com/myproject" \
  --telegram "https://t.me/myproject" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --lockedAllocations allocations.json
```

### 출력

성공 시 명령어가 출력하는 내용:
- **Genesis Account** 주소
- 새 token의 **Mint Address**
- Metaplex 플랫폼의 **Launch ID** 및 **Launch Link**
- **Token ID**
- 탐색기 링크가 포함된 트랜잭션 서명

## Launch Register

`mplx genesis launch register` 명령어는 기존 genesis 계정을 Metaplex 플랫폼에 등록합니다. 저수준 CLI 명령어(`genesis create`, `bucket add-launch-pool` 등)로 genesis 계정을 생성했고 공개 출시 페이지를 원할 때 사용합니다.

```bash {% title="Genesis 계정 등록" %}
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig launch.json
```

### 인수

| 인수 | 설명 | 필수 |
|------|------|------|
| `genesisAccount` | 등록할 genesis 계정 주소 | 예 |

### 플래그

| 플래그 | 설명 | 필수 | 기본값 |
|--------|------|------|--------|
| `--launchConfig <path>` | 출시 구성 JSON 파일 경로 | 예 | — |
| `--network <string>` | 네트워크 재정의: `solana-mainnet` 또는 `solana-devnet` | 아니요 | 자동 감지 |
| `--apiUrl <string>` | Genesis API 기본 URL | 아니요 | `https://api.metaplex.com` |

### Launch 구성 형식

launch 구성 JSON 파일은 `launch create` 입력과 동일한 형식을 사용합니다:

```json {% title="launch.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "My Token",
    "symbol": "MTK",
    "image": "https://gateway.irys.xyz/abc123",
    "description": "Optional description",
    "externalLinks": {
      "website": "https://example.com",
      "twitter": "https://x.com/myproject"
    }
  },
  "launchType": "project",
  "launch": {
    "launchpool": {
      "tokenAllocation": 500000000,
      "depositStartTime": "2025-03-01T00:00:00Z",
      "raiseGoal": 200,
      "raydiumLiquidityBps": 5000,
      "fundsRecipient": "<WALLET_ADDRESS>"
    }
  },
  "quoteMint": "SOL"
}
```

### 예제

1. 기본 네트워크 감지로 등록:
```bash {% title="출시 등록" %}
mplx genesis launch register <GENESIS_ACCOUNT> --launchConfig launch.json
```

2. devnet에서 등록:
```bash {% title="devnet에서 등록" %}
mplx genesis launch register <GENESIS_ACCOUNT> \
  --launchConfig launch.json \
  --network solana-devnet
```

### 출력

성공 시 명령어가 출력하는 내용:
- Metaplex 플랫폼의 **Launch ID** 및 **Launch Link**
- **Token ID** 및 **Mint Address**

계정이 이미 등록되어 있는 경우, 명령어는 이를 알리고 기존 출시 세부 정보를 표시합니다.

## 잠금 할당

잠금 할당을 사용하면 베스팅 스케줄로 token 공급량의 일부를 예약할 수 있습니다. `--lockedAllocations`를 통해 JSON 배열 파일로 제공합니다.

```json {% title="allocations.json" %}
[
  {
    "name": "Team",
    "recipient": "<WALLET_ADDRESS>",
    "tokenAmount": 200000000,
    "vestingStartTime": "2025-04-01T00:00:00Z",
    "vestingDuration": { "value": 1, "unit": "YEAR" },
    "unlockSchedule": "MONTH",
    "cliff": {
      "duration": { "value": 3, "unit": "MONTH" },
      "unlockAmount": 50000000
    }
  }
]
```

### 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | string | 이 할당의 이름 |
| `recipient` | string | 수령인의 지갑 주소 |
| `tokenAmount` | number | 할당할 token 수 |
| `vestingStartTime` | string | 베스팅 시작 시점의 ISO 날짜 문자열 |
| `vestingDuration` | object | `value`(숫자)와 `unit`을 포함한 기간 |
| `unlockSchedule` | string | token 잠금 해제 빈도 |
| `cliff` | object | 선택적 클리프, `duration`과 `unlockAmount` 포함 |

### 유효한 시간 단위

`SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `TWO_WEEKS`, `MONTH`, `QUARTER`, `YEAR`

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| API request failed | 네트워크 문제 또는 잘못된 입력 | 오류 응답 세부 정보를 확인하세요 — 유효성 검사 오류 시 API 응답 본문이 표시됩니다 |
| Locked allocations file not found | 잘못된 파일 경로 | 할당 JSON 파일 경로를 확인하세요 |
| Must contain a JSON array | 할당 파일이 배열이 아님 | JSON 파일이 객체가 아닌 배열 `[...]`을 포함하는지 확인하세요 |
| raydiumLiquidityBps out of range | 값이 2000~10000 범위 밖 | 2000(20%)에서 10000(100%) 사이의 값을 사용하세요 |
| Launch config missing required fields | register용 구성이 불완전 | launch 구성 JSON에 `token`, `launch`, `launchType: "project"`가 포함되어 있는지 확인하세요 |

## FAQ

**`genesis launch create`와 수동 흐름의 차이점은 무엇인가요?**
`genesis launch create` 명령어는 Genesis API를 호출하여 트랜잭션을 빌드하고, 서명 및 전송하며, Metaplex 플랫폼에 출시를 등록하는 올인원 흐름입니다 — 모두 단일 명령어로 수행됩니다. 수동 흐름은 별도의 `create`, `bucket add-launch-pool`, `finalize`, register 단계가 필요합니다.

**`genesis launch register`는 언제 사용해야 하나요?**
이미 저수준 CLI 명령어(`genesis create`, `bucket add-launch-pool` 등)를 사용하여 genesis 계정을 생성했고, 공개 출시 페이지를 위해 Metaplex 플랫폼에 등록하려는 경우 `genesis launch register`를 사용합니다.

**launch 명령어는 어떤 네트워크를 사용하나요?**
네트워크는 구성된 RPC 엔드포인트에서 자동 감지됩니다. `--network` 플래그(`solana-mainnet` 또는 `solana-devnet`)로 재정의할 수 있습니다.

**커스텀 quote mint를 사용할 수 있나요?**
API는 현재 `SOL`(기본값)과 `USDC`를 지원합니다. USDC를 사용하려면 `--quoteMint USDC`를 전달하세요.

**총 token 공급량은 얼마인가요?**
API 흐름을 사용할 때 총 공급량은 현재 1,000,000,000 token으로 고정되어 있습니다.
