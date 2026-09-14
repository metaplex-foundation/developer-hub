---
title: 자금 투입과 회수
metaTitle: MPL-Distro 토큰 배포에 자금을 넣고 회수하기
description: 배포 토큰을 입금하고, 클레임 영수증 보조금에 자금을 넣으며, 사용하지 않은 MPL-Distro 잔액을 회수합니다.
keywords:
  - fund MPL-Distro
  - withdraw unclaimed tokens
  - claim receipt subsidy
  - token distribution vault
about:
  - MPL-Distro
  - Distribution Funding
  - Fund Recovery
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-26-2026'
howToSteps:
  - 전체 토큰 할당을 계산하고 입금합니다.
  - 선택적으로 영수증 임대료 보조금을 위해 배포 PDA에 자금을 넣습니다.
  - 클레임 중 토큰과 SOL 잔액을 모니터링합니다.
  - 활성 창 밖에서 사용하지 않은 토큰과 보조금 SOL을 회수합니다.
howToTools:
  - MPL-Distro JavaScript SDK 0.4.x
  - Umi
faqs:
  - q: 클레임이 활성일 때 권한자가 토큰을 출금할 수 있나요?
    a: 아니요. 토큰 출금은 시작 타임스탬프부터 종료 타임스탬프까지(양끝 포함) 거부됩니다.
  - q: subsidizeReceipts는 어떤 비용을 환급하나요?
    a: 클레임 영수증 임대료만 환급합니다. 프로토콜 수수료, 트랜잭션 수수료, 수신자 토큰 계정 임대료는 대상이 아닙니다.
  - q: 클레임이 시작된 뒤 토큰을 더 입금할 수 있나요?
    a: 예. 입금에는 시간 제한이 없으므로 권한자가 자금 부족 볼트를 보충할 수 있습니다.
  - q: 배포 권한자 없이 재무 지갑이 입금할 수 있나요?
    a: 아니요. 별도 입금자가 토큰을 공급하더라도 현재 권한자가 deposit에 서명해야 합니다.
---

[MPL-Distro](/ko/smart-contracts/mpl-distro)는 배포 볼트의 토큰 자금과 클레임 영수증 임대료용 선택 SOL 자금을 분리합니다. {% .lead %}

## 요약

권한자는 SPL 토큰을 배포의 associated token account에 입금하고, 영수증 보조금이 켜져 있으면 배포 PDA에 SOL을 넣을 수 있습니다.

- 모든 Merkle 할당을 커버할 충분한 토큰 기본 단위를 입금합니다.
- 성공이 예상되는 클레임마다 클레임 영수증 임대료 한 번을 예산합니다.
- 기록된 `totalAmount`와 실제 볼트 토큰 잔액 모두를 모니터링합니다.
- 배포가 비활성일 때만 미클레임 토큰과 사용하지 않은 보조금 SOL을 출금합니다.

## 빠른 시작

MPL-Distro 자금 투입과 회수는 네 개의 운영 단계를 따릅니다.

1. 모든 할당량을 합산하고 그 토큰 기본 단위를 입금합니다.
2. 영수증 보조금이 켜져 있으면 예상 영수증 임대료 예산을 배포 PDA로 전송합니다.
3. 실제 볼트 잔액, 배포 SOL, 클레임 합계를 모니터링합니다.
4. 창이 끝난 뒤 미클레임 토큰과 사용하지 않은 보조금 SOL을 출금합니다.

## 배포 토큰 입금

`deposit` 명령은 입금자 계정에서 배포 PDA의 정규 associated token account로 토큰을 전송합니다. 다른 지갑이 토큰을 공급하더라도 현재 배포 권한자가 모든 입금에 서명해야 합니다.

{% code-tabs-imported from="mpl-distro/fund_distribution" frameworks="umi" filename="fundDistribution" /%}

SDK는 `depositor`, `payer`, `authority`를 Umi 지불자로 기본 설정하고 양쪽 associated token account를 유도합니다. 다른 지갑이 원본 토큰을 소유하면 별도 입금자 서명자를 전달하고, 현재 배포 권한자도 전달하세요.

{% code-tabs-imported from="mpl-distro/deposit_from_separate_wallet" frameworks="umi" filename="depositFromSeparateWallet" /%}

프로그램은 각 입금 후 `totalAmount`를 늘립니다. Merkle 루트가 커밋한 할당의 합과는 비교하지 않습니다.

## 토큰 입금액 계산

필요한 토큰 입금은 mint의 기본 단위로 표현한 모든 할당량의 합입니다.

{% code-tabs-imported from="mpl-distro/calculate_deposit" frameworks="umi" filename="calculateDeposit" /%}

의도적 버퍼를 입금하는 것은 권한자가 나중에 나머지를 회수해야 함을 받아들일 때만입니다. 기록 잔액이 할당보다 적으면 유효한 증명이 `InsufficientFunds`로 실패하고, 실제 볼트 잔액이 더 낮으면 SPL 전송도 실패할 수 있습니다.

## 클레임 영수증 보조금에 자금 투입

영수증 보조금은 각 클레임 영수증 생성에 쓴 임대료를 배포 PDA가 트랜잭션 지불자에게 환급할 수 있게 합니다.

`createDistribution` 중에 `subsidizeReceipts`를 켜고, RPC로 임대료를 계산한 뒤, SOL을 배포 PDA로 직접 전송합니다.

{% code-tabs-imported from="mpl-distro/fund_receipt_subsidy" frameworks="umi" filename="fundReceiptSubsidy" /%}

{% callout title="보조금 예산 경계" type="warning" %}
배포는 자신의 rent-exempt 최소액을 유지해야 합니다. 남은 SOL이 배포 임대료와 영수증 환급 한 번을 모두 커버하지 못하면 클레임이 `InsufficientFundsToSubsidizeReceipts`로 실패합니다.
{% /callout %}

## MPL-Distro 자금 투입 빠른 참조

클레임 비용은 고정 프로토콜 수수료, Solana 트랜잭션 비용, 계정 임대료로 나뉩니다.

| 비용 | 기본 지불자 | 영수증 보조금이 커버하는지 |
|---|---|---|
| 프로토콜 수수료({% fee product="mpl-distro" config="claim" fee="protocolFee" /%}) | 클레임 트랜잭션 지불자 | 아니요 |
| 트랜잭션 수수료 | 클레임 트랜잭션 지불자 | 아니요 |
| 클레임 영수증 임대료 | 클레임 트랜잭션 지불자 | 예(켜져 있고 자금이 있을 때) |
| 수신자 ATA 임대료 | 클레임 트랜잭션 지불자 | 아니요 |

## 미클레임 토큰 회수

배포 권한자는 시작 시각 이전 또는 종료 시각 이후에 `withdraw`로 미클레임 또는 여분 토큰을 회수합니다.

{% code-tabs-imported from="mpl-distro/recover_funds" frameworks="umi" filename="recoverFunds" /%}

활성 구간은 포함적입니다. `startTime <= clusterTime <= endTime`일 때 출금은 거부됩니다.

## 사용하지 않은 보조금 SOL 회수

권한자는 보조금이 켜져 있고 배포가 비활성일 때만 `withdrawSubsidy`로 사용하지 않은 영수증 보조금을 회수합니다.

`withdrawSubsidy`는 요청된 lamport 금액을 전송하면서 배포 계정의 rent-exempt 최소액을 유지합니다. 예상 클레임이 모두 일어났다고 가정하지 말고 현재 계정 잔액에서 안전한 금액을 정하세요.

## 배포 잔액 모니터링

프로덕션 시스템은 프로그램 장부와 실제 SPL / SOL 계정 잔액을 비교해야 합니다.

| 값 | 출처 | 의미 |
|---|---|---|
| `distribution.totalAmount` | 배포 계정 | 프로그램이 기록한 입금 마이너스 출금. 클레임은 줄이지 않음 |
| Vault token amount | 배포 associated token account | 실제로 전송 가능한 토큰 |
| Distribution lamports | 배포 PDA 계정 | 임대료 준비금과 선택적 미사용 영수증 보조금 |
| `claimCount` | 배포 계정 | 기록된 성공 클레임 수 |
| `claimAmount` | 배포 계정 | 기록된 클레임 토큰 기본 단위의 합 |

토큰 출금 장부는 saturating subtraction을 쓰므로, 연동 측은 `totalAmount`가 SPL 볼트 잔액과 절대 어긋나지 않는다고 가정하지 마세요.

## 참고사항

자금 작업에는 권한자 제어와 명시적 잔액 모니터링이 필요합니다.

- 현재 배포 권한자만 입금을 승인할 수 있습니다.
- 입금은 클레임 창의 전, 중, 후에 가능합니다.
- 토큰과 보조금 출금은 활성 창 동안 차단됩니다.
- 누구나 배포 PDA로 SOL을 직접 보낼 수 있지만, 프로그램을 통해 보조금을 출금할 수 있는 것은 권한자뿐입니다.
- 클레임 영수증은 현재 닫을 수 없으므로 영수증 임대료는 할당된 채로 남습니다.

## FAQ

### 클레임이 활성일 때 권한자가 토큰을 출금할 수 있나요?

아니요. 토큰 출금은 시작 타임스탬프부터 종료 타임스탬프까지(양끝 포함) 거부됩니다.

### subsidizeReceipts는 어떤 비용을 환급하나요?

클레임 영수증 임대료만 환급합니다. 프로토콜 수수료, 트랜잭션 수수료, 수신자 토큰 계정 임대료는 대상이 아닙니다.

### 클레임이 시작된 뒤 토큰을 더 입금할 수 있나요?

예. 입금에는 시간 제한이 없으므로 권한자가 자금 부족 볼트를 보충할 수 있습니다.

### 배포 권한자 없이 재무 지갑이 입금할 수 있나요?

아니요. 별도 입금자가 토큰을 공급하더라도 현재 권한자가 `deposit`에 서명해야 합니다.
