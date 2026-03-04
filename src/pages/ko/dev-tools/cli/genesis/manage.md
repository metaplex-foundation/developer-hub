---
title: 관리
metaTitle: 관리 | Metaplex CLI
description: Metaplex CLI를 사용하여 Genesis 계정의 finalize, 조회, unlocked bucket 관리, 권한 폐기를 수행합니다.
keywords:
  - genesis finalize
  - genesis fetch
  - genesis revoke
  - unlocked bucket
  - mint authority
about:
  - Genesis account management
  - unlocked buckets
  - finalization
  - authority revocation
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Add unlocked buckets for team or treasury allocations using bucket add-unlocked
  - Finalize the Genesis configuration to lock it and activate the launch
  - Fetch Genesis account and bucket details to verify state
  - Claim tokens or forwarded SOL from unlocked buckets
  - Revoke mint and freeze authorities after the launch
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: finalize는 무엇을 하나요?
    a: finalize는 Genesis 구성을 영구적으로 잠급니다. Finalize 후에는 더 이상 bucket을 추가할 수 없으며 출시가 활성화됩니다.
  - q: finalize를 취소할 수 있나요?
    a: 아니요. Finalize는 되돌릴 수 없습니다. genesis finalize를 실행하기 전에 모든 bucket 구성을 다시 확인하세요.
  - q: unlocked bucket은 무엇에 사용되나요?
    a: unlocked bucket을 사용하면 지정된 수령인이 end behavior를 통해 전달된 token 또는 SOL을 청구할 수 있습니다. 일반적으로 팀 또는 재무 할당에 사용됩니다.
  - q: mint 권한 폐기는 무엇을 의미하나요?
    a: mint 권한을 폐기하면 새로운 token을 발행할 수 없게 되어 총 공급량이 영구적으로 고정됩니다.
---

{% callout title="이 문서에서 다루는 내용" %}
Genesis 계정 관리 명령어:
- unlocked(재무) bucket 추가
- 구성 Finalize
- 계정 및 bucket 상태 조회
- unlocked bucket에서 청구
- mint/freeze 권한 폐기
{% /callout %}

## 요약

이 명령어들은 Genesis 계정 관리를 처리합니다 — unlocked bucket 추가, 구성 finalize, 상태 조회, unlocked bucket에서 청구, bucket 세부 정보 조회, 권한 폐기.

- **Unlocked bucket**: 지정된 수령인이 token 또는 전달된 quote token을 직접 청구
- **Finalize**: 출시를 활성화하는 되돌릴 수 없는 잠금
- **Fetch**: Genesis 계정 및 개별 bucket 상태 검사
- **Revoke**: mint 및/또는 freeze 권한을 영구적으로 제거

## 범위 외

Launch Pool 구성, Presale 구성, 입금/출금 흐름, 프론트엔드 통합, 토큰 경제.

**바로가기:** [Unlocked Bucket](#unlocked-bucket-추가) · [Finalize](#finalize) · [조회](#조회) · [Bucket 조회](#bucket-조회) · [Unlocked 청구](#unlocked-청구) · [폐기](#폐기) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq)

*Metaplex Foundation 관리 · 최종 검증 2026년 2월 · Metaplex CLI(mplx) 필요*

## Unlocked Bucket 추가

`mplx genesis bucket add-unlocked` 명령어는 unlocked bucket을 추가합니다. Unlocked bucket을 사용하면 지정된 수령인이 end behavior를 통해 전달된 token 또는 SOL을 청구할 수 있습니다.

```bash {% title="Unlocked bucket 추가" %}
mplx genesis bucket add-unlocked <GENESIS_ADDRESS> \
  --recipient <RECIPIENT_WALLET_ADDRESS> \
  --claimStart 1704153601 \
  --allocation 0
```

### 옵션

| 플래그 | 단축 | 설명 | 필수 |
|--------|------|------|------|
| `--recipient <string>` | | 이 bucket에서 청구할 수 있는 지갑 주소 | 예 |
| `--claimStart <string>` | | 청구 시작 Unix 타임스탬프 | 예 |
| `--claimEnd <string>` | | 청구 종료 Unix 타임스탬프 (기본값: 먼 미래) | 아니요 |
| `--allocation <string>` | `-a` | base unit으로 표시된 base token 할당량 (기본값: 0) | 아니요 |
| `--bucketIndex <integer>` | `-b` | bucket 인덱스 | 아니요 |

### 참고사항

- `--allocation 0`은 이 bucket이 base token을 보유하지 않음을 의미합니다 — end behavior를 통해 quote token만 수신
- 일반적으로 Launch Pool end behavior의 대상으로 사용되어 팀/재무가 수집된 SOL을 청구할 수 있게 합니다

## Finalize

`mplx genesis finalize` 명령어는 Genesis 구성을 잠급니다. Finalize 후에는 더 이상 bucket을 추가할 수 없습니다.

```bash {% title="Genesis Finalize" %}
mplx genesis finalize <GENESIS_ADDRESS>
```

추가 플래그 없음. 이 작업은 되돌릴 수 없습니다 — 이 명령어를 실행하기 전에 모든 bucket 구성을 다시 확인하세요.

## 조회

`mplx genesis fetch` 명령어는 bucket 수, 총 공급량, finalize 상태, base/quote mint를 포함한 Genesis 계정 세부 정보를 조회합니다.

```bash {% title="Genesis 계정 조회" %}
mplx genesis fetch <GENESIS_ADDRESS>
```

추가 플래그 없음.

## Bucket 조회

`mplx genesis bucket fetch` 명령어는 특정 bucket의 세부 정보를 조회합니다.

```bash {% title="Bucket 세부 정보 조회" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type launch-pool
```

### 옵션

| 플래그 | 단축 | 설명 | 필수 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | 조회할 bucket의 인덱스 (기본값: 0) | 아니요 |
| `--type <launch-pool\|presale\|unlocked>` | `-t` | bucket 유형 (기본값: `launch-pool`) | 아니요 |

### 예제

1. Launch Pool bucket 조회:
```bash {% title="Launch Pool 조회" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0
```

2. Presale bucket 조회:
```bash {% title="Presale 조회" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type presale
```

3. Unlocked bucket 조회:
```bash {% title="Unlocked 조회" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 1 --type unlocked
```

## Unlocked 청구

`mplx genesis claim-unlocked` 명령어는 unlocked bucket에서 token 또는 SOL을 청구합니다. 일반적으로 팀/재무 지갑이 end behavior를 통해 전달된 quote token을 청구하는 데 사용됩니다.

```bash {% title="Unlocked bucket에서 청구" %}
mplx genesis claim-unlocked <GENESIS_ADDRESS> --bucketIndex 1
```

### 옵션

| 플래그 | 단축 | 설명 | 필수 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | unlocked bucket의 인덱스 (기본값: 0) | 아니요 |
| `--recipient <string>` | | 청구된 token의 수령인 주소 (기본값: 서명자) | 아니요 |

## 폐기

`mplx genesis revoke` 명령어는 token의 mint 및/또는 freeze 권한을 폐기합니다. 최소 하나의 플래그를 지정해야 합니다.

```bash {% title="Mint 권한 폐기" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

### 옵션

| 플래그 | 설명 |
|--------|------|
| `--revokeMint` | mint 권한 폐기 (더 이상 token을 발행할 수 없음) |
| `--revokeFreeze` | freeze 권한 폐기 (token을 동결할 수 없음) |

### 예제

1. mint 권한만 폐기:
```bash {% title="Mint 폐기" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

2. 두 권한 모두 폐기:
```bash {% title="모두 폐기" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint --revokeFreeze
```

### 참고사항

- mint 권한을 폐기하면 새로운 token을 발행할 수 없게 됩니다
- 이 작업들은 되돌릴 수 없습니다

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Genesis already finalized | `finalize` 후에 bucket을 추가하려고 시도 | Finalize는 되돌릴 수 없습니다 — 새 Genesis 계정을 생성하세요 |
| Genesis not finalized | finalize 전에 입금 또는 청구 시도 | 먼저 `genesis finalize`를 실행하세요 |
| Not the designated recipient | 잘못된 지갑으로 unlocked bucket에서 청구 시도 | bucket 생성 시 `--recipient`로 지정된 지갑을 사용하세요 |
| No flags specified | `--revokeMint` 또는 `--revokeFreeze` 없이 `revoke` 실행 | 최소 하나를 지정하세요: `--revokeMint` 및/또는 `--revokeFreeze` |
| Authority already revoked | 이미 폐기된 권한을 다시 폐기 시도 | 조치가 필요 없습니다 — 권한이 이미 영구적으로 제거되었습니다 |
| Claim period not active | `claimStart` 전에 unlocked bucket에서 청구 시도 | 청구 시작 타임스탬프 이후까지 기다리세요 |
| Invalid bucket type | `bucket fetch`에서 잘못된 `--type` 플래그 사용 | `launch-pool`, `presale`, 또는 `unlocked`를 사용하세요 |

## FAQ

**finalize는 무엇을 하나요?**
finalize는 Genesis 구성을 영구적으로 잠급니다. Finalize 후에는 더 이상 bucket을 추가할 수 없으며 출시가 활성화됩니다. 구성된 입금 기간이 시작되면 입금이 가능합니다.

**finalize를 취소할 수 있나요?**
아니요. Finalize는 되돌릴 수 없습니다. `genesis finalize`를 실행하기 전에 모든 bucket 구성을 다시 확인하세요.

**unlocked bucket은 무엇에 사용되나요?**
unlocked bucket을 사용하면 지정된 수령인이 end behavior를 통해 전달된 token 또는 SOL을 청구할 수 있습니다. 일반적인 용도: 팀 할당, 재무, 마케팅 예산, 또는 Launch Pool end behavior에서 수집된 SOL 수령.

**mint 권한 폐기는 무엇을 의미하나요?**
mint 권한을 폐기하면 새로운 token을 발행할 수 없게 되어 총 공급량이 영구적으로 고정됩니다. 이는 token 보유자에 대한 신뢰 신호입니다.

**freeze 권한도 폐기해야 하나요?**
freeze 권한을 폐기하면 사용자 지갑의 token을 동결할 수 없게 됩니다. 폐기 여부는 프로젝트 요구사항에 따라 다릅니다 — 대부분의 공정한 출시에서는 두 권한 모두 폐기합니다.

**아무것도 수정하지 않고 출시 상태를 확인할 수 있나요?**
네. `genesis fetch`와 `genesis bucket fetch`를 사용하면 언제든지 Genesis 계정과 개별 bucket의 전체 상태를 검사할 수 있습니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **Unlocked Bucket** | 팀/재무를 위한 bucket 유형 — 지정된 수령인이 token 또는 전달된 quote token을 직접 청구 가능 |
| **Finalize** | Genesis 구성을 잠그고 출시를 활성화하는 되돌릴 수 없는 작업 |
| **Mint Authority** | 새 token을 생성할 수 있는 권한 — 폐기하면 공급량이 영구적으로 고정 |
| **Freeze Authority** | 사용자 지갑의 token을 동결할 수 있는 권한 — 폐기하면 향후 동결 방지 |
| **Recipient** | unlocked bucket에서 청구하도록 지정된 지갑 주소 |
| **Bucket Index** | Genesis 계정 내에서 동일 유형의 bucket을 식별하는 숫자 식별자 |
