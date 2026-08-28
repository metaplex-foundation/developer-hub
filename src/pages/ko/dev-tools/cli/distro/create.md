---
title: 생성
metaTitle: MPL-Distro 배포 생성 | Metaplex CLI
description: mplx distro create로 지갑 또는 레거시 NFT MPL-Distro 배포를 생성합니다.
keywords:
  - mplx distro create
  - MPL-Distro CLI
  - Merkle airdrop create
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
  - prepareDistribution으로 base58 Merkle 루트를 생성한다
  - name, mint, claimant 수, ISO 창, 루트로 mplx distro create를 실행한다
  - 출력된 배포 공개키를 저장한다
howToTools:
  - Metaplex CLI (mplx)
  - MPL-Distro JavaScript SDK 0.4.x
faqs:
  - q: distro create가 Merkle 증명을 생성하나요?
    a: 아니요. prepareDistribution으로 이미 만든 32바이트 루트를 전달하세요. 증명은 오프체인에 저장해야 합니다.
  - q: merkleRoot 플래그 형식은 무엇인가요?
    a: 정확히 32바이트의 base58 인코딩입니다. 16진 문자열은 거부됩니다.
  - q: CLI로 permissioned distributor를 만들 수 있나요?
    a: 아니요. --allowedDistributor는 permissionless 또는 recipient만 받습니다.
---

{% callout title="수행할 작업" %}
터미널에서 [MPL-Distro](/ko/smart-contracts/mpl-distro) 계정을 생성합니다.
- Merkle 루트, 클레임 창, mint, 접근 모드를 온체인에 커밋
- 지갑 또는 레거시 NFT 할당 유형 선택
- 입금, 조회, 출금용 배포 PDA 저장
{% /callout %}

## 요약

`mplx distro create` 명령어는 기존 원본 SPL Token mint에 대한 [MPL-Distro](/ko/smart-contracts/mpl-distro) PDA를 초기화합니다.

- **필수**(`--wizard` 또는 `--distroConfig`가 아니면): `--name`, `--mint`, `--totalClaimants`, `--startTime`, `--endTime`, `--merkleRoot`
- **기본값**: `--distributionType wallet`, `--allowedDistributor permissionless`, `--subsidizeReceipts` 꺼짐
- **출력**: 배포 PDA(base58 공개키), mint, claimant 수, 유형, 타임스탬프, 트랜잭션 서명

게시된 `@metaplex-foundation/cli` 0.4.3은 아직 mpl-distro 0.3.x에 의존합니다. 0.4.x 클라이언트를 사용하세요. [CLI 개요](/ko/dev-tools/cli/distro)를 참조하세요.

**바로가기:** [기본 사용법](#기본-사용법) · [옵션](#옵션) · [JSON 설정 파일](#json-설정-파일) · [예시](#예시) · [출력](#출력) · [일반적인 오류](#일반적인-오류) · [FAQ](#faq)

## 기본 사용법

모든 필수 플래그를 전달하거나 마법사 / JSON 파일을 사용합니다.

```bash {% title="지갑 배포 생성" %}
mplx distro create \
  --name "Community Airdrop" \
  --mint <TOKEN_MINT> \
  --totalClaimants 1000 \
  --startTime "2026-09-01T00:00:00Z" \
  --endTime "2026-09-30T23:59:59Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT>
```

```bash {% title="마법사 모드" %}
mplx distro create --wizard
```

## 옵션

create는 플래그, JSON 파일, 대화형 마법사를 받습니다. `--wizard`와 `--distroConfig`는 개별 필수 플래그와 함께 쓸 수 없습니다.

| 플래그 | 단축 | 설명 | 필수 | 기본값 |
|------|-------|-------------|----------|---------|
| `--name <string>` | `-n` | 표시 이름, 최대 32바이트 | Yes* | |
| `--mint <string>` | `-m` | 기존 원본 SPL Token mint | Yes* | |
| `--totalClaimants <integer>` | `-t` | 트리 높이 계산에 쓰는 할당 수 | Yes* | |
| `--startTime <ISO-8601>` | | 클레임 창 시작(UTC 권장) | Yes* | |
| `--endTime <ISO-8601>` | | 클레임 창 종료. 시작보다 이후여야 함 | Yes* | |
| `--merkleRoot <string>` | | 32바이트 Merkle 루트, base58 인코딩 | Yes* | |
| `--distributionType <wallet\|legacy-nft>` | | 할당 identity 모델 | No | `wallet` |
| `--allowedDistributor <permissionless\|recipient>` | | 유효한 증명을 제출할 수 있는 주체 | No | `permissionless` |
| `--subsidizeReceipts` | | PDA의 여분 SOL로 클레임 영수증 임대료 지불 | No | `false` |
| `--distroConfig <path>` | | 같은 필드를 가진 JSON 파일 | No | |
| `--wizard` | | 대화형 프롬프트 | No | |

\*값이 `--wizard` 또는 `--distroConfig`로 제공되지 않으면 필수입니다.

`--merkleRoot`는 32바이트의 base58입니다(약 43–44자). [Merkle 루트 인코딩](/ko/dev-tools/cli/distro#merkle-루트-인코딩)처럼 `prepareDistribution`으로 인코딩하세요.

CLI는 `computeTreeHeight(totalClaimants)`로 `treeHeight`를 계산하고 무작위 seed 서명자를 생성합니다. seed는 출력하지 않습니다. `totalClaimants`는 메타데이터이며 성공 증명 수의 상한이 아닙니다.

## JSON 설정 파일

`--distroConfig`는 플래그와 같은 필드를 읽습니다.

```json {% title="distribution-config.json" %}
{
  "name": "Community Airdrop",
  "mint": "TokenMint111111111111111111111111111111111",
  "totalClaimants": 1000,
  "startTime": "2026-09-01T00:00:00Z",
  "endTime": "2026-09-30T23:59:59Z",
  "merkleRoot": "base58Encoded32ByteRoot",
  "distributionType": "wallet",
  "subsidizeReceipts": false,
  "allowedDistributor": "permissionless"
}
```

```bash {% title="JSON에서 생성" %}
mplx distro create --distroConfig ./distribution-config.json
```

플래그 이름은 `--distroConfig`이며 `--config`가 아닙니다.

## 예시

NFT 소유자만 제출할 수 있는 레거시 NFT 배포를 만듭니다.

```bash {% title="레거시 NFT, recipient만" %}
mplx distro create \
  --name "Holder Rewards" \
  --mint <REWARD_MINT> \
  --totalClaimants 500 \
  --startTime "2026-09-01T12:00:00Z" \
  --endTime "2026-09-15T12:00:00Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT> \
  --distributionType legacy-nft \
  --allowedDistributor recipient
```

## 출력

성공 시 명령어는 새 PDA와 트랜잭션을 출력합니다.

```text {% title="예상 출력" %}
Distribution created: <DISTRIBUTION_ADDRESS>
Name: Community Airdrop
Mint: <TOKEN_MINT>
Total Claimants: 1000
Distribution Type: Wallet
Start Time: 2026-09-01T00:00:00.000Z
End Time: 2026-09-30T23:59:59.000Z

Transaction: <SIGNATURE>
```

`--json`도 같은 PDA 문자열을 사용합니다.

```json {% title="JSON distribution 필드" %}
{
  "distribution": "<DISTRIBUTION_ADDRESS>"
}
```

그 주소를 `deposit`, `fetch`, `withdraw`에 전달하세요.

## 일반적인 오류

생성 시점에 발생하는 실패입니다.

| 오류 | 원인 | 해결 |
|-------|-------|-----|
| `BorshIoError` | CLI Distro 클라이언트가 0.3.x(게시된 0.4.3) | `@metaplex-foundation/mpl-distro@^0.4.0`에 의존 |
| Missing required flag: `--merkleRoot` | 플래그가 불완전하고 JSON/마법사도 없음 | 나머지 필수 플래그 전달 |
| Invalid mint owner | Token-2022 또는 mint가 아닌 계정 | 원본 SPL Token mint 사용 |
| Name too long | 이름이 32바이트를 초과함 | `--name`을 줄임 |
| Invalid distribution time range | `endTime`이 `startTime` 이후가 아님 | 더 늦은 종료 시각 사용 |

## 참고사항

create는 토큰을 입금하지 않고 증명도 저장하지 않습니다.

- 생성 후 [`distro deposit`](/ko/dev-tools/cli/distro/deposit)로 볼트에 자금을 넣으세요.
- `--subsidizeReceipts` 자체는 SOL을 전송하지 않습니다. 추가 lamports는 이미 배포 계정에 있어야 합니다. CLI에 보조금 입금 명령어는 없습니다.
- `Permissioned` distributor 모드는 SDK 전용입니다. [지갑 배포](/ko/smart-contracts/mpl-distro/wallet-distribution)를 참조하세요.

## FAQ

**distro create가 Merkle 증명을 생성하나요?**
아니요. `prepareDistribution`으로 이미 만든 32바이트 루트를 전달하세요. 증명은 오프체인에 저장해야 합니다. [프로덕션 전달](/ko/smart-contracts/mpl-distro/production-delivery)을 참조하세요.

**merkleRoot 플래그 형식은 무엇인가요?**
정확히 32바이트의 base58 인코딩입니다. 16진 문자열은 거부됩니다.

**CLI로 permissioned distributor를 만들 수 있나요?**
아니요. `--allowedDistributor`는 `permissionless` 또는 `recipient`만 받습니다.
