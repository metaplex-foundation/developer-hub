---
title: 개요
metaTitle: Genesis 개요 | Metaplex CLI
description: Metaplex CLI(mplx)를 사용한 Genesis 토큰 출시를 위한 Genesis CLI 명령어 개요.
keywords:
  - Genesis CLI
  - token launch CLI
  - mplx genesis
  - Solana token launch
  - Metaplex CLI
about:
  - Genesis token launches
  - Metaplex CLI
  - token distribution
  - launch pools
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
faqs:
  - q: mplx genesis 명령어란 무엇인가요?
    a: mplx genesis 명령어 그룹을 사용하면 터미널에서 전체 Genesis 토큰 출시를 실행할 수 있습니다 — 계정 생성, bucket 구성, 입금, 청구, 권한 폐기를 포함합니다.
  - q: Genesis의 다양한 bucket 유형은 무엇인가요?
    a: Genesis에는 세 가지 bucket 유형이 있습니다 — Launch Pool(입금에 기반한 비례 배분), Presale(고정 가격 token 판매), unlocked(직접 청구할 수 있는 팀/재무 할당).
  - q: 입금 전에 SOL을 래핑해야 하나요?
    a: 네. SOL을 quote token으로 사용하는 경우, 어떤 bucket에 입금하기 전에 먼저 mplx toolbox sol wrap으로 래핑해야 합니다.
  - q: Finalize를 취소할 수 있나요?
    a: 아니요. Finalize는 되돌릴 수 없습니다. Finalize 후에는 더 이상 bucket을 추가할 수 없으며 구성이 잠깁니다.
  - q: token 수량은 어떻게 지정하나요?
    a: 모든 수량은 base unit으로 지정합니다. 소수점 9자리의 경우, 1,000,000 token = 1000000000000000 base unit입니다. 입금 금액은 quote token의 base unit(SOL의 경우 lamport)을 사용합니다.
---

{% callout title="이 문서에서 다루는 내용" %}
Genesis 토큰 출시를 위한 완전한 CLI 레퍼런스:
- **API 흐름**: Genesis API를 통해 단일 명령어로 출시를 생성하고 등록
- **수동 흐름**: Genesis 계정 생성, bucket 구성, 입금, 청구, 권한 폐기
{% /callout %}

## 요약

`mplx genesis` 명령어를 사용하면 터미널에서 전체 Genesis 토큰 출시를 실행할 수 있습니다 — 계정 생성, bucket 구성, 입금, 청구, 권한 폐기를 포함합니다.

- **도구**: Metaplex CLI(`mplx`)의 `genesis` 명령어 그룹
- **Bucket 유형**: Launch Pool(비례 배분), Presale(고정 가격), unlocked(재무)
- **Quote token(수동 흐름)**: 기본값은 Wrapped SOL이며, 모든 SPL token mint 주소 지원
- **Quote token(API 흐름)**: 현재 SOL 또는 USDC만 지원
- **되돌릴 수 없는 작업**: `finalize`와 `revoke`는 취소할 수 없습니다

## 범위 외

Genesis 스마트 컨트랙트 내부, SDK/TypeScript 통합, 프론트엔드 개발, 토큰 경제 설계, 출시 후 유동성 풀 설정.

**바로가기:** [사전 요구사항](#사전-요구사항) · [일반 흐름](#일반-흐름) · [명령어 레퍼런스](#명령어-레퍼런스) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq) · [용어집](#용어집)

*Metaplex Foundation 관리 · 최종 검증 2026년 2월 · Metaplex CLI(mplx) 필요*

## 사전 요구사항

- Metaplex CLI가 설치되어 `PATH`에 등록되어 있어야 합니다
- Solana 키페어 파일 (예: `~/.config/solana/id.json`)
- 트랜잭션 수수료를 위한 SOL
- `mplx config rpc add`로 구성하거나 `-r`로 전달하는 RPC 엔드포인트

설정을 확인하세요:

```bash {% title="CLI 확인" %}
mplx genesis --help
```

## 일반 흐름

Genesis CLI로 token을 출시하는 방법은 두 가지가 있습니다:

### API 흐름 (권장)

`genesis launch create`를 사용하면 Genesis API를 호출하고, 트랜잭션을 빌드하여 서명하고, Metaplex 플랫폼에 출시를 등록하는 올인원 흐름을 단일 명령어로 실행할 수 있습니다. API를 통해 생성된 출시는 [metaplex.com](https://metaplex.com)과 호환되며 공개 출시 페이지와 함께 플랫폼에 표시됩니다.

```bash {% title="단일 명령어 출시" %}
mplx genesis launch create \
  --name "My Token" --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

자세한 내용은 [Launch (API)](/ko/dev-tools/cli/genesis/launch)를 참조하세요.

### 수동 흐름

모든 단계를 완전히 제어하려면:

1. **생성** — `genesis create`로 Genesis 계정과 token mint를 설정합니다.
2. **Bucket 추가** — 하나 이상의 bucket을 추가하여 token 배포 방식을 정의합니다. 비례 배분에는 `bucket add-launch-pool`을, 고정 가격 판매에는 `bucket add-presale`을, 팀/재무 할당에는 `bucket add-unlocked`를 사용합니다.
3. **Finalize** — `genesis finalize`로 구성을 잠급니다. 이 단계 이후에는 더 이상 bucket을 추가할 수 없습니다.
4. **입금** — 사용자가 입금 기간 동안 `genesis deposit` 또는 `genesis presale deposit`을 사용하여 bucket에 quote token(예: Wrapped SOL)을 입금합니다.
5. **출금** (선택사항) — 입금 기간 동안 `genesis withdraw`로 Launch Pool에서 출금할 수 있습니다.
6. **전환** (선택사항) — Launch Pool에 종료 동작이 있는 경우, 입금 마감 후 `genesis transition`을 호출하여 수집된 token을 대상 bucket으로 전달합니다.
7. **청구** — 청구 기간이 시작된 후, 사용자는 `genesis claim` 또는 `genesis presale claim`으로 base token을 청구합니다. 재무 지갑은 `genesis claim-unlocked`를 사용합니다.
8. **폐기** (선택사항) — `genesis revoke`로 token의 mint 및/또는 freeze 권한을 영구적으로 폐기합니다.

수동 흐름을 사용했고 공개 출시 페이지를 원하는 경우, `genesis launch register`를 사용하여 Metaplex 플랫폼에 genesis 계정을 등록하세요.

`genesis fetch`와 `genesis bucket fetch`로 언제든지 출시 상태를 확인할 수 있습니다.

## 명령어 레퍼런스

| 명령어 | 설명 |
|---------|------|
| `genesis launch create` | Genesis API를 통한 출시 생성 및 등록 (올인원) |
| `genesis launch register` | 기존 genesis 계정을 Metaplex 플랫폼에 등록 |
| `genesis create` | 새 Genesis 계정 및 token 생성 |
| `genesis finalize` | 구성 잠금 및 출시 활성화 |
| `genesis fetch` | Genesis 계정 세부 정보 조회 |
| `genesis revoke` | mint/freeze 권한 폐기 |
| `genesis bucket add-launch-pool` | Launch Pool bucket 추가 |
| `genesis bucket add-presale` | Presale bucket 추가 |
| `genesis bucket add-unlocked` | unlocked(재무) bucket 추가 |
| `genesis bucket fetch` | 유형별 bucket 세부 정보 조회 |
| `genesis deposit` | Launch Pool에 입금 |
| `genesis withdraw` | Launch Pool에서 출금 |
| `genesis transition` | 입금 기간 후 종료 동작 실행 |
| `genesis claim` | Launch Pool에서 token 청구 |
| `genesis claim-unlocked` | unlocked bucket에서 청구 |
| `genesis presale deposit` | Presale bucket에 입금 |
| `genesis presale claim` | Presale bucket에서 token 청구 |

## 참고사항

- `totalSupply`와 `allocation`은 base unit으로 지정합니다 — 소수점 9자리의 경우, `1000000000000000` = 1,000,000 token
- 입금 및 출금 금액은 quote token의 base unit으로 지정합니다 (SOL의 경우 lamport, 1 SOL = 1,000,000,000 lamport)
- SOL을 quote token으로 사용하는 경우, 먼저 `mplx toolbox sol wrap <amount>`로 래핑하세요
- Finalize는 되돌릴 수 없습니다 — `genesis finalize`를 실행하기 전에 모든 bucket 구성을 다시 확인하세요
- 모든 명령어의 전체 플래그 문서는 `mplx genesis <command> --help`를 실행하세요
- 개념, 생명주기 세부 정보, SDK 가이드는 [Genesis 문서](/ko/smart-contracts/genesis)를 참조하세요

## 일반적인 오류

| 오류 | 원인 | 해결 방법 |
|------|------|-----------|
| Account not found | 잘못된 Genesis 주소 또는 잘못된 네트워크 | 주소를 확인하고 `mplx config rpc list`로 RPC 엔드포인트를 점검하세요 |
| Genesis already finalized | `finalize` 후에 bucket을 추가하려고 시도 | Finalize는 되돌릴 수 없습니다 — 구성이 잘못된 경우 새 Genesis 계정을 생성하세요 |
| Allocation exceeds total supply | bucket 할당량의 합이 `totalSupply`를 초과 | 할당량의 합이 `totalSupply` 이하가 되도록 줄이세요 |
| Deposit period not active | 입금 기간 외에 입금 시도 | `genesis bucket fetch`로 타임스탬프를 확인하세요 — `depositStart`와 `depositEnd` 사이에만 입금 가능 |
| Claim period not active | 청구 기간 시작 전에 청구 시도 | `claimStart` 타임스탬프 이후까지 기다리세요 |
| Insufficient funds | 지갑에 SOL 또는 quote token이 부족 | 지갑에 자금을 충전하고 필요시 `mplx toolbox sol wrap`으로 SOL을 래핑하세요 |
| No wrapped SOL | 래핑되지 않은 SOL로 입금 시도 | 먼저 SOL을 래핑하세요: `mplx toolbox sol wrap <amount>` |

## FAQ

**mplx genesis 명령어란 무엇인가요?**
`mplx genesis` 명령어 그룹을 사용하면 터미널에서 전체 Genesis 토큰 출시를 실행할 수 있습니다 — 계정 생성, bucket 구성, 입금, 청구, 권한 폐기를 포함합니다.

**Genesis의 다양한 bucket 유형은 무엇인가요?**
Genesis에는 세 가지 bucket 유형이 있습니다: **Launch Pool**(입금에 기반한 비례 배분), **Presale**(고정 가격 token 판매), **unlocked**(직접 청구할 수 있는 팀/재무 할당).

**입금 전에 SOL을 래핑해야 하나요?**
네. SOL을 quote token으로 사용하는 경우, 어떤 bucket에 입금하기 전에 먼저 `mplx toolbox sol wrap <amount>`로 래핑해야 합니다.

**Finalize를 취소할 수 있나요?**
아니요. Finalize는 되돌릴 수 없습니다. Finalize 후에는 더 이상 bucket을 추가할 수 없으며 구성이 잠깁니다. `genesis finalize`를 실행하기 전에 모든 것을 다시 확인하세요.

**token 수량은 어떻게 지정하나요?**
모든 수량은 base unit으로 지정합니다. 소수점 9자리의 경우, 1,000,000 token = `1000000000000000` base unit입니다. 입금 금액은 quote token의 base unit(SOL의 경우 lamport, 1 SOL = 1,000,000,000 lamport)을 사용합니다.

**같은 유형의 bucket을 여러 개 만들 수 있나요?**
네. `--bucketIndex` 플래그를 사용하여 같은 유형의 각 bucket에 다른 인덱스를 지정하세요.

## 용어집

| 용어 | 정의 |
|------|------|
| **Genesis Account** | 전체 token 출시를 관리하는 PDA — 구성, bucket 참조, mint 권한을 보유 |
| **Bucket** | Genesis 출시 내에서 token의 일부가 할당되고 배포되는 방식을 정의하는 배포 채널 |
| **Launch Pool** | 입금 기간 동안 예치금을 수집하고 입금자에게 비례적으로 token을 배포하는 bucket 유형 |
| **Presale** | `quoteCap / allocation`으로 결정된 고정 가격으로 token을 판매하는 bucket 유형 |
| **Unlocked Bucket** | 팀/재무를 위한 bucket 유형 — 지정된 수령인이 token 또는 전달된 quote token을 직접 청구 가능 |
| **Quote Token** | base token과 교환하여 사용자가 입금하는 token (보통 Wrapped SOL) |
| **Base Token** | 출시되어 입금자에게 배포되는 token |
| **Base Units** | token의 최소 단위 — 소수점 9자리의 경우, 1 token = 1,000,000,000 base unit |
| **End Behavior** | 입금 기간 후 Launch Pool에서 수집된 quote token을 대상 bucket으로 전달하는 규칙 |
| **Finalize** | Genesis 구성을 잠그고 출시를 활성화하는 되돌릴 수 없는 작업 |
| **Claim Schedule** | 청구 기간이 시작된 후 시간에 따라 token이 어떻게 릴리스되는지 제어하는 베스팅 규칙 |
| **Allocation** | 특정 bucket에 할당된 base token의 양, base unit으로 지정 |
