---
title: 입금
metaTitle: MPL-Distro 입금 | Metaplex CLI
description: mplx distro deposit로 SPL 토큰을 MPL-Distro 볼트에 입금합니다.
keywords:
  - mplx distro deposit
  - fund token distribution
  - MPL-Distro CLI
  - Metaplex CLI
about:
  - MPL-Distro
  - Metaplex CLI
  - token distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '08-27-2026'
updated: '08-27-2026'
howToSteps:
  - distro create가 출력한 배포 주소를 전달한다
  - mint decimals의 --amount 또는 최소 단위의 --basisAmount를 고른다
  - 명령어 출력에서 새 볼트 합계를 확인한다
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: 입금하려면 클레임 창이 활성이어야 하나요?
    a: 아니요. 입금은 클레임 창 전, 중, 후 모두 가능합니다.
  - q: --amount와 --basisAmount의 차이는 무엇인가요?
    a: --amount는 mint decimals를 쓰는 소수입니다(1.0이 한 토큰). --basisAmount는 원시 최소 단위입니다(decimals가 6이면 1_000_000이 한 토큰).
---

{% callout title="수행할 작업" %}
지갑에서 [MPL-Distro](/ko/smart-contracts/mpl-distro) 볼트로 SPL 토큰을 옮깁니다.
- 사람이 읽는 수량 또는 원시 최소 단위로 입금
- 배포의 새 `totalAmount` 확인
{% /callout %}

## 요약

`mplx distro deposit` 명령어는 현재 identity의 associated token account에서 배포 볼트로 토큰을 전송합니다.

- **필수 인자**: 배포 공개키
- **필수 플래그**: `--amount` 또는 `--basisAmount`(상호 배타)
- **입금은 시간 제한이 없음**: 클레임 창이 활성일 필요 없음

identity는 충분한 토큰을 보유해야 합니다. 명령어는 `--amount` 변환을 위해 mint decimals를 가져옵니다.

**바로가기:** [기본 사용법](#기본-사용법) · [옵션](#옵션) · [예시](#예시) · [출력](#출력) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq)

## 기본 사용법

배포 주소와 수량 플래그 하나를 전달합니다.

```bash {% title="1.0 토큰 입금" %}
mplx distro deposit <DISTRIBUTION> --amount 1.0
```

```bash {% title="1,000,000 최소 단위 입금" %}
mplx distro deposit <DISTRIBUTION> --basisAmount 1000000
```

## 옵션

`--amount` 또는 `--basisAmount` 중 정확히 하나를 설정합니다.

| 플래그 | 단축 | 설명 | 필수 |
|------|-------|-------------|----------|
| `--amount <number>` | `-a` | mint decimals를 쓰는 사람 가독 수량 | 둘 중 하나 |
| `--basisAmount <integer>` | `-b` | 토큰 최소 단위 수량 | 둘 중 하나 |

decimals가 6인 mint에서 `--amount 1.0`과 `--basisAmount 1000000`은 같은 수량입니다.

## 예시

[`distro create`](/ko/dev-tools/cli/distro/create) 이후 입금합니다.

```bash {% title="새 배포에 자금 투입" %}
mplx distro deposit <DISTRIBUTION> --amount 1.0
```

## 출력

성공 시 명령어는 소수와 최소 단위 수량을 출력합니다.

```text {% title="예상 출력" %}
Deposited 1 tokens (1000000 basis) to distribution
Distribution: <DISTRIBUTION>
Mint: <TOKEN_MINT>
Amount deposited: 1 tokens (1000000 basis)
New total deposited: 1 tokens (1000000 basis)

Transaction: <SIGNATURE>
```

decimals를 반영한 합계에는 이 출력을 쓰세요. mint를 가져올 수 있으면 [`distro fetch`](/ko/dev-tools/cli/distro/fetch)도 같은 토큰 수량을 출력합니다.

## 일반적인 오류

볼트에 자금을 넣을 수 없을 때 발생하는 실패입니다.

| 오류 | 원인 | 해결 |
|-------|-------|-----|
| Either `--amount` or `--basisAmount` must be provided | 수량 플래그가 둘 다 없음 | 두 플래그 중 하나를 전달 |
| Insufficient balance | identity ATA 토큰이 요청보다 적음 | 먼저 민트 또는 전송 |
| You do not have a token account for this mint | 이 mint의 ATA가 없음 | 먼저 토큰을 받거나 민트 |
| `InvalidPublicKeyError` | 배포 인자가 base58 공개키가 아님 | `distro create`가 출력한 PDA 전달 |
| Distribution not found | PDA 또는 클러스터가 다름 | 같은 RPC에서 `distro fetch` 실행 |

## 참고사항

deposit는 볼트가 Merkle 할당 합계를 커버하는지 검사하지 않습니다.

- 클레임이 시작되기 전에 트리의 모든 `amount` 합 이상을 입금하세요. [자금 투입과 회수](/ko/smart-contracts/mpl-distro/funding-and-recovery)를 참조하세요.
- 입금은 클레임 창 전, 중, 후 모두 가능합니다.
- 토큰 mint는 [`toolbox token create`](/ko/dev-tools/cli/toolbox/token-create)로 만들고 공급은 [`toolbox token mint`](/ko/dev-tools/cli/toolbox/token-mint)로 추가하세요(`mint` 수량은 원시 최소 단위).

## FAQ

**입금하려면 클레임 창이 활성이어야 하나요?**
아니요. 입금은 클레임 창 전, 중, 후 모두 가능합니다.

**--amount와 --basisAmount의 차이는 무엇인가요?**
`--amount`는 mint decimals를 쓰는 소수입니다(`1.0`이 한 토큰). `--basisAmount`는 원시 최소 단위입니다(decimals가 6이면 `1000000`이 한 토큰).
