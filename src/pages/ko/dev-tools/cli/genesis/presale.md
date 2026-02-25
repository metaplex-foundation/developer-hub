---
title: Presale
metaTitle: Presale | Metaplex CLI
description: Metaplex CLI를 사용하여 Presale bucket을 생성하고, 예치하며, Genesis Presale에서 토큰을 청구합니다.
keywords:
  - genesis presale
  - fixed-price token sale
  - presale bucket
  - mplx genesis presale
  - token presale CLI
about:
  - presale bucket
  - fixed-price token distribution
  - presale deposit and claim
  - Genesis CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Add a presale bucket with allocation, quoteCap, and time windows using bucket add-presale
  - Finalize the Genesis account to activate the launch
  - Wrap SOL and deposit quote tokens during the deposit window
  - Claim base tokens at the fixed price after the claim period opens
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: Presale 가격은 어떻게 결정되나요?
    a: 가격은 quoteCap을 allocation으로 나누어 계산됩니다. 예를 들어, 100 SOL quoteCap에 1,000,000 토큰 할당 = 토큰당 0.0001 SOL.
  - q: Presale이 완전히 채워지지 않으면 어떻게 되나요?
    a: 예치한 사용자는 여전히 고정 가격으로 토큰을 받습니다. 미판매 토큰은 bucket에 남습니다.
  - q: Presale에 예치 한도를 설정할 수 있나요?
    a: 네. 트랜잭션당 최소금액에는 minimumDeposit을, 사용자당 최대금액에는 depositLimit을 사용하세요.
  - q: Presale에서 내 토큰 할당량을 어떻게 계산하나요?
    a: 받을 토큰 = (내 예치금 / quoteCap) * allocation. 100 SOL 캡에 100만 토큰 할당인 경우 1 SOL을 예치하면 10,000 토큰을 받습니다.
---

{% callout title="수행할 작업" %}
CLI에서 전체 Presale 라이프사이클 실행:
- 고정 가격 토큰 할당을 가진 Presale bucket 추가
- 판매 기간 동안 Quote 토큰 예치
- 미리 정해진 가격으로 기본 토큰 청구
{% /callout %}

## 요약

Presale은 `quoteCap / allocation`으로 결정되는 고정 가격에 토큰을 판매합니다. 이 페이지에서는 bucket 생성부터 토큰 청구까지 전체 Presale 라이프사이클을 다룹니다.

- **배분 방식**: 고정 가격 — `quoteCap / allocation`이 토큰당 비용을 결정
- **명령어**: `bucket add-presale`, `presale deposit`, `presale claim`
- **가격 예시**: 100 SOL Quote 캡 / 1,000,000 토큰 = 토큰당 0.0001 SOL
- **Quote 토큰**: 기본적으로 Wrapped SOL — 예치 전에 SOL을 래핑하세요

## 범위 외

Launch Pool bucket, Unlocked bucket, End Behavior, Genesis 계정 생성, finalize, 프론트엔드 통합.

**바로 이동:** [Bucket 추가](#add-presale-bucket) · [예치](#deposit) · [청구](#claim) · [전체 라이프사이클](#full-lifecycle-example) · [일반적인 오류](#common-errors) · [FAQ](#faq)

*Metaplex Foundation 관리 · 2026년 2월 최종 확인 · Metaplex CLI (mplx) 필요*

## Presale Bucket 추가

`mplx genesis bucket add-presale` 명령어는 Genesis 계정에 Presale bucket을 추가합니다.

```bash {% title="Presale bucket 추가" %}
mplx genesis bucket add-presale <GENESIS_ADDRESS> \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --bucketIndex 0 \
  --depositStart 1704067200 \
  --depositEnd 1704153600 \
  --claimStart 1704153601 \
  --claimEnd 1735689600
```

### 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--allocation <string>` | `-a` | 기본 단위의 기본 토큰 할당량 | 예 |
| `--quoteCap <string>` | | 수락할 총 Quote 토큰 — 가격 결정 | 예 |
| `--bucketIndex <integer>` | `-b` | Bucket 인덱스 | 예 |
| `--depositStart <string>` | | 예치 시작 Unix 타임스탬프 | 예 |
| `--depositEnd <string>` | | 예치 종료 Unix 타임스탬프 | 예 |
| `--claimStart <string>` | | 청구 시작 Unix 타임스탬프 | 예 |
| `--claimEnd <string>` | | 청구 종료 Unix 타임스탬프 (기본값: 먼 미래) | 아니요 |
| `--minimumDeposit <string>` | | Quote 토큰 기본 단위의 트랜잭션당 최소 예치금 | 아니요 |
| `--depositLimit <string>` | | Quote 토큰 기본 단위의 사용자당 최대 예치금 | 아니요 |

### 가격 책정

가격은 다음과 같이 계산됩니다:
```text {% title="가격 공식" %}
price per token = quoteCap / allocation
```

**예시**: 100 SOL Quote 캡 (`100000000000` lamport) / 1,000,000 토큰 (`1000000000000000` 기본 단위) = 토큰당 0.0001 SOL

## 예치

`mplx genesis presale deposit` 명령어는 예치 기간 동안 Presale bucket에 Quote 토큰을 예치합니다.

```bash {% title="Presale에 예치" %}
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--amount <string>` | `-a` | 기본 단위의 Quote 토큰 수량 (예: lamport) | 예 |
| `--bucketIndex <integer>` | `-b` | Presale bucket의 인덱스 (기본값: 0) | 아니요 |

### 예시

1. SOL 래핑 후 10 SOL 예치:
```bash {% title="래핑 후 예치" %}
mplx toolbox sol wrap 10
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## 청구

`mplx genesis presale claim` 명령어는 청구 기간 시작 후 Presale bucket에서 기본 토큰을 청구합니다.

토큰 할당은 다음과 같이 계산됩니다:
```text {% title="청구 공식" %}
userTokens = (userDeposit / quoteCap) * allocation
```

```bash {% title="Presale에서 청구" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

### 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | Presale bucket의 인덱스 (기본값: 0) | 아니요 |
| `--recipient <string>` | | 청구된 토큰의 수령 주소 (기본값: 서명자) | 아니요 |

### 예시

1. 자신의 지갑으로 청구:
```bash {% title="자신에게 청구" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. 다른 지갑으로 청구:
```bash {% title="다른 지갑으로 청구" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## 전체 라이프사이클 예시

```bash {% title="전체 Presale 라이프사이클" %}
# 1. 토큰 생성
mplx genesis create \
  --name "Example Token" \
  --symbol "EXM" \
  --totalSupply 1000000000000000 \
  --decimals 9

GENESIS=<GENESIS_ADDRESS>

# 2. 타임스탬프
NOW=$(date +%s)
DEPOSIT_END=$((NOW + 86400))
CLAIM_START=$((DEPOSIT_END + 1))
CLAIM_END=$((NOW + 31536000))

# 3. Presale bucket 추가: 100 SOL 캡으로 100만 토큰
mplx genesis bucket add-presale $GENESIS \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --bucketIndex 0 \
  --depositStart $NOW \
  --depositEnd $DEPOSIT_END \
  --claimStart $CLAIM_START \
  --claimEnd $CLAIM_END

# 4. 팀이 SOL을 수령할 Unlocked bucket 추가
mplx genesis bucket add-unlocked $GENESIS \
  --recipient $(solana address) \
  --claimStart $CLAIM_START \
  --allocation 0

# 5. Finalize
mplx genesis finalize $GENESIS

# 6. 확인
mplx genesis fetch $GENESIS
mplx genesis bucket fetch $GENESIS --bucketIndex 0 --type presale

# 7. SOL 래핑 후 예치
mplx toolbox sol wrap 1
mplx genesis presale deposit $GENESIS --amount 1000000000 --bucketIndex 0

# 8. 예치 기간 후, 청구
mplx genesis presale claim $GENESIS --bucketIndex 0
```

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Deposit period not active | 현재 시간이 `depositStart`–`depositEnd` 범위 밖 | `genesis bucket fetch --type presale`로 타임스탬프를 확인하세요 |
| Claim period not active | `claimStart` 전에 청구 시도 | 청구 시작 타임스탬프 이후까지 기다리세요 |
| Presale full | 총 예치금이 `quoteCap`에 도달 | Presale이 완전히 청약되었습니다 — 더 이상 예치가 불가능합니다 |
| No wrapped SOL | 래핑되지 않은 SOL을 예치하려고 함 | 먼저 `mplx toolbox sol wrap <amount>`를 실행하세요 |
| Below minimum deposit | 예치 금액이 `minimumDeposit`보다 적음 | 최소 요건을 충족하도록 예치 금액을 늘리세요 |
| Exceeds deposit limit | 사용자의 총 예치금이 `depositLimit`을 초과 | 예치 금액을 줄이세요 — 사용자당 한도에 도달했습니다 |
| Nothing to claim | 사용자가 이 Presale bucket에 예치한 내역이 없음 | 올바른 `--bucketIndex`를 확인하고 예치 기간 동안 예치했는지 확인하세요 |

## FAQ

**Presale 가격은 어떻게 결정되나요?**
가격은 `quoteCap / allocation`으로 계산됩니다. 예를 들어, 100 SOL Quote 캡에 1,000,000 토큰 할당 = 토큰당 0.0001 SOL.

**Presale이 완전히 채워지지 않으면 어떻게 되나요?**
예치한 사용자는 여전히 고정 가격으로 토큰을 받습니다. 미판매 토큰은 bucket에 남습니다.

**Presale에 예치 한도를 설정할 수 있나요?**
네. 트랜잭션당 최소금액에는 `--minimumDeposit`을, 사용자당 최대금액에는 `--depositLimit`을 사용하세요.

**Presale에서 내 토큰 할당량을 어떻게 계산하나요?**
받을 토큰 = `(내 예치금 / quoteCap) * allocation`. 100 SOL 캡에 100만 토큰 할당인 경우 1 SOL을 예치하면 10,000 토큰을 받습니다.

**Presale과 Launch Pool의 차이점은 무엇인가요?**
Presale은 `quoteCap / allocation`으로 설정된 고정 가격입니다. Launch Pool은 동적 가격으로, 각 사용자의 총 예치금 대비 비율에 따라 토큰이 비례적으로 배분됩니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **Presale** | `quoteCap / allocation`으로 결정되는 고정 가격에 토큰을 판매하는 bucket 유형 |
| **Quote Cap** | Presale이 수락하는 최대 총 Quote 토큰 — allocation과 함께 토큰 가격을 결정 |
| **Allocation** | 이 Presale bucket에서 사용 가능한 기본 토큰 수량, 기본 단위로 지정 |
| **Deposit Limit** | 단일 사용자가 예치할 수 있는 최대 Quote 토큰 |
| **Minimum Deposit** | 예치 트랜잭션당 최소 Quote 토큰 |
| **Fixed Price** | `quoteCap / allocation`으로 계산되는 토큰당 비용 — 수요에 따라 변하지 않음 |
