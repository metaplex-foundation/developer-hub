---
title: Launch (API)
metaTitle: Launch 명령어 | Metaplex CLI
description: Metaplex CLI(mplx)를 사용하여 Genesis API를 통해 토큰 출시를 생성하고 등록합니다 — launchpool과 bonding curve, 선택적 agent 통합을 지원합니다.
keywords:
  - Genesis launch
  - token launch CLI
  - mplx genesis launch
  - Genesis API
  - Metaplex CLI
  - bonding curve
  - agent token
about:
  - Genesis API token launches
  - one-command token launch
  - launch registration
  - bonding curve launch
  - agent token launch
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
  - q: launchpool과 bonding-curve의 차이점은 무엇인가요?
    a: Launchpool은 48시간 입금 기간이 있으며, 사용자가 SOL을 입금하고 비례적으로 토큰을 받습니다. Bonding curve는 상수 곱 AMM으로 즉시 거래가 시작되며, SOL이 유입되면 가격이 상승하고, 모든 토큰이 판매되면 자동으로 Raydium CPMM으로 졸업합니다.
  - q: agent를 토큰 출시에 연결할 수 있나요?
    a: 네. --agentMint에 agent의 Core 자산 주소를 전달합니다. 이렇게 하면 agent의 PDA에서 크리에이터 수수료 지갑이 자동으로 파생됩니다. --agentSetToken을 추가하면 토큰을 agent에 영구적으로 연결합니다(되돌릴 수 없음).
---

{% callout title="수행할 작업" %}
Genesis API를 사용하여 단일 명령어로 토큰 출시를 생성하고 등록합니다:
- **launchpool** 생성 (48시간 입금 기간, 비례 배분)
- **bonding curve** 생성 (즉시 거래, Raydium으로 자동 졸업)
- 선택적으로 `--agentMint`를 사용하여 출시를 [agent](/ko/agents/mint-agent)에 연결
- `genesis launch register`로 기존 genesis 계정 등록
{% /callout %}

## 요약

`genesis launch` 명령어는 Genesis API를 사용하여 토큰을 출시하는 간소화된 방법을 제공합니다. genesis 계정을 수동으로 생성하고, bucket을 추가하고, finalize하고, 별도로 등록하는 대신 API가 전체 흐름을 처리합니다.

- **`genesis launch create`**: 올인원 명령어 — API를 통해 트랜잭션을 빌드하고, 서명 및 전송하며, 출시를 등록
- **`genesis launch register`**: 기존 genesis 계정을 Metaplex 플랫폼에 등록하여 공개 출시 페이지 생성
- **두 가지 출시 유형**: `launchpool` (기본값, 48시간 입금, 구성 가능한 할당)과 `bonding-curve` (즉시 bonding curve, 입금 기간 없음)
- **Agent 지원**: `--agentMint` 및 선택적으로 `--agentSetToken`을 사용하여 출시를 등록된 agent에 연결
- **metaplex.com 호환**: API를 통해 생성 또는 등록된 출시는 [metaplex.com](https://metaplex.com)에 공개 출시 페이지와 함께 표시
- **총 공급량**: 현재 1,000,000,000 토큰으로 고정

**바로가기:** [Launch Create](#launch-create) · [Bonding Curve](#bonding-curve) · [Agent 출시](#agent-launches) · [Launch Register](#launch-register) · [잠금 할당](#locked-allocations) · [일반적인 오류](#common-errors) · [FAQ](#faq)

## Launch Create

`mplx genesis launch create` 명령어는 Genesis API를 통해 새 토큰 출시를 생성합니다. 전체 흐름을 처리합니다:

1. Genesis API를 호출하여 온체인 트랜잭션 빌드
2. 서명하여 네트워크에 전송
3. Metaplex 플랫폼에 출시 등록

두 가지 출시 유형을 사용할 수 있습니다:

- **`launchpool`** (기본값): 48시간 입금 기간, 비례적 토큰 배분, 구성 가능한 할당. `--tokenAllocation`, `--depositStartTime`, `--raiseGoal`, `--raydiumLiquidityBps`, `--fundsRecipient`가 필요합니다.
- **`bonding-curve`**: 즉시 bonding curve (상수 곱 AMM). 거래가 즉시 시작되며 입금 기간이 없습니다. 모든 토큰이 판매되면 자동으로 Raydium CPMM 풀로 졸업합니다. `--name`, `--symbol`, `--image`만 필요합니다.

### Launchpool 예제

```bash {% title="Launchpool 출시 생성" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

### 모든 플래그

| 플래그 | 설명 | 필수 | 기본값 |
|--------|------|------|--------|
| `--launchType <string>` | `launchpool` 또는 `bonding-curve` | 아니요 | `launchpool` |
| `--name <string>` | 토큰 이름 (1~32자) | 예 | — |
| `--symbol <string>` | 토큰 심볼 (1~10자) | 예 | — |
| `--image <string>` | 토큰 이미지 URL (`https://gateway.irys.xyz/`로 시작해야 함) | 예 | — |
| `--tokenAllocation <integer>` | Launch Pool 토큰 할당량 (10억 총 공급량의 일부) | Launchpool 전용 | — |
| `--depositStartTime <string>` | 입금 시작 시간 (ISO 날짜 문자열 또는 Unix 타임스탬프) | Launchpool 전용 | — |
| `--raiseGoal <integer>` | 모금 목표 (정수 단위, 예: 250 = 250 SOL) | Launchpool 전용 | — |
| `--raydiumLiquidityBps <integer>` | Raydium 유동성 (basis point, 2000~10000, 즉 20%~100%) | Launchpool 전용 | — |
| `--fundsRecipient <string>` | 모금된 자금의 잠금 해제 부분을 받는 지갑 | Launchpool 전용 | — |
| `--creatorFeeWallet <string>` | 크리에이터 수수료를 받는 지갑 (항상 활성화, 수수료가 누적되며 졸업 후 청구) | 아니요 (bonding-curve 전용) | 출시 지갑 |
| `--firstBuyAmount <number>` | 출시 시 수수료 면제 초기 구매를 위한 SOL 금액 | 아니요 (bonding-curve 전용) | — |
| `--agentMint <string>` | Agent의 Core 자산 주소 — agent PDA에서 크리에이터 수수료 지갑을 자동 파생 | 아니요 | — |
| `--agentSetToken` | 출시된 토큰을 agent에 영구적으로 연결 (**되돌릴 수 없음**). `--agentMint` 필요 | 아니요 | `false` |
| `--description <string>` | 토큰 설명 (최대 250자) | 아니요 | — |
| `--website <string>` | 프로젝트 웹사이트 URL | 아니요 | — |
| `--twitter <string>` | 프로젝트 Twitter URL | 아니요 | — |
| `--telegram <string>` | 프로젝트 Telegram URL | 아니요 | — |
| `--lockedAllocations <path>` | 잠금 할당 구성 JSON 파일 경로 (launchpool 전용) | 아니요 | — |
| `--quoteMint <string>` | Quote mint (`SOL` 또는 `USDC`) | 아니요 | `SOL` |
| `--network <string>` | 네트워크 재정의: `solana-mainnet` 또는 `solana-devnet` | 아니요 | 자동 감지 |
| `--apiUrl <string>` | Genesis API 기본 URL | 아니요 | `https://api.metaplex.com` |

### Launchpool 예제

1. SOL을 사용한 기본 출시:
```bash {% title="기본 출시" %}
mplx genesis launch create \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
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
  --raiseGoal 5000 \
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
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS> \
  --lockedAllocations allocations.json
```

## Bonding Curve

Bonding curve 출시는 거래가 즉시 시작되는 상수 곱 AMM을 생성합니다. SOL이 curve에 유입되면 가격이 상승합니다. 모든 토큰이 판매되면 curve가 자동으로 Raydium CPMM 풀로 졸업합니다.

```bash {% title="기본 bonding curve 출시" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123"
```

`--name`, `--symbol`, `--image`만 필요합니다 — 모든 프로토콜 매개변수는 기본값을 사용합니다.

{% callout type="note" %}
크리에이터 수수료는 bonding curve 출시에서 항상 활성화됩니다 — 기본적으로 출시 지갑으로 설정됩니다. 수수료는 거래 중 bucket에 누적되며, curve가 Raydium으로 졸업한 후 별도로 청구해야 합니다.
{% /callout %}

### 크리에이터 수수료 설정

스왑 수수료의 일부를 특정 지갑으로 보냅니다:

```bash {% title="크리에이터 수수료가 있는 bonding curve" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --creatorFeeWallet <FEE_WALLET_ADDRESS>
```

### 첫 구매 설정

출시 지갑을 위한 수수료 면제 초기 구매를 예약합니다:

```bash {% title="첫 구매가 있는 bonding curve" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Token" \
  --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --firstBuyAmount 0.1
```

첫 구매 금액은 SOL 단위입니다 (예: `0.1` = 0.1 SOL). 첫 구매에는 프로토콜 수수료나 크리에이터 수수료가 부과되지 않습니다.

## Agent 출시

`--agentMint`를 전달하여 토큰 출시를 등록된 [agent](/ko/agents/mint-agent)에 연결합니다. launchpool과 bonding curve 출시 유형 모두에서 사용할 수 있습니다.

`--agentMint`가 제공되면:
- **크리에이터 수수료 지갑**이 agent의 Core 자산 서명자 PDA에서 자동으로 파생됩니다
- Bonding curve의 경우, **첫 구매 구매자**가 agent PDA로 기본 설정됩니다 (`--firstBuyAmount`가 설정된 경우)

```bash {% title="Agent가 있는 bonding curve" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_MINT> \
  --agentSetToken
```

{% callout title="agentSetToken은 되돌릴 수 없습니다" type="warning" %}
`--agentSetToken`은 출시된 토큰을 agent에 영구적으로 연결합니다. 이 작업은 되돌릴 수 없습니다. 연결 없이 출시하려면 이 플래그를 생략하고, 나중에 `mplx agents set-agent-token`으로 연결하세요.
{% /callout %}

### 전체 과정: Agent 등록 + 토큰 출시

```bash {% title="Agent 등록 후 토큰 출시" %}
# 1. 새 agent 등록
mplx agents register --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
# 출력에서 자산 주소를 확인합니다 (예: 7BQj...)

# 2. Agent에 연결된 bonding curve 토큰 출시
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentMint <AGENT_MINT> --agentSetToken

# 3. (선택 사항) Agent에 토큰이 연결되었는지 확인
mplx agents fetch <AGENT_MINT>
```

{% callout title="RPC 전파 지연" type="note" %}
2단계에서 "Agent is not owned by the connected wallet" 오류가 발생하면, API 백엔드가 아직 새 agent를 인덱싱하지 않은 것입니다. 온체인 토큰 생성은 이미 성공했을 수 있습니다 — `mplx agents fetch <AGENT_MINT>`로 확인하세요. Agent에 이미 토큰이 설정되어 있으면 플랫폼 등록만 실패한 것이므로 `mplx genesis launch register`로 완료하세요. 두 단계를 스크립팅할 때는 agent 등록과 출시 명령어 사이에 약 30초의 지연을 추가하세요.
{% /callout %}

### 출력

성공 시 명령어가 출력하는 내용:
- **Genesis Account** 주소
- 새 토큰의 **Mint Address**
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

launch 구성 JSON 파일은 `launch create` 입력과 동일한 형식을 사용합니다.

**Launchpool 구성:**

```json {% title="launch-launchpool.json" %}
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
  "launchType": "launchpool",
  "launch": {
    "launchpool": {
      "tokenAllocation": 500000000,
      "depositStartTime": "2025-03-01T00:00:00Z",
      "raiseGoal": 250,
      "raydiumLiquidityBps": 5000,
      "fundsRecipient": "<WALLET_ADDRESS>"
    }
  },
  "quoteMint": "SOL"
}
```

**Bonding curve 구성:**

```json {% title="launch-bonding-curve.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "My Token",
    "symbol": "MTK",
    "image": "https://gateway.irys.xyz/abc123"
  },
  "launchType": "bondingCurve",
  "launch": {
    "creatorFeeWallet": "<FEE_WALLET_ADDRESS>",
    "firstBuyAmount": 0.1
  },
  "quoteMint": "SOL"
}
```

**Agent가 있는 bonding curve 구성:**

```json {% title="launch-agent.json" %}
{
  "wallet": "<WALLET_ADDRESS>",
  "token": {
    "name": "Agent Token",
    "symbol": "AGT",
    "image": "https://gateway.irys.xyz/abc123"
  },
  "launchType": "bondingCurve",
  "agent": {
    "mint": "<AGENT_MINT>",
    "setToken": true
  },
  "launch": {},
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

잠금 할당을 사용하면 베스팅 스케줄로 토큰 공급량의 일부를 예약할 수 있습니다. `--lockedAllocations`를 통해 JSON 배열 파일로 제공합니다.

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
| `tokenAmount` | number | 할당할 토큰 수 |
| `vestingStartTime` | string | 베스팅 시작 시점의 ISO 날짜 문자열 |
| `vestingDuration` | object | `value`(숫자)와 `unit`을 포함한 기간 |
| `unlockSchedule` | string | 토큰 잠금 해제 빈도 |
| `cliff` | object | 선택적 클리프, `duration`과 `unlockAmount` 포함 |

### 유효한 시간 단위

`SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `TWO_WEEKS`, `MONTH`, `QUARTER`, `YEAR`

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| API request failed | 네트워크 문제 또는 잘못된 입력 | 오류 응답 세부 정보를 확인하세요 — 유효성 검사 오류 시 API 응답 본문이 표시됩니다 |
| Agent is not owned by the connected wallet | API 백엔드가 새로 등록된 agent를 아직 인덱싱하지 않음 | 약 30초 후 재시도하거나 `mplx agents fetch`로 확인하세요 — 등록이 실패해도 온체인 출시는 성공했을 수 있습니다 |
| Agent already has a different agent token set | 이 agent에 대해 이전 출시에서 `--agentSetToken`이 이미 사용됨 | Agent 토큰 연결은 되돌릴 수 없으며 한 번만 가능합니다. `--agentSetToken` 없이 출시하거나 다른 agent를 사용하세요 |
| Locked allocations file not found | 잘못된 파일 경로 | 할당 JSON 파일 경로를 확인하세요 |
| Must contain a JSON array | 할당 파일이 배열이 아님 | JSON 파일이 객체가 아닌 배열 `[...]`을 포함하는지 확인하세요 |
| raydiumLiquidityBps out of range | 값이 2000~10000 범위 밖 | 2000(20%)에서 10000(100%) 사이의 값을 사용하세요 |
| Launch config missing required fields | register용 구성이 불완전 | launch 구성 JSON에 `token`, `launch`, 유효한 `launchType`이 포함되어 있는지 확인하세요 |

## FAQ

**`genesis launch create`와 수동 흐름의 차이점은 무엇인가요?**
`genesis launch create` 명령어는 Genesis API를 호출하여 트랜잭션을 빌드하고, 서명 및 전송하며, Metaplex 플랫폼에 출시를 등록하는 올인원 흐름입니다 — 모두 단일 명령어로 수행됩니다. 수동 흐름은 별도의 `create`, `bucket add-launch-pool`, `finalize`, register 단계가 필요합니다.

**launchpool과 bonding-curve의 차이점은 무엇인가요?**
Launchpool은 48시간 입금 기간이 있으며, 사용자가 SOL을 입금하고 비례적으로 토큰을 받습니다. Bonding curve는 상수 곱 AMM으로 즉시 거래가 시작되며 — SOL이 유입되면 가격이 상승하고, 모든 토큰이 판매되면 자동으로 Raydium CPMM으로 졸업합니다.

**Agent를 토큰 출시에 연결할 수 있나요?**
네. `--agentMint`에 agent의 Core 자산 주소를 전달합니다. 이렇게 하면 agent의 PDA에서 크리에이터 수수료 지갑이 자동으로 파생됩니다. `--agentSetToken`을 추가하면 토큰을 agent에 영구적으로 연결합니다 (되돌릴 수 없음). Launchpool과 bonding curve 모두에서 사용할 수 있습니다.

**`genesis launch register`는 언제 사용해야 하나요?**
이미 저수준 CLI 명령어(`genesis create`, `bucket add-launch-pool` 등)를 사용하여 genesis 계정을 생성했고, 공개 출시 페이지를 위해 Metaplex 플랫폼에 등록하려는 경우 `genesis launch register`를 사용합니다.

**launch 명령어는 어떤 네트워크를 사용하나요?**
네트워크는 구성된 RPC 엔드포인트에서 자동 감지됩니다. `--network` 플래그(`solana-mainnet` 또는 `solana-devnet`)로 재정의할 수 있습니다.

**커스텀 quote mint를 사용할 수 있나요?**
API는 현재 `SOL`(기본값)과 `USDC`를 지원합니다. USDC를 사용하려면 `--quoteMint USDC`를 전달하세요.

**총 토큰 공급량은 얼마인가요?**
API 흐름을 사용할 때 총 공급량은 현재 1,000,000,000 토큰으로 고정되어 있습니다.
