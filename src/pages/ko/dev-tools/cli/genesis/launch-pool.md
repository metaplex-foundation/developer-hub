---
title: Launch Pool
metaTitle: Launch Pool | Metaplex CLI
description: Metaplex CLI를 사용하여 Launch Pool bucket을 생성하고, 예치, 출금, 전환 및 토큰 청구를 수행합니다.
keywords:
  - launch pool
  - genesis launch pool
  - token distribution
  - proportional distribution
  - mplx genesis deposit
about:
  - launch pool bucket
  - proportional token distribution
  - deposit and claim lifecycle
  - end behaviors
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Add a launch pool bucket with allocation and time windows using bucket add-launch-pool
  - Optionally configure end behaviors, penalties, vesting, and allowlists
  - Wrap SOL and deposit quote tokens during the deposit window
  - Transition collected funds to destination buckets after deposits close (if end behaviors are set)
  - Claim base tokens proportional to your deposit after the claim period opens
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: Launch Pool에서 토큰은 어떻게 배분되나요?
    a: 토큰은 비례적으로 배분됩니다. 풀의 총 Quote 토큰 중 10%를 예치했다면, bucket의 기본 토큰 할당량의 10%를 받게 됩니다.
  - q: 예치 후 출금할 수 있나요?
    a: 네, 하지만 예치 기간 동안에만 가능합니다. 예치 기간이 종료되면 출금은 더 이상 불가능합니다.
  - q: End Behavior란 무엇인가요?
    a: End Behavior는 예치 기간 종료 후 Launch Pool에서 수집된 Quote 토큰을 대상 bucket(보통 Unlocked bucket)으로 전달합니다. transition 명령어를 사용하여 실행합니다.
  - q: Claim Schedule이란 무엇인가요?
    a: Claim Schedule은 토큰 청구에 베스팅을 추가합니다 — 토큰이 한번에 전부가 아닌 시간에 따라 점진적으로 릴리스되며, 선택적 클리프 기간이 있습니다.
---

{% callout title="수행할 작업" %}
CLI에서 전체 Launch Pool 라이프사이클 실행:
- 할당량과 시간 범위를 가진 Launch Pool bucket 추가
- 선택적 패널티, 베스팅 및 허용 목록 구성
- 토큰 예치, 출금, 전환 및 청구
{% /callout %}

## 요약

Launch Pool은 예치 기간 동안 예치금을 수집하고 비례적으로 토큰을 배분합니다. 이 페이지에서는 bucket 생성부터 토큰 청구까지 전체 Launch Pool 라이프사이클을 다룹니다.

- **배분 방식**: 비례 배분 — 예치금 비율이 토큰 수령 비율을 결정
- **명령어**: `bucket add-launch-pool`, `deposit`, `withdraw`, `transition`, `claim`
- **선택적 기능**: End Behavior, 예치/출금 패널티, 보너스 스케줄, 청구 베스팅, 허용 목록
- **Quote 토큰**: 기본적으로 Wrapped SOL — 예치 전에 SOL을 래핑하세요

## 범위 외

Presale bucket, Unlocked bucket, Genesis 계정 생성, finalize, 프론트엔드 통합, 토큰 이코노믹스 모델링.

**바로 이동:** [Bucket 추가](#add-launch-pool-bucket) · [예치](#deposit) · [출금](#withdraw) · [전환](#transition) · [청구](#claim) · [전체 라이프사이클](#full-lifecycle-example) · [일반적인 오류](#common-errors) · [FAQ](#faq)

## Launch Pool Bucket 추가

`mplx genesis bucket add-launch-pool` 명령어는 Genesis 계정에 Launch Pool bucket을 추가합니다.

```bash {% title="Launch Pool bucket 추가" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

### 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--allocation <string>` | `-a` | 기본 단위의 기본 토큰 할당량 | 예 |
| `--depositStart <string>` | | 예치 시작 Unix 타임스탬프 | 예 |
| `--depositEnd <string>` | | 예치 종료 Unix 타임스탬프 | 예 |
| `--claimStart <string>` | | 청구 시작 Unix 타임스탬프 | 예 |
| `--claimEnd <string>` | | 청구 종료 Unix 타임스탬프 | 예 |
| `--bucketIndex <integer>` | `-b` | Bucket 인덱스 (기본값: 0) | 아니요 |
| `--endBehavior <string>` | | 형식: `<destinationBucketAddress>:<percentageBps>` (여기서 `10000` = 100%). 여러 번 지정 가능 | 아니요 |
| `--minimumDeposit <string>` | | 트랜잭션당 최소 예치금(기본 단위) | 아니요 |
| `--depositLimit <string>` | | 사용자당 최대 예치금(기본 단위) | 아니요 |
| `--minimumQuoteTokenThreshold <string>` | | bucket 성공에 필요한 최소 총 Quote 토큰 | 아니요 |
| `--depositPenalty <json>` | | 패널티 스케줄 JSON | 아니요 |
| `--withdrawPenalty <json>` | | 출금 패널티 스케줄 JSON (depositPenalty와 동일한 형식) | 아니요 |
| `--bonusSchedule <json>` | | 보너스 스케줄 JSON | 아니요 |
| `--claimSchedule <json>` | | 청구 베스팅 스케줄 JSON | 아니요 |
| `--allowlist <json>` | | 허용 목록 구성 JSON | 아니요 |

### JSON 옵션 형식

**패널티 스케줄** (예치 또는 출금):
```json {% title="패널티 스케줄 형식" %}
{"slopeBps":0,"interceptBps":200,"maxBps":200,"startTime":0,"endTime":0}
```

**보너스 스케줄**:
```json {% title="보너스 스케줄 형식" %}
{"slopeBps":0,"interceptBps":0,"maxBps":0,"startTime":0,"endTime":0}
```

**청구 베스팅 스케줄**:
```json {% title="청구 스케줄 형식" %}
{"startTime":0,"endTime":0,"period":0,"cliffTime":0,"cliffAmountBps":0}
```

**허용 목록**:
```json {% title="허용 목록 형식" %}
{"merkleTreeHeight":10,"merkleRoot":"<hex>","endTime":0,"quoteCap":0}
```

### 예시

1. 기본 Launch Pool:
```bash {% title="기본 Launch Pool" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

2. End Behavior 및 최소 예치금 포함:
```bash {% title="End Behavior 포함" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600 \
  --endBehavior "<DESTINATION_BUCKET_ADDRESS>:10000" \
  --minimumDeposit 100000000
```

3. 청구 베스팅 포함:
```bash {% title="청구 베스팅 포함" %}
mplx genesis bucket add-launch-pool <GENESIS_ADDRESS> \
  --allocation 500000000000000 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600 \
  --claimSchedule '{"startTime":1704153601,"endTime":1735689600,"period":86400,"cliffTime":1704240000,"cliffAmountBps":1000}'
```

## 예치

`mplx genesis deposit` 명령어는 예치 기간 동안 Launch Pool bucket에 Quote 토큰을 예치합니다. SOL을 Quote 토큰으로 사용하는 경우 먼저 래핑하세요.

```bash {% title="Launch Pool에 예치" %}
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--amount <string>` | `-a` | 기본 단위의 Quote 토큰 수량 (예: lamport) | 예 |
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket의 인덱스 (기본값: 0) | 아니요 |

### 예시

1. SOL 래핑 후 10 SOL 예치:
```bash {% title="래핑 후 예치" %}
mplx toolbox sol wrap 10
mplx genesis deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## 출금

`mplx genesis withdraw` 명령어는 Launch Pool bucket에서 Quote 토큰을 출금합니다. 예치 기간 동안에만 가능합니다.

```bash {% title="Launch Pool에서 출금" %}
mplx genesis withdraw <GENESIS_ADDRESS> --amount 5000000000 --bucketIndex 0
```

### 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--amount <string>` | `-a` | 출금할 Quote 토큰 수량(기본 단위) | 예 |
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket의 인덱스 (기본값: 0) | 아니요 |

## 전환

`mplx genesis transition` 명령어는 예치 기간 종료 후 End Behavior를 실행하여 수집된 Quote 토큰을 대상 bucket으로 이동합니다.

```bash {% title="End Behavior 전환" %}
mplx genesis transition <GENESIS_ADDRESS> --bucketIndex 0
```

### 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket의 인덱스 | 예 |

### 참고 사항

- 예치 기간 종료 후에 호출해야 합니다
- bucket에 End Behavior가 구성된 경우에만 필요합니다

## 청구

`mplx genesis claim` 명령어는 Launch Pool bucket에서 기본 토큰을 청구합니다. 사용자는 예치금에 비례하여 토큰을 받습니다.

```bash {% title="Launch Pool에서 청구" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

### 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | Launch Pool bucket의 인덱스 (기본값: 0) | 아니요 |
| `--recipient <string>` | | 청구된 토큰의 수령 주소 (기본값: 서명자) | 아니요 |

### 예시

1. 자신의 지갑으로 청구:
```bash {% title="자신에게 청구" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. 다른 지갑으로 청구:
```bash {% title="다른 지갑으로 청구" %}
mplx genesis claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## 전체 라이프사이클 예시

```bash {% title="전체 Launch Pool 라이프사이클" %}
# 1. Genesis 계정 생성
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9

# (출력에서 GENESIS_ADDRESS를 복사)
GENESIS=<GENESIS_ADDRESS>

# 2. 타임스탬프
NOW=$(date +%s)
DEPOSIT_END=$((NOW + 86400))
CLAIM_START=$((DEPOSIT_END + 1))
CLAIM_END=$((NOW + 31536000))

# 3. End Behavior가 포함된 Launch Pool bucket 추가
mplx genesis bucket add-launch-pool $GENESIS \
  --allocation 500000000000000 \
  --depositStart $NOW \
  --depositEnd $DEPOSIT_END \
  --claimStart $CLAIM_START \
  --claimEnd $CLAIM_END \
  --endBehavior "<UNLOCKED_BUCKET_ADDRESS>:10000"

# 4. SOL을 수령할 Unlocked bucket 추가
mplx genesis bucket add-unlocked $GENESIS \
  --recipient $(solana address) \
  --claimStart $CLAIM_START \
  --allocation 0

# 5. Finalize
mplx genesis finalize $GENESIS

# 6. SOL 래핑 후 예치
mplx toolbox sol wrap 10
mplx genesis deposit $GENESIS --amount 10000000000 --bucketIndex 0

# 7. 예치 기간 후, 전환
mplx genesis transition $GENESIS --bucketIndex 0

# 8. 토큰 청구
mplx genesis claim $GENESIS --bucketIndex 0

# 9. 민트 권한 해제
mplx genesis revoke $GENESIS --revokeMint
```

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Deposit period not active | 현재 시간이 `depositStart`–`depositEnd` 범위 밖 | `genesis bucket fetch`로 타임스탬프를 확인하세요 |
| Claim period not active | `claimStart` 전에 청구 시도 | 청구 시작 타임스탬프 이후까지 기다리세요 |
| Withdrawal period ended | 예치 기간 종료 후 출금 시도 | 출금은 예치 기간 동안에만 가능합니다 |
| No wrapped SOL | 래핑되지 않은 SOL을 예치하려고 함 | 먼저 `mplx toolbox sol wrap <amount>`를 실행하세요 |
| Below minimum deposit | 예치 금액이 `minimumDeposit`보다 적음 | 최소 요건을 충족하도록 예치 금액을 늘리세요 |
| Exceeds deposit limit | 사용자의 총 예치금이 `depositLimit`을 초과 | 예치 금액을 줄이세요 — 사용자당 한도에 도달했습니다 |
| End behavior not configured | End Behavior가 없는 bucket에서 `transition` 실행 | Transition은 `--endBehavior`가 있는 bucket에만 필요합니다 |
| Deposit period not ended | 예치 종료 전에 `transition` 실행 | `depositEnd` 타임스탬프 이후까지 기다리세요 |

## FAQ

**Launch Pool에서 토큰은 어떻게 배분되나요?**
토큰은 비례적으로 배분됩니다. 풀의 총 Quote 토큰 중 10%를 예치했다면, bucket의 기본 토큰 할당량의 10%를 받게 됩니다.

**예치 후 출금할 수 있나요?**
네, 하지만 예치 기간 동안에만 가능합니다. 예치 기간이 종료되면 출금은 더 이상 불가능합니다.

**End Behavior란 무엇인가요?**
End Behavior는 예치 기간 종료 후 Launch Pool에서 수집된 Quote 토큰을 대상 bucket(보통 Unlocked bucket)으로 전달합니다. `genesis transition`을 호출하여 실행해야 합니다.

**Claim Schedule이란 무엇인가요?**
Claim Schedule은 토큰 청구에 베스팅을 추가합니다. 모든 토큰을 한번에 받는 대신, 구성된 `period`, `cliffTime` 및 `cliffAmountBps`에 따라 점진적으로 릴리스됩니다.

**minimumQuoteTokenThreshold를 충족하지 못하면 어떻게 되나요?**
총 예치금이 임계값에 도달하지 못하면 bucket이 성공하지 못하고 예치자는 자금을 회수할 수 있습니다.

**End Behavior를 여러 대상으로 분할할 수 있나요?**
네. `--endBehavior`를 서로 다른 대상 주소와 퍼센티지(basis point 단위, 합계 10000)로 여러 번 지정하세요.

## 용어집

| 용어 | 정의 |
|------|------|
| **Launch Pool** | 예치금 비율에 따라 비례적으로 토큰을 배분하는 bucket 유형 |
| **End Behavior** | 예치 종료 후 수집된 Quote 토큰을 대상 bucket으로 전달하는 규칙 |
| **Transition** | End Behavior를 실행하는 명령어 — 예치 기간 후 명시적으로 호출해야 함 |
| **Claim Schedule** | 시간에 따른 점진적 토큰 릴리스를 제어하는 베스팅 구성 |
| **Deposit Penalty** | 예치에 적용되는 수수료, 선택적 시간 기반 기울기와 함께 basis point로 구성 |
| **Withdraw Penalty** | 예치 기간 동안 출금에 적용되는 수수료 |
| **Bonus Schedule** | 조기 또는 특정 시점 예치에 대한 추가 토큰 할당 |
| **Allowlist** | 예치 가능한 사용자를 제한하는 머클 트리 기반 접근 제어 |
| **Basis Points (bps)** | 퍼센트의 1/100 — 10000 bps = 100%, 100 bps = 1% |
