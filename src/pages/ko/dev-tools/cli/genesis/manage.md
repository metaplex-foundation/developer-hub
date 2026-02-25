---
title: 관리
metaTitle: 관리 | Metaplex CLI
description: Metaplex CLI를 사용하여 Genesis 계정의 finalize, 조회, Unlocked bucket 관리 및 권한 해제를 수행합니다.
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
    a: Finalize는 Genesis 구성을 영구적으로 잠급니다. Finalize 후에는 더 이상 bucket을 추가할 수 없으며 출시가 활성화됩니다.
  - q: Finalize를 취소할 수 있나요?
    a: 아니요. Finalize는 되돌릴 수 없습니다. genesis finalize를 실행하기 전에 모든 bucket 구성을 다시 확인하세요.
  - q: Unlocked bucket은 무엇에 사용되나요?
    a: Unlocked bucket은 지정된 수령인이 토큰 또는 End Behavior를 통해 전달된 SOL을 청구할 수 있게 합니다. 일반적으로 팀 또는 재무 할당에 사용됩니다.
  - q: 민트 권한 해제란 무엇인가요?
    a: 민트 권한을 해제하면 새로운 토큰을 더 이상 발행할 수 없게 되어 총 공급량이 영구적으로 고정됩니다.
---

{% callout title="이 문서에서 다루는 내용" %}
Genesis 계정 관리 명령어:
- Unlocked (재무) bucket 추가
- 구성 Finalize
- 계정 및 bucket 상태 조회
- Unlocked bucket에서 청구
- 민트/동결 권한 해제
{% /callout %}

## 요약

이 명령어들은 Genesis 계정 관리를 처리합니다 — Unlocked bucket 추가, 구성 finalize, 상태 조회, Unlocked bucket에서 청구, bucket 세부 정보 조회 및 권한 해제.

- **Unlocked bucket**: 지정된 수령인이 토큰 또는 전달된 Quote 토큰을 직접 청구
- **Finalize**: 출시를 활성화하는 되돌릴 수 없는 잠금
- **Fetch**: Genesis 계정 및 개별 bucket 상태 검사
- **Revoke**: 민트 및/또는 동결 권한을 영구적으로 제거

## 범위 외

Launch Pool 구성, Presale 구성, 예치/출금 플로우, 프론트엔드 통합, 토큰 이코노믹스.

**바로 이동:** [Unlocked Bucket](#add-unlocked-bucket) · [Finalize](#finalize) · [Fetch](#fetch) · [Fetch Bucket](#fetch-bucket) · [Claim Unlocked](#claim-unlocked) · [Revoke](#revoke) · [일반적인 오류](#common-errors) · [FAQ](#faq)

*Metaplex Foundation 관리 · 2026년 2월 최종 확인 · Metaplex CLI (mplx) 필요*

## Unlocked Bucket 추가

`mplx genesis bucket add-unlocked` 명령어는 Unlocked bucket을 추가합니다. Unlocked bucket은 지정된 수령인이 토큰 또는 End Behavior를 통해 전달된 SOL을 청구할 수 있게 합니다.

```bash {% title="Unlocked bucket 추가" %}
mplx genesis bucket add-unlocked <GENESIS_ADDRESS> \
  --recipient <RECIPIENT_WALLET_ADDRESS> \
  --claimStart 1704153601 \
  --allocation 0
```

### 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--recipient <string>` | | 이 bucket에서 청구할 수 있는 지갑 주소 | 예 |
| `--claimStart <string>` | | 청구 시작 Unix 타임스탬프 | 예 |
| `--claimEnd <string>` | | 청구 종료 Unix 타임스탬프 (기본값: 먼 미래) | 아니요 |
| `--allocation <string>` | `-a` | 기본 단위의 기본 토큰 할당량 (기본값: 0) | 아니요 |
| `--bucketIndex <integer>` | `-b` | Bucket 인덱스 | 아니요 |

### 참고 사항

- `--allocation 0`은 이 bucket이 기본 토큰을 보유하지 않음을 의미합니다 — End Behavior를 통해 Quote 토큰만 수령
- 일반적으로 팀/재무가 수집된 SOL을 청구할 수 있도록 Launch Pool End Behavior의 대상으로 사용

## Finalize

`mplx genesis finalize` 명령어는 Genesis 구성을 잠급니다. Finalize 후에는 더 이상 bucket을 추가할 수 없습니다.

```bash {% title="Genesis Finalize" %}
mplx genesis finalize <GENESIS_ADDRESS>
```

추가 플래그 없음. 이 작업은 되돌릴 수 없습니다 — 이 명령어를 실행하기 전에 모든 bucket 구성을 다시 확인하세요.

## Fetch

`mplx genesis fetch` 명령어는 bucket 수, 총 공급량, finalize 상태, 기본/Quote 민트를 포함한 Genesis 계정 세부 정보를 조회합니다.

```bash {% title="Genesis 계정 조회" %}
mplx genesis fetch <GENESIS_ADDRESS>
```

추가 플래그 없음.

## Fetch Bucket

`mplx genesis bucket fetch` 명령어는 특정 bucket의 세부 정보를 조회합니다.

```bash {% title="bucket 세부 정보 조회" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type launch-pool
```

### 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | 조회할 bucket의 인덱스 (기본값: 0) | 아니요 |
| `--type <launch-pool\|presale\|unlocked>` | `-t` | Bucket 유형 (기본값: `launch-pool`) | 아니요 |

### 예시

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

## Claim Unlocked

`mplx genesis claim-unlocked` 명령어는 Unlocked bucket에서 토큰 또는 SOL을 청구합니다. 일반적으로 팀/재무 지갑이 End Behavior를 통해 전달된 Quote 토큰을 청구하는 데 사용됩니다.

```bash {% title="Unlocked bucket에서 청구" %}
mplx genesis claim-unlocked <GENESIS_ADDRESS> --bucketIndex 1
```

### 옵션

| 플래그 | 약어 | 설명 | 필수 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | Unlocked bucket의 인덱스 (기본값: 0) | 아니요 |
| `--recipient <string>` | | 청구된 토큰의 수령 주소 (기본값: 서명자) | 아니요 |

## Revoke

`mplx genesis revoke` 명령어는 토큰의 민트 및/또는 동결 권한을 해제합니다. 하나 이상의 플래그를 지정해야 합니다.

```bash {% title="민트 권한 해제" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

### 옵션

| 플래그 | 설명 |
|--------|------|
| `--revokeMint` | 민트 권한 해제 (더 이상 토큰 발행 불가) |
| `--revokeFreeze` | 동결 권한 해제 (토큰 동결 불가) |

### 예시

1. 민트 권한만 해제:
```bash {% title="민트 해제" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

2. 두 권한 모두 해제:
```bash {% title="모두 해제" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint --revokeFreeze
```

### 참고 사항

- 민트 권한을 해제하면 새로운 토큰을 더 이상 발행할 수 없습니다
- 이 작업은 되돌릴 수 없습니다

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Genesis already finalized | `finalize` 후에 bucket 추가 시도 | Finalize는 되돌릴 수 없습니다 — 새 Genesis 계정을 생성하세요 |
| Genesis not finalized | finalize 전에 예치 또는 청구 시도 | 먼저 `genesis finalize`를 실행하세요 |
| Not the designated recipient | 잘못된 지갑으로 Unlocked bucket에서 청구 시도 | bucket 생성 시 `--recipient`로 지정된 지갑을 사용하세요 |
| No flags specified | `--revokeMint` 또는 `--revokeFreeze` 없이 `revoke` 실행 | 최소 하나를 지정하세요: `--revokeMint` 및/또는 `--revokeFreeze` |
| Authority already revoked | 이미 해제된 권한을 해제하려고 함 | 조치가 필요 없습니다 — 권한이 이미 영구적으로 제거되었습니다 |
| Claim period not active | `claimStart` 전에 Unlocked bucket에서 청구 시도 | 청구 시작 타임스탬프 이후까지 기다리세요 |
| Invalid bucket type | `bucket fetch`에서 잘못된 `--type` 플래그 사용 | `launch-pool`, `presale` 또는 `unlocked`를 사용하세요 |

## FAQ

**finalize는 무엇을 하나요?**
Finalize는 Genesis 구성을 영구적으로 잠급니다. Finalize 후에는 더 이상 bucket을 추가할 수 없으며 출시가 활성화됩니다. 구성된 예치 기간이 열리면 예치가 시작될 수 있습니다.

**Finalize를 취소할 수 있나요?**
아니요. Finalize는 되돌릴 수 없습니다. `genesis finalize`를 실행하기 전에 모든 bucket 구성을 다시 확인하세요.

**Unlocked bucket은 무엇에 사용되나요?**
Unlocked bucket은 지정된 수령인이 토큰 또는 End Behavior를 통해 전달된 SOL을 청구할 수 있게 합니다. 일반적인 용도: 팀 할당, 재무, 마케팅 예산, 또는 Launch Pool End Behavior에서 수집된 SOL 수령.

**민트 권한 해제란 무엇인가요?**
민트 권한을 해제하면 새로운 토큰을 더 이상 발행할 수 없게 되어 총 공급량이 영구적으로 고정됩니다. 이는 토큰 보유자를 위한 신뢰 신호입니다.

**동결 권한도 해제해야 하나요?**
동결 권한을 해제하면 사용자 지갑의 토큰을 동결할 수 없게 됩니다. 해제 여부는 프로젝트의 요구 사항에 따라 다릅니다 — 대부분의 공정 출시에서는 두 권한 모두 해제합니다.

**아무것도 수정하지 않고 출시 상태를 확인할 수 있나요?**
네. `genesis fetch`와 `genesis bucket fetch`를 사용하여 언제든지 Genesis 계정과 개별 bucket의 전체 상태를 검사할 수 있습니다.

## 용어집

| 용어 | 정의 |
|------|------|
| **Unlocked Bucket** | 팀/재무용 bucket 유형 — 지정된 수령인이 토큰 또는 전달된 Quote 토큰을 직접 청구 가능 |
| **Finalize** | Genesis 구성을 잠그고 출시를 활성화하는 되돌릴 수 없는 작업 |
| **Mint Authority** | 새로운 토큰을 생성할 수 있는 권한 — 해제하면 공급량이 영구적으로 고정 |
| **Freeze Authority** | 사용자 지갑의 토큰을 동결할 수 있는 권한 — 해제하면 향후 동결 불가 |
| **Recipient** | Unlocked bucket에서 청구하도록 지정된 지갑 주소 |
| **Bucket Index** | Genesis 계정 내에서 같은 유형의 bucket을 식별하는 숫자 |
