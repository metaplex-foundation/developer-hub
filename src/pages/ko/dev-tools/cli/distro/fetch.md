---
title: 조회
metaTitle: MPL-Distro 배포 조회 | Metaplex CLI
description: mplx distro fetch로 온체인 MPL-Distro 상세를 조회합니다.
keywords:
  - mplx distro fetch
  - inspect token distribution
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
  - distro create가 출력한 배포 공개키를 전달한다
  - 상태, mint, Merkle 루트, 클레임 창을 확인한다
howToTools:
  - Metaplex CLI (mplx)
---

{% callout title="수행할 작업" %}
터미널에서 [MPL-Distro](/ko/smart-contracts/mpl-distro) 계정을 읽습니다.
- mint, Merkle 루트, 클레임 창, 접근 모드 확인
- 배포가 시작 전인지, 활성인지, 종료됐는지 확인
{% /callout %}

## 요약

`mplx distro fetch` 명령어는 배포 계정을 로드하고 구성을 출력합니다.

- **필수 인자**: 배포 공개키
- **선택 플래그**: 기계 가독 출력용 `--json`
- **상태**: 로컬 시계와 `startTime` / `endTime`으로 `Not Started`, `Active`, `Ended`

**바로가기:** [빠른 참조](#빠른-참조) · [사용법](#사용법) · [출력](#출력) · [참고사항](#참고사항)

## 빠른 참조

| 항목 | 값 |
|------|-------|
| **명령어** | `mplx distro fetch <DISTRIBUTION>` |
| **필수 인자** | base58 공개키인 배포 PDA |
| **선택 플래그** | `--json` |

## 사용법

배포 주소만 전달합니다.

```bash {% title="배포 조회" %}
mplx distro fetch <DISTRIBUTION>
```

```bash {% title="JSON 출력" %}
mplx distro fetch <DISTRIBUTION> --json
```

## 출력

사람이 읽는 출력은 identity, 수량, 창, 루트를 나열합니다.

```text {% title="예상 필드" %}
Distribution: <DISTRIBUTION>

Distribution Details:
  Name: Community Airdrop
  Authority: <WALLET>
  Mint: <TOKEN_MINT>
  Total Claimants: <n>
  Tree Height: <n>
  Distribution Type: Wallet | Legacy NFT
  Allowed Distributor: Permissionless | Recipient | Permissioned
  Total Amount: 1 tokens (1000000 basis)
  Claim Amount: 0 tokens (0 basis)
  Claim Count: <n>
  Subsidize Receipts: true | false
  Start Time: <ISO-8601>
  End Time: <ISO-8601>
  Status: Not Started | Active | Ended
  Merkle Root: <base58>
```

`Name`은 온체인에 저장된 UTF-8 문자열입니다(끝의 null 제거). 수량은 mint를 가져올 수 있으면 mint decimals를 쓰고, 아니면 `<n> basis`로 출력합니다. 온체인에 해당 모드가 설정되면 `Allowed Distributor`는 `Permissioned`를 출력하고 fetch는 `Permissioned Distributor`도 출력합니다. CLI는 `Permissioned` 배포를 만들 수 없으므로 이 필드는 SDK로 만든 계정에만 나타납니다.

## 참고사항

fetch는 읽기 전용 명령어입니다. 온체인 상태를 바꾸지 않습니다.

- 상태는 로컬 시계를 쓰며 Solana 클러스터 시간이 아닙니다.
- mint 계정을 가져올 수 없으면 `Total Amount`와 `Claim Amount`는 원시 basis 단위로 돌아갑니다.
- [`distro create`](/ko/dev-tools/cli/distro/create)가 출력한 PDA를 전달하세요. 잘못된 주소는 `InvalidPublicKeyError`가 됩니다.
