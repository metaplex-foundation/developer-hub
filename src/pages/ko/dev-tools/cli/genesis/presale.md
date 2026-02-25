---
title: Presale
metaTitle: Presale | Metaplex CLI
description: Metaplex CLI를 사용하여 Presale bucket을 생성하고, 입금 및 Genesis Presale에서 token을 청구합니다.
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
    a: 가격은 quoteCap을 allocation으로 나누어 계산됩니다. 예를 들어, 100 SOL quoteCap에 1,000,000 token 할당 = token당 0.0001 SOL입니다.
  - q: Presale이 완전히 채워지지 않으면 어떻게 되나요?
    a: 입금한 사용자는 여전히 고정 가격으로 token을 받습니다. 미판매 token은 bucket에 남습니다.
  - q: Presale에 입금 한도를 설정할 수 있나요?
    a: 네. 트랜잭션당 최소값에는 minimumDeposit을, 사용자당 최대값에는 depositLimit을 사용하세요.
  - q: Presale에서 내 token 할당량을 어떻게 계산하나요?
    a: 받을 token = (입금액 / quoteCap) * allocation. 100 SOL 한도에 100만 token 할당인 곳에 1 SOL을 입금하면 10,000 token을 받습니다.
---

{% callout title="수행할 작업" %}
CLI에서 전체 Presale 생명주기를 실행합니다:
- 고정 가격 token 할당으로 Presale bucket 추가
- 판매 기간 동안 quote token 입금
- 미리 정해진 가격으로 base token 청구
{% /callout %}

## 요약

Presale은 `quoteCap / allocation`으로 결정된 고정 가격으로 token을 판매합니다. 이 페이지는 bucket 생성부터 token 청구까지 전체 Presale 생명주기를 다룹니다.

- **배포**: 고정 가격 — `quoteCap / allocation`이 token당 비용을 결정
- **명령어**: `bucket add-presale`, `presale deposit`, `presale claim`
- **가격 예시**: 100 SOL quote cap / 1,000,000 token = token당 0.0001 SOL
- **Quote token**: 기본값은 Wrapped SOL — 입금 전에 SOL을 래핑하세요

## 범위 외

Launch Pool bucket, unlocked bucket, end behavior, Genesis 계정 생성, finalize, 프론트엔드 통합.

**바로가기:** [Bucket 추가](#presale-bucket-추가) · [입금](#입금) · [청구](#청구) · [전체 생명주기](#전체-생명주기-예제) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq)

*Metaplex Foundation 관리 · 최종 검증 2026년 2월 · Metaplex CLI(mplx) 필요*

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

| 플래그 | 단축 | 설명 | 필수 |
|--------|------|------|------|
| `--allocation <string>` | `-a` | base unit으로 표시된 base token 할당량 | 예 |
| `--quoteCap <string>` | | 수락하는 총 quote token — 가격을 결정 | 예 |
| `--bucketIndex <integer>` | `-b` | bucket 인덱스 | 예 |
| `--depositStart <string>` | | 입금 시작 Unix 타임스탬프 | 예 |
| `--depositEnd <string>` | | 입금 종료 Unix 타임스탬프 | 예 |
| `--claimStart <string>` | | 청구 시작 Unix 타임스탬프 | 예 |
| `--claimEnd <string>` | | 청구 종료 Unix 타임스탬프 (기본값: 먼 미래) | 아니요 |
| `--minimumDeposit <string>` | | 트랜잭션당 최소 입금액 (quote token base unit) | 아니요 |
| `--depositLimit <string>` | | 사용자당 최대 입금액 (quote token base unit) | 아니요 |

### 가격 산정

가격은 다음과 같이 계산됩니다:
```text {% title="가격 공식" %}
price per token = quoteCap / allocation
```

**예시**: 100 SOL quote cap (`100000000000` lamport) / 1,000,000 token (`1000000000000000` base unit) = token당 0.0001 SOL

## 입금

`mplx genesis presale deposit` 명령어는 입금 기간 동안 Presale bucket에 quote token을 입금합니다.

```bash {% title="Presale에 입금" %}
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

### 옵션

| 플래그 | 단축 | 설명 | 필수 |
|--------|------|------|------|
| `--amount <string>` | `-a` | base unit으로 표시된 quote token 수량 (예: lamport) | 예 |
| `--bucketIndex <integer>` | `-b` | Presale bucket의 인덱스 (기본값: 0) | 아니요 |

### 예제

1. SOL을 래핑하고 10 SOL 입금:
```bash {% title="래핑 후 입금" %}
mplx toolbox sol wrap 10
mplx genesis presale deposit <GENESIS_ADDRESS> --amount 10000000000 --bucketIndex 0
```

## 청구

`mplx genesis presale claim` 명령어는 청구 기간 시작 후 Presale bucket에서 base token을 청구합니다.

token 할당량은 다음과 같이 계산됩니다:
```text {% title="청구 공식" %}
userTokens = (userDeposit / quoteCap) * allocation
```

```bash {% title="Presale에서 청구" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

### 옵션

| 플래그 | 단축 | 설명 | 필수 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | Presale bucket의 인덱스 (기본값: 0) | 아니요 |
| `--recipient <string>` | | 청구된 token의 수령인 주소 (기본값: 서명자) | 아니요 |

### 예제

1. 자신의 지갑으로 청구:
```bash {% title="자신에게 청구" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0
```

2. 다른 지갑으로 청구:
```bash {% title="다른 지갑으로 청구" %}
mplx genesis presale claim <GENESIS_ADDRESS> --bucketIndex 0 --recipient <WALLET_ADDRESS>
```

## 전체 생명주기 예제

```bash {% title="완전한 Presale 생명주기" %}
# 1. Create the token
mplx genesis create \
  --name "Example Token" \
  --symbol "EXM" \
  --totalSupply 1000000000000000 \
  --decimals 9

GENESIS=<GENESIS_ADDRESS>

# 2. Timestamps
NOW=$(date +%s)
DEPOSIT_END=$((NOW + 86400))
CLAIM_START=$((DEPOSIT_END + 1))
CLAIM_END=$((NOW + 31536000))

# 3. Add presale bucket: 1M tokens at 100 SOL cap
mplx genesis bucket add-presale $GENESIS \
  --allocation 1000000000000000 \
  --quoteCap 100000000000 \
  --bucketIndex 0 \
  --depositStart $NOW \
  --depositEnd $DEPOSIT_END \
  --claimStart $CLAIM_START \
  --claimEnd $CLAIM_END

# 4. Add unlocked bucket for team to receive SOL
mplx genesis bucket add-unlocked $GENESIS \
  --recipient $(solana address) \
  --claimStart $CLAIM_START \
  --allocation 0

# 5. Finalize
mplx genesis finalize $GENESIS

# 6. Verify
mplx genesis fetch $GENESIS
mplx genesis bucket fetch $GENESIS --bucketIndex 0 --type presale

# 7. Wrap SOL and deposit
mplx toolbox sol wrap 1
mplx genesis presale deposit $GENESIS --amount 1000000000 --bucketIndex 0

# 8. After deposit period, claim
mplx genesis presale claim $GENESIS --bucketIndex 0
```

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Deposit period not active | 현재 시간이 `depositStart`–`depositEnd` 범위 밖 | `genesis bucket fetch --type presale`로 타임스탬프를 확인하세요 |
| Claim period not active | `claimStart` 전에 청구 시도 | 청구 시작 타임스탬프 이후까지 기다리세요 |
| Presale full | 총 입금액이 `quoteCap`에 도달 | Presale이 완전히 청약되었습니다 — 더 이상 입금을 받지 않습니다 |
| No wrapped SOL | 래핑된 SOL 대신 네이티브 SOL로 입금 시도 | 먼저 `mplx toolbox sol wrap <amount>`를 실행하세요 |
| Below minimum deposit | 입금액이 `minimumDeposit`보다 적음 | 최소 요건을 충족하도록 입금액을 늘리세요 |
| Exceeds deposit limit | 사용자의 총 입금액이 `depositLimit`을 초과 | 입금액을 줄이세요 — 사용자당 한도에 도달했습니다 |
| Nothing to claim | 사용자가 이 Presale bucket에 입금한 내역이 없음 | 올바른 `--bucketIndex`인지, 입금 기간 동안 입금했는지 확인하세요 |

## FAQ

**Presale 가격은 어떻게 결정되나요?**
가격은 `quoteCap / allocation`으로 계산됩니다. 예를 들어, 100 SOL quote cap에 1,000,000 token 할당 = token당 0.0001 SOL입니다.

**Presale이 완전히 채워지지 않으면 어떻게 되나요?**
입금한 사용자는 여전히 고정 가격으로 token을 받습니다. 미판매 token은 bucket에 남습니다.

**Presale에 입금 한도를 설정할 수 있나요?**
네. 트랜잭션당 최소값에는 `--minimumDeposit`을, 사용자당 최대값에는 `--depositLimit`을 사용하세요.

**Presale에서 내 token 할당량을 어떻게 계산하나요?**
받을 token = `(입금액 / quoteCap) * allocation`. 100 SOL 한도에 100만 token 할당인 곳에 1 SOL을 입금하면 10,000 token을 받습니다.

**Presale과 Launch Pool의 차이점은 무엇인가요?**
Presale은 `quoteCap / allocation`으로 설정된 고정 가격을 가집니다. Launch Pool은 동적 가격을 가집니다 — 각 사용자의 총 입금액 대비 비율에 따라 token이 비례적으로 배포됩니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **Presale** | `quoteCap / allocation`으로 결정된 고정 가격으로 token을 판매하는 bucket 유형 |
| **Quote Cap** | Presale이 수락하는 최대 총 quote token — allocation과 함께 token 가격을 결정 |
| **Allocation** | 이 Presale bucket에서 사용 가능한 base token 수량 (base unit) |
| **Deposit Limit** | 단일 사용자가 입금할 수 있는 최대 quote token |
| **Minimum Deposit** | 입금 트랜잭션당 최소 quote token |
| **Fixed Price** | token당 비용, `quoteCap / allocation`으로 계산 — 수요에 따라 변하지 않음 |
