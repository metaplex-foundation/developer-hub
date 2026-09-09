---
title: 출금
metaTitle: MPL-Distro 출금 | Metaplex CLI
description: 클레임 창이 비활성일 때 mplx distro withdraw로 미클레임 MPL-Distro 토큰을 출금합니다.
keywords:
  - mplx distro withdraw
  - recover unclaimed tokens
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
  - 배포가 Not Started 또는 Ended인지 확인한다
  - 배포 권한자로 --amount 또는 --basisAmount를 전달한다
  - 필요하면 --recipient로 다른 지갑에 보낸다
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: distro withdraw는 언제 성공하나요?
    a: 권한자는 startTime 이전 또는 endTime 이후에 출금할 수 있습니다. 클레임 창이 활성이면 프로그램이 출금을 거부합니다.
  - q: 누가 출금할 수 있나요?
    a: 배포 권한자만 가능합니다. CLI identity가 온체인 권한자와 일치해야 합니다.
---

{% callout title="수행할 작업" %}
볼트에서 [MPL-Distro](/ko/smart-contracts/mpl-distro) 토큰을 회수합니다.
- 클레임 창이 비활성일 때 배포 권한자로 출금
- 권한자 또는 `--recipient`로 토큰 전송
{% /callout %}

## 요약

`mplx distro withdraw` 명령어는 미클레임 토큰을 배포 볼트에서 수신자 associated token account로 전송합니다.

- **필수 인자**: 배포 공개키
- **필수 플래그**: `--amount` 또는 `--basisAmount`(상호 배타)
- **서명자**: 온체인 배포 권한자
- **창**: 클러스터 시간이 `startTime` 이전이거나 `endTime` 이후일 때만 성공

사용 가능 잔액은 `totalAmount - claimAmount`입니다. [자금 투입과 회수](/ko/smart-contracts/mpl-distro/funding-and-recovery)를 참조하세요.

**바로가기:** [기본 사용법](#기본-사용법) · [옵션](#옵션) · [예시](#예시) · [출력](#출력) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq)

## 기본 사용법

권한자 지갑으로 출금하거나 `--recipient`를 전달합니다.

```bash {% title="권한자에게 0.5 토큰 출금" %}
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

```bash {% title="최소 단위를 다른 지갑으로 출금" %}
mplx distro withdraw <DISTRIBUTION> \
  --basisAmount 500000 \
  --recipient <WALLET>
```

## 옵션

수량 플래그는 정확히 하나가 필요합니다. `--recipient` 기본값은 권한자입니다.

| 플래그 | 단축 | 설명 | 필수 |
|------|-------|-------------|----------|
| `--amount <number>` | `-a` | mint decimals를 쓰는 사람 가독 수량 | 둘 중 하나 |
| `--basisAmount <integer>` | `-b` | 토큰 최소 단위 수량 | 둘 중 하나 |
| `--recipient <string>` | `-r` | 대상 지갑(기본값은 권한자) | No |

decimals가 6인 mint에서 `--amount 0.5`와 `--basisAmount 500000`은 같은 수량입니다.

## 예시

창이 끝난 뒤 잔여분을 회수합니다.

```bash {% title="남은 볼트 토큰 회수" %}
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

## 출력

성공 시 명령어는 출금 수량과 남은 출금 가능 잔액을 출력합니다.

```text {% title="예상 출력" %}
Withdrew 0.5 tokens (500000 basis) from distribution
Distribution: <DISTRIBUTION>
Mint: <TOKEN_MINT>
Amount withdrawn: 0.5 tokens (500000 basis)
Recipient: <WALLET>
Remaining available for withdrawal: 0.5 tokens (500000 basis)

Transaction: <SIGNATURE>
```

## 일반적인 오류

볼트를 비울 수 없을 때 발생하는 실패입니다.

| 오류 | 원인 | 해결 |
|-------|-------|-----|
| Only the distribution authority can withdraw | CLI identity가 권한자가 아님 | 권한자 키페어로 전환 |
| Insufficient available balance for withdrawal | 수량이 `totalAmount - claimAmount`를 초과함 | 수량을 낮춤 |
| Distribution does not have a token account | 아직 입금하지 않음 | 먼저 입금하거나 출금 생략 |
| Withdrawal rejected during the active window | `startTime <= now <= endTime` | 시작 전 또는 종료 후까지 대기 |
| `InvalidPublicKeyError` | 배포 인자가 base58 공개키가 아님 | `distro create`가 출력한 PDA 전달 |

CLI는 시간 창을 미리 검사하지 않습니다. 프로그램이 거부를 반환합니다.

## 참고사항

withdraw가 회수하는 것은 토큰이며, 쓰이지 않은 영수증 임대 보조금이 아닙니다.

- CLI에 `withdrawSubsidy` 명령어는 없습니다. 보조금 SOL은 [JavaScript SDK](/ko/smart-contracts/mpl-distro/sdk/javascript)로 회수하세요.
- 클레임이 열리기 전에 출금을 시험하려면 미래의 `startTime`으로 배포를 만드세요.
- 클레임된 토큰은 출금할 수 없습니다.

## FAQ

**distro withdraw는 언제 성공하나요?**
권한자는 `startTime` 이전 또는 `endTime` 이후에 출금할 수 있습니다. 클레임 창이 활성이면 프로그램이 출금을 거부합니다.

**누가 출금할 수 있나요?**
배포 권한자만 가능합니다. CLI identity가 온체인 권한자와 일치해야 합니다.
